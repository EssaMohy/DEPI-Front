import { Droplets, Sprout, Bug, CalendarDays, Leaf } from "lucide-react";

import { usePlants } from "../context/PlantContext";

export default function CareHistoryPage() {
  const { plants } = usePlants();

  const history = plants.flatMap((plant: any) => [
    {
      plant: plant.name,

      type: "water",

      date: "Today",

      text: "Watered successfully",
    },

    {
      plant: plant.name,

      type: "fertilize",

      date: "2 days ago",

      text: "Fertilizer applied",
    },

    {
      plant: plant.name,

      type: "diagnosis",

      date: "Last week",

      text: "Plant health checked",
    },
  ]);

  return (
    <div
      className="
min-h-screen
bg-gray-50
p-6
"
    >
      <div
        className="
max-w-5xl
mx-auto
space-y-6
"
      >
        <div>
          <h1
            className="
text-4xl
font-bold
flex
items-center
gap-3
"
          >
            Care History
          </h1>

          <p
            className="
text-gray-600
mt-2
"
          >
            Track all plant activities
          </p>
        </div>

        <div
          className="
bg-white
rounded-3xl
p-6
shadow-sm
space-y-5
"
        >
          {history.map((item: any, index) => (
            <div
              key={index}
              className="
flex
gap-4
items-center
border-b
pb-5
last:border-none
"
            >
              <div
                className={`
p-3
rounded-xl

${
  item.type === "water"
    ? "bg-blue-100 text-blue-600"
    : item.type === "fertilize"
      ? "bg-emerald-100 text-emerald-600"
      : "bg-red-100 text-red-600"
}

`}
              >
                {item.type === "water" ? (
                  <Droplets />
                ) : item.type === "fertilize" ? (
                  <Sprout />
                ) : (
                  <Bug />
                )}
              </div>

              <div>
                <h3
                  className="
font-bold
"
                >
                  {item.plant}
                </h3>

                <p
                  className="
text-gray-600
"
                >
                  {item.text}
                </p>

                <span
                  className="
text-sm
text-gray-400
"
                >
                  {item.date}
                </span>
              </div>
            </div>
          ))}

          {history.length === 0 && (
            <div
              className="
text-center
py-10
"
            >
              <Leaf
                className="
mx-auto
text-gray-300
w-16
h-16
"
              />

              <p
                className="
text-gray-500
mt-3
"
              >
                No care history yet
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
