/**
 * `NEXT_PUBLIC_ASSET_BASE_URL` դատարկ է dev-ում — վերադարձնում է նույն `/figma/...` ճանապարհը `public/`-ից։
 * Prod-ում R2-ի հանրային base — URL-ը դառնում է `{base}/static/figma/...` (տե՛ս sync սկրիպտը)։
 */
export function publicAssetUrl(pathFromPublicRoot: string): string {
  const base = process.env.NEXT_PUBLIC_ASSET_BASE_URL?.trim().replace(/\/$/, "") ?? "";
  const path = pathFromPublicRoot.startsWith("/") ? pathFromPublicRoot : `/${pathFromPublicRoot}`;
  if (!base || !path.startsWith("/figma/")) {
    return path;
  }
  return `${base}/static${path}`;
}
