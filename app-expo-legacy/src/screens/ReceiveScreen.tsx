import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Orb } from '../components/Orb';
import { colors } from '../theme/colors';
import { useDragOrb } from '../hooks/useDragOrb';
import { TransferState, NearbyDevice } from '../types';

interface Props {
  transferState: TransferState;
  progress: number;
  nearbyDevices: NearbyDevice[];
  onAccept: () => void;
  onDecline: () => void;
  receivingFileName?: string;
}

export function ReceiveScreen({ transferState, progress, nearbyDevices, onAccept, onDecline, receivingFileName }: Props) {
  const [dragProgress, setDragProgress] = useState(0);
  const { panResponder, translateY } = useDragOrb(
    () => onAccept(),
    (_, p) => setDragProgress(p)
  );

  const sender = nearbyDevices[0];

  if (transferState === 'idle') {
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#070711', '#111127', '#1A1033']} style={StyleSheet.absoluteFill} />
        <View style={styles.center}>
          <View style={styles.waitingOrb}>
            <LinearGradient colors={['#1F1F3D', '#17172F']} style={styles.waitingCircle}>
              <Text style={styles.waitingEmoji}>📡</Text>
            </LinearGradient>
            <View style={styles.pulseRing} />
            <View style={[styles.pulseRing, { width: 160, height: 160, borderRadius: 80 }]} />
          </View>
          <Text style={styles.waitingTitle}>Aguardando envio...</Text>
          <Text style={styles.waitingSub}>Deixe sua Orb visível para amigos próximos</Text>
          <View style={styles.tips}>
            <View style={styles.tip}>
              <Text style={styles.tipIcon}>💡</Text>
              <Text style={styles.tipText}>Ative Wi-Fi, Bluetooth e Localização</Text>
            </View>
            <View style={styles.tip}>
              <Text style={styles.tipIcon}>📶</Text>
              <Text style={styles.tipText}>Fique próximo do remetente (até 10m)</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  if (transferState === 'connecting' || transferState === 'searching') {
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#070711', '#111127']} style={StyleSheet.absoluteFill} />
        <View style={styles.incomingContainer}>
          <LinearGradient colors={['#2A1F5A', '#1F1F3D']} style={styles.incomingCard}>
            <View style={styles.senderRow}>
              <LinearGradient colors={[sender?.avatarColor || '#7C5CFF', '#2A1A66']} style={styles.senderOrb}>
                <Text style={styles.senderInitial}>{sender?.name[0] || '?'}</Text>
              </LinearGradient>
              <View>
                <Text style={styles.senderName}>{sender?.name || 'Amigo Orb'}</Text>
                <Text style={styles.senderMeta}>quer enviar arquivos para você</Text>
                <Text style={styles.senderConn}>via {sender?.connectionType || 'Wi-Fi Direct'} • {sender?.distance}</Text>
              </View>
            </View>
            <View style={styles.filesPreview}>
              <Text style={styles.filesIcon}>📦</Text>
              <Text style={styles.filesText}>3 arquivos • 56.8 MB</Text>
            </View>
          </LinearGradient>

          <View style={styles.orbDragArea}>
            <Orb
              state={transferState === 'searching' ? 'searching' : 'connecting'}
              progress={0}
              dragProgress={dragProgress}
              translateY={translateY}
              panHandlers={panResponder.panHandlers}
              pseudonym="Aceitar"
            />
          </View>

          <Text style={styles.dragHint}>Arraste a Orb para cima para aceitar</Text>
          <View style={styles.actionRow}>
            <TouchableOpacity onPress={onDecline} style={styles.declineBtn}>
              <Text style={styles.declineText}>Recusar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onAccept}>
              <LinearGradient colors={['#7C5CFF', '#5A3ED6']} style={styles.acceptBtn}>
                <Text style={styles.acceptText}>Permitir ✓</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // Receiving state
  return (
    <View style={styles.container}>
      <LinearGradient colors={['#070711', '#111127']} style={StyleSheet.absoluteFill} />
      <View style={styles.center}>
        <Orb
          state={transferState}
          progress={progress}
          dragProgress={0}
          translateY={new Animated.Value(0)}
          panHandlers={{}}
          pseudonym="Recebendo"
          fileCount={1}
        />
        <View style={styles.receivingInfo}>
          <Text style={styles.receivingTitle}>Recebendo...</Text>
          <Text style={styles.receivingFile} numberOfLines={1}>{receivingFileName || 'arquivo'}</Text>
          <Text style={styles.receivingSub}>{Math.round(progress)}% • Wi-Fi Direct 12MB/s</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 100 },
  waitingOrb: { width: 120, height: 120, alignItems: 'center', justifyContent: 'center', marginBottom: 30 },
  waitingCircle: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center', zIndex: 2, borderWidth: 1, borderColor: 'rgba(124,92,255,0.3)' },
  waitingEmoji: { fontSize: 40 },
  pulseRing: { position: 'absolute', width: 200, height: 200, borderRadius: 100, borderWidth: 1, borderColor: 'rgba(124,92,255,0.15)' },
  waitingTitle: { fontSize: 18, fontWeight: '800', color: 'white', marginTop: 10 },
  waitingSub: { fontSize: 13, color: colors.textSecondary, marginTop: 6, textAlign: 'center', paddingHorizontal: 40 },
  tips: { marginTop: 30, gap: 12, width: '85%' },
  tip: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: 'rgba(255,255,255,0.06)', padding: 12, borderRadius: 12 },
  tipIcon: { fontSize: 16 },
  tipText: { fontSize: 12, color: colors.textSecondary, flex: 1 },
  incomingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20, paddingBottom: 120 },
  incomingCard: { width: '100%', borderRadius: 24, padding: 18, borderWidth: 1, borderColor: 'rgba(124,92,255,0.2)', gap: 16 },
  senderRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  senderOrb: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  senderInitial: { fontSize: 22, fontWeight: '800', color: 'white' },
  senderName: { fontSize: 16, fontWeight: '800', color: 'white' },
  senderMeta: { fontSize: 13, color: colors.textSecondary },
  senderConn: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  filesPreview: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(0,0,0,0.2)', padding: 10, borderRadius: 12 },
  filesIcon: { fontSize: 16 },
  filesText: { fontSize: 12, color: colors.textSecondary, fontWeight: '600' },
  orbDragArea: { marginVertical: 40 },
  dragHint: { fontSize: 13, fontWeight: '600', color: colors.secondary },
  actionRow: { flexDirection: 'row', gap: 12, marginTop: 20 },
  declineBtn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.08)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  declineText: { color: colors.textSecondary, fontWeight: '700' },
  acceptBtn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 14 },
  acceptText: { color: 'white', fontWeight: '800' },
  receivingInfo: { marginTop: 30, alignItems: 'center' },
  receivingTitle: { fontSize: 18, fontWeight: '800', color: 'white' },
  receivingFile: { fontSize: 13, color: colors.textSecondary, marginTop: 6, maxWidth: 260 },
  receivingSub: { fontSize: 11, color: colors.textMuted, marginTop: 4 },
});
