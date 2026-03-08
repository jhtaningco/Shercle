import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  title: string;
  icon: any;
  children: React.ReactNode;
};

export default function ProfileInfoCard({ title, icon, children }: Props) {
  return (
    <View style={s.wrap}>
      <View style={s.header}>
        <View style={s.iconWrap}>
          <Ionicons name={icon} size={16} color="#FF3318" />
        </View>
        <Text style={s.title}>{title}</Text>
      </View>
      <View style={s.body}>{children}</View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(255,51,24,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,51,24,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 15, fontWeight: '800', color: '#111827' },
  body: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 16 },
});