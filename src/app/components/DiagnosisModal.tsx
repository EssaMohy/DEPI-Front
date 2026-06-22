import { useState } from 'react';
import { X, Camera, Upload, Loader, CheckCircle2, AlertTriangle } from 'lucide-react';

interface DiagnosisModalProps {
  onClose: () => void;
}

interface DiagnosisResult {
  condition: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  treatment: string[];
  confidence: number;
}

export function DiagnosisModal({ onClose }: DiagnosisModalProps) {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const mockDiagnoses: DiagnosisResult[] = [
    {
      condition: 'Healthy Plant',
      severity: 'low',
      description: 'Your plant appears to be in excellent condition with vibrant green leaves and strong growth patterns.',
      treatment: [
        'Continue current watering schedule',
        'Maintain indirect sunlight exposure',
        'Consider fertilizing monthly during growing season'
      ],
      confidence: 95
    },
    {
      condition: 'Overwatering',
      severity: 'medium',
      description: 'Signs of overwatering detected. Yellowing leaves and potentially soggy soil indicate excess moisture.',
      treatment: [
        'Reduce watering frequency',
        'Ensure pot has proper drainage holes',
        'Allow soil to dry between waterings',
        'Check for root rot and trim if necessary'
      ],
      confidence: 87
    },
    {
      condition: 'Nutrient Deficiency',
      severity: 'medium',
      description: 'Pale or yellowing leaves suggest a lack of essential nutrients, likely nitrogen deficiency.',
      treatment: [
        'Apply balanced liquid fertilizer',
        'Use fertilizer every 2-4 weeks during growing season',
        'Consider repotting with fresh nutrient-rich soil',
        'Ensure proper pH levels for nutrient absorption'
      ],
      confidence: 82
    },
    {
      condition: 'Pest Infestation',
      severity: 'high',
      description: 'Possible pest activity detected. Small spots or webbing may indicate spider mites or aphids.',
      treatment: [
        'Isolate plant from other plants immediately',
        'Spray with neem oil solution',
        'Wipe leaves with soapy water',
        'Monitor closely for next 2 weeks',
        'Consider insecticidal soap if infestation persists'
      ],
      confidence: 78
    }
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        analyzeImage();
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = () => {
    setAnalyzing(true);
    setResult(null);

    setTimeout(() => {
      const randomDiagnosis = mockDiagnoses[Math.floor(Math.random() * mockDiagnoses.length)];
      setResult(randomDiagnosis);
      setAnalyzing(false);
    }, 2500);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'high': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'low': return <CheckCircle2 className="w-6 h-6" />;
      case 'medium': return <AlertTriangle className="w-6 h-6" />;
      case 'high': return <AlertTriangle className="w-6 h-6" />;
      default: return <CheckCircle2 className="w-6 h-6" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
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
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload Plant Photo</h3>
              <p className="text-gray-600 mb-8">
                Take a clear photo of your plant's leaves to get an AI-powered health diagnosis
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
                <p className="font-medium text-blue-900 mb-2">Tips for best results:</p>
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
              <div className="rounded-xl overflow-hidden bg-gray-100">
                <img src={imagePreview} alt="Plant" className="w-full h-64 object-contain" />
              </div>

              {analyzing ? (
                <div className="text-center py-8">
                  <Loader className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Analyzing Your Plant...</h3>
                  <p className="text-gray-600">Our AI is examining the image for health indicators</p>
                </div>
              ) : result ? (
                <div className="space-y-6">
                  <div className={`p-6 rounded-xl ${getSeverityColor(result.severity)}`}>
                    <div className="flex items-start gap-4">
                      {getSeverityIcon(result.severity)}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-1">{result.condition}</h3>
                        <div className="text-sm opacity-80 mb-2">
                          Confidence: {result.confidence}%
                        </div>
                        <p className="leading-relaxed">{result.description}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Recommended Treatment:</h4>
                    <ul className="space-y-3">
                      {result.treatment.map((step, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                            {index + 1}
                          </div>
                          <span className="text-gray-700 leading-relaxed">{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setImagePreview('');
                        setResult(null);
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
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}