type LogPayload = Record<string, unknown>;

function log(level: "info" | "warn" | "error", msg: string, meta?: LogPayload): void {
  const line = meta ? `${msg} ${JSON.stringify(meta)}` : msg;
  if (level === "error") {
    console.error(line);
  } else if (level === "warn") {
    console.warn(line);
  } else {
    console.info(line);
  }
}

export const logger = {
  info: (msg: string, meta?: LogPayload) => log("info", msg, meta),
  warn: (msg: string, meta?: LogPayload) => log("warn", msg, meta),
  error: (msg: string, meta?: LogPayload) => log("error", msg, meta),
};
