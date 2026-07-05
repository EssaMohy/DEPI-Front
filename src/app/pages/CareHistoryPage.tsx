import { RefreshCw, Droplets, Sprout, Leaf, Loader2 } from "lucide-react";

import { usePlants } from "../context/PlantContext";
import { useCareLogs } from "../context/CareLogContext";

export default function CareHistoryPage() {
  const { plants } = usePlants();
  // Shared across the app: a watering/fertilizing action taken from the
  // dashboard shows up here instantly, with no page reload needed.
  const { logs, isLoading, error, refresh } = useCareLogs();

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
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-3">
              Care History
            </h1>
            <p className="text-gray-600 mt-2">Track all plant activities</p>
          </div>

          <button
            onClick={() => refresh()}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 border-2 border-emerald-600 text-emerald-600 rounded-full hover:bg-emerald-50 disabled:opacity-50 transition"
          >
            <RefreshCw className={isLoading ? "animate-spin" : ""} size={16} />
            Refresh
          </button>
        </div>

        {error && (
          <div className="rounded-2xl bg-red-50 border border-red-200 text-red-600 text-sm px-5 py-4">
            {error}
          </div>
        )}

        <div className="bg-white rounded-3xl p-6 shadow-sm space-y-5">
          {isLoading && logs.length === 0 ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-7 h-7 text-emerald-600 animate-spin" />
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-10">
              <Leaf className="mx-auto text-gray-300 w-16 h-16" />
              <p className="text-gray-500 mt-3">No care history yet</p>
            </div>
          ) : (
            logs.map((log) => {
              // Negative ids mark entries recorded locally the instant a
              // dashboard action happened, ahead of the next refresh.
              const isJustLogged = log.id < 0;

              return (
                <div
                  key={log.id}
                  className={`flex gap-4 items-center border-b pb-5 last:border-none rounded-xl transition-colors duration-500 ${
                    isJustLogged ? "bg-emerald-50/60 -mx-3 px-3 py-2" : ""
                  }`}
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

                  <div className="flex-1">
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

                  {isJustLogged && (
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">
                      Just now
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
