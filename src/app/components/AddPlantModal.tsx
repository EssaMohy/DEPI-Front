import { useState } from 'react';
import { X, Search } from 'lucide-react';
import { Plant } from './PlantDashboard';

interface AddPlantModalProps {
  onClose: () => void;
  onAdd: (plant: Omit<Plant, 'id'>) => void;
}

const commonPlants = [
  { name: 'Monstera', species: 'Monstera Deliciosa', wateringDays: 7, image: 'https://images.unsplash.com/photo-1775598369836-74f2e6c51095?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400' },
  { name: 'Snake Plant', species: 'Sansevieria Trifasciata', wateringDays: 14, image: 'https://images.unsplash.com/photo-1769653907239-c8f1a1843b08?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400' },
  { name: 'Pothos', species: 'Epipremnum Aureum', wateringDays: 7, image: 'https://images.unsplash.com/photo-1777383504353-77974872c2ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400' },
  { name: 'Peace Lily', species: 'Spathiphyllum', wateringDays: 5, image: 'https://images.unsplash.com/photo-1735973634121-d93cf7c94b44?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400' },
  { name: 'Succulent', species: 'Various Species', wateringDays: 21, image: 'https://images.unsplash.com/photo-1772907952251-09e722aafa6a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400' },
  { name: 'Fern', species: 'Nephrolepis', wateringDays: 3, image: 'https://images.unsplash.com/photo-1772907952266-3a7981f3f234?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400' },
];

export function AddPlantModal({ onClose, onAdd }: AddPlantModalProps) {
  const [search, setSearch] = useState('');
  const [customMode, setCustomMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    wateringFrequency: 7,
    notes: '',
    image: ''
  });

  const filteredPlants = commonPlants.filter(plant =>
    plant.name.toLowerCase().includes(search.toLowerCase()) ||
    plant.species.toLowerCase().includes(search.toLowerCase())
  );

  const handleQuickAdd = (plant: typeof commonPlants[0]) => {
    onAdd({
      name: plant.name,
      species: plant.species,
      image: plant.image,
      lastWatered: new Date(),
      wateringFrequency: plant.wateringDays,
      health: 'good',
      notes: ''
    });
    onClose();
  };

  const handleCustomAdd = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      name: formData.name,
      species: formData.species,
      image: formData.image || 'https://images.unsplash.com/photo-1772795786893-62866eb17226?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
      lastWatered: new Date(),
      wateringFrequency: formData.wateringFrequency,
      health: 'good',
      notes: formData.notes
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Add New Plant</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setCustomMode(false)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                !customMode
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Quick Add
            </button>
            <button
              onClick={() => setCustomMode(true)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                customMode
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Custom Plant
            </button>
          </div>

          {!customMode ? (
            <>
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for a plant..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {filteredPlants.map((plant, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickAdd(plant)}
                    className="text-left bg-gray-50 rounded-xl p-4 hover:bg-emerald-50 hover:border-emerald-500 border-2 border-transparent transition-all"
                  >
                    <div className="aspect-square bg-gray-200 rounded-lg mb-3 overflow-hidden">
                      <img src={plant.image} alt={plant.name} className="w-full h-full object-cover" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{plant.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{plant.species}</p>
                    <p className="text-xs text-emerald-600">Water every {plant.wateringDays} days</p>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <form onSubmit={handleCustomAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plant Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g., My Monstera"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Species *
                </label>
                <input
                  type="text"
                  required
                  value={formData.species}
                  onChange={(e) => setFormData({ ...formData, species: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g., Monstera Deliciosa"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Watering Frequency (days) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max="365"
                  value={formData.wateringFrequency}
                  onChange={(e) => setFormData({ ...formData, wateringFrequency: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL (optional)
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  rows={3}
                  placeholder="Care instructions, location, etc."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
              >
                Add Plant
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}