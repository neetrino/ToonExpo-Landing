/* eslint-disable @next/next/no-img-element */
import { isFieldNonEmpty } from "@/shared/lib/expoFields";
import { PROJECT_FIELD } from "@/shared/constants/expoFieldKeys";
import type { ExpoMap } from "@/features/landing/lib/blockVisibility";
import { visibleBlocks } from "@/features/landing/lib/blockVisibility";
import { ConstructionDetailIcon } from "@/features/landing/components/ConstructionDetailIcon";
import { GalleryShowcase } from "@/features/landing/GalleryShowcase";
import { Tour3DBlock } from "@/features/landing/Tour3DBlock";
import { VideoEmbedBlock } from "@/features/landing/VideoEmbedBlock";
import {
  constructionCards,
  PARTICIPANT_SECTION_INSET,
  participantFigmaAssets,
} from "@/features/landing/landingPage.constants";
import {
  firstNonEmpty,
  formatRange,
  getLandingTitle,
  getProjectMedia,
  getVirtualTourUrl,
} from "@/features/landing/landingPage.helpers";
import { resolveGalleryItems, resolveSecondaryGalleryItems } from "@/features/landing/lib/resolveGalleryImageUrls";
import type { ResolvedProjectFolderMedia } from "@/features/landing/lib/projectFolderMedia.types";
import { HY_UI } from "@/shared/i18n/hyUi.constants";

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

type Props = {
  fields: ExpoMap;
  title: string;
  folderMedia: ResolvedProjectFolderMedia | null;
};

