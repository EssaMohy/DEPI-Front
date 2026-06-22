import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  Play,
  Droplet,
  Camera,
  Leaf,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface DemoModalProps {
  onClose: () => void;
}

export function DemoModal({ onClose }: DemoModalProps) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const demoSteps = [
    {
      title: "Track All Your Plants",
      description:
        "Add your plants to your personal collection with photos, species info, and custom care schedules.",
      image:
        "https://images.unsplash.com/photo-1772795786893-62866eb17226?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
      icon: Leaf,
      color: "emerald",
    },
    {
      title: "Never Miss Watering",
      description:
        "Get smart reminders based on each plant's needs. See at a glance which plants need attention today.",
      image:
        "https://images.unsplash.com/photo-1777383504353-77974872c2ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
      icon: Droplet,
      color: "blue",
    },
    {
      title: "AI Health Diagnosis",
      description:
        "Snap a photo of your plant and get instant AI-powered analysis of health issues, diseases, and treatment recommendations.",
      image:
        "https://images.unsplash.com/photo-1775598369836-74f2e6c51095?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
      icon: Camera,
      color: "purple",
    },
    {
      title: "Watch Them Thrive",
      description:
        "Track growth history, log care activities, and watch your plant collection flourish with data-driven insights.",
      image:
        "https://images.unsplash.com/photo-1735973634121-d93cf7c94b44?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
      icon: CheckCircle2,
      color: "green",
    },
  ];

  const step = demoSteps[currentStep];
  const Icon = step.icon;

  const getColorClasses = (color: string) => {
    switch (color) {
      case "emerald":
        return "bg-emerald-100 text-emerald-600";
      case "blue":
        return "bg-blue-100 text-blue-600";
      case "purple":
        return "bg-purple-100 text-purple-600";
      case "green":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const handleGetStarted = () => {
    onClose();
    navigate("/dashboard");
  };

  const handleNext = () => {
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleGetStarted();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${getColorClasses(step.color)}`}
            >
              <Play className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                PlantCare AI Demo
              </h2>
              <p className="text-sm text-gray-600">
                See how it works in 4 simple steps
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8">
          {/* Progress indicators */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {demoSteps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentStep
                    ? "w-8 bg-emerald-600"
                    : index < currentStep
                      ? "w-2 bg-emerald-400"
                      : "w-2 bg-gray-300"
                }`}
              />
            ))}
          </div>

          {/* Content */}
          <div className="grid md:grid-cols-2 gap-8 items-center mb-8">
            <div>
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4 ${getColorClasses(step.color)}`}
              >
                <Icon className="w-4 h-4" />
                Step {currentStep + 1} of {demoSteps.length}
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                {step.title}
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                {step.description}
              </p>

              {/* Key features for this step */}
              <div className="space-y-3">
                {currentStep === 0 && (
                  <>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      <span className="text-gray-700">
                        Add plants with photos & details
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      <span className="text-gray-700">
                        Search 10,000+ plant species
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      <span className="text-gray-700">
                        Organize your plant collection
                      </span>
                    </div>
                  </>
                )}
                {currentStep === 1 && (
                  <>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      <span className="text-gray-700">
                        Personalized watering schedules
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      <span className="text-gray-700">
                        Smart countdown timers
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      <span className="text-gray-700">
                        One-click watering logs
                      </span>
                    </div>
                  </>
                )}
                {currentStep === 2 && (
                  <>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      <span className="text-gray-700">Upload plant photos</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      <span className="text-gray-700">
                        AI disease detection
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      <span className="text-gray-700">
                        Get treatment recommendations
                      </span>
                    </div>
                  </>
                )}
                {currentStep === 3 && (
                  <>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      <span className="text-gray-700">Track care history</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      <span className="text-gray-700">
                        Monitor plant health
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      <span className="text-gray-700">
                        View growth insights
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-2xl blur-2xl opacity-20"></div>
              <ImageWithFallback
                src={step.image}
                alt={step.title}
                className="relative rounded-xl shadow-2xl w-full h-80 object-cover"
              />
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                currentStep === 0
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Previous
            </button>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Skip Demo
              </button>
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium flex items-center gap-2"
              >
                {currentStep === demoSteps.length - 1 ? (
                  <>Get Started</>
                ) : (
                  <>
                    Next
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
