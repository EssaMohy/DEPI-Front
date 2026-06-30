import { useState } from "react";
import { Search, Bug, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DiseasesPage() {
  const navigate = useNavigate();

  const diseases = [
    {
      id: 1,
      name: "Leaf Spot",
      otherNames: "Leaf Spot Disease, Fungal Leaf Spots",
      type: "Fungal / Bacterial disease",
      symptoms: "Brown or black spots on leaves",
      description:
        "A common plant disease that causes spots and damage on leaves.",
      causes:
        "Caused by fungal or bacterial pathogens that thrive in humid, wet conditions.",
      treatment: {
        steps: [
          "Remove and destroy affected leaves",
          "Avoid overhead watering to keep foliage dry",
          "Apply a suitable fungicide or bactericide",
          "Improve air circulation around the plant",
        ],
      },
      imageUrl:
        "https://images.unsplash.com/photo-1592982537447-6f2a6a0d9b8f?w=600",
    },

    {
      id: 2,
      name: "Calcium Deficiency",
      otherNames: "Calcium Deficiency Disorder",
      type: "Nutrient deficiency",
      symptoms: "Distorted leaves and weak growth",
      description: "A nutrient problem affecting plant development.",
      causes:
        "Insufficient calcium uptake due to poor soil quality, low pH, or inconsistent watering.",
      treatment: {
        steps: [
          "Test and amend soil with calcium-rich amendments",
          "Maintain consistent, even watering",
          "Apply a balanced fertilizer with calcium",
          "Avoid excess nitrogen, which can block calcium uptake",
        ],
      },
      imageUrl:
        "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600",
    },

    {
      id: 3,
      name: "Scorched Leaves",
      otherNames: "Leaf Burn, Sun Scorch",
      type: "Environmental stress",
      symptoms: "Brown crispy edges and dry leaves",
      description: "Damage caused by heat and sunlight stress.",
      causes:
        "Excessive direct sunlight, heat, or insufficient watering during hot periods.",
      treatment: {
        steps: [
          "Move the plant to a spot with filtered or indirect light",
          "Increase watering frequency during hot weather",
          "Trim away severely scorched leaves",
          "Provide shade during peak afternoon sun",
        ],
      },
      imageUrl:
        "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?w=600",
    },

    {
      id: 4,
      name: "Leaf Blight",
      otherNames: "Blight Disease",
      type: "Fungal disease",
      symptoms: "Large brown patches on leaves",
      description: "A serious disease affecting plant health.",
      causes:
        "Fungal infection spread by spores, often worsened by wet foliage and poor air flow.",
      treatment: {
        steps: [
          "Remove and dispose of infected leaves immediately",
          "Apply an appropriate fungicide",
          "Water at the base to keep leaves dry",
          "Space plants to improve airflow",
        ],
      },
      imageUrl:
        "https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?w=600",
    },
  ];

  const [search, setSearch] = useState("");

  const filteredDiseases = diseases.filter(
    (disease) =>
      disease.name.toLowerCase().includes(search.toLowerCase()) ||
      disease.type.toLowerCase().includes(search.toLowerCase()),
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
          <div className="flex items-center gap-3 mb-3">
            <Bug size={35} />

            <h1 className="text-4xl font-bold">Diseases</h1>
          </div>

          <p className="opacity-90">
            Discover plant diseases and learn how to treat them
          </p>
        </div>
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
          placeholder="Search diseases..."
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
        {filteredDiseases.map((disease) => (
          <div
            key={disease.id}
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
            {/* Image */}

            <div
              className="
relative
h-56
overflow-hidden
"
            >
              <img
                src={disease.imageUrl}
                className="
w-full
h-full
object-cover
group-hover:scale-110
transition
duration-500
"
              />
            </div>

            {/* Content */}

            <div className="p-5">
              <span
                className="
bg-red-100
text-red-700
px-3
py-1
rounded-full
text-xs
font-semibold
"
              >
                {disease.type}
              </span>

              <h2
                className="
text-xl
font-bold
text-gray-900
mt-4
"
              >
                {disease.name}
              </h2>

              <p
                className="
text-gray-500
mt-2
text-sm
"
              >
                {disease.symptoms}
              </p>

              <button
                onClick={() =>
                  navigate("/diseases/details", {
                    state: { disease },
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
