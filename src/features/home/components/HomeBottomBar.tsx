"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useBottomBarCallbacks } from "@/features/home/context/BottomBarContext";

const CLIP_PATH_ID = "home-bottom-bar-menu-clip";
const DURATION = "0.56s";
const BG_MENU = "rgba(0, 0, 0, 0.72)";
const BG_MENU_BLUR = "blur(10px)";

const FOOTER_LOGO_SRC = "/figma/home/footerLogo.svg";

const ITEMS = [
  { id: 0, title: "На главную", bgColorItem: "rgba(0, 0, 0, 0.72)", logoSrc: FOOTER_LOGO_SRC },
  { id: 1, title: "Вверх", bgColorItem: "rgba(0, 0, 0, 0.72)", Icon: ArrowUpIconSvg },
  { id: 2, title: "Поиск", bgColorItem: "rgba(0, 0, 0, 0.72)", Icon: SearchIconSvg },
  { id: 3, title: "Карта", bgColorItem: "rgba(0, 0, 0, 0.72)", Icon: MapIconSvg },
] as const;

const MENU_CSS = `
  .home-menu-bar {
    margin: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    width: 100%;
    font-size: 1.5em;
    padding: 0 1em;
    position: fixed;
    align-items: center;
    justify-content: center;
    background-color: ${BG_MENU};
    -webkit-backdrop-filter: ${BG_MENU_BLUR};
    backdrop-filter: ${BG_MENU_BLUR};
    -webkit-tap-highlight-color: transparent;
    z-index: 9999;
    border: none;
    border-top: 1px solid rgba(255, 255, 255, 0.15);
    box-shadow: none;
  }
  .home-menu-bar__item {
    all: unset;
    flex-grow: 1;
    z-index: 100;
    display: flex;
    cursor: pointer;
    position: relative;
    border-radius: 50%;
    align-items: center;
    will-change: transform;
    justify-content: center;
    padding: 0.55em 0 0.85em;
    transition: transform var(--timeOut, ${DURATION});
  }
  .home-menu-bar__item::before {
    content: "";
    z-index: -1;
    width: 4.2em;
    height: 4.2em;
    border-radius: 50%;
    position: absolute;
    transform: scale(0);
    transition: background-color ${DURATION}, transform ${DURATION};
  }
  .home-menu-bar__item.active {
    transform: translate3d(0, -0.8em, 0);
  }
  .home-menu-bar__item.active::before {
    transform: scale(1);
    background-color: var(--bgColorItem);
  }
  .home-menu-bar__icon {
    width: 2.6em;
    height: 2.6em;
    stroke: #246976;
    fill: transparent;
    stroke-width: 1pt;
    stroke-miterlimit: 10;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-dasharray: 400;
  }
  .home-menu-bar__item.active .home-menu-bar__icon {
    stroke: white;
  }
  .home-menu-bar__logo {
    width: 2.6em;
    height: 2.6em;
    object-fit: contain;
    display: block;
  }
  .home-menu-bar__border-wrap {
    left: 0;
    bottom: 100%;
    width: 10.9em;
    height: 2.4em;
    position: absolute;
    will-change: transform;
    transition: transform var(--timeOut, ${DURATION});
  }
  .home-menu-bar__border {
    position: absolute;
    inset: 0;
    clip-path: url(#${CLIP_PATH_ID});
    background-color: ${BG_MENU};
    -webkit-backdrop-filter: ${BG_MENU_BLUR};
    backdrop-filter: ${BG_MENU_BLUR};
  }
  .home-menu-bar__border-line {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  .home-menu-bar__border-line svg {
    width: 100%;
    height: 100%;
    display: block;
  }
  .home-menu-bar__border-line path {
    fill: none;
    stroke: #287691;
    stroke-width: 1px;
    vector-effect: non-scaling-stroke;
  }
  .home-menu-bar__svg-container {
    width: 0;
    height: 0;
    position: absolute;
    pointer-events: none;
  }
  @media screen and (max-width: 50em) {
    .home-menu-bar {
      font-size: 0.8em;
    }
  }
`;

