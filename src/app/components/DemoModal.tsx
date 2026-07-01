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
        "Track growth history, log care activities, and watch your plant collection flourish.",
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
      setCurrentStep((prev) => prev + 1);
    } else {
      handleGetStarted();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-3 sm:p-5">
      <div
        className="
        bg-white 
        rounded-2xl 
        w-full 
        max-w-4xl
        max-h-[95vh]
        overflow-y-auto
      "
      >
        {/* Header */}
        <div
          className="
          flex 
          items-center 
          justify-between 
          p-4 
          sm:p-6
          border-b
        "
        >
          <div className="flex items-center gap-3">
            <div
              className={`
                w-10 h-10
                sm:w-12 sm:h-12
                rounded-xl
                flex items-center justify-center
                ${getColorClasses(step.color)}
              `}
            >
              <Play className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>

            <div>
              <h2 className="text-lg sm:text-2xl font-bold text-gray-900">
                Plantera Demo
              </h2>

              <p className="text-xs sm:text-sm text-gray-600">
                See how it works in 4 simple steps
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="p-4 sm:p-8">
          {/* Progress */}
          <div className="flex justify-center gap-2 mb-6 sm:mb-8">
            {demoSteps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`
                  h-2 rounded-full transition-all
                  ${
                    index === currentStep
                      ? "w-8 bg-emerald-600"
                      : "w-2 bg-gray-300"
                  }
                `}
              />
            ))}
          </div>

          {/* Content */}

          <div
            className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-6
            sm:gap-8
            items-center
            mb-8
          "
          >
            <div>
              <div
                className={`
                  inline-flex
                  items-center
                  gap-2
                  px-3 py-1
                  rounded-full
                  text-sm
                  font-medium
                  mb-4
                  ${getColorClasses(step.color)}
                `}
              >
                <Icon className="w-4 h-4" />
                Step {currentStep + 1} of {demoSteps.length}
              </div>

              <h3
                className="
                text-2xl
                sm:text-3xl
                font-bold
                text-gray-900
                mb-4
              "
              >
                {step.title}
              </h3>

              <p
                className="
                text-base
                sm:text-lg
                text-gray-600
                leading-relaxed
                mb-6
              "
              >
                {step.description}
              </p>

              <div className="space-y-3">
                {[
                  "Add plants with photos & details",
                  "Smart care reminders",
                  "AI plant health analysis",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span className="text-gray-700 text-sm sm:text-base">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Image */}

            <div className="relative">
              <div
                className="
                absolute
                -inset-4
                bg-gradient-to-br
                from-emerald-400
                to-teal-400
                rounded-2xl
                blur-2xl
                opacity-20
              "
              />

              <ImageWithFallback
                src={step.image}
                alt={step.title}
                className="
                  relative
                  rounded-xl
                  shadow-2xl
                  w-full
                  h-52
                  sm:h-72
                  md:h-80
                  object-cover
                "
              />
            </div>
          </div>

          {/* Buttons */}

          <div
            className="
            flex
            flex-col-reverse
            sm:flex-row
            sm:justify-between
            gap-3
            pt-6
            border-t
          "
          >
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="
                px-6 py-3
                rounded-lg
                font-medium
                text-gray-700
                hover:bg-gray-100
                disabled:text-gray-400
              "
            >
              Previous
            </button>

            <div
              className="
              flex
              flex-col
              sm:flex-row
              gap-3
            "
            >
              <button
                onClick={onClose}
                className="
                  px-6 py-3
                  border
                  rounded-lg
                  font-medium
                "
              >
                Skip Demo
              </button>

              <button
                onClick={handleNext}
                className="
                  px-6 py-3
                  bg-emerald-600
                  text-white
                  rounded-lg
                  font-medium
                  flex
                  items-center
                  justify-center
                  gap-2
                "
              >
                {currentStep === demoSteps.length - 1 ? (
                  "Get Started"
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
