export type HomeProject = {
  id: string;
  slug: string;
  expoFields: Record<string, string>;
  /** Լենդինգի hero-ի հետ նույն պատկերը (պանակ կամ expo URL) */
  cardHeroUrl?: string | null;
  /** Քարտի վերևի ձախ անկյուն — Logo/ պանակից (R2) */
  cardLogoUrl?: string | null;
};
