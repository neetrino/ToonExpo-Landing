"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useBottomBarCallbacks } from "@/features/home/context/BottomBarContext";

const CONTACTS_SECTION_ID = "contacts";

/**
 * Регистрирует колбэки нижнего бара на лендинге проекта:
 * — Карта: прокрутка к футеру с картой (только этот проект)
 * — Главная/Поиск: переход на главную
 */
export function LandingBottomBarCallbacks({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setCallbacks } = useBottomBarCallbacks();
  const router = useRouter();

  useEffect(() => {
    setCallbacks({
      onGoHome: () => router.push("/"),
      onScrollToTop: () => window.scrollTo({ top: 0, behavior: "smooth" }),
      onOpenSearch: () => router.push("/#search"),
      onOpenMap: () => {
        document
          .getElementById(CONTACTS_SECTION_ID)
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      },
    });
    return () => setCallbacks(null);
  }, [setCallbacks, router]);

  return <>{children}</>;
}
