"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Variant = "desktop" | "mobile";

type ContactFabMenuProps = {
  phone?: string;
  instagram?: string;
  facebook?: string;
  website?: string;
  variant: Variant;
  toggleLabel: string;
};

type LinkItem = {
  id: "phone" | "instagram" | "facebook" | "website";
  href: string;
  external: boolean;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
};

function PhoneIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.36 11.36 0 003.56.57 1 1 0 011 1V21a1 1 0 01-1 1A17 17 0 013 5a1 1 0 011-1h3.5a1 1 0 011 1 11.36 11.36 0 00.57 3.56 1 1 0 01-.25 1.01l-2.2 2.22z" />
    </svg>
  );
}

function InstagramIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M7.75 2h8.5A5.75 5.75 0 0122 7.75v8.5A5.75 5.75 0 0116.25 22h-8.5A5.75 5.75 0 012 16.25v-8.5A5.75 5.75 0 017.75 2zm0 1.8A3.95 3.95 0 003.8 7.75v8.5a3.95 3.95 0 003.95 3.95h8.5a3.95 3.95 0 003.95-3.95v-8.5a3.95 3.95 0 00-3.95-3.95h-8.5zm8.85 1.35a1.15 1.15 0 110 2.3 1.15 1.15 0 010-2.3zM12 7.1A4.9 4.9 0 1112 16.9 4.9 4.9 0 0112 7.1zm0 1.8A3.1 3.1 0 1012 15.1 3.1 3.1 0 0012 8.9z" />
    </svg>
  );
}

function FacebookIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M13.6 22v-8.2h2.76l.42-3.2H13.6V8.55c0-.93.26-1.56 1.6-1.56h1.72V4.1A22.1 22.1 0 0014.4 4c-2.5 0-4.2 1.53-4.2 4.35v2.42H7.4v3.2h2.8V22h3.4z" />
    </svg>
  );
}

function GlobeIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="M3 12h18M12 3a13.8 13.8 0 010 18M12 3a13.8 13.8 0 000 18" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function sanitizePhone(raw: string | undefined): string {
  return (raw?.trim() ?? "").split(/[\n,]/)[0].trim().replace(/\s/g, "");
}

function toExternalHref(raw: string | undefined): string {
  const value = raw?.trim() ?? "";
  if (!value) {
    return "";
  }
  if (/^https?:\/\//i.test(value)) {
    return value;
  }
  return `https://${value}`;
}

