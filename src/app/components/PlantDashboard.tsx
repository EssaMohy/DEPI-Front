import {
  Droplet,
  Camera,
  Plus,
  Calendar,
  AlertCircle,
  Leaf,
  Trash2,
  Sprout,
  ArrowLeft,
} from "lucide-react";

import { ImageWithFallback } from "./figma/ImageWithFallback";

export interface Plant {
  id: string;

  name: string;

  species: string;

  image: string;

  lastWatered: Date;

  wateringFrequency: number;

  lastFertilized?: Date;

  fertilizingFrequency?: number;

  health: "excellent" | "good" | "fair" | "poor";

  notes: string;
}

interface PlantDashboardProps {
  plants: Plant[];

  onAddPlant: () => void;

  onDiagnose: () => void;

  onCalendar: () => void;

  onWaterPlant: (plantId: string) => void;

  onFertilizePlant: (plantId: string) => void;

  onDeletePlant: (plantId: string) => void;

  onBackToLanding?: () => void;
}

export function PlantDashboard({
  plants,

  onAddPlant,

  onDiagnose,

  onCalendar,

  onWaterPlant,

  onFertilizePlant,

  onDeletePlant,

  onBackToLanding,
}: PlantDashboardProps) {
  const getDaysUntilWatering = (plant: Plant) => {
    const days = Math.floor(
      (Date.now() - plant.lastWatered.getTime()) / (1000 * 60 * 60 * 24),
    );

    return plant.wateringFrequency - days;
  };

  const getDaysUntilFertilizing = (plant: Plant) => {
    if (!plant.lastFertilized) return 0;

    const days = Math.floor(
      (Date.now() - plant.lastFertilized.getTime()) / (1000 * 60 * 60 * 24),
    );

    return (plant.fertilizingFrequency || 30) - days;
  };

  const overdueWater = plants.filter(
    (p) => getDaysUntilWatering(p) <= 0,
  ).length;

  const needFertilizer = plants.filter(
    (p) => getDaysUntilFertilizing(p) <= 0,
  ).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}

      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3">
                {onBackToLanding && (
                  <button
                    onClick={onBackToLanding}
                    className="
p-2
hover:bg-gray-100
rounded-full
"
                  >
                    <ArrowLeft />
                  </button>
                )}

                <h1 className="text-3xl font-bold">My Plants</h1>
              </div>

              <p className="text-gray-600 mt-2">
                Track and care for your green friends
              </p>
            </div>

            <div className="flex gap-3 flex-wrap">
              <button
                onClick={onCalendar}
                className="
flex
items-center
gap-2
px-4
py-2
border-2
border-emerald-600
text-emerald-600
rounded-full
hover:bg-emerald-50
"
              >
                <Calendar />
                Calendar
              </button>

              <button
                onClick={onDiagnose}
                className="
flex
items-center
gap-2
px-4
py-2
border-2
border-emerald-600
text-emerald-600
rounded-full
hover:bg-emerald-50
"
              >
                <Camera />
                Diagnose
              </button>

              <button
                onClick={onAddPlant}
                className="
flex
items-center
gap-2
px-4
py-2
bg-emerald-600
text-white
rounded-full
hover:bg-emerald-700
"
              >
                <Plus />
                Add Plant
              </button>
            </div>
          </div>

          {/* Stats */}

          <div className="grid md:grid-cols-4 gap-4 mt-6">
            <div
              className="
bg-emerald-50
rounded-xl
p-4
"
            >
              <Leaf className="text-emerald-600" />

              <p className="text-2xl font-bold">{plants.length}</p>

              <span>Total Plants</span>
            </div>

            <div
              className="
bg-red-50
rounded-xl
p-4
"
            >
              <AlertCircle className="text-red-600" />

              <p className="text-2xl font-bold">{overdueWater}</p>

              <span>Needs Water</span>
            </div>

            <div
              className="
bg-green-50
rounded-xl
p-4
"
            >
              <Sprout className="text-green-600" />

              <p className="text-2xl font-bold">{needFertilizer}</p>

              <span>Needs Fertilizing</span>
            </div>

            <div
              className="
bg-blue-50
rounded-xl
p-4
"
            >
              <Calendar className="text-blue-600" />

              <p className="text-2xl font-bold">{overdueWater}</p>

              <span>Due Today</span>
            </div>
          </div>
        </div>
      </div>

      {/* Plants */}

      <div className="max-w-7xl mx-auto p-6">
        {plants.length === 0 ? (
          <div
            className="
text-center
py-20
bg-white
rounded-3xl
border
"
          >
            <Leaf
              className="
mx-auto
text-gray-300
w-20
h-20
mb-5
"
            />

            <h2
              className="
text-2xl
font-bold
"
            >
              No plants yet
            </h2>

            <p
              className="
text-gray-500
mt-2
mb-6
"
            >
              Start building your plant collection
            </p>

            <button
              onClick={onAddPlant}
              className="
bg-emerald-600
text-white
px-6
py-3
rounded-full
flex
items-center
gap-2
mx-auto
hover:bg-emerald-700
"
            >
              <Plus />
              Add Your First Plant
            </button>
          </div>
        ) : (
          <div
            className="
grid
md:grid-cols-2
lg:grid-cols-3
gap-6
"
          >
            {plants.map((plant) => (
              <div
                key={plant.id}
                className="
bg-white
rounded-2xl
shadow-sm
overflow-hidden
"
              >
                <div className="h-48">
                  <ImageWithFallback
                    src={plant.image}
                    className="
w-full
h-full
object-cover
"
                  />
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold">{plant.name}</h3>

                  <p className="text-gray-500">{plant.species}</p>

                  <div className="mt-4 space-y-2">
                    <p>
                      💧 Water:
                      {getDaysUntilWatering(plant)} days
                    </p>

                    <p>
                      🌱 Fertilize:
                      {getDaysUntilFertilizing(plant)} days
                    </p>
                  </div>

                  <div className="flex gap-2 mt-5">
                    <button
                      onClick={() => onWaterPlant(plant.id)}
                      className="
flex-1
bg-blue-600
text-white
rounded-lg
py-2
flex
justify-center
items-center
gap-2
"
                    >
                      <Droplet size={16} />
                      Water
                    </button>

                    <button
                      onClick={() => onFertilizePlant(plant.id)}
                      className="
flex-1
bg-emerald-600
text-white
rounded-lg
py-2
flex
justify-center
items-center
gap-2
"
                    >
                      <Sprout size={16} />
                      Fertilize
                    </button>

                    <button
                      onClick={() => onDeletePlant(plant.id)}
                      className="
px-3
border
rounded-lg
"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
