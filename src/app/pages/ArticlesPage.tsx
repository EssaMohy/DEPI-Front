import { useState, useEffect } from "react";
import { Search, BookOpen, ArrowRight, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { articlesApi, getApiErrorMessage } from "../../lib/api";

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

export default function ArticlesPage() {
  const navigate = useNavigate();

  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    articlesApi
      .list({ limit: 50 })
      .then((result) => {
        setArticles(result.data);
        setError(null);
      })
      .catch((err) => {
        setError(getApiErrorMessage(err, "Could not load articles."));
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const filtered = articles.filter((article) =>
    article.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}

      <div
        className="
bg-gradient-to-r
from-emerald-600
to-green-500
rounded-3xl
p-8
text-white
"
      >
        <div className="flex items-center gap-3">
          <BookOpen size={35} />

          <h1
            className="
text-4xl
font-bold
"
          >
            Articles
          </h1>
        </div>

        <p className="mt-3 opacity-90">
          Learn plant care tips and gardening knowledge
        </p>
      </div>

      {/* Search */}

      <div className="relative">
        <Search
          className="
absolute
left-4
top-1/2
-translate-y-1/2
text-gray-400
"
        />

        <input
          placeholder="Search articles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
w-full
pl-12
py-4
rounded-2xl
border
bg-white
shadow-sm
outline-none
focus:ring-2
focus:ring-emerald-500
"
        />
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader className="w-8 h-8 text-emerald-600 animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-white rounded-3xl shadow p-6 border text-center">
          <p className="text-red-600">{error}</p>
        </div>
      ) : (
        /* Cards */
        <div
          className="
grid
md:grid-cols-3
gap-6
"
        >
          {filtered.map((article) => (
            <div
              key={article.id}
              className="
bg-white
rounded-3xl
overflow-hidden
border
shadow-sm
hover:shadow-xl
transition
group
"
            >
              <div
                className="
h-52
overflow-hidden
"
              >
                {article.imageUrl ? (
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="
w-full
h-full
object-cover
group-hover:scale-110
transition
duration-500
"
                  />
                ) : (
                  <div className="w-full h-full bg-emerald-100 flex items-center justify-center">
                    <BookOpen size={48} className="text-emerald-400" />
                  </div>
                )}
              </div>

              <div className="p-5">
                <span
                  className="
bg-emerald-100
text-emerald-700
px-3
py-1
rounded-full
text-xs
font-semibold
"
                >
                  {article.category || "General"}
                </span>

                <h2
                  className="
text-xl
font-bold
mt-4
"
                >
                  {article.title}
                </h2>

                <button
                  onClick={() =>
                    navigate("/articles/details", {
                      state: { article },
                    })
                  }
                  className="
mt-5
flex
items-center
gap-2
text-emerald-600
font-semibold
"
                >
                  Read Article
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && filtered.length === 0 && !error && (
        <div className="text-center py-12">
          <p className="text-gray-500">No articles found.</p>
        </div>
      )}
    </div>
  );
}