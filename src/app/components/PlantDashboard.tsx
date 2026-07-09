import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Loader2,
  ImageUp,
} from "lucide-react";

import { ImageWithFallback } from "./figma/ImageWithFallback";
import type { MyPlant } from "../../lib/api";

interface PlantDashboardProps {
  plants: MyPlant[];
  isLoading: boolean;
  onAddPlant?: () => void;
  onDiagnose?: () => void;
  onCalendar?: () => void;
  onWaterPlant?: (myPlantId: number) => void;
  onFertilizePlant?: (myPlantId: number) => void;
  onDeletePlant?: (myPlantId: number) => void;
  onUpdatePlantImage?: (myPlantId: number, file: File) => void;
  onBackToLanding?: () => void;
  actionLoading?: Record<number, 'water' | 'fertilize' | null>;
}

const DAY_MS = 1000 * 60 * 60 * 24;

/** Days remaining until `isoDate`; negative means overdue. Null when no schedule is set. */
function daysUntil(isoDate: string | null): number | null {
  if (!isoDate) return null;
  return Math.ceil((new Date(isoDate).getTime() - Date.now()) / DAY_MS);
}

function formatDays(days: number | null): string {
  if (days === null) return "No schedule";
  if (days <= 0) return days === 0 ? "Due today" : `${Math.abs(days)}d overdue`;
  return `in ${days}d`;
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
  onUpdatePlantImage,
  onBackToLanding,
  actionLoading = {},
}: PlantDashboardProps) {
  const navigate = useNavigate();
  const [uploadingPhoto, setUploadingPhoto] = useState<number | null>(null);

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
            {plants.map((myPlant) => {
              const waterIn = daysUntil(myPlant.nextWatering);
              const fertilizeIn = daysUntil(myPlant.nextFertilizing);

              return (
                <div
                  key={myPlant.id}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden"
                >
                  <div className="relative group">
                      <button
                        onClick={() => navigate(`/plants/${myPlant.plant.id}`, { state: { myPlantImageUrl: myPlant.imageUrl } })}
                        className="block w-full h-48 text-left"
                      >
                      <ImageWithFallback
                        src={myPlant.imageUrl || myPlant.plant.imageUrl}
                        className="w-full h-full object-cover"
                      />
                    </button>
                    <label className="absolute top-2 right-2 p-2 bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 hover:bg-black/60 transition-all cursor-pointer">
                      {uploadingPhoto === myPlant.id ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <ImageUp size={16} />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setUploadingPhoto(myPlant.id);
                            await onUpdatePlantImage(myPlant.id, file);
                            setUploadingPhoto(null);
                          }
                        }}
                      />
                    </label>
                  </div>

                  <div className="p-6">
                    <button
                      onClick={() => navigate(`/plants/${myPlant.plant.id}`, { state: { myPlantImageUrl: myPlant.imageUrl } })}
                      className="text-left"
                    >
                      <h3 className="text-xl font-bold hover:text-emerald-600 transition-colors">
                        {myPlant.plant.commonName}
                      </h3>
                      <p className="text-gray-500">
                        {myPlant.plant.scientificName}
                      </p>
                    </button>

                    <div className="mt-4 space-y-2">
                      <p className={waterIn !== null && waterIn <= 0 ? "text-red-600" : ""}>
                        💧 Water: {formatDays(waterIn)}
                      </p>
                      <p className={fertilizeIn !== null && fertilizeIn <= 0 ? "text-amber-600" : ""}>
                        🌱 Fertilize: {formatDays(fertilizeIn)}
                      </p>
                    </div>

                    <div className="flex gap-2 mt-5">
                      <button
                        onClick={() => onWaterPlant?.(myPlant.id)}
                        disabled={actionLoading[myPlant.id] === 'water'}
                        className={`flex-1 rounded-lg py-2 flex justify-center items-center gap-2 transition ${
                          actionLoading[myPlant.id] === 'water'
                            ? 'bg-blue-400 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {actionLoading[myPlant.id] === 'water' ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Droplet size={16} />
                        )}
                        Water
                      </button>

                      <button
                        onClick={() => onFertilizePlant?.(myPlant.id)}
                        disabled={actionLoading[myPlant.id] === 'fertilize'}
                        className={`flex-1 rounded-lg py-2 flex justify-center items-center gap-2 transition ${
                          actionLoading[myPlant.id] === 'fertilize'
                            ? 'bg-emerald-400 cursor-not-allowed'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700'
                        }`}
                      >
                        {actionLoading[myPlant.id] === 'fertilize' ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Sprout size={16} />
                        )}
                        Fertilize
                      </button>

                      <button
                        onClick={() => onDeletePlant(myPlant.id)}
                        className="px-3 border rounded-lg"
                        aria-label="Remove plant"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
