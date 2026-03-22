import { Prisma } from "@prisma/client";
import { prisma } from "@/shared/lib/db";
import { adminProjectsOrderBySql } from "@/features/admin/lib/adminProjectsOrderBySql";

export const ADMIN_PROJECTS_PAGE_SIZE = 20;

export type ProjectListRow = {
  id: string;
  slug: string;
  published: boolean;
  updatedAt: Date;
  expoFields: unknown;
  mediaFolderId: string | null;
  sortOrder: number;
};

/**
 * Սերվերի կողմից էջավորում + որոնում (slug, expo_field_02, expo_field_01)։
 */
export async function fetchProjectsPage(params: {
  page: number;
  q: string;
  published: "all" | "yes" | "no";
}): Promise<{
  rows: ProjectListRow[];
  total: number;
  page: number;
  pageSize: number;
}> {
  const pageSize = ADMIN_PROJECTS_PAGE_SIZE;
  const page = Math.max(1, Number.isFinite(params.page) ? Math.floor(params.page) : 1);
  const offset = (page - 1) * pageSize;
  const qTrim = params.q.trim();
  const qLike = qTrim ? `%${qTrim}%` : "";
  const pub =
    params.published === "yes" ? true : params.published === "no" ? false : null;

  const orderSql = adminProjectsOrderBySql();

  if (!qLike && pub === null) {
    const [total, rows] = await Promise.all([
      prisma.project.count(),
      prisma.$queryRaw<ProjectListRow[]>(
        Prisma.sql`
          SELECT id, slug, published, "updatedAt", "expoFields", "mediaFolderId", "sortOrder"
          FROM "Project"
          ${orderSql}
          LIMIT ${pageSize}
          OFFSET ${offset}
        `,
      ),
    ]);
    return { rows, total, page, pageSize };
  }

  const parts: Prisma.Sql[] = [];
  if (pub !== null) {
    parts.push(Prisma.sql`published = ${pub}`);
  }
  if (qLike) {
    parts.push(
      Prisma.sql`(slug ILIKE ${qLike} OR COALESCE("mediaFolderId",'') ILIKE ${qLike} OR COALESCE("expoFields"->>'expo_field_02','') ILIKE ${qLike} OR COALESCE("expoFields"->>'expo_field_01','') ILIKE ${qLike})`,
    );
  }
  const whereSql = Prisma.sql`WHERE ${Prisma.join(parts, " AND ")}`;

  const countRes = await prisma.$queryRaw<[{ n: bigint }]>(
    Prisma.sql`SELECT COUNT(*)::bigint AS n FROM "Project" ${whereSql}`,
  );
  const total = Number(countRes[0].n);

  const rowsRaw = await prisma.$queryRaw<ProjectListRow[]>(
    Prisma.sql`
      SELECT id, slug, published, "updatedAt", "expoFields", "mediaFolderId", "sortOrder"
      FROM "Project"
      ${whereSql}
      ${orderSql}
      LIMIT ${pageSize}
      OFFSET ${offset}
    `,
  );

  return { rows: rowsRaw, total, page, pageSize };
}
