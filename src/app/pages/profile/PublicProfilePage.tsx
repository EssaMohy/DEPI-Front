import { useEffect, useState, useCallback } from "react";
import {
  UserPlus,
  UserCheck,
  Heart,
  MessageCircle,
  Grid3X3,
  Loader2,
  User as UserIcon,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { useAuth } from "../../../hooks/useAuth";
import {
  communityApi,
  getApiErrorMessage,
  type CommunityPost,
  type PostAuthor,
} from "../../../lib/api";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";

/* ------------------------------------------------------------------ */
/* Local-only follow graph                                             */
/* ------------------------------------------------------------------ */
/**
 * The API doesn't currently expose follow/unfollow endpoints, so the
 * follow graph is kept client-side (in this browser's localStorage)
 * until real `POST /users/:id/follow` / `GET /users/:id` endpoints
 * exist on the backend. Edges are stored as { followerId, followingId }
 * pairs in one shared list so that followers/following counts can be
 * computed for any profile, not just "who am I following".
 */
interface FollowEdge {
  followerId: number;
  followingId: number;
}

const FOLLOW_EDGES_KEY = "plantera_follow_edges";

function getFollowEdges(): FollowEdge[] {
  try {
    const raw = localStorage.getItem(FOLLOW_EDGES_KEY);
    return raw ? (JSON.parse(raw) as FollowEdge[]) : [];
  } catch {
    return [];
  }
}

function saveFollowEdges(edges: FollowEdge[]): void {
  try {
    localStorage.setItem(FOLLOW_EDGES_KEY, JSON.stringify(edges));
  } catch {
    // ignore storage failures
  }
}

function isFollowingLocal(followerId: number, followingId: number): boolean {
  return getFollowEdges().some(
    (e) => e.followerId === followerId && e.followingId === followingId,
  );
}

function toggleFollowLocal(followerId: number, followingId: number): boolean {
  const edges = getFollowEdges();
  const idx = edges.findIndex(
    (e) => e.followerId === followerId && e.followingId === followingId,
  );
  if (idx >= 0) {
    edges.splice(idx, 1);
    saveFollowEdges(edges);
    return false;
  }
  edges.push({ followerId, followingId });
  saveFollowEdges(edges);
  return true;
}

function followersCountLocal(userId: number): number {
  return getFollowEdges().filter((e) => e.followingId === userId).length;
}

function followingCountLocal(userId: number): number {
  return getFollowEdges().filter((e) => e.followerId === userId).length;
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function initials(firstName?: string, lastName?: string): string {
  return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();
}

// How many pages of the community feed we're willing to scan client-side
// to find this author's posts (there's no `GET /posts?authorId=` filter
// on the backend, so we page through the feed and filter here).
const MAX_PAGES_TO_SCAN = 25;

export default function PublicProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const targetId = id ? Number(id) : NaN;
  const isOwnProfile = !!currentUser && currentUser.id === targetId;

  const [author, setAuthor] = useState<PostAuthor | null>(null);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [scannedAllPosts, setScannedAllPosts] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [following, setFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  const refreshFollowStats = useCallback(() => {
    if (currentUser) {
      setFollowing(isFollowingLocal(currentUser.id, targetId));
    }
    setFollowersCount(followersCountLocal(targetId));
    setFollowingCount(followingCountLocal(targetId));
  }, [currentUser, targetId]);

  useEffect(() => {
    refreshFollowStats();
  }, [refreshFollowStats]);

  const loadProfile = useCallback(async () => {
    if (!Number.isFinite(targetId)) {
      setError("Invalid user.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      let cursor: number | undefined = undefined;
      let foundAuthor: PostAuthor | null = null;
      const matched: CommunityPost[] = [];
      let hasMore = true;
      let pages = 0;

      while (hasMore && pages < MAX_PAGES_TO_SCAN) {
        const result = await communityApi.list(cursor, 50);
        for (const post of result.data) {
          if (post.author.id === targetId) {
            matched.push(post);
            if (!foundAuthor) foundAuthor = post.author;
          }
        }
        hasMore = result.meta.hasMore;
        cursor = result.meta.nextCursor;
        pages += 1;
      }

      setPosts(matched);
      setScannedAllPosts(!hasMore);

      if (foundAuthor) {
        setAuthor(foundAuthor);
      } else if (isOwnProfile && currentUser) {
        // Fall back to the signed-in user's own info if they have no
        // posts yet (there's no dedicated "get user by id" endpoint).
        setAuthor({
          id: currentUser.id,
          userName: currentUser.userName,
          firstName: currentUser.firstName,
          lastName: currentUser.lastName,
          avatarUrl: currentUser.avatar,
        });
      } else {
        setAuthor(null);
      }
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not load this profile."));
    } finally {
      setLoading(false);
    }
  }, [targetId, isOwnProfile, currentUser]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  function toggleFollow() {
    if (!currentUser || isOwnProfile) return;
    const nowFollowing = toggleFollowLocal(currentUser.id, targetId);
    setFollowing(nowFollowing);
    setFollowersCount(followersCountLocal(targetId));
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="rounded-2xl bg-red-50 border border-red-200 text-red-600 text-sm px-5 py-4">
          {error}
        </div>
      </div>
    );
  }

  if (!author) {
    return (
      <div className="max-w-5xl mx-auto text-center py-20 text-gray-400">
        <UserIcon className="mx-auto mb-3 w-12 h-12" />
        <p className="text-lg font-medium">Profile not found</p>
        <p className="text-sm">
          This user hasn&apos;t posted anything yet, so there isn&apos;t much
          to show here.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* ========== HEADER CARD ========== */}
      <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
        <div className="p-8">
          <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
            <div className="flex gap-5 items-center">
              <Avatar className="w-32 h-32 border-4 border-white shadow">
                <AvatarImage
                  src={author.avatarUrl ?? undefined}
                  alt={author.userName}
                />
                <AvatarFallback className="bg-emerald-100 text-emerald-700 text-3xl font-semibold">
                  {initials(author.firstName, author.lastName)}
                </AvatarFallback>
              </Avatar>

              <div>
                <h1 className="text-3xl font-bold">
                  {author.firstName} {author.lastName}
                </h1>
                <p className="text-gray-500">@{author.userName}</p>
              </div>
            </div>

            {!isOwnProfile && (
              <button
                onClick={toggleFollow}
                className={`px-5 py-3 rounded-xl flex gap-2 items-center transition font-medium ${
                  following
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                    : "bg-emerald-600 text-white hover:bg-emerald-700"
                }`}
              >
                {following ? <UserCheck size={18} /> : <UserPlus size={18} />}
                {following ? "Following" : "Follow"}
              </button>
            )}

            {isOwnProfile && (
              <button
                onClick={() => navigate("/profile/edit")}
                className="px-5 py-3 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition font-medium"
              >
                Edit Profile
              </button>
            )}
          </div>

          <div className="grid grid-cols-3 text-center border-t mt-6 pt-5 max-w-sm mx-auto sm:mx-0">
            <div>
              <b className="text-lg">
                {posts.length}
                {!scannedAllPosts ? "+" : ""}
              </b>
              <p className="text-sm text-gray-500">Posts</p>
            </div>
            <div>
              <b className="text-lg">{followersCount}</b>
              <p className="text-sm text-gray-500">Followers</p>
            </div>
            <div>
              <b className="text-lg">{followingCount}</b>
              <p className="text-sm text-gray-500">Following</p>
            </div>
          </div>
        </div>
      </div>

      {/* ========== POSTS ========== */}
      <div className="bg-white rounded-3xl border shadow-sm p-6">
        <h2 className="font-bold text-xl flex gap-2 mb-5">
          <Grid3X3 />
          Posts
        </h2>

        {posts.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-10">
            No posts yet.
          </p>
        ) : (
          <div className="grid md:grid-cols-3 gap-5">
            {posts.map((post) => (
              <div key={post.id} className="rounded-2xl overflow-hidden border">
                {post.imageUrl ? (
                  <img
                    src={post.imageUrl}
                    className="h-64 w-full object-cover"
                    alt=""
                  />
                ) : (
                  <div className="h-64 w-full bg-emerald-50 flex items-center justify-center text-emerald-300">
                    <Grid3X3 size={40} />
                  </div>
                )}

                <div className="p-4">
                  {post.title && post.title !== "Untitled" && (
                    <p className="text-sm font-semibold text-gray-900 mb-1 truncate">
                      {post.title}
                    </p>
                  )}
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {post.content}
                  </p>

                  <div className="flex gap-4 mt-3 text-gray-500">
                    <span className="flex gap-1 items-center">
                      <Heart size={16} />
                      {post.likesCount}
                    </span>
                    <span className="flex gap-1 items-center">
                      <MessageCircle size={16} />
                      {post.commentCount}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!scannedAllPosts && posts.length > 0 && (
          <p className="text-xs text-center text-gray-400 mt-5">
            Only the most recent part of the community feed was scanned for
            this user's posts — there may be more.
          </p>
        )}
      </div>
    </div>
  );
}
