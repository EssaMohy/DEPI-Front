import { useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Thermometer,
  Sun,
  Droplets,
  Skull,
  Plus,
  Leaf,
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

    category: "Indoor Plant",

    about:
      "Monstera is a tropical plant famous for its beautiful leaves and easy indoor care.",

    HowToGrow: "Grow in bright indirect light and keep soil slightly moist.",

    Temperature: "18°C - 30°C",

    Light: "Bright indirect sunlight",

    Water: "Water every 7 days",

    toxicity: "Toxic to pets",

    image: "https://images.unsplash.com/photo-1775598369836-74f2e6c51095",
  };

  return (
    <div
      className="
min-h-screen
py-8
"
    >
      <button
        onClick={() => navigate(-1)}
        className="
mb-6
bg-white
p-3
rounded-full
shadow
hover:scale-105
transition
"
      >
        <ArrowLeft />
      </button>

      <div
        className="
max-w-7xl
mx-auto
bg-white
rounded-[40px]
shadow-xl
overflow-hidden
grid
lg:grid-cols-2
"
      >
        {/* LEFT SIDE */}

        <div
          className="
p-8
flex
flex-col
items-center
justify-center
text-black
"
        >
          <div
            className="
w-full
h-[500px]
rounded-3xl
overflow-hidden
shadow-2xl
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
          </div>

          <div
            className="
mt-8
text-center
"
          >
            <div
              className="
inline-flex
items-center
gap-2
bg-gray-100
px-4
py-2
rounded-full
"
            >
              {plant.category || "Indoor Plant"}
            </div>

            <h1
              className="
text-5xl
font-bold
mt-5
"
            >
              {plant.commonName}
            </h1>

            <p
              className="
text-black
italic
text-xl
mt-3
"
            >
              {plant.scientificName}
            </p>

            <button
              className="
mt-8
bg-emerald-600
text-white
px-10
py-4
rounded-2xl
font-bold
flex
items-center
gap-3
hover:scale-105
transition
"
            >
              <Plus />
              Add To My Plants
            </button>
          </div>
        </div>

        {/* RIGHT SIDE */}

        <div
          className="
p-10
space-y-8
"
        >
          <section>
            <h2
              className="
text-3xl
font-bold
mb-5
"
            >
              Scientific Classification
            </h2>

            <div
              className="
grid
md:grid-cols-3
gap-4
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
                  <p
                    className="
text-gray-500
text-sm
"
                  >
                    {item[0]}
                  </p>

                  <p
                    className="
font-bold
text-emerald-700
"
                  >
                    {item[1]}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <div
            className="
border-t
"
          />

          <section>
            <h2
              className="
text-3xl
font-bold
mb-3
"
            >
              About
            </h2>

            <p
              className="
text-gray-600
leading-8
text-lg
"
            >
              {plant.about}
            </p>
          </section>

          <section>
            <h2
              className="
text-3xl
font-bold
mb-3
"
            >
              How To Grow
            </h2>

            <p
              className="
text-gray-600
leading-8
text-lg
"
            >
              {plant.HowToGrow}
            </p>
          </section>

          <section>
            <h2
              className="
text-3xl
font-bold
mb-5
"
            >
              Care Guide
            </h2>

            <div
              className="
grid
md:grid-cols-2
gap-5
"
            >
              <CareCard
                icon={<Thermometer />}
                title="Temperature"
                text={plant.Temperature}
              />

              <CareCard icon={<Sun />} title="Light" text={plant.Light} />

              <CareCard icon={<Droplets />} title="Water" text={plant.Water} />

              <CareCard
                icon={<Skull />}
                title="Toxicity"
                text={plant.toxicity}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function CareCard({
  icon,

  title,

  text,
}: any) {
  return (
    <div
      className="
bg-gray-50
border
rounded-3xl
p-5
flex
gap-4
items-center
hover:shadow-lg
transition
"
    >
      <div
        className="
bg-emerald-100
text-emerald-700
p-4
rounded-2xl
"
      >
        {icon}
      </div>

      <div>
        <h3
          className="
font-bold
text-lg
"
        >
          {title}
        </h3>

        <p
          className="
text-gray-500
"
        >
          {text}
        </p>
      </div>
    </div>
  );
}
