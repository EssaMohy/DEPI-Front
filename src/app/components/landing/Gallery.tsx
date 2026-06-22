import { ImageWithFallback } from "../figma/ImageWithFallback";

const images = [
  {
    src: "https://images.unsplash.com/photo-1735973634121-d93cf7c94b44?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxpbmRvb3IlMjBwbGFudHMlMjBob21lJTIwY2FyZXxlbnwxfHx8fDE3Nzc3NDI4NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    alt: "Potted plants on wooden table",
  },
  {
    src: "https://images.unsplash.com/photo-1769653907239-c8f1a1843b08?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxpbmRvb3IlMjBwbGFudHMlMjBob21lJTIwY2FyZXxlbnwxfHx8fDE3Nzc3NDI4NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    alt: "Small plant in orange pot",
  },
  {
    src: "https://images.unsplash.com/photo-1777383504353-77974872c2ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw2fHxpbmRvb3IlMjBwbGFudHMlMjBob21lJTIwY2FyZXxlbnwxfHx8fDE3Nzc3NDI4NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    alt: "Various potted plants",
  },
  {
    src: "https://images.unsplash.com/photo-1775598369836-74f2e6c51095?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw4fHxpbmRvb3IlMjBwbGFudHMlMjBob21lJTIwY2FyZXxlbnwxfHx8fDE3Nzc3NDI4NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    alt: "Green plant leaves",
  },
];

export function Gallery() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Join Thousands of Happy Plant Parents
          </h2>
          <p className="text-xl text-gray-600">
            Beautiful plants, thriving homes
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((image) => (
            <ImageWithFallback
              key={image.src}
              src={image.src}
              alt={image.alt}
              className="rounded-2xl w-full h-64 object-cover hover:scale-105 transition-transform"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
