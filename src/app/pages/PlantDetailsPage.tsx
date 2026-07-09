import { useEffect, useState, type ReactNode } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Thermometer,
  Sun,
  Droplets,
  Skull,
  Plus,
  Check,
  Loader2,
} from "lucide-react";

import { plantApi, getApiErrorMessage, type CatalogPlant } from "../../lib/api";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { usePlants } from "../context/PlantContext";

export default function PlantDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const myPlantImageUrl = (location.state as { myPlantImageUrl?: string } | null)?.myPlantImageUrl;
  const { plants, addPlant } = usePlants();

  const [plant, setPlant] = useState<CatalogPlant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isAdding, setIsAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  const plantId = id ? Number(id) : NaN;
  const alreadyOwned = plants.some((p) => p.plant.id === plantId);

  useEffect(() => {
    if (!Number.isFinite(plantId)) {
      setError("Invalid plant.");
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    plantApi
      .getById(plantId)
      .then((data) => {
        if (!cancelled) setPlant(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(getApiErrorMessage(err, "Could not load this plant."));
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [plantId]);

  const handleAddToMyPlants = async () => {
    if (!plant) return;
    setAddError(null);
    setIsAdding(true);
    try {
      await addPlant(plant.id);
    } catch (err) {
      setAddError(
        getApiErrorMessage(err, "Could not add this plant to your collection."),
      );
    } finally {
      setIsAdding(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  if (error || !plant) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-600">{error ?? "Plant not found."}</p>
        <button
          onClick={() => navigate("/plants")}
          className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition"
        >
          Back to Plants
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 bg-white p-3 rounded-full shadow hover:scale-105 transition"
      >
        <ArrowLeft />
      </button>

      <div className="max-w-7xl mx-auto bg-white rounded-[40px] shadow-xl overflow-hidden grid lg:grid-cols-2">
        {/* LEFT SIDE */}
        <div className="p-8 flex flex-col items-center justify-center text-black">
          <div className="w-full h-[500px] rounded-3xl overflow-hidden shadow-2xl">
            <ImageWithFallback
              src={myPlantImageUrl || plant.imageUrl}
              alt={plant.commonName}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
              {plant.category[0] || "Plant"}
            </div>

            <h1 className="text-5xl font-bold mt-5">{plant.commonName}</h1>

            <p className="text-black italic text-xl mt-3">
              {plant.scientificName}
            </p>

            {addError && (
              <p className="text-red-600 text-sm mt-4 max-w-sm mx-auto">
                {addError}
              </p>
            )}

            <button
              onClick={handleAddToMyPlants}
              disabled={isAdding || alreadyOwned}
              className={`mt-8 px-10 py-4 rounded-2xl font-bold flex items-center gap-3 transition mx-auto ${
                alreadyOwned
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-emerald-600 text-white hover:scale-105 disabled:opacity-60"
              }`}
            >
              {isAdding ? (
                <Loader2 className="animate-spin" />
              ) : alreadyOwned ? (
                <Check />
              ) : (
                <Plus />
              )}
              {alreadyOwned ? "In My Plants" : "Add To My Plants"}
            </button>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="p-10 space-y-8">
          <section>
            <h2 className="text-3xl font-bold mb-5">
              Scientific Classification
            </h2>

            <div className="grid md:grid-cols-3 gap-4">
              {[
                ["Family", plant.family],
                ["Order", plant.order],
                ["Kingdom", plant.kingdom],
              ].map((item) => (
                <div key={item[0]} className="bg-emerald-50 rounded-2xl p-5">
                  <p className="text-gray-500 text-sm">{item[0]}</p>
                  <p className="font-bold text-emerald-700">
                    {item[1] || "—"}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <div className="border-t" />

          <section>
            <h2 className="text-3xl font-bold mb-3">About</h2>
            <p className="text-gray-600 leading-8 text-lg">
              {plant.about || "No description available yet."}
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-3">How To Grow</h2>
            <p className="text-gray-600 leading-8 text-lg">
              {plant.howToGrow || "No growing instructions available yet."}
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-5">Care Guide</h2>

            <div className="grid md:grid-cols-2 gap-5">
              <CareCard
                icon={<Thermometer />}
                title="Temperature"
                text={plant.temperature}
              />
              <CareCard icon={<Sun />} title="Light" text={plant.light} />
              <CareCard icon={<Droplets />} title="Water" text={plant.water} />
              <CareCard icon={<Skull />} title="Toxicity" text={plant.toxicity} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

interface CareCardProps {
  icon: ReactNode;
  title: string;
  text: string;
}

function CareCard({ icon, title, text }: CareCardProps) {
  return (
    <div className="bg-gray-50 border rounded-3xl p-5 flex gap-4 items-center hover:shadow-lg transition">
      <div className="bg-emerald-100 text-emerald-700 p-4 rounded-2xl">
        {icon}
      </div>

      <div>
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="text-gray-500">{text || "—"}</p>
      </div>
    </div>
  );
}
