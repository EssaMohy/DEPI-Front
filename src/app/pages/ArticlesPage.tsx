import { useState } from "react";
import { Search, BookOpen, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { ARTICLES } from "../../data/articles";

export default function ArticlesPage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const filtered = ARTICLES.filter((article) =>
    article.title.toLowerCase().includes(search.toLowerCase()),
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

      {/* Cards */}

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border">
          <BookOpen className="mx-auto text-gray-300 w-16 h-16 mb-4" />
          <p className="text-gray-500">No articles match "{search}"</p>
        </div>
      ) : (
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
                <img
                  src={article.image}
                  className="
w-full
h-full
object-cover
group-hover:scale-110
transition
duration-500
"
                />
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
                  {article.category}
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
                  onClick={() => navigate(`/articles/${article.id}`)}
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
    </div>
  );
}
