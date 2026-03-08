import { View, Text, StyleSheet } from 'react-native';

type Props = {
  name: string;
  size?: number;
};

export default function ProfileAvatar({ name, size = 60 }: Props) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const fontSize = size * 0.33;

  return (
    <View style={[s.wrap, { width: size, height: size, borderRadius: size / 2 }]}>
      <View style={[s.inner, { width: size - 4, height: size - 4, borderRadius: (size - 4) / 2 }]}>
        <Text style={[s.initials, { fontSize }]}>{initials}</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    backgroundColor: '#FF3318',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF3318',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  inner: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 1,
  },
});