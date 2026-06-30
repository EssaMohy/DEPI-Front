import { useState } from "react";
import { Navbar } from "../components/landing/Navbar";
import { Hero } from "../components/landing/Hero";
import { Features } from "../components/landing/Features";
import { HowItWorks } from "../components/landing/HowItWorks";
import { Gallery } from "../components/landing/Gallery";
import { CTA } from "../components/landing/CTA";
import { DemoModal } from "../components/DemoModal";
import { Footer } from "../components/landing/Footer";

export function LandingPage() {
  const [showDemo, setShowDemo] = useState(false);

  const openDemo = () => setShowDemo(true);

  return (
    <div
      className="
      min-h-screen 
      bg-white
      scroll-smooth
      "
    >
      <Navbar />

      <section id="home">
        <Hero onWatchDemo={openDemo} />
      </section>

      <section id="features">
        <Features />
      </section>

      <section id="how-it-works">
        <HowItWorks />
      </section>

      <section id="gallery">
        <Gallery />
      </section>

      <section id="join-us">
        <CTA onWatchDemo={openDemo} />
      </section>

      <Footer />

      {showDemo && <DemoModal onClose={() => setShowDemo(false)} />}
    </div>
  );
}
