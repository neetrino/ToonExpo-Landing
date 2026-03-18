/* eslint-disable @next/next/no-img-element */
import { isFieldNonEmpty } from "@/shared/lib/expoFields";
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
  extractApartmentSizes,
  firstNonEmpty,
  formatRange,
  getProjectMedia,
  splitListItems,
} from "@/features/landing/landingPage.helpers";

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
};

export function LandingPageLower({ fields, title }: Props) {
  const vis = visibleBlocks(fields);
  const media = getProjectMedia(fields);
  const apartmentSizes = extractApartmentSizes(fields);
  const infrastructureItems = splitListItems(fields.expo_field_33);
  const investmentIntro = firstNonEmpty(
    fields.expo_field_17,
    fields.expo_field_18,
    "Price varies by view and floor. Higher floors and better views command premium.",
  );
  const galleryImages = Array.from(
    new Set([
      ...media,
      participantFigmaAssets.galleryMain,
      participantFigmaAssets.galleryUpper,
      participantFigmaAssets.galleryUpdates,
    ]),
  );
  const galleryItems = [
    { label: "Typical Renders", image: galleryImages[0] },
    { label: "Upper Levels", image: galleryImages[1] ?? galleryImages[0] },
    { label: "Floorplan Updates", image: galleryImages[2] ?? galleryImages[0] },
    ...galleryImages.slice(3).map((image, index) => ({
      label: `Gallery View ${index + 4}`,
      image,
    })),
  ];
  const infrastructureImages = [
    media[3] || media[1] || participantFigmaAssets.infrastructureLeft,
    media[4] || media[2] || participantFigmaAssets.infrastructureRight,
  ];
  const activeSizeIndex =
    apartmentSizes.length > 1 ? 1 : apartmentSizes.length === 1 ? 0 : -1;

  return (
    <>
      {vis.investment ? (
        <Section id="investment" className="bg-[#2ba8b0] py-16 text-white lg:py-24">
          <div className={`mx-auto max-w-[1536px] ${PARTICIPANT_SECTION_INSET}`}>
            <h2 className="text-[clamp(1.55rem,2.1vw,1.95rem)] font-semibold uppercase">Investment</h2>
            <p className="mt-4 max-w-[700px] text-sm leading-6 text-white/90 lg:text-[1.05rem] lg:leading-[1.4]">
              {investmentIntro}
            </p>
            <div className="mt-7 grid gap-5 lg:grid-cols-3 lg:gap-6">
              {[
                {
                  title: firstNonEmpty(fields.expo_field_17, "High ROI rental potential"),
                  text: formatRange(fields.expo_field_17, fields.expo_field_18),
                },
                {
                  title: "Price logic: view + higher floors",
                  text: formatRange(fields.expo_field_07, fields.expo_field_08),
                },
                {
                  title: "Ideal for seasonal rental",
                  text: firstNonEmpty(fields.expo_field_10, fields.expo_field_09, "On request"),
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

      {vis.apartments ? (
        <Section id="apartments" className="bg-white py-10">
          <div className={`mx-auto max-w-[1536px] ${PARTICIPANT_SECTION_INSET}`}>
            <h2 className="text-[clamp(1.7rem,2.4vw,2.15rem)] font-semibold uppercase text-[#2ba8b0]">
              Apartment options
            </h2>
            <div className="mt-8 grid grid-cols-2 gap-2.5 sm:grid-cols-4 xl:grid-cols-8">
              {apartmentSizes.map((size, index) => (
                <div
                  key={size}
                  className={`flex min-h-[92px] items-center justify-center rounded-[4px] border-[3px] px-3 text-center text-[1.15rem] font-semibold leading-tight lg:min-h-[108px] lg:text-[1.35rem] ${
                    index === activeSizeIndex
                      ? "border-[#2ba8b0] bg-[#2ba8b0] text-white"
                      : "border-[#2ba8b0] text-[#2ba8b0]"
                  }`}
                >
                  {size}
                </div>
              ))}
            </div>
            {isFieldNonEmpty(fields.expo_field_06) ? (
              <p className="mt-6 max-w-[860px] text-base leading-7 text-black/80 whitespace-pre-wrap">
                {fields.expo_field_06}
              </p>
            ) : null}
          </div>
        </Section>
      ) : null}

      {vis.gallery ? (
        <Section id="gallery" className="bg-white px-5 py-5 lg:px-0 lg:py-0">
          <GalleryShowcase
            items={galleryItems}
            leftArrowSrc={participantFigmaAssets.galleryArrowLeft}
            rightArrowSrc={participantFigmaAssets.galleryArrowRight}
          />
        </Section>
      ) : null}

      {vis.payment ? (
        <Section id="payment" className="bg-[#ffd24d] py-10 text-black lg:py-14">
          <div className={`mx-auto max-w-[1536px] ${PARTICIPANT_SECTION_INSET}`}>
            <h2 className="text-[clamp(1.7rem,2.4vw,2.15rem)] font-semibold uppercase">Payment conditions</h2>
            <div className="mt-8 grid gap-6 border-black/15 lg:grid-cols-3 lg:divide-x lg:divide-black/25">
              {[
                {
                  title: "Installment",
                  text: firstNonEmpty(fields.expo_field_19, "On request"),
                  icon: participantFigmaAssets.paymentInstallmentIcon,
                },
                {
                  title: "Mortgage",
                  text: firstNonEmpty(fields.expo_field_10, "On request"),
                  icon: participantFigmaAssets.paymentMortgageIcon,
                },
                {
                  title: "Income tax return",
                  text: firstNonEmpty(fields.expo_field_09, "On request"),
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

      {vis.infrastructure ? (
        <Section id="infrastructure" className="bg-white py-10 lg:py-14">
          <div
            className={`mx-auto grid max-w-[1920px] gap-6 lg:grid-cols-[minmax(0,1fr)_400px_400px] ${PARTICIPANT_SECTION_INSET} lg:pr-0 xl:pr-0`}
          >
            <div>
              <h2 className="max-w-[360px] text-[clamp(1.7rem,2.4vw,2.15rem)] font-semibold uppercase text-[#2ba8b0]">
                Infrastructure & amenities
              </h2>
              <ul className="mt-7 space-y-3 text-base leading-7 text-black/82 lg:text-[1.15rem] lg:leading-[1.5]">
                {infrastructureItems.map((item) => (
                  <li key={item} className="ml-6 list-disc">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            {infrastructureImages.map((image) => (
              <div key={image} className="overflow-hidden">
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
              Construction details
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-6">
              {constructionCards.map((card) => (
                <div key={card.key} className="flex flex-col items-center text-center">
                  <img src={card.icon} alt="" className="h-[62px] w-[62px] object-contain" />
                  <p className="mt-4 text-[1.15rem] font-semibold text-[#2ba8b0] lg:text-[1.25rem]">{card.label}</p>
                  <p className="mt-2 text-sm leading-7 text-white/88 lg:text-base">{firstNonEmpty(fields[card.key], "On request")}</p>
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
              Parking & commercial
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-5">
              {parkingCards.map((card) => (
                <div key={card.key} className="flex flex-col items-center text-center">
                  <img src={card.icon} alt="" className="h-[62px] w-[62px] object-contain" />
                  <p className="mt-4 text-[1.15rem] font-semibold text-[#192643] lg:text-[1.25rem]">{card.label}</p>
                  <p className="mt-2 text-sm leading-7 lg:text-base">{firstNonEmpty(fields[card.key], "On request")}</p>
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
              Tours &amp; Media
            </h2>
            {isFieldNonEmpty(fields.expo_field_45) ? (
              <div>
                <div className="mb-0 inline-flex rounded-t-[10px] bg-[#ffd24d] px-6 py-2 text-base font-semibold uppercase text-white lg:px-7">
                  3D tour
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
                  Video
                </div>
                <VideoEmbedBlock
                  url={fields.expo_field_46}
                  title={fields.expo_field_02}
                />
              </div>
            ) : null}
            {isFieldNonEmpty(fields.expo_field_47) ? (
              <div>
                <div className="mb-0 inline-flex rounded-t-[10px] bg-[#ffd24d] px-6 py-2 text-base font-semibold uppercase text-white lg:px-7">
                  Media
                </div>
                <Tour3DBlock
                  url={fields.expo_field_47}
                  title={fields.expo_field_02 || "Media"}
                />
              </div>
            ) : null}
          </div>
        </Section>
      ) : null}

    </>
  );
}
