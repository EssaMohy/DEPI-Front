import { useState } from 'react';
import { Upload, Camera, Loader2, Check, AlertTriangle, Search } from 'lucide-react';
import { myPlantApi, getApiErrorMessage, type IdentifySuggestion } from '../../lib/api';

interface IdentifyPlantContentProps {
  onClose: () => void;
  onIdentified: (myPlantId: number) => void;
  onSwitchToCatalog?: () => void;
}

export function IdentifyPlantContent({ onClose, onIdentified, onSwitchToCatalog }: IdentifyPlantContentProps) {
  const [step, setStep] = useState<'upload' | 'processing' | 'results'>('upload');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    recordId: number;
    status: string;
    imageUrl: string;
    suggestions: IdentifySuggestion[];
    myPlant?: { id: number };
  } | null>(null);
  const [confirming, setConfirming] = useState<number | null>(null);
  const [confirmedId, setConfirmedId] = useState<number | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleIdentify = async () => {
    if (!selectedFile) return;
    setStep('processing');
    setError(null);
    try {
      const res = await myPlantApi.identify(selectedFile);
      setResult(res);
      setStep('results');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not identify the plant. Please try again.'));
      setStep('upload');
    }
  };

  const handleConfirm = async (predictionIndex: number) => {
    if (!result) return;
    setConfirming(predictionIndex);
    setError(null);
    try {
      const myPlant = await myPlantApi.confirmIdentify(result.recordId, predictionIndex);
      setConfirmedId(myPlant.id);
      onIdentified(myPlant.id);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not add this plant.'));
    } finally {
      setConfirming(null);
    }
  };

  const handleReset = () => {
    setStep('upload');
    setImagePreview('');
    setSelectedFile(null);
    setError(null);
    setResult(null);
    setConfirming(null);
    setConfirmedId(null);
  };

  return (
    <div>
      {error && (
        <div className="mb-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {step === 'upload' && (
        <div className="text-center py-8">
          {imagePreview ? (
            <div className="space-y-4">
              <img src={imagePreview} alt="Preview" className="w-full h-64 object-contain rounded-xl bg-gray-100" />
              <div className="flex gap-3">
                <button
                  onClick={handleIdentify}
                  className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                >
                  Identify This Plant
                </button>
                <button
                  onClick={handleReset}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Choose Different
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Camera className="w-10 h-10 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Take or Upload a Photo</h3>
              <p className="text-gray-500 mb-6">
                Snap a clear photo of the plant's leaves and flowers for best results
              </p>
              <label className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors cursor-pointer">
                <Upload className="w-5 h-5" />
                <span>Choose Photo</span>
                <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
              </label>
            </>
          )}
        </div>
      )}

      {step === 'processing' && (
        <div className="text-center py-16">
          <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Identifying...</h3>
          <p className="text-gray-500">Analyzing the photo with our AI</p>
        </div>
      )}

      {step === 'results' && result && (
        <div className="space-y-4">
          <img src={result.imageUrl} alt="Uploaded plant" className="w-full h-48 object-cover rounded-xl bg-gray-100" />

          {confirmedId !== null ? (
            <div className="text-center py-8">
              <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Check className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">Plant Added!</h3>
              <p className="text-gray-500 mb-6">The plant has been added to your collection.</p>
              <button onClick={onClose} className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium">
                Done
              </button>
            </div>
          ) : result.suggestions.length === 0 ? (
            <div className="text-center py-8">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Could Not Identify</h3>
              <p className="text-gray-500 mb-6">
                Our AI couldn't confidently identify this plant.
              </p>
              {onSwitchToCatalog && (
                <button onClick={onSwitchToCatalog} className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium">
                  Browse Plant Catalog
                </button>
              )}
              <button onClick={handleReset} className={`px-6 py-3 rounded-lg font-medium transition-colors ${onSwitchToCatalog ? 'mt-3 text-gray-600 hover:bg-gray-100' : 'mt-6 bg-emerald-600 text-white hover:bg-emerald-700'}`}>
                Try Another Photo
              </button>
            </div>
          ) : (
            <>
              {(() => {
                const items = result.suggestions
                  .map((s) => s)
                  .filter((s) => s.confidence > 0.01)
                  .sort((a, b) => b.confidence - a.confidence);
                const catalogMatch = items.filter((s) => s.plantId != null);
                const noMatch = items.filter((s) => s.plantId == null);
                const top = catalogMatch[0];

                return (
                  <>
                    {top && (
                      <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-white border-2 border-emerald-300 p-5">
                        <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-3">Best match</p>
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-20 rounded-xl bg-gray-200 overflow-hidden flex-shrink-0 shadow-sm">
                            {top.imageUrl && <img src={top.imageUrl} alt="" className="w-full h-full object-cover" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 text-lg truncate">{top.plantName}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.round(top.confidence * 100)}%` }} />
                              </div>
                              <span className="text-sm font-medium text-emerald-700">{Math.round(top.confidence * 100)}%</span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleConfirm(top.predictionIndex)}
                            disabled={confirming !== null}
                            className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50 whitespace-nowrap shadow-sm"
                          >
                            {confirming === top.predictionIndex ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add'}
                          </button>
                        </div>
                      </div>
                    )}

                    {catalogMatch.length > 1 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Other matches</p>
                        <div className="grid gap-2">
                          {catalogMatch.slice(1).map((s) => (
                            <div key={s.predictionIndex} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200 hover:border-emerald-300 transition-colors">
                              <div className="w-12 h-12 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0">
                                {s.imageUrl && <img src={s.imageUrl} alt="" className="w-full h-full object-cover" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900 text-sm truncate">{s.plantName}</p>
                                <p className="text-xs text-gray-500">{Math.round(s.confidence * 100)}% confidence</p>
                              </div>
                              <button
                                onClick={() => handleConfirm(s.predictionIndex)}
                                disabled={confirming !== null}
                                className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-medium hover:bg-emerald-700 disabled:opacity-50 whitespace-nowrap"
                              >
                                {confirming === s.predictionIndex ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Add'}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {noMatch.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                          Not in catalog ({noMatch.length})
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {noMatch.map((s) => (
                            <span key={s.predictionIndex} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-500 rounded-lg text-xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                              {s.plantName}
                              <span className="text-gray-400">· {Math.round(s.confidence * 100)}%</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {onSwitchToCatalog && (
                      <button onClick={onSwitchToCatalog} className="mt-4 w-full px-4 py-3 border-2 border-dashed border-gray-300 text-gray-500 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-colors text-sm font-medium">
                        Not seeing your plant? Browse the catalog →
                      </button>
                    )}
                  </>
                );
              })()}
            </>
          )}
        </div>
      )}
    </div>
  );
}
