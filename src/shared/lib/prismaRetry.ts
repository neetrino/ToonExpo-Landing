import { logger } from "@/shared/lib/logger";

const TRANSIENT_PRISMA_CODES = new Set(["P1001", "P1002", "P1008", "P1017"]);
const TRANSIENT_MESSAGE_RE =
  /(can't reach database server|timed out|connection.+closed|kind:\s*closed|econnreset|econnrefused|etimedout|enotfound)/i;

const DEFAULT_ATTEMPTS = 3;
const DEFAULT_BASE_DELAY_MS = 250;
const DEFAULT_MAX_DELAY_MS = 1200;

export type PrismaRetryOptions = {
  operation: string;
  attempts?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function readErrorCode(error: unknown): string | null {
  if (!error || typeof error !== "object") {
    return null;
  }
  const code = Reflect.get(error, "code");
  return typeof code === "string" ? code : null;
}

function readErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

function isTransientPrismaError(error: unknown): boolean {
  const code = readErrorCode(error);
  if (code && TRANSIENT_PRISMA_CODES.has(code)) {
    return true;
  }
  return TRANSIENT_MESSAGE_RE.test(readErrorMessage(error));
}

/**
 * Retry wrapper for transient Prisma connectivity errors in server runtime.
 */
export async function withPrismaRetry<T>(
  runner: () => Promise<T>,
  options: PrismaRetryOptions,
): Promise<T> {
  const attempts = Math.max(1, options.attempts ?? DEFAULT_ATTEMPTS);
  const baseDelayMs = Math.max(1, options.baseDelayMs ?? DEFAULT_BASE_DELAY_MS);
  const maxDelayMs = Math.max(baseDelayMs, options.maxDelayMs ?? DEFAULT_MAX_DELAY_MS);

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await runner();
    } catch (error) {
      const isRetryable = isTransientPrismaError(error);
      if (!isRetryable || attempt >= attempts) {
        throw error;
      }

      const delayMs = Math.min(baseDelayMs * 2 ** (attempt - 1), maxDelayMs);
      logger.warn("Transient Prisma error, retrying query", {
        operation: options.operation,
        attempt,
        attempts,
        delayMs,
        code: readErrorCode(error),
        message: readErrorMessage(error),
      });
      await sleep(delayMs);
    }
  }

  throw new Error(`Unexpected retry flow for operation: ${options.operation}`);
}
