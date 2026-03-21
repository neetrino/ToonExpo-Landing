"use client";

/* eslint-disable @next/next/no-img-element */
import { useLayoutEffect, useRef, useState, type RefObject } from "react";

function usePaymentBodyCanExpand(
  text: string,
  expanded: boolean,
  textRef: RefObject<HTMLParagraphElement | null>,
) {
  const [canExpand, setCanExpand] = useState(false);

  useLayoutEffect(() => {
    const el = textRef.current;
    if (!el) {
      return;
    }
    const measure = () => {
      if (expanded) {
        setCanExpand(true);
        return;
      }
      setCanExpand(el.scrollHeight > el.clientHeight + 1);
    };
    const id = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- textRef կայուն է
  }, [text, expanded]);

  return canExpand;
}

/** Գինիջ վիճակում՝ մարմնի տեքստի նվազագույն բարձրություն ≈ 2 տող (12px, leading-4)։ */
const PAYMENT_CARD_COLLAPSED_BODY_MIN_H_CLASS = "min-h-[32px]";

/** Նախորդ 16px-ից +20% (16 × 1.2 ≈ 19)։ */
const PAYMENT_CHEVRON_PX = 19;

function PaymentChevron({ direction }: { direction: "up" | "down" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={PAYMENT_CHEVRON_PX}
      height={PAYMENT_CHEVRON_PX}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
      aria-hidden
    >
      {direction === "down" ? <path d="m6 9 6 6 6-6" /> : <path d="m18 15-6-6-6 6" />}
    </svg>
  );
}

type PaymentCardProps = {
  title: string;
  text: string;
  tone: "teal" | "gold" | "navy";
  icon: string;
};

export function PaymentCard({ title, text, tone, icon }: PaymentCardProps) {
  const [expanded, setExpanded] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);
  const canExpand = usePaymentBodyCanExpand(text, expanded, textRef);
  const toneClass =
    tone === "gold"
      ? "from-[#ffd24d] to-[rgba(255,210,77,0.9)] text-black"
      : tone === "navy"
        ? "from-[#192643] to-[rgba(25,38,67,0.9)] text-white"
        : "from-[#2ba8b0] to-[rgba(43,168,176,0.9)] text-white";
  const iconShellClass = tone === "gold" ? "bg-black/10" : "bg-white/20";
  const textClass = tone === "gold" ? "text-black/70" : "text-white/80";
  const chevronToneClass = tone === "gold" ? "text-black/80" : "text-white/90";
  const chevronFocusRing = tone === "gold" ? "focus-visible:ring-black/35" : "focus-visible:ring-white/50";
  const rowAlign = expanded ? "items-start" : "items-center";
  const showExpandControl = canExpand;

  const bodyClass = expanded
    ? `mt-1 text-[12px] leading-4 ${textClass}`
    : `mt-1 line-clamp-2 ${PAYMENT_CARD_COLLAPSED_BODY_MIN_H_CLASS} text-[12px] leading-4 ${textClass}`;

  return (
    <div className={`flex gap-4 rounded-[14px] bg-gradient-to-r px-4 py-4 ${toneClass} ${rowAlign}`}>
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${iconShellClass}`}>
        <img src={icon} alt="" className="h-6 w-6" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-bold leading-5">{title}</p>
        <p ref={textRef} className={bodyClass}>
          {text}
        </p>
      </div>
      <div className="flex w-[28px] shrink-0 flex-col justify-center self-start pt-0.5">
        {showExpandControl ? (
          <button
            type="button"
            className={`inline-flex cursor-pointer rounded-md p-0.5 opacity-90 transition hover:opacity-100 focus:outline-none focus-visible:ring-2 ${chevronFocusRing} ${chevronToneClass}`}
            aria-expanded={expanded}
            aria-label={expanded ? "Свернуть текст" : "Показать весь текст"}
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? <PaymentChevron direction="up" /> : <PaymentChevron direction="down" />}
          </button>
        ) : (
          <span className="inline-block min-h-[26px] min-w-[28px]" aria-hidden />
        )}
      </div>
    </div>
  );
}
