import { Bell, Droplets, Sprout, Bug, Check } from "lucide-react";

import { useState } from "react";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "water",
      title: "Water your Monstera",
      description: "Your plant needs watering today",
      time: "10 minutes ago",
      read: false,
    },

    {
      id: 2,
      type: "fertilize",
      title: "Fertilize Snake Plant",
      description: "Fertilizing schedule is due",
      time: "Yesterday",
      read: false,
    },

    {
      id: 3,
      type: "disease",
      title: "Disease detected",
      description: "AI found possible leaf spot",
      time: "2 days ago",
      read: true,
    },
  ]);

  const markRead = (id: number) => {
    setNotifications(
      notifications.map((item) =>
        item.id === id
          ? {
              ...item,
              read: true,
            }
          : item,
      ),
    );
  };

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
max-w-4xl
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
            Notifications
          </h1>

          <p
            className="
text-gray-600
mt-2
"
          >
            Stay updated with your plant care
          </p>
        </div>

        <div
          className="
bg-white
rounded-3xl
shadow-sm
p-6
space-y-4
"
        >
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`

flex
items-center
justify-between
p-5
rounded-2xl
transition


${notification.read ? "bg-gray-50" : "bg-emerald-50"}


`}
            >
              <div
                className="
flex
gap-4
items-center
"
              >
                <div
                  className="
p-3
rounded-xl
bg-white
"
                >
                  {notification.type === "water" ? (
                    <Droplets className="text-blue-600" />
                  ) : notification.type === "fertilize" ? (
                    <Sprout className="text-emerald-600" />
                  ) : (
                    <Bug className="text-red-600" />
                  )}
                </div>

                <div>
                  <h3
                    className="
font-bold
"
                  >
                    {notification.title}
                  </h3>

                  <p
                    className="
text-gray-600
text-sm
"
                  >
                    {notification.description}
                  </p>

                  <span
                    className="
text-xs
text-gray-400
"
                  >
                    {notification.time}
                  </span>
                </div>
              </div>

              {!notification.read && (
                <button
                  onClick={() => markRead(notification.id)}
                  className="
bg-emerald-600
text-white
p-2
rounded-full
"
                >
                  <Check size={18} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
