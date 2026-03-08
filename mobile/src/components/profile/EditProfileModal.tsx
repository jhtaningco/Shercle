import { useState } from 'react';
import {
  View, Text, Modal, StyleSheet, TouchableOpacity,
  ScrollView, TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

type User = {
  name: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  address: string;
};

type Props = {
  visible: boolean;
  user: User;
  onClose: () => void;
};

export default function EditProfileModal({ visible, user, onClose }: Props) {
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [dob, setDob] = useState(user.dob);

  const handleSave = () => {
    // TODO: persist changes
    onClose();
  };

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={s.overlay}
      >
        <View style={s.sheet}>
          {/* Handle */}
          <View style={s.handle} />

          {/* Header */}
          <View style={s.header}>
            <View style={s.headerLeft}>
              <View style={s.headerIcon}>
                <Ionicons name="create-outline" size={18} color="#FF3318" />
              </View>
              <Text style={s.headerTitle}>Edit Profile</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={s.closeBtn} activeOpacity={0.7}>
              <Ionicons name="close" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View style={s.divider} />

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
            <Field label="Full Name" icon="person-outline" value={name} onChangeText={setName} placeholder="Full Name" />
            <Field label="Phone Number" icon="call-outline" value={phone} onChangeText={setPhone} placeholder="Phone" keyboardType="phone-pad" />
            <Field label="Date of Birth" icon="calendar-outline" value={dob} onChangeText={setDob} placeholder="MM/DD/YYYY" />

            <Text style={s.noteText}>Email and address can be updated in Privacy & Security settings.</Text>
          </ScrollView>

          <TouchableOpacity onPress={handleSave} activeOpacity={0.85} style={s.saveBtnWrap}>
            <LinearGradient colors={['#FF6B18', '#FF3318']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.saveBtn}>
              <Text style={s.saveBtnText}>Save Changes</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function Field({ label, icon, value, onChangeText, placeholder, keyboardType }: any) {
  return (
    <View style={f.wrap}>
      <Text style={f.label}>{label}</Text>
      <View style={f.inputRow}>
        <View style={f.iconWrap}>
          <Ionicons name={icon} size={16} color="#FF3318" />
        </View>
        <TextInput
          style={f.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#D1D5DB"
          keyboardType={keyboardType ?? 'default'}
        />
      </View>
    </View>
  );
}

const f = StyleSheet.create({
  wrap: { marginBottom: 16 },
  label: { fontSize: 11, fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 },
  inputRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#F8FAFC', borderRadius: 14,
    borderWidth: 1, borderColor: '#E5E7EB',
    paddingHorizontal: 14, paddingVertical: 12,
  },
  iconWrap: { width: 28, height: 28, borderRadius: 8, backgroundColor: 'rgba(255,51,24,0.07)', borderWidth: 1, borderColor: 'rgba(255,51,24,0.12)', alignItems: 'center', justifyContent: 'center' },
  input: { flex: 1, fontSize: 14.5, fontWeight: '600', color: '#111827' },
});

const s = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.45)' },
  sheet: {
    backgroundColor: '#FFF', borderTopLeftRadius: 28, borderTopRightRadius: 28,
    paddingHorizontal: 24, paddingTop: 12, paddingBottom: 32,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 20,
  },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#E5E7EB', alignSelf: 'center', marginBottom: 16 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,51,24,0.08)', borderWidth: 1, borderColor: 'rgba(255,51,24,0.15)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '900', color: '#111827' },
  closeBtn: { width: 34, height: 34, borderRadius: 10, backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center' },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginBottom: 20 },
  noteText: { fontSize: 12, color: '#9CA3AF', textAlign: 'center', marginTop: 4, lineHeight: 18 },
  saveBtnWrap: { borderRadius: 16, overflow: 'hidden', marginTop: 4 },
  saveBtn: { paddingVertical: 16, alignItems: 'center', justifyContent: 'center' },
  saveBtnText: { fontSize: 16, fontWeight: '800', color: '#FFF', letterSpacing: 0.3 },
});