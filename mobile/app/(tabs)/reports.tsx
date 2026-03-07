import React, { useState } from 'react';
import {
  View, Text, SafeAreaView, StyleSheet, ScrollView,
  TouchableOpacity, Alert, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ReportCard from '@/src/components/reports/ReportCard';
import CreateReportModal from '@/src/components/reports/CreateReportModal';
import ReportDetailModal from '@/src/components/reports/ReportDetailModal';
import { Report, Comment } from '@/src/components/reports/types';

// ─── Seed data ────────────────────────────────────────────────────────────────
const SEED_REPORTS: Report[] = [
  {
    id: '1',
    title: 'Repeated Domestic Violence Incident',
    description: 'Neighbor has been heard shouting and sounds of physical altercation have been occurring nightly. A woman and children are involved.',
    incidentType: 'Domestic Violence',
    location: 'Purok 3, Brgy. San Antonio',
    useCurrentLocation: false,
    date: 'Mar 5, 2026 – 10:30 PM',
    rawDate: new Date('2026-03-05T22:30:00'),
    status: 'pending',
    mediaCount: 0,
    thumbnails: [],
    comments: [
      {
        id: 'c1',
        author: 'Barangay Officer Reyes',
        role: 'barangay',
        message: 'Thank you for reporting. We have dispatched a barangay tanod to the area and will conduct a home visit tomorrow.',
        timestamp: '10:55 PM',
      },
    ],
    icon: 'home-outline',
  },
  {
    id: '2',
    title: 'Elderly Woman Being Neglected',
    description: 'An elderly resident in our area appears to be experiencing neglect by her family. She is often seen without food and has visible wounds.',
    incidentType: 'Elder Abuse',
    location: 'Rizal Street, Brgy. San Antonio',
    useCurrentLocation: false,
    date: 'Mar 1, 2026 – 2:00 PM',
    rawDate: new Date('2026-03-01T14:00:00'),
    status: 'resolved',
    mediaCount: 0,
    thumbnails: [],
    comments: [
      {
        id: 'c2',
        author: 'Barangay Officer Cruz',
        role: 'barangay',
        message: '✅ DSWD has been coordinated. The elderly resident is now under the care of a social worker. Case resolved.',
        timestamp: '9:00 AM',
        isResolveTrigger: true,
      },
    ],
    icon: 'person-outline',
  },
  {
    id: '3',
    title: 'Child Being Harmed by Guardian',
    description: 'A child in our street has been showing up with bruises. Other children say the guardian hits them regularly.',
    incidentType: 'Child Abuse',
    location: 'Mabini St., Brgy. San Antonio',
    useCurrentLocation: false,
    date: 'Mar 7, 2026 – 9:00 AM',
    rawDate: new Date('2026-03-07T09:00:00'),
    status: 'pending',
    mediaCount: 0,
    thumbnails: [],
    comments: [],
    icon: 'happy-outline',
  },
];

// ─── Tabs ─────────────────────────────────────────────────────────────────────
type Tab = 'pending' | 'resolved';

let _idCounter = 100;
function newId() { return String(++_idCounter); }

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function ReportsScreen() {
  const insets = useSafeAreaInsets();
  // Nav bar: bottom: 20 + insets.bottom, height: 70  → FAB must clear that + 16px gap
  const fabBottom = 20 + insets.bottom + 70 + 16;

  const [tab, setTab] = useState<Tab>('pending');
  const [reports, setReports] = useState<Report[]>(SEED_REPORTS);
  const [createVisible, setCreateVisible] = useState(false);
  const [detailReport, setDetailReport] = useState<Report | null>(null);

  const pending  = reports.filter(r => r.status === 'pending');
  const resolved = reports.filter(r => r.status === 'resolved');
  const displayed = tab === 'pending' ? pending : resolved;

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleCreateReport = (data: Omit<Report, 'id' | 'status' | 'comments' | 'mediaCount' | 'thumbnails'>) => {
    const newReport: Report = {
      ...data,
      id: newId(),
      status: 'pending',
      comments: [],
      mediaCount: 0,
      thumbnails: [],
    };
    setReports(prev => [newReport, ...prev]);
    setTab('pending');
  };

  const handleOpenDetail = (report: Report) => {
    setDetailReport(report);
  };

  const handleResolve = (reportId: string) => {
    setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: 'resolved' } : r));
    setDetailReport(prev => prev?.id === reportId ? { ...prev!, status: 'resolved' } : prev);
    setTab('resolved');
  };

  const handleAddComment = (reportId: string, comment: Omit<Comment, 'id'>) => {
    const full: Comment = { ...comment, id: newId() };
    setReports(prev => prev.map(r =>
      r.id === reportId ? { ...r, comments: [...r.comments, full] } : r
    ));
    setDetailReport(prev =>
      prev?.id === reportId ? { ...prev!, comments: [...prev!.comments, full] } : prev
    );
  };

  const handleAddMedia = (reportId: string) => {
    Alert.alert('Add Media', 'Photo/video picker will be implemented here using expo-image-picker.');
  };

  // ── Render ────────────────────────────────────────────────────────────────
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
              <Text style={s.mabuhay}>REPORTS</Text>
              <Text style={s.name}>Incident Log</Text>
            </View>
          </View>
          <TouchableOpacity style={s.notifBtn} activeOpacity={0.7}>
            <Ionicons name="notifications-outline" size={22} color="#111827" />
            <View style={s.notifDot} />
          </TouchableOpacity>
        </View>

        {/* Summary Cards */}
        <View style={s.summaryRow}>
          <View style={[s.summaryCard, { backgroundColor: '#FFFBEB', borderColor: 'rgba(245,158,11,0.2)' }]}>
            <View style={[s.summaryIcon, { backgroundColor: 'rgba(245,158,11,0.12)', borderColor: 'rgba(245,158,11,0.2)' }]}>
              <Ionicons name="time-outline" size={18} color="#F59E0B" />
            </View>
            <Text style={[s.summaryCount, { color: '#D97706' }]}>{pending.length}</Text>
            <Text style={s.summaryLabel}>Pending</Text>
          </View>
          <View style={[s.summaryCard, { backgroundColor: '#ECFDF5', borderColor: 'rgba(16,185,129,0.2)' }]}>
            <View style={[s.summaryIcon, { backgroundColor: 'rgba(16,185,129,0.12)', borderColor: 'rgba(16,185,129,0.2)' }]}>
              <Ionicons name="checkmark-circle-outline" size={18} color="#10B981" />
            </View>
            <Text style={[s.summaryCount, { color: '#059669' }]}>{resolved.length}</Text>
            <Text style={s.summaryLabel}>Resolved</Text>
          </View>
          <View style={[s.summaryCard, { backgroundColor: '#EFF6FF', borderColor: 'rgba(14,165,233,0.2)' }]}>
            <View style={[s.summaryIcon, { backgroundColor: 'rgba(14,165,233,0.12)', borderColor: 'rgba(14,165,233,0.2)' }]}>
              <Ionicons name="document-text-outline" size={18} color="#0ea5e9" />
            </View>
            <Text style={[s.summaryCount, { color: '#0ea5e9' }]}>{reports.length}</Text>
            <Text style={s.summaryLabel}>Total</Text>
          </View>
        </View>

        {/* Tab Bar */}
        <View style={s.tabBar}>
          {(['pending', 'resolved'] as Tab[]).map((t) => {
            const active = tab === t;
            const label  = t === 'pending' ? 'Pending Cases' : 'Resolved Cases';
            const count  = t === 'pending' ? pending.length : resolved.length;
            return (
              <TouchableOpacity
                key={t}
                style={[s.tabItem, active && s.tabItemActive]}
                onPress={() => setTab(t)}
                activeOpacity={0.8}
              >
                {active ? (
                  <LinearGradient
                    colors={t === 'pending' ? ['#FDE68A', '#FCD34D'] : ['#A7F3D0', '#6EE7B7']}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                    style={s.tabGrad}
                  >
                    <Text style={[s.tabText, { color: t === 'pending' ? '#92400E' : '#065F46' }]}>{label}</Text>
                    <View style={[s.tabCount, { backgroundColor: t === 'pending' ? '#F59E0B' : '#10B981' }]}>
                      <Text style={s.tabCountText}>{count}</Text>
                    </View>
                  </LinearGradient>
                ) : (
                  <View style={s.tabInactive}>
                    <Text style={s.tabTextInactive}>{label}</Text>
                    <View style={s.tabCountInactive}>
                      <Text style={s.tabCountTextInactive}>{count}</Text>
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* List */}
        <ScrollView
          style={s.list}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.listContent}
        >
          {displayed.length === 0 ? (
            <View style={s.emptyState}>
              <View style={s.emptyIcon}>
                <Ionicons name={tab === 'pending' ? 'time-outline' : 'checkmark-done-circle-outline'} size={40} color={tab === 'pending' ? '#FCD34D' : '#6EE7B7'} />
              </View>
              <Text style={s.emptyTitle}>{tab === 'pending' ? 'No Pending Reports' : 'No Resolved Reports'}</Text>
              <Text style={s.emptyBody}>
                {tab === 'pending'
                  ? 'You\'re all clear! Tap the + button to submit a new incident report.'
                  : 'Resolved reports will appear here once your pending cases are addressed.'}
              </Text>
            </View>
          ) : (
            displayed.map((report) => (
              <ReportCard key={report.id} report={report} onPress={handleOpenDetail} />
            ))
          )}
        </ScrollView>
      </View>

      {/* FAB — positioned above the floating nav bar */}
      <TouchableOpacity style={[s.fab, { bottom: fabBottom }]} onPress={() => setCreateVisible(true)} activeOpacity={0.85}>
        <LinearGradient colors={['#38BDF8', '#0284C7']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.fabGrad}>
          <Ionicons name="add" size={28} color="#FFF" />
        </LinearGradient>
      </TouchableOpacity>

      {/* Modals */}
      <CreateReportModal
        visible={createVisible}
        onClose={() => setCreateVisible(false)}
        onSubmit={handleCreateReport}
      />
      <ReportDetailModal
        visible={detailReport !== null}
        report={detailReport}
        onClose={() => setDetailReport(null)}
        onResolve={handleResolve}
        onAddComment={handleAddComment}
        onAddMedia={handleAddMedia}
      />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FAFC' },
  screen: { flex: 1, paddingHorizontal: 20 },
  ambientGlow: {
    position: 'absolute', top: '20%', right: -60,
    width: 220, height: 220, borderRadius: 110,
    backgroundColor: 'rgba(14,165,233,0.05)',
  },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 8,
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logo: { width: 46, height: 46 },
  mabuhay: { fontSize: 11, fontWeight: '700', color: '#FF6B18', letterSpacing: 1.5, textTransform: 'uppercase' },
  name: { fontSize: 17, fontWeight: '800', color: '#111827', marginTop: 1 },
  notifBtn: {
    width: 44, height: 44, backgroundColor: '#F3F4F6', borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#E5E7EB',
  },
  notifDot: { position: 'absolute', top: 10, right: 10, width: 8, height: 8, backgroundColor: '#FF3318', borderRadius: 4, borderWidth: 2, borderColor: '#FFF' },

  // Summary
  summaryRow: { flexDirection: 'row', gap: 10, marginBottom: 18 },
  summaryCard: {
    flex: 1, borderRadius: 16, padding: 12, alignItems: 'center', gap: 6,
    borderWidth: 1,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1,
  },
  summaryIcon: {
    width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1,
  },
  summaryCount: { fontSize: 22, fontWeight: '900' },
  summaryLabel: { fontSize: 11, fontWeight: '600', color: '#6B7280', textAlign: 'center' },

  // Tabs
  tabBar: { flexDirection: 'row', backgroundColor: '#F1F5F9', borderRadius: 18, padding: 4, marginBottom: 16, gap: 4 },
  tabItem: { flex: 1, borderRadius: 14, overflow: 'hidden' },
  tabItemActive: {},
  tabGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, gap: 6, borderRadius: 14 },
  tabInactive: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, gap: 6 },
  tabText: { fontSize: 13, fontWeight: '700' },
  tabTextInactive: { fontSize: 13, fontWeight: '600', color: '#6B7280' },
  tabCount: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 8 },
  tabCountText: { fontSize: 11, fontWeight: '800', color: '#FFF' },
  tabCountInactive: { backgroundColor: '#E5E7EB', paddingHorizontal: 7, paddingVertical: 2, borderRadius: 8 },
  tabCountTextInactive: { fontSize: 11, fontWeight: '700', color: '#9CA3AF' },

  // List
  list: { flex: 1 },
  listContent: { paddingBottom: 180 }, // extra room so last card clears FAB + nav bar

  // Empty
  emptyState: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 16, gap: 12 },
  emptyIcon: {
    width: 80, height: 80, borderRadius: 24, backgroundColor: '#FFF',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.07, shadowRadius: 12, elevation: 4,
    borderWidth: 1, borderColor: '#F1F5F9',
  },
  emptyTitle: { fontSize: 17, fontWeight: '800', color: '#111827', textAlign: 'center' },
  emptyBody: { fontSize: 13.5, color: '#6B7280', textAlign: 'center', lineHeight: 21 },

  // FAB — bottom is injected inline so it responds to safe area insets
  fab: {
    position: 'absolute', right: 22,
    shadowColor: '#0ea5e9', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 16, elevation: 10,
    borderRadius: 20, overflow: 'hidden',
  },
  fabGrad: { width: 58, height: 58, alignItems: 'center', justifyContent: 'center', borderRadius: 20 },
});
