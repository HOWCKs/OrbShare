// OrbShare Transfer Service - MVP Mock + Architecture for real implementation
// Arquitetura preparada para WiFi Direct, Bluetooth, Hotspot
// Próximos passos: integrar react-native-wifi-p2p e RNBluetooth

import { ShareFile, TransferProgress, TransferState, NearbyDevice } from '../types';

export type TransferStrategy = 'wifi-direct' | 'bluetooth' | 'hotspot' | 'wifi';

interface Strategy {
  type: TransferStrategy;
  maxSpeedMBps: number;
  init(): Promise<void>;
  send(files: ShareFile[], onProgress: (p: number) => void): Promise<void>;
  receive(onProgress: (p: number) => void): Promise<ShareFile[]>;
  disconnect(): Promise<void>;
}

// Mock strategies for MVP - simulam transferência
class MockWifiDirectStrategy implements Strategy {
  type: TransferStrategy = 'wifi-direct';
  maxSpeedMBps = 20;
  async init() { await new Promise(r => setTimeout(r, 800)); }
  async send(files: ShareFile[], onProgress: (p: number) => void) {
    // Simulate transfer with progress
    for (let i = 0; i <= 100; i += 2) {
      await new Promise(r => setTimeout(r, 60));
      onProgress(i);
    }
  }
  async receive(onProgress: (p: number) => void) {
    for (let i = 0; i <= 100; i += 2) {
      await new Promise(r => setTimeout(r, 70));
      onProgress(i);
    }
    return [];
  }
  async disconnect() {}
}

class MockBluetoothStrategy implements Strategy {
  type: TransferStrategy = 'bluetooth';
  maxSpeedMBps = 2;
  async init() { await new Promise(r => setTimeout(r, 1200)); }
  async send(files: ShareFile[], onProgress: (p: number) => void) {
    for (let i = 0; i <= 100; i++) {
      await new Promise(r => setTimeout(r, 200));
      onProgress(i);
    }
  }
  async receive(onProgress: (p: number) => void) {
    for (let i = 0; i <= 100; i++) {
      await new Promise(r => setTimeout(r, 200));
      onProgress(i);
    }
    return [];
  }
  async disconnect() {}
}

// TODO: Real implementations
// class WifiDirectRealStrategy implements Strategy { ... uses react-native-wifi-p2p }
// class BluetoothRealStrategy implements Strategy { ... uses react-native-bluetooth-classic }

export class TransferService {
  private strategy: Strategy;
  private state: TransferState = 'idle';
  private progress: number = 0;

  constructor(preferred: TransferStrategy = 'wifi-direct') {
    // For MVP, always mock
    this.strategy = preferred === 'bluetooth' ? new MockBluetoothStrategy() : new MockWifiDirectStrategy();
  }

  async discoverDevices(): Promise<NearbyDevice[]> {
    // Mock discovery - in real app uses NSD + WiFi P2P discovery
    await new Promise(r => setTimeout(r, 1000));
    return [
      { id: '1', name: 'Maria Orb', avatarColor: '#FF5C9D', distance: 'próximo', connectionType: 'wifi-direct', isAvailable: true },
      { id: '2', name: 'João Orb', avatarColor: '#00E5CC', distance: 'próximo', connectionType: 'wifi-direct', isAvailable: true },
      { id: '3', name: 'Pedro Orb', avatarColor: '#FFB020', distance: 'médio', connectionType: 'bluetooth', isAvailable: true },
    ];
  }

  async startSend(files: ShareFile[], onUpdate: (p: TransferProgress) => void): Promise<void> {
    this.state = 'searching';
    onUpdate(this.buildProgress(files[0]?.name || ''));

    await this.strategy.init();

    this.state = 'connecting';
    onUpdate(this.buildProgress(files[0]?.name || ''));
    await new Promise(r => setTimeout(r, 1200));

    this.state = 'sending';
    await this.strategy.send(files, (p) => {
      this.progress = p;
      onUpdate(this.buildProgress(files[Math.floor((p/100)*(files.length-1))]?.name || files[0].name));
    });

    this.state = 'completed';
    onUpdate(this.buildProgress(files[0]?.name || ''));
  }

  async startReceive(onUpdate: (p: TransferProgress) => void): Promise<ShareFile[]> {
    this.state = 'searching';
    onUpdate(this.buildProgress('Aguardando...'));
    await this.strategy.init();
    this.state = 'receiving';
    await this.strategy.receive((p) => {
      this.progress = p;
      onUpdate(this.buildProgress('Recebendo arquivo...'));
    });
    this.state = 'completed';
    onUpdate(this.buildProgress('Concluído'));
    return [];
  }

  private buildProgress(currentFileName: string): TransferProgress {
    return {
      state: this.state,
      progress: this.progress,
      speedBps: this.strategy.maxSpeedMBps * 1024 * 1024,
      remainingSeconds: this.progress > 0 ? Math.round((100 - this.progress) * 0.6) : 0,
      currentFileIndex: 0,
      totalFiles: 1,
      currentFileName,
    };
  }

  reset() {
    this.state = 'idle';
    this.progress = 0;
  }
}
