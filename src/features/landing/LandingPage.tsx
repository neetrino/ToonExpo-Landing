/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { isFieldNonEmpty } from "@/shared/lib/expoFields";
import { LandingPageLower } from "@/features/landing/LandingPageLower";
import { visibleBlocks, type ExpoMap } from "@/features/landing/lib/blockVisibility";
import {
  getLandingTitle,
  getLeadText,
  getLogoUrl,
  getProjectMedia,
  splitParagraphs,
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
  const primaryCtaHref = vis.apartments ? "#apartments" : navItems[0] ? `#${navItems[0].id}` : "#about";

  return (
    <div className="min-h-screen bg-white text-[#111827]">
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
        <Section id="about" className="bg-black px-5 py-12 text-white lg:px-0 lg:py-0">
          <div className="mx-auto flex max-w-[1920px] flex-col gap-10 lg:min-h-[780px] lg:flex-row">
            <div className="flex w-full flex-col justify-center lg:w-1/2 lg:px-12">
              <div className="max-w-[680px]">
                <h2 className="text-[clamp(1.7rem,2.4vw,2.15rem)] font-semibold uppercase tracking-[0.04em]">
                  About the project
                </h2>
                {aboutFacts.length > 0 ? (
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {aboutFacts.map((item) => (
                      <div key={item.label} className="rounded-[10px] border border-white/14 bg-white/4 px-4 py-3">
                        <p className="text-xs uppercase tracking-[0.16em] text-[#2ba8b0]">{item.label}</p>
                        <p className="mt-1.5 text-sm leading-6 text-white/90 lg:text-[0.95rem]">{item.value}</p>
                      </div>
                    ))}
                  </div>
                ) : null}
                <div className="mt-8 space-y-4 text-base leading-7 text-white/86 lg:text-[1.2rem] lg:leading-[1.5]">
                  {(aboutParagraphs.length > 0 ? aboutParagraphs : [leadText]).map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                <a
                  href={vis.investment ? "#investment" : primaryCtaHref}
                  className="mt-8 inline-flex w-fit items-center rounded-[4px] border border-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-white hover:text-black lg:px-7 lg:py-3.5"
                >
                  Explore More
                </a>
              </div>
            </div>
            <div className="relative min-h-[360px] w-full lg:w-1/2">
              <img
                src={aboutPrimaryImage}
                alt=""
                className="h-full min-h-[360px] w-full object-cover lg:min-h-[780px]"
              />
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute bottom-6 left-4 w-[68%] max-w-[520px] border-4 border-white shadow-[0_20px_45px_rgba(0,0,0,0.35)] lg:bottom-[90px] lg:left-[-84px]">
                <img src={aboutSecondaryImage} alt="" className="h-full w-full object-cover" />
              </div>
            </div>
          </div>
        </Section>
      ) : null}

      <LandingPageLower fields={fields} title={title} />
    </div>
  );
}
