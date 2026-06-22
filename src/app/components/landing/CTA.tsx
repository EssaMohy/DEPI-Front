import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface CTAProps {
  onWatchDemo: () => void;
}

export function CTA({ onWatchDemo }: CTAProps) {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-gradient-to-br from-emerald-600 to-teal-700 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Ready to Transform Your Plant Care?
        </h2>
        <p className="text-xl mb-8 text-emerald-50">
          Join 50,000+ plant lovers who have already saved their green friends
          with PlantCare AI
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-white text-emerald-600 px-8 py-4 rounded-full hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2 group"
          >
            Get Started
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={onWatchDemo}
            className="border-2 border-white text-white px-8 py-4 rounded-full hover:bg-white/10 transition-colors"
          >
            Watch Demo
          </button>
        </div>
      </div>
    </section>
  );
}
