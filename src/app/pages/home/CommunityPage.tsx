import { useState, useEffect, useCallback } from "react";
import {
  Heart,
  MessageCircle,
  Send,
  ImagePlus,
  Leaf,
  X,
  Loader,
  MoreHorizontal,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { communityApi, getApiErrorMessage } from "../../../lib/api";
import { useAuth } from "../../../hooks/useAuth";

function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 172800) return "yesterday";
  return `${Math.floor(seconds / 86400)}d ago`;
}

interface Comment {
  id: number;
  content: string;
  author: {
    id: number;
    userName: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  };
  createdAt: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  category: string | null;
  tags: string | null;
  imageUrl: string | null;
  published: boolean;
  author: {
    id: number;
    userName: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  };
  commentCount: number;
  likesCount: number;
  liked: boolean;
  createdAt: string;
  comments?: Comment[];
}

export default function CommunityPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [postingError, setPostingError] = useState<string | null>(null);

  const [expandedComments, setExpandedComments] = useState<Set<number>>(new Set());
  const [commentsLoading, setCommentsLoading] = useState<Set<number>>(new Set());
  const [postComments, setPostComments] = useState<Record<number, Comment[]>>({});
  const [newComment, setNewComment] = useState<Record<number, string>>({});

  const fetchPosts = useCallback(async () => {
    try {
      const result = await communityApi.list({ limit: 20 });
      setPosts(result.data);
      setError(null);
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not load posts."));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCreatePost = async () => {
    if (!title.trim() && !content.trim() && !imageFile) return;

    setIsPosting(true);
    setPostingError(null);

    try {
      const newPost = await communityApi.create(
        { title: title.trim() || "Untitled", content: content.trim() },
        imageFile || undefined
      );

      setPosts((prev) => [newPost, ...prev]);
      setTitle("");
      setContent("");
      setImageFile(null);
      setImagePreview(null);
    } catch (err) {
      setPostingError(getApiErrorMessage(err, "Could not create post."));
    } finally {
      setIsPosting(false);
    }
  };

  const handleLike = async (postId: number) => {
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    const wasLiked = post.liked;
    try {
      const result = await communityApi.like(postId);

      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
                ...p,
                liked: result.liked,
                likesCount: result.likesCount,
              }
            : p
        )
      );
    } catch {
      // Revert on error - though this is a fire-and-forget UX update
    }
  };

  const toggleComments = async (postId: number) => {
    if (expandedComments.has(postId)) {
      setExpandedComments((prev) => {
        const next = new Set(prev);
        next.delete(postId);
        return next;
      });
      return;
    }

    setExpandedComments((prev) => new Set(prev).add(postId));

    if (!postComments[postId]) {
      setCommentsLoading((prev) => new Set(prev).add(postId));
      try {
        const result = await communityApi.getComments(postId);
        setPostComments((prev) => ({ ...prev, [postId]: result.data }));
      } catch {
        // Silently fail
      } finally {
        setCommentsLoading((prev) => {
          const next = new Set(prev);
          next.delete(postId);
          return next;
        });
      }
    }
  };

  const handleAddComment = async (postId: number) => {
    const commentText = newComment[postId]?.trim();
    if (!commentText) return;

    try {
      await communityApi.addComment(postId, commentText);
      setNewComment((prev) => ({ ...prev, [postId]: "" }));

      const result = await communityApi.getComments(postId);
      setPostComments((prev) => ({ ...prev, [postId]: result.data }));

      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, commentCount: p.commentCount + 1 } : p
        )
      );
    } catch {
      // Silently fail
    }
  };

  return (
    <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {/* CREATE POST */}
        {isAuthenticated ? (
          <div className="bg-white rounded-3xl shadow p-6 border">
            <h2 className="text-xl font-bold mb-4">Create Post</h2>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title (optional)"
              className="w-full mb-3 px-4 py-2 rounded-xl bg-gray-100 outline-none"
            />

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your plant experience..."
              className="w-full h-28 rounded-2xl bg-gray-100 p-4 outline-none resize-none"
            />

            {imagePreview && (
              <div className="relative mt-4">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="rounded-2xl w-full max-h-80 object-cover"
                />
                <button
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(null);
                  }}
                  className="absolute top-3 right-3 bg-black/50 text-white rounded-full p-2"
                >
                  <X size={18} />
                </button>
              </div>
            )}

            {postingError && (
              <div className="mt-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3">
                {postingError}
              </div>
            )}

            <div className="flex justify-between mt-5">
              <label className="flex items-center gap-2 text-emerald-600 cursor-pointer">
                <ImagePlus />
                Add Photo
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageSelect}
                />
              </label>

              <button
                onClick={handleCreatePost}
                disabled={isPosting || (!title.trim() && !content.trim() && !imageFile)}
                className="bg-emerald-600 text-white px-6 py-3 rounded-xl flex gap-2 items-center disabled:opacity-60"
              >
                {isPosting ? (
                  <Loader size={18} className="animate-spin" />
                ) : (
                  <Send size={18} />
                )}
                Post
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow p-6 border text-center">
            <p className="text-gray-600 mb-4">
              Sign in to create posts and engage with the community
            </p>
            <button
              onClick={() => navigate("/auth/login")}
              className="bg-emerald-600 text-white px-6 py-3 rounded-xl"
            >
              Sign In
            </button>
          </div>
        )}

        {/* POSTS */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader className="w-8 h-8 text-emerald-600 animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-white rounded-3xl shadow p-6 border text-center">
            <p className="text-red-600">{error}</p>
            <button onClick={fetchPosts} className="mt-4 text-emerald-600 underline">
              Try again
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-3xl shadow p-6 border text-center">
            <p className="text-gray-500">No posts yet. Be the first to share!</p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="bg-white rounded-3xl shadow border overflow-hidden">
              <div className="p-6">
                <div className="flex gap-3 items-start">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-xl overflow-hidden">
                    {post.author?.avatarUrl ? (
                      <img
                        src={post.author.avatarUrl}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      post.author?.firstName?.[0]?.toUpperCase() || "?"
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold">
                          {post.author?.firstName} {post.author?.lastName}
                        </h3>
                        <p className="text-sm text-gray-400">
                          @{post.author?.userName} · {timeAgo(post.createdAt)}
                        </p>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal size={18} />
                      </button>
                    </div>
                  </div>
                </div>

                {post.title && (
                  <h4 className="font-bold text-lg mt-4">{post.title}</h4>
                )}

                <p className="mt-2 text-gray-700 whitespace-pre-wrap">{post.content}</p>

                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
                    alt="Post image"
                    className="mt-4 rounded-2xl w-full max-h-[500px] object-cover"
                  />
                )}

                <div className="flex gap-6 border-t mt-5 pt-4">
                  <button
                    onClick={() => handleLike(post.id)}
                    className="flex gap-2 items-center text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <Heart className={post.liked ? "fill-red-500 text-red-500" : ""} />
                    {post.likesCount}
                  </button>

                  <button
                    onClick={() => toggleComments(post.id)}
                    className="flex gap-2 items-center text-gray-500 hover:text-emerald-600 transition-colors"
                  >
                    <MessageCircle />
                    {post.commentCount}
                  </button>
                </div>

                {/* COMMENTS SECTION */}
                {expandedComments.has(post.id) && (
                  <div className="mt-4 pt-4 border-t">
                    {/* Add comment input */}
                    {isAuthenticated && (
                      <div className="flex gap-2 mb-4">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-sm overflow-hidden flex-shrink-0">
                          {user?.avatar ? (
                            <img src={user.avatar} alt="You" className="w-full h-full object-cover" />
                          ) : (
                            user?.firstName?.[0]?.toUpperCase() || "?"
                          )}
                        </div>
                        <div className="flex-1 flex gap-2">
                          <input
                            type="text"
                            value={newComment[post.id] || ""}
                            onChange={(e) =>
                              setNewComment((prev) => ({
                                ...prev,
                                [post.id]: e.target.value,
                              }))
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleAddComment(post.id);
                            }}
                            placeholder="Write a comment..."
                            className="flex-1 px-3 py-2 rounded-xl bg-gray-100 outline-none text-sm"
                          />
                          <button
                            onClick={() => handleAddComment(post.id)}
                            className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm"
                          >
                            <Send size={14} />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Comments list */}
                    {commentsLoading.has(post.id) ? (
                      <div className="flex justify-center py-4">
                        <Loader size={20} className="text-emerald-600 animate-spin" />
                      </div>
                    ) : postComments[post.id]?.length > 0 ? (
                      <div className="space-y-3">
                        {postComments[post.id].map((comment) => (
                          <div key={comment.id} className="flex gap-2">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-sm overflow-hidden flex-shrink-0">
                              {comment.author?.avatarUrl ? (
                                <img
                                  src={comment.author.avatarUrl}
                                  alt="Avatar"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                comment.author?.firstName?.[0]?.toUpperCase() || "?"
                              )}
                            </div>
                            <div className="flex-1 bg-gray-50 rounded-xl p-3">
                              <div className="flex justify-between items-center">
                                <span className="font-semibold text-sm">
                                  {comment.author?.firstName} {comment.author?.lastName}
                                </span>
                                <span className="text-xs text-gray-400">
                                  {timeAgo(comment.createdAt)}
                                </span>
                              </div>
                              <p className="text-sm mt-1">{comment.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 text-center py-2">
                        No comments yet. Be the first to comment!
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* SIDEBAR */}
      <div className="bg-white rounded-3xl shadow border p-6 h-fit">
        <h2 className="text-xl font-bold flex gap-2 mb-5">
          <Leaf />
          Community
        </h2>
        <p className="text-gray-500 text-sm">
          Connect with other plant enthusiasts and share your plant journey!
        </p>
      </div>
    </div>
  );
}