import { useEffect, useState } from "react";
import { Search, Droplets, Leaf, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { plantApi, getApiErrorMessage, type CatalogPlant } from "../../../lib/api";

const PAGE_SIZE = 12;

export default function PlantsPage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [plants, setPlants] = useState<CatalogPlant[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Reset to page 1 whenever the search term changes.
  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    const timeout = setTimeout(async () => {
      try {
        const result = await plantApi.list({
          search: search.trim() || undefined,
          page,
          limit: PAGE_SIZE,
        });
        if (!cancelled) {
          setPlants(result.data);
          setTotalPages(Math.max(1, result.meta.totalPages));
        }
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
  }, [search, page]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-500 rounded-3xl p-8 text-white flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Leaf />
            <h1 className="text-4xl font-bold">Plants</h1>
          </div>
          <p className="opacity-90">Discover and manage your favorite plants</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search plants..."
          className="w-full pl-12 py-4 rounded-2xl border bg-white shadow-sm focus:ring-2 focus:ring-emerald-500 outline-none"
        />
      </div>

      {error && (
        <div className="rounded-2xl bg-red-50 border border-red-200 text-red-600 text-sm px-5 py-4">
          {error}
        </div>
      )}

      {/* Cards */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
        </div>
      ) : plants.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border">
          <Leaf className="mx-auto text-gray-300 w-16 h-16 mb-4" />
          <h2 className="text-xl font-bold">No plants found</h2>
          <p className="text-gray-500 mt-2">
            Try a different search term.
          </p>
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {plants.map((plant) => (
              <div
                key={plant.id}
                className="group bg-white rounded-3xl overflow-hidden border shadow-sm hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={plant.imageUrl}
                    alt={plant.commonName}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />

                  {plant.wateringFrequency && (
                    <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full text-xs font-semibold text-emerald-700 flex gap-1 items-center">
                      <Droplets size={14} />
                      {plant.wateringFrequency} days
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <h2 className="text-xl font-bold text-gray-900">
                    {plant.commonName}
                  </h2>

                  <p className="text-gray-500 mt-1 text-sm">
                    {plant.scientificName}
                  </p>

                  {plant.wateringFrequency && (
                    <div className="mt-4 flex items-center gap-2 text-emerald-600 text-sm font-medium">
                      <Droplets size={16} />
                      Water every {plant.wateringFrequency} days
                    </div>
                  )}

                  <button
                    onClick={() => navigate(`/plants/${plant.id}`)}
                    className="mt-5 w-full py-2.5 rounded-xl bg-emerald-50 text-emerald-700 font-semibold hover:bg-emerald-600 hover:text-white transition"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-2 rounded-full border hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent"
                aria-label="Previous page"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="p-2 rounded-full border hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent"
                aria-label="Next page"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
