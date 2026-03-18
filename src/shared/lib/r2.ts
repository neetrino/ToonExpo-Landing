import {
  PutObjectCommand,
  S3Client,
  type PutObjectCommandInput,
} from "@aws-sdk/client-s3";
import { logger } from "@/shared/lib/logger";

function getR2Client(): S3Client | null {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  if (!accountId || !accessKeyId || !secretAccessKey) {
    return null;
  }
  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });
}

export type UploadToR2Params = {
  key: string;
  body: Buffer;
  contentType: string;
};

/**
 * Բեռնում է օբյեկտ R2 — եթե env-ը բացակայում է, վերադարձնում է null
 */
export async function uploadToR2(params: UploadToR2Params): Promise<string | null> {
  const bucket = process.env.R2_BUCKET_NAME;
  const publicUrl = process.env.R2_PUBLIC_URL?.replace(/\/$/, "");
  const client = getR2Client();
  if (!client || !bucket || !publicUrl) {
    logger.warn("R2 not configured, skip upload");
    return null;
  }
  const input: PutObjectCommandInput = {
    Bucket: bucket,
    Key: params.key,
    Body: params.body,
    ContentType: params.contentType,
  };
  try {
    await client.send(new PutObjectCommand(input));
    return `${publicUrl}/${params.key}`;
  } catch (e) {
    logger.error("R2 upload failed", { error: String(e) });
    return null;
  }
}

export function isR2Configured(): boolean {
  return Boolean(
    process.env.R2_ACCOUNT_ID &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY &&
      process.env.R2_BUCKET_NAME &&
      process.env.R2_PUBLIC_URL,
  );
}
