import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Contact = {
  id: string;
  name: string;
  relation: string;
  phone: string;
  color: string;
};

type Props = {
  contact: Contact;
  last?: boolean;
};

export default function EmergencyContactCard({ contact, last }: Props) {
  const initials = contact.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <View style={[s.row, last && { borderBottomWidth: 0, paddingBottom: 0, marginBottom: 0 }]}>
      <View style={[s.avatar, { backgroundColor: contact.color }]}>
        <Text style={s.initials}>{initials}</Text>
      </View>
      <View style={s.info}>
        <Text style={s.name}>{contact.name}</Text>
        <Text style={s.relation}>{contact.relation} · {contact.phone}</Text>
      </View>
      <TouchableOpacity style={s.callBtn} activeOpacity={0.7}>
        <Ionicons name="call-outline" size={16} color="#10B981" />
      </TouchableOpacity>
      <TouchableOpacity style={s.moreBtn} activeOpacity={0.7}>
        <Ionicons name="ellipsis-horizontal" size={16} color="#9CA3AF" />
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 14,
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: { fontSize: 13, fontWeight: '800', color: '#FFF' },
  info: { flex: 1 },
  name: { fontSize: 14, fontWeight: '700', color: '#111827', marginBottom: 2 },
  relation: { fontSize: 12, color: '#9CA3AF' },
  callBtn: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: 'rgba(16,185,129,0.08)',
    borderWidth: 1, borderColor: 'rgba(16,185,129,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  moreBtn: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1, borderColor: '#F1F5F9',
    alignItems: 'center', justifyContent: 'center',
  },
});