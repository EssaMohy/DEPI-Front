import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Heart,
  MessageCircle,
  Send,
  ImagePlus,
  Leaf,
  X,
  Loader2,
  ChevronDown,
  Trash2,
  Pencil,
  Check,
  Grid3X3,
  UserCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../../hooks/useAuth";
import {
  communityApi,
  getApiErrorMessage,
  type CommunityPost,
  type PostComment,
  type CursorMeta,
} from "../../../lib/api";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

function initials(firstName?: string, lastName?: string): string {
  return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function CommunityPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  /* ---- feed state ---- */
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [meta, setMeta] = useState<CursorMeta>({
    nextCursor: undefined,
    hasMore: true,
  });
  const [feedLoading, setFeedLoading] = useState(true);
  const [feedError, setFeedError] = useState<string | null>(null);
  const loadingMore = useRef(false);

  /* ---- create-post state ---- */
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [posting, setPosting] = useState(false);

  /* ---- comments state (per post) ---- */
  const [openComments, setOpenComments] = useState<Record<number, boolean>>({});
  const [commentsMap, setCommentsMap] = useState<Record<number, PostComment[]>>(
    {},
  );
  const [commentsMetaMap, setCommentsMetaMap] = useState<
    Record<number, CursorMeta>
  >({});
  const [commentsLoading, setCommentsLoading] = useState<
    Record<number, boolean>
  >({});
  const [newComment, setNewComment] = useState<Record<number, string>>({});

  /* ---- likes local state ---- */
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [likeCounts, setLikeCounts] = useState<Record<number, number>>({});

  /* ---- tabs: "all" feed vs. "mine" ---- */
  const [activeTab, setActiveTab] = useState<"all" | "mine">("all");

  /* ---- edit-post state ---- */
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  /* ---------------------------------------------------------------- */
  /* Load posts (initial + load-more)                                  */
  /* ---------------------------------------------------------------- */

  const fetchPosts = useCallback(async (cursor?: number) => {
    if (loadingMore.current) return;
    loadingMore.current = true;
    try {
      const result = await communityApi.list(cursor);
      setPosts((prev) => (cursor ? [...prev, ...result.data] : result.data));
      setMeta(result.meta);

      // Seed like counts from API
      const counts: Record<number, number> = {};
      for (const p of result.data) counts[p.id] = p.likesCount;
      setLikeCounts((prev) => ({ ...prev, ...counts }));
    } catch (err) {
      setFeedError(getApiErrorMessage(err, "Could not load posts."));
    } finally {
      setFeedLoading(false);
      loadingMore.current = false;
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  /* ---------------------------------------------------------------- */
  /* Create post                                                       */
  /* ---------------------------------------------------------------- */

  async function handleCreatePost() {
    if (!text.trim() && !title.trim()) return;
    setPosting(true);
    try {
      const created = await communityApi.create({
        title: title.trim() || "Untitled",
        content: text.trim(),
        published: true,
      });

      let final = created;
      if (imageFile) {
        try {
          final = await communityApi.uploadImage(created.id, imageFile);
        } catch {
          // Post was created but image failed – still show the post.
        }
      }

      setPosts((prev) => [final, ...prev]);
      setLikeCounts((prev) => ({ ...prev, [final.id]: final.likesCount }));
      setTitle("");
      setText("");
      setImageFile(null);
      setImagePreview(null);
    } catch (err) {
      setFeedError(getApiErrorMessage(err, "Could not create post."));
    } finally {
      setPosting(false);
    }
  }

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }

  function clearImage() {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview(null);
  }

  /* ---------------------------------------------------------------- */
  /* Like / unlike                                                     */
  /* ---------------------------------------------------------------- */

  async function handleToggleLike(postId: number) {
    // Optimistic update
    const wasLiked = likedPosts.has(postId);
    setLikedPosts((prev) => {
      const next = new Set(prev);
      wasLiked ? next.delete(postId) : next.add(postId);
      return next;
    });
    setLikeCounts((prev) => ({
      ...prev,
      [postId]: (prev[postId] ?? 0) + (wasLiked ? -1 : 1),
    }));

    try {
      await communityApi.toggleLike(postId);
    } catch {
      // Revert on error
      setLikedPosts((prev) => {
        const next = new Set(prev);
        wasLiked ? next.add(postId) : next.delete(postId);
        return next;
      });
      setLikeCounts((prev) => ({
        ...prev,
        [postId]: (prev[postId] ?? 0) + (wasLiked ? 1 : -1),
      }));
    }
  }

  /* ---------------------------------------------------------------- */
  /* Comments                                                          */
  /* ---------------------------------------------------------------- */

  async function loadComments(postId: number, cursor?: number) {
    setCommentsLoading((prev) => ({ ...prev, [postId]: true }));
    try {
      const result = await communityApi.listComments(postId, cursor);
      setCommentsMap((prev) => ({
        ...prev,
        [postId]: cursor
          ? [...(prev[postId] ?? []), ...result.data]
          : result.data,
      }));
      setCommentsMetaMap((prev) => ({ ...prev, [postId]: result.meta }));
    } catch {
      // Silently fail – comments section simply shows nothing.
    } finally {
      setCommentsLoading((prev) => ({ ...prev, [postId]: false }));
    }
  }

  function toggleComments(postId: number) {
    const isOpen = openComments[postId];
    setOpenComments((prev) => ({ ...prev, [postId]: !isOpen }));
    if (!isOpen && !commentsMap[postId]) {
      loadComments(postId);
    }
  }

  async function handleAddComment(postId: number) {
    const content = newComment[postId]?.trim();
    if (!content) return;
    try {
      const comment = await communityApi.createComment(postId, content);
      setCommentsMap((prev) => ({
        ...prev,
        [postId]: [comment, ...(prev[postId] ?? [])],
      }));
      // Update comment count on the post card
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, commentCount: p.commentCount + 1 } : p,
        ),
      );
      setNewComment((prev) => ({ ...prev, [postId]: "" }));
    } catch {
      // Fail silently
    }
  }

  async function handleDeleteComment(postId: number, commentId: number) {
    try {
      await communityApi.deleteComment(commentId);
      setCommentsMap((prev) => ({
        ...prev,
        [postId]: (prev[postId] ?? []).filter((c) => c.id !== commentId),
      }));
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? { ...p, commentCount: Math.max(0, p.commentCount - 1) }
            : p,
        ),
      );
    } catch {
      // Fail silently
    }
  }

  /* ---------------------------------------------------------------- */
  /* Delete post                                                       */
  /* ---------------------------------------------------------------- */

  async function handleDeletePost(postId: number) {
    try {
      await communityApi.delete(postId);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch {
      // Fail silently
    }
  }

  /* ---------------------------------------------------------------- */
  /* Edit post                                                         */
  /* ---------------------------------------------------------------- */

  function startEditPost(post: CommunityPost) {
    setEditingPostId(post.id);
    setEditTitle(post.title === "Untitled" ? "" : post.title);
    setEditContent(post.content);
    setEditError(null);
  }

  function cancelEditPost() {
    setEditingPostId(null);
    setEditTitle("");
    setEditContent("");
    setEditError(null);
  }

  async function handleSaveEdit(postId: number) {
    if (!editContent.trim() && !editTitle.trim()) return;
    setSavingEdit(true);
    setEditError(null);
    try {
      const updated = await communityApi.update(postId, {
        title: editTitle.trim() || "Untitled",
        content: editContent.trim(),
      });
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, ...updated } : p)),
      );
      cancelEditPost();
    } catch (err) {
      setEditError(getApiErrorMessage(err, "Could not update post."));
    } finally {
      setSavingEdit(false);
    }
  }

  /* ---------------------------------------------------------------- */
  /* Tabs: filter posts for "My Posts"                                 */
  /* ---------------------------------------------------------------- */

  const displayedPosts = useMemo(() => {
    if (activeTab === "mine") {
      return user ? posts.filter((p) => p.author.id === user.id) : [];
    }
    return posts;
  }, [activeTab, posts, user]);

  /* ---------------------------------------------------------------- */
  /* Render                                                            */
  /* ---------------------------------------------------------------- */

  if (feedLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-6 pb-10">
      {/* ========== MAIN COLUMN ========== */}
      <div className="lg:col-span-2 space-y-6">
        {/* ---- Error banner ---- */}
        {feedError && (
          <div className="rounded-2xl bg-red-50 border border-red-200 text-red-600 text-sm px-5 py-4">
            {feedError}
          </div>
        )}

        {/* ---- Create Post ---- */}
        <div className="bg-white rounded-3xl shadow-sm p-6 border">
          <h2 className="text-xl font-bold mb-4">Create Post</h2>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post title…"
            className="w-full rounded-2xl bg-gray-100 p-4 outline-none mb-3 text-sm font-medium"
          />

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share your plant experience…"
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
                onClick={clearImage}
                className="absolute top-3 right-3 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition"
              >
                <X size={18} />
              </button>
            </div>
          )}

          <div className="flex justify-between mt-5">
            <label className="flex items-center gap-2 text-emerald-600 cursor-pointer hover:text-emerald-700 transition">
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
              disabled={posting || (!text.trim() && !title.trim())}
              className="bg-emerald-600 text-white px-6 py-3 rounded-xl flex gap-2 items-center hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {posting ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Send size={18} />
              )}
              Post
            </button>
          </div>
        </div>

        {/* ---- Tabs ---- */}
        <div className="bg-white rounded-2xl shadow-sm border p-1.5 flex gap-1">
          <button
            onClick={() => setActiveTab("all")}
            className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition ${
              activeTab === "all"
                ? "bg-emerald-600 text-white"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            <Grid3X3 size={16} />
            All Posts
          </button>
          <button
            onClick={() => setActiveTab("mine")}
            className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition ${
              activeTab === "mine"
                ? "bg-emerald-600 text-white"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            <UserCircle2 size={16} />
            My Posts
          </button>
        </div>

        {/* ---- Posts Feed ---- */}
        {displayedPosts.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <Leaf className="mx-auto mb-3 w-12 h-12" />
            {activeTab === "mine" ? (
              <>
                <p className="text-lg font-medium">
                  You haven&apos;t posted anything yet
                </p>
                <p className="text-sm">
                  Share something above and it will show up here.
                </p>
              </>
            ) : (
              <>
                <p className="text-lg font-medium">No posts yet</p>
                <p className="text-sm">
                  Be the first to share something with the community!
                </p>
              </>
            )}
          </div>
        )}

        {activeTab === "mine" && displayedPosts.length > 0 && meta.hasMore && (
          <p className="text-xs text-center text-gray-400 -mt-2">
            Only posts loaded so far are shown here — use &quot;Load more
            posts&quot; below to check for older ones.
          </p>
        )}

        {displayedPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-3xl shadow-sm border overflow-hidden"
          >
            <div className="p-6">
              {/* Author row */}
              <div className="flex gap-3 items-center">
                <Avatar
                  className="w-12 h-12 cursor-pointer"
                  onClick={() => navigate(`/profile/${post.author.id}`)}
                >
                  <AvatarImage
                    src={post.author.avatarUrl ?? undefined}
                    alt={post.author.userName}
                  />
                  <AvatarFallback className="bg-emerald-100 text-emerald-700 font-semibold">
                    {initials(post.author.firstName, post.author.lastName)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <h3
                    className="font-bold cursor-pointer hover:underline truncate"
                    onClick={() => navigate(`/profile/${post.author.id}`)}
                  >
                    {post.author.firstName} {post.author.lastName}
                  </h3>
                  <p className="text-sm text-gray-400">
                    @{post.author.userName} · {timeAgo(post.createdAt)}
                  </p>
                </div>

                {/* Edit / Delete buttons (own posts only) */}
                {user && post.author.id === user.id && (
                  <div className="flex items-center gap-1">
                    {editingPostId !== post.id && (
                      <button
                        onClick={() => startEditPost(post)}
                        className="text-gray-400 hover:text-emerald-600 transition p-2"
                        title="Edit post"
                      >
                        <Pencil size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="text-gray-400 hover:text-red-500 transition p-2"
                      title="Delete post"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                )}
              </div>

              {editingPostId === post.id ? (
                /* ---- Edit form (replaces title/content while editing) ---- */
                <div className="mt-4 space-y-3">
                  {editError && (
                    <div className="rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs px-4 py-2">
                      {editError}
                    </div>
                  )}
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Post title…"
                    className="w-full rounded-xl bg-gray-100 p-3 outline-none text-sm font-medium"
                  />
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full h-24 rounded-xl bg-gray-100 p-3 outline-none resize-none text-sm"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={cancelEditPost}
                      disabled={savingEdit}
                      className="px-4 py-2 rounded-xl text-sm text-gray-500 hover:bg-gray-100 transition flex items-center gap-1 disabled:opacity-50"
                    >
                      <X size={16} />
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSaveEdit(post.id)}
                      disabled={
                        savingEdit || (!editTitle.trim() && !editContent.trim())
                      }
                      className="px-4 py-2 rounded-xl text-sm bg-emerald-600 text-white hover:bg-emerald-700 transition flex items-center gap-1 disabled:opacity-50"
                    >
                      {savingEdit ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Check size={16} />
                      )}
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Title */}
                  {post.title && post.title !== "Untitled" && (
                    <h4 className="mt-4 text-lg font-semibold text-gray-900">
                      {post.title}
                    </h4>
                  )}

                  {/* Content */}
                  <p className="mt-3 text-gray-700 whitespace-pre-wrap">
                    {post.content}
                  </p>

                  {/* Image */}
                  {post.imageUrl && (
                    <img
                      src={post.imageUrl}
                      alt=""
                      className="mt-5 rounded-2xl w-full max-h-[500px] object-cover"
                    />
                  )}
                </>
              )}

              {/* Actions */}
              <div className="flex gap-6 border-t mt-5 pt-4">
                <button
                  onClick={() => handleToggleLike(post.id)}
                  className="flex gap-2 items-center hover:text-red-500 transition"
                >
                  <Heart
                    className={
                      likedPosts.has(post.id) ? "fill-red-500 text-red-500" : ""
                    }
                  />
                  {likeCounts[post.id] ?? post.likesCount}
                </button>

                <button
                  onClick={() => toggleComments(post.id)}
                  className="flex gap-2 items-center hover:text-emerald-600 transition"
                >
                  <MessageCircle />
                  {post.commentCount}
                </button>
              </div>
            </div>

            {/* ---- Comments Section ---- */}
            {openComments[post.id] && (
              <div className="bg-gray-50 border-t p-5 space-y-3">
                {/* Add comment input */}
                <div className="flex gap-3">
                  <Avatar className="w-9 h-9 shrink-0">
                    <AvatarImage
                      src={user?.avatar ?? undefined}
                      alt={user?.userName}
                    />
                    <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xs font-semibold">
                      {initials(user?.firstName, user?.lastName)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 flex gap-2">
                    <input
                      value={newComment[post.id] ?? ""}
                      onChange={(e) =>
                        setNewComment((prev) => ({
                          ...prev,
                          [post.id]: e.target.value,
                        }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleAddComment(post.id);
                        }
                      }}
                      placeholder="Write a comment…"
                      className="flex-1 bg-white rounded-xl px-4 py-2 text-sm outline-none border focus:border-emerald-400 transition"
                    />
                    <button
                      onClick={() => handleAddComment(post.id)}
                      disabled={!newComment[post.id]?.trim()}
                      className="text-emerald-600 hover:text-emerald-700 disabled:opacity-30 transition"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>

                {/* Comments list */}
                {commentsLoading[post.id] && !commentsMap[post.id]?.length && (
                  <div className="flex justify-center py-4">
                    <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
                  </div>
                )}

                {(commentsMap[post.id] ?? []).map((comment) => (
                  <div
                    key={comment.id}
                    className="bg-white rounded-2xl p-4 group"
                  >
                    <div className="flex items-start gap-3">
                      <Avatar
                        className="w-8 h-8 cursor-pointer shrink-0"
                        onClick={() =>
                          navigate(`/profile/${comment.author.id}`)
                        }
                      >
                        <AvatarImage
                          src={comment.author.avatarUrl ?? undefined}
                          alt={comment.author.userName}
                        />
                        <AvatarFallback className="bg-emerald-50 text-emerald-600 text-xs font-semibold">
                          {initials(
                            comment.author.firstName,
                            comment.author.lastName,
                          )}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <b
                            className="text-sm cursor-pointer hover:underline"
                            onClick={() =>
                              navigate(`/profile/${comment.author.id}`)
                            }
                          >
                            {comment.author.firstName} {comment.author.lastName}
                          </b>
                          <span className="text-xs text-gray-400">
                            {timeAgo(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mt-1">
                          {comment.content}
                        </p>
                      </div>

                      {/* Delete comment (own comments) */}
                      {user && comment.author.id === user.id && (
                        <button
                          onClick={() =>
                            handleDeleteComment(post.id, comment.id)
                          }
                          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition p-1"
                          title="Delete comment"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {/* Load more comments */}
                {commentsMetaMap[post.id]?.hasMore && (
                  <button
                    onClick={() =>
                      loadComments(
                        post.id,
                        commentsMetaMap[post.id]?.nextCursor,
                      )
                    }
                    disabled={commentsLoading[post.id]}
                    className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1 mx-auto transition"
                  >
                    {commentsLoading[post.id] ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <ChevronDown size={14} />
                    )}
                    Load more comments
                  </button>
                )}
              </div>
            )}
          </div>
        ))}

        {/* ---- Load More Posts ---- */}
        {meta.hasMore && (
          <div className="flex justify-center pt-2 pb-6">
            <button
              onClick={() => fetchPosts(meta.nextCursor)}
              disabled={loadingMore.current}
              className="bg-white border shadow-sm text-emerald-600 hover:bg-emerald-50 px-6 py-3 rounded-xl flex gap-2 items-center transition"
            >
              <ChevronDown size={18} />
              Load more posts
            </button>
          </div>
        )}
      </div>

      {/* ========== SIDEBAR ========== */}
      <div className="space-y-6">
        {/* Community info */}
        <div className="bg-white rounded-3xl shadow-sm border p-6 h-fit">
          <h2 className="text-xl font-bold flex gap-2 mb-4">
            <Leaf className="text-emerald-600" />
            Community
          </h2>

          <p className="text-gray-500 text-sm leading-relaxed">
            Share your plant journey, ask for advice, and connect with fellow
            plant lovers. Post photos, tips, and stories about your green
            companions! 🌿
          </p>

          <div className="mt-5 pt-5 border-t">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <div className="bg-emerald-100 text-emerald-700 p-2 rounded-xl">
                <MessageCircle size={18} />
              </div>
              <span>
                {activeTab === "mine"
                  ? `${displayedPosts.length} of your posts loaded`
                  : `${posts.length} posts loaded`}
              </span>
            </div>
          </div>
        </div>

        {/* Quick tips */}
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-3xl shadow-sm p-6 text-white">
          <h3 className="font-bold text-lg mb-3">🌱 Plant Tip</h3>
          <p className="text-emerald-100 text-sm leading-relaxed">
            Most houseplants prefer indirect sunlight. Place them near a window
            with sheer curtains for the perfect balance of light!
          </p>
        </div>
      </div>
    </div>
  );
}
