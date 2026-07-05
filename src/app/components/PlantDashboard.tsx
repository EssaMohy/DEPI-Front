import {
  Camera,
  Plus,
  Calendar,
  AlertCircle,
  Leaf,
  Sprout,
  ArrowLeft,
  Loader2,
} from "lucide-react";

import { PlantCard } from "./PlantCard";
import type { MyPlant } from "../../lib/api";

interface PlantDashboardProps {
  plants: MyPlant[];
  isLoading?: boolean;
  onAddPlant: () => void;
  onDiagnose: () => void;
  onCalendar: () => void;
  onWaterPlant: (myPlantId: number) => Promise<void>;
  onFertilizePlant: (myPlantId: number) => Promise<void>;
  onDeletePlant: (myPlantId: number) => Promise<void>;
  onBackToLanding?: () => void;
}

const DAY_MS = 1000 * 60 * 60 * 24;

/** Days remaining until `isoDate`; negative means overdue. Null when no schedule is set. */
function daysUntil(isoDate: string | null): number | null {
  if (!isoDate) return null;
  return Math.ceil((new Date(isoDate).getTime() - Date.now()) / DAY_MS);
}

export function PlantDashboard({
  plants = [],
  isLoading,
  onAddPlant,
  onDiagnose,
  onCalendar,
  onWaterPlant,
  onFertilizePlant,
  onDeletePlant,
  onBackToLanding,
}: PlantDashboardProps) {
  const wateringDays = plants.map((p) => daysUntil(p.nextWatering));
  const fertilizingDays = plants.map((p) => daysUntil(p.nextFertilizing));

  const overdueWater = wateringDays.filter((d) => d !== null && d <= 0).length;
  const needFertilizer = fertilizingDays.filter(
    (d) => d !== null && d <= 0,
  ).length;
  const dueToday =
    wateringDays.filter((d) => d === 0).length +
    fertilizingDays.filter((d) => d === 0).length;

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
                    className="p-2 hover:bg-gray-100 rounded-full"
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
                className="flex items-center gap-2 px-4 py-2 border-2 border-emerald-600 text-emerald-600 rounded-full hover:bg-emerald-50"
              >
                <Calendar />
                Calendar
              </button>

              <button
                onClick={onDiagnose}
                className="flex items-center gap-2 px-4 py-2 border-2 border-emerald-600 text-emerald-600 rounded-full hover:bg-emerald-50"
              >
                <Camera />
                Diagnose
              </button>

              <button
                onClick={onAddPlant}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700"
              >
                <Plus />
                Add Plant
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-4 mt-6">
            <div className="bg-emerald-50 rounded-xl p-4">
              <Leaf className="text-emerald-600" />
              <p className="text-2xl font-bold">{plants.length}</p>
              <span>Total Plants</span>
            </div>

            <div className="bg-red-50 rounded-xl p-4">
              <AlertCircle className="text-red-600" />
              <p className="text-2xl font-bold">{overdueWater}</p>
              <span>Needs Water</span>
            </div>

            <div className="bg-green-50 rounded-xl p-4">
              <Sprout className="text-green-600" />
              <p className="text-2xl font-bold">{needFertilizer}</p>
              <span>Needs Fertilizing</span>
            </div>

            <div className="bg-blue-50 rounded-xl p-4">
              <Calendar className="text-blue-600" />
              <p className="text-2xl font-bold">{dueToday}</p>
              <span>Due Today</span>
            </div>
          </div>
        </div>
      </div>

      {/* Plants */}
      <div className="max-w-7xl mx-auto p-6">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
          </div>
        ) : plants.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border">
            <Leaf className="mx-auto text-gray-300 w-20 h-20 mb-5" />
            <h2 className="text-2xl font-bold">No plants yet</h2>
            <p className="text-gray-500 mt-2 mb-6">
              Start building your plant collection
            </p>
            <button
              onClick={onAddPlant}
              className="bg-emerald-600 text-white px-6 py-3 rounded-full flex items-center gap-2 mx-auto hover:bg-emerald-700"
            >
              <Plus />
              Add Your First Plant
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plants.map((myPlant) => (
              <PlantCard
                key={myPlant.id}
                myPlant={myPlant}
                onWater={onWaterPlant}
                onFertilize={onFertilizePlant}
                onDelete={onDeletePlant}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