export function LandingPageLower({ fields, title: _title, folderMedia }: Props) {
  const F = PROJECT_FIELD;
  const vis = visibleBlocks(fields);
  const media = getProjectMedia(fields);
  const galleryResolved = resolveGalleryItems(media, folderMedia);
  const galleryItems = galleryResolved.map(({ fullUrl, thumbUrl }) => ({
    label: "",
    image: fullUrl,
    thumb: thumbUrl,
  }));
  const secondaryGalleryResolved = resolveSecondaryGalleryItems(folderMedia);
  const infrastructureGalleryItems = secondaryGalleryResolved.map(({ fullUrl, thumbUrl }) => ({
    label: "",
    image: fullUrl,
    thumb: thumbUrl,
  }));
  const showGalleryBlock =
    (folderMedia?.galleryUrls.length ?? 0) > 0 || galleryResolved.length > 0;
  const showInfrastructureBlock = secondaryGalleryResolved.length > 0;
  const displayTitle = getLandingTitle(fields);
  const virtualTourUrl = getVirtualTourUrl(fields);

  return (
    <>
      {vis.investment ? (
        <Section id="investment" className="bg-[#2ba8b0] py-16 text-white lg:py-24">
          <div className={`mx-auto max-w-[1536px] ${PARTICIPANT_SECTION_INSET}`}>
            <h2 className="text-[clamp(1.9rem,2.6vw,2.35rem)] font-semibold leading-tight tracking-tight">
              {HY_UI.SECTION_INVESTMENT_OFFER}
            </h2>
            <div className="mt-7 grid gap-5 lg:grid-cols-3 lg:gap-6">
              {[
                {
                  title: HY_UI.INVEST_CARD_COMPLETION,
                  text: firstNonEmpty(fields[F.completion], HY_UI.ON_REQUEST),
                },
                {
                  title: HY_UI.INVEST_CARD_AREAS,
                  text: firstNonEmpty(fields[F.areas], HY_UI.ON_REQUEST),
                },
                {
                  title: HY_UI.INVEST_CARD_PRICE_PER_SQM,
                  text: firstNonEmpty(
                    formatRange(fields[F.priceMin], fields[F.priceMax]),
                    HY_UI.ON_REQUEST,
                  ),
                },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3.5">
                  <img src={participantFigmaAssets.investmentIcon} alt="" className="mt-1 h-7 w-7 shrink-0 lg:h-8 lg:w-8" />
                  <div className="min-w-0">
                    <p className="text-[1.2rem] font-semibold leading-snug lg:text-[1.45rem]">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-white/88 lg:text-base lg:leading-7">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>
      ) : null}

      {showGalleryBlock ? (
        <Section id="gallery" className="bg-white px-2 py-5 sm:px-3 lg:px-0 lg:py-0">
          <GalleryShowcase
            items={galleryItems}
            leftArrowSrc={participantFigmaAssets.galleryArrowLeft}
            rightArrowSrc={participantFigmaAssets.galleryArrowRight}
            imageAltBase={_title}
          />
        </Section>
      ) : null}

      {vis.payment ? (
        <Section id="payment" className="bg-[#ffd24d] py-10 text-black lg:py-14">
          <div className={`mx-auto max-w-[1536px] ${PARTICIPANT_SECTION_INSET}`}>
            <h2 className="text-[clamp(1.7rem,2.4vw,2.15rem)] font-semibold uppercase">{HY_UI.SECTION_PAYMENT}</h2>
            <div className="mt-8 grid gap-6 border-black/15 lg:grid-cols-3 lg:divide-x lg:divide-black/25">
              {[
                {
                  title: HY_UI.PAYMENT_INSTALLMENT,
                  text: firstNonEmpty(fields[F.paymentOptions], HY_UI.ON_REQUEST),
                  icon: participantFigmaAssets.paymentInstallmentIcon,
                },
                {
                  title: HY_UI.PAYMENT_MORTGAGE,
                  text: firstNonEmpty(fields[F.bank], HY_UI.ON_REQUEST),
                  icon: participantFigmaAssets.paymentMortgageIcon,
                },
                {
                  title: HY_UI.PAYMENT_TAX,
                  text: firstNonEmpty(fields[F.taxRefund], HY_UI.ON_REQUEST),
                  icon: participantFigmaAssets.paymentTaxIcon,
                },
              ].map((item) => (
                <div key={item.title} className="lg:px-7">
                  <img src={item.icon} alt="" className="h-[56px] w-[56px]" />
                  <p className="mt-5 text-[1.3rem] font-semibold lg:text-[1.45rem]">{item.title}</p>
                  <p className="mt-3 text-sm leading-7 lg:text-base">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>
      ) : null}

      {showInfrastructureBlock ? (
        <Section id="infrastructure" className="bg-white px-2 py-10 sm:px-3 lg:px-0 lg:py-14">
          <GalleryShowcase
            items={infrastructureGalleryItems}
            leftArrowSrc={participantFigmaAssets.galleryArrowLeft}
            rightArrowSrc={participantFigmaAssets.galleryArrowRight}
            imageAltBase={_title}
          />
        </Section>
      ) : null}

      {vis.construction ? (
        <Section id="construction" className="bg-[#192643] py-10 text-white lg:py-12">
          <div className={`mx-auto max-w-[1536px] ${PARTICIPANT_SECTION_INSET}`}>
            <h2 className="text-[clamp(1.7rem,2.4vw,2.15rem)] font-semibold uppercase text-[#2ba8b0]">
              {HY_UI.SECTION_CONSTRUCTION}
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {constructionCards.map((card) => (
                <div key={card.key} className="flex flex-col items-center text-center">
                  <ConstructionDetailIcon variant={card.iconVariant} />
                  <p className="mt-4 text-[1.15rem] font-semibold text-[#2ba8b0] lg:text-[1.25rem]">{card.key}</p>
                  <p className="mt-2 text-sm leading-7 text-white/88 lg:text-base">{firstNonEmpty(fields[card.key], HY_UI.ON_REQUEST)}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>
      ) : null}

      {vis.tours ? (
        <Section id="tours" className="bg-white py-10">
          <div className={`mx-auto max-w-[1536px] space-y-8 ${PARTICIPANT_SECTION_INSET}`}>
            <h2 className="text-[clamp(1.7rem,2.4vw,2.15rem)] font-semibold uppercase text-[#2ba8b0]">
              {HY_UI.SECTION_TOURS_MEDIA}
            </h2>
            {isFieldNonEmpty(virtualTourUrl) ? (
              <div>
                <div className="mb-0 inline-flex rounded-t-[10px] bg-[#ffd24d] px-6 py-2 text-base font-semibold uppercase text-white lg:px-7">
                  {HY_UI.TOUR_3D_BADGE}
                </div>
                <Tour3DBlock
                  url={virtualTourUrl}
                  title={displayTitle || "3D Tour"}
                />
              </div>
            ) : null}
            {isFieldNonEmpty(fields[F.video]) ? (
              <div>
                <div className="mb-0 inline-flex rounded-t-[10px] bg-[#ffd24d] px-6 py-2 text-base font-semibold uppercase text-white lg:px-7">
                  {HY_UI.TAB_VIDEO}
                </div>
                <VideoEmbedBlock
                  url={fields[F.video]}
                  title={displayTitle}
                />
              </div>
            ) : null}
          </div>
        </Section>
      ) : null}

    </>
  );
}
