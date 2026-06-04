import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { QuickActions } from "@/components/sections/QuickActions";
import { Principios } from "@/components/sections/Principios";
import { FatosRelevantes } from "@/components/sections/FatosRelevantes";
import { AvisoLegal } from "@/components/sections/AvisoLegal";
import { Footer } from "@/components/sections/Footer";

export function PortalRI() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <QuickActions />
        <Principios />
        <FatosRelevantes />
        <AvisoLegal />
      </main>
      <Footer />
    </div>
  );
}
