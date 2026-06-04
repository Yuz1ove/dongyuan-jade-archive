import type { CollectionItem } from "@/data/jade";
import { collections } from "@/data/jade";

export const COLLECTION_STORAGE_KEY = "dongyuan-collection-manager-v1";

export function getManagedCollections(): CollectionItem[] {
  if (typeof window === "undefined") {
    return collections;
  }

  try {
    const raw = window.localStorage.getItem(COLLECTION_STORAGE_KEY);
    if (!raw) return collections;
    const parsed = JSON.parse(raw) as CollectionItem[];
    if (!Array.isArray(parsed)) return collections;
    return parsed;
  } catch {
    return collections;
  }
}

export function saveManagedCollections(items: CollectionItem[]) {
  window.localStorage.setItem(COLLECTION_STORAGE_KEY, JSON.stringify(items));
}

export function resetManagedCollections() {
  window.localStorage.removeItem(COLLECTION_STORAGE_KEY);
}

export function makeCollectionId(title: string) {
  const normalized = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${normalized || "jade"}-${Date.now().toString(36)}`;
}
