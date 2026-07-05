import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  Droplet,
  Sprout,
  Trash2,
  Loader2,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from "lucide-react";

import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import type { MyPlant } from "../../lib/api";

interface PlantCardProps {
  myPlant: MyPlant;
  onWater: (myPlantId: number) => Promise<void>;
  onFertilize: (myPlantId: number) => Promise<void>;
  onDelete: (myPlantId: number) => Promise<void>;
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

/** How far through the current cycle a schedule is, 0-100. Null when
 * there isn't enough info (no frequency, or never done yet) to show one. */
function cycleProgress(
  lastDone: string | null,
  frequency: number | null,
): number | null {
  if (!lastDone || !frequency || frequency <= 0) return null;
  const elapsedDays = (Date.now() - new Date(lastDone).getTime()) / DAY_MS;
  return Math.min(100, Math.max(0, (elapsedDays / frequency) * 100));
}

type Urgency = "overdue" | "today" | "upcoming" | "none";

function urgencyOf(days: number | null): Urgency {
  if (days === null) return "none";
  if (days < 0) return "overdue";
  if (days === 0) return "today";
  return "upcoming";
}

const scheduleRowStyles: Record<
  Urgency,
  { text: string; track: string; indicator: string }
> = {
  overdue: {
    text: "text-red-600",
    track: "bg-red-100",
    indicator: "[&>div]:!bg-red-500",
  },
  today: {
    text: "text-amber-600",
    track: "bg-amber-100",
    indicator: "[&>div]:!bg-amber-500",
  },
  upcoming: {
    text: "text-gray-600",
    track: "bg-gray-100",
    indicator: "[&>div]:!bg-emerald-500",
  },
  none: {
    text: "text-gray-400",
    track: "bg-gray-100",
    indicator: "[&>div]:!bg-gray-300",
  },
};

export function PlantCard({
  myPlant,
  onWater,
  onFertilize,
  onDelete,
}: PlantCardProps) {
  const navigate = useNavigate();
  const [pendingAction, setPendingAction] = useState<
    "water" | "fertilize" | "delete" | null
  >(null);

  const waterIn = daysUntil(myPlant.nextWatering);
  const fertilizeIn = daysUntil(myPlant.nextFertilizing);
  const waterUrgency = urgencyOf(waterIn);
  const fertilizeUrgency = urgencyOf(fertilizeIn);

  const waterProgress = cycleProgress(
    myPlant.lastWatered,
    myPlant.wateringFrequency,
  );
  const fertilizeProgress = cycleProgress(
    myPlant.lastFertilized,
    myPlant.fertilizingFrequency,
  );

  // Card-level status badge reflects whichever schedule is most urgent.
  const overallUrgency: Urgency =
    waterUrgency === "overdue" || fertilizeUrgency === "overdue"
      ? "overdue"
      : waterUrgency === "today" || fertilizeUrgency === "today"
        ? "today"
        : waterUrgency === "upcoming" || fertilizeUrgency === "upcoming"
          ? "upcoming"
          : "none";

  const statusBadge: Record<
    Urgency,
    { label: string; className: string; icon: typeof CheckCircle2 }
  > = {
    overdue: {
      label: "Needs attention",
      className: "bg-red-600 text-white border-transparent",
      icon: AlertTriangle,
    },
    today: {
      label: "Due today",
      className: "bg-amber-500 text-white border-transparent",
      icon: Clock,
    },
    upcoming: {
      label: "On track",
      className: "bg-emerald-600 text-white border-transparent",
      icon: CheckCircle2,
    },
    none: {
      label: "No schedule",
      className: "bg-gray-500 text-white border-transparent",
      icon: Clock,
    },
  };
  const StatusIcon = statusBadge[overallUrgency].icon;

  const goToDetails = () => navigate(`/plants/${myPlant.plant.id}`);

  const runAction = async (
    kind: "water" | "fertilize" | "delete",
    action: () => Promise<void>,
  ) => {
    if (pendingAction) return;
    setPendingAction(kind);
    try {
      await action();
    } finally {
      setPendingAction(null);
    }
  };

  const handleDelete = () => {
    if (
      window.confirm(
        `Remove ${myPlant.plant.commonName} from your collection?`,
      )
    ) {
      runAction("delete", () => onDelete(myPlant.id));
    }
  };

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-transparent hover:border-emerald-100">
      <div className="relative h-48 overflow-hidden">
        <button onClick={goToDetails} className="block w-full h-full text-left">
          <ImageWithFallback
            src={myPlant.imageUrl || myPlant.plant.imageUrl}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </button>

        <Badge
          className={`absolute top-3 right-3 gap-1 shadow-sm ${statusBadge[overallUrgency].className}`}
        >
          <StatusIcon size={12} />
          {statusBadge[overallUrgency].label}
        </Badge>
      </div>

      <div className="p-6">
        <button onClick={goToDetails} className="text-left">
          <h3 className="text-xl font-bold group-hover:text-emerald-600 transition-colors">
            {myPlant.plant.commonName}
          </h3>
          <p className="text-gray-500 italic">{myPlant.plant.scientificName}</p>
        </button>

        <div className="mt-4 space-y-3">
          <ScheduleRow
            icon={<Droplet size={15} />}
            label="Water"
            statusText={formatDays(waterIn)}
            urgency={waterUrgency}
            progress={waterProgress}
          />
          <ScheduleRow
            icon={<Sprout size={15} />}
            label="Fertilize"
            statusText={formatDays(fertilizeIn)}
            urgency={fertilizeUrgency}
            progress={fertilizeProgress}
          />
        </div>

        <div className="flex gap-2 mt-5">
          <button
            onClick={() => runAction("water", () => onWater(myPlant.id))}
            disabled={pendingAction !== null}
            className="flex-1 bg-blue-600 text-white rounded-lg py-2 flex justify-center items-center gap-2 hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {pendingAction === "water" ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Droplet size={16} />
            )}
            Water
          </button>

          <button
            onClick={() =>
              runAction("fertilize", () => onFertilize(myPlant.id))
            }
            disabled={pendingAction !== null}
            className="flex-1 bg-emerald-600 text-white rounded-lg py-2 flex justify-center items-center gap-2 hover:bg-emerald-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {pendingAction === "fertilize" ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Sprout size={16} />
            )}
            Fertilize
          </button>

          <button
            onClick={handleDelete}
            disabled={pendingAction !== null}
            className="px-3 border rounded-lg hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
            aria-label="Remove plant"
          >
            {pendingAction === "delete" ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Trash2 size={16} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function ScheduleRow({
  icon,
  label,
  statusText,
  urgency,
  progress,
}: {
  icon: ReactNode;
  label: string;
  statusText: string;
  urgency: Urgency;
  progress: number | null;
}) {
  const styles = scheduleRowStyles[urgency];
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-1.5 text-gray-700 font-medium">
          {icon}
          {label}
        </span>
        <span className={`font-semibold ${styles.text}`}>{statusText}</span>
      </div>
      {progress !== null && (
        <Progress
          value={progress}
          className={`h-1.5 mt-1.5 ${styles.track} ${styles.indicator}`}
        />
      )}
    </div>
  );
}
