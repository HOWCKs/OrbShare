import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

export function useOrbAnimation() {
  const scale = useRef(new Animated.Value(1)).current;
  const eyeX = useRef(new Animated.Value(0)).current;
  const eyeY = useRef(new Animated.Value(0)).current;
  const blink = useRef(new Animated.Value(1)).current;
  const float = useRef(new Animated.Value(0)).current;
  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Floating idle animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(float, { toValue: -10, duration: 2000, useNativeDriver: true }),
        Animated.timing(float, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ])
    ).start();

    // Glow pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(glow, { toValue: 1, duration: 1500, useNativeDriver: false }),
        Animated.timing(glow, { toValue: 0, duration: 1500, useNativeDriver: false }),
      ])
    ).start();

    // Random eye movement
    const moveEyes = () => {
      Animated.parallel([
        Animated.timing(eyeX, { toValue: (Math.random() - 0.5) * 10, duration: 600, useNativeDriver: true }),
        Animated.timing(eyeY, { toValue: (Math.random() - 0.5) * 6, duration: 600, useNativeDriver: true }),
      ]).start();
    };
    const eyeInterval = setInterval(moveEyes, 2500);

    // Blinking
    const doBlink = () => {
      Animated.sequence([
        Animated.timing(blink, { toValue: 0.1, duration: 80, useNativeDriver: true }),
        Animated.timing(blink, { toValue: 1, duration: 80, useNativeDriver: true }),
      ]).start();
    };
    const blinkInterval = setInterval(doBlink, 4000 + Math.random() * 3000);

    return () => {
      clearInterval(eyeInterval);
      clearInterval(blinkInterval);
    };
  }, []);

  const pulsePress = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.92, duration: 100, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();
  };

  return { scale, eyeX, eyeY, blink, float, glow, pulsePress };
}
