import React, { useState, useEffect, useRef } from 'react';
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
  Animated,
  Easing,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { MrPlopIcon, LilDripIcon, SirFlushIcon } from './MascotIcons';
import { useAppStore } from '../store/useAppStore';
import { getCurrentLocationWithAddress } from '../services/location';
import { useToast } from '../context/ToastContext';
import { useMobileI18n } from '../i18n/translations';
import { LogType } from '@poop-pee-log/shared';
import { X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface QuickLogModalProps {
  visible: boolean;
  onClose: () => void;
}

export const QuickLogModal: React.FC<QuickLogModalProps> = ({ visible, onClose }) => {
  const router = useRouter();
  const { showToast } = useToast();
  const { t } = useMobileI18n();
  const addLog = useAppStore((state: any) => state.addLog);
  const updateLogMoodAndNote = useAppStore((state: any) => state.updateLogMoodAndNote);

  const [step, setStep] = useState<'SELECT' | 'MOOD_NOTE'>('SELECT');
  const [currentCreatedLogId, setCurrentCreatedLogId] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<LogType>('PEE');
  const [selectedMood, setSelectedMood] = useState<string>('Lega Banget');
  const [note, setNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Popup & sheet animations
  const slideAnim = useRef(new Animated.Value(300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 8,
          tension: 65,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 7,
          tension: 70,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      slideAnim.setValue(300);
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.92);
    }
  }, [visible]);

  const handleQuickLog = async (type: LogType) => {
    // Memberikan haptic feedback responsif instan
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setIsSubmitting(true);
    setSelectedType(type);

    const defaultMood =
      type === 'PEE' ? 'Lega Banget' : type === 'POOP' ? 'Plong Sekali' : 'Kombo Sukses';
    setSelectedMood(defaultMood);

    try {
      const loc = await getCurrentLocationWithAddress();
      const now = new Date().toISOString();

      // Koordinat presisi asli (blur 50m dihilangkan agar akurat di 1 titik)
      const createdLog = await addLog({
        type,
        latitude: loc.latitude,
        longitude: loc.longitude,
        altitude: loc.altitude,
        city: loc.city,
        district: loc.district,
        subdistrict: loc.subdistrict,
        country: loc.country,
        mood: defaultMood,
        note: '',
        loggedAt: now,
        isBlurred: false,
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      setCurrentCreatedLogId(createdLog.id);
      setIsSubmitting(false);

      const typeLabel =
        type === 'PEE' ? "Lil' Drip (Pee)" : type === 'POOP' ? 'Mr. Plop (Poop)' : 'Sir Flush (Combo)';
      showToast({
        message: t.quickLog.toastLogged(typeLabel),
        type: 'success',
      });

      setStep('MOOD_NOTE');
    } catch (error) {
      console.error('Error logging:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
      setIsSubmitting(false);
      showToast({
        message: t.quickLog.toastFailed,
        type: 'error',
      });
      handleFinish();
    }
  };

  const handleSaveMoodAndNote = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    if (currentCreatedLogId) {
      await updateLogMoodAndNote(currentCreatedLogId, selectedMood, note);
    }
    showToast({
      message: t.quickLog.toastSaved,
      type: 'success',
    });
    handleFinish();
    // Navigasi langsung ke tab Diary (/timeline)
    setTimeout(() => {
      router.push('/(tabs)/timeline');
    }, 150);
  };

  const handleFinish = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 350,
        duration: 200,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setStep('SELECT');
      setNote('');
      setCurrentCreatedLogId(null);
      onClose();
    });
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleFinish}>
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <Animated.View
          style={[
            styles.sheetContainer,
            {
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim },
              ],
            },
          ]}
        >
          {/* Grabber bar */}
          <View style={styles.grabber} />

          {/* STEP 1: PILIHAN CEPAT 2-TAP (PERSIS MOCKUP) */}
          {step === 'SELECT' && (
            <View>
              <View style={styles.headerRow}>
                <View>
                  <Text style={styles.title}>{t.quickLog.title}</Text>
                  <Text style={styles.subtitle}>
                    {t.quickLog.subtitle}
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
                  <Text style={styles.cardAction}>{t.quickLog.peeAction}</Text>
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
                  <Text style={styles.cardAction}>{t.quickLog.poopAction}</Text>
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
                  <Text style={styles.comboTitle}>{t.quickLog.comboTitle}</Text>
                  <Text style={styles.comboSubtitle}>
                    {t.quickLog.comboSub}
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.cancelBtn} onPress={handleFinish}>
                <Text style={styles.cancelBtnText}>{t.quickLog.cancel}</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* STEP 2: MOOD & NOTE (TERSIMPAN KE DATABASE LOKAL) */}
          {step === 'MOOD_NOTE' && (
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.moodHeader}>
                <View style={styles.avatarMini}>
                  {selectedType === 'PEE' && <LilDripIcon size={30} />}
                  {selectedType === 'POOP' && <MrPlopIcon size={30} />}
                  {selectedType === 'COMBO' && <SirFlushIcon size={30} />}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.moodTag}>{t.quickLog.recordedTag}</Text>
                  <Text style={styles.moodQuestion}>{t.quickLog.moodQuestion}</Text>
                </View>
                <TouchableOpacity onPress={handleFinish}>
                  <Text style={styles.skipText}>{t.quickLog.skip}</Text>
                </TouchableOpacity>
              </View>

              {/* Mood Grid */}
              <Text style={styles.labelSection}>{t.quickLog.chooseMood}</Text>
              <View style={styles.moodGrid}>
                {t.quickLog.moods.map((m) => {
                  const isSelected = selectedMood === m.key;
                  const activeBg =
                    m.key === 'Lega Banget'
                      ? 'rgba(47, 184, 172, 0.25)'
                      : m.key === 'Nahan Lama'
                      ? 'rgba(245, 183, 0, 0.25)'
                      : m.key === 'Momen Darurat'
                      ? 'rgba(255, 90, 95, 0.25)'
                      : 'rgba(201, 138, 88, 0.25)';
                  const border =
                    m.key === 'Lega Banget'
                      ? Colors.bothTeal
                      : m.key === 'Nahan Lama'
                      ? Colors.peeAmber
                      : m.key === 'Momen Darurat'
                      ? Colors.emergencyRed
                      : Colors.poopLight;
                  return (
                    <TouchableOpacity
                      key={m.key}
                      style={[
                        styles.moodCard,
                        isSelected && {
                          backgroundColor: activeBg,
                          borderColor: border,
                        },
                      ]}
                      onPress={() => setSelectedMood(m.key)}
                    >
                      <Text style={{ fontSize: 16 }}>{m.emoji}</Text>
                      <Text
                        style={[
                          styles.moodCardText,
                          isSelected && { color: Colors.creamBg, fontWeight: '900' },
                        ]}
                      >
                        {m.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Catatan Bebas */}
              <View style={styles.labelRow}>
                <Text style={styles.labelSection}>{t.quickLog.noteLabel}</Text>
                <Text style={styles.charCount}>{note.length}/100</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder={t.quickLog.notePlaceholder}
                placeholderTextColor={Colors.darkBorder}
                maxLength={100}
                value={note}
                onChangeText={setNote}
              />

              <TouchableOpacity style={styles.submitBtn} onPress={handleSaveMoodAndNote}>
                <Text style={styles.submitBtnText}>{t.quickLog.saveAndOpen}</Text>
              </TouchableOpacity>
            </ScrollView>
          )}

          {/* Loading Indicator */}
          {isSubmitting && (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color={Colors.peeAmber} />
              <Text style={styles.loadingTxt}>{t.quickLog.recording}</Text>
            </View>
          )}
        </Animated.View>
      </Animated.View>
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
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.darkBg,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
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
