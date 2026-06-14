// Roda dentro do BrowserRouter — quando a URL muda para /#alguma-coisa,
// faz smooth scroll até o elemento com aquele id. Funciona tanto navegando
// de outra página (montagem nova) quanto trocando só a hash na mesma página.
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function ScrollToHash() {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const id = hash.slice(1);
    // requestAnimationFrame espera o DOM renderizar; aceita um pequeno
    // delay extra para dados vindos do CMS que ainda estão carregando.
    const tentar = (resto = 6) => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      if (resto > 0) requestAnimationFrame(() => tentar(resto - 1));
    };
    requestAnimationFrame(() => tentar());
  }, [hash, pathname]);

  return null;
}
