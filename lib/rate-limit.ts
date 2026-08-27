import "server-only";

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

type RateLimitResult = {
  allowed: boolean;
  retryAfterSeconds: number;
};

type RateLimitStore = Map<string, RateLimitEntry>;

const globalForRateLimit = globalThis as unknown as {
  rateLimitStore?: RateLimitStore;
};

const store = globalForRateLimit.rateLimitStore ?? new Map<string, RateLimitEntry>();
let operationsSinceCleanup = 0;

if (process.env.NODE_ENV !== "production") {
  globalForRateLimit.rateLimitStore = store;
}

export function consumeRateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  operationsSinceCleanup += 1;
  if (operationsSinceCleanup >= 100) {
    clearExpiredRateLimits();
    operationsSinceCleanup = 0;
  }

  const now = Date.now();
  const current = store.get(key);

  if (!current || current.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: Math.ceil(windowMs / 1000) };
  }

  current.count += 1;
  const retryAfterSeconds = Math.max(1, Math.ceil((current.resetAt - now) / 1000));

  return {
    allowed: current.count <= limit,
    retryAfterSeconds,
  };
}

export function clearExpiredRateLimits() {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (entry.resetAt <= now) store.delete(key);
  }
}
