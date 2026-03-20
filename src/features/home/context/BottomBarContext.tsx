"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

export type BottomBarCallbacks = {
  onGoHome: () => void;
  onScrollToTop: () => void;
  onOpenSearch: () => void;
  onOpenMap: () => void;
};

type BottomBarContextValue = {
  callbacks: BottomBarCallbacks | null;
  setCallbacks: (c: BottomBarCallbacks | null) => void;
};

const BottomBarContext = createContext<BottomBarContextValue | null>(null);

export function BottomBarProvider({ children }: { children: ReactNode }) {
  const [callbacks, setCallbacks] = useState<BottomBarCallbacks | null>(null);
  return (
    <BottomBarContext.Provider value={{ callbacks, setCallbacks }}>
      {children}
    </BottomBarContext.Provider>
  );
}

export function useBottomBarCallbacks(): BottomBarContextValue {
  const ctx = useContext(BottomBarContext);
  if (!ctx) {
    throw new Error("useBottomBarCallbacks must be used within BottomBarProvider");
  }
  return ctx;
}
