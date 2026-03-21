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
import { LandingStickyHeader } from "@/features/landing/components/LandingStickyHeader";

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

function AboutIntroPinIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={40}
      height={56}
      viewBox="0 0 40 56"
      fill="none"
      aria-hidden
      className="mt-0.5 h-10 w-10 shrink-0 lg:mt-1 lg:h-14 lg:w-10"
    >
      <path
        d="M39.9969 19.8089C39.9613 23.1196 39.2004 26.7162 37.7374 30.1507C33.8401 39.2937 27.9044 47.0941 21.2604 54.4188C20.5289 55.2262 19.6907 55.4663 18.9004 54.5733C11.2388 45.9242 3.91584 37.0382 0.779427 25.6442C-2.38637 14.1295 4.39063 2.7937 15.6897 0.457111C28.2014 -2.13026 39.3102 6.52796 40 19.8074H39.9969V19.8089ZM31.9657 19.6422C31.9889 12.9995 26.6517 7.57392 20.0758 7.55404C13.4844 7.53416 7.94151 12.9566 7.91213 19.4648C7.88274 26.0602 13.2617 31.3756 19.9706 31.3848C26.6533 31.394 31.9425 26.2162 31.9641 19.6407L31.9657 19.6422Z"
        fill="#2BA8B0"
      />
    </svg>
  );
}

const ABOUT_SUPPORTING_GEAR_CLIP_ID = "clipAboutSupportingGear";

function AboutSupportingGearIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={45}
      height={45}
      viewBox="0 0 45 45"
      fill="none"
      aria-hidden
      className="mt-0.5 h-9 w-9 shrink-0 lg:h-11 lg:w-11"
    >
      <g clipPath={`url(#${ABOUT_SUPPORTING_GEAR_CLIP_ID})`}>
        <path
          d="M43.1557 17.7307H39.3091C38.9403 16.4133 38.4133 15.1487 37.7283 13.9368L40.4157 11.2494C41.1534 10.5117 41.1534 9.35246 40.4157 8.66744L36.2529 4.50468C35.5152 3.76697 34.356 3.76697 33.671 4.50468L30.9836 7.19203C29.8244 6.50702 28.5597 6.03278 27.1897 5.61124V1.87002C27.1897 0.868848 26.3466 0.0257568 25.3454 0.0257568H19.4438C18.4426 0.0257568 17.5995 0.868848 17.5995 1.87002V5.66393C16.2822 6.03278 15.0176 6.55971 13.8056 7.24473L11.1183 4.55737C10.3806 3.81967 9.22131 3.81967 8.5363 4.55737L4.37354 8.72014C3.63583 9.45784 3.63583 10.6171 4.37354 11.3021L7.06089 13.9895C6.37588 15.1487 5.90164 16.4133 5.48009 17.7834H1.84426C0.843091 17.7834 0 18.6265 0 19.6276V25.5293C0 26.5304 0.843091 27.3735 1.84426 27.3735H5.69087C6.05972 28.6909 6.58665 29.9555 7.27166 31.1674L4.58431 33.8548C3.8466 34.5925 3.8466 35.7518 4.58431 36.4368L8.74707 40.5995C9.48478 41.3372 10.644 41.3372 11.329 40.5995L14.0164 37.9122C15.1756 38.5972 16.4403 39.0714 17.8103 39.493V43.2869C17.8103 44.2881 18.6534 45.1311 19.6546 45.1311H25.5562C26.5574 45.1311 27.4005 44.2881 27.4005 43.2869V39.493C28.7178 39.1241 29.9824 38.5972 31.1944 37.9122L33.8817 40.5995C34.6194 41.3372 35.7787 41.3372 36.4637 40.5995L40.6265 36.4368C41.3642 35.6991 41.3642 34.5398 40.6265 33.8548L37.9391 31.1674C38.6241 30.0082 39.0984 28.7436 39.5199 27.3735H43.3665C44.3677 27.3735 45.2108 26.5304 45.2108 25.5293V19.6276C45.2108 18.6265 44.3677 17.7834 43.3665 17.7834L43.1557 17.7307ZM22.5 31.7471C17.3888 31.7471 13.2787 27.637 13.2787 22.5258C13.2787 17.4145 17.3888 13.3044 22.5 13.3044C27.6112 13.3044 31.7213 17.4145 31.7213 22.5258C31.7213 27.637 27.6112 31.7471 22.5 31.7471Z"
          fill="#2BA8B0"
        />
      </g>
      <defs>
        <clipPath id={ABOUT_SUPPORTING_GEAR_CLIP_ID}>
          <rect width="45" height="45" fill="white" />
        </clipPath>
      </defs>
    </svg>
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
  const aboutSecondaryImage = media[2] || media[1] || media[0] || "";
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
              src="/figma/home/footerLogo.svg"
              alt="Toon Expo"
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
                Explore
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
                  About the project
                </h2>
                <div className="mt-10 lg:mt-[126px]">
                  <div className="flex items-start gap-4 lg:gap-5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={40}
                      height={56}
                      viewBox="0 0 40 56"
                      fill="none"
                      aria-hidden
                      className="mt-0.5 h-10 w-10 shrink-0 lg:mt-1 lg:h-14 lg:w-10"
                    >
                      <path
                        d="M39.9969 19.8089C39.9613 23.1196 39.2004 26.7162 37.7374 30.1507C33.8401 39.2937 27.9044 47.0941 21.2604 54.4188C20.5289 55.2262 19.6907 55.4663 18.9004 54.5733C11.2388 45.9242 3.91584 37.0382 0.779427 25.6442C-2.38637 14.1295 4.39063 2.7937 15.6897 0.457111C28.2014 -2.13026 39.3102 6.52796 40 19.8074H39.9969V19.8089ZM31.9657 19.6422C31.9889 12.9995 26.6517 7.57392 20.0758 7.55404C13.4844 7.53416 7.94151 12.9566 7.91213 19.4648C7.88274 26.0602 13.2617 31.3756 19.9706 31.3848C26.6533 31.394 31.9425 26.2162 31.9641 19.6407L31.9657 19.6422Z"
                        fill="#2BA8B0"
                      />
                    </svg>
                    <p className="min-w-0 flex-1 text-[1rem] font-light leading-[1.45] text-white/90 lg:text-[1.55rem] lg:leading-[1.2]">
                      {aboutIntroText}
                    </p>
                  </div>
                  {isFieldNonEmpty(aboutSupportingText) && aboutSupportingText !== aboutIntroText ? (
                    <div className="mt-5 flex items-start gap-4 lg:mt-[34px] lg:gap-5">
                      <AboutSupportingGearIcon />
                      <p className="min-w-0 flex-1 max-w-[620px] text-[0.95rem] font-light leading-[1.4] text-white/88 lg:text-[1.55rem] lg:leading-[1.15]">
                        {aboutSupportingText}
                      </p>
                    </div>
                  ) : null}
                  <p className="mt-8 max-w-[620px] text-[1.2rem] font-normal leading-[1.28] text-white lg:mt-[66px] lg:text-[1.8rem] lg:leading-[1.28]">
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
              {aboutSecondaryImage ? (
                <div className="absolute bottom-4 left-4 z-20 w-[72%] max-w-[380px] overflow-hidden rounded-[6px] border-4 border-white shadow-[0_20px_45px_rgba(0,0,0,0.35)] lg:bottom-[220px] lg:left-[-116px] lg:w-[64%] lg:max-w-[480px]">
                  <img src={aboutSecondaryImage} alt="" className="h-[232px] w-full object-cover lg:h-[264px]" />
                </div>
              ) : null}
            </div>
          </div>
        </Section>
      ) : null}

      <LandingPageLower fields={fields} title={title} />
    </div>
  );
}
