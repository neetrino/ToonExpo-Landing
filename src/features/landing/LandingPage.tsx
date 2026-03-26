/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { Building2, MapPin } from "lucide-react";
import { LANDING_LUCIDE_STROKE } from "@/features/landing/lib/lucideLandingStyle";
import { isFieldNonEmpty } from "@/shared/lib/expoFields";
import { PROJECT_FIELD } from "@/shared/constants/expoFieldKeys";
import { LandingPageLower } from "@/features/landing/LandingPageLower";
import { visibleBlocks, type ExpoMap } from "@/features/landing/lib/blockVisibility";
import {
  firstNonEmpty,
  getLandingTitle,
  getLeadText,
  getLogoUrl,
  getProjectMedia,
} from "@/features/landing/landingPage.helpers";
import {
  HERO_PROJECT_LOGO_BOX_CLASS,
  HERO_PROJECT_LOGO_IMG_CLASS,
  participantNav,
  SITE_HEADER_LOGO_SRC,
} from "@/features/landing/landingPage.constants";
import { LandingStickyHeader } from "@/features/landing/components/LandingStickyHeader";
import { ContactFabMenu } from "@/features/landing/components/ContactFabMenu";
import type { ResolvedProjectFolderMedia } from "@/features/landing/lib/projectFolderMedia.types";
import { HY_UI } from "@/shared/i18n/hyUi.constants";

type Props = {
  fields: ExpoMap;
  folderMedia: ResolvedProjectFolderMedia | null;
};

function Section({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={className}>
      {children}
    </section>
  );
}

