import AsyncStorage from "@react-native-async-storage/async-storage";

const memoryCache = new Map<string, unknown>();
const CACHE_PREFIX = "khadamati.public-cache.";

export async function readPublicCache<T>(key: string): Promise<T | null> {
  if (memoryCache.has(key)) return memoryCache.get(key) as T;
  try {
    const raw = await AsyncStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as T;
    memoryCache.set(key, parsed);
    return parsed;
  } catch {
    return null;
  }
}

export async function writePublicCache<T>(key: string, value: T): Promise<void> {
  memoryCache.set(key, value);
  try {
    await AsyncStorage.setItem(CACHE_PREFIX + key, JSON.stringify(value));
  } catch {
    // The live API remains the source of truth if persistent storage is unavailable.
  }
}
