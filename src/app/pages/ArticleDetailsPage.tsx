import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, BookOpen } from "lucide-react";

import { getArticleById } from "../../data/articles";
import { DETAILED_ARTICLES, type ArticleBlock } from "../../data/articleDetails";

export default function ArticleDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const summary = getArticleById(id);
  const details = id ? DETAILED_ARTICLES[id] : undefined;

  if (!summary || !details) {
    return (
      <div className="max-w-3xl mx-auto text-center py-24">
        <BookOpen className="mx-auto text-gray-300 w-16 h-16 mb-4" />
        <h1 className="text-2xl font-bold text-gray-700">Article not found</h1>
        <p className="text-gray-500 mt-2">
          This article may have been moved or removed.
        </p>
        <button
          onClick={() => navigate("/articles")}
          className="mt-6 inline-flex items-center gap-2 text-emerald-600 font-semibold"
        >
          <ArrowLeft size={18} />
          Back to Articles
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button
        onClick={() => navigate("/articles")}
        className="flex items-center gap-2 text-emerald-600 font-semibold"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <img
        src={details.image}
        alt={details.title}
        className="w-full h-[350px] object-cover rounded-3xl"
      />

      <div>
        <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold">
          {summary.category}
        </span>
        <h1 className="text-4xl font-bold text-emerald-700 mt-4 leading-tight">
          {details.title}
        </h1>
      </div>

      <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8 space-y-5">
        {details.content.map((block, index) => (
          <ArticleBlockView key={index} block={block} />
        ))}
      </div>
    </div>
  );
}

function ArticleBlockView({ block }: { block: ArticleBlock }) {
  switch (block.type) {
    case "header":
      return (
        <h2 className="text-2xl font-bold text-gray-900 pt-2">{block.text}</h2>
      );
    case "paragraph":
      return <p className="text-gray-700 leading-8">{block.text}</p>;
    case "image":
      return (
        <img
          src={block.url}
          alt=""
          className="w-full max-h-96 object-cover rounded-2xl"
        />
      );
    case "bullet":
      return (
        <div className="flex items-start gap-3 bg-emerald-50 rounded-xl px-4 py-3">
          <span className="text-emerald-600 mt-0.5">🌿</span>
          <p className="text-gray-700 leading-relaxed">{block.text}</p>
        </div>
      );
    default:
      return null;
  }
}
