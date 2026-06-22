import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface HeroProps {
  onWatchDemo: () => void;
}

export function Hero({ onWatchDemo }: HeroProps) {
  const navigate = useNavigate();

  return (
    <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm">AI-Powered Plant Care</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Never Let Your Plants Die Again
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Track your plants, get personalized watering reminders, and
              diagnose health issues with our AI assistant. Keep your green
              friends thriving effortlessly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="bg-emerald-600 text-white px-8 py-4 rounded-full hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 group"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={onWatchDemo}
                className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full hover:border-emerald-600 hover:text-emerald-600 transition-colors"
              >
                Watch Demo
              </button>
            </div>
            <div className="flex items-center gap-8 mt-8">
              <div>
                <div className="font-bold text-2xl text-gray-900">50K+</div>
                <div className="text-sm text-gray-600">Happy Plant Parents</div>
              </div>
              <div>
                <div className="font-bold text-2xl text-gray-900">200K+</div>
                <div className="text-sm text-gray-600">Plants Saved</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-72 h-72 bg-emerald-200 rounded-full blur-3xl opacity-30"></div>
            <div className="absolute -bottom-4 -right-4 w-72 h-72 bg-teal-200 rounded-full blur-3xl opacity-30"></div>
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1772795786893-62866eb17226?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxpbmRvb3IlMjBwbGFudHMlMjBob21lJTIwY2FyZXxlbnwxfHx8fDE3Nzc3NDI4NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Indoor plants on windowsill"
              className="relative rounded-3xl shadow-2xl w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
