import { useEffect, useState } from "react";
import { X, Search, Loader2, Check, Plus } from "lucide-react";

import { plantApi, getApiErrorMessage, type CatalogPlant } from "../../lib/api";

interface AddPlantModalProps {
  onClose: () => void;
  /** Adds the catalog plant (by its catalog id) to the user's collection. */
  onAdd: (catalogPlantId: number) => Promise<void>;
}

export function AddPlantModal({ onClose, onAdd }: AddPlantModalProps) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<CatalogPlant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingId, setAddingId] = useState<number | null>(null);
  const [addedIds, setAddedIds] = useState<Set<number>>(new Set());

  // Debounced catalog search.
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    const timeout = setTimeout(async () => {
      try {
        const result = await plantApi.list({
          search: search.trim() || undefined,
          limit: 24,
        });
        if (!cancelled) setResults(result.data);
      } catch (err) {
        if (!cancelled) {
          setError(getApiErrorMessage(err, "Could not load plants."));
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [search]);

  const handleAdd = async (plant: CatalogPlant) => {
    setError(null);
    setAddingId(plant.id);
    try {
      await onAdd(plant.id);
      setAddedIds((prev) => new Set(prev).add(plant.id));
    } catch (err) {
      setError(
        getApiErrorMessage(
          err,
          `Could not add ${plant.commonName} to your collection.`,
        ),
      );
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Add New Plant</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for a plant..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {error && (
            <div className="mb-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-7 h-7 text-emerald-600 animate-spin" />
            </div>
          ) : results.length === 0 ? (
            <p className="text-center text-gray-500 py-16">
              No plants found{search ? ` for "${search}"` : ""}.
            </p>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              {results.map((plant) => {
                const isAdded = addedIds.has(plant.id);
                const isAdding = addingId === plant.id;

                return (
                  <div
                    key={plant.id}
                    className="text-left bg-gray-50 rounded-xl p-4 border-2 border-transparent"
                  >
                    <div className="aspect-square bg-gray-200 rounded-lg mb-3 overflow-hidden">
                      <img
                        src={plant.imageUrl}
                        alt={plant.commonName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {plant.commonName}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {plant.scientificName}
                    </p>
                    {plant.wateringFrequency && (
                      <p className="text-xs text-emerald-600 mb-3">
                        Water every {plant.wateringFrequency} days
                      </p>
                    )}
                    <button
                      onClick={() => handleAdd(plant)}
                      disabled={isAdding || isAdded}
                      className={`w-full py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors ${
                        isAdded
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
                      }`}
                    >
                      {isAdding ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : isAdded ? (
                        <>
                          <Check className="w-4 h-4" /> Added
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" /> Add to My Plants
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
