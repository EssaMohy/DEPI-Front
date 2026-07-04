import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Droplets,
  Leaf,
  Loader2,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { plantApi, getApiErrorMessage, type CatalogPlant } from "../../../lib/api";

const PAGE_SIZE = 12;
// The backend caps `limit` at 100 and only supports `search`/`category`
// filters server-side. Watering frequency and family aren't filterable
// server-side, so the whole (search+category-matched) result set is
// fetched once and those two filters, plus pagination, are applied
// client-side. Fine for the current catalog size (well under 100); if
// the catalog grows past that, watering-frequency/family filtering
// would need to move server-side.
const FETCH_LIMIT = 100;

type CategoryFilter = "all" | "Indoor" | "Outdoor";
type WateringFilter = "all" | "7" | "14";

export default function PlantsPage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [watering, setWatering] = useState<WateringFilter>("all");
  const [family, setFamily] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const [plants, setPlants] = useState<CatalogPlant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Server-side: search + category. Debounced so typing doesn't spam requests.
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    const timeout = setTimeout(async () => {
      try {
        const result = await plantApi.list({
          search: search.trim() || undefined,
          category: category !== "all" ? category : undefined,
          limit: FETCH_LIMIT,
        });
        if (!cancelled) setPlants(result.data);
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
  }, [search, category]);

  // Reset to page 1 whenever any filter changes.
  useEffect(() => {
    setPage(1);
  }, [search, category, watering, family]);

  const familyOptions = useMemo(() => {
    const set = new Set<string>();
    plants.forEach((p) => {
      if (p.family) set.add(p.family);
    });
    return Array.from(set).sort();
  }, [plants]);

  // Client-side: watering frequency + family (no backend support for these).
  const filteredPlants = useMemo(() => {
    return plants.filter((p) => {
      if (watering !== "all" && p.wateringFrequency !== Number(watering)) {
        return false;
      }
      if (family !== "all" && p.family !== family) {
        return false;
      }
      return true;
    });
  }, [plants, watering, family]);

  const totalPages = Math.max(1, Math.ceil(filteredPlants.length / PAGE_SIZE));
  const pageItems = filteredPlants.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  const activeFilterCount =
    (category !== "all" ? 1 : 0) +
    (watering !== "all" ? 1 : 0) +
    (family !== "all" ? 1 : 0);

  const clearFilters = () => {
    setCategory("all");
    setWatering("all");
    setFamily("all");
  };

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

      {/* Search + filter toggle */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search plants..."
            className="w-full pl-12 py-4 rounded-2xl border bg-white shadow-sm focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>

        <button
          onClick={() => setShowFilters((v) => !v)}
          className={`flex items-center justify-center gap-2 px-6 py-4 rounded-2xl border font-semibold shadow-sm transition ${
            showFilters || activeFilterCount > 0
              ? "bg-emerald-600 text-white border-emerald-600"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          <SlidersHorizontal size={18} />
          Filters
          {activeFilterCount > 0 && (
            <span className="bg-white text-emerald-700 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="bg-white rounded-3xl border shadow-sm p-6 space-y-6">
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">
              Where it grows
            </p>
            <div className="flex flex-wrap gap-2">
              {(["all", "Indoor", "Outdoor"] as CategoryFilter[]).map(
                (option) => (
                  <button
                    key={option}
                    onClick={() => setCategory(option)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                      category === option
                        ? "bg-emerald-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {option === "all" ? "All" : option}
                  </button>
                ),
              )}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">
              Watering frequency
            </p>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["all", "Any"],
                  ["7", "Weekly"],
                  ["14", "Every 2 weeks"],
                ] as [WateringFilter, string][]
              ).map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => setWatering(value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    watering === value
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">Family</p>
            <select
              value={family}
              onChange={(e) => setFamily(e.target.value)}
              className="w-full sm:w-64 px-4 py-2.5 rounded-xl border bg-gray-50 focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="all">All families</option>
              {familyOptions.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}

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
      ) : filteredPlants.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border">
          <Leaf className="mx-auto text-gray-300 w-16 h-16 mb-4" />
          <h2 className="text-xl font-bold">No plants found</h2>
          <p className="text-gray-500 mt-2">
            Try a different search term or adjust your filters.
          </p>
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pageItems.map((plant) => (
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
