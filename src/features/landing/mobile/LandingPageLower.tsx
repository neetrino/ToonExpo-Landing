"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  CalendarClock,
  CircleDollarSign,
  Landmark,
  Percent,
  Ruler,
  Wallet,
} from "lucide-react";
import type { ExpoMap } from "@/features/landing/mobile/lib/blockVisibility";
import { visibleBlocks } from "@/features/landing/mobile/lib/blockVisibility";
import { LANDING_LUCIDE_STROKE } from "@/features/landing/lib/lucideLandingStyle";
import {
  MOBILE_SECTION_INSET,
  participantFigmaAssets,
} from "@/features/landing/mobile/landingPage.constants";
import { constructionCards } from "@/features/landing/landingPage.constants";
import { GalleryLightbox } from "@/features/landing/GalleryLightbox";
import { RemoteAwareImage } from "@/shared/components/RemoteAwareImage";
import { resolveGalleryItems } from "@/features/landing/lib/resolveGalleryImageUrls";
import { ConstructionDetailIcon } from "@/features/landing/components/ConstructionDetailIcon";
import { HY_UI } from "@/shared/i18n/hyUi.constants";
import { PROJECT_FIELD } from "@/shared/constants/expoFieldKeys";
import {
  firstNonEmpty,
  getProjectMedia,
  parseSizeOptions,
} from "@/features/landing/mobile/landingPage.helpers";
import { PaymentCard } from "@/features/landing/mobile/PaymentCard";
import type { ResolvedProjectFolderMedia } from "@/features/landing/lib/projectFolderMedia.types";
import { formatAreasWithSqmSuffix } from "@/shared/lib/formatAreasDisplay";
import { formatPriceMinForDisplay } from "@/shared/lib/formatPriceMinDisplay";

type Props = {
  fields: ExpoMap;
  title: string;
  folderMedia: ResolvedProjectFolderMedia | null;
};

function InvestmentCard({
  title,
  text,
  Icon,
}: {
  title: string;
  text: string;
  Icon: LucideIcon;
}) {
  return (
    <div className="rounded-[14px] bg-gradient-to-r from-[#2ba8b0] to-[rgba(43,168,176,0.9)] px-5 py-5 text-white">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white/20">
          <Icon
            aria-hidden
            className="h-9 w-9 text-white"
            strokeWidth={LANDING_LUCIDE_STROKE}
          />
        </div>
        <div className="min-w-0">
          <p className="text-[14px] font-semibold leading-snug tracking-wide text-white/80">{title}</p>
          <p className="mt-2 text-[17px] font-bold leading-snug text-white">{text}</p>
        </div>
      </div>
    </div>
  );
}

