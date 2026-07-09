import { useState, useRef, useEffect } from 'react';
import { X, Camera, Upload, Loader, CheckCircle2, AlertTriangle } from 'lucide-react';
import { diagnosticApi, getApiErrorMessage, type DiagnosticDetection } from '../../lib/api';

interface DiagnosisModalProps {
  onClose: () => void;
}

interface DiagnosisInstance {
  bbox: [number, number, number, number];
  confidence: number;
}

interface DiagnosisResult {
  condition: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  treatment: string[];
  confidence: number;
  instances: DiagnosisInstance[];
}

function transformDetection(detection: DiagnosticDetection): DiagnosisResult {
  const firstInstance = detection.instances?.[0];
  const confidence = firstInstance?.confidence ?? 0.85;
  const severity: 'low' | 'medium' | 'high' =
    confidence >= 0.8 ? 'low' : confidence >= 0.6 ? 'medium' : 'high';

  const treatmentArray = detection.treatment?.steps ?? ['Consult a plant specialist for treatment options'];

  return {
    condition: detection.name,
    severity,
    description: detection.description || `Detected: ${detection.name}`,
    treatment: treatmentArray,
    confidence: Math.round(confidence * 100),
    instances: (detection.instances || []).map((inst) => ({
      bbox: inst.bbox,
      confidence: Math.round((inst.confidence ?? 0) * 100),
    })),
  };
}

