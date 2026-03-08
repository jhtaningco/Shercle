import { useState, useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity,
  Switch, Animated, StyleSheet, Pressable, Dimensions, Image, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import SOSModal from '@/src/components/sos/SOSModal';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@/src/components/common/Header';


const { width } = Dimensions.get('window');
const SIZE = 276;
const L2 = SIZE * 0.87;
const L3 = SIZE * 0.70;
const L4 = SIZE * 0.54;

export default function HomeScreen() {
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
      <View style={s.screen}>
        <View style={s.ambientGlow} />

        {/* Header */}
        <Header 
          name="Maria Santos" 
          onNotificationPress={() => console.log('Notification pressed')} 
        />


        {/* SOS Button */}
        <View className="items-center justify-center mt-10 mb-7" style={{ height: SIZE + 100 }}>
          {/* Radiating concentric circles */}
          {[1.2, 1.4, 1.6].map((scaleFactor, i) => (
            <Animated.View
              key={i}
              className="absolute bg-rose-500/40"
              style={{
                width: SIZE,
                height: SIZE,
                borderRadius: SIZE / 2,
                transform: [{ scale: Animated.multiply(pulse1, scaleFactor) }],
                opacity: Animated.multiply(pulse1Op, 1 / (i + 1)),
              }}
            />
          ))}

          <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} onLongPress={handleLongPress} delayLongPress={800}>
            <Animated.View style={{ transform: [{ scale }] }}>
              <View 
                className="bg-white items-center justify-center overflow-hidden shadow-2xl elevation-24"
                style={{ width: SIZE + 16, height: SIZE + 16, borderRadius: (SIZE + 16) / 2 }}
              >
                {/* Inner Shadow for white circle */}
                <LinearGradient
                  colors={['rgba(0,0,0,0.1)', 'transparent']}
                  className="absolute inset-0"
                  style={{ borderRadius: (SIZE + 16) / 2 }}
                />
                
                <LinearGradient
                  colors={['#FF4B2B', '#FF416C']}
                  className="items-center justify-center border-2 border-white/20 overflow-hidden"
                  style={{ width: SIZE, height: SIZE, borderRadius: SIZE / 2 }}
                >
                  {/* Inner Concentric Rings */}
                  <View 
                    className="absolute border border-white/15" 
                    style={{ width: SIZE * 0.85, height: SIZE * 0.85, borderRadius: (SIZE * 0.85) / 2 }} 
                  />
                  <View 
                    className="absolute border border-white/15" 
                    style={{ width: SIZE * 0.7, height: SIZE * 0.7, borderRadius: (SIZE * 0.7) / 2 }} 
                  />
                  
                  <Text 
                    className="text-[48px] font-black text-white tracking-[2px]"
                    style={{
                      textShadowColor: 'rgba(0, 0, 0, 0.3)',
                      textShadowOffset: { width: 0, height: 2 },
                      textShadowRadius: 4,
                    }}
                  >
                    SOS
                  </Text>
                </LinearGradient>
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
  screen: { flex: 1, paddingHorizontal: 24, paddingBottom: 24 },
  // Ambient Glow
  ambientGlow: { position: 'absolute', top: '30%', left: '50%', marginLeft: -200, width: 400, height: 400, borderRadius: 200, backgroundColor: 'rgba(255,51,24,0.04)' },


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