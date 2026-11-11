import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Switch,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Modal,
  Share,
  Alert,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { useAppStore } from '@/src/store/useAppStore';
import {
  ShieldCheck,
  Lock,
  Trash2,
  Download,
  Upload,
  FileText,
  CheckCircle,
  User,
  Heart,
  Share2,
  Calendar,
  Sparkles,
  MapPin,
  Flame,
  Award,
  AlertTriangle,
  X,
  ExternalLink,
} from 'lucide-react-native';
import { MrPlopIcon, LilDripIcon, SirFlushIcon } from '@/src/components/MascotIcons';
import { clearAllLocalData } from '@/src/db/sqlite';
import { authenticateWithBiometrics } from '@/src/services/auth';
import * as Linking from 'expo-linking';
import * as DocumentPicker from 'expo-document-picker';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export default function ProfileSettingsScreen() {
  const {
    appLockEnabled,
    toggleAppLock,
    userId,
    logs,
    initialize,
    importLogs,
  } = useAppStore();

  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  // State untuk Import JSON
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ count: number; error?: string } | null>(null);

  // Perhitungan statistik profil
  const totalLogs = logs.length;
  const totalPee = logs.filter((l) => l.type === 'PEE' || l.type === 'COMBO').length;
  const totalPoop = logs.filter((l) => l.type === 'POOP' || l.type === 'COMBO').length;
  const totalCombo = logs.filter((l) => l.type === 'COMBO').length;

  const uniqueLocations = useMemo(() => {
    const set = new Set<string>();
    logs.forEach((l) => {
      if (l.district) set.add(l.district);
    });
    return set.size;
  }, [logs]);

  // Tanggal bergabung / log pertama
  const memberSince = useMemo(() => {
    if (logs.length === 0) return 'Pengguna Baru';
    const sorted = [...logs].sort(
      (a, b) => new Date(a.loggedAt).getTime() - new Date(b.loggedAt).getTime()
    );
    const firstDate = new Date(sorted[0].loggedAt);
    return firstDate.toLocaleDateString('id-ID', {
      month: 'short',
      year: 'numeric',
    });
  }, [logs]);

  const handleToggleAppLock = async () => {
    if (!appLockEnabled) {
      const success = await authenticateWithBiometrics('Konfirmasi Biometrik untuk App Lock');
      if (success) {
        toggleAppLock();
      }
    } else {
      toggleAppLock();
    }
  };

  const executeShareJSON = async () => {
    try {
      setIsExporting(true);
      const dataStr = JSON.stringify(logs, null, 2);

      // Coba bagikan via expo-sharing jika tersedia, atau fallback ke Share.share bawaan
      const isSharingAvailable = await Sharing.isAvailableAsync().catch(() => false);
      if (isSharingAvailable && Paths?.cache) {
        const tempFile = new File(Paths.cache, `pooppeelog-backup-${Date.now()}.json`);
        await tempFile.write(dataStr);
        await Sharing.shareAsync(tempFile.uri, {
          mimeType: 'application/json',
          dialogTitle: 'Simpan / Bagikan Cadangan PoopPeeLog',
          UTI: 'public.json',
        });
      } else {
        await Share.share({
          title: 'Poop Pee Log - Cadangan Riwayat',
          message: dataStr,
        });
      }
      setExportSuccess(true);
    } catch (err) {
      console.log('Export share error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const executePickAndImportJSON = async () => {
    try {
      setIsImporting(true);
      setImportResult(null);

      const res = await DocumentPicker.getDocumentAsync({
        type: ['application/json', 'text/json', '*/*'],
        copyToCacheDirectory: true,
      });

      if (res.canceled || !res.assets || res.assets.length === 0) {
        setIsImporting(false);
        return;
      }

      const selectedAsset = res.assets[0];
      let jsonContent = '';

      if (selectedAsset.uri) {
        const fileRef = new File(selectedAsset.uri);
        jsonContent = await fileRef.text();
      }

      if (!jsonContent) {
        setImportResult({ count: 0, error: 'Berkas kosong atau tidak dapat dibaca.' });
        setIsImporting(false);
        return;
      }

      const parsed = JSON.parse(jsonContent);
      let logsToImport: any[] = [];

      if (Array.isArray(parsed)) {
        logsToImport = parsed;
      } else if (parsed && Array.isArray(parsed.logs)) {
        logsToImport = parsed.logs;
      } else {
        setImportResult({ count: 0, error: 'Format berkas JSON tidak sesuai struktur riwayat log.' });
        setIsImporting(false);
        return;
      }

      const count = await importLogs(logsToImport);
      setImportResult({ count });
    } catch (err: any) {
      console.log('Error importing logs:', err);
      setImportResult({
        count: 0,
        error: err?.message || 'Gagal mengimpor berkas. Pastikan format valid JSON.',
      });
    } finally {
      setIsImporting(false);
    }
  };

  const executeClearData = async () => {
    await clearAllLocalData();
    await initialize();
    setDeleteModalVisible(false);
  };

  const openDonationSaweria = () => {
    Linking.openURL('https://saweria.co/pooppeelog');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header Area */}
      <View style={styles.headerArea}>
        <Text style={styles.pageTitle}>Profil & Pengaturan</Text>
        <Text style={styles.pageSubtitle}>Identitas privat, data biologis & keamanan</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card Hero */}
        <View style={styles.profileCard}>
          <View style={styles.profileRow}>
            {/* Mascot Trio Mini Group */}
            <View style={styles.profileAvatarContainer}>
              <View style={[styles.miniMascotWrapper, { backgroundColor: Colors.bothTeal }]}>
                <SirFlushIcon size={38} />
              </View>
            </View>

            <View style={{ flex: 1 }}>
              <View style={styles.nameRow}>
                <Text style={styles.profileName}>Penjelajah Toilet</Text>
                <View style={styles.guestBadge}>
                  <Text style={styles.guestBadgeText}>LOKAL OFFLINE</Text>
                </View>
              </View>
              <Text style={styles.profileMemberSince}>Aktif sejak {memberSince}</Text>
              <Text style={styles.profileId} numberOfLines={1}>
                ID: {userId || 'guest-local'}
              </Text>
            </View>
          </View>

          {/* Quick Metrics Strip */}
          <View style={styles.metricsStrip}>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{totalLogs}</Text>
              <Text style={styles.metricLabel}>Total Log</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={[styles.metricValue, { color: Colors.peeAmber }]}>{totalPee}</Text>
              <Text style={styles.metricLabel}>Pee</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={[styles.metricValue, { color: Colors.poopLight }]}>{totalPoop}</Text>
              <Text style={styles.metricLabel}>Poop</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={[styles.metricValue, { color: Colors.bothTeal }]}>{uniqueLocations}</Text>
              <Text style={styles.metricLabel}>Lokasi</Text>
            </View>
          </View>
        </View>

        {/* Dukung Aplikasi (Saweria) */}
        <TouchableOpacity style={styles.donationCard} onPress={openDonationSaweria} activeOpacity={0.88}>
          <View style={styles.donationIconBox}>
            <Heart size={20} color="#FF6B6B" fill="#FF6B6B" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.donationTitle}>Dukung Developer di Saweria</Text>
            <Text style={styles.donationSub}>Traktir kopi agar aplikasi tetap gratis & 100% bebas iklan!</Text>
          </View>
          <ExternalLink size={16} color={Colors.peachTint} />
        </TouchableOpacity>

        {/* KEAMANAN & PRIVASI */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <ShieldCheck size={16} color={Colors.bothTeal} />
            <Text style={styles.sectionHeading}>KEAMANAN & PRIVASI</Text>
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIconBox, { backgroundColor: 'rgba(245, 183, 0, 0.15)' }]}>
                <Lock size={16} color={Colors.peeAmber} />
              </View>
              <View>
                <Text style={styles.settingLabel}>App Lock (Biometrik)</Text>
                <Text style={styles.settingDesc}>Kunci layar aplikasi dengan Face ID / Sidik Jari</Text>
              </View>
            </View>
            <Switch
              value={appLockEnabled}
              onValueChange={handleToggleAppLock}
              trackColor={{ false: Colors.darkBorder, true: Colors.peeAmber }}
              thumbColor={Colors.creamBg}
            />
          </View>

          <View style={styles.privacyNoteBox}>
            <Text style={styles.privacyNoteText}>
              🛡️ <Text style={{ fontWeight: '800', color: Colors.creamBg }}>Prinsip Privasi Mutlak:</Text> Data buang air tersimpan di SQLite HP Anda, tidak diunggah ke pihak ketiga, dan tidak ada pelacakan iklan.
            </Text>
          </View>
        </View>

        {/* PORTABILITAS & CADANGAN DATA */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Download size={16} color={Colors.bothTeal} />
            <Text style={styles.sectionHeading}>PORTABILITAS DATA</Text>
          </View>

          {/* Ekspor JSON */}
          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => {
              setExportSuccess(false);
              setExportModalVisible(true);
            }}
          >
            <View style={styles.actionLeft}>
              <View style={[styles.settingIconBox, { backgroundColor: 'rgba(47, 184, 172, 0.15)' }]}>
                <FileText size={16} color={Colors.bothTeal} />
              </View>
              <View>
                <Text style={styles.actionLabel}>Cadangkan & Ekspor Data</Text>
                <Text style={styles.actionDesc}>Simpan salinan berkas riwayat format JSON</Text>
              </View>
            </View>
            <Share2 size={16} color={Colors.peachTint} />
          </TouchableOpacity>

          {/* Impor JSON */}
          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => {
              setImportResult(null);
              setImportModalVisible(true);
            }}
          >
            <View style={styles.actionLeft}>
              <View style={[styles.settingIconBox, { backgroundColor: 'rgba(245, 183, 0, 0.15)' }]}>
                <Upload size={16} color={Colors.peeAmber} />
              </View>
              <View>
                <Text style={styles.actionLabel}>Pulihkan & Impor Data</Text>
                <Text style={styles.actionDesc}>Muat riwayat catatan dari berkas JSON cadangan</Text>
              </View>
            </View>
            <Download size={16} color={Colors.peachTint} />
          </TouchableOpacity>
        </View>

        {/* ZONA DATA PRIBADI (HAPUS RIWAYAT) */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Trash2 size={16} color={Colors.emergencyRed} />
            <Text style={[styles.sectionHeading, { color: Colors.emergencyRed }]}>ZONA DATA PRIBADI</Text>
          </View>

          <TouchableOpacity
            style={[styles.actionRow, { borderColor: 'rgba(255, 90, 95, 0.3)' }]}
            onPress={() => setDeleteModalVisible(true)}
          >
            <View style={styles.actionLeft}>
              <View style={[styles.settingIconBox, { backgroundColor: 'rgba(255, 90, 95, 0.15)' }]}>
                <Trash2 size={16} color={Colors.emergencyRed} />
              </View>
              <View>
                <Text style={[styles.actionLabel, { color: Colors.emergencyRed }]}>Hapus Riwayat Data Lokal</Text>
                <Text style={styles.actionDesc}>Bersihkan seluruh catatan dari memori ponsel</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Footer Info */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Poop Pee Log Mobile • v1.0.0</Text>
          <Text style={styles.footerSubText}>Dibuat dengan ❤️ untuk kenyamanan biologis Anda</Text>
        </View>
      </ScrollView>

      {/* 1. MODAL EKSPOR DATA LEBIH MENARIK */}
      <Modal
        visible={exportModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setExportModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeaderRow}>
              <View style={[styles.modalIconRing, { backgroundColor: 'rgba(47, 184, 172, 0.2)' }]}>
                <Download size={24} color={Colors.bothTeal} />
              </View>
              <TouchableOpacity onPress={() => setExportModalVisible(false)} style={styles.modalCloseIcon}>
                <X size={18} color={Colors.peachTint} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalHeading}>Ekspor Cadangan Data</Text>
            <Text style={styles.modalDescription}>
              Data Anda akan diekspor dalam format <Text style={{ fontWeight: '800', color: Colors.creamBg }}>JSON standar</Text>. Anda dapat menyimpannya ke berkas, Google Drive, atau mengirimkannya ke perangkat lain.
            </Text>

            {/* Kotak Ringkasan Data yang Diekspor */}
            <View style={styles.exportSummaryCard}>
              <View style={styles.exportSummaryRow}>
                <Text style={styles.exportSummaryKey}>Total Riwayat Log:</Text>
                <Text style={styles.exportSummaryVal}>{totalLogs} Catatan</Text>
              </View>
              <View style={styles.exportSummaryRow}>
                <Text style={styles.exportSummaryKey}>Format Berkas:</Text>
                <Text style={styles.exportSummaryVal}>application/json</Text>
              </View>
              <View style={styles.exportSummaryRow}>
                <Text style={styles.exportSummaryKey}>Status Enkripsi:</Text>
                <Text style={[styles.exportSummaryVal, { color: Colors.bothTeal }]}>Lokal & Terbaca</Text>
              </View>
            </View>

            {exportSuccess && (
              <View style={styles.successBadgeBox}>
                <CheckCircle size={14} color={Colors.bothTeal} />
                <Text style={styles.successBadgeText}>Berhasil dibagikan / dicadangkan!</Text>
              </View>
            )}

            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={styles.cancelModalBtn}
                onPress={() => setExportModalVisible(false)}
              >
                <Text style={styles.cancelModalBtnText}>Tutup</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmExportBtn}
                onPress={executeShareJSON}
                disabled={isExporting}
              >
                <Share2 size={16} color="#000" />
                <Text style={styles.confirmExportBtnText}>
                  {isExporting ? 'Menyiapkan...' : 'Bagikan / Simpan'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 2. MODAL IMPOR DATA JSON */}
      <Modal
        visible={importModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setImportModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeaderRow}>
              <View style={[styles.modalIconRing, { backgroundColor: 'rgba(245, 183, 0, 0.2)' }]}>
                <Upload size={24} color={Colors.peeAmber} />
              </View>
              <TouchableOpacity onPress={() => setImportModalVisible(false)} style={styles.modalCloseIcon}>
                <X size={18} color={Colors.peachTint} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalHeading}>Impor Cadangan Data</Text>
            <Text style={styles.modalDescription}>
              Pilih berkas <Text style={{ fontWeight: '800', color: Colors.creamBg }}>JSON</Text> cadangan PoopPeeLog dari penyimpanan ponsel Anda. Catatan yang ada tidak akan terhapus, data baru akan digabungkan.
            </Text>

            {/* Kotak Info Format */}
            <View style={styles.exportSummaryCard}>
              <View style={styles.exportSummaryRow}>
                <Text style={styles.exportSummaryKey}>Format Target:</Text>
                <Text style={styles.exportSummaryVal}>JSON (.json)</Text>
              </View>
              <View style={styles.exportSummaryRow}>
                <Text style={styles.exportSummaryKey}>Strategi:</Text>
                <Text style={[styles.exportSummaryVal, { color: Colors.bothTeal }]}>Merge / Insert OR Replace</Text>
              </View>
              <View style={styles.exportSummaryRow}>
                <Text style={styles.exportSummaryKey}>Jumlah Log Saat Ini:</Text>
                <Text style={styles.exportSummaryVal}>{totalLogs} Catatan</Text>
              </View>
            </View>

            {/* Notifikasi Hasil Import */}
            {importResult && (
              <View
                style={[
                  styles.successBadgeBox,
                  importResult.error
                    ? { backgroundColor: 'rgba(255, 90, 95, 0.15)' }
                    : { backgroundColor: 'rgba(47, 184, 172, 0.15)' },
                ]}
              >
                {importResult.error ? (
                  <>
                    <AlertTriangle size={15} color={Colors.emergencyRed} />
                    <Text style={[styles.successBadgeText, { color: Colors.emergencyRed, flex: 1 }]}>
                      {importResult.error}
                    </Text>
                  </>
                ) : (
                  <>
                    <CheckCircle size={15} color={Colors.bothTeal} />
                    <Text style={[styles.successBadgeText, { color: Colors.bothTeal, flex: 1 }]}>
                      Sukses mengimpor {importResult.count} catatan baru!
                    </Text>
                  </>
                )}
              </View>
            )}

            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={styles.cancelModalBtn}
                onPress={() => setImportModalVisible(false)}
              >
                <Text style={styles.cancelModalBtnText}>Tutup</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.confirmExportBtn, { backgroundColor: Colors.bothTeal }]}
                onPress={executePickAndImportJSON}
                disabled={isImporting}
              >
                <Upload size={16} color="#000" />
                <Text style={styles.confirmExportBtnText}>
                  {isImporting ? 'Membaca...' : 'Pilih Berkas JSON'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 3. MODAL KONFIRMASI HAPUS DATA LEBIH INFORMATIF */}
      <Modal
        visible={deleteModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeaderRow}>
              <View style={[styles.modalIconRing, { backgroundColor: 'rgba(255, 90, 95, 0.2)' }]}>
                <AlertTriangle size={24} color={Colors.emergencyRed} />
              </View>
              <TouchableOpacity onPress={() => setDeleteModalVisible(false)} style={styles.modalCloseIcon}>
                <X size={18} color={Colors.peachTint} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.modalHeading, { color: Colors.emergencyRed }]}>Hapus Seluruh Riwayat?</Text>
            <Text style={styles.modalDescription}>
              Tindakan ini akan menghapus permanen sebanyak <Text style={{ fontWeight: '900', color: Colors.creamBg }}>{totalLogs} catatan</Text> buang air dari memori lokal HP Anda.
            </Text>

            <View style={styles.warningAlertBox}>
              <Text style={styles.warningAlertText}>
                ⚠️ <Text style={{ fontWeight: '800' }}>Peringatan Penting:</Text> Riwayat yang telah dihapus <Text style={{ fontWeight: '800' }}>tidak dapat dipulihkan kembali</Text>. Pastikan Anda sudah mengekspor cadangan jika sewaktu-waktu masih dibutuhkan.
              </Text>
            </View>

            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={styles.cancelModalBtn}
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text style={styles.cancelModalBtnText}>Batal</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmDeleteBtn}
                onPress={executeClearData}
              >
                <Trash2 size={16} color="#FFF" />
                <Text style={styles.confirmDeleteBtnText}>Ya, Hapus Permanen</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  scrollContent: {
    padding: 16,
    paddingBottom: 110,
    gap: 14,
  },
  profileCard: {
    backgroundColor: 'rgba(46, 40, 35, 0.96)',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(245, 183, 0, 0.4)',
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  profileAvatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniMascotWrapper: {
    width: 56,
    height: 56,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  profileName: {
    fontSize: 17,
    fontWeight: '900',
    color: Colors.creamBg,
  },
  guestBadge: {
    backgroundColor: 'rgba(47, 184, 172, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(47, 184, 172, 0.4)',
  },
  guestBadgeText: {
    fontSize: 8,
    fontWeight: '900',
    color: Colors.bothTeal,
  },
  profileMemberSince: {
    fontSize: 11,
    color: Colors.peachTint,
    opacity: 0.6,
    marginTop: 2,
  },
  profileId: {
    fontSize: 10,
    color: Colors.peachTint,
    opacity: 0.45,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginTop: 2,
  },
  metricsStrip: {
    flexDirection: 'row',
    backgroundColor: Colors.darkBg,
    borderRadius: 16,
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: Colors.darkBorder,
  },
  metricItem: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 15,
    fontWeight: '900',
    color: Colors.creamBg,
  },
  metricLabel: {
    fontSize: 9,
    color: Colors.peachTint,
    opacity: 0.6,
    marginTop: 2,
    fontWeight: '700',
  },
  metricDivider: {
    width: 1,
    height: 20,
    backgroundColor: Colors.darkBorder,
  },
  donationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 107, 107, 0.35)',
    borderRadius: 20,
    padding: 14,
    gap: 12,
  },
  donationIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  donationTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: Colors.creamBg,
  },
  donationSub: {
    fontSize: 10,
    color: Colors.peachTint,
    opacity: 0.75,
    marginTop: 2,
  },
  section: {
    backgroundColor: Colors.darkSurface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    padding: 16,
    gap: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '900',
    color: Colors.peachTint,
    letterSpacing: 0.8,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    paddingRight: 8,
  },
  settingIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.creamBg,
  },
  settingDesc: {
    fontSize: 10,
    color: Colors.peachTint,
    opacity: 0.6,
    marginTop: 1,
  },
  privacyNoteBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 12,
    padding: 10,
    marginTop: 4,
  },
  privacyNoteText: {
    fontSize: 11,
    color: Colors.peachTint,
    opacity: 0.8,
    lineHeight: 16,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.18)',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.creamBg,
  },
  actionDesc: {
    fontSize: 10,
    color: Colors.peachTint,
    opacity: 0.6,
    marginTop: 1,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 14,
    gap: 4,
  },
  footerText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.peachTint,
    opacity: 0.5,
  },
  footerSubText: {
    fontSize: 10,
    color: Colors.peachTint,
    opacity: 0.4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.78)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    backgroundColor: Colors.darkBg,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: Colors.darkBorder,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  modalIconRing: {
    width: 46,
    height: 46,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseIcon: {
    padding: 6,
    borderRadius: 12,
    backgroundColor: Colors.darkSurface,
  },
  modalHeading: {
    fontSize: 17,
    fontWeight: '900',
    color: Colors.creamBg,
    marginBottom: 6,
  },
  modalDescription: {
    fontSize: 12,
    color: Colors.peachTint,
    opacity: 0.8,
    lineHeight: 18,
    marginBottom: 14,
  },
  exportSummaryCard: {
    backgroundColor: Colors.darkSurface,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    gap: 6,
    marginBottom: 14,
  },
  exportSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exportSummaryKey: {
    fontSize: 11,
    color: Colors.peachTint,
    opacity: 0.6,
  },
  exportSummaryVal: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.creamBg,
  },
  successBadgeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(47, 184, 172, 0.15)',
    padding: 10,
    borderRadius: 10,
    marginBottom: 14,
  },
  successBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.bothTeal,
  },
  warningAlertBox: {
    backgroundColor: 'rgba(255, 90, 95, 0.12)',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 90, 95, 0.35)',
    marginBottom: 16,
  },
  warningAlertText: {
    fontSize: 11,
    color: Colors.emergencyRed,
    lineHeight: 17,
  },
  modalButtonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  cancelModalBtn: {
    flex: 1,
    backgroundColor: Colors.darkSurface,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.darkBorder,
  },
  cancelModalBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.peachTint,
  },
  confirmExportBtn: {
    flex: 2,
    backgroundColor: Colors.peeAmber,
    borderRadius: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  confirmExportBtnText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#000',
  },
  confirmDeleteBtn: {
    flex: 2,
    backgroundColor: Colors.emergencyRed,
    borderRadius: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  confirmDeleteBtnText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFF',
  },
});
