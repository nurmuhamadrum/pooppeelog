import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SectionList,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
  Modal,
  ScrollView,
  TextInput,
  Alert,
  Animated,
  Easing,
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Colors } from '@/constants/Colors';
import { useAppStore } from '@/src/store/useAppStore';
import { MrPlopIcon, LilDripIcon, SirFlushIcon } from '@/src/components/MascotIcons';
import { useToast } from '@/src/context/ToastContext';
import { useMobileI18n } from '@/src/i18n/translations';
import { Log } from '@poop-pee-log/shared';
import {
  Trash2,
  MapPin,
  Clock,
  Calendar,
  X,
  ChevronRight,
  Shield,
  Smile,
  Info,
  Filter,
  Search,
  AlertTriangle,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

type TimeFilter = 'WEEK' | 'MONTH' | 'YEAR' | 'CUSTOM' | 'ALL';

export default function TimelineScreen() {
  const { logs, removeLog } = useAppStore();
  const { showToast } = useToast();
  const { lang, t } = useMobileI18n();
  const locale = lang === 'en' ? 'en-US' : 'id-ID';
  const [selectedDetailLog, setSelectedDetailLog] = useState<Log | null>(null);
  const [logToDelete, setLogToDelete] = useState<Log | null>(null);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // State Rentang Tanggal Kalender (Custom Date Range)
  const [dateRangeModalVisible, setDateRangeModalVisible] = useState(false);
  const [startDate, setStartDate] = useState<Date>(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [pickerTarget, setPickerTarget] = useState<'START' | 'END' | null>(null);
  const [showNativePicker, setShowNativePicker] = useState<boolean>(false);
  const [activeDateFilterLabel, setActiveDateFilterLabel] = useState<string | null>(null);

  // Animasi modal kalender
  const calendarScale = useRef(new Animated.Value(0.85)).current;
  const calendarFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (dateRangeModalVisible) {
      Animated.parallel([
        Animated.spring(calendarScale, {
          toValue: 1,
          friction: 6,
          tension: 75,
          useNativeDriver: true,
        }),
        Animated.timing(calendarFade, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      calendarScale.setValue(0.85);
      calendarFade.setValue(0);
    }
  }, [dateRangeModalVisible]);

  const handleCloseCalendarModal = () => {
    Animated.parallel([
      Animated.timing(calendarScale, {
        toValue: 0.85,
        duration: 140,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(calendarFade, {
        toValue: 0,
        duration: 140,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setDateRangeModalVisible(false);
      setPickerTarget(null);
      setShowNativePicker(false);
    });
  };

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowNativePicker(false);
    }
    if (event.type === 'dismissed' || !selectedDate) {
      setPickerTarget(null);
      return;
    }

    if (pickerTarget === 'START') {
      setStartDate(selectedDate);
      if (selectedDate > endDate) {
        setEndDate(selectedDate);
      }
    } else if (pickerTarget === 'END') {
      if (selectedDate < startDate) {
        setStartDate(selectedDate);
      }
      setEndDate(selectedDate);
    }

    if (Platform.OS === 'android') {
      setPickerTarget(null);
    }
  };

  const handleApplyCustomDateRange = () => {
    if (startDate > endDate) {
      showToast({
        message: t.timeline.invalidRange,
        type: 'error',
      });
      return;
    }

    const startFmt = startDate.toLocaleDateString(locale, { day: 'numeric', month: 'short' });
    const endFmt = endDate.toLocaleDateString(locale, { day: 'numeric', month: 'short' });

    setTimeFilter('CUSTOM');
    setActiveDateFilterLabel(`${startFmt} - ${endFmt}`);
    handleCloseCalendarModal();
    showToast({
      message: t.timeline.rangeApplied(`${startFmt} - ${endFmt}`),
      type: 'success',
    });
  };

  // Modal detail popup animation
  const modalScale = useRef(new Animated.Value(0.88)).current;
  const modalFade = useRef(new Animated.Value(0)).current;

  // Confirmation delete modal popup animation
  const confirmScale = useRef(new Animated.Value(0.85)).current;
  const confirmFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (logToDelete) {
      Animated.parallel([
        Animated.spring(confirmScale, {
          toValue: 1,
          friction: 6,
          tension: 75,
          useNativeDriver: true,
        }),
        Animated.timing(confirmFade, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      confirmScale.setValue(0.85);
      confirmFade.setValue(0);
    }
  }, [logToDelete]);

  const handleCloseConfirmModal = () => {
    Animated.parallel([
      Animated.timing(confirmScale, {
        toValue: 0.85,
        duration: 140,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(confirmFade, {
        toValue: 0,
        duration: 140,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setLogToDelete(null);
    });
  };

  const handleConfirmDelete = () => {
    if (!logToDelete) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
    const idToDelete = logToDelete.id;
    const typeName =
      logToDelete.type === 'PEE'
        ? "Lil' Drip"
        : logToDelete.type === 'POOP'
        ? 'Mr. Plop'
        : 'Sir Flush';

    handleCloseConfirmModal();
    handleCloseDetailModal();
    removeLog(idToDelete);
    showToast({
      message: t.timeline.deletedToast(typeName),
      type: 'delete',
    });
  };

  useEffect(() => {
    if (selectedDetailLog) {
      Animated.parallel([
        Animated.spring(modalScale, {
          toValue: 1,
          friction: 7,
          tension: 70,
          useNativeDriver: true,
        }),
        Animated.timing(modalFade, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      modalScale.setValue(0.88);
      modalFade.setValue(0);
    }
  }, [selectedDetailLog]);

  const handleCloseDetailModal = () => {
    Animated.parallel([
      Animated.timing(modalScale, {
        toValue: 0.88,
        duration: 160,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(modalFade, {
        toValue: 0,
        duration: 160,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setSelectedDetailLog(null);
    });
  };

  // Filter logs berdasarkan periode waktu dan kata kunci pencarian
  const filteredLogs = useMemo(() => {
    const now = new Date();
    const query = searchQuery.trim().toLowerCase();

    return logs.filter((log) => {
      // 1. Filter Pencarian Teks (Distrik, Kota, Mood, atau Catatan)
      if (query) {
        const matchDistrict = (log.district || '').toLowerCase().includes(query);
        const matchCity = (log.city || '').toLowerCase().includes(query);
        const matchMood = (log.mood || '').toLowerCase().includes(query);
        const matchNote = (log.note || '').toLowerCase().includes(query);
        if (!matchDistrict && !matchCity && !matchMood && !matchNote) {
          return false;
        }
      }

      // 2. Filter Periode Waktu
      const logDate = new Date(log.loggedAt);
      if (timeFilter === 'WEEK') {
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return logDate >= oneWeekAgo;
      }
      if (timeFilter === 'MONTH') {
        return (
          logDate.getFullYear() === now.getFullYear() &&
          logDate.getMonth() === now.getMonth()
        );
      }
      if (timeFilter === 'YEAR') {
        return logDate.getFullYear() === now.getFullYear();
      }
      if (timeFilter === 'CUSTOM') {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        return logDate >= start && logDate <= end;
      }
      return true; // 'ALL'
    });
  }, [logs, timeFilter, searchQuery, startDate, endDate]);

  // Grouping logs berdasarkan mode filter
  const sections = useMemo(() => {
    const groups: { [key: string]: Log[] } = {};

    filteredLogs.forEach((log) => {
      const date = new Date(log.loggedAt);
      let groupHeader = '';

      if (timeFilter === 'WEEK') {
        // Kelompokkan per Hari (contoh: "Senin, 9 Nov 2026")
        groupHeader = date.toLocaleDateString('id-ID', {
          weekday: 'long',
          day: 'numeric',
          month: 'short',
        });
      } else if (timeFilter === 'YEAR') {
        // Kelompokkan per Bulan (contoh: "November 2026")
        groupHeader = date.toLocaleDateString('id-ID', {
          month: 'long',
          year: 'numeric',
        });
      } else {
        // Default Bulan & Tahun
        groupHeader = date.toLocaleDateString('id-ID', {
          month: 'long',
          year: 'numeric',
        });
      }

      if (!groups[groupHeader]) {
        groups[groupHeader] = [];
      }
      groups[groupHeader].push(log);
    });

    return Object.keys(groups).map((title) => ({
      title,
      data: groups[title],
    }));
  }, [filteredLogs, timeFilter]);

  const renderItem = ({ item }: { item: Log }) => {
    const isPee = item.type === 'PEE';
    const isPoop = item.type === 'POOP';
    const isCombo = item.type === 'COMBO';

    const dateObj = new Date(item.loggedAt);
    const dayDate = dateObj.toLocaleDateString('id-ID', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
    const timeFormatted = dateObj.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const badgeBg = isPee ? Colors.peeAmber : isPoop ? Colors.poopBrown : Colors.bothTeal;
    const badgeTitle = isPee
      ? "Lil' Drip (Kencing)"
      : isPoop
      ? 'Mr. Plop (BAB)'
      : 'Sir Flush (Keduanya)';

    return (
      <TouchableOpacity
        style={styles.logCard}
        onPress={() => setSelectedDetailLog(item)}
        activeOpacity={0.8}
      >
        <View style={styles.cardHeader}>
          {/* Avatar Icon */}
          <View style={[styles.avatarBox, { backgroundColor: badgeBg }]}>
            {isPee && <LilDripIcon size={24} />}
            {isPoop && <MrPlopIcon size={24} />}
            {isCombo && <SirFlushIcon size={24} />}
          </View>

          {/* Core Info */}
          <View style={{ flex: 1 }}>
            <View style={styles.topRow}>
              <Text
                style={[
                  styles.typeTitle,
                  { color: isPee ? Colors.peeAmber : isPoop ? Colors.poopLight : Colors.bothTeal },
                ]}
              >
                {badgeTitle}
              </Text>
              <Text style={styles.timeText}>{timeFormatted}</Text>
            </View>

            <View style={styles.infoRow}>
              <MapPin size={12} color={Colors.peachTint} opacity={0.6} />
              <Text style={styles.locationText} numberOfLines={1}>
                {item.district || item.city}, {item.city}
              </Text>
            </View>

            {/* Mood pill */}
            <View style={styles.moodPill}>
              <Text style={styles.moodPillText}>Mood: {item.mood || 'Lega'}</Text>
            </View>
          </View>

          <ChevronRight size={18} color={Colors.peachTint} opacity={0.5} style={{ alignSelf: 'center' }} />
        </View>

        {/* Note preview if any */}
        {Boolean(item.note) && (
          <View style={styles.noteBox}>
            <Text style={styles.noteText} numberOfLines={2}>
              "{item.note}"
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderSectionHeader = ({ section: { title } }: { section: { title: string } }) => (
    <View style={styles.sectionHeaderContainer}>
      <Calendar size={14} color={Colors.peeAmber} />
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header Area */}
      <View style={styles.headerArea}>
        <Text style={styles.pageTitle}>{t.timeline.title}</Text>
        <Text style={styles.pageSubtitle}>
          {filteredLogs.length > 0
            ? t.timeline.subtitleCount(filteredLogs.length, logs.length)
            : t.timeline.subtitleEmpty}
        </Text>
      </View>

      {/* Search Bar Input */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={16} color={Colors.peachTint} opacity={0.6} />
          <TextInput
            style={styles.searchInput}
            placeholder={t.timeline.searchPlaceholder}
            placeholderTextColor="rgba(245, 237, 227, 0.4)"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
          {Boolean(searchQuery) && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearSearchBtn}>
              <X size={14} color={Colors.peachTint} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Waktu: Minggu Ini, Bulan Ini, Tahun Ini, Kalender, Semua */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          <TouchableOpacity
            style={[styles.filterPill, timeFilter === 'WEEK' && styles.filterPillActive]}
            onPress={() => {
              setTimeFilter('WEEK');
              setActiveDateFilterLabel(null);
            }}
          >
            <Text style={[styles.filterPillText, timeFilter === 'WEEK' && styles.filterPillTextActive]}>
              {t.timeline.week}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterPill, timeFilter === 'MONTH' && styles.filterPillActive]}
            onPress={() => {
              setTimeFilter('MONTH');
              setActiveDateFilterLabel(null);
            }}
          >
            <Text style={[styles.filterPillText, timeFilter === 'MONTH' && styles.filterPillTextActive]}>
              {t.timeline.month}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterPill, timeFilter === 'YEAR' && styles.filterPillActive]}
            onPress={() => {
              setTimeFilter('YEAR');
              setActiveDateFilterLabel(null);
            }}
          >
            <Text style={[styles.filterPillText, timeFilter === 'YEAR' && styles.filterPillTextActive]}>
              {t.timeline.year}
            </Text>
          </TouchableOpacity>

          {/* Tombol Kalender Rentang Tanggal Kustom */}
          <TouchableOpacity
            style={[
              styles.calendarFilterButton,
              timeFilter === 'CUSTOM' && styles.calendarFilterButtonActive,
            ]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
              setDateRangeModalVisible(true);
            }}
            activeOpacity={0.8}
          >
            <View
              style={[
                styles.calendarIconBadge,
                timeFilter === 'CUSTOM' && styles.calendarIconBadgeActive,
              ]}
            >
              <Calendar size={13} color={timeFilter === 'CUSTOM' ? Colors.ink : Colors.bothTeal} />
            </View>
            <Text
              style={[
                styles.calendarFilterButtonText,
                timeFilter === 'CUSTOM' && styles.calendarFilterButtonTextActive,
              ]}
              numberOfLines={1}
            >
              {activeDateFilterLabel ? activeDateFilterLabel : t.timeline.pickDate}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterPill, timeFilter === 'ALL' && styles.filterPillActive]}
            onPress={() => {
              setTimeFilter('ALL');
              setActiveDateFilterLabel(null);
            }}
          >
            <Text style={[styles.filterPillText, timeFilter === 'ALL' && styles.filterPillTextActive]}>
              {t.timeline.allTime} ({logs.length})
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {filteredLogs.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>📜</Text>
          <Text style={styles.emptyTitle}>{t.timeline.emptyTitle}</Text>
          <Text style={styles.emptySubtitle}>
            {t.timeline.emptySub}
          </Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={false}
        />
      )}

      {/* MODAL VIEW DETAIL LOG */}
      {selectedDetailLog && (
        <Modal
          visible={true}
          transparent
          animationType="none"
          onRequestClose={handleCloseDetailModal}
        >
          <Animated.View style={[styles.modalOverlay, { opacity: modalFade }]}>
            <Animated.View
              style={[
                styles.modalCard,
                {
                  transform: [{ scale: modalScale }],
                },
              ]}
            >
              {/* Header Modal */}
              <View style={styles.modalHeader}>
                <View style={styles.modalAvatarRow}>
                  <View
                    style={[
                      styles.modalAvatar,
                      {
                        backgroundColor:
                          selectedDetailLog.type === 'PEE'
                            ? Colors.peeAmber
                            : selectedDetailLog.type === 'POOP'
                            ? Colors.poopBrown
                            : Colors.bothTeal,
                      },
                    ]}
                  >
                    {selectedDetailLog.type === 'PEE' && <LilDripIcon size={34} />}
                    {selectedDetailLog.type === 'POOP' && <MrPlopIcon size={34} />}
                    {selectedDetailLog.type === 'COMBO' && <SirFlushIcon size={34} />}
                  </View>
                  <View>
                    <Text style={styles.modalTypeTitle}>
                      {selectedDetailLog.type === 'PEE'
                        ? "Lil' Drip (Kencing)"
                        : selectedDetailLog.type === 'POOP'
                        ? 'Mr. Plop (BAB)'
                        : 'Sir Flush (Keduanya)'}
                    </Text>
                    <Text style={styles.modalDateSubtitle}>
                      {new Date(selectedDetailLog.loggedAt).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={handleCloseDetailModal}
                  style={styles.modalCloseBtn}
                >
                  <X size={18} color={Colors.peachTint} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                {/* Waktu & Jam */}
                <View style={styles.detailRow}>
                  <Clock size={16} color={Colors.peeAmber} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.detailLabel}>{t.timeline.detailTime}</Text>
                    <Text style={styles.detailValue}>
                      {new Date(selectedDetailLog.loggedAt).toLocaleTimeString(locale, {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </Text>
                  </View>
                </View>

                {/* Lokasi */}
                <View style={styles.detailRow}>
                  <MapPin size={16} color={Colors.bothTeal} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.detailLabel}>{t.timeline.detailLocation}</Text>
                    <Text style={styles.detailValue}>
                      {selectedDetailLog.district}, {selectedDetailLog.city}
                    </Text>
                    <Text style={styles.detailSubValue}>
                      {t.timeline.detailCoords}:{' '}
                      {selectedDetailLog.latitude.toFixed(4)}, {selectedDetailLog.longitude.toFixed(4)}
                    </Text>
                  </View>
                </View>

                {/* Mood */}
                <View style={styles.detailRow}>
                  <Smile size={16} color={Colors.peeAmber} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.detailLabel}>{t.timeline.detailMood}</Text>
                    <Text style={styles.detailValue}>{selectedDetailLog.mood || 'Lega Banget 😊'}</Text>
                  </View>
                </View>

                {/* Catatan Bebas / Message */}
                <View style={styles.detailRow}>
                  <Info size={16} color={Colors.poopLight} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.detailLabel}>{t.timeline.detailNote}</Text>
                    <Text style={[styles.detailValue, { fontStyle: selectedDetailLog.note ? 'normal' : 'italic' }]}>
                      {selectedDetailLog.note ? `"${selectedDetailLog.note}"` : t.timeline.noNote}
                    </Text>
                  </View>
                </View>

                {/* Info Keamanan Privasi */}
                <View style={styles.privacyBox}>
                  <Shield size={14} color={Colors.bothTeal} />
                  <Text style={styles.privacyBoxText}>
                    {t.timeline.privacyNote}
                  </Text>
                </View>
              </ScrollView>

              {/* Action Buttons: Hapus atau Tutup */}
              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={styles.deleteModalBtn}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
                    setLogToDelete(selectedDetailLog);
                  }}
                >
                  <Trash2 size={16} color={Colors.emergencyRed} />
                  <Text style={styles.deleteModalBtnText}>{t.timeline.deleteBtn}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.closeModalBtn}
                  onPress={handleCloseDetailModal}
                >
                  <Text style={styles.closeModalBtnText}>{t.timeline.closeBtn}</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </Animated.View>
        </Modal>
      )}

      {/* POPUP CONFIRMATION HAPUS CATATAN BERGAYA CUSTOM POPUP */}
      {logToDelete && (
        <Modal
          visible={true}
          transparent
          animationType="none"
          onRequestClose={handleCloseConfirmModal}
        >
          <Animated.View style={[styles.confirmOverlay, { opacity: confirmFade }]}>
            <Animated.View
              style={[
                styles.confirmCard,
                {
                  transform: [{ scale: confirmScale }],
                },
              ]}
            >
              {/* Icon Alert Bulat */}
              <View style={styles.confirmIconRing}>
                <Trash2 size={28} color={Colors.emergencyRed} />
              </View>

              <Text style={styles.confirmTitle}>{t.timeline.confirmDeleteTitle}</Text>
              <Text style={styles.confirmDescription}>
                {lang === 'en' ? 'Your ' : 'Catatan '}
                <Text style={{ fontWeight: '900', color: Colors.creamBg }}>
                  {logToDelete.type === 'PEE'
                    ? "Lil' Drip (Pee)"
                    : logToDelete.type === 'POOP'
                    ? 'Mr. Plop (Poop)'
                    : 'Sir Flush (Combo)'}
                </Text>
                {lang === 'en' ? ' log at ' : ' di '}
                <Text style={{ fontWeight: '700', color: Colors.peeAmber }}>
                  {logToDelete.district || logToDelete.city || (lang === 'en' ? 'this spot' : 'lokasi ini')}
                </Text>
                {lang === 'en'
                  ? ' will be permanently deleted from your device.'
                  : ' akan dihapus permanen dari riwayat perangkat Anda.'}
              </Text>

              {/* Action Buttons */}
              <View style={styles.confirmButtonRow}>
                <TouchableOpacity
                  style={styles.confirmCancelBtn}
                  onPress={handleCloseConfirmModal}
                  activeOpacity={0.8}
                >
                  <Text style={styles.confirmCancelText}>{t.timeline.confirmDeleteCancel}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.confirmDeleteBtn}
                  onPress={handleConfirmDelete}
                  activeOpacity={0.8}
                >
                  <Trash2 size={15} color="#FFFFFF" />
                  <Text style={styles.confirmDeleteText}>{t.timeline.confirmDeleteOk}</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </Animated.View>
        </Modal>
      )}

      {/* POPUP KALENDER RENTANG TANGGAL KUSTOM DENGAN DATE PICKER */}
      {dateRangeModalVisible && (
        <Modal
          visible={true}
          transparent
          animationType="none"
          onRequestClose={handleCloseCalendarModal}
        >
          <Animated.View style={[styles.confirmOverlay, { opacity: calendarFade }]}>
            <Animated.View
              style={[
                styles.confirmCard,
                {
                  transform: [{ scale: calendarScale }],
                },
              ]}
            >
              <View style={[styles.confirmIconRing, { backgroundColor: 'rgba(47, 184, 172, 0.15)', borderColor: Colors.bothTeal }]}>
                <Calendar size={26} color={Colors.bothTeal} />
              </View>

              <Text style={styles.confirmTitle}>{t.timeline.dateModalTitle}</Text>
              <Text style={styles.confirmDescription}>
                {t.timeline.dateModalDesc}
              </Text>

              {/* Selector Tanggal Mulai & Akhir dengan UI Interaktif */}
              <View style={styles.datePickerCardRow}>
                {/* Tanggal Mulai */}
                <TouchableOpacity
                  style={[
                    styles.dateSelectBox,
                    pickerTarget === 'START' && styles.dateSelectBoxActive,
                  ]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                    setPickerTarget('START');
                    setShowNativePicker(true);
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.dateSelectLabel}>{t.timeline.fromDate}</Text>
                  <Text style={styles.dateSelectValue}>
                    {startDate.toLocaleDateString(locale, {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </Text>
                  <Text style={styles.dateSelectHint}>{t.timeline.tapToChange}</Text>
                </TouchableOpacity>

                {/* Arrow Divider */}
                <View style={styles.dateDividerLine}>
                  <Text style={{ color: Colors.peachTint, fontSize: 16 }}>→</Text>
                </View>

                {/* Tanggal Akhir */}
                <TouchableOpacity
                  style={[
                    styles.dateSelectBox,
                    pickerTarget === 'END' && styles.dateSelectBoxActive,
                  ]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                    setPickerTarget('END');
                    setShowNativePicker(true);
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.dateSelectLabel}>{t.timeline.toDate}</Text>
                  <Text style={styles.dateSelectValue}>
                    {endDate.toLocaleDateString(locale, {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </Text>
                  <Text style={styles.dateSelectHint}>{t.timeline.tapToChange}</Text>
                </TouchableOpacity>
              </View>

              {/* DateTimePicker Component */}
              {(showNativePicker || Platform.OS === 'ios') && pickerTarget && (
                <View style={styles.inlinePickerWrapper}>
                  <DateTimePicker
                    value={pickerTarget === 'START' ? startDate : endDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={onDateChange}
                    maximumDate={new Date()}
                    textColor={Colors.creamBg}
                    themeVariant="dark"
                  />
                  {Platform.OS === 'ios' && (
                    <TouchableOpacity
                      style={styles.pickerDoneBtn}
                      onPress={() => setPickerTarget(null)}
                    >
                      <Text style={styles.pickerDoneBtnText}>{t.timeline.donePick}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}

              {/* Action Buttons */}
              <View style={styles.confirmButtonRow}>
                <TouchableOpacity
                  style={styles.confirmCancelBtn}
                  onPress={handleCloseCalendarModal}
                  activeOpacity={0.8}
                >
                  <Text style={styles.confirmCancelText}>{t.timeline.confirmDeleteCancel}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.confirmDeleteBtn, { backgroundColor: Colors.bothTeal }]}
                  onPress={handleApplyCustomDateRange}
                  activeOpacity={0.8}
                >
                  <Filter size={15} color="#000" />
                  <Text style={[styles.confirmDeleteText, { color: '#000' }]}>{t.timeline.applyBtn}</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </Animated.View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.darkBg,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 28) + 8 : 10,
  },
  headerArea: {
    paddingHorizontal: 20,
    paddingBottom: 6,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.creamBg,
    letterSpacing: -0.5,
  },
  pageSubtitle: {
    fontSize: 12,
    color: Colors.peachTint,
    opacity: 0.7,
    marginTop: 2,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginTop: 6,
    marginBottom: 4,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.darkSurface,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 10 : 6,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: Colors.creamBg,
    fontSize: 13,
    fontWeight: '600',
    padding: 0,
  },
  clearSearchBtn: {
    padding: 4,
  },
  filterContainer: {
    marginTop: 6,
    marginBottom: 6,
  },
  filterRow: {
    paddingHorizontal: 20,
    gap: 8,
    flexDirection: 'row',
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: Colors.darkSurface,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
  },
  filterPillActive: {
    backgroundColor: Colors.peeAmber,
    borderColor: Colors.peeAmber,
  },
  filterPillActiveCustom: {
    backgroundColor: Colors.bothTeal,
    borderColor: Colors.bothTeal,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  // Tombol Pilih Tanggal yang Menonjol & Estetik
  calendarFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 5,
    paddingLeft: 6,
    paddingRight: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(47, 184, 172, 0.12)',
    borderWidth: 1.5,
    borderColor: 'rgba(47, 184, 172, 0.35)',
    shadowColor: Colors.bothTeal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  calendarFilterButtonActive: {
    backgroundColor: Colors.bothTeal,
    borderColor: Colors.bothTeal,
  },
  calendarIconBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(47, 184, 172, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarIconBadgeActive: {
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  calendarFilterButtonText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.bothTeal,
  },
  calendarFilterButtonTextActive: {
    color: Colors.ink,
    fontWeight: '900',
  },
  filterPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.peachTint,
  },
  filterPillTextActive: {
    color: '#000',
    fontWeight: '900',
  },
  filterPillTextActiveDark: {
    color: '#000',
    fontWeight: '900',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 110,
  },
  sectionHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.darkBg,
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  sectionHeaderText: {
    fontSize: 12,
    fontWeight: '900',
    color: Colors.creamBg,
    letterSpacing: 0.4,
  },
  logCard: {
    backgroundColor: Colors.darkSurface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  avatarBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typeTitle: {
    fontSize: 13,
    fontWeight: '900',
  },
  timeText: {
    fontSize: 11,
    color: Colors.peachTint,
    opacity: 0.6,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  locationText: {
    fontSize: 11,
    color: Colors.peachTint,
    opacity: 0.75,
    flex: 1,
  },
  moodPill: {
    backgroundColor: 'rgba(245, 183, 0, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  moodPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.peeAmber,
  },
  noteBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 10,
    padding: 8,
    marginTop: 10,
  },
  noteText: {
    fontSize: 11,
    color: Colors.peachTint,
    opacity: 0.85,
    fontStyle: 'italic',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    marginTop: 60,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.creamBg,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 12,
    color: Colors.peachTint,
    opacity: 0.65,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.78)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    backgroundColor: Colors.darkBg,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: Colors.darkBorder,
    padding: 20,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalAvatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modalAvatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTypeTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: Colors.creamBg,
  },
  modalDateSubtitle: {
    fontSize: 11,
    color: Colors.peachTint,
    opacity: 0.6,
    marginTop: 2,
  },
  modalCloseBtn: {
    backgroundColor: Colors.darkSurface,
    padding: 6,
    borderRadius: 14,
  },
  modalBody: {
    marginBottom: 14,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(61, 53, 46, 0.4)',
  },
  detailLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: Colors.peachTint,
    opacity: 0.5,
    letterSpacing: 0.6,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.creamBg,
    marginTop: 2,
  },
  detailSubValue: {
    fontSize: 10,
    color: Colors.peachTint,
    opacity: 0.5,
    marginTop: 1,
  },
  privacyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(47, 184, 172, 0.12)',
    padding: 10,
    borderRadius: 12,
    marginTop: 12,
  },
  privacyBoxText: {
    fontSize: 10,
    color: Colors.bothTeal,
    fontWeight: '700',
    flex: 1,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  deleteModalBtn: {
    flex: 1,
    backgroundColor: 'rgba(255, 90, 95, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 90, 95, 0.4)',
    borderRadius: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  deleteModalBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.emergencyRed,
  },
  closeModalBtn: {
    flex: 1,
    backgroundColor: Colors.darkSurface,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeModalBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.creamBg,
  },
  // Custom Confirmation Delete Popup Styles
  confirmOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.82)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  confirmCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: Colors.darkBg,
    borderRadius: 26,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 90, 95, 0.45)',
    padding: 22,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 14,
  },
  confirmIconRing: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: 'rgba(255, 90, 95, 0.14)',
    borderWidth: 2,
    borderColor: 'rgba(255, 90, 95, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  confirmTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: Colors.creamBg,
    marginBottom: 8,
    textAlign: 'center',
  },
  confirmDescription: {
    fontSize: 12,
    color: Colors.peachTint,
    opacity: 0.8,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  confirmButtonRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  confirmCancelBtn: {
    flex: 1,
    backgroundColor: Colors.darkSurface,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmCancelText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.peachTint,
  },
  confirmDeleteBtn: {
    flex: 1,
    backgroundColor: Colors.emergencyRed,
    borderRadius: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    shadowColor: Colors.emergencyRed,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 6,
  },
  confirmDeleteText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  // Custom Date Picker Selector Styles
  datePickerCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '100%',
    marginBottom: 16,
  },
  dateSelectBox: {
    flex: 1,
    backgroundColor: Colors.darkSurface,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.darkBorder,
    padding: 12,
    alignItems: 'center',
  },
  dateSelectBoxActive: {
    borderColor: Colors.bothTeal,
    backgroundColor: 'rgba(47, 184, 172, 0.12)',
  },
  dateSelectLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.peachTint,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  dateSelectValue: {
    fontSize: 13,
    fontWeight: '900',
    color: Colors.creamBg,
    textAlign: 'center',
  },
  dateSelectHint: {
    fontSize: 9,
    color: Colors.bothTeal,
    fontWeight: '700',
    marginTop: 4,
  },
  dateDividerLine: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  inlinePickerWrapper: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: Colors.darkSurface,
    borderRadius: 16,
    padding: 8,
  },
  pickerDoneBtn: {
    marginTop: 8,
    backgroundColor: Colors.bothTeal,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  pickerDoneBtnText: {
    color: Colors.ink,
    fontSize: 11,
    fontWeight: '900',
  },
});
