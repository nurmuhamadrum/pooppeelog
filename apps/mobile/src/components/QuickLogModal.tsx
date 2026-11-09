import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  TextInput,
  ScrollView,
  Platform,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { MrPlopIcon, LilDripIcon, SirFlushIcon } from './MascotIcons';
import { useAppStore } from '../store/useAppStore';
import { getCurrentLocationWithAddress } from '../services/location';
import { LogType } from '@poop-pee-log/shared';
import { X, Check, Smile, Sparkles } from 'lucide-react-native';

interface QuickLogModalProps {
  visible: boolean;
  onClose: () => void;
}

export const QuickLogModal: React.FC<QuickLogModalProps> = ({ visible, onClose }) => {
  const addLog = useAppStore((state: any) => state.addLog);
  const blurLocation = useAppStore((state: any) => state.blurLocation);

  const [step, setStep] = useState<'SELECT' | 'MOOD_NOTE'>('SELECT');
  const [selectedType, setSelectedType] = useState<LogType>('PEE');
  const [selectedMood, setSelectedMood] = useState<string>('Lega Banget');
  const [note, setNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleQuickLog = async (type: LogType) => {
    setIsSubmitting(true);
    setSelectedType(type);

    try {
      const loc = await getCurrentLocationWithAddress();
      const now = new Date().toISOString();

      // Logika penentuan koordinat:
      // Hanya buat blurred offset konsisten berdasarkan pembulatan lokasi agar di lokasi yang sama tidak membuat banyak titik terpisah secara acak
      const blurOffsetLat = ((Math.sin(loc.latitude * 1000) * 0.0004));
      const blurOffsetLng = ((Math.cos(loc.longitude * 1000) * 0.0004));

      await addLog({
        type,
        latitude: loc.latitude,
        longitude: loc.longitude,
        altitude: loc.altitude,
        city: loc.city,
        district: loc.district,
        subdistrict: loc.subdistrict,
        country: loc.country,
        mood: type === 'PEE' ? 'Lega Banget' : type === 'POOP' ? 'Plong Sekali' : 'Kombo Sukses 🚽',
        note: '',
        loggedAt: now,
        isBlurred: blurLocation,
        blurredLatitude: blurLocation ? loc.latitude + blurOffsetLat : undefined,
        blurredLongitude: blurLocation ? loc.longitude + blurOffsetLng : undefined,
      });

      setIsSubmitting(false);
      setStep('MOOD_NOTE');
    } catch (error) {
      console.error('Error logging:', error);
      setIsSubmitting(false);
      handleFinish();
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
          {/* Grabber bar */}
          <View style={styles.grabber} />

          {/* STEP 1: PILIHAN CEPAT 2-TAP (PERSIS MOCKUP) */}
          {step === 'SELECT' && (
            <View>
              <View style={styles.headerRow}>
                <View>
                  <Text style={styles.title}>Catat Kelegaan</Text>
                  <Text style={styles.subtitle}>
                    Pilih aksi cepat di bawah. Waktu & GPS terisi otomatis!
                  </Text>
                </View>
                <TouchableOpacity onPress={handleFinish} style={styles.closeBtn}>
                  <X size={18} color={Colors.peachTint} />
                </TouchableOpacity>
              </View>

              {/* 2 LARGE ACTION CARDS (LIL DRIP & MR PLOP) */}
              <View style={styles.gridCards}>
                {/* LIL' DRIP */}
                <TouchableOpacity
                  style={[styles.card, { borderColor: Colors.peeAmber, backgroundColor: 'rgba(245, 183, 0, 0.12)' }]}
                  onPress={() => handleQuickLog('PEE')}
                  activeOpacity={0.85}
                  disabled={isSubmitting}
                >
                  <View style={[styles.avatarCircle, { backgroundColor: Colors.peeAmber }]}>
                    <LilDripIcon size={58} />
                  </View>
                  <Text style={[styles.cardName, { color: Colors.peeAmber }]}>LIL' DRIP</Text>
                  <Text style={styles.cardAction}>PEE (Kencing)</Text>
                </TouchableOpacity>

                {/* MR. PLOP */}
                <TouchableOpacity
                  style={[styles.card, { borderColor: Colors.poopBrown, backgroundColor: 'rgba(139, 94, 60, 0.16)' }]}
                  onPress={() => handleQuickLog('POOP')}
                  activeOpacity={0.85}
                  disabled={isSubmitting}
                >
                  <View style={[styles.avatarCircle, { backgroundColor: Colors.poopBrown }]}>
                    <MrPlopIcon size={58} />
                  </View>
                  <Text style={[styles.cardName, { color: Colors.poopLight }]}>MR. PLOP</Text>
                  <Text style={styles.cardAction}>POOP (BAB)</Text>
                </TouchableOpacity>
              </View>

              {/* SIR FLUSH (FULL WIDTH COMBO) */}
              <TouchableOpacity
                style={styles.comboButton}
                onPress={() => handleQuickLog('COMBO')}
                activeOpacity={0.85}
                disabled={isSubmitting}
              >
                <View style={styles.comboAvatar}>
                  <SirFlushIcon size={36} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.comboTitle}>Sir Flush (Keduanya Sekaligus)</Text>
                  <Text style={styles.comboSubtitle}>
                    Paket kombo kencing & BAB dalam satu waktu
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.cancelBtn} onPress={handleFinish}>
                <Text style={styles.cancelBtnText}>Batal</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* STEP 2: MOOD & NOTE (PERSIS MOCKUP) */}
          {step === 'MOOD_NOTE' && (
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.moodHeader}>
                <View style={styles.avatarMini}>
                  <SirFlushIcon size={34} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.moodTag}>LEGA TERCATAT! ⚡</Text>
                  <Text style={styles.moodQuestion}>Bagaimana Suasana Hatimu?</Text>
                </View>
                <TouchableOpacity onPress={handleFinish}>
                  <Text style={styles.skipText}>Lewati</Text>
                </TouchableOpacity>
              </View>

              {/* Mood Grid */}
              <Text style={styles.labelSection}>Pilih Mood:</Text>
              <View style={styles.moodGrid}>
                {[
                  { text: 'Lega Banget', emoji: '😌', activeBg: 'rgba(47, 184, 172, 0.25)', border: Colors.bothTeal },
                  { text: 'Nahan Lama', emoji: '⏱️', activeBg: 'rgba(245, 183, 0, 0.25)', border: Colors.peeAmber },
                  { text: 'Momen Darurat', emoji: '🚨', activeBg: 'rgba(255, 90, 95, 0.25)', border: Colors.emergencyRed },
                  { text: 'Tragedi Kloset', emoji: '💥', activeBg: 'rgba(201, 138, 88, 0.25)', border: Colors.poopLight },
                ].map((m) => {
                  const isSelected = selectedMood === m.text;
                  return (
                    <TouchableOpacity
                      key={m.text}
                      style={[
                        styles.moodCard,
                        isSelected && {
                          backgroundColor: m.activeBg,
                          borderColor: m.border,
                        },
                      ]}
                      onPress={() => setSelectedMood(m.text)}
                    >
                      <Text style={{ fontSize: 16 }}>{m.emoji}</Text>
                      <Text
                        style={[
                          styles.moodCardText,
                          isSelected && { color: Colors.creamBg, fontWeight: '900' },
                        ]}
                      >
                        {m.text}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Catatan Bebas */}
              <View style={styles.labelRow}>
                <Text style={styles.labelSection}>Catatan Bebas (Opsional):</Text>
                <Text style={styles.charCount}>{note.length}/100</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="cth: Kopi susu di rest area km 57 juara!"
                placeholderTextColor={Colors.darkBorder}
                maxLength={100}
                value={note}
                onChangeText={setNote}
              />

              <TouchableOpacity style={styles.submitBtn} onPress={handleFinish}>
                <Text style={styles.submitBtnText}>Simpan & Buka Buku Harian</Text>
              </TouchableOpacity>
            </ScrollView>
          )}

          {/* Loading Indicator */}
          {isSubmitting && (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color={Colors.peeAmber} />
              <Text style={styles.loadingTxt}>Merekam koordinat & waktu...</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.82)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: Colors.darkSurface,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    padding: 22,
    paddingBottom: Platform.OS === 'ios' ? 44 : 28,
  },
  grabber: {
    width: 48,
    height: 5,
    borderRadius: 3,
    backgroundColor: Colors.darkBorder,
    alignSelf: 'center',
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.creamBg,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.peachTint,
    opacity: 0.75,
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.darkBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridCards: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  card: {
    flex: 1,
    borderRadius: 26,
    borderWidth: 2,
    paddingVertical: 18,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.darkBg,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  cardName: {
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  cardAction: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.peachTint,
    opacity: 0.8,
    marginTop: 2,
  },
  comboButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(47, 184, 172, 0.14)',
    borderWidth: 2,
    borderColor: Colors.bothTeal,
    borderRadius: 22,
    padding: 12,
    paddingHorizontal: 14,
  },
  comboAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.bothTeal,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.darkBg,
  },
  comboTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: Colors.bothTeal,
  },
  comboSubtitle: {
    fontSize: 10,
    color: Colors.peachTint,
    opacity: 0.7,
    marginTop: 2,
  },
  cancelBtn: {
    alignSelf: 'center',
    paddingVertical: 12,
    marginTop: 8,
  },
  cancelBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.peachTint,
    opacity: 0.6,
  },
  moodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  avatarMini: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: Colors.bothTeal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moodTag: {
    fontSize: 10,
    fontWeight: '900',
    color: Colors.bothTeal,
    letterSpacing: 0.8,
  },
  moodQuestion: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.creamBg,
  },
  skipText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.peeAmber,
  },
  labelSection: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.peachTint,
    opacity: 0.8,
    marginBottom: 8,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  moodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '48%',
    backgroundColor: Colors.darkBg,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    borderRadius: 14,
    padding: 12,
  },
  moodCardText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.peachTint,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  charCount: {
    fontSize: 10,
    color: Colors.peachTint,
    opacity: 0.5,
  },
  input: {
    backgroundColor: Colors.darkBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    color: Colors.creamBg,
    padding: 12,
    fontSize: 12,
    marginBottom: 16,
  },
  submitBtn: {
    backgroundColor: Colors.peeAmber,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: Colors.peeAmber,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitBtnText: {
    color: Colors.ink,
    fontSize: 13,
    fontWeight: '900',
  },
  loadingBox: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(30, 26, 23, 0.94)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 36,
  },
  loadingTxt: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: '800',
    color: Colors.creamBg,
  },
});
