import { useEffect, useMemo, useState } from "react";
import { Search, Bug, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { diseaseApi, getApiErrorMessage, type Disease } from "../../../lib/api";

export default function DiseasesPage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // The backend only supports an exact `type` filter (no text search),
  // and the whole catalog is small, so fetch everything once and filter
  // client-side.
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    diseaseApi
      .list({ limit: 100 })
      .then((result) => {
        if (!cancelled) setDiseases(result.data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(getApiErrorMessage(err, "Could not load diseases."));
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredDiseases = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return diseases;
    return diseases.filter(
      (disease) =>
        disease.name.toLowerCase().includes(term) ||
        (disease.type ?? "").toLowerCase().includes(term) ||
        disease.otherNames.some((n) => n.toLowerCase().includes(term)),
    );
  }, [diseases, search]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-500 rounded-3xl p-8 text-white flex justify-between items-center">
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
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search diseases..."
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
      ) : filteredDiseases.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border">
          <Bug className="mx-auto text-gray-300 w-16 h-16 mb-4" />
          <h2 className="text-xl font-bold">No diseases found</h2>
          <p className="text-gray-500 mt-2">Try a different search term.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDiseases.map((disease) => (
            <div
              key={disease.id}
              className="group bg-white rounded-3xl overflow-hidden border shadow-sm hover:shadow-xl transition-all hover:-translate-y-1"
            >
              {/* Image (falls back to an icon — the seeded catalog has no images yet) */}
              <div className="relative h-56 overflow-hidden bg-emerald-50 flex items-center justify-center">
                {disease.imageUrl ? (
                  <img
                    src={disease.imageUrl}
                    alt={disease.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                ) : (
                  <Bug className="text-emerald-300 w-16 h-16" />
                )}
              </div>

              <div className="p-5">
                {disease.type && (
                  <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">
                    {disease.type}
                  </span>
                )}

                <h2 className="text-xl font-bold text-gray-900 mt-4">
                  {disease.name}
                </h2>

                <p className="text-gray-500 mt-2 text-sm line-clamp-2">
                  {disease.symptoms || "No symptoms listed yet."}
                </p>

                <button
                  onClick={() => navigate(`/diseases/${disease.id}`)}
                  className="mt-5 w-full py-2.5 rounded-xl bg-emerald-50 text-emerald-700 font-semibold hover:bg-emerald-600 hover:text-white transition"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
