import React, { useState, useMemo } from 'react';
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
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { useAppStore } from '@/src/store/useAppStore';
import { MrPlopIcon, LilDripIcon, SirFlushIcon } from '@/src/components/MascotIcons';
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
} from 'lucide-react-native';

export default function TimelineScreen() {
  const { logs, removeLog, blurLocation } = useAppStore();
  const [selectedDetailLog, setSelectedDetailLog] = useState<Log | null>(null);

  // Grouping logs by Bulan & Tahun (cth: "November 2026", "Oktober 2026")
  const sections = useMemo(() => {
    const groups: { [key: string]: Log[] } = {};

    logs.forEach((log) => {
      const date = new Date(log.loggedAt);
      const monthYear = date.toLocaleDateString('id-ID', {
        month: 'long',
        year: 'numeric',
      });

      if (!groups[monthYear]) {
        groups[monthYear] = [];
      }
      groups[monthYear].push(log);
    });

    return Object.keys(groups).map((title) => ({
      title,
      data: groups[title],
    }));
  }, [logs]);

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
        <Text style={styles.pageTitle}>Buku Harian Lega</Text>
        <Text style={styles.pageSubtitle}>
          {logs.length > 0 ? `Total ${logs.length} jejak buang air tercatat` : 'Belum ada catatan aktivitas'}
        </Text>
      </View>

      {logs.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>📜</Text>
          <Text style={styles.emptyTitle}>Belum Ada Catatan</Text>
          <Text style={styles.emptySubtitle}>
            Gunakan tombol (+) di tengah bawah untuk mulai mendokumentasikan riwayat kelegaanmu.
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
          animationType="fade"
          onRequestClose={() => setSelectedDetailLog(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
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
                  onPress={() => setSelectedDetailLog(null)}
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
                    <Text style={styles.detailLabel}>WAKTU TERCATAT</Text>
                    <Text style={styles.detailValue}>
                      {new Date(selectedDetailLog.loggedAt).toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}{' '}
                      WIB
                    </Text>
                  </View>
                </View>

                {/* Lokasi */}
                <View style={styles.detailRow}>
                  <MapPin size={16} color={Colors.bothTeal} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.detailLabel}>LOKASI & DAERAH</Text>
                    <Text style={styles.detailValue}>
                      {selectedDetailLog.district}, {selectedDetailLog.city}
                    </Text>
                    <Text style={styles.detailSubValue}>
                      Koordinat:{' '}
                      {selectedDetailLog.latitude.toFixed(4)}, {selectedDetailLog.longitude.toFixed(4)}
                    </Text>
                  </View>
                </View>

                {/* Mood */}
                <View style={styles.detailRow}>
                  <Smile size={16} color={Colors.peeAmber} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.detailLabel}>SUASANA HATI / MOOD</Text>
                    <Text style={styles.detailValue}>{selectedDetailLog.mood || 'Lega Banget 😊'}</Text>
                  </View>
                </View>

                {/* Catatan Bebas / Message */}
                <View style={styles.detailRow}>
                  <Info size={16} color={Colors.poopLight} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.detailLabel}>PESAN / CATATAN BEBAS</Text>
                    <Text style={[styles.detailValue, { fontStyle: selectedDetailLog.note ? 'normal' : 'italic' }]}>
                      {selectedDetailLog.note ? `"${selectedDetailLog.note}"` : 'Tidak ada catatan tambahan.'}
                    </Text>
                  </View>
                </View>

                {/* Info Keamanan Privasi */}
                <View style={styles.privacyBox}>
                  <Shield size={14} color={Colors.bothTeal} />
                  <Text style={styles.privacyBoxText}>
                    Data tersimpan terenkripsi secara lokal di perangkat Anda (Offline-First).
                  </Text>
                </View>
              </ScrollView>

              {/* Action Buttons: Hapus atau Tutup */}
              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={styles.deleteModalBtn}
                  onPress={() => {
                    const idToDelete = selectedDetailLog.id;
                    setSelectedDetailLog(null);
                    removeLog(idToDelete);
                  }}
                >
                  <Trash2 size={16} color={Colors.emergencyRed} />
                  <Text style={styles.deleteModalBtnText}>Hapus Log Ini</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.doneModalBtn}
                  onPress={() => setSelectedDetailLog(null)}
                >
                  <Text style={styles.doneModalBtnText}>Tutup</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
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
    paddingBottom: 8,
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
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  sectionHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 18,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  sectionHeaderText: {
    fontSize: 13,
    fontWeight: '900',
    color: Colors.peeAmber,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  logCard: {
    backgroundColor: Colors.darkSurface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    padding: 14,
    marginBottom: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  typeTitle: {
    fontSize: 14,
    fontWeight: '900',
  },
  timeText: {
    fontSize: 11,
    color: Colors.peachTint,
    opacity: 0.6,
    fontWeight: '700',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  locationText: {
    fontSize: 11,
    color: Colors.peachTint,
    fontWeight: '600',
  },
  moodPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(245, 183, 0, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 4,
  },
  moodPillText: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.peeAmber,
  },
  noteBox: {
    marginTop: 10,
    backgroundColor: Colors.darkBg,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(61, 53, 46, 0.6)',
  },
  noteText: {
    fontSize: 11,
    color: Colors.creamBg,
    fontStyle: 'italic',
    lineHeight: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.creamBg,
  },
  emptySubtitle: {
    fontSize: 12,
    color: Colors.peachTint,
    opacity: 0.7,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: Colors.darkSurface,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: Colors.darkBorder,
    paddingBottom: 16,
    marginBottom: 16,
  },
  modalAvatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  modalAvatar: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTypeTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.creamBg,
  },
  modalDateSubtitle: {
    fontSize: 11,
    color: Colors.peachTint,
    opacity: 0.65,
    marginTop: 2,
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.darkBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBody: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 14,
  },
  detailLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: Colors.peachTint,
    opacity: 0.6,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.creamBg,
    lineHeight: 18,
  },
  detailSubValue: {
    fontSize: 10,
    color: Colors.peachTint,
    opacity: 0.5,
    marginTop: 2,
  },
  privacyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(47, 184, 172, 0.12)',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(47, 184, 172, 0.3)',
    marginTop: 8,
  },
  privacyBoxText: {
    flex: 1,
    fontSize: 10,
    color: Colors.bothTeal,
    fontWeight: '700',
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.darkBorder,
    paddingTop: 14,
  },
  deleteModalBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 90, 95, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 90, 95, 0.3)',
  },
  deleteModalBtnText: {
    color: Colors.emergencyRed,
    fontSize: 11,
    fontWeight: '800',
  },
  doneModalBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: Colors.peeAmber,
  },
  doneModalBtnText: {
    color: Colors.ink,
    fontSize: 12,
    fontWeight: '900',
  },
});
