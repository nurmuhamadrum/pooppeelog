import React from 'react';
import { StyleSheet, View, Text, Switch, TouchableOpacity, Alert, Platform } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useAppStore } from '@/src/store/useAppStore';
import { ShieldCheck, EyeOff, Lock, Trash2, Heart } from 'lucide-react-native';
import { clearAllLocalData } from '@/src/db/sqlite';

export default function SettingsScreen() {
  const { blurLocation, toggleBlurLocation, appLockEnabled, toggleAppLock, userId, initialize } =
    useAppStore();

  const handleClearData = () => {
    Alert.alert(
      'Hapus Seluruh Data?',
      'Tindakan ini akan menghapus semua riwayat catatan buang air dari memori lokal HP Anda secara permanen. Data tidak dapat dipulihkan.',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus Permanen',
          style: 'destructive',
          onPress: async () => {
            await clearAllLocalData();
            await initialize();
            Alert.alert('Selesai', 'Seluruh data telah bersih dihapus.');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Privacy Manifesto Card */}
      <View style={styles.card}>
        <View style={styles.cardRow}>
          <ShieldCheck size={20} color={Colors.bothTeal} />
          <Text style={styles.cardTitle}>Prinsip Privasi 100%</Text>
        </View>
        <Text style={styles.cardText}>
          Poop Pee Log tidak menjual data, tidak menyisipkan iklan pihak ketiga, dan tidak memiliki feed sosial publik.
        </Text>
      </View>

      {/* Switches Section */}
      <View style={styles.section}>
        <Text style={styles.sectionHeading}>KEAMANAN & LOKASI</Text>

        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <EyeOff size={18} color={Colors.peachTint} />
            <View>
              <Text style={styles.settingLabel}>Blur Lokasi 50 Meter</Text>
              <Text style={styles.settingDesc}>Mengacak koordinat presisi demi privasi rumah</Text>
            </View>
          </View>
          <Switch
            value={blurLocation}
            onValueChange={toggleBlurLocation}
            trackColor={{ false: Colors.darkBorder, true: Colors.bothTeal }}
            thumbColor={Colors.creamBg}
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <Lock size={18} color={Colors.peachTint} />
            <View>
              <Text style={styles.settingLabel}>App Lock (Biometrik)</Text>
              <Text style={styles.settingDesc}>Kunci aplikasi dengan FaceID / Fingerprint</Text>
            </View>
          </View>
          <Switch
            value={appLockEnabled}
            onValueChange={toggleAppLock}
            trackColor={{ false: Colors.darkBorder, true: Colors.peeAmber }}
            thumbColor={Colors.creamBg}
          />
        </View>
      </View>

      {/* Danger Zone */}
      <View style={styles.section}>
        <Text style={[styles.sectionHeading, { color: Colors.emergencyRed }]}>ZONA DATA PRIBADI</Text>
        <TouchableOpacity style={styles.dangerBtn} onPress={handleClearData}>
          <Trash2 size={16} color={Colors.emergencyRed} />
          <Text style={styles.dangerBtnText}>Hapus Semua Riwayat Data Lokal</Text>
        </TouchableOpacity>
      </View>

      {/* Footer Info */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Poop Pee Log v1.0.0 (MVP) • Anonymous Guest ID:</Text>
        <Text style={styles.userIdText}>{userId || 'guest'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.darkBg,
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: Colors.darkSurface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    padding: 16,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.creamBg,
  },
  cardText: {
    fontSize: 12,
    color: Colors.peachTint,
    opacity: 0.7,
    lineHeight: 18,
  },
  section: {
    backgroundColor: Colors.darkSurface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    padding: 16,
    gap: 14,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '900',
    color: Colors.peachTint,
    opacity: 0.6,
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
  },
  settingLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.creamBg,
  },
  settingDesc: {
    fontSize: 10,
    color: Colors.peachTint,
    opacity: 0.6,
    marginTop: 2,
  },
  dangerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 90, 95, 0.12)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 90, 95, 0.3)',
  },
  dangerBtnText: {
    color: Colors.emergencyRed,
    fontWeight: '800',
    fontSize: 12,
  },
  footer: {
    marginTop: 'auto',
    alignItems: 'center',
    paddingBottom: 16,
  },
  footerText: {
    fontSize: 10,
    color: Colors.peachTint,
    opacity: 0.5,
  },
  userIdText: {
    fontSize: 10,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: Colors.bothTeal,
    marginTop: 2,
  },
});
