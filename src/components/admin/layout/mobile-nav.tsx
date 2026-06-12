/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, type ReactNode } from "react";

interface MobileNavValue {
  /** Abre o drawer de navegação no mobile. */
  open: () => void;
}

const MobileNavContext = createContext<MobileNavValue | null>(null);

export function MobileNavProvider({
  open,
  children,
}: {
  open: () => void;
  children: ReactNode;
}) {
  return (
    <MobileNavContext.Provider value={{ open }}>
      {children}
    </MobileNavContext.Provider>
  );
}

/** Retorna a API do drawer mobile (ou null se fora do AdminShell). */
export function useMobileNav() {
  return useContext(MobileNavContext);
}
