import React, { useState, useRef } from 'react';
import {
  View, Text, Modal, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Dimensions, KeyboardAvoidingView, Platform, Alert, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Report, Comment } from './types';

const { width } = Dimensions.get('window');

// ─── IS_BARANGAY flag – in real app this would come from auth context ─────────
const IS_BARANGAY = false; // Toggle to true to simulate barangay officer view

interface Props {
  report: Report | null;
  visible: boolean;
  onClose: () => void;
  onResolve: (reportId: string) => void;
  onAddComment: (reportId: string, comment: Omit<Comment, 'id'>) => void;
  onAddMedia: (reportId: string) => void;
}

function CommentBubble({ comment }: { comment: Comment }) {
  const isBarangay = comment.role === 'barangay';
  return (
    <View style={[cb.wrap, isBarangay && cb.wrapBarangay]}>
      <View style={[cb.avatar, { backgroundColor: isBarangay ? '#0ea5e9' : '#F3F4F6' }]}>
        <Ionicons name={isBarangay ? 'shield-checkmark' : 'person'} size={14} color={isBarangay ? '#FFF' : '#6B7280'} />
      </View>
      <View style={{ flex: 1, gap: 4 }}>
        <View style={cb.nameRow}>
          <Text style={[cb.name, isBarangay && cb.nameBarangay]}>{comment.author}</Text>
          {isBarangay && (
            <View style={cb.officerBadge}>
              <Text style={cb.officerText}>BARANGAY</Text>
            </View>
          )}
          <Text style={cb.time}>{comment.timestamp}</Text>
        </View>
        <View style={[cb.bubble, isBarangay && cb.bubbleBarangay]}>
          <Text style={[cb.msg, isBarangay && cb.msgBarangay]}>{comment.message}</Text>
        </View>
      </View>
    </View>
  );
}

const cb = StyleSheet.create({
  wrap: { flexDirection: 'row', gap: 10, paddingVertical: 8 },
  wrapBarangay: {},
  avatar: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  name: { fontSize: 12, fontWeight: '700', color: '#374151' },
  nameBarangay: { color: '#0369A1' },
  officerBadge: { backgroundColor: '#EFF6FF', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2, borderWidth: 1, borderColor: '#BFDBFE' },
  officerText: { fontSize: 8, fontWeight: '800', color: '#0ea5e9', letterSpacing: 1 },
  time: { fontSize: 10.5, color: '#9CA3AF', marginLeft: 'auto' },
  bubble: { backgroundColor: '#F3F4F6', borderRadius: 14, borderTopLeftRadius: 4, padding: 10 },
  bubbleBarangay: { backgroundColor: '#EFF6FF', borderTopLeftRadius: 4, borderWidth: 1, borderColor: '#BFDBFE' },
  msg: { fontSize: 13.5, color: '#374151', lineHeight: 20 },
  msgBarangay: { color: '#0369A1' },
});

