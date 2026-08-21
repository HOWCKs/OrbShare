export type TransferState = 'idle' | 'dragging' | 'searching' | 'connecting' | 'sending' | 'receiving' | 'completed' | 'error';

export type FileCategory = 'photo' | 'video' | 'music' | 'audio' | 'apk' | 'document' | 'other';

export interface ShareFile {
  id: string;
  name: string;
  uri: string;
  size: number;
  sizeFormatted: string;
  category: FileCategory;
  mimeType?: string;
  thumbnailUri?: string;
  packageName?: string; // for APKs
}

export interface NearbyDevice {
  id: string;
  name: string;
  avatarColor: string;
  distance: 'próximo' | 'médio' | 'longe';
  connectionType: 'wifi-direct' | 'bluetooth' | 'wifi' | 'hotspot';
  isAvailable: boolean;
}

export interface TransferProgress {
  state: TransferState;
  progress: number; // 0-100
  speedBps: number;
  remainingSeconds: number;
  currentFileIndex: number;
  totalFiles: number;
  currentFileName: string;
}

export interface UserProfile {
  pseudonym: string;
  avatarSeed: string;
  color: string;
}
