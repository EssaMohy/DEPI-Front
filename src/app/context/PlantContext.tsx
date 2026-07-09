import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { useAuth } from "../../hooks/useAuth";
import {
  myPlantApi,
  getApiErrorMessage,
  type MyPlant,
} from "../../lib/api";
import { useProfile } from "./ProfileContext";
import { useCareLogs } from "./CareLogContext";

interface PlantContextValue {
  /** The signed-in user's plant collection. */
  plants: MyPlant[];
  isLoading: boolean;
  error: string | null;
  /** Re-fetch the collection from the server. */
  refresh: () => Promise<void>;
  /** Add a catalog plant (by its catalog id) to the user's collection. */
  addPlant: (catalogPlantId: number) => Promise<MyPlant>;
  /** Mark a plant (by its MyPlant id) as watered today. */
  waterPlant: (myPlantId: number) => Promise<void>;
  /** Mark a plant (by its MyPlant id) as fertilized today. */
  fertilizePlant: (myPlantId: number) => Promise<void>;
  /** Remove a plant (by its MyPlant id) from the collection. */
  deletePlant: (myPlantId: number) => Promise<void>;
  /** Update the photo for a plant (by its MyPlant id). */
  updatePlantImage: (myPlantId: number, imageFile: File) => Promise<void>;
}

const PlantContext = createContext<PlantContextValue | null>(null);

export function PlantProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const { adjustCounts } = useProfile();
  const { recordLocalEntry } = useCareLogs();
  const [plants, setPlants] = useState<MyPlant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await myPlantApi.list({ limit: 100 });
      setPlants(result.data);
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not load your plants."));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load the collection once signed in; clear it on sign-out.
  useEffect(() => {
    if (isAuthenticated) {
      refresh();
    } else {
      setPlants([]);
      setError(null);
    }
  }, [isAuthenticated, refresh]);

  const addPlant = useCallback(
    async (catalogPlantId: number) => {
      const myPlant = await myPlantApi.add(catalogPlantId);
      setPlants((prev) => [myPlant, ...prev]);
      // Keep the Profile page's "My Plants" counter correct immediately,
      // regardless of whether it's mounted right now.
      adjustCounts({ plantsCount: 1 });
      return myPlant;
    },
    [adjustCounts],
  );

  const waterPlant = useCallback(
    async (myPlantId: number) => {
      const updated = await myPlantApi.water(myPlantId);
      setPlants((prev) =>
        prev.map((p) => (p.id === myPlantId ? updated : p)),
      );
      adjustCounts({ wateringCount: 1 });
      recordLocalEntry({ myPlantId, type: "watering" });
    },
    [adjustCounts, recordLocalEntry],
  );

  const fertilizePlant = useCallback(
    async (myPlantId: number) => {
      const updated = await myPlantApi.fertilize(myPlantId);
      setPlants((prev) =>
        prev.map((p) => (p.id === myPlantId ? updated : p)),
      );
      adjustCounts({ fertilizingCount: 1 });
      recordLocalEntry({ myPlantId, type: "fertilizing" });
    },
    [adjustCounts, recordLocalEntry],
  );

  const deletePlant = useCallback(
    async (myPlantId: number) => {
      await myPlantApi.remove(myPlantId);
      setPlants((prev) => prev.filter((p) => p.id !== myPlantId));
      adjustCounts({ plantsCount: -1 });
    },
    [adjustCounts],
  );

  const updatePlantImage = useCallback(async (myPlantId: number, imageFile: File) => {
    const updated = await myPlantApi.updateImage(myPlantId, imageFile);
    setPlants((prev) =>
      prev.map((p) => (p.id === myPlantId ? updated : p)),
    );
  }, []);

  return (
    <PlantContext.Provider
      value={{
        plants,
        isLoading,
        error,
        refresh,
        addPlant,
        waterPlant,
        fertilizePlant,
        deletePlant,
        updatePlantImage,
      }}
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
