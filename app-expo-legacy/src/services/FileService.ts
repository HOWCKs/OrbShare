import { ShareFile, FileCategory } from '../types';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

// For MVP, file picking is mocked. Real implementation will use:
// - expo-document-picker for general files
// - expo-media-library for photos/videos
// - PackageManager query for installed APKs (needs native module)

export async function pickFilesMock(): Promise<ShareFile[]> {
  // This would be real file picking
  return [];
}

export async function getInstalledAppsMock(): Promise<ShareFile[]> {
  // Requires native module to query PackageManager
  // For MVP, return mock list
  return [
    { id: 'apk1', name: 'WhatsApp.apk', uri: 'content://apk/whatsapp', size: 54300000, sizeFormatted: '54.3 MB', category: 'apk', packageName: 'com.whatsapp' },
    { id: 'apk2', name: 'Telegram.apk', uri: 'content://apk/telegram', size: 38000000, sizeFormatted: '38 MB', category: 'apk', packageName: 'org.telegram.messenger' },
  ];
}

export function inferCategoryFromName(name: string): FileCategory {
  const ext = name.split('.').pop()?.toLowerCase() || '';
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return 'photo';
  if (['mp4', 'mov', 'mkv', 'avi'].includes(ext)) return 'video';
  if (['mp3', 'wav', 'flac', 'm4a'].includes(ext)) return 'music';
  if (['ogg', 'opus', 'aac'].includes(ext)) return 'audio';
  if (['apk'].includes(ext)) return 'apk';
  if (['pdf', 'doc', 'docx', 'txt', 'zip'].includes(ext)) return 'document';
  return 'other';
}
