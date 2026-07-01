import { useState } from "react";
import {
  Heart,
  MessageCircle,
  Send,
  ImagePlus,
  UserPlus,
  UserCheck,
  Leaf,
  X,
  Reply,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CommunityPage() {
  const navigate = useNavigate();

  const [text, setText] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Sara",
      role: "Plant Expert",
      followed: false,
    },

    {
      id: 2,
      name: "Ahmed",
      role: "Plant Lover",
      followed: false,
    },

    {
      id: 3,
      name: "Mona",
      role: "Gardener",
      followed: false,
    },
  ]);

  const [posts, setPosts] = useState<any[]>([
    {
      id: 1,

      user: "Sara",

      avatar: "🌱",

      time: "2 hours ago",

      text: "My monstera is growing beautifully 🌿✨",

      image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6",

      likes: 24,

      liked: false,

      comments: [
        {
          id: 1,

          user: "Ahmed",

          text: "Looks amazing 🔥",

          replies: [
            {
              user: "Sara",

              text: "Thank you 🌱",
            },
          ],
        },
      ],
    },
  ]);

  function uploadImage(e: any) {
    const file = e.target.files[0];

    if (file) {
      setImage(URL.createObjectURL(file));
    }
  }

  function addPost() {
    if (!text && !image) return;

    const newPost = {
      id: Date.now(),

      user: "Essam",

      avatar: "👤",

      time: "now",

      text,

      image,

      likes: 0,

      liked: false,

      comments: [],
    };

    setPosts([newPost, ...posts]);

    setText("");

    setImage(null);
  }

  function likePost(id: number) {
    setPosts(
      posts.map((post) => {
        if (post.id === id) {
          return {
            ...post,

            liked: !post.liked,

            likes: post.liked ? post.likes - 1 : post.likes + 1,
          };
        }

        return post;
      }),
    );
  }

  function addComment(postId: number) {
    const comment = prompt("Write your comment");

    if (!comment) return;

    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,

            comments: [
              ...post.comments,

              {
                id: Date.now(),

                user: "Essam",

                text: comment,

                replies: [],
              },
            ],
          };
        }

        return post;
      }),
    );
  }

  function addReply(postId: number, commentId: number) {
    const reply = prompt("Write reply");

    if (!reply) return;

    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,

            comments: post.comments.map((comment: any) => {
              if (comment.id === commentId) {
                return {
                  ...comment,

                  replies: [
                    ...comment.replies,

                    {
                      user: "Essam",

                      text: reply,
                    },
                  ],
                };
              }

              return comment;
            }),
          };
        }

        return post;
      }),
    );
  }

  function followUser(id: number) {
    setUsers(
      users.map((user) => {
        if (user.id === id) {
          return {
            ...user,

            followed: !user.followed,
          };
        }

        return user;
      }),
    );
  }

  return (
    <div
      className="
max-w-6xl
mx-auto
grid
lg:grid-cols-3
gap-6
"
    >
      {/* POSTS AREA */}

      <div
        className="
lg:col-span-2
space-y-6
"
      >
        {/* CREATE POST */}

        <div
          className="
bg-white
rounded-3xl
shadow
p-6
border
"
        >
          <h2
            className="
text-xl
font-bold
mb-4
"
          >
            Create Post
          </h2>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="
Share your plant experience...
"
            className="
w-full
h-28
rounded-2xl
bg-gray-100
p-4
outline-none
resize-none
"
          />

          {image && (
            <div
              className="
relative
mt-4
"
            >
              <img
                src={image}
                className="
rounded-2xl
w-full
max-h-80
object-cover
"
              />

              <button
                onClick={() => setImage(null)}
                className="
absolute
top-3
right-3
bg-black/50
text-white
rounded-full
p-2
"
              >
                <X size={18} />
              </button>
            </div>
          )}

          <div
            className="
flex
justify-between
mt-5
"
          >
            <label
              className="
flex
items-center
gap-2
text-emerald-600
cursor-pointer
"
            >
              <ImagePlus />
              Add Photo
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={uploadImage}
              />
            </label>

            <button
              onClick={addPost}
              className="
bg-emerald-600
text-white
px-6
py-3
rounded-xl
flex
gap-2
items-center
"
            >
              <Send size={18} />
              Post
            </button>
          </div>
        </div>

        {/* POSTS */}

        {posts.map((post) => (
          <div
            key={post.id}
            className="
bg-white
rounded-3xl
shadow
border
overflow-hidden
"
          >
            <div className="p-6">
              <div className="flex gap-3 items-center">
                <div
                  className="
w-12
h-12
rounded-full
bg-emerald-100
flex
items-center
justify-center
text-2xl
"
                >
                  {post.avatar}
                </div>

                <div>
                  <h3 className="font-bold">{post.user}</h3>

                  <p
                    className="
text-sm
text-gray-400
"
                  >
                    {post.time}
                  </p>
                </div>
              </div>

              <p
                className="
mt-5
text-gray-700
"
              >
                {post.text}
              </p>

              {post.image && (
                <img
                  src={post.image}
                  className="
mt-5
rounded-2xl
w-full
max-h-[500px]
object-cover
"
                />
              )}

              <div
                className="
flex
gap-6
border-t
mt-5
pt-4
"
              >
                <button
                  onClick={() => likePost(post.id)}
                  className="
flex
gap-2
items-center
"
                >
                  <Heart
                    className={post.liked ? "fill-red-500 text-red-500" : ""}
                  />

                  {post.likes}
                </button>

                <button
                  onClick={() => addComment(post.id)}
                  className="
flex
gap-2
items-center
"
                >
                  <MessageCircle />

                  {post.comments.length}
                </button>
              </div>
            </div>

            {/* COMMENTS */}

            <div
              className="
bg-gray-50
p-5
space-y-3
"
            >
              {post.comments.map((comment: any) => (
                <div
                  key={comment.id}
                  className="
bg-white
rounded-2xl
p-4
"
                >
                  <b>{comment.user}</b>

                  <p>{comment.text}</p>

                  <button
                    onClick={() => addReply(post.id, comment.id)}
                    className="
text-sm
text-emerald-600
flex
gap-1
mt-2
"
                  >
                    <Reply size={15} />
                    Reply
                  </button>

                  {comment.replies.map((r: any, i: number) => (
                    <div
                      key={i}
                      className="
ml-6
mt-3
bg-gray-100
rounded-xl
p-3
text-sm
"
                    >
                      <b>{r.user}</b>:{r.text}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* USERS */}

      <div
        className="
bg-white
rounded-3xl
shadow
border
p-6
h-fit
"
      >
        <h2
          className="
text-xl
font-bold
flex
gap-2
mb-5
"
        >
          <Leaf />
          Community
        </h2>

        {users.map((user) => (
          <div
            key={user.id}
            className="
flex
justify-between
items-center
border-b
py-4
"
          >
            <div
              onClick={() => navigate(`/profile/${user.id}`)}
              className="
cursor-pointer
"
            >
              <h3 className="font-bold">{user.name}</h3>

              <p
                className="
text-sm
text-gray-500
"
              >
                {user.role}
              </p>
            </div>

            <button
              onClick={() => followUser(user.id)}
              className="
bg-emerald-100
text-emerald-700
p-3
rounded-xl
"
            >
              {user.followed ? <UserCheck /> : <UserPlus />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
