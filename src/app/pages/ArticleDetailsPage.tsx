import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface Article {
  id: number;
  title: string;
  content: string;
  excerpt: string | null;
  category: string | null;
  imageUrl: string | null;
  published: boolean;
  author: {
    id: number;
    userName: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  };
  createdAt: string;
}

export default function ArticleDetailsPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const article: Article | null = state?.article;

  if (!article)
    return <div className="text-center mt-20">Article not found</div>;

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

      {article.imageUrl && (
        <img
          src={article.imageUrl}
          alt={article.title}
          className="
w-full
h-[350px]
object-cover
rounded-3xl
"
        />
      )}

      <div className="flex items-center gap-3">
        {article.category && (
          <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-semibold">
            {article.category}
          </span>
        )}
        <span className="text-sm text-gray-500">
          By {article.author.firstName} {article.author.lastName}
        </span>
      </div>

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
          {article.content}
        </p>

        {article.excerpt && (
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
              Summary
            </h2>
            <p className="text-gray-700">{article.excerpt}</p>
          </div>
        )}
      </div>
    </div>
  );
}