import { LRUCache } from 'lru-cache';

interface CachedKey {
  userId?: string;
  expiresAt: number;
}

const VERSION = 'v1';
const REDIS_HARD_TTL = 10* 60;
const LRU_SOFT_TTL_MS = 5 * 60 * 1000;
const localCache = new LRUCache<string, CachedKey>({ max: 100_000 });


