import { Navbar } from "@/components/navbar";
import { ScrollProgress } from "@/components/scroll-progress";
import { TurboEgg } from "@/components/turbo-egg";
import { Hero } from "@/components/hero";
import { Ticker } from "@/components/ticker";
import { Playground } from "@/components/playground";
import { Benchmarks } from "@/components/benchmarks";
import { Features } from "@/components/features";
import { Migrate } from "@/components/migrate";
import { Cta } from "@/components/cta";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <TurboEgg />
      <main className="flex-1">
        <Hero />
        <Ticker />
        <Playground />
        <Benchmarks />
        <Ticker reverse />
        <Features />
        <Migrate />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
