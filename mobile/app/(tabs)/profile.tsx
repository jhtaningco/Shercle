import { useState } from 'react';
import {
  View, Text, SafeAreaView, ScrollView, StyleSheet,
  TouchableOpacity, Image, Switch, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import ProfileAvatar from '@/src/components/profile/ProfileAvatar';
import ProfileInfoCard from '@/src/components/profile/ProfileInfoCard';
import EmergencyContactCard from '@/src/components/profile/EmergencyContactCard';
import EditProfileModal from '@/src/components/profile/EditProfileModal';

// ─── Mock Data ────────────────────────────────────────────────────────────────
const USER = {
  name: 'Maria Santos',
  email: 'maria.santos@email.com',
  phone: '+63 912 345 6789',
  dob: 'March 12, 1992',
  gender: 'Female',
  address: 'Purok 3, Brgy. San Antonio, Quezon City, 1100',
  memberSince: 'January 2024',
  reportsSubmitted: 7,
  resolvedCases: 5,
};

const EMERGENCY_CONTACTS = [
  { id: '1', name: 'Jose Santos', relation: 'Spouse', phone: '+63 917 111 2222', color: '#4ECDC4' },
  { id: '2', name: 'Lita Reyes', relation: 'Mother', phone: '+63 918 333 4444', color: '#FF6B6B' },
  { id: '3', name: 'Pedro Santos', relation: 'Brother', phone: '+63 919 555 6666', color: '#45B7D1' },
];

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const bottomPad = 120 + insets.bottom;

  const [notifEnabled, setNotifEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [editVisible, setEditVisible] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log Out', style: 'destructive', onPress: () => router.replace('/') },
      ]
    );
  };

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.screen}>
        {/* Ambient glow */}
        <View style={s.ambientGlow} />

        {/* Header */}
        <View style={s.header}>
          <View style={s.logoRow}>
            <Image source={require('../../assets/images/logos/logo-main.png')} style={s.logo} resizeMode="contain" />
            <View>
              <Text style={s.eyebrow}>PROFILE</Text>
              <Text style={s.headerTitle}>My Account</Text>
            </View>
          </View>
          <TouchableOpacity style={s.notifBtn} activeOpacity={0.7}>
            <Ionicons name="notifications-outline" size={22} color="#111827" />
            <View style={s.notifDot} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={s.scroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: bottomPad }}
        >
          {/* ── Avatar + Stats Banner ── */}
          <LinearGradient
            colors={['#FFECEA', '#FFF4F2', '#FFFFFF']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={s.bannerCard}
          >
            <View style={s.bannerGrad}>
              <ProfileAvatar name={USER.name} size={76} />

              <View style={s.bannerInfo}>
                <Text style={s.bannerName}>{USER.name}</Text>
                <Text style={s.bannerSub}>Member since {USER.memberSince}</Text>

                <View style={s.statsRow}>
                  <View style={s.statItem}>
                    <Text style={s.statCount}>{USER.reportsSubmitted}</Text>
                    <Text style={s.statLabel}>Reports</Text>
                  </View>
                  <View style={s.statDivider} />
                  <View style={s.statItem}>
                    <Text style={[s.statCount, { color: '#10B981' }]}>{USER.resolvedCases}</Text>
                    <Text style={s.statLabel}>Resolved</Text>
                  </View>
                  <View style={s.statDivider} />
                  <View style={s.statItem}>
                    <Text style={[s.statCount, { color: '#0ea5e9' }]}>{EMERGENCY_CONTACTS.length}</Text>
                    <Text style={s.statLabel}>Circle</Text>
                  </View>
                </View>
              </View>
            </View>

            <TouchableOpacity style={s.editBtn} onPress={() => setEditVisible(true)} activeOpacity={0.7}>
              <Ionicons name="pencil-outline" size={15} color="#FF3318" />
              <Text style={s.editBtnText}>Edit</Text>
            </TouchableOpacity>
          </LinearGradient>

          {/* ── Personal Information ── */}
          <ProfileInfoCard title="Personal Information" icon="person-outline">
            <InfoRow icon="mail-outline" label="Email" value={USER.email} />
            <InfoRow icon="call-outline" label="Phone" value={USER.phone} />
            <InfoRow icon="calendar-outline" label="Date of Birth" value={USER.dob} />
            <InfoRow icon="male-female-outline" label="Gender" value={USER.gender} last />
          </ProfileInfoCard>

          {/* ── Address ── */}
          <ProfileInfoCard title="Address" icon="location-outline">
            <InfoRow icon="home-outline" label="Home Address" value={USER.address} last />
          </ProfileInfoCard>

          {/* ── Emergency Contacts ── */}
          <View style={s.contactCard}>
            {/* Card header — matches ProfileInfoCard style */}
            <View style={s.contactCardHeader}>
              <View style={s.sectionIconWrap}>
                <Ionicons name="people-outline" size={16} color="#FF3318" />
              </View>
              <Text style={s.sectionTitle}>Circle of Care</Text>
              <TouchableOpacity style={s.addBtn} activeOpacity={0.7}>
                <Ionicons name="add" size={16} color="#FF3318" />
                <Text style={s.addBtnText}>Add</Text>
              </TouchableOpacity>
            </View>
            <View style={s.contactCardBody}>
              {EMERGENCY_CONTACTS.map((contact, i) => (
                <EmergencyContactCard
                  key={contact.id}
                  contact={contact}
                  last={i === EMERGENCY_CONTACTS.length - 1}
                />
              ))}
            </View>
          </View>

          {/* ── Preferences ── */}
          <ProfileInfoCard title="Preferences" icon="settings-outline">
            <ToggleRow
              icon="notifications-outline"
              label="Push Notifications"
              sub="Alerts and updates"
              value={notifEnabled}
              onValueChange={setNotifEnabled}
            />
            <View style={s.innerDivider} />
            <ToggleRow
              icon="location-outline"
              label="Share Location"
              sub="During SOS alerts"
              value={locationEnabled}
              onValueChange={setLocationEnabled}
              last
            />
          </ProfileInfoCard>

          {/* ── Account Actions ── */}
          <View style={s.actionList}>
            <TouchableOpacity style={s.actionRow} activeOpacity={0.7}>
              <View style={[s.actionIcon, { backgroundColor: 'rgba(14,165,233,0.08)', borderColor: 'rgba(14,165,233,0.15)' }]}>
                <Ionicons name="shield-checkmark-outline" size={18} color="#0ea5e9" />
              </View>
              <Text style={s.actionLabel}>Privacy & Security</Text>
              <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
            </TouchableOpacity>

            <View style={s.innerDivider} />

            <TouchableOpacity style={s.actionRow} activeOpacity={0.7}>
              <View style={[s.actionIcon, { backgroundColor: 'rgba(139,92,246,0.08)', borderColor: 'rgba(139,92,246,0.15)' }]}>
                <Ionicons name="help-circle-outline" size={18} color="#8B5CF6" />
              </View>
              <Text style={s.actionLabel}>Help & Support</Text>
              <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
            </TouchableOpacity>

            <View style={s.innerDivider} />

            <TouchableOpacity style={s.actionRow} activeOpacity={0.7} onPress={handleLogout}>
              <View style={[s.actionIcon, { backgroundColor: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.15)' }]}>
                <Ionicons name="log-out-outline" size={18} color="#EF4444" />
              </View>
              <Text style={[s.actionLabel, { color: '#EF4444' }]}>Log Out</Text>
              <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          <Text style={s.versionText}>Ligtas v1.0.0</Text>
        </ScrollView>
      </View>

      <EditProfileModal visible={editVisible} user={USER} onClose={() => setEditVisible(false)} />
    </SafeAreaView>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function InfoRow({ icon, label, value, last }: { icon: any; label: string; value: string; last?: boolean }) {
  return (
    <View style={[s.infoRow, last && { borderBottomWidth: 0, paddingBottom: 0, marginBottom: 0 }]}>
      <View style={s.infoIconWrap}>
        <Ionicons name={icon} size={15} color="#FF3318" />
      </View>
      <View style={s.infoContent}>
        <Text style={s.infoLabel}>{label}</Text>
        <Text style={s.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

function ToggleRow({ icon, label, sub, value, onValueChange, last }: {
  icon: any; label: string; sub: string; value: boolean; onValueChange: (v: boolean) => void; last?: boolean;
}) {
  return (
    <View style={[s.infoRow, last && { borderBottomWidth: 0, paddingBottom: 0, marginBottom: 0 }]}>
      <View style={s.infoIconWrap}>
        <Ionicons name={icon} size={15} color="#FF3318" />
      </View>
      <View style={s.infoContent}>
        <Text style={s.infoLabel}>{label}</Text>
        <Text style={s.infoSubLabel}>{sub}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#E5E7EB', true: '#FF3318' }}
        thumbColor="#FFF"
        ios_backgroundColor="#E5E7EB"
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FAFC' },
  screen: { flex: 1, paddingHorizontal: 20 },
  scroll: { flex: 1 },
  ambientGlow: {
    position: 'absolute', top: '15%', left: -80,
    width: 260, height: 260, borderRadius: 130,
    backgroundColor: 'rgba(255,51,24,0.04)',
  },

  // Header
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logo: { width: 46, height: 46 },
  eyebrow: { fontSize: 11, fontWeight: '700', color: '#FF6B18', letterSpacing: 1.5, textTransform: 'uppercase' },
  headerTitle: { fontSize: 17, fontWeight: '800', color: '#111827', marginTop: 1 },
  notifBtn: { width: 44, height: 44, backgroundColor: '#F3F4F6', borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#E5E7EB' },
  notifDot: { position: 'absolute', top: 10, right: 10, width: 8, height: 8, backgroundColor: '#FF3318', borderRadius: 4, borderWidth: 2, borderColor: '#FFF' },

  // Banner Card
  bannerCard: {
    borderRadius: 20, marginTop: 12, marginBottom: 16,
    shadowColor: '#FF3318', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 16, elevation: 4,
    borderWidth: 1, borderColor: 'rgba(255,51,24,0.12)', overflow: 'hidden',
  },
  bannerGrad: { flexDirection: 'row', alignItems: 'center', gap: 16, padding: 20 },
  bannerInfo: { flex: 1 },
  bannerName: { fontSize: 18, fontWeight: '900', color: '#111827', marginBottom: 2 },
  bannerSub: { fontSize: 12, color: '#9CA3AF', marginBottom: 12 },
  statsRow: { flexDirection: 'row', alignItems: 'center', gap: 0 },
  statItem: { alignItems: 'center', paddingHorizontal: 12 },
  statCount: { fontSize: 18, fontWeight: '900', color: '#FF3318' },
  statLabel: { fontSize: 10, fontWeight: '600', color: '#9CA3AF', marginTop: 1 },
  statDivider: { width: 1, height: 28, backgroundColor: '#F1F5F9' },
  editBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-end',
    marginRight: 16, marginBottom: 14, paddingHorizontal: 14, paddingVertical: 7,
    backgroundColor: '#FFE9E6',
    borderRadius: 20,
    borderWidth: 1, borderColor: 'rgba(255,51,24,0.25)',
  },
  editBtnText: { fontSize: 12, fontWeight: '700', color: '#FF3318' },

  // Info rows (inside cards)
  infoRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingBottom: 14, marginBottom: 14,
    borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
  },
  infoIconWrap: {
    width: 32, height: 32, borderRadius: 9,
    backgroundColor: 'rgba(255,51,24,0.07)', borderWidth: 1, borderColor: 'rgba(255,51,24,0.12)',
    alignItems: 'center', justifyContent: 'center',
  },
  infoContent: { flex: 1 },
  infoLabel: { fontSize: 11, fontWeight: '600', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 2 },
  infoValue: { fontSize: 14, fontWeight: '600', color: '#111827' },
  infoSubLabel: { fontSize: 12, color: '#9CA3AF', marginTop: 1 },

  sectionIconWrap: { width: 28, height: 28, borderRadius: 8, backgroundColor: 'rgba(255,51,24,0.08)', borderWidth: 1, borderColor: 'rgba(255,51,24,0.12)', alignItems: 'center', justifyContent: 'center' },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: '#111827', flex: 1 },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 10, paddingVertical: 5, backgroundColor: 'rgba(255,51,24,0.07)', borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,51,24,0.15)' },
  addBtnText: { fontSize: 12, fontWeight: '700', color: '#FF3318' },

  // Circle of Care card
  contactCard: {
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
  contactCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  contactCardBody: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 16,
  },

  // Action list
  actionList: {
    backgroundColor: '#FFF', borderRadius: 20, marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 12, elevation: 3,
    borderWidth: 1, borderColor: '#F1F5F9',
    paddingHorizontal: 16, paddingVertical: 16,
  },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  actionIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  actionLabel: { flex: 1, fontSize: 14.5, fontWeight: '600', color: '#374151' },
  innerDivider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 14 },

  versionText: { textAlign: 'center', fontSize: 11, color: '#D1D5DB', marginBottom: 8, letterSpacing: 0.5 },
});