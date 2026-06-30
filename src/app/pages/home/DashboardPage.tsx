import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { PlantDashboard } from "../../components/PlantDashboard";
import { AddPlantModal } from "../../components/AddPlantModal";
import { DiagnosisModal } from "../../components/DiagnosisModal";
import { CalendarModal } from "../../components/CalendarModal";

import { usePlants } from "../../context/PlantContext";

export function DashboardPage() {
  const navigate = useNavigate();

  const { plants, addPlant, waterPlant, deletePlant } = usePlants();

  const [showAddPlant, setShowAddPlant] = useState(false);

  const [showDiagnosis, setShowDiagnosis] = useState(false);

  const [showCalendar, setShowCalendar] = useState(false);

  return (
    <>
      <PlantDashboard
        plants={plants}
        onAddPlant={() => setShowAddPlant(true)}
        onDiagnose={() => setShowDiagnosis(true)}
        onCalendar={() => setShowCalendar(true)}
        onWaterPlant={(plantId: any) => waterPlant(plantId)}
        onDeletePlant={(plantId: any) => deletePlant(plantId)}
        onBackToLanding={() => navigate("/")}
      />

      {/* Add Plant Modal */}

      {showAddPlant && (
        <AddPlantModal
          onClose={() => setShowAddPlant(false)}
          onAdd={(plant: any) => {
            addPlant(plant);

            setShowAddPlant(false);
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
