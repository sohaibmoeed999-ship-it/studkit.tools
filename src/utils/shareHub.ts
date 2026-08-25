export interface StudKitSharedItem {
  id: string;
  name: string;
  type: 'text' | 'url' | 'image' | 'pdf' | 'audio' | 'video' | 'file';
  mimeType: string;
  size: number;
  data: string; // Base64 data URL or text
  createdAt: number;
}

const STORAGE_PREFIX = 'studkit_share_';

export function saveSharedItem(item: StudKitSharedItem): string {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${item.id}`, JSON.stringify(item));
    return item.id;
  } catch (e) {
    console.error('LocalStorage save error, storage might be full', e);
    // Fallback in-memory or sessionStorage
    sessionStorage.setItem(`${STORAGE_PREFIX}${item.id}`, JSON.stringify(item));
    return item.id;
  }
}

export function getSharedItem(id: string): StudKitSharedItem | null {
  try {
    const local = localStorage.getItem(`${STORAGE_PREFIX}${id}`);
    if (local) return JSON.parse(local);
    const session = sessionStorage.getItem(`${STORAGE_PREFIX}${id}`);
    if (session) return JSON.parse(session);
  } catch (e) {
    console.error('Error retrieving shared item', e);
  }
  return null;
}
