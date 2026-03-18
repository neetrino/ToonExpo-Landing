/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { isFieldNonEmpty } from "@/shared/lib/expoFields";
import { LandingPageLower } from "@/features/landing/LandingPageLower";
import { visibleBlocks, type ExpoMap } from "@/features/landing/lib/blockVisibility";
import {
  firstNonEmpty,
  getLandingTitle,
  getLeadText,
  getLogoUrl,
  getProjectMedia,
  splitParagraphs,
  splitListItems,
} from "@/features/landing/landingPage.helpers";
import {
  participantFigmaAssets,
  participantNav,
} from "@/features/landing/landingPage.constants";

type Props = {
  fields: ExpoMap;
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

export function LandingPage({ fields }: Props) {
  const vis = visibleBlocks(fields);
  const navItems = participantNav.filter((item) => vis[item.block]);
  const title = getLandingTitle(fields);
  const media = getProjectMedia(fields);
  const heroBg = media[0] || participantFigmaAssets.heroBackground;
  const heroLogo = getLogoUrl(fields) || participantFigmaAssets.fallbackLogo;
  const leadText = getLeadText(fields);
  const aboutParagraphs = splitParagraphs(fields.expo_field_34);
  const aboutPrimaryImage = media[1] || media[0] || participantFigmaAssets.aboutPrimary;
  const aboutSecondaryImage = media[2] || media[1] || participantFigmaAssets.aboutSecondary;
  const aboutFacts = [
    { label: "Developer", value: fields.expo_field_11 },
    { label: "Architect", value: fields.expo_field_12 },
    { label: "Construction", value: fields.expo_field_13 },
    { label: "Management", value: fields.expo_field_14 },
  ].filter((item) => isFieldNonEmpty(item.value));
  const aboutHighlights = splitListItems(fields.expo_field_34);
  const aboutIntroText = firstNonEmpty(
    aboutFacts.map((item) => `${item.label}: ${item.value}`).join(" / "),
    leadText,
  );
  const aboutSupportingText = firstNonEmpty(fields.expo_field_03, aboutParagraphs.length > 1 ? aboutParagraphs[0] : "");
  const aboutMainText = firstNonEmpty(
    aboutHighlights.join(". "),
    aboutParagraphs.length > 1 ? aboutParagraphs[aboutParagraphs.length - 1] : aboutParagraphs[0],
    fields.expo_field_03,
    leadText,
  );
  const primaryCtaHref = vis.apartments ? "#apartments" : navItems[0] ? `#${navItems[0].id}` : "#about";

  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-[#111827]">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/15 bg-black/72 text-white backdrop-blur">
        <div className="mx-auto flex max-w-[1920px] items-center gap-5 px-5 py-4 lg:px-12">
          <Link href="/" className="shrink-0 text-xs font-semibold uppercase tracking-[0.18em] text-[#2ba8b0] lg:text-sm">
            Toon Expo
          </Link>
          <nav className="hidden min-w-0 flex-1 flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[0.72rem] uppercase tracking-[0.14em] xl:flex">
            {navItems.map((n) => (
              <a key={n.id} href={`#${n.id}`} className="transition hover:text-[#2ba8b0]">
                {n.label}
              </a>
            ))}
          </nav>
          <button
            type="button"
            aria-disabled="true"
            className="ml-auto rounded-[4px] border-2 border-white/85 px-3.5 py-1.5 text-xs uppercase tracking-[0.14em] text-white/90 lg:text-sm"
          >
            ENG
          </button>
        </div>
      </header>

      <section className="relative min-h-[92svh] overflow-hidden bg-black pt-[72px] text-white">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="h-full w-full object-cover object-center" />
        </div>
        <div className="absolute inset-y-0 left-0 w-full bg-black/55 lg:w-1/2 lg:bg-black/70" />
        <div className="absolute left-0 right-0 top-[89px] h-px bg-white/30" />
        <div className="relative z-10 mx-auto flex min-h-[calc(92svh-72px)] max-w-[1920px] items-end px-5 py-8 lg:px-0 lg:py-0">
          <div className="flex w-full flex-col justify-end gap-6 lg:min-h-[860px] lg:w-1/2 lg:px-12 lg:pb-16">
            <img
              src={heroLogo}
              alt=""
              className="h-auto w-[92px] object-contain lg:w-[138px]"
            />
            <div className="max-w-[640px]">
              <h1 className="max-w-[620px] text-[clamp(2.2rem,4.3vw,4.2rem)] font-semibold uppercase leading-[0.98]">
                {title}
              </h1>
              <p className="mt-4 max-w-[470px] text-[clamp(1rem,1.8vw,1.55rem)] font-light leading-[1.28]">
                {leadText}
              </p>
              {isFieldNonEmpty(fields.expo_field_03) ? (
                <p className="mt-3 max-w-[500px] text-sm text-white/78 lg:text-base">
                  {fields.expo_field_03}
                </p>
              ) : null}
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href={primaryCtaHref}
                className="inline-flex items-center justify-center rounded-[4px] bg-[#2ba8b0] px-6 py-3.5 text-base font-semibold uppercase tracking-[0.08em] text-white transition hover:brightness-110 lg:px-7 lg:py-4"
              >
                View Apartments
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
                <h2 className="text-[clamp(1.7rem,2.3vw,2.5rem)] font-semibold uppercase leading-none tracking-[0.01em]">
                  About the project
                </h2>
                <div className="mt-10 lg:mt-[126px]">
                  <p className="text-[1.05rem] font-light leading-[1.45] text-white/90 lg:text-[1.75rem] lg:leading-[1.2]">
                    {aboutIntroText}
                  </p>
                  {isFieldNonEmpty(aboutSupportingText) && aboutSupportingText !== aboutIntroText ? (
                    <p className="mt-5 max-w-[620px] text-[1rem] font-light leading-[1.4] text-white/88 lg:mt-[34px] lg:text-[1.75rem] lg:leading-[1.15]">
                      {aboutSupportingText}
                    </p>
                  ) : null}
                  <p className="mt-8 max-w-[620px] text-[1.35rem] font-normal leading-[1.28] text-white lg:mt-[66px] lg:text-[2rem] lg:leading-[1.28]">
                    {aboutMainText}
                  </p>
                  <a
                    href={vis.investment ? "#investment" : primaryCtaHref}
                    className="mt-10 inline-flex w-fit items-center gap-3 rounded-[6px] border border-white px-5 py-3 text-sm font-semibold uppercase tracking-[0.03em] text-white transition hover:bg-white hover:text-black lg:mt-[84px] lg:min-h-[71px] lg:px-7 lg:text-[1.5rem]"
                  >
                    <span>Explore More</span>
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 14 24"
                      className="h-4 w-2.5 shrink-0 lg:h-[24px] lg:w-[14px]"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M1.5 1.5L12 12L1.5 22.5" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            <div className="relative z-10 min-h-[360px] w-full overflow-visible lg:-mt-[76px] lg:-mb-[190px] lg:-mr-[96px] lg:w-[calc(50%+96px)] lg:self-start">
              <img
                src={aboutPrimaryImage}
                alt=""
                className="h-full min-h-[360px] w-full rounded-l-[6px] rounded-r-none object-cover lg:min-h-[1120px]"
              />
              <div className="absolute inset-0 rounded-l-[6px] rounded-r-none bg-black/18" />
              <div className="absolute z-20 bottom-4 left-4 w-[72%] max-w-[380px] overflow-hidden rounded-[6px] border-4 border-white shadow-[0_20px_45px_rgba(0,0,0,0.35)] lg:bottom-[220px] lg:left-[-116px] lg:w-[64%] lg:max-w-[480px]">
                <img src={aboutSecondaryImage} alt="" className="h-[232px] w-full object-cover lg:h-[264px]" />
              </div>
            </div>
          </div>
        </Section>
      ) : null}

      <LandingPageLower fields={fields} title={title} />
    </div>
  );
}