function ArrowUpIconSvg({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SearchIconSvg({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function MapIconSvg({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function offsetMenuBorder(
  menuEl: HTMLElement | null,
  borderEl: HTMLElement | null,
  activeEl: HTMLElement | null,
) {
  if (!menuEl || !borderEl || !activeEl) return;
  const rect = activeEl.getBoundingClientRect();
  const menuRect = menuEl.getBoundingClientRect();
  const left =
    Math.floor(
      rect.left - menuRect.left - (borderEl.offsetWidth - rect.width) / 2,
    ) + "px";
  borderEl.style.transform = `translate3d(${left}, 0, 0)`;
}

export function HomeBottomBar() {
  const [activeIndex, setActiveIndex] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);
  const activeItemRef = useRef<HTMLButtonElement | null>(null);
  const { callbacks } = useBottomBarCallbacks();
  const router = useRouter();

  const defaults = useCallback(
    () => ({
      onGoHome: () => router.push("/"),
      onScrollToTop: () => window.scrollTo({ top: 0, behavior: "smooth" }),
      onOpenSearch: () => router.push("/#search"),
      onOpenMap: () => router.push("/#map"),
    }),
    [router],
  );

  const actions = useCallback(
    () => ({
      ...defaults(),
      ...callbacks,
    }),
    [callbacks, defaults],
  );

  const updateBorder = useCallback(() => {
    const menu = menuRef.current;
    const border = borderRef.current;
    const active = activeItemRef.current;
    offsetMenuBorder(menu, border, active);
  }, []);

  useEffect(() => {
    updateBorder();
  }, [activeIndex, updateBorder]);

  useEffect(() => {
    const handleResize = () => {
      if (menuRef.current) {
        menuRef.current.style.setProperty("--timeOut", "none");
      }
      updateBorder();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [updateBorder]);

  const handleClick = useCallback(
    (index: number) => {
      if (menuRef.current && activeIndex !== index) {
        menuRef.current.style.removeProperty("--timeOut");
      }
      setActiveIndex(index);
      const cb = actions();
      const run = () => {
        if (index === 0) cb.onGoHome();
        else if (index === 1) cb.onScrollToTop();
        else if (index === 2) cb.onOpenSearch();
        else cb.onOpenMap();
      };
      setTimeout(run, 0);
    },
    [activeIndex, actions],
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: MENU_CSS }} />
      <div
        className="home-menu-bar__svg-container"
        aria-hidden
      >
        <svg viewBox="0 0 202.9 45.5">
          <clipPath
            id={CLIP_PATH_ID}
            clipPathUnits="objectBoundingBox"
            transform="scale(0.0049285362247413 0.021978021978022)"
          >
            <path d="M6.7,45.5c5.7,0.1,14.1-0.4,23.3-4c5.7-2.3,9.9-5,18.1-10.5c10.7-7.1,11.8-9.2,20.6-14.3c5-2.9,9.2-5.2,15.2-7c7.1-2.1,13.3-2.3,17.6-2.1c4.2-0.2,10.5,0.1,17.6,2.1c6.1,1.8,10.2,4.1,15.2,7c8.8,5,9.9,7.1,20.6,14.3c8.3,5.5,12.4,8.2,18.1,10.5c9.2,3.6,17.6,4.2,23.3,4H6.7z" />
          </clipPath>
        </svg>
      </div>

      <nav
        ref={menuRef}
        role="navigation"
        aria-label="Главная навигация"
        className="home-menu-bar lg:hidden"
        style={{
          paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))",
        }}
      >
        {ITEMS.map((item, index) => (
          <button
            key={item.id}
            ref={activeIndex === index ? activeItemRef : undefined}
            type="button"
            className={`home-menu-bar__item ${activeIndex === index ? "active" : ""}`}
            style={{ "--bgColorItem": item.bgColorItem } as React.CSSProperties}
            onClick={() => handleClick(index)}
            aria-label={item.title}
            aria-current={activeIndex === index ? "true" : undefined}
          >
            {"logoSrc" in item ? (
              <img src={item.logoSrc} alt="" className="home-menu-bar__logo" />
            ) : (
              <item.Icon className="home-menu-bar__icon" />
            )}
          </button>
        ))}
        <div ref={borderRef} className="home-menu-bar__border-wrap" aria-hidden>
          <div className="home-menu-bar__border" />
          <div className="home-menu-bar__border-line" aria-hidden>
            <svg viewBox="0 0 202.9 45.5" preserveAspectRatio="none">
              <path d="M6.7,45.5c5.7,0.1,14.1-0.4,23.3-4c5.7-2.3,9.9-5,18.1-10.5c10.7-7.1,11.8-9.2,20.6-14.3c5-2.9,9.2-5.2,15.2-7c7.1-2.1,13.3-2.3,17.6-2.1c4.2-0.2,10.5,0.1,17.6,2.1c6.1,1.8,10.2,4.1,15.2,7c8.8,5,9.9,7.1,20.6,14.3c8.3,5.5,12.4,8.2,18.1,10.5c9.2,3.6,17.6,4.2,23.3,4" fill="none" stroke="#287691" strokeWidth="1" vectorEffect="nonScalingStroke" />
            </svg>
          </div>
        </div>
      </nav>
    </>
  );
}
