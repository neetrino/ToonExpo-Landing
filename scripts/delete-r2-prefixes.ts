/**
 * Удаляет все объекты R2 под заданными префиксами (S3 DeleteObjects).
 * Запуск: `pnpm exec tsx --tsconfig tsconfig.json scripts/delete-r2-prefixes.ts`
 * Префиксы по умолчанию: лишние `Projects/`, `project/` (не путать с рабочим `projects/`).
 */
import {
  DeleteObjectsCommand,
  ListObjectsV2Command,
  S3Client,
} from "@aws-sdk/client-s3";
import { loadEnvFile } from "./loadEnvFile";

const DEFAULT_PREFIXES = ["Projects/", "project/"] as const;
const BATCH = 1000;

function getClient(): { client: S3Client; bucket: string } | null {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucket = process.env.R2_BUCKET_NAME;
  if (!accountId || !accessKeyId || !secretAccessKey || !bucket) {
    return null;
  }
  const client = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });
  return { client, bucket };
}

async function listAllKeys(
  client: S3Client,
  bucket: string,
  prefix: string,
): Promise<string[]> {
  const keys: string[] = [];
  let continuationToken: string | undefined;
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
  return keys;
}

async function deleteKeys(
  client: S3Client,
  bucket: string,
  keys: string[],
): Promise<void> {
  for (let i = 0; i < keys.length; i += BATCH) {
    const chunk = keys.slice(i, i + BATCH);
    await client.send(
      new DeleteObjectsCommand({
        Bucket: bucket,
        Delete: { Objects: chunk.map((Key) => ({ Key })), Quiet: true },
      }),
    );
  }
}

async function main(): Promise<void> {
  loadEnvFile();
  const cfg = getClient();
  if (!cfg) {
    console.error(
      "R2: задайте в .env R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME",
    );
    process.exit(1);
  }
  const prefixes =
    process.argv.slice(2).length > 0 ? process.argv.slice(2) : [...DEFAULT_PREFIXES];

  const { client, bucket } = cfg;
  for (const prefix of prefixes) {
    const keys = await listAllKeys(client, bucket, prefix);
    if (keys.length === 0) {
      console.log(`[${prefix}] объектов нет`);
      continue;
    }
    await deleteKeys(client, bucket, keys);
    console.log(`[${prefix}] удалено объектов: ${keys.length}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