export function ContactFabMenu({
  phone,
  instagram,
  facebook,
  website,
  variant,
  toggleLabel,
}: ContactFabMenuProps) {
  const [open, setOpen] = useState(false);
  const [typedContactLabel, setTypedContactLabel] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const cleanedPhone = sanitizePhone(phone);

  const links = useMemo<LinkItem[]>(
    () => [
      {
        id: "phone",
        href: cleanedPhone ? `tel:${cleanedPhone}` : "",
        external: false,
        label: "Phone",
        Icon: PhoneIcon,
      },
      {
        id: "instagram",
        href: toExternalHref(instagram),
        external: true,
        label: "Instagram",
        Icon: InstagramIcon,
      },
      {
        id: "facebook",
        href: toExternalHref(facebook),
        external: true,
        label: "Facebook",
        Icon: FacebookIcon,
      },
      {
        id: "website",
        href: toExternalHref(website),
        external: true,
        label: "Website",
        Icon: GlobeIcon,
      },
    ],
    [cleanedPhone, instagram, facebook, website],
  );

  // If nothing to show at all, do not render widget.
  if (!links.some((item) => item.href)) {
    return null;
  }

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  // Main hint typing effect to draw attention.
  useEffect(() => {
    const fullText = "Կապ կառուցապատողի հետ";
    let index = 0;
    let stopped = false;
    let resetTimeout: ReturnType<typeof setTimeout> | null = null;
    let tickTimeout: ReturnType<typeof setTimeout> | null = null;

    const run = () => {
      if (stopped) {
        return;
      }
      if (index <= fullText.length) {
        setTypedContactLabel(fullText.slice(0, index));
        index += 1;
        tickTimeout = setTimeout(run, 190);
        return;
      }
      resetTimeout = setTimeout(() => {
        index = 0;
        run();
      }, 7200);
    };

    run();
    return () => {
      stopped = true;
      if (tickTimeout) {
        clearTimeout(tickTimeout);
      }
      if (resetTimeout) {
        clearTimeout(resetTimeout);
      }
    };
  }, []);

  const positionClass =
    variant === "desktop"
      ? "fixed bottom-20 right-20 z-[9998] hidden lg:block"
      : "fixed right-4 z-[9998]";
  const positionStyle =
    variant === "mobile"
      ? ({ bottom: "calc(5.75rem + env(safe-area-inset-bottom))" } as const)
      : undefined;
  const contactBuilderLabel = "Կապ հաստատել կառուցապատողի հետ";

  return (
    <div ref={rootRef} className={positionClass} style={positionStyle}>
      <div
        className={`absolute right-0 bottom-[calc(100%+0.75rem)] flex flex-col gap-2 rounded-2xl border border-[#FFD34D]/35 bg-[#111827]/88 p-2 backdrop-blur-md shadow-[0_14px_38px_rgba(0,0,0,0.45)] transition-all duration-200 ${
          open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
        }`}
      >
        {links.map((item) => {
          const iconClass =
            "inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/5 text-white transition";
          if (!item.href) {
            return (
              <span
                key={item.id}
                aria-hidden
                className={`${iconClass} cursor-not-allowed opacity-35`}
                title={item.label}
              >
                <item.Icon className="h-5 w-5" />
              </span>
            );
          }
          return (
            <div key={item.id} className="relative">
              {item.id === "phone" && cleanedPhone ? (
                <div className="pointer-events-none absolute right-[calc(100%+0.6rem)] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg border border-[#FFD34D]/45 bg-[#111827]/76 px-3 py-1.5 text-[0.72rem] font-semibold tracking-[0.04em] text-white backdrop-blur-md shadow-[0_8px_20px_rgba(0,0,0,0.32)]">
                  {cleanedPhone}
                </div>
              ) : null}
              <a
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noreferrer" : undefined}
                aria-label={item.label}
                className={`${iconClass} hover:border-[#FFD34D]/70 hover:bg-[#FFD34D]/10 hover:text-[#FFD34D]`}
              >
                <item.Icon className="h-5 w-5" />
              </a>
            </div>
          );
        })}
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute right-[calc(100%+0.6rem)] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg border border-[#FFD34D]/45 bg-[#111827]/76 px-3 py-1.5 text-[0.72rem] font-semibold tracking-[0.04em] text-white backdrop-blur-md shadow-[0_8px_20px_rgba(0,0,0,0.32)]">
          {typedContactLabel}
          <span
            aria-hidden
            className="ml-1 inline-block h-[0.95em] w-[2px] rounded-full bg-[#FFD34D] align-[-0.08em] shadow-[0_0_10px_rgba(255,211,77,0.6)]"
            style={{ animation: "caretBlink 1.05s steps(1, end) infinite" }}
          />
        </div>
        <button
          type="button"
          aria-label={toggleLabel}
          onClick={() => setOpen((prev) => !prev)}
          className="relative inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#FFD34D] text-black shadow-[0_6px_20px_rgba(255,211,77,0.55)] transition hover:brightness-110 active:scale-95 lg:h-14 lg:w-14"
        >
          <span className="absolute inset-0 rounded-full bg-[#FFD34D] opacity-60 animate-ping" />
          <PhoneIcon className="relative h-6 w-6 shrink-0" />
        </button>
      </div>
      <style jsx>{`
        @keyframes caretBlink {
          0%,
          45% {
            opacity: 1;
            transform: translateY(0) scaleY(1);
          }
          46%,
          54% {
            opacity: 0.05;
            transform: translateY(0) scaleY(0.9);
          }
          55%,
          100% {
            opacity: 1;
            transform: translateY(0) scaleY(1);
          }
        }
      `}</style>
    </div>
  );
}