function BboxOverlay({
  instances,
  condition,
  imageWidth,
  imageHeight,
  naturalWidth,
  naturalHeight,
}: {
  instances: DiagnosisInstance[];
  condition: string;
  imageWidth: number;
  imageHeight: number;
  naturalWidth: number;
  naturalHeight: number;
}) {
  const filtered = instances.filter((i) => i.confidence > 30);
  if (filtered.length === 0) return null;

  const color = '#ef4444';

  const scale = Math.min(
    imageWidth / naturalWidth,
    imageHeight / naturalHeight
  );
  const renderedWidth = naturalWidth * scale;
  const renderedHeight = naturalHeight * scale;
  const offsetX = (imageWidth - renderedWidth) / 2;
  const offsetY = (imageHeight - renderedHeight) / 2;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {filtered.map((instance, idx) => {
        const [x1, y1, x2, y2] = instance.bbox;
        const left = offsetX + x1 * renderedWidth;
        const top = offsetY + y1 * renderedHeight;
        const width = (x2 - x1) * renderedWidth;
        const height = (y2 - y1) * renderedHeight;
        const area = width * height;
        const imageArea = imageWidth * imageHeight;
        const isFullFrame = imageArea > 0 && area / imageArea > 0.7;

        if (isFullFrame) {
          return (
            <div
              key={idx}
              className="absolute inset-0 border-4 rounded-lg flex items-start justify-end p-2"
              style={{ borderColor: color }}
            >
              <span
                className="text-xs font-bold px-2 py-1 rounded"
                style={{ backgroundColor: color, color: 'white' }}
              >
                {condition} — {Math.round(instance.confidence)}%
              </span>
            </div>
          );
        }

        return (
          <div
            key={idx}
            className="absolute border-2"
            style={{
              left: `${left}px`,
              top: `${top}px`,
              width: `${width}px`,
              height: `${height}px`,
              borderColor: color,
            }}
          >
            <span
              className="text-xs font-bold px-1 rounded"
              style={{ backgroundColor: color, color: 'white' }}
            >
              {condition} — {Math.round(instance.confidence)}%
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function DiagnosisModal({ onClose }: DiagnosisModalProps) {
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<DiagnosisResult[]>([]);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [selectedResult, setSelectedResult] = useState<DiagnosisResult | null>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setError(null);
      setResults([]);
      setSelectedResult(null);
      setImagePreview('');
      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.onerror = () => {
          setError('Failed to read the image file. Please try another.');
        };
        reader.readAsDataURL(file);
      } catch (err) {
        setError('Failed to process the image. Please try another.');
      }
    }
  };

  const analyzeImage = async () => {
    if (!selectedFile) return;

    setAnalyzing(true);
    setError(null);
    setResults([]);
    setSelectedResult(null);

    try {
      const diagnosis = await diagnosticApi.diagnose(selectedFile);
      if (diagnosis.detections && diagnosis.detections.length > 0) {
        const transformed = diagnosis.detections.map(transformDetection);
        setResults(transformed);
        setSelectedResult(transformed[0]);
      } else {
        setError('No diagnosis results found. Please try a different image.');
      }
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to analyze image. Please try again.'));
    } finally {
      setAnalyzing(false);
    }
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
  };

  const handleAnalyze = () => {
    if (selectedFile) {
      analyzeImage();
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'text-green-600 bg-green-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'high':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'low':
        return <CheckCircle2 className="w-6 h-6" />;
      case 'medium':
        return <AlertTriangle className="w-6 h-6" />;
      case 'high':
        return <AlertTriangle className="w-6 h-6" />;
      default:
        return <CheckCircle2 className="w-6 h-6" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">AI Plant Diagnosis</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {!imagePreview ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Camera className="w-12 h-12 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Upload Plant Photo
              </h3>
              <p className="text-gray-600 mb-8">
                Take a clear photo of your plant's leaves to get an AI-powered
                health diagnosis
              </p>

              <label className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors cursor-pointer">
                <Upload className="w-5 h-5" />
                <span>Choose Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>

              <div className="mt-8 p-4 bg-blue-50 rounded-lg text-sm text-left">
                <p className="font-medium text-blue-900 mb-2">
                  Tips for best results:
                </p>
                <ul className="space-y-1 text-blue-800">
                  <li>• Use good lighting - natural light works best</li>
                  <li>• Focus on affected areas (spots, discoloration, etc.)</li>
                  <li>• Take photos from multiple angles if needed</li>
                  <li>• Ensure leaves are in focus and clearly visible</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Image with Bounding Boxes */}
              <div ref={imageRef} className="relative rounded-xl overflow-hidden bg-gray-100">
                <img
                  src={imagePreview}
                  alt="Plant"
                  className="w-full h-64 object-contain"
                  onLoad={handleImageLoad}
                />
                {results.length > 0 && selectedResult && imageDimensions.width > 0 && (
                  <BboxOverlay
                    instances={selectedResult.instances}
                    condition={selectedResult.condition}
                    imageWidth={imageRef.current?.clientWidth ?? 0}
                    imageHeight={imageRef.current?.clientHeight ?? 0}
                    naturalWidth={imageDimensions.width}
                    naturalHeight={imageDimensions.height}
                  />
                )}
              </div>

              {/* Detection Tabs (if multiple) */}
              {results.length > 1 && (
                <div className="flex gap-2 flex-wrap">
                  {results.map((r, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedResult(r)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        selectedResult === r
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {r.condition} ({r.confidence}%)
                    </button>
                  ))}
                </div>
              )}

              {selectedResult === null && !analyzing && !error && (
                <div className="flex gap-3">
                  <button
                    onClick={handleAnalyze}
                    className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                  >
                    Analyze Image
                  </button>
                  <button
                    onClick={() => {
                      setImagePreview('');
                      setSelectedFile(null);
                    }}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Choose Different
                  </button>
                </div>
              )}

              {analyzing && (
                <div className="text-center py-8">
                  <Loader className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Analyzing Your Plant...
                  </h3>
                  <p className="text-gray-600">
                    Our AI is examining the image for health indicators
                  </p>
                </div>
              )}

              {error && (
                <div className="text-center py-8">
                  <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-red-600 mb-2">
                    Analysis Failed
                  </h3>
                  <p className="text-gray-600 mb-6">{error}</p>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={handleAnalyze}
                      className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                    >
                      Try Again
                    </button>
                    <button
                      onClick={() => {
                        setImagePreview('');
                        setSelectedFile(null);
                        setError(null);
                      }}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      Choose Different
                    </button>
                  </div>
                </div>
              )}

              {selectedResult && !analyzing && !error && (
                <div className="space-y-6">
                  <div
                    className={`p-6 rounded-xl ${getSeverityColor(selectedResult.severity)}`}
                  >
                    <div className="flex items-start gap-4">
                      {getSeverityIcon(selectedResult.severity)}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-1">
                          {selectedResult.condition}
                        </h3>
                        <div className="text-sm opacity-80 mb-2">
                          Confidence: {selectedResult.confidence}%
                        </div>
                        <p className="leading-relaxed">{selectedResult.description}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">
                      Recommended Treatment:
                    </h4>
                    <ul className="space-y-3">
                      {selectedResult.treatment.map((step, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                            {index + 1}
                          </div>
                          <span className="text-gray-700 leading-relaxed">
                            {step}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setImagePreview('');
                        setResults([]);
                        setSelectedResult(null);
                        setSelectedFile(null);
                      }}
                      className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                    >
                      Analyze Another Plant
                    </button>
                    <button
                      onClick={onClose}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}