import { useRef } from 'react';
import { Animated, PanResponder, Dimensions } from 'react-native';
import * as Haptics from 'expo-haptics';

const { height: SCREEN_H } = Dimensions.get('window');
const DRAG_THRESHOLD = -120;

export function useDragOrb(onTriggerSend: () => void, onDragStateChange: (dragging: boolean, progress: number) => void) {
  const translateY = useRef(new Animated.Value(0)).current;
  const dragging = useRef(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        dragging.current = true;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onDragStateChange(true, 0);
      },
      onPanResponderMove: (_, gesture) => {
        // Only allow drag up
        const y = Math.min(0, gesture.dy);
        translateY.setValue(y);
        const progress = Math.min(1, Math.abs(y) / Math.abs(DRAG_THRESHOLD));
        onDragStateChange(true, progress);
        if (progress > 0.9) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
      },
      onPanResponderRelease: (_, gesture) => {
        dragging.current = false;
        if (gesture.dy < DRAG_THRESHOLD) {
          // Trigger send
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          onTriggerSend();
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            friction: 6,
          }).start();
          onDragStateChange(false, 0);
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            friction: 6,
          }).start(() => {
            onDragStateChange(false, 0);
          });
        }
      },
    })
  ).current;

  return { panResponder, translateY };
}
