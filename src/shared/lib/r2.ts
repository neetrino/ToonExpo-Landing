import {
  DeleteObjectCommand,
  ListObjectsV2Command,
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

/**
 * Բոլոր object key-երը `prefix`-ով (R2 / S3 ListObjectsV2)։
 */
export async function listR2ObjectKeysUnderPrefix(prefix: string): Promise<string[]> {
  const client = getR2Client();
  const bucket = process.env.R2_BUCKET_NAME;
  if (!client || !bucket) {
    return [];
  }
  const keys: string[] = [];
  let continuationToken: string | undefined;
  try {
    do {
      const res = await client.send(
        new ListObjectsV2Command({
          Bucket: bucket,
          Prefix: prefix,
          ContinuationToken: continuationToken,
        }),
      );
      for (const obj of res.Contents ?? []) {
        if (obj.Key) {
          keys.push(obj.Key);
        }
      }
      continuationToken = res.IsTruncated ? res.NextContinuationToken : undefined;
    } while (continuationToken);
  } catch (e) {
    logger.error("R2 listObjects failed", { error: String(e), prefix });
    return [];
  }
  return keys;
}

export type ListR2LevelResult = {
  /** Ամբողջական նախածանցեր `CommonPrefixes` (օր. `projects/1/Exterior/`) */
  commonPrefixes: string[];
  /** Այս մակարդակի օբյեկտների ամբողջական key-եր */
  objectKeys: string[];
};

/**
 * ListObjectsV2 `Delimiter: /` — մեկ «պանակի» մակարդակ, առանց բոլոր ներքին ֆայլերը միանգամից բեռնելու։
 */
export async function listR2ObjectsAtLevel(prefix: string): Promise<ListR2LevelResult> {
  const client = getR2Client();
  const bucket = process.env.R2_BUCKET_NAME;
  if (!client || !bucket) {
    return { commonPrefixes: [], objectKeys: [] };
  }
  const normalized = prefix.endsWith("/") ? prefix : `${prefix}/`;
  const commonPrefixes: string[] = [];
  const objectKeys: string[] = [];
  let continuationToken: string | undefined;
  try {
    do {
      const res = await client.send(
        new ListObjectsV2Command({
          Bucket: bucket,
          Prefix: normalized,
          Delimiter: "/",
          ContinuationToken: continuationToken,
        }),
      );
      for (const cp of res.CommonPrefixes ?? []) {
        if (cp.Prefix) {
          commonPrefixes.push(cp.Prefix);
        }
      }
      for (const obj of res.Contents ?? []) {
        if (obj.Key && obj.Key !== normalized) {
          objectKeys.push(obj.Key);
        }
      }
      continuationToken = res.IsTruncated ? res.NextContinuationToken : undefined;
    } while (continuationToken);
  } catch (e) {
    logger.error("R2 listObjectsAtLevel failed", { error: String(e), prefix: normalized });
    return { commonPrefixes: [], objectKeys: [] };
  }
  return { commonPrefixes, objectKeys };
}

/**
 * Ջնջում է մեկ օբյեկտ bucket-ում — սխալի դեպքում false։
 */
export async function deleteObjectFromR2(key: string): Promise<boolean> {
  const client = getR2Client();
  const bucket = process.env.R2_BUCKET_NAME;
  if (!client || !bucket || !key?.trim()) {
    return false;
  }
  try {
    await client.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: key,
      }),
    );
    return true;
  } catch (e) {
    logger.error("R2 deleteObject failed", { error: String(e), key });
    return false;
  }
}
