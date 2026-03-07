import React, { useState } from 'react';
import {
  View, Text, Modal, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Switch, Dimensions, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Report } from './types';

const { width } = Dimensions.get('window');

const INCIDENT_TYPES = [
  { label: 'Domestic Violence', icon: 'home-outline' },
  { label: 'Physical Abuse', icon: 'body-outline' },
  { label: 'Sexual Harassment', icon: 'hand-left-outline' },
  { label: 'Child Abuse', icon: 'happy-outline' },
  { label: 'Elder Abuse', icon: 'person-outline' },
  { label: 'Stalking / Threat', icon: 'eye-outline' },
  { label: 'Psychological Abuse', icon: 'heart-dislike-outline' },
  { label: 'Other', icon: 'ellipsis-horizontal-circle-outline' },
];

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (report: Omit<Report, 'id' | 'status' | 'comments' | 'mediaCount' | 'thumbnails'>) => void;
}

export default function CreateReportModal({ visible, onClose, onSubmit }: Props) {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [otherType, setOtherType] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [dateText, setDateText] = useState(() => {
    const now = new Date();
    return now.toLocaleString('en-PH', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  });

  const reset = () => {
    setStep(1);
    setSelectedType(null);
    setOtherType('');
    setTitle('');
    setDescription('');
    setLocation('');
    setUseCurrentLocation(false);
  };

  const handleClose = () => { reset(); onClose(); };

  const handleNext = () => {
    if (!selectedType) { Alert.alert('Select Incident Type', 'Please choose an incident type.'); return; }
    if (selectedType === 'Other' && !otherType.trim()) { Alert.alert('Specify Incident', 'Please describe the incident type.'); return; }
    setStep(2);
  };

  const handleSubmit = () => {
    if (!title.trim()) { Alert.alert('Add a Title', 'Please enter a report title.'); return; }
    if (!location.trim() && !useCurrentLocation) { Alert.alert('Add a Location', 'Please enter a location or enable current location.'); return; }

    const icon = INCIDENT_TYPES.find(t => t.label === selectedType)?.icon ?? 'ellipsis-horizontal-circle-outline';
    const displayLocation = useCurrentLocation ? 'Current Location (GPS)' : location.trim();
    const now = new Date();

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      incidentType: selectedType === 'Other' ? `Other: ${otherType.trim()}` : selectedType!,
      otherIncidentType: selectedType === 'Other' ? otherType.trim() : undefined,
      location: displayLocation,
      useCurrentLocation,
      date: dateText,
      rawDate: now,
      icon,
    });
    reset();
    onClose();
  };

  const isOther = selectedType === 'Other';

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={s.overlay}>
        <View style={s.sheet}>
          {/* Handle */}
          <View style={s.handle} />

          {/* Header */}
          <View style={s.header}>
            <View>
              <Text style={s.stepLabel}>STEP {step} OF 2</Text>
              <Text style={s.headerTitle}>{step === 1 ? 'Incident Details' : 'Report Information'}</Text>
            </View>
            <TouchableOpacity style={s.closeBtn} onPress={handleClose}>
              <Ionicons name="close" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View style={s.progressBar}>
            <View style={[s.progressFill, { width: step === 1 ? '50%' : '100%' }]} />
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.body} keyboardShouldPersistTaps="handled">
            {step === 1 ? (
              <>
                {/* Incident Type Grid */}
                <Text style={s.sectionLabel}>Incident Type</Text>
                <View style={s.grid}>
                  {INCIDENT_TYPES.map((t) => {
                    const isSel = selectedType === t.label;
                    return (
                      <TouchableOpacity
                        key={t.label}
                        style={[s.typeCard, isSel && s.typeCardActive]}
                        onPress={() => setSelectedType(t.label)}
                        activeOpacity={0.7}
                      >
                        <View style={[s.typeIcon, isSel && s.typeIconActive]}>
                          <Ionicons name={t.icon as any} size={22} color={isSel ? '#FFF' : '#374151'} />
                        </View>
                        <Text style={[s.typeLabel, isSel && s.typeLabelActive]}>{t.label}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Other Specification */}
                {isOther && (
                  <View style={s.inputWrap}>
                    <Text style={s.inputLabel}>Specify Incident Type *</Text>
                    <TextInput
                      style={s.textInput}
                      value={otherType}
                      onChangeText={setOtherType}
                      placeholder="e.g. Illegal dump site, Stray dog..."
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                )}

                {/* Location */}
                <View style={s.inputWrap}>
                  <Text style={s.sectionLabel}>Location</Text>
                  <View style={s.locationRow}>
                    <View style={s.switchRow}>
                      <Ionicons name="locate-outline" size={18} color="#0ea5e9" />
                      <Text style={s.switchLabel}>Use My Current Location</Text>
                      <Switch
                        value={useCurrentLocation}
                        onValueChange={(v) => {
                          setUseCurrentLocation(v);
                          if (v) setLocation('');
                        }}
                        trackColor={{ false: '#E5E7EB', true: '#0ea5e9' }}
                        thumbColor="#FFF"
                        ios_backgroundColor="#E5E7EB"
                      />
                    </View>
                  </View>
                  {!useCurrentLocation && (
                    <TextInput
                      style={[s.textInput, { marginTop: 8 }]}
                      value={location}
                      onChangeText={setLocation}
                      placeholder="Enter street, barangay, or landmark..."
                      placeholderTextColor="#9CA3AF"
                    />
                  )}
                  {useCurrentLocation && (
                    <View style={s.locationTag}>
                      <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                      <Text style={s.locationTagText}>GPS location will be attached</Text>
                    </View>
                  )}
                </View>

                <TouchableOpacity style={s.nextBtn} onPress={handleNext} activeOpacity={0.85}>
                  <LinearGradient colors={['#38BDF8', '#0ea5e9']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.nextGrad}>
                    <Text style={s.nextText}>Continue</Text>
                    <Ionicons name="arrow-forward" size={18} color="#FFF" />
                  </LinearGradient>
                </TouchableOpacity>
              </>
            ) : (
              <>
                {/* Title */}
                <View style={s.inputWrap}>
                  <Text style={s.inputLabel}>Report Title *</Text>
                  <TextInput
                    style={s.textInput}
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Short, descriptive title..."
                    placeholderTextColor="#9CA3AF"
                  />
                </View>

                {/* Description */}
                <View style={s.inputWrap}>
                  <Text style={s.inputLabel}>Description</Text>
                  <TextInput
                    style={[s.textInput, s.textArea]}
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Describe what happened in detail..."
                    placeholderTextColor="#9CA3AF"
                    multiline
                    numberOfLines={5}
                    textAlignVertical="top"
                  />
                </View>

                {/* Date & Time */}
                <View style={s.inputWrap}>
                  <Text style={s.inputLabel}>Date & Time</Text>
                  <View style={s.dateDisplay}>
                    <Ionicons name="calendar-outline" size={16} color="#0ea5e9" />
                    <Text style={s.dateText}>{dateText}</Text>
                  </View>
                </View>

                {/* Media note */}
                <View style={s.mediaBanner}>
                  <Ionicons name="images-outline" size={20} color="#7C3AED" />
                  <View style={{ flex: 1 }}>
                    <Text style={s.mediaBannerTitle}>Add Photos / Videos</Text>
                    <Text style={s.mediaBannerSub}>You can attach media after submitting from the report detail.</Text>
                  </View>
                  <Ionicons name="information-circle-outline" size={16} color="#9CA3AF" />
                </View>

                <View style={s.actionRow}>
                  <TouchableOpacity style={s.backBtn} onPress={() => setStep(1)} activeOpacity={0.8}>
                    <Ionicons name="arrow-back" size={18} color="#374151" />
                    <Text style={s.backText}>Back</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={s.submitWrap} onPress={handleSubmit} activeOpacity={0.85}>
                    <LinearGradient colors={['#38BDF8', '#0ea5e9']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.nextGrad}>
                      <Ionicons name="paper-plane-outline" size={17} color="#FFF" />
                      <Text style={s.nextText}>Submit Report</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.45)' },
  sheet: { backgroundColor: '#FFF', borderTopLeftRadius: 28, borderTopRightRadius: 28, maxHeight: '94%' },
  handle: { width: 40, height: 4, backgroundColor: '#E5E7EB', borderRadius: 2, alignSelf: 'center', marginTop: 12, marginBottom: 4 },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14 },
  stepLabel: { fontSize: 10, fontWeight: '800', color: '#0ea5e9', letterSpacing: 2, marginBottom: 2 },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#111827' },
  closeBtn: { width: 36, height: 36, backgroundColor: '#F3F4F6', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },

  progressBar: { height: 3, backgroundColor: '#E5E7EB', marginHorizontal: 20, borderRadius: 2, marginBottom: 4 },
  progressFill: { height: 3, backgroundColor: '#0ea5e9', borderRadius: 2 },

  body: { padding: 20, paddingBottom: 48, gap: 16 },
  sectionLabel: { fontSize: 13, fontWeight: '700', color: '#374151', marginBottom: 10, letterSpacing: 0.3 },
  inputLabel: { fontSize: 13, fontWeight: '700', color: '#374151', marginBottom: 8, letterSpacing: 0.3 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  typeCard: {
    width: (width - 60) / 4 - 8,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#FAFAFA',
    gap: 6,
  },
  typeCardActive: { borderColor: '#0ea5e9', backgroundColor: '#EFF6FF' },
  typeIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  typeIconActive: { backgroundColor: '#0ea5e9' },
  typeLabel: { fontSize: 11, fontWeight: '600', color: '#6B7280', textAlign: 'center' },
  typeLabelActive: { color: '#0ea5e9' },

  inputWrap: { gap: 0 },
  textInput: {
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14.5,
    color: '#111827',
    backgroundColor: '#FAFAFA',
  },
  textArea: { minHeight: 110, paddingTop: 12 },

  locationRow: { marginBottom: 0 },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#F0F9FF', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#BFDBFE' },
  switchLabel: { flex: 1, fontSize: 13.5, fontWeight: '600', color: '#374151' },
  locationTag: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8, backgroundColor: '#ECFDF5', borderRadius: 10, padding: 10, borderWidth: 1, borderColor: '#A7F3D0' },
  locationTagText: { fontSize: 13, color: '#059669', fontWeight: '600' },

  dateDisplay: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#F0F9FF', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#BFDBFE' },
  dateText: { fontSize: 14, color: '#0369A1', fontWeight: '600' },

  mediaBanner: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#F5F3FF', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#DDD6FE' },
  mediaBannerTitle: { fontSize: 13.5, fontWeight: '700', color: '#5B21B6', marginBottom: 2 },
  mediaBannerSub: { fontSize: 11.5, color: '#7C3AED', lineHeight: 16 },

  nextBtn: { marginTop: 4, borderRadius: 16, overflow: 'hidden' },
  nextGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 15, gap: 8 },
  nextText: { fontSize: 15.5, fontWeight: '800', color: '#FFF', letterSpacing: 0.3 },

  actionRow: { flexDirection: 'row', gap: 12, marginTop: 4 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 15, paddingHorizontal: 18, borderRadius: 16, borderWidth: 1.5, borderColor: '#E5E7EB', backgroundColor: '#F9FAFB' },
  backText: { fontSize: 14.5, fontWeight: '700', color: '#374151' },
  submitWrap: { flex: 1, borderRadius: 16, overflow: 'hidden' },
});
