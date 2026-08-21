import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { HomeScreen } from './src/screens/HomeScreen';
import { SendScreen } from './src/screens/SendScreen';
import { ReceiveScreen } from './src/screens/ReceiveScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { BottomNav } from './src/components/BottomNav';
import { TransferService } from './src/services/TransferService';
import { ShareFile, TransferState, NearbyDevice } from './src/types';

type Tab = 'home' | 'send' | 'receive' | 'history' | 'settings';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [transferState, setTransferState] = useState<TransferState>('idle');
  const [progress, setProgress] = useState(0);
  const [nearbyDevices, setNearbyDevices] = useState<NearbyDevice[]>([]);
  const [pseudonym, setPseudonym] = useState('Sua Orb');
  const [selectedFiles, setSelectedFiles] = useState<ShareFile[]>([]);
  const [receivingFile, setReceivingFile] = useState<string>('');

  const transferService = useRef(new TransferService('wifi-direct')).current;

  useEffect(() => {
    // Discover devices on mount
    const discover = async () => {
      const devices = await transferService.discoverDevices();
      setNearbyDevices(devices);
    };
    discover();
    const interval = setInterval(discover, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleStartSend = async (files?: ShareFile[]) => {
    const toSend = files || selectedFiles;
    if (toSend.length === 0) {
      setActiveTab('send');
      return;
    }
    setTransferState('searching');
    setActiveTab('home');
    try {
      await transferService.startSend(toSend, (p) => {
        setTransferState(p.state);
        setProgress(p.progress);
        setReceivingFile(p.currentFileName);
      });
      // After complete, reset after delay
      setTimeout(() => {
        setTransferState('idle');
        setProgress(0);
        setSelectedFiles([]);
        transferService.reset();
      }, 2500);
    } catch (e) {
      setTransferState('error');
      setTimeout(() => {
        setTransferState('idle');
        setProgress(0);
      }, 2000);
    }
  };

  const handleAcceptReceive = async () => {
    setTransferState('receiving');
    try {
      await transferService.startReceive((p) => {
        setTransferState(p.state);
        setProgress(p.progress);
        setReceivingFile(p.currentFileName);
      });
      setTimeout(() => {
        setTransferState('idle');
        setProgress(0);
        transferService.reset();
      }, 2500);
    } catch {
      setTransferState('idle');
    }
  };

  return (
    <GestureHandlerRootView style={styles.root}>
      <View style={styles.container}>
        {activeTab === 'home' && (
          <HomeScreen
            onStartSend={() => handleStartSend()}
            transferState={transferState}
            progress={progress}
            nearbyDevices={nearbyDevices}
            pseudonym={pseudonym}
          />
        )}
        {activeTab === 'send' && (
          <SendScreen
            onSend={handleStartSend}
            selectedFiles={selectedFiles}
            setSelectedFiles={setSelectedFiles}
          />
        )}
        {activeTab === 'receive' && (
          <ReceiveScreen
            transferState={transferState === 'idle' ? 'idle' : transferState}
            progress={progress}
            nearbyDevices={nearbyDevices}
            onAccept={handleAcceptReceive}
            onDecline={() => setTransferState('idle')}
            receivingFileName={receivingFile}
          />
        )}
        {activeTab === 'history' && <HistoryScreen />}
        {activeTab === 'settings' && <SettingsScreen pseudonym={pseudonym} setPseudonym={setPseudonym} />}

        <BottomNav active={activeTab} onChange={setActiveTab} pendingCount={transferState === 'idle' ? nearbyDevices.length : 0} />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  container: { flex: 1, backgroundColor: '#070711' },
});
