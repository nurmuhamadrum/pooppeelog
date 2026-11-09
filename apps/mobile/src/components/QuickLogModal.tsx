import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { MrPlopIcon, LilDripIcon, SirFlushIcon } from './MascotIcons';
import { useAppStore } from '../store/useAppStore';
import { getCurrentLocationWithAddress } from '../services/location';
import { LogType, MoodPee, MoodPoop } from '@poop-pee-log/shared';
import { X, Check } from 'lucide-react-native';

interface QuickLogModalProps {
  visible: boolean;
  onClose: () => void;
}

export const QuickLogModal: React.FC<QuickLogModalProps> = ({ visible, onClose }) => {
  const addLog = useAppStore((state: any) => state.addLog);
  const blurLocation = useAppStore((state: any) => state.blurLocation);

  const [step, setStep] = useState<'SELECT' | 'MOOD_NOTE' | 'SAVED'>('SELECT');
  const [selectedType, setSelectedType] = useState<LogType>('PEE');
  const [selectedMood, setSelectedMood] = useState<string>('LEGA');
  const [note, setNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleQuickLog = async (type: LogType) => {
    setIsSubmitting(true);
    setSelectedType(type);

    try {
      // 1. Ambil GPS & geocode di latar belakang (< 500ms)
      const loc = await getCurrentLocationWithAddress();
      const now = new Date().toISOString();

      // Perhitungan blur 50 meter jika diaktifkan (mengacak offset ~0.00045 derajat)
      const randomOffsetLat = (Math.random() - 0.5) * 0.0009;
      const randomOffsetLng = (Math.random() - 0.5) * 0.0009;

      const createdLog = await addLog({
        type,
        latitude: loc.latitude,
        longitude: loc.longitude,
        altitude: loc.altitude,
        city: loc.city,
        district: loc.district,
        subdistrict: loc.subdistrict,
        country: loc.country,
        mood: type === 'PEE' ? 'LEGA' : 'LEGA_BANGET',
        note: '',
        loggedAt: now,
        isBlurred: blurLocation,
        blurredLatitude: blurLocation ? loc.latitude + randomOffsetLat : undefined,
        blurredLongitude: blurLocation ? loc.longitude + randomOffsetLng : undefined,
      });

      setIsSubmitting(false);
      // Pindah ke step opsi mood & catatan (bisa langsung ditutup jika tidak mau diisi)
      setStep('MOOD_NOTE');
    } catch (error) {
      console.error('Error logging:', error);
      setIsSubmitting(false);
      onClose();
    }
  };

  const handleFinish = () => {
    setStep('SELECT');
    setNote('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleFinish}>
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          {/* Header Bar */}
          <View style={styles.header}>
            <View>
              <Text style={styles.sheetTitle}>
                {step === 'SELECT' ? 'Catat Kelegaan ⚡' : 'Mood & Cerita (Opsional)'}
              </Text>
              <Text style={styles.sheetSubtitle}>
                {step === 'SELECT' ? '2-Ketukan Cepat • Maksimal 3 Detik' : 'Bisa langsung ditutup bila buru-buru'}
              </Text>
            </View>
            <TouchableOpacity onPress={handleFinish} style={styles.closeBtn}>
              <X size={20} color={Colors.creamBg} />
            </TouchableOpacity>
          </View>

          {/* STEP 1: PILIHAN CEPAT 2-TAP */}
          {step === 'SELECT' && (
            <View style={styles.optionsContainer}>
              {/* Lil' Drip (Kencing) */}
              <TouchableOpacity
                style={[styles.mascotCard, { borderColor: Colors.peeAmber }]}
                onPress={() => handleQuickLog('PEE')}
                disabled={isSubmitting}
                activeOpacity={0.8}
              >
                <View style={[styles.iconCircle, { backgroundColor: Colors.peeAmber }]}>
                  <LilDripIcon size={52} />
                </View>
                <Text style={styles.cardTitle}>Lil' Drip</Text>
                <Text style={styles.cardSubtitle}>Kencing (Pee)</Text>
                <View style={[styles.badgePill, { backgroundColor: 'rgba(245, 183, 0, 0.2)' }]}>
                  <Text style={[styles.badgeText, { color: Colors.peeAmber }]}>Kuning Segar</Text>
                </View>
              </TouchableOpacity>

              {/* Mr. Plop (BAB) */}
              <TouchableOpacity
                style={[styles.mascotCard, { borderColor: Colors.poopLight }]}
                onPress={() => handleQuickLog('POOP')}
                disabled={isSubmitting}
                activeOpacity={0.8}
              >
                <View style={[styles.iconCircle, { backgroundColor: Colors.poopBrown }]}>
                  <MrPlopIcon size={52} />
                </View>
                <Text style={styles.cardTitle}>Mr. Plop</Text>
                <Text style={styles.cardSubtitle}>BAB (Poop)</Text>
                <View style={[styles.badgePill, { backgroundColor: 'rgba(201, 138, 88, 0.2)' }]}>
                  <Text style={[styles.badgeText, { color: Colors.poopLight }]}>Plong Maksimal</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}

          {/* STEP 2: MOOD & NOTE (OPSIONAL) */}
          {step === 'MOOD_NOTE' && (
            <View style={styles.moodContainer}>
              <Text style={styles.sectionLabel}>Level Kelegaan:</Text>
              <View style={styles.moodPillsRow}>
                {selectedType === 'PEE' ? (
                  <>
                    <TouchableOpacity
                      style={[styles.moodPill, selectedMood === 'LEGA' && styles.moodPillActive]}
                      onPress={() => setSelectedMood('LEGA')}
                    >
                      <Text style={styles.moodText}>Lega Banget 😊</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.moodPill, selectedMood === 'NAHAN_LAMA' && styles.moodPillActive]}
                      onPress={() => setSelectedMood('NAHAN_LAMA')}
                    >
                      <Text style={styles.moodText}>Nahan Lama 🏃</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.moodPill, selectedMood === 'DARURAT' && styles.moodPillActive]}
                      onPress={() => setSelectedMood('DARURAT')}
                    >
                      <Text style={styles.moodText}>Darurat! 🚨</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <TouchableOpacity
                      style={[styles.moodPill, selectedMood === 'LEGA_BANGET' && styles.moodPillActive]}
                      onPress={() => setSelectedMood('LEGA_BANGET')}
                    >
                      <Text style={styles.moodText}>Plong Sekali 🍫</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.moodPill, selectedMood === 'BIASA_AJA' && styles.moodPillActive]}
                      onPress={() => setSelectedMood('BIASA_AJA')}
                    >
                      <Text style={styles.moodText}>Biasa Saja 👍</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.moodPill, selectedMood === 'MASIH_GANJEL' && styles.moodPillActive]}
                      onPress={() => setSelectedMood('MASIH_GANJEL')}
                    >
                      <Text style={styles.moodText}>Masih Ganjel 🤔</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>

              <Text style={[styles.sectionLabel, { marginTop: 16 }]}>Catatan Singkat (Maks 100 karakter):</Text>
              <TextInput
                style={styles.inputNote}
                placeholder="cth: Di rest area km 57, airnya bersih..."
                placeholderTextColor={Colors.darkBorder}
                maxLength={100}
                value={note}
                onChangeText={setNote}
              />

              <TouchableOpacity style={styles.saveBtn} onPress={handleFinish}>
                <Check size={18} color="#000" />
                <Text style={styles.saveBtnText}>Selesai & Tutup</Text>
              </TouchableOpacity>
            </View>
          )}

          {isSubmitting && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color={Colors.peeAmber} />
              <Text style={styles.loadingText}>Menyimpan ke SQLite lokal...</Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: Colors.darkBg,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    padding: 24,
    paddingBottom: 40,
    minHeight: 340,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.creamBg,
  },
  sheetSubtitle: {
    fontSize: 12,
    color: Colors.peachTint,
    opacity: 0.7,
    marginTop: 2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.darkSurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'space-between',
  },
  mascotCard: {
    flex: 1,
    backgroundColor: Colors.darkSurface,
    borderRadius: 24,
    borderWidth: 2,
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.creamBg,
  },
  cardSubtitle: {
    fontSize: 12,
    color: Colors.peachTint,
    opacity: 0.8,
    marginTop: 2,
  },
  badgePill: {
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  moodContainer: {
    paddingTop: 4,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.peachTint,
    marginBottom: 8,
  },
  moodPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  moodPill: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: Colors.darkSurface,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
  },
  moodPillActive: {
    backgroundColor: 'rgba(245, 183, 0, 0.2)',
    borderColor: Colors.peeAmber,
  },
  moodText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.creamBg,
  },
  inputNote: {
    backgroundColor: Colors.darkSurface,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    borderRadius: 16,
    padding: 12,
    color: Colors.creamBg,
    fontSize: 13,
  },
  saveBtn: {
    marginTop: 20,
    backgroundColor: Colors.peeAmber,
    borderRadius: 18,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  saveBtnText: {
    color: '#000',
    fontWeight: '900',
    fontSize: 14,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(30, 26, 23, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 32,
  },
  loadingText: {
    color: Colors.creamBg,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 10,
  },
});
