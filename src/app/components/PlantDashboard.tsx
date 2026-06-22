import { useState } from 'react';
import { Droplet, Camera, Plus, Calendar, AlertCircle, Leaf, Trash2, Edit, ArrowLeft } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export interface Plant {
  id: string;
  name: string;
  species: string;
  image: string;
  lastWatered: Date;
  wateringFrequency: number;
  health: 'excellent' | 'good' | 'fair' | 'poor';
  notes: string;
}

interface PlantDashboardProps {
  plants: Plant[];
  onAddPlant: () => void;
  onDiagnose: () => void;
  onWaterPlant: (plantId: string) => void;
  onDeletePlant: (plantId: string) => void;
  onBackToLanding?: () => void;
}

export function PlantDashboard({ plants, onAddPlant, onDiagnose, onWaterPlant, onDeletePlant, onBackToLanding }: PlantDashboardProps) {
  const getDaysUntilWatering = (plant: Plant) => {
    const daysSinceWatered = Math.floor((Date.now() - plant.lastWatered.getTime()) / (1000 * 60 * 60 * 24));
    return plant.wateringFrequency - daysSinceWatered;
  };


  const getWateringStatus = (daysUntil: number) => {
    if (daysUntil < 0) return { text: 'Overdue!', color: 'text-red-600 bg-red-50' };
    if (daysUntil === 0) return { text: 'Water today', color: 'text-orange-600 bg-orange-50' };
    if (daysUntil <= 2) return { text: `${daysUntil} days`, color: 'text-yellow-600 bg-yellow-50' };
    return { text: `${daysUntil} days`, color: 'text-green-600 bg-green-50' };
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excellent': return 'text-green-600 bg-green-50';
      case 'good': return 'text-blue-600 bg-blue-50';
      case 'fair': return 'text-yellow-600 bg-yellow-50';
      case 'poor': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const overdueCount = plants.filter(p => getDaysUntilWatering(p) < 0).length;
  const todayCount = plants.filter(p => getDaysUntilWatering(p) === 0).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-4 mb-2">
                {onBackToLanding && (
                  <button
                    onClick={onBackToLanding}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                  </button>
                )}
                <h1 className="text-3xl font-bold text-gray-900">My Plants</h1>
              </div>
              <p className="text-gray-600">Track and care for your green friends</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onDiagnose}
                className="flex items-center gap-2 px-4 py-2 border-2 border-emerald-600 text-emerald-600 rounded-full hover:bg-emerald-50 transition-colors"
              >
                <Camera className="w-5 h-5" />
                <span>Diagnose Plant</span>
              </button>
              <button
                onClick={onAddPlant}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Add Plant</span>
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-emerald-50 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Leaf className="w-8 h-8 text-emerald-600" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">{plants.length}</div>
                  <div className="text-sm text-gray-600">Total Plants</div>
                </div>
              </div>
            </div>
            <div className="bg-red-50 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-8 h-8 text-red-600" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">{overdueCount}</div>
                  <div className="text-sm text-gray-600">Needs Water</div>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-8 h-8 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">{todayCount}</div>
                  <div className="text-sm text-gray-600">Due Today</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Plant Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {plants.length === 0 ? (
          <div className="text-center py-16">
            <Leaf className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No plants yet</h3>
            <p className="text-gray-600 mb-6">Start building your plant collection</p>
            <button
              onClick={onAddPlant}
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Your First Plant
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plants.map(plant => {
              const daysUntil = getDaysUntilWatering(plant);
              const wateringStatus = getWateringStatus(daysUntil);

              return (
                <div key={plant.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  <div className="relative h-48">
                    <ImageWithFallback
                      src={plant.image}
                      alt={plant.name}
                      className="w-full h-full object-cover"
                    />
                    <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-sm font-medium ${getHealthColor(plant.health)}`}>
                      {plant.health}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{plant.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{plant.species}</p>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Next watering:</span>
                        <span className={`text-sm font-medium px-2 py-1 rounded ${wateringStatus.color}`}>
                          {wateringStatus.text}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Last watered:</span>
                        <span className="text-sm text-gray-900">
                          {Math.floor((Date.now() - plant.lastWatered.getTime()) / (1000 * 60 * 60 * 24))} days ago
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => onWaterPlant(plant.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Droplet className="w-4 h-4" />
                        Water Now
                      </button>
                      <button
                        onClick={() => onDeletePlant(plant.id)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}