export function LandingPageLower({ fields, title, folderMedia }: Props) {
  const F = PROJECT_FIELD;
  const vis = visibleBlocks(fields);
  const media = getProjectMedia(fields);
  const galleryResolved = useMemo(() => resolveGalleryItems(media, folderMedia), [folderMedia, media]);
  const galleryImages = useMemo(
    () => galleryResolved.map((item) => item.fullUrl),
    [galleryResolved],
  );
  const [galleryLightboxIndex, setGalleryLightboxIndex] = useState<number | null>(null);
  const sizeOptions = useMemo(() => parseSizeOptions(fields[F.areas]), [fields, F.areas]);
  const defaultSizeIndex = sizeOptions.length > 3 ? 3 : 0;
  const [selectedSize, setSelectedSize] = useState(defaultSizeIndex);
  const sizeRange = firstNonEmpty(
    sizeOptions[0] && sizeOptions[sizeOptions.length - 1]
      ? `${sizeOptions[0]} m² - ${sizeOptions[sizeOptions.length - 1]} m².`
      : "",
    "30.7 m² - 60.5 m².",
  );
  const paymentCards = [
    {
      title: HY_UI.PAYMENT_INSTALLMENT,
      text: firstNonEmpty(fields[F.paymentOptions], "Strong rental demand year-round"),
      tone: "teal" as const,
      Icon: Wallet,
    },
    {
      title: HY_UI.PAYMENT_MORTGAGE,
      text: firstNonEmpty(fields[F.bank], "Ski-in/ski-out access"),
      tone: "gold" as const,
      Icon: Landmark,
    },
    {
      title: HY_UI.PAYMENT_TAX,
      text: firstNonEmpty(fields[F.taxRefund], "30% down, installments until 2027"),
      tone: "navy" as const,
      Icon: Percent,
    },
  ];
  const investmentCards = [
    {
      title: HY_UI.INVEST_CARD_COMPLETION,
      text: firstNonEmpty(fields[F.completion], "Strong year-round rental demand"),
      Icon: CalendarClock,
    },
    {
      title: HY_UI.INVEST_CARD_AREAS,
      text: firstNonEmpty(
        formatAreasWithSqmSuffix(fields[F.areas]),
        "Premium pricing for better views",
      ),
      Icon: Ruler,
    },
    {
      title: HY_UI.INVEST_CARD_PRICE_PER_SQM,
      text: firstNonEmpty(
        formatPriceMinForDisplay(fields[F.priceMin]),
        "Ski season premium rates",
      ),
      Icon: CircleDollarSign,
    },
  ];
  const showGallery =
    (folderMedia?.galleryUrls.length ?? 0) > 0 || galleryResolved.length > 0;
  const showPayment = vis.payment;
  const showConstruction = vis.construction;
  const showOptions = sizeOptions.length > 0;

  useEffect(() => {
    const openFromHero = () => {
      if (galleryImages.length > 0) {
        setGalleryLightboxIndex(0);
      }
    };

    window.addEventListener("toon:open-mobile-gallery", openFromHero);
    return () => {
      window.removeEventListener("toon:open-mobile-gallery", openFromHero);
    };
  }, [galleryImages.length]);

  return (
    <>
      {vis.investment ? (
        <section id="investment" className={`${MOBILE_SECTION_INSET} pt-6`}>
          <div className="flex flex-col items-start">
            <h2 className="text-[clamp(1.35rem,4.5vw,1.75rem)] font-bold leading-tight tracking-wide text-[#101828]">
              {HY_UI.MOBILE_INVESTMENT_HIGHLIGHTS}
            </h2>
            <span
              className="mt-3 h-0.5 w-14 rounded-full bg-[#2ba8b0]"
              aria-hidden
            />
          </div>
          <div className="mt-4 space-y-3">
            {investmentCards.map((item) => (
              <InvestmentCard key={item.title} title={item.title} text={item.text} Icon={item.Icon} />
            ))}
          </div>
        </section>
      ) : null}

      {showGallery ? (
        <section id="gallery" className={`${MOBILE_SECTION_INSET} pt-8`}>
          <div className="flex items-center justify-between">
            <h2 className="text-[20px] font-bold leading-7 text-[#101828]">{HY_UI.GALLERY_PREVIEW}</h2>
            {galleryImages.length > 1 ? (
              <button
                type="button"
                onClick={() => setGalleryLightboxIndex(0)}
                className="text-[14px] font-semibold uppercase leading-5 text-[#2ba8b0]"
              >
                {HY_UI.CTA_VIEW_ALL}
              </button>
            ) : null}
          </div>
          {galleryResolved[0] ? (
            <div className="mt-3 overflow-hidden rounded-[14px]">
              <button
                type="button"
                onClick={() => setGalleryLightboxIndex(0)}
                className="relative block h-48 w-full cursor-zoom-in overflow-hidden p-0"
                aria-label={`Open gallery: ${title}`}
              >
                <RemoteAwareImage
                  src={galleryResolved[0].thumbUrl}
                  alt={`${title} gallery`}
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
              </button>
            </div>
          ) : null}
          {galleryResolved.length === 2 ? (
            <div className="mt-3 overflow-hidden rounded-[14px]">
              <button
                type="button"
                onClick={() => setGalleryLightboxIndex(1)}
                className="relative block h-40 w-full cursor-zoom-in overflow-hidden p-0"
                aria-label="Gallery image 2"
              >
                <RemoteAwareImage
                  src={galleryResolved[1].thumbUrl}
                  alt=""
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
              </button>
            </div>
          ) : null}
          {galleryResolved.length > 2 ? (
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="overflow-hidden rounded-[14px]">
                <button
                  type="button"
                  onClick={() => setGalleryLightboxIndex(1)}
                  className="relative block h-40 w-full cursor-zoom-in overflow-hidden p-0"
                  aria-label="Gallery image 2"
                >
                  <RemoteAwareImage
                    src={galleryResolved[1].thumbUrl}
                    alt=""
                    fill
                    sizes="50vw"
                    className="object-cover"
                  />
                </button>
              </div>
              <div className="overflow-hidden rounded-[14px]">
                <button
                  type="button"
                  onClick={() => setGalleryLightboxIndex(2)}
                  className="relative block h-40 w-full cursor-zoom-in overflow-hidden p-0"
                  aria-label="Gallery image 3"
                >
                  <RemoteAwareImage
                    src={galleryResolved[2].thumbUrl}
                    alt=""
                    fill
                    sizes="50vw"
                    className="object-cover"
                  />
                </button>
              </div>
            </div>
          ) : null}

          <GalleryLightbox
            images={galleryImages}
            isOpen={galleryLightboxIndex !== null}
            initialIndex={galleryLightboxIndex ?? 0}
            onClose={() => setGalleryLightboxIndex(null)}
            imageAltBase={title}
          />
        </section>
      ) : null}

      {showOptions ? (
        <section id="options" className="pt-4">
          <div className={`${MOBILE_SECTION_INSET}`}>
            <h2 className="text-[20px] font-bold leading-7 text-[#101828]">{HY_UI.MOBILE_APARTMENT_OPTIONS}</h2>
            <div className="mt-5 space-y-2 text-[16px] leading-7 text-black">
              <p>
                <span className="font-bold">{HY_UI.MOBILE_LABEL_SIZES}</span> {sizeRange}
              </p>
              <p className="max-w-[281px]">
                <span className="font-bold">{HY_UI.MOBILE_LABEL_FLOOR}</span>{" "}
                {firstNonEmpty(fields[F.elevators], "12-13 units per floor depending on level.")}
              </p>
            </div>
            <div className="mt-5 grid grid-cols-4 gap-2.5">
              {sizeOptions.map((size, index) => {
                const isActive = index === selectedSize;

                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(index)}
                    className={`rounded-[4px] border-[3.551px] px-1 py-3 text-center ${
                      isActive ? "border-[#2ba8b0] bg-[#2ba8b0] text-white" : "border-[#2ba8b0] bg-white text-[#2ba8b0]"
                    }`}
                  >
                    <span className="block text-[20px] font-semibold leading-7">{size}</span>
                    <span className="block text-[12px] font-medium leading-4">m²</span>
                  </button>
                );
              })}
            </div>
            <div className="mt-6 flex items-center gap-3">
              <img src={participantFigmaAssets.sizeNoteIcon} alt="" className="h-8 w-8 shrink-0" />
              <p className="text-[14px] leading-5 text-black">{HY_UI.MOBILE_SELECT_SIZE_HINT}</p>
            </div>
          </div>
        </section>
      ) : null}

      {showPayment ? (
        <section id="payment" className={`${MOBILE_SECTION_INSET} pt-8`}>
          <h2 className="text-[20px] font-bold leading-7 text-[#101828]">{HY_UI.SECTION_PAYMENT}</h2>
          <div className="mt-4 space-y-3">
            {paymentCards.map((card) => (
              <PaymentCard key={card.title} title={card.title} text={card.text} tone={card.tone} Icon={card.Icon} />
            ))}
          </div>
        </section>
      ) : null}

      {showConstruction ? (
        <section id="construction" className="mt-8 bg-[#192643] py-8 text-white">
          <div className={MOBILE_SECTION_INSET}>
            <h2 className="text-[20px] font-bold uppercase leading-7 text-[#2ba8b0]">
              {HY_UI.SECTION_CONSTRUCTION}
            </h2>
            <div className="mt-4 space-y-3">
              {constructionCards.map((card) => (
                <div
                  key={card.key}
                  className="flex items-start gap-3 rounded-[12px] border border-white/10 bg-white/5 px-3 py-3"
                >
                  <div className="mt-0.5 shrink-0 origin-top-left scale-[0.7]">
                    <ConstructionDetailIcon variant={card.iconVariant} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold leading-5 text-[#2ba8b0]">{card.key}</p>
                    <p className="mt-1 text-[12px] leading-[1.4] text-white/90">
                      {firstNonEmpty(fields[card.key], HY_UI.ON_REQUEST)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