export function LandingPage({ fields, folderMedia }: Props) {
  const vis = visibleBlocks(fields);
  const galleryFromFolder = (folderMedia?.galleryUrls.length ?? 0) > 0;
  const secondaryGalleryFromFolder =
    (folderMedia?.galleryInteriorThenExteriorUrls.length ?? 0) > 0;
  const hasGalleryNav = vis.gallery || galleryFromFolder;
  const navItems = participantNav.filter((item) => {
    if (item.block === "gallery") {
      return hasGalleryNav;
    }
    if (item.block === "infrastructure") {
      return secondaryGalleryFromFolder;
    }
    return vis[item.block];
  });
  const F = PROJECT_FIELD;
  const title = getLandingTitle(fields);
  const media = getProjectMedia(fields);
  const heroBg = folderMedia?.heroUrl || media[0] || null;
  const heroLogoUrl = firstNonEmpty(folderMedia?.logoUrl, getLogoUrl(fields));
  const leadText = getLeadText(fields);
  const desc = fields[F.description]?.trim() ?? "";
  const specialOffer = fields[F.specialOffer]?.trim() ?? "";
  const aboutPrimaryImage =
    folderMedia?.aboutLargeUrl || media[1] || media[0] || null;
  const aboutInteriorOneOverlayUrl = folderMedia?.aboutSmallUrl ?? null;
  const aboutIntroText = firstNonEmpty(fields[F.developer], leadText);
  const aboutSupportingText = firstNonEmpty(fields[F.shortName]);
  const aboutMainText = firstNonEmpty(desc, leadText);
  const primaryCtaHref = navItems[0] ? `#${navItems[0].id}` : "#about";

  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-[#111827]">
      <LandingStickyHeader>
        <div className="mx-auto flex max-w-[1920px] items-center justify-center gap-5 px-5 py-4 lg:px-12">
          <Link
            href="/"
            className="inline-flex shrink-0 items-center transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2ba8b0] focus-visible:ring-offset-2 focus-visible:ring-offset-black/70"
          >
            <img
              src={SITE_HEADER_LOGO_SRC}
              alt=""
              className="h-10 w-10 object-contain lg:h-12 lg:w-12"
            />
          </Link>
          <nav className="hidden min-w-0 flex-1 flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[0.72rem] uppercase tracking-[0.14em] xl:flex">
            {navItems.map((n) => (
              <a key={n.id} href={`#${n.id}`} className="transition hover:text-[#2ba8b0]">
                {n.label}
              </a>
            ))}
          </nav>
        </div>
      </LandingStickyHeader>

      <section className="relative min-h-[92svh] overflow-hidden bg-black pt-[72px] text-white">
        <div className="absolute inset-0">
          {heroBg ? (
            <img src={heroBg} alt="" className="h-full w-full object-cover object-center" />
          ) : (
            <div className="h-full w-full bg-black" aria-hidden />
          )}
        </div>
        <div className="absolute inset-y-0 left-0 w-full bg-black/55 lg:w-1/2 lg:bg-black/70" />
        <div className="absolute left-0 right-0 top-[89px] h-px bg-white/30" />
        <div className="relative z-10 mx-auto flex min-h-[calc(92svh-72px)] max-w-[1920px] items-start px-5 py-8 lg:px-0 lg:py-0">
          <div className="flex w-full flex-col gap-6 lg:min-h-[min(860px,calc(92svh-72px))] lg:w-1/2 lg:px-12 lg:pb-16 lg:pt-6">
            <div className="flex min-w-0 w-full max-w-[640px] flex-col gap-5">
              {heroLogoUrl ? (
                <div className={HERO_PROJECT_LOGO_BOX_CLASS}>
                  <img
                    src={heroLogoUrl}
                    alt=""
                    className={HERO_PROJECT_LOGO_IMG_CLASS}
                  />
                </div>
              ) : null}
              <div className="min-w-0 w-full max-w-[640px] break-words">
                <h1 className="text-[clamp(2.2rem,4.3vw,4.2rem)] font-semibold uppercase leading-[0.98]">
                  {title}
                </h1>
                <p className="mt-4 max-w-full text-[clamp(1rem,1.8vw,1.55rem)] font-light leading-[1.28]">
                  {leadText}
                </p>
                {isFieldNonEmpty(fields[F.shortName]) ? (
                  <p className="mt-3 max-w-full text-sm text-white/78 lg:text-base">
                    {fields[F.shortName]}
                  </p>
                ) : null}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href={primaryCtaHref}
                className="inline-flex items-center justify-center rounded-[4px] bg-[#2ba8b0] px-6 py-3.5 text-base font-semibold uppercase tracking-[0.08em] text-white transition hover:brightness-110 lg:px-7 lg:py-4"
              >
                {HY_UI.CTA_EXPLORE}
              </a>
            </div>
          </div>
        </div>
      </section>

      {vis.about ? (
        <Section id="about" className="relative z-10 border-b border-white/18 bg-black text-white">
          <div className="mx-auto flex max-w-[1920px] flex-col gap-10 px-5 py-12 sm:px-8 lg:min-h-[780px] lg:flex-row lg:items-stretch lg:gap-0 lg:pl-[102px] lg:pr-0 lg:py-[76px]">
            <div className="flex w-full items-center lg:w-1/2 lg:pr-[140px] xl:pr-[190px]">
              <div className="max-w-[620px]">
                <h2 className="text-[clamp(1.55rem,2.1vw,2.25rem)] font-semibold uppercase leading-none tracking-[0.01em]">
                  {HY_UI.SECTION_ABOUT_PROJECT}
                </h2>
                <div className="mt-10 lg:mt-[126px]">
                  <div className="flex items-center gap-4 lg:gap-5">
                    <Building2
                      aria-hidden
                      className="h-10 w-10 shrink-0 text-[#2ba8b0] lg:h-11 lg:w-11"
                      strokeWidth={LANDING_LUCIDE_STROKE}
                    />
                    <p className="min-w-0 flex-1 text-[1rem] font-light leading-[1.45] text-white/90 lg:text-[1.55rem] lg:leading-[1.2]">
                      {aboutIntroText}
                    </p>
                  </div>
                  {isFieldNonEmpty(aboutSupportingText) && aboutSupportingText !== aboutIntroText ? (
                    <div className="mt-5 flex items-center gap-4 lg:mt-[34px] lg:gap-5">
                      <MapPin
                        aria-hidden
                        className="h-10 w-10 shrink-0 text-[#2ba8b0] lg:h-14 lg:w-10"
                        strokeWidth={LANDING_LUCIDE_STROKE}
                      />
                      <p className="min-w-0 flex-1 max-w-[620px] text-[0.95rem] font-light leading-[1.4] text-white/88 lg:text-[1.55rem] lg:leading-[1.15]">
                        {aboutSupportingText}
                      </p>
                    </div>
                  ) : null}
                  <p className="mt-8 max-w-[620px] text-[0.72rem] font-normal leading-[1.28] text-white lg:mt-[66px] lg:text-[1.05rem] lg:leading-[1.28]">
                    {aboutMainText}
                  </p>
                  {specialOffer ? (
                    <div className="mt-8 w-full max-w-[620px] rounded-[10px] border border-[#22c55e]/40 bg-[#22c55e]/10 px-6 py-5 lg:mt-10">
                      <div className="flex items-center gap-3 mb-3">
                        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-7 w-7 shrink-0 text-[#22c55e]">
                          <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" fill="currentColor"/>
                        </svg>
                        <p className="text-[0.85rem] font-bold uppercase tracking-[0.18em] text-[#22c55e]">
                          {HY_UI.SECTION_SPECIAL_OFFER}
                        </p>
                      </div>
                      <p className="whitespace-pre-line text-[0.9rem] leading-[1.55] text-white/90 lg:text-[1rem]">
                        {specialOffer}
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="relative z-10 min-h-[360px] w-full overflow-visible lg:-mt-[76px] lg:-mb-[190px] lg:-mr-[96px] lg:w-[calc(50%+96px)] lg:self-start">
              {aboutPrimaryImage ? (
                <img
                  src={aboutPrimaryImage}
                  alt=""
                  className="h-full min-h-[360px] w-full rounded-l-[6px] rounded-r-none object-cover lg:min-h-[1120px]"
                />
              ) : (
                <div
                  className="h-full min-h-[360px] w-full rounded-l-[6px] rounded-r-none bg-black lg:min-h-[1120px]"
                  aria-hidden
                />
              )}
              <div className="absolute inset-0 rounded-l-[6px] rounded-r-none bg-black/18" />
              {aboutInteriorOneOverlayUrl ? (
                <div className="absolute bottom-4 left-4 z-20 w-[72%] max-w-[380px] overflow-hidden rounded-[6px] border-4 border-white shadow-[0_20px_45px_rgba(0,0,0,0.35)] lg:bottom-[220px] lg:left-[-116px] lg:w-[64%] lg:max-w-[480px]">
                  <img src={aboutInteriorOneOverlayUrl} alt="" className="h-[232px] w-full object-cover lg:h-[264px]" />
                </div>
              ) : null}
            </div>
          </div>
        </Section>
      ) : null}

      <LandingPageLower fields={fields} title={title} folderMedia={folderMedia} />
      <ContactFabMenu
        variant="desktop"
        toggleLabel={HY_UI.CTA_CALL_US}
        phone={fields[F.phone]}
        instagram={fields[F.instagram]}
        facebook={fields[F.facebook]}
        website={fields[F.website]}
      />
    </div>
  );
}
