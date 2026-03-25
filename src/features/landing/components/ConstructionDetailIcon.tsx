/**
 * Lucide React — մեկ ընդհանուր stroke-ոճ, գույնը՝ բլոկի ակցենտ (#2ba8b0)։
 */
import {
  ArrowUpDown,
  Building2,
  CircleParking,
  KeyRound,
  Layers,
  Ruler,
} from "lucide-react";

export const CONSTRUCTION_DETAIL_ICON_VARIANTS = [
  "structure",
  "parkingClosed",
  "elevators",
  "handover",
  "ceiling",
  "floors",
] as const;

export type ConstructionDetailIconVariant =
  (typeof CONSTRUCTION_DETAIL_ICON_VARIANTS)[number];

/** Lucide default stroke ~1.5; slightly heavier for 62px tiles on dark bg */
const CONSTRUCTION_ICON_STROKE_PX = 1.75;

const ICON_PROPS = {
  className: "h-[62px] w-[62px] shrink-0 text-[#2ba8b0]",
  strokeWidth: CONSTRUCTION_ICON_STROKE_PX,
  "aria-hidden": true as const,
};

type Props = {
  variant: ConstructionDetailIconVariant;
};

/**
 * Դեկորատիվ Lucide-իկոն՝ «Կառուցման մանրամասներ» բլոկի համար։
 */
export function ConstructionDetailIcon({ variant }: Props) {
  switch (variant) {
    case "structure":
      return <Building2 {...ICON_PROPS} />;
    case "parkingClosed":
      return <CircleParking {...ICON_PROPS} />;
    case "elevators":
      return <ArrowUpDown {...ICON_PROPS} />;
    case "handover":
      return <KeyRound {...ICON_PROPS} />;
    case "ceiling":
      return <Ruler {...ICON_PROPS} />;
    case "floors":
      return <Layers {...ICON_PROPS} />;
  }
}