export default function ReportDetailModal({ report, visible, onClose, onResolve, onAddComment, onAddMedia }: Props) {
  const [commentText, setCommentText] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  if (!report) return null;

  const isPending = report.status === 'pending';
  const statusColor = isPending ? '#F59E0B' : '#10B981';

  const handleSendComment = () => {
    const text = commentText.trim();
    if (!text) return;
    onAddComment(report.id, {
      author: IS_BARANGAY ? 'Barangay Officer' : 'You',
      role: IS_BARANGAY ? 'barangay' : 'user',
      message: text,
      timestamp: new Date().toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' }),
    });
    setCommentText('');
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 200);
  };

  const handleResolve = () => {
    Alert.alert(
      'Mark as Resolved',
      'Are you sure you want to mark this report as resolved?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Resolve',
          style: 'default',
          onPress: () => {
            onAddComment(report.id, {
              author: 'Barangay Officer',
              role: 'barangay',
              message: '✅ This report has been reviewed and marked as resolved by the barangay office.',
              timestamp: new Date().toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' }),
              isResolveTrigger: true,
            });
            onResolve(report.id);
          },
        },
      ]
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={d.overlay}>
        <View style={d.sheet}>
          <View style={d.handle} />

          {/* Header */}
          <View style={d.header}>
            <TouchableOpacity style={d.closeBtn} onPress={onClose}>
              <Ionicons name="chevron-down" size={22} color="#374151" />
            </TouchableOpacity>
            <View style={[d.statusPill, { backgroundColor: isPending ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)', borderColor: isPending ? 'rgba(245,158,11,0.3)' : 'rgba(16,185,129,0.3)' }]}>
              <View style={[d.statusDot, { backgroundColor: statusColor }]} />
              <Text style={[d.statusText, { color: statusColor }]}>{isPending ? 'PENDING' : 'RESOLVED'}</Text>
            </View>
            {IS_BARANGAY && isPending && (
              <TouchableOpacity style={d.resolveBtn} onPress={handleResolve} activeOpacity={0.8}>
                <Ionicons name="checkmark-circle" size={15} color="#FFF" />
                <Text style={d.resolveText}>Resolve</Text>
              </TouchableOpacity>
            )}
          </View>

          <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false} contentContainerStyle={d.body} keyboardShouldPersistTaps="handled">
            {/* Type badge + icon */}
            <View style={d.typeRow}>
              <View style={d.typeIconWrap}>
                <Ionicons name={report.icon as any} size={20} color="#0ea5e9" />
              </View>
              <Text style={d.typeText}>{report.incidentType}</Text>
            </View>

            {/* Title */}
            <Text style={d.title}>{report.title}</Text>

            {/* Meta chips */}
            <View style={d.metaChips}>
              <View style={d.chip}>
                <Ionicons name="location-outline" size={13} color="#0ea5e9" />
                <Text style={d.chipText}>{report.location}</Text>
              </View>
              <View style={d.chip}>
                <Ionicons name="calendar-outline" size={13} color="#0ea5e9" />
                <Text style={d.chipText}>{report.date}</Text>
              </View>
            </View>

            {/* Description */}
            {!!report.description && (
              <View style={d.descWrap}>
                <Text style={d.descLabel}>Description</Text>
                <Text style={d.descText}>{report.description}</Text>
              </View>
            )}

            {/* Media section */}
            <View style={d.mediaSection}>
              <View style={d.mediaSectionHeader}>
                <Text style={d.sectionLabel}>Photos & Videos</Text>
                <TouchableOpacity style={d.addMediaBtn} onPress={() => onAddMedia(report.id)} activeOpacity={0.8}>
                  <Ionicons name="add-circle-outline" size={16} color="#0ea5e9" />
                  <Text style={d.addMediaText}>Add</Text>
                </TouchableOpacity>
              </View>
              {report.thumbnails && report.thumbnails.length > 0 ? (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={d.mediaScroll}>
                  {report.thumbnails.map((uri, i) => (
                    <Image key={i} source={{ uri }} style={d.mediaTile} />
                  ))}
                </ScrollView>
              ) : (
                <TouchableOpacity style={d.mediaEmpty} onPress={() => onAddMedia(report.id)} activeOpacity={0.7}>
                  <Ionicons name="images-outline" size={28} color="#9CA3AF" />
                  <Text style={d.mediaEmptyText}>No media attached yet</Text>
                  <Text style={d.mediaEmptyHint}>Tap to add photos or videos</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Divider */}
            <View style={d.divider} />

            {/* Comments section */}
            <Text style={d.sectionLabel}>
              Discussion <Text style={d.commentCount}>({report.comments.length})</Text>
            </Text>

            {report.comments.length === 0 ? (
              <View style={d.noComments}>
                <Ionicons name="chatbubbles-outline" size={32} color="#D1D5DB" />
                <Text style={d.noCommentsText}>No responses yet</Text>
                <Text style={d.noCommentsHint}>The barangay office will reply here.</Text>
              </View>
            ) : (
              <View style={{ gap: 2 }}>
                {report.comments.map((c) => (
                  <CommentBubble key={c.id} comment={c} />
                ))}
              </View>
            )}

            {/* Barangay-only resolve button at bottom (prominent) */}
            {IS_BARANGAY && isPending && (
              <TouchableOpacity style={d.resolveBlock} onPress={handleResolve} activeOpacity={0.85}>
                <LinearGradient colors={['#34D399', '#10B981']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={d.resolveGrad}>
                  <Ionicons name="checkmark-done-circle-outline" size={20} color="#FFF" />
                  <Text style={d.resolveGradText}>Mark as Resolved</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </ScrollView>

          {/* Comment input */}
          <View style={d.inputBar}>
            <View style={[d.inputWrap, IS_BARANGAY && d.inputWrapBarangay]}>
              {IS_BARANGAY && (
                <View style={d.inputBadge}>
                  <Ionicons name="shield-checkmark" size={12} color="#0ea5e9" />
                </View>
              )}
              <TextInput
                style={d.commentInput}
                value={commentText}
                onChangeText={setCommentText}
                placeholder={IS_BARANGAY ? 'Reply as Barangay Officer...' : 'Write a comment...'}
                placeholderTextColor="#9CA3AF"
                multiline
              />
              <TouchableOpacity
                style={[d.sendBtn, !commentText.trim() && d.sendBtnDisabled]}
                onPress={handleSendComment}
                disabled={!commentText.trim()}
                activeOpacity={0.8}
              >
                <Ionicons name="send" size={16} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const d = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.45)' },
  sheet: { backgroundColor: '#FFF', borderTopLeftRadius: 28, borderTopRightRadius: 28, maxHeight: '95%', flex: 1, marginTop: 60 },
  handle: { width: 40, height: 4, backgroundColor: '#E5E7EB', borderRadius: 2, alignSelf: 'center', marginTop: 12 },

  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, gap: 10 },
  closeBtn: { width: 36, height: 36, backgroundColor: '#F3F4F6', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  statusPill: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, borderWidth: 1 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 9, fontWeight: '800', letterSpacing: 1.2 },
  resolveBtn: { marginLeft: 'auto', flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#10B981', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 7 },
  resolveText: { fontSize: 12.5, fontWeight: '700', color: '#FFF' },

  body: { padding: 20, paddingBottom: 16, gap: 14 },
  typeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  typeIconWrap: { width: 34, height: 34, borderRadius: 10, backgroundColor: '#EFF6FF', borderWidth: 1, borderColor: '#BFDBFE', alignItems: 'center', justifyContent: 'center' },
  typeText: { fontSize: 12, fontWeight: '700', color: '#0ea5e9' },
  title: { fontSize: 20, fontWeight: '900', color: '#111827', lineHeight: 28 },
  metaChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#F0F9FF', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: '#BFDBFE' },
  chipText: { fontSize: 12.5, color: '#0369A1', fontWeight: '600' },

  descWrap: { gap: 6 },
  descLabel: { fontSize: 13, fontWeight: '700', color: '#374151' },
  descText: { fontSize: 14, color: '#4B5563', lineHeight: 22 },

  mediaSection: { gap: 10 },
  mediaSectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  addMediaBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#EFF6FF', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: '#BFDBFE' },
  addMediaText: { fontSize: 12.5, fontWeight: '700', color: '#0ea5e9' },
  mediaScroll: { flexDirection: 'row' },
  mediaTile: { width: 80, height: 80, borderRadius: 12, marginRight: 8, backgroundColor: '#F3F4F6' },
  mediaEmpty: { alignItems: 'center', justifyContent: 'center', gap: 4, backgroundColor: '#FAFAFA', borderRadius: 14, borderWidth: 1.5, borderColor: '#E5E7EB', borderStyle: 'dashed', paddingVertical: 24 },
  mediaEmptyText: { fontSize: 13.5, fontWeight: '600', color: '#9CA3AF' },
  mediaEmptyHint: { fontSize: 12, color: '#CBD5E1' },

  divider: { height: 1, backgroundColor: '#F1F5F9' },
  sectionLabel: { fontSize: 14, fontWeight: '800', color: '#111827' },
  commentCount: { color: '#9CA3AF', fontWeight: '600' },

  noComments: { alignItems: 'center', gap: 6, paddingVertical: 24 },
  noCommentsText: { fontSize: 14, fontWeight: '600', color: '#9CA3AF' },
  noCommentsHint: { fontSize: 12, color: '#D1D5DB' },

  resolveBlock: { borderRadius: 16, overflow: 'hidden', marginTop: 4 },
  resolveGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, gap: 8 },
  resolveGradText: { fontSize: 15, fontWeight: '800', color: '#FFF' },

  inputBar: { paddingHorizontal: 16, paddingVertical: 10, paddingBottom: Platform.OS === 'ios' ? 24 : 12, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  inputWrap: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, backgroundColor: '#F9FAFB', borderRadius: 18, borderWidth: 1.5, borderColor: '#E5E7EB', paddingHorizontal: 12, paddingVertical: 8 },
  inputWrapBarangay: { borderColor: '#BFDBFE', backgroundColor: '#F0F9FF' },
  inputBadge: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#BFDBFE', marginBottom: 2 },
  commentInput: { flex: 1, fontSize: 14, color: '#111827', maxHeight: 100, paddingTop: 0 },
  sendBtn: { width: 36, height: 36, borderRadius: 12, backgroundColor: '#0ea5e9', alignItems: 'center', justifyContent: 'center' },
  sendBtnDisabled: { backgroundColor: '#D1D5DB' },
});
