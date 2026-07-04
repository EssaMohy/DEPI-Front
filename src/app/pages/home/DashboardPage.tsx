import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { PlantDashboard } from "../../components/PlantDashboard";
import { AddPlantModal } from "../../components/AddPlantModal";
import { DiagnosisModal } from "../../components/DiagnosisModal";
import { CalendarModal } from "../../components/CalendarModal";

import { usePlants } from "../../context/PlantContext";
import { getApiErrorMessage } from "../../../lib/api";

export function DashboardPage() {
  const navigate = useNavigate();

  const { plants, isLoading, addPlant, waterPlant, fertilizePlant, deletePlant } =
    usePlants();

  const [showAddPlant, setShowAddPlant] = useState(false);
  const [showDiagnosis, setShowDiagnosis] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleWater = async (myPlantId: number) => {
    setActionError(null);
    try {
      await waterPlant(myPlantId);
    } catch (err) {
      setActionError(getApiErrorMessage(err, "Could not water that plant."));
    }
  };

  const handleFertilize = async (myPlantId: number) => {
    setActionError(null);
    try {
      await fertilizePlant(myPlantId);
    } catch (err) {
      setActionError(
        getApiErrorMessage(err, "Could not fertilize that plant."),
      );
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
        onAddPlant={() => setShowAddPlant(true)}
        onDiagnose={() => setShowDiagnosis(true)}
        onCalendar={() => setShowCalendar(true)}
        onWaterPlant={handleWater}
        onFertilizePlant={handleFertilize}
        onDeletePlant={handleDelete}
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
