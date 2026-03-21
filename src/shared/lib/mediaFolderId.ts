/**
 * CSV Project ID → `public/project/{id}/` պանակի անուն (path traversal-ի դեմ)։
 */
export function sanitizeMediaFolderId(raw: string | null | undefined): string | null {
  const s = raw?.trim();
  if (!s || s.length > 120) {
    return null;
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(s)) {
    return null;
  }
  return s;
}
