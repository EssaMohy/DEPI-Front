import { useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Thermometer,
  Sun,
  Droplets,
  Skull,
  Plus,
} from "lucide-react";

export default function PlantDetailsPage() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const plant = state?.plant || {
    commonName: "Monstera",
    scientificName: "Monstera Deliciosa",

    Family: "Araceae",
    Order: "Alismatales",
    Kingdom: "Plantae",

    about:
      "Monstera is a tropical plant famous for its beautiful leaves and easy indoor care.",

    HowToGrow: "Grow in bright indirect light and keep soil slightly moist.",

    Temperature: "18°C - 30°C",
    Light: "Bright indirect sunlight",
    Water: "Water every 7 days",
    toxicity: "Toxic to pets",

    image:
      "https://images.unsplash.com/photo-1775598369836-74f2e6c51095?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Image */}

      <div
        className="
        relative
        h-[420px]
        w-full
        "
      >
        <img
          src={plant.image}
          className="
          w-full
          h-full
          object-cover
          "
        />

        <button
          onClick={() => navigate(-1)}
          className="
          absolute
          top-6
          left-6
          bg-white
          rounded-full
          p-3
          shadow-lg
          hover:scale-105
          transition
          "
        >
          <ArrowLeft />
        </button>

        <div
          className="
          absolute
          bottom-6
          left-6
          bg-white/90
          px-5
          py-2
          rounded-full
          text-emerald-700
          font-semibold
          "
        >
          🌱 Indoor Plant
        </div>
      </div>

      {/* Details Section */}

      <div
        className="
        w-full
        bg-white
        p-8
        "
      >
        <div className="max-w-6xl mx-auto">
          {/* Title */}

          <h1
            className="
            text-5xl
            font-bold
            text-gray-900
            "
          >
            {plant.commonName}
          </h1>

          <p
            className="
            text-gray-500
            italic
            text-xl
            mt-3
            "
          >
            {plant.scientificName}
          </p>

          <div className="h-px bg-gray-200 my-8" />

          {/* Classification */}

          <section>
            <h2 className="text-3xl font-bold mb-5">
              Scientific Classification
            </h2>

            <div
              className="
              grid
              md:grid-cols-3
              gap-5
              "
            >
              {[
                ["Family", plant.Family],
                ["Order", plant.Order],
                ["Kingdom", plant.Kingdom],
              ].map((item) => (
                <div
                  key={item[0]}
                  className="
                  bg-emerald-50
                  rounded-2xl
                  p-5
                  "
                >
                  <p className="text-gray-500">{item[0]}</p>

                  <p
                    className="
                    text-emerald-700
                    font-bold
                    text-lg
                    "
                  >
                    {item[1]}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <div className="h-px bg-gray-200 my-10" />

          {/* About */}

          <section>
            <h2 className="text-3xl font-bold mb-4">About</h2>

            <p
              className="
              text-gray-600
              text-lg
              leading-8
              "
            >
              {plant.about}
            </p>
          </section>

          <div className="h-px bg-gray-200 my-10" />

          {/* Growing */}

          <section>
            <h2 className="text-3xl font-bold mb-4">How To Grow</h2>

            <p
              className="
              text-gray-600
              text-lg
              leading-8
              "
            >
              {plant.HowToGrow}
            </p>
          </section>

          <div className="h-px bg-gray-200 my-10" />

          {/* Care Guide */}

          <h2 className="text-3xl font-bold mb-6">Care Guide</h2>

          <div
            className="
            grid
            md:grid-cols-2
            gap-6
            "
          >
            <CareCard
              icon={<Thermometer />}
              title="Temperature"
              text={plant.Temperature}
            />

            <CareCard icon={<Sun />} title="Light" text={plant.Light} />

            <CareCard icon={<Droplets />} title="Water" text={plant.Water} />

            <CareCard icon={<Skull />} title="Toxicity" text={plant.toxicity} />
          </div>

          <button
            className="
            mt-10
            w-full
            bg-emerald-600
            text-white
            py-5
            rounded-2xl
            font-bold
            text-xl
            flex
            justify-center
            items-center
            gap-3
            hover:bg-emerald-700
            transition
            "
          >
            <Plus />
            Add to My Plants
          </button>
        </div>
      </div>
    </div>
  );
}

function CareCard({ icon, title, text }: any) {
  return (
    <div
      className="
      flex
      items-center
      gap-5
      bg-gray-50
      border
      rounded-2xl
      p-6
      "
    >
      <div
        className="
        bg-emerald-100
        text-emerald-700
        p-4
        rounded-xl
        "
      >
        {icon}
      </div>

      <div>
        <h3 className="font-bold text-lg">{title}</h3>

        <p className="text-gray-500">{text}</p>
      </div>
    </div>
  );
}
