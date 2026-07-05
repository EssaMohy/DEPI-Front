/**
 * -----------------------------------------------------------------------
 * Local-only follow graph
 * -----------------------------------------------------------------------
 * The API doesn't currently expose follow/unfollow endpoints, so the
 * follow graph is kept client-side (in this browser's localStorage)
 * until real `POST /users/:id/follow` / `GET /users/:id` endpoints
 * exist on the backend. Edges are stored as { followerId, followingId }
 * pairs in one shared list so that followers/following counts can be
 * computed for any profile, not just "who am I following".
 *
 * Shared by PublicProfilePage (follow/unfollow button + counts) and
 * CommunityPage (the "Following" feed tab) so both read/write the same
 * data instead of keeping their own copies.
 */
export interface FollowEdge {
  followerId: number;
  followingId: number;
}

const FOLLOW_EDGES_KEY = "plantera_follow_edges";

export function getFollowEdges(): FollowEdge[] {
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

export function isFollowingLocal(
  followerId: number,
  followingId: number,
): boolean {
  return getFollowEdges().some(
    (e) => e.followerId === followerId && e.followingId === followingId,
  );
}

export function toggleFollowLocal(
  followerId: number,
  followingId: number,
): boolean {
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

export function followersCountLocal(userId: number): number {
  return getFollowEdges().filter((e) => e.followingId === userId).length;
}

export function followingCountLocal(userId: number): number {
  return getFollowEdges().filter((e) => e.followerId === userId).length;
}

/** All author ids `followerId` currently follows, as a Set for fast lookup. */
export function getFollowingIds(followerId: number): Set<number> {
  return new Set(
    getFollowEdges()
      .filter((e) => e.followerId === followerId)
      .map((e) => e.followingId),
  );
}
