import { useState, useRef, useEffect } from 'react';
import {
  View, Text, SafeAreaView, TouchableOpacity,
  Switch, Animated, StyleSheet, Pressable, Dimensions, Image, Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import SOSModal from '@/src/components/sos/SOSModal';

const { width } = Dimensions.get('window');
const SIZE = Math.min(width * 0.68, 280);
const L2 = SIZE * 0.87;
const L3 = SIZE * 0.70;
const L4 = SIZE * 0.54;

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  // Tab bar (70) + Gap (20) + Safe Area + Extra Breathing (30) = 120 + insets.bottom
  const bottomPad = 120 + insets.bottom;

  const [locationEnabled, setLocationEnabled] = useState(true);
  const [sosVisible, setSosVisible] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Animations
  const scale    = useRef(new Animated.Value(1)).current;
  const pulse1   = useRef(new Animated.Value(1)).current;
  const pulse1Op = useRef(new Animated.Value(0.15)).current;
  const pulse2   = useRef(new Animated.Value(1)).current;
  const pulse2Op = useRef(new Animated.Value(0.1)).current;
  const rippleScale = useRef(new Animated.Value(1)).current;
  const rippleOp    = useRef(new Animated.Value(0)).current;

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  useEffect(() => {
    const pulse = (val: Animated.Value, op: Animated.Value, toScale: number, idleOp: number, delay = 0) =>
      setTimeout(() =>
        Animated.loop(Animated.sequence([
          Animated.parallel([
            Animated.timing(val, { toValue: toScale, duration: 1500, useNativeDriver: true }),
            Animated.timing(op,  { toValue: 0.04,    duration: 1500, useNativeDriver: true }),
          ]),
          Animated.parallel([
            Animated.timing(val, { toValue: 1,      duration: 1500, useNativeDriver: true }),
            Animated.timing(op,  { toValue: idleOp, duration: 1500, useNativeDriver: true }),
          ]),
        ])).start()
      , delay);

    pulse(pulse1, pulse1Op, 1.12, 0.15);
    pulse(pulse2, pulse2Op, 1.22, 0.10, 500);
  }, []);

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.94, useNativeDriver: true, speed: 40, bounciness: 4 }).start();
    rippleScale.setValue(1);
    rippleOp.setValue(0.5);
    Animated.parallel([
      Animated.timing(rippleScale, { toValue: 1.6, duration: 600, useNativeDriver: true }),
      Animated.timing(rippleOp,    { toValue: 0,   duration: 600, useNativeDriver: true }),
    ]).start();
  };

  const handlePressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 10 }).start();

  const handleLongPress = () => {
    if (sosVisible) return;
    setSosVisible(true);
    setCountdown(10);
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setSosVisible(false);
          Alert.alert('SOS Sent', 'Your emergency contacts have been notified.', [{ text: 'OK' }]);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleCancel = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSosVisible(false);
    setCountdown(10);
  };

  return (
    <SafeAreaView style={s.safe}>
      <View style={[s.screen, { paddingBottom: bottomPad }]}>
        <View style={s.ambientGlow} />

        {/* Header */}
        <View style={s.header}>
          <View style={s.logoRow}>
            <Image source={require('../../assets/images/logos/logo-main.png')} style={s.logo} resizeMode="contain" />
            <View>
              <Text style={s.mabuhay}>Mabuhay!</Text>
              <Text style={s.name}>Maria Santos</Text>
            </View>
          </View>
          <TouchableOpacity style={s.notifBtn} activeOpacity={0.7}>
            <Ionicons name="notifications-outline" size={22} color="#111827" />
            <View style={s.notifDot} />
          </TouchableOpacity>
        </View>

        {/* SOS Button */}
        <View style={s.sosArea}>
          {[
            { val: pulse2, op: pulse2Op, extra: 70 },
            { val: pulse1, op: pulse1Op, extra: 40 },
          ].map(({ val, op, extra }, i) => (
            <Animated.View key={i} style={[s.pulseRing, {
              width: SIZE + extra, height: SIZE + extra,
              borderRadius: (SIZE + extra) / 2,
              transform: [{ scale: val }], opacity: op,
            }]} />
          ))}

          <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} onLongPress={handleLongPress} delayLongPress={800}>
            <Animated.View style={{ transform: [{ scale }] }}>
              <View style={[s.layer1, { width: SIZE, height: SIZE, borderRadius: SIZE / 2 }]}>
                <Animated.View style={[s.ripple, { width: SIZE, height: SIZE, borderRadius: SIZE / 2, transform: [{ scale: rippleScale }], opacity: rippleOp }]} />
                <View style={[s.layer2, { width: L2, height: L2, borderRadius: L2 / 2 }]}>
                  <LinearGradient colors={['#FF3318', '#FF6B18', '#FFAA1C']} start={{ x: 0.1, y: 0.1 }} end={{ x: 0.9, y: 0.9 }} style={[s.center, { width: L3, height: L3, borderRadius: L3 / 2 }]}>
                    <LinearGradient colors={['#FFAA1C', '#FF8C18', '#FF3318']} start={{ x: 0.3, y: 0.3 }} end={{ x: 1, y: 1 }} style={[s.center, { width: L4, height: L4, borderRadius: L4 / 2 }]}>
                      <Text style={s.sosText}>SOS</Text>
                    </LinearGradient>
                  </LinearGradient>
                </View>
                <View style={s.gloss} />
              </View>
            </Animated.View>
          </Pressable>
        </View>

        {/* Help text */}
        <View style={s.helpWrap}>
          <Text style={s.helpTitle}>Need Help?</Text>
          <Text style={s.helpSub}>Tap and hold the SOS Button to connect to your circle of care.</Text>
        </View>

        <View style={s.divider} />

        {/* Location toggle */}
        <View style={s.row}>
          <View style={s.rowLeft}>
            <View style={s.iconWrap}><Ionicons name="location-outline" size={20} color="#FF3318" /></View>
            <Text style={s.rowLabel}>Send Current Location</Text>
          </View>
          <Switch value={locationEnabled} onValueChange={setLocationEnabled} trackColor={{ false: '#E5E7EB', true: '#FF3318' }} thumbColor="#FFF" ios_backgroundColor="#E5E7EB" />
        </View>

        <View style={s.divider} />

        {/* Current circle */}
        <View style={s.row}>
          <View style={s.rowLeft}>
            <View style={s.iconWrap}><Ionicons name="people-outline" size={20} color="#FF3318" /></View>
            <View>
              <Text style={s.rowLabel}>Current Circle</Text>
              <View style={s.avatarRow}>
                {['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'].map((c, i) => (
                  <View key={i} style={[s.avatar, { backgroundColor: c, marginLeft: i > 0 ? -8 : 0 }]} />
                ))}
                <Text style={s.circleCount}>+2</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={s.changeBtn}>Change →</Text>
          </TouchableOpacity>
        </View>

        <SOSModal visible={sosVisible} countdown={countdown} onCancel={handleCancel} />
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFF' },
  screen: { flex: 1, paddingHorizontal: 24 },
  ambientGlow: { position: 'absolute', top: '30%', left: '50%', marginLeft: -200, width: 400, height: 400, borderRadius: 200, backgroundColor: 'rgba(255,51,24,0.04)' },

  // Header
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logo: { width: 46, height: 46 },
  mabuhay: { fontSize: 11, fontWeight: '700', color: '#FF6B18', letterSpacing: 1.5, textTransform: 'uppercase' },
  name: { fontSize: 17, fontWeight: '800', color: '#111827', marginTop: 1 },
  notifBtn: { width: 44, height: 44, backgroundColor: '#F3F4F6', borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#E5E7EB' },
  notifDot: { position: 'absolute', top: 10, right: 10, width: 8, height: 8, backgroundColor: '#FF3318', borderRadius: 4, borderWidth: 2, borderColor: '#FFF' },

  // SOS
  sosArea: { alignItems: 'center', justifyContent: 'center', marginTop: 24, marginBottom: 12, height: SIZE + 80 },
  pulseRing: { position: 'absolute', backgroundColor: 'rgba(255,51,24,0.15)' },
  layer1: { backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', shadowColor: '#FF3318', shadowOffset: { width: 0, height: 16 }, shadowOpacity: 0.25, shadowRadius: 32, elevation: 20, overflow: 'hidden' },
  ripple: { position: 'absolute', borderWidth: 3, borderColor: 'rgba(255,51,24,0.3)', backgroundColor: 'transparent' },
  layer2: { backgroundColor: '#FF3318', alignItems: 'center', justifyContent: 'center' },
  center: { alignItems: 'center', justifyContent: 'center' },
  sosText: { fontSize: 36, fontWeight: '900', color: '#FFF', letterSpacing: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4 },
  gloss: { position: 'absolute', top: '8%', right: '8%', width: '38%', height: '32%', backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 999, transform: [{ rotate: '-20deg' }, { scaleX: 1.2 }], opacity: 0.7 },

  // Help
  helpWrap: { alignItems: 'center', paddingHorizontal: 8, marginBottom: 24 },
  helpTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 6 },
  helpSub: { fontSize: 13.5, color: '#4B5563', lineHeight: 21, textAlign: 'center' },

  // Rows
  divider: { height: 1, backgroundColor: '#F3F4F6', marginBottom: 20 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconWrap: { width: 36, height: 36, backgroundColor: 'rgba(255,51,24,0.08)', borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,51,24,0.15)' },
  rowLabel: { fontSize: 14.5, fontWeight: '600', color: '#374151' },
  avatarRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  avatar: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#FFF' },
  circleCount: { fontSize: 11, fontWeight: '700', color: '#6B7280', marginLeft: 6 },
  changeBtn: { fontSize: 13.5, fontWeight: '700', color: '#FF3318' },
});