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
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero onWatchDemo={openDemo} />
      <Features />
      <HowItWorks />
      <Gallery />
      <CTA onWatchDemo={openDemo} />
      <Footer />
      {showDemo && <DemoModal onClose={() => setShowDemo(false)} />}
    </div>
  );
}
