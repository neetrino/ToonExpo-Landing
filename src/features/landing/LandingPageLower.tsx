/* eslint-disable @next/next/no-img-element */
import { isFieldNonEmpty } from "@/shared/lib/expoFields";
import { parseMediaUrls } from "@/shared/lib/mediaUrls";
import type { ExpoMap } from "@/features/landing/lib/blockVisibility";
import { visibleBlocks } from "@/features/landing/lib/blockVisibility";
import { GalleryShowcase } from "@/features/landing/GalleryShowcase";
import { Tour3DBlock } from "@/features/landing/Tour3DBlock";
import { VideoEmbedBlock } from "@/features/landing/VideoEmbedBlock";
import {
  constructionCards,
  parkingCards,
  PARTICIPANT_SECTION_INSET,
  participantFigmaAssets,
} from "@/features/landing/landingPage.constants";
import {
  firstNonEmpty,
  formatRange,
  getProjectMedia,
  splitListItems,
} from "@/features/landing/landingPage.helpers";
import { resolveGalleryImageUrls } from "@/features/landing/lib/resolveGalleryImageUrls";
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
  const vis = visibleBlocks(fields);
  const media = getProjectMedia(fields);
  const exteriorMedia = Array.from(new Set(parseMediaUrls(fields.expo_field_43)));
  const infrastructureItems = splitListItems(fields.expo_field_33);
  const investmentIntro = firstNonEmpty(
    fields.expo_field_17,
    fields.expo_field_18,
    "Price varies by view and floor. Higher floors and better views command premium.",
  );
  const galleryImages = resolveGalleryImageUrls(media, folderMedia);
  const galleryItems = galleryImages.map((image) => ({
    label: HY_UI.SECTION_GALLERY,
    image,
  }));
  const infrastructureImages = [
    folderMedia?.infrastructureLeftUrl ||
      exteriorMedia[1] ||
      exteriorMedia[0] ||
      media[3] ||
      participantFigmaAssets.infrastructureLeft,
    folderMedia?.infrastructureRightUrl ||
      exteriorMedia[2] ||
      exteriorMedia[1] ||
      media[4] ||
      participantFigmaAssets.infrastructureRight,
  ];
  const showGalleryBlock =
    vis.gallery || (folderMedia?.galleryUrls.length ?? 0) > 0 || galleryImages.length > 0;
  const showInfrastructureBlock =
    vis.infrastructure ||
    Boolean(folderMedia?.infrastructureLeftUrl || folderMedia?.infrastructureRightUrl);

  return (
    <>
      {vis.investment ? (
        <Section id="investment" className="bg-[#2ba8b0] py-16 text-white lg:py-24">
          <div className={`mx-auto max-w-[1536px] ${PARTICIPANT_SECTION_INSET}`}>
            <h2 className="text-[clamp(1.55rem,2.1vw,1.95rem)] font-semibold uppercase">{HY_UI.NAV_INVESTMENT}</h2>
            <p className="mt-4 max-w-[700px] text-sm leading-6 text-white/90 lg:text-[1.05rem] lg:leading-[1.4]">
              {investmentIntro}
            </p>
            <div className="mt-7 grid gap-5 lg:grid-cols-3 lg:gap-6">
              {[
                {
                  title: firstNonEmpty(fields.expo_field_17, HY_UI.MOBILE_INVEST_HIGH_1),
                  text: formatRange(fields.expo_field_17, fields.expo_field_18),
                },
                {
                  title: HY_UI.MOBILE_INVEST_HIGH_2,
                  text: formatRange(fields.expo_field_07, fields.expo_field_08),
                },
                {
                  title: HY_UI.MOBILE_INVEST_HIGH_3,
                  text: firstNonEmpty(fields.expo_field_10, fields.expo_field_09, HY_UI.ON_REQUEST),
                },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3.5">
                  <img src={participantFigmaAssets.investmentIcon} alt="" className="mt-0.5 h-6 w-6 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[1rem] font-semibold leading-snug lg:text-[1.1rem]">{item.title}</p>
                    <p className="mt-1.5 text-xs leading-5 text-white/88 lg:text-sm lg:leading-6">{item.text}</p>
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
                  text: firstNonEmpty(fields.expo_field_19, HY_UI.ON_REQUEST),
                  icon: participantFigmaAssets.paymentInstallmentIcon,
                },
                {
                  title: HY_UI.PAYMENT_MORTGAGE,
                  text: firstNonEmpty(fields.expo_field_10, HY_UI.ON_REQUEST),
                  icon: participantFigmaAssets.paymentMortgageIcon,
                },
                {
                  title: HY_UI.PAYMENT_TAX,
                  text: firstNonEmpty(fields.expo_field_09, HY_UI.ON_REQUEST),
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
        <Section id="infrastructure" className="bg-white py-10 lg:py-14">
          <div
            className={`mx-auto grid max-w-[1920px] gap-6 lg:grid-cols-[minmax(0,1fr)_400px_400px] ${PARTICIPANT_SECTION_INSET} lg:pr-0 xl:pr-0`}
          >
            <div>
              <h2 className="max-w-[360px] text-[clamp(1.7rem,2.4vw,2.15rem)] font-semibold uppercase text-[#2ba8b0]">
                {HY_UI.SECTION_INFRA}
              </h2>
              <ul className="mt-7 space-y-3 text-base leading-7 text-black/82 lg:text-[1.15rem] lg:leading-[1.5]">
                {infrastructureItems.map((item) => (
                  <li key={item} className="ml-6 list-disc">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            {infrastructureImages.map((image, index) => (
              <div key={`${image}-${index}`} className="overflow-hidden">
                <img src={image} alt="" className="h-full min-h-[220px] w-full object-cover lg:min-h-[320px]" />
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      {vis.construction ? (
        <Section id="construction" className="bg-[#192643] py-10 text-white lg:py-12">
          <div className={`mx-auto max-w-[1536px] ${PARTICIPANT_SECTION_INSET}`}>
            <h2 className="text-[clamp(1.7rem,2.4vw,2.15rem)] font-semibold uppercase text-[#2ba8b0]">
              {HY_UI.SECTION_CONSTRUCTION}
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-6">
              {constructionCards.map((card) => (
                <div key={card.key} className="flex flex-col items-center text-center">
                  <img src={card.icon} alt="" className="h-[62px] w-[62px] object-contain" />
                  <p className="mt-4 text-[1.15rem] font-semibold text-[#2ba8b0] lg:text-[1.25rem]">{card.label}</p>
                  <p className="mt-2 text-sm leading-7 text-white/88 lg:text-base">{firstNonEmpty(fields[card.key], HY_UI.ON_REQUEST)}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>
      ) : null}

      {vis.parking ? (
        <Section id="parking" className="bg-[#2ba8b0] py-10 text-white lg:py-12">
          <div className={`mx-auto max-w-[1536px] ${PARTICIPANT_SECTION_INSET}`}>
            <h2 className="text-[clamp(1.7rem,2.4vw,2.15rem)] font-semibold uppercase text-[#192643]">
              {HY_UI.SECTION_PARKING}
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-5">
              {parkingCards.map((card) => (
                <div key={card.key} className="flex flex-col items-center text-center">
                  <img src={card.icon} alt="" className="h-[62px] w-[62px] object-contain" />
                  <p className="mt-4 text-[1.15rem] font-semibold text-[#192643] lg:text-[1.25rem]">{card.label}</p>
                  <p className="mt-2 text-sm leading-7 lg:text-base">{firstNonEmpty(fields[card.key], HY_UI.ON_REQUEST)}</p>
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
            {isFieldNonEmpty(fields.expo_field_45) ? (
              <div>
                <div className="mb-0 inline-flex rounded-t-[10px] bg-[#ffd24d] px-6 py-2 text-base font-semibold uppercase text-white lg:px-7">
                  {HY_UI.TOUR_3D_BADGE}
                </div>
                <Tour3DBlock
                  url={fields.expo_field_45}
                  title={fields.expo_field_02 || "3D Tour"}
                />
              </div>
            ) : null}
            {isFieldNonEmpty(fields.expo_field_46) ? (
              <div>
                <div className="mb-0 inline-flex rounded-t-[10px] bg-[#ffd24d] px-6 py-2 text-base font-semibold uppercase text-white lg:px-7">
                  {HY_UI.TAB_VIDEO}
                </div>
                <VideoEmbedBlock
                  url={fields.expo_field_46}
                  title={fields.expo_field_02}
                />
              </div>
            ) : null}
          </div>
        </Section>
      ) : null}

    </>
  );
}





