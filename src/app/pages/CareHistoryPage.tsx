import { useEffect, useState } from "react";
import { Droplets, Sprout, Leaf, Loader2 } from "lucide-react";

import { usePlants } from "../context/PlantContext";
import { careLogApi, getApiErrorMessage, type CareLog } from "../../lib/api";

export default function CareHistoryPage() {
  const { plants } = usePlants();

  const [logs, setLogs] = useState<CareLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    careLogApi
      .list({ limit: 50 })
      .then((result) => {
        if (!cancelled) setLogs(result.data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(getApiErrorMessage(err, "Could not load care history."));
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const plantName = (myPlantId: number) =>
    plants.find((p) => p.id === myPlantId)?.plant.commonName ?? "A plant";

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold flex items-center gap-3">
            Care History
          </h1>
          <p className="text-gray-600 mt-2">Track all plant activities</p>
        </div>

        {error && (
          <div className="rounded-2xl bg-red-50 border border-red-200 text-red-600 text-sm px-5 py-4">
            {error}
          </div>
        )}

        <div className="bg-white rounded-3xl p-6 shadow-sm space-y-5">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-7 h-7 text-emerald-600 animate-spin" />
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-10">
              <Leaf className="mx-auto text-gray-300 w-16 h-16" />
              <p className="text-gray-500 mt-3">No care history yet</p>
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="flex gap-4 items-center border-b pb-5 last:border-none"
              >
                <div
                  className={`p-3 rounded-xl ${
                    log.type === "watering"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-emerald-100 text-emerald-600"
                  }`}
                >
                  {log.type === "watering" ? <Droplets /> : <Sprout />}
                </div>

                <div>
                  <h3 className="font-bold">{plantName(log.myPlantId)}</h3>
                  <p className="text-gray-600">
                    {log.type === "watering"
                      ? "Watered successfully"
                      : "Fertilizer applied"}
                  </p>
                  <span className="text-sm text-gray-400">
                    {formatDate(log.createdAt)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
