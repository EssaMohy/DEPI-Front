import {
  Droplet,
  Heart,
  Camera,
  Bell,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

const features = [
  {
    icon: Droplet,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    title: "Smart Watering Reminders",
    description:
      "Get personalized watering schedules based on plant species, season, and local weather conditions. Never over or underwater again.",
  },
  {
    icon: Camera,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    title: "AI Health Diagnosis",
    description:
      "Snap a photo of your plant and our AI will identify diseases, pest problems, and nutrient deficiencies instantly.",
  },
  {
    icon: Heart,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    title: "Plant Library",
    description:
      "Track all your plants in one place with detailed care profiles, growth history, and personalized tips for each species.",
  },
  {
    icon: Bell,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    title: "Custom Notifications",
    description:
      "Receive timely alerts for watering, fertilizing, repotting, and seasonal care tasks tailored to each plant's needs.",
  },
  {
    icon: Sparkles,
    iconBg: "bg-teal-100",
    iconColor: "text-teal-600",
    title: "Expert Recommendations",
    description:
      "Get AI-powered suggestions for optimal placement, light conditions, humidity levels, and care routines for thriving plants.",
  },
  {
    icon: CheckCircle2,
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
    title: "Care History",
    description:
      "Log watering, fertilizing, and other care activities to track patterns and optimize your plant care routine over time.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Care for Your Plants
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Powerful features designed to make plant care simple, intelligent,
            and enjoyable
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow"
              >
                <div
                  className={`w-14 h-14 ${feature.iconBg} rounded-2xl flex items-center justify-center mb-6`}
                >
                  <Icon className={`w-7 h-7 ${feature.iconColor}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
