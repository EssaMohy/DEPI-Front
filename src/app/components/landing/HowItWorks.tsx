const steps = [
  {
    number: 1,
    title: "Add Your Plants",
    description:
      "Snap a photo or search our database of over 10,000 plant species to add them to your personal garden.",
  },
  {
    number: 2,
    title: "Get Personalized Care Plans",
    description:
      "Our AI creates custom care schedules based on your plant's needs, your location, and seasonal changes.",
  },
  {
    number: 3,
    title: "Watch Them Thrive",
    description:
      "Follow reminders, track growth, and get instant help when issues arise. Your plants will thank you!",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start your plant care journey in three simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="relative inline-block mb-6">
                <div className="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {step.number}
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-400 rounded-full"></div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
