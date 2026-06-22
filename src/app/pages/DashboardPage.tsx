import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlantDashboard } from "../components/PlantDashboard";
import { AddPlantModal } from "../components/AddPlantModal";
import { DiagnosisModal } from "../components/DiagnosisModal";
import { usePlants } from "../context/PlantContext";

export function DashboardPage() {
  const navigate = useNavigate();
  const { plants, addPlant, waterPlant, deletePlant } = usePlants();

  const [showAddPlant, setShowAddPlant] = useState(false);
  const [showDiagnosis, setShowDiagnosis] = useState(false);

  return (
    <>
      <PlantDashboard
        plants={plants}
        onAddPlant={() => setShowAddPlant(true)}
        onDiagnose={() => setShowDiagnosis(true)}
        onWaterPlant={waterPlant}
        onDeletePlant={deletePlant}
        onBackToLanding={() => navigate("/")}
      />

      {showAddPlant && (
        <AddPlantModal
          onClose={() => setShowAddPlant(false)}
          onAdd={(plant) => {
            addPlant(plant);
            setShowAddPlant(false);
          }}
        />
      )}

      {showDiagnosis && (
        <DiagnosisModal onClose={() => setShowDiagnosis(false)} />
      )}
    </>
  );
}
