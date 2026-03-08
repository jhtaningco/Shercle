import { useEffect, useRef, useState } from 'react';
import { View, Text, Modal, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring,
  interpolate, Extrapolation,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { scheduleOnRN } from 'react-native-worklets';

const { width } = Dimensions.get('window');
const SLIDER_WIDTH = width - 96;
const HANDLE_SIZE = 60;
const TRAVEL = SLIDER_WIDTH - HANDLE_SIZE - 8;
const RING_SIZE = 130;
const RING_R = 52;
const CIRC = 2 * Math.PI * RING_R;
const TOTAL_MS = 10000;

// ─── Countdown Ring ──────────────────────────────────────────────────────────
function CountdownRing({ current, visible }: { current: number; visible: boolean }) {
  const [offset, setOffset] = useState(0);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!visible) {
      setOffset(0);
      startRef.current = null;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    startRef.current = performance.now();

    const tick = (now: number) => {
      const elapsed = now - (startRef.current ?? now);
      const progress = Math.min(elapsed / TOTAL_MS, 1);
      setOffset(progress * CIRC);
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [visible]);

  return (
    <View style={ring.wrap}>
      <Svg width={RING_SIZE} height={RING_SIZE} style={{ position: 'absolute' }}>
        <Circle cx={65} cy={65} r={RING_R} fill="none" stroke="#F3F4F6" strokeWidth={6} />
        <Circle
          cx={65} cy={65} r={RING_R} fill="none"
          stroke="#FF3318" strokeWidth={6}
          strokeDasharray={`${CIRC} ${CIRC}`}
          strokeDashoffset={offset}
          strokeLinecap="round" rotation={-90} origin="65, 65"
        />
      </Svg>
      <Text style={ring.number}>{current}</Text>
    </View>
  );
}

const ring = StyleSheet.create({
  wrap: { width: RING_SIZE, height: RING_SIZE, alignItems: 'center', justifyContent: 'center' },
  number: { fontSize: 48, fontWeight: '900', color: '#111827' },
});

// ─── Slide to Cancel (RIGHT → LEFT) ─────────────────────────────────────────
function SlideToCancel({ onCancel }: { onCancel: () => void }) {
  const x = useSharedValue(TRAVEL);
  const startX = useSharedValue(0);

  const gesture = Gesture.Pan()
    .onBegin(() => {
      startX.value = x.value;
    })
    .onChange((e) => {
      x.value = Math.max(0, Math.min(TRAVEL, startX.value + e.translationX));
    })
    .onEnd(() => {
      if (x.value < TRAVEL * 0.25) {
        x.value = withSpring(0);
        scheduleOnRN(onCancel);
      } else {
        x.value = withSpring(TRAVEL);
      }
    });

  const handleStyle = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));
  const textStyle = useAnimatedStyle(() => ({ opacity: interpolate(x.value, [TRAVEL * 0.5, TRAVEL], [0, 1], Extrapolation.CLAMP) }));
  const fillStyle = useAnimatedStyle(() => ({ width: interpolate(x.value, [0, TRAVEL], [TRAVEL, 0], Extrapolation.CLAMP) }));

  return (
    <GestureDetector gesture={gesture}>
      <View style={slider.track}>
        <Animated.View style={[slider.fill, fillStyle]} />
        <Animated.Text style={[slider.hint, textStyle]}>← Slide to Cancel</Animated.Text>
        <Animated.View style={[slider.handle, handleStyle]}>
          <LinearGradient colors={['#FF6B18', '#FF3318']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={slider.gradient}>
            <Ionicons name="close-outline" size={28} color="#FFF" />
          </LinearGradient>
        </Animated.View>
      </View>
    </GestureDetector>
  );
}

const slider = StyleSheet.create({
  track: { width: SLIDER_WIDTH, height: 68, backgroundColor: '#F9FAFB', borderRadius: 34, borderWidth: 1, borderColor: '#E5E7EB', padding: 4, justifyContent: 'center', overflow: 'hidden' },
  fill: { position: 'absolute', left: 4, top: 4, bottom: 4, backgroundColor: 'rgba(255,51,24,0.08)', borderRadius: 30 },
  hint: { position: 'absolute', width: '100%', textAlign: 'center', fontSize: 14, fontWeight: '700', color: '#9CA3AF', letterSpacing: 0.8, paddingRight: 16 },
  handle: { position: 'absolute', left: 4, width: HANDLE_SIZE, height: HANDLE_SIZE, borderRadius: HANDLE_SIZE / 2, overflow: 'hidden', shadowColor: '#FF3318', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 10, elevation: 6 },
  gradient: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
});

// ─── SOSModal ────────────────────────────────────────────────────────────────
type Props = { visible: boolean; countdown: number; onCancel: () => void };

export default function SOSModal({ visible, countdown, onCancel }: Props) {
  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onCancel}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={s.overlay}>
          <View style={s.sheet}>

            <View style={s.badge}>
              <View style={s.badgeDot} />
              <Text style={s.badgeLabel}>EMERGENCY ALERT</Text>
            </View>

            <View style={s.warnWrap}>
              <Ionicons name="warning-outline" size={36} color="#FF3318" />
            </View>

            <View style={s.titleBlock}>
              <Text style={s.title}>SOS Activated!</Text>
              <Text style={s.subtitle}>Your circle of care will be notified in</Text>
            </View>

            <CountdownRing current={countdown} visible={visible} />

            <View style={s.divider} />

            <SlideToCancel onCancel={onCancel} />

            <Text style={s.finePrint}>Authorities may be contacted automatically</Text>
          </View>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  sheet: { width: '100%', backgroundColor: '#FFFFFF', borderRadius: 28, paddingVertical: 32, paddingHorizontal: 28, alignItems: 'center', gap: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.15, shadowRadius: 32, elevation: 20 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,51,24,0.08)', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, borderWidth: 1, borderColor: 'rgba(255,51,24,0.15)' },
  badgeDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#FF3318' },
  badgeLabel: { fontSize: 10, fontWeight: '800', color: '#FF3318', letterSpacing: 2 },
  warnWrap: { width: 72, height: 72, borderRadius: 36, backgroundColor: 'rgba(255,51,24,0.06)', borderWidth: 1.5, borderColor: 'rgba(255,51,24,0.15)', alignItems: 'center', justifyContent: 'center' },
  titleBlock: { alignItems: 'center', gap: 6 },
  title: { fontSize: 26, fontWeight: '900', color: '#111827', letterSpacing: -0.5 },
  subtitle: { fontSize: 14, color: '#6B7280', textAlign: 'center' },
  divider: { width: '100%', height: 1, backgroundColor: '#F3F4F6' },
  finePrint: { fontSize: 11, color: '#D1D5DB', letterSpacing: 0.5, textAlign: 'center' },
});