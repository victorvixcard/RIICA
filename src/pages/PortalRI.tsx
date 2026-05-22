import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { QuickActions } from "@/components/sections/QuickActions";
import { InfoGrid } from "@/components/sections/InfoGrid";
import { Purpose } from "@/components/sections/Purpose";
import { Footer } from "@/components/sections/Footer";

export function PortalRI() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <QuickActions />
        <InfoGrid />
        <Purpose />
      </main>
      <Footer />
    </div>
  );
}
