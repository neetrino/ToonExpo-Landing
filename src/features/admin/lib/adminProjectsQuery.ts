const ADMIN_PROJECTS_PATH = "/admin/projects";

export type AdminProjectsViewMode = "list" | "cards";

export function buildAdminProjectsHref(args: {
  q?: string;
  published?: string;
  page?: number;
  view?: AdminProjectsViewMode;
}): string {
  const p = new URLSearchParams();
  if (args.q?.trim()) {
    p.set("q", args.q.trim());
  }
  if (args.published && args.published !== "all") {
    p.set("published", args.published);
  }
  if (args.page != null && args.page > 1) {
    p.set("page", String(args.page));
  }
  if (args.view && args.view !== "list") {
    p.set("view", args.view);
  }
  const qs = p.toString();
  return qs ? `${ADMIN_PROJECTS_PATH}?${qs}` : ADMIN_PROJECTS_PATH;
}
