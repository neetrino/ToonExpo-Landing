-- Neon (или другая БД) могла остаться с колонкой `projectPublicId` после отката ветки.
-- Текущая схема: только `mediaFolderId`. Переносим значения и удаляем старое поле.
-- Если `projectPublicId` уже нет (чистая миграция с init + add_media_folder_id), шаг пропускается.

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'Project'
      AND column_name = 'projectPublicId'
  ) THEN
    IF NOT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'Project'
        AND column_name = 'mediaFolderId'
    ) THEN
      ALTER TABLE "Project" ADD COLUMN "mediaFolderId" TEXT;
    END IF;

    UPDATE "Project"
    SET "mediaFolderId" = COALESCE("mediaFolderId", "projectPublicId")
    WHERE "projectPublicId" IS NOT NULL;

    DROP INDEX IF EXISTS "Project_projectPublicId_key";

    ALTER TABLE "Project" DROP COLUMN "projectPublicId";
  END IF;
END $$;
