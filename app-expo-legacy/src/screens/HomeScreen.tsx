import React, { useState, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, Animated, ScrollView, TouchableOpacity, Dimensions, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Orb } from '../components/Orb';
import { colors } from '../theme/colors';
import { useDragOrb } from '../hooks/useDragOrb';
import { TransferState, NearbyDevice } from '../types';

const { width } = Dimensions.get('window');

interface Props {
  onStartSend: () => void;
  transferState: TransferState;
  progress: number;
  nearbyDevices: NearbyDevice[];
  pseudonym: string;
}

export function HomeScreen({ onStartSend, transferState, progress, nearbyDevices, pseudonym }: Props) {
  const [dragProgress, setDragProgress] = useState(0);
  const [dragging, setDragging] = useState(false);

  const { panResponder, translateY } = useDragOrb(
    () => {
      onStartSend();
    },
    (isDragging, prog) => {
      setDragging(isDragging);
      setDragProgress(prog);
    }
  );

  const effectiveState: TransferState = dragging ? 'dragging' : transferState;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <LinearGradient colors={['#070711', '#111127', '#1A1033']} style={StyleSheet.absoluteFill} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá, {pseudonym} 👋</Text>
          <Text style={styles.subGreeting}>
            {nearbyDevices.length > 0 ? `${nearbyDevices.length} por perto` : 'Procurando amigos...'}
          </Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.onlineDot} />
          <Text style={styles.onlineText}>Online</Text>
        </View>
      </View>

      {/* Nearby orbit visualization */}
      <View style={styles.orbitContainer}>
        {/* Orbit rings */}
        <View style={[styles.orbitRing, { width: width * 0.9, height: width * 0.9, borderRadius: width * 0.45 }]} />
        <View style={[styles.orbitRing, { width: width * 0.75, height: width * 0.75, borderRadius: width * 0.375, opacity: 0.3 }]} />

        {/* Nearby devices as small orbs */}
        {nearbyDevices.map((device, idx) => {
          const angle = (idx / nearbyDevices.length) * 2 * Math.PI;
          const radius = width * 0.36;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          return (
            <View
              key={device.id}
              style={[
                styles.miniOrbContainer,
                { transform: [{ translateX: x }, { translateY: y }] },
              ]}
            >
              <LinearGradient
                colors={[device.avatarColor, '#2A1A66']}
                style={styles.miniOrb}
              >
                <Text style={styles.miniOrbText}>{device.name[0]}</Text>
              </LinearGradient>
              <Text style={styles.miniOrbName}>{device.name}</Text>
              <View style={[styles.connDot, { backgroundColor: device.isAvailable ? colors.success : colors.textMuted }]} />
            </View>
          );
        })}

        {/* Main Orb */}
        <View style={styles.mainOrbWrap}>
          <Orb
            state={effectiveState}
            progress={progress}
            dragProgress={dragProgress}
            translateY={translateY}
            panHandlers={panResponder.panHandlers}
            pseudonym={pseudonym}
          />
        </View>
      </View>

      {/* Bottom hint */}
      <View style={styles.hintContainer}>
        {transferState === 'idle' && !dragging ? (
          <>
            <View style={styles.dragLine} />
            <Text style={styles.hintTitle}>Arraste a Orb para cima para enviar</Text>
            <Text style={styles.hintSub}>Selecione arquivos e compartilhe por proximidade</Text>
          </>
        ) : dragging ? (
          <>
            <Text style={[styles.hintTitle, { color: colors.secondary }]}>
              {dragProgress > 0.85 ? '🚀 Quase lá!' : '↑ Continue puxando'}
            </Text>
            <View style={styles.progressBarTrack}>
              <View style={[styles.progressBarFill, { width: `${dragProgress * 100}%` }]} />
            </View>
          </>
        ) : (
          <>
            <Text style={styles.hintTitle}>
              {transferState === 'searching' ? '🔍 Buscando dispositivos...' :
               transferState === 'connecting' ? '🤝 Conectando...' :
               transferState === 'sending' ? '📤 Enviando arquivos...' :
               transferState === 'completed' ? '✅ Envio concluído!' : ''}
            </Text>
            <Text style={styles.hintSub}>
              {transferState === 'sending' ? 'Mantenha os aparelhos próximos' : 'Aguarde um momento'}
            </Text>
          </>
        )}
      </View>

      {/* Quick actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.quickBtn}>
          <Text style={styles.quickIcon}>📷</Text>
          <Text style={styles.quickLabel}>Fotos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickBtn}>
          <Text style={styles.quickIcon}>🎬</Text>
          <Text style={styles.quickLabel}>Vídeos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickBtn}>
          <Text style={styles.quickIcon}>🎵</Text>
          <Text style={styles.quickLabel}>Músicas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickBtn}>
          <Text style={styles.quickIcon}>📦</Text>
          <Text style={styles.quickLabel}>Apps</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 10,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '800',
    color: 'white',
  },
  subGreeting: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,229,160,0.12)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
  },
  onlineText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.success,
  },
  orbitContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbitRing: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(124,92,255,0.12)',
    borderStyle: 'dashed',
  },
  miniOrbContainer: {
    position: 'absolute',
    alignItems: 'center',
    gap: 4,
  },
  miniOrb: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  miniOrbText: {
    fontSize: 18,
    fontWeight: '800',
    color: 'white',
  },
  miniOrbName: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  connDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  mainOrbWrap: {
    zIndex: 10,
  },
  hintContainer: {
    alignItems: 'center',
    paddingBottom: 16,
    gap: 6,
  },
  dragLine: {
    width: 2,
    height: 24,
    backgroundColor: 'rgba(124,92,255,0.3)',
    borderRadius: 1,
    marginBottom: 4,
  },
  hintTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: 'white',
  },
  hintSub: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  progressBarTrack: {
    width: 120,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 6,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.secondary,
    borderRadius: 2,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingBottom: 110,
    marginTop: 10,
  },
  quickBtn: {
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  quickIcon: {
    fontSize: 20,
  },
  quickLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
  },
});
