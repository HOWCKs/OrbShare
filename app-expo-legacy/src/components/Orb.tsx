import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';
import { colors } from '../theme/colors';
import { useOrbAnimation } from '../hooks/useOrbAnimation';
import { TransferState } from '../types';

const { width } = Dimensions.get('window');
const ORB_SIZE = width * 0.62;
const STROKE_WIDTH = 6;
const RADIUS = (ORB_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface OrbProps {
  state: TransferState;
  progress: number; // 0-100
  dragProgress: number; // 0-1 when dragging up
  translateY: Animated.Value;
  panHandlers: any;
  pseudonym: string;
  fileCount?: number;
}

export function Orb({ state, progress, dragProgress, translateY, panHandlers, pseudonym, fileCount = 0 }: OrbProps) {
  const { scale, eyeX, eyeY, blink, float, glow } = useOrbAnimation();
  const internalProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(internalProgress, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const isTransferring = state === 'sending' || state === 'receiving';
  const progressPercent = Math.round(progress);

  // Eye expressions based on state
  const eyeScaleY = state === 'completed' ? 0.3 : state === 'searching' ? 1.3 : 1;
  const mouthType = () => {
    switch (state) {
      case 'sending': return '😊';
      case 'receiving': return '🤩';
      case 'completed': return '🥳';
      case 'connecting': return '😯';
      case 'searching': return '👀';
      case 'dragging': return dragProgress > 0.8 ? '😆' : '😊';
      default: return '😊';
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: Animated.add(translateY, float) }, { scale }],
        },
      ]}
      {...panHandlers}
    >
      {/* Glow */}
      <Animated.View
        style={[
          styles.glow,
          {
            opacity: glow.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.7] }),
            transform: [{ scale: glow.interpolate({ inputRange: [0, 1], outputRange: [1, 1.15] }) }],
          },
        ]}
      />

      {/* Progress Ring Container */}
      <View style={styles.ringContainer}>
        <Svg width={ORB_SIZE} height={ORB_SIZE} style={StyleSheet.absoluteFill}>
          {/* Track */}
          <Circle
            cx={ORB_SIZE / 2}
            cy={ORB_SIZE / 2}
            r={RADIUS}
            stroke={colors.border}
            strokeWidth={STROKE_WIDTH}
            fill="transparent"
            opacity={0.3}
          />
          {/* Progress */}
          {isTransferring && (
            <Circle
              cx={ORB_SIZE / 2}
              cy={ORB_SIZE / 2}
              r={RADIUS}
              stroke={colors.primary}
              strokeWidth={STROKE_WIDTH}
              fill="transparent"
              strokeDasharray={`${CIRCUMFERENCE}`}
              strokeDashoffset={CIRCUMFERENCE - (CIRCUMFERENCE * progress) / 100}
              strokeLinecap="round"
              rotation="-90"
              origin={`${ORB_SIZE / 2}, ${ORB_SIZE / 2}`}
            />
          )}
          {/* Drag indicator */}
          {!isTransferring && dragProgress > 0 && (
            <Circle
              cx={ORB_SIZE / 2}
              cy={ORB_SIZE / 2}
              r={RADIUS}
              stroke={colors.secondary}
              strokeWidth={STROKE_WIDTH}
              fill="transparent"
              strokeDasharray={`${CIRCUMFERENCE}`}
              strokeDashoffset={CIRCUMFERENCE - CIRCUMFERENCE * dragProgress}
              strokeLinecap="round"
              rotation="-90"
              origin={`${ORB_SIZE / 2}, ${ORB_SIZE / 2}`}
              opacity={0.8}
            />
          )}
        </Svg>

        {/* Orb Body with 3D effect */}
        <LinearGradient
          colors={['#9B83FF', '#7C5CFF', '#4A2BC0', '#2A1A66']}
          start={{ x: 0.2, y: 0.1 }}
          end={{ x: 0.9, y: 0.9 }}
          style={styles.orbBody}
        >
          {/* Inner highlight for 3D */}
          <LinearGradient
            colors={['rgba(255,255,255,0.4)', 'rgba(255,255,255,0.05)', 'transparent']}
            start={{ x: 0.2, y: 0.15 }}
            end={{ x: 0.6, y: 0.6 }}
            style={styles.innerHighlight}
          />

          {/* Content */}
          <View style={styles.content}>
            {isTransferring ? (
              <>
                <Text style={styles.percentText}>{progressPercent}%</Text>
                <Text style={styles.stateText}>
                  {state === 'sending' ? 'Enviando...' : 'Recebendo...'}
                </Text>
                {fileCount > 0 && (
                  <Text style={styles.fileCount}>{fileCount} arquivos</Text>
                )}
              </>
            ) : (
              <>
                {/* Eyes */}
                <View style={styles.eyesContainer}>
                  <Animated.View
                    style={[
                      styles.eye,
                      {
                        transform: [{ translateX: eyeX }, { translateY: eyeY }, { scaleY: blink }],
                      },
                    ]}
                  >
                    <View style={styles.pupil}>
                      <View style={styles.pupilGlow} />
                    </View>
                  </Animated.View>
                  <Animated.View
                    style={[
                      styles.eye,
                      {
                        transform: [{ translateX: eyeX }, { translateY: eyeY }, { scaleY: blink }],
                      },
                    ]}
                  >
                    <View style={styles.pupil}>
                      <View style={styles.pupilGlow} />
                    </View>
                  </Animated.View>
                </View>

                {/* Mouth / Expression */}
                <Text style={[styles.mouth, { transform: [{ scaleY: eyeScaleY }] }]}>{mouthType()}</Text>

                {/* Pseudonym */}
                <Text style={styles.pseudonym}>{pseudonym}</Text>

                {/* Drag hint */}
                {dragProgress > 0.2 && (
                  <Text style={styles.dragHint}>
                    {dragProgress > 0.85 ? 'Solte para enviar!' : 'Continue arrastando ↑'}
                  </Text>
                )}
              </>
            )}
          </View>

          {/* Bottom shine */}
          <View style={styles.bottomShine} />
        </LinearGradient>
      </View>

      {/* Drag ripple when near threshold */}
      {dragProgress > 0.7 && !isTransferring && (
        <Animated.View
          style={[
            styles.ripple,
            {
              opacity: dragProgress,
              transform: [{ scale: 1 + dragProgress * 0.3 }],
            },
          ]}
        />
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: ORB_SIZE,
    height: ORB_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  glow: {
    position: 'absolute',
    width: ORB_SIZE + 40,
    height: ORB_SIZE + 40,
    borderRadius: (ORB_SIZE + 40) / 2,
    backgroundColor: colors.primary,
    opacity: 0.4,
  },
  ringContainer: {
    width: ORB_SIZE,
    height: ORB_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbBody: {
    width: ORB_SIZE - 12,
    height: ORB_SIZE - 12,
    borderRadius: (ORB_SIZE - 12) / 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 20,
    overflow: 'hidden',
  },
  innerHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '80%',
    height: '60%',
    borderRadius: (ORB_SIZE - 12) / 2,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  eyesContainer: {
    flexDirection: 'row',
    gap: 18,
    marginBottom: 6,
  },
  eye: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  pupil: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#1A1033',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: 3,
  },
  pupilGlow: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'white',
  },
  mouth: {
    fontSize: 24,
    marginTop: 2,
  },
  pseudonym: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: '700',
    color: 'white',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  dragHint: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '600',
    color: colors.secondary,
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    overflow: 'hidden',
  },
  percentText: {
    fontSize: 48,
    fontWeight: '900',
    color: 'white',
    letterSpacing: -1,
  },
  stateText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
  },
  fileCount: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },
  bottomShine: {
    position: 'absolute',
    bottom: 15,
    width: '60%',
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 10,
    transform: [{ scaleX: 1.5 }],
  },
  ripple: {
    position: 'absolute',
    width: ORB_SIZE + 60,
    height: ORB_SIZE + 60,
    borderRadius: (ORB_SIZE + 60) / 2,
    borderWidth: 2,
    borderColor: colors.secondary,
  },
});
