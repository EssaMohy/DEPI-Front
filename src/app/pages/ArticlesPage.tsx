import { useState } from "react";
import { Search, BookOpen, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ArticlesPage() {
  const navigate = useNavigate();

  const articles = [
    {
      id: "c1",
      title: "Indoor vs Outdoor plants",
      category: "Home & Garden",
      image: "https://i.postimg.cc/Xv3rvzxT/5600.webp",
    },

    {
      id: "c2",
      title: "Gardening tools & from where?",
      category: "Tools",
      image: "https://i.postimg.cc/rp463xwC/pexels-gary-barnes-6231714.jpg",
    },

    {
      id: "c3",
      title: "How to Take Care of Your Plants?",
      category: "Plant Care",
      image:
        "https://images.pexels.com/photos/4505161/pexels-photo-4505161.jpeg",
    },

    {
      id: "c4",
      title: "Clean Air, Happy Life",
      category: "Plants",
      image: "https://i.postimg.cc/8zBSTy1x/pexels-photo-807598.jpg",
    },

    {
      id: "c5",
      title: "Common Plant Diseases",
      category: "Diseases",
      image:
        "https://cdn.pixabay.com/photo/2012/10/06/02/20/birnbaum-leaves-59904_1280.jpg",
    },

    {
      id: "c6",
      title: "Perfect Soil Guide",
      category: "Healthy Soil",
      image:
        "https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg",
    },
  ];

  const [search, setSearch] = useState("");

  const filtered = articles.filter((article) =>
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
    </div>
  );
}
