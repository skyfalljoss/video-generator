
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { DemoVideo } from "@/components/landing/DemoVideo";
import { Pricing } from "@/components/landing/Pricing";
import { Resources } from "@/components/landing/Resources";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-zinc-900">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <DemoVideo />
        <Pricing />
        <Resources />
      </main>
      <Footer />
    </div>
  );
}
