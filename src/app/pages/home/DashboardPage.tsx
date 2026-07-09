import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { PlantDashboard } from "../../components/PlantDashboard";
import { AddPlantModal } from "../../components/AddPlantModal";
import { DiagnosisModal } from "../../components/DiagnosisModal";
import { CalendarModal } from "../../components/CalendarModal";

import { usePlants } from "../../context/PlantContext";
import { getApiErrorMessage } from "../../../lib/api";

export function DashboardPage() {
  const navigate = useNavigate();

  const { plants, isLoading, addPlant, waterPlant, fertilizePlant, deletePlant, updatePlantImage } =
    usePlants();

  const [showAddPlant, setShowAddPlant] = useState(false);
  const [showDiagnosis, setShowDiagnosis] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<Record<number, 'water' | 'fertilize' | null>>({});

  const handleWater = async (myPlantId: number) => {
    setActionError(null);
    setActionLoading((prev) => ({ ...prev, [myPlantId]: 'water' }));
    try {
      await waterPlant(myPlantId);
      setActionSuccess("Plant watered! 💧");
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err) {
      setActionError(getApiErrorMessage(err, "Could not water that plant."));
    } finally {
      setActionLoading((prev) => ({ ...prev, [myPlantId]: null }));
    }
  };

  const handleFertilize = async (myPlantId: number) => {
    setActionError(null);
    setActionLoading((prev) => ({ ...prev, [myPlantId]: 'fertilize' }));
    try {
      await fertilizePlant(myPlantId);
      setActionSuccess("Plant fertilized! 🌱");
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err) {
      setActionError(
        getApiErrorMessage(err, "Could not fertilize that plant."),
      );
    } finally {
      setActionLoading((prev) => ({ ...prev, [myPlantId]: null }));
    }
  };

  const handleDelete = async (myPlantId: number) => {
    setActionError(null);
    try {
      await deletePlant(myPlantId);
    } catch (err) {
      setActionError(
        getApiErrorMessage(err, "Could not remove that plant."),
      );
    }
  };

  return (
    <>
      {actionSuccess && (
        <div className="max-w-7xl mx-auto px-6 pt-6">
          <div className="rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-5 py-4">
            {actionSuccess}
          </div>
        </div>
      )}

      {actionError && (
        <div className="max-w-7xl mx-auto px-6 pt-6">
          <div className="rounded-2xl bg-red-50 border border-red-200 text-red-600 text-sm px-5 py-4">
            {actionError}
          </div>
        </div>
      )}

      <PlantDashboard
        plants={plants}
        isLoading={isLoading}
        actionLoading={actionLoading}
        onAddPlant={() => setShowAddPlant(true)}
        onDiagnose={() => setShowDiagnosis(true)}
        onCalendar={() => setShowCalendar(true)}
        onWaterPlant={handleWater}
        onFertilizePlant={handleFertilize}
        onDeletePlant={handleDelete}
        onUpdatePlantImage={updatePlantImage}
        onBackToLanding={() => navigate("/")}
      />

      {/* Add Plant Modal */}
      {showAddPlant && (
        <AddPlantModal
          onClose={() => setShowAddPlant(false)}
          onAdd={async (catalogPlantId: number) => {
            await addPlant(catalogPlantId);
          }}
        />
      )}

      {/* Diagnosis Modal */}
      {showDiagnosis && (
        <DiagnosisModal onClose={() => setShowDiagnosis(false)} />
      )}

      {/* Calendar Modal */}
      {showCalendar && (
        <CalendarModal plants={plants} onClose={() => setShowCalendar(false)} />
      )}
    </>
  );
}
