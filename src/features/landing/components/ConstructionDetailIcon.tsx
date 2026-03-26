/**
 * Lucide React — մեկ ընդհանուր stroke-ոճ, գույնը՝ բլոկի ակցենտ (#2ba8b0)։
 */
import { LANDING_LUCIDE_STROKE } from "@/features/landing/lib/lucideLandingStyle";
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

const DEFAULT_ICON_CLASSNAME = "h-[62px] w-[62px] shrink-0 text-[#2ba8b0]";

type Props = {
  variant: ConstructionDetailIconVariant;
  className?: string;
};

/**
 * Դեկորատիվ Lucide-իկոն՝ «Կառուցման մանրամասներ» բլոկի համար։
 */
export function ConstructionDetailIcon({ variant, className }: Props) {
  const iconProps = {
    className: className?.trim() || DEFAULT_ICON_CLASSNAME,
    strokeWidth: LANDING_LUCIDE_STROKE,
    "aria-hidden": true as const,
  };
  switch (variant) {
    case "structure":
      return <Building2 {...iconProps} />;
    case "parkingClosed":
      return <CircleParking {...iconProps} />;
    case "elevators":
      return <ArrowUpDown {...iconProps} />;
    case "handover":
      return <KeyRound {...iconProps} />;
    case "ceiling":
      return <Ruler {...iconProps} />;
    case "floors":
      return <Layers {...iconProps} />;
  }
}
