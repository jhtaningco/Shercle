import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Report } from './types';

interface ReportCardProps {
  report: Report;
  onPress: (report: Report) => void;
}

export default function ReportCard({ report, onPress }: ReportCardProps) {
  const isPending = report.status === 'pending';
  const statusColor = isPending ? '#F59E0B' : '#10B981';
  const statusBg = isPending ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)';
  const statusBorder = isPending ? 'rgba(245,158,11,0.25)' : 'rgba(16,185,129,0.25)';

  return (
    <TouchableOpacity style={s.card} onPress={() => onPress(report)} activeOpacity={0.75}>
      {/* Top row: type + status badge */}
      <View style={s.topRow}>
        <View style={s.typeWrap}>
          <View style={[s.iconBg, { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }]}>
            <Ionicons name={report.icon as any} size={16} color="#0ea5e9" />
          </View>
          <Text style={s.typeText} numberOfLines={1}>{report.incidentType}</Text>
        </View>
        <View style={[s.badge, { backgroundColor: statusBg, borderColor: statusBorder }]}>
          <View style={[s.badgeDot, { backgroundColor: statusColor }]} />
          <Text style={[s.badgeText, { color: statusColor }]}>
            {isPending ? 'PENDING' : 'RESOLVED'}
          </Text>
        </View>
      </View>

      {/* Title */}
      <Text style={s.title} numberOfLines={2}>{report.title}</Text>

      {/* Location row */}
      <View style={s.metaRow}>
        <Ionicons name="location-outline" size={13} color="#6B7280" />
        <Text style={s.metaText} numberOfLines={1}>{report.location}</Text>
      </View>

      {/* Bottom: date + media count + comment count */}
      <View style={s.footer}>
        <View style={s.footerLeft}>
          <Ionicons name="calendar-outline" size={12} color="#9CA3AF" />
          <Text style={s.footerText}>{report.date}</Text>
        </View>
        <View style={s.footerRight}>
          {report.mediaCount > 0 && (
            <View style={s.chip}>
              <Ionicons name="image-outline" size={12} color="#6B7280" />
              <Text style={s.chipText}>{report.mediaCount}</Text>
            </View>
          )}
          <View style={s.chip}>
            <Ionicons name="chatbubble-outline" size={12} color="#6B7280" />
            <Text style={s.chipText}>{report.comments.length}</Text>
          </View>
        </View>
      </View>

      {/* Thumbnail strip if media */}
      {report.thumbnails && report.thumbnails.length > 0 && (
        <View style={s.thumbRow}>
          {report.thumbnails.slice(0, 3).map((uri, i) => (
            <Image key={i} source={{ uri }} style={s.thumb} />
          ))}
          {report.thumbnails.length > 3 && (
            <View style={s.thumbMore}>
              <Text style={s.thumbMoreText}>+{report.thumbnails.length - 3}</Text>
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  typeWrap: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  iconBg: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  typeText: { fontSize: 12, fontWeight: '700', color: '#0ea5e9', flex: 1 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, borderWidth: 1 },
  badgeDot: { width: 6, height: 6, borderRadius: 3 },
  badgeText: { fontSize: 9, fontWeight: '800', letterSpacing: 1.2 },
  title: { fontSize: 15, fontWeight: '700', color: '#111827', lineHeight: 21 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12.5, color: '#6B7280', flex: 1 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 },
  footerLeft: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  footerText: { fontSize: 11.5, color: '#9CA3AF', fontWeight: '500' },
  footerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: '#F3F4F6', borderRadius: 8, paddingHorizontal: 7, paddingVertical: 3 },
  chipText: { fontSize: 11, color: '#6B7280', fontWeight: '600' },
  thumbRow: { flexDirection: 'row', gap: 6, marginTop: 4 },
  thumb: { width: 60, height: 60, borderRadius: 10, backgroundColor: '#F3F4F6' },
  thumbMore: { width: 60, height: 60, borderRadius: 10, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  thumbMoreText: { fontSize: 13, fontWeight: '700', color: '#6B7280' },
});
