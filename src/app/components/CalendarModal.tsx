import { useState } from "react";
import { X, ChevronLeft, ChevronRight, Droplets, Sprout } from "lucide-react";

export function CalendarModal({ plants, onClose }: any) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date());

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const monthName = currentDate.toLocaleString("en-US", {
    month: "long",
  });

  const changeMonth = (amount: number) => {
    setCurrentDate(new Date(year, month + amount, 1));
  };

  const getTasks = (day: number) => {
    return plants.flatMap((plant: any) => {
      const tasks = [];

      // watering
      if (day % (plant.wateringFrequency || 7) === 0) {
        tasks.push({
          type: "water",
          plant: plant.name,
        });
      }

      // fertilizing every 30 days
      if (day % 30 === 0) {
        tasks.push({
          type: "fertilize",
          plant: plant.name,
        });
      }

      return tasks;
    });
  };

  return (
    <div
      className="
        fixed inset-0 bg-black/40 backdrop-blur-sm z-50
        flex items-center justify-center p-4
      "
    >
      {/*
        Outer modal shell:
        - max-h-[90vh] + flex-col caps total height to the viewport
        - min-h-0 on the shell lets the inner scroll area actually shrink
          instead of being pushed off-screen by its siblings
      */}
      <div
        className="
          bg-white rounded-3xl w-full max-w-3xl shadow-xl
          max-h-[90vh] min-h-0
          flex flex-col
          overflow-hidden
        "
      >
        {/* Header (fixed, never scrolls) */}
        <div
          className="
            flex justify-between items-center
            px-6 pt-6 pb-4
            shrink-0
          "
        >
          <h2 className="text-2xl font-bold">Care Calendar</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 transition"
            aria-label="Close calendar"
          >
            <X />
          </button>
        </div>

        {/* Scrollable body: month nav + grid + day details */}
        <div className="overflow-y-auto px-6 pb-6 min-h-0">
          {/* Month control */}
          <div className="flex justify-between items-center mb-5">
            <button
              onClick={() => changeMonth(-1)}
              className="p-2 rounded-lg hover:bg-gray-100 transition"
              aria-label="Previous month"
            >
              <ChevronLeft />
            </button>

            <h3 className="text-xl font-semibold">
              {monthName} {year}
            </h3>

            <button
              onClick={() => changeMonth(1)}
              className="p-2 rounded-lg hover:bg-gray-100 transition"
              aria-label="Next month"
            >
              <ChevronRight />
            </button>
          </div>

          {/* Week days */}
          <div className="grid grid-cols-7 text-center font-semibold text-gray-500 mb-2 text-xs sm:text-sm">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>

          {/* Calendar grid
              - aspect-square instead of a fixed h-16 keeps cells from
                forcing the grid taller than the viewport on small screens
              - min-w-0 + truncate-safe contents stop horizontal overflow
          */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`pad-${i}`} />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const tasks = getTasks(day);
              const active =
                selectedDay.getDate() === day &&
                selectedDay.getMonth() === month &&
                selectedDay.getFullYear() === year;

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(new Date(year, month, day))}
                  className={`
                    aspect-square min-w-0 rounded-xl border
                    flex flex-col items-center justify-center
                    transition text-sm
                    ${active ? "bg-emerald-600 text-white" : "hover:bg-emerald-50"}
                  `}
                >
                  <span>{day}</span>
                  <div className="flex gap-1 mt-0.5">
                    {tasks.some((t) => t.type === "water") && (
                      <Droplets size={12} className="shrink-0" />
                    )}
                    {tasks.some((t) => t.type === "fertilize") && (
                      <Sprout size={12} className="shrink-0" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected day details
              - max-h + overflow-y-auto so a long task list (many plants)
                scrolls inside its own box instead of growing the modal
                past the viewport
          */}
          <div className="mt-6 bg-gray-50 rounded-2xl p-5">
            <h3 className="font-bold mb-3">
              Tasks for {selectedDay.toLocaleDateString()}
            </h3>

            <div className="max-h-48 overflow-y-auto pr-1 space-y-2">
              {getTasks(selectedDay.getDate()).length === 0 ? (
                <p className="text-gray-500">No care scheduled</p>
              ) : (
                getTasks(selectedDay.getDate()).map((task: any, index) => (
                  <div key={index} className="flex items-center gap-3 min-w-0">
                    {task.type === "water" ? (
                      <Droplets className="text-blue-600 shrink-0" size={18} />
                    ) : (
                      <Sprout className="text-emerald-600 shrink-0" size={18} />
                    )}
                    <span className="truncate">
                      {task.type === "water" ? "Water " : "Fertilize "}
                      {task.plant}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
