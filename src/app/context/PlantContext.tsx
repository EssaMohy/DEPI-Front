import { createContext, useContext, useState, type ReactNode } from "react";

export interface Plant {
  id: string;
  name: string;
  species: string;
  wateringIntervalDays: number;
  lastWatered: string; // ISO date
  imageUrl?: string;
}

interface PlantContextValue {
  plants: Plant[];
  addPlant: (plant: Omit<Plant, "id">) => void;
  waterPlant: (id: string) => void;
  deletePlant: (id: string) => void;
}

const PlantContext = createContext<PlantContextValue | null>(null);

export function PlantProvider({ children }: { children: ReactNode }) {
  const [plants, setPlants] = useState<Plant[]>([]);

  const addPlant = (plant: Omit<Plant, "id">) => {
    setPlants((prev) => [...prev, { ...plant, id: crypto.randomUUID() }]);
  };

  const waterPlant = (id: string) => {
    setPlants((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, lastWatered: new Date().toISOString() } : p,
      ),
    );
  };

  const deletePlant = (id: string) => {
    setPlants((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <PlantContext.Provider
      value={{ plants, addPlant, waterPlant, deletePlant }}
    >
      {children}
    </PlantContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePlants() {
  const ctx = useContext(PlantContext);
  if (!ctx) {
    throw new Error("usePlants must be used within a <PlantProvider>");
  }
  return ctx;
}
