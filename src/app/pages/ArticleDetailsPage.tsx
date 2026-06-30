import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function ArticleDetailsPage() {
  const { state } = useLocation();

  const navigate = useNavigate();

  const article = state?.article;

  if (!article)
    return <div className="text-center mt-20">Article not found</div>;

  const details = {
    c1: {
      title: "🌿 The Difference Between Indoor and Outdoor Plants",
      image: article.image,
    },

    c2: {
      title: "🛠️ Gardening Tools Guide",
      image: article.image,
    },
  };

  return (
    <div
      className="
max-w-5xl
mx-auto
space-y-6
"
    >
      <button
        onClick={() => navigate(-1)}
        className="
flex
items-center
gap-2
text-emerald-600
font-semibold
"
      >
        <ArrowLeft />
        Back
      </button>

      <img
        src={article.image}
        className="
w-full
h-[350px]
object-cover
rounded-3xl
"
      />

      <h1
        className="
text-4xl
font-bold
text-emerald-700
"
      >
        {article.title}
      </h1>

      <div className="space-y-5">
        <p
          className="
bg-white
p-5
rounded-2xl
shadow
text-gray-700
leading-8
"
        >
          Plant care articles help you understand watering, lighting, soil and
          growing techniques.
        </p>

        <div
          className="
bg-emerald-50
rounded-3xl
p-6
"
        >
          <h2
            className="
text-2xl
font-bold
mb-4
"
          >
            Key Tips
          </h2>

          <ul
            className="
space-y-3
text-gray-700
"
          >
            <li>🌱 Choose the correct light conditions</li>

            <li>💧 Avoid overwatering</li>

            <li>🌿 Use suitable soil</li>

            <li>☀️ Monitor plant health regularly</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
