import { useState } from "react";
import { Search, Plus, Droplets, Leaf } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AddPlantModal } from "../../components/AddPlantModal";

export default function PlantsPage() {
  const navigate = useNavigate();
  const commonPlants = [
    {
      commonName: "Monstera",
      scientificName: "Monstera Deliciosa",
      wateringDays: 7,
      image:
        "https://images.unsplash.com/photo-1775598369836-74f2e6c51095?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
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
    },
    {
      commonName: "Snake Plant",
      scientificName: "Sansevieria Trifasciata",
      wateringDays: 14,
      image:
        "https://images.unsplash.com/photo-1769653907239-c8f1a1843b08?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
      Family: "Asparagaceae",
      Order: "Asparagales",
      Kingdom: "Plantae",
      about:
        "Snake Plant is a hardy indoor plant known for its upright leaves and air-purifying qualities.",
      HowToGrow: "Tolerates low light; water sparingly.",
      Temperature: "15°C - 30°C",
      Light: "Low to bright indirect light",
      Water: "Water every 2 weeks",
      toxicity: "Mildly toxic to pets",
    },
    {
      commonName: "Pothos",
      scientificName: "Epipremnum Aureum",
      wateringDays: 7,
      image:
        "https://images.unsplash.com/photo-1777383504353-77974872c2ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
      Family: "Araceae",
      Order: "Alismatales",
      Kingdom: "Plantae",
      about:
        "Pothos is a popular trailing plant known for its heart-shaped leaves and easy care.",
      HowToGrow:
        "Thrives in low to bright indirect light; water when soil is dry.",
      Temperature: "18°C - 30°C",
      Light: "Low to bright indirect light",
      Water: "Water every 7 days",
      toxicity: "Toxic to pets",
    },
    {
      commonName: "Peace Lily",
      scientificName: "Spathiphyllum",
      wateringDays: 5,
      image:
        "https://images.unsplash.com/photo-1735973634121-d93cf7c94b44?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
      Family: "Araceae",
      Order: "Alismatales",
      Kingdom: "Plantae",
      about:
        "Peace Lily is a popular indoor plant known for its elegant white blooms and ability to purify the air.",
      HowToGrow: "Prefers bright, indirect light and consistently moist soil.",
      Temperature: "18°C - 24°C",
      Light: "Bright, indirect light",
      Water: "Water when the top inch of soil feels dry",
      toxicity: "Toxic to pets",
    },
    {
      commonName: "Succulent",
      scientificName: "Various Species",
      wateringDays: 21,
      image:
        "https://images.unsplash.com/photo-1772907952251-09e722aafa6a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
      Family: "Crassulaceae",
      Order: "Sempervivales",
      Kingdom: "Plantae",
      about:
        "Succulents are drought-tolerant plants with thick, fleshy leaves that store water.",
      HowToGrow: "Grow in well-draining soil and provide plenty of sunlight.",
      Temperature: "15°C - 27°C",
      Light: "Full sun to partial shade",
      Water:
        "Water deeply but infrequently, allowing soil to dry between waterings",
      toxicity: "Some species are toxic to pets",
    },
    {
      commonName: "Fern",
      scientificName: "Nephrolepis",
      wateringDays: 3,
      image:
        "https://images.unsplash.com/photo-1772907952266-3a7981f3f234?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
      Family: "Nephrolepidae",
      Order: "Polypodiales",
      Kingdom: "Plantae",
      about:
        "Ferns are ancient plants that thrive in humid, shaded environments.",
      HowToGrow:
        "Grow in moist, well-draining soil and provide indirect light.",
      Temperature: "10°C - 24°C",
      Light: "Shade to partial shade",
      Water: "Keep soil consistently moist",
      toxicity: "Non-toxic to pets",
    },
  ];

  const [search, setSearch] = useState("");

  const filteredPlants = commonPlants.filter(
    (plant) =>
      plant.commonName.toLowerCase().includes(search.toLowerCase()) ||
      plant.scientificName.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-8">
      {/* Header */}

      <div
        className="
bg-gradient-to-r
from-emerald-600
to-green-500
rounded-3xl
p-8
text-white
flex
justify-between
items-center
"
      >
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Leaf />

            <h1 className="text-4xl font-bold">Plants</h1>
          </div>

          <p className="opacity-90">Discover and manage your favorite plants</p>
        </div>

        <button
          className="
bg-white
text-emerald-700
px-5
py-3
rounded-xl
font-semibold
flex
items-center
gap-2
hover:scale-105
transition
"
        >
          <Plus size={20} />
          Add Plant
        </button>
      </div>

      {/* Search */}

      <div className="relative">
        <Search
          className="
absolute
left-4
top-1/2
-translate-y-1/2
text-gray-400
"
        />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search plants..."
          className="
w-full
pl-12
py-4
rounded-2xl
border
bg-white
shadow-sm
focus:ring-2
focus:ring-emerald-500
outline-none
"
        />
      </div>

      {/* Cards */}

      <div
        className="
grid
sm:grid-cols-2
lg:grid-cols-3
gap-6
"
      >
        {filteredPlants.map((plant, index) => (
          <div
            key={index}
            className="
group
bg-white
rounded-3xl
overflow-hidden
border
shadow-sm
hover:shadow-xl
transition-all
hover:-translate-y-1
"
          >
            <div
              className="
relative
h-56
overflow-hidden
"
            >
              <img
                src={plant.image}
                className="
w-full
h-full
object-cover
group-hover:scale-110
transition
duration-500
"
              />

              <div
                className="
absolute
top-4
right-4
bg-white/90
px-3
py-1
rounded-full
text-xs
font-semibold
text-emerald-700
flex
gap-1
items-center
"
              >
                <Droplets size={14} />
                {plant.wateringDays} days
              </div>
            </div>

            <div className="p-5">
              <h2
                className="
text-xl
font-bold
text-gray-900
"
              >
                {plant.commonName}
              </h2>

              <p
                className="
text-gray-500
mt-1
text-sm
"
              >
                {plant.scientificName}
              </p>

              <div
                className="
mt-4
flex
items-center
gap-2
text-emerald-600
text-sm
font-medium
"
              >
                <Droplets size={16} />
                Water every {plant.wateringDays} days
              </div>

              <button
                onClick={() =>
                  navigate("/plants/details", {
                    state: { plant },
                  })
                }
                className="
mt-5
w-full
py-2.5
rounded-xl
bg-emerald-50
text-emerald-700
font-semibold
hover:bg-emerald-600
hover:text-white
transition
"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
