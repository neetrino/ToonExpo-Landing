"use client";

import { useEffect } from "react";
import { trackLandingView } from "@/shared/lib/analytics";

type LandingAnalyticsTrackerProps = {
  projectSlug: string;
  projectName: string;
};

export function LandingAnalyticsTracker({
  projectSlug,
  projectName,
}: LandingAnalyticsTrackerProps) {
  useEffect(() => {
    trackLandingView({ projectSlug, projectName });
  }, [projectSlug, projectName]);

  return null;
}
