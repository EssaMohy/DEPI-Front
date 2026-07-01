import { useState } from "react";
import {
  UserPlus,
  UserCheck,
  Heart,
  MessageCircle,
  Grid3X3,
} from "lucide-react";
import { useParams } from "react-router-dom";

export default function PublicProfilePage() {
  const { id } = useParams();

  const [following, setFollowing] = useState(false);

  /*
 later replace with API:

 GET /users/${id}

*/

  const user = {
    name: "Sara",

    username: "@sara_plants",

    avatar: "🌱",

    bio: "Plant lover 🌿 | Indoor jungle creator",

    followers: 245,

    following: 80,
  };

  const posts = [
    {
      id: 1,

      image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6",

      text: "My monstera is growing beautifully 🌿",

      likes: 30,

      comments: 5,
    },

    {
      id: 2,

      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b",

      text: "New plants added",

      likes: 40,

      comments: 7,
    },
  ];

  return (
    <div
      className="
max-w-5xl
mx-auto
space-y-6
"
    >
      <div
        className="
bg-white
rounded-3xl
border
shadow
overflow-hidden
"
      >
        <div
          className="
h-36
bg-gradient-to-r
from-green-400
to-emerald-700
"
        ></div>

        <div
          className="
p-8
"
        >
          <div
            className="
flex
justify-between
items-end
"
          >
            <div
              className="
flex
gap-5
items-center
-mt-20
"
            >
              <div
                className="
w-32
h-32
rounded-full
bg-emerald-100
border-8
border-white
flex
items-center
justify-center
text-6xl
shadow
"
              >
                {user.avatar}
              </div>

              <div>
                <h1
                  className="
text-3xl
font-bold
"
                >
                  {user.name}
                </h1>

                <p
                  className="
text-gray-500
"
                >
                  {user.username}
                </p>
              </div>
            </div>

            <button
              onClick={() => setFollowing(!following)}
              className="
bg-emerald-600
text-white
px-5
py-3
rounded-xl
flex
gap-2
items-center
"
            >
              {following ? <UserCheck /> : <UserPlus />}

              {following ? "Following" : "Follow"}
            </button>
          </div>

          <p
            className="
mt-6
text-gray-600
"
          >
            {user.bio}
          </p>

          <div
            className="
grid
grid-cols-3
text-center
border-t
mt-6
pt-5
"
          >
            <div>
              <b>{posts.length}</b>

              <p>Posts</p>
            </div>

            <div>
              <b>{user.followers}</b>

              <p>Followers</p>
            </div>

            <div>
              <b>{user.following}</b>

              <p>Following</p>
            </div>
          </div>
        </div>
      </div>

      <div
        className="
bg-white
rounded-3xl
border
shadow
p-6
"
      >
        <h2
          className="
font-bold
text-xl
flex
gap-2
mb-5
"
        >
          <Grid3X3 />
          Posts
        </h2>

        <div
          className="
grid
md:grid-cols-3
gap-5
"
        >
          {posts.map((post) => (
            <div
              key={post.id}
              className="
rounded-2xl
overflow-hidden
border
"
            >
              <img
                src={post.image}
                className="
h-64
w-full
object-cover
"
              />

              <div
                className="
p-4
"
              >
                <p
                  className="
text-sm
text-gray-600
"
                >
                  {post.text}
                </p>

                <div
                  className="
flex
gap-4
mt-3
text-gray-500
"
                >
                  <span
                    className="
flex
gap-1
items-center
"
                  >
                    <Heart size={16} />

                    {post.likes}
                  </span>

                  <span
                    className="
flex
gap-1
items-center
"
                  >
                    <MessageCircle size={16} />

                    {post.comments}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
