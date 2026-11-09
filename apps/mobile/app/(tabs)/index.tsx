import React, { useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useAppStore } from '@/src/store/useAppStore';
import { MapPin, Navigation, Eye, EyeOff } from 'lucide-react-native';

export default function MapScreen() {
  const { logs, mapFilter, setMapFilter, blurLocation, toggleBlurLocation, initialize, isLoading } =
    useAppStore();

  useEffect(() => {
    initialize();
  }, []);

  const filteredLogs = logs.filter((log) => {
    if (mapFilter === 'ALL') return true;
    return log.type === mapFilter;
  });

  return (
    <View style={styles.container}>
      {/* Filter Floating Chips Bar */}
      <View style={styles.topFilterBar}>
        <View style={styles.filterPills}>
          <TouchableOpacity
            style={[styles.pill, mapFilter === 'ALL' && styles.pillActive]}
            onPress={() => setMapFilter('ALL')}
          >
            <Text style={[styles.pillText, mapFilter === 'ALL' && styles.pillTextActive]}>
              Semua ({logs.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.pill, mapFilter === 'PEE' && styles.pillActive]}
            onPress={() => setMapFilter('PEE')}
          >
            <Text style={[styles.pillText, mapFilter === 'PEE' && styles.pillTextActive]}>
              💧 Pee ({logs.filter((l) => l.type === 'PEE').length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.pill, mapFilter === 'POOP' && styles.pillActive]}
            onPress={() => setMapFilter('POOP')}
          >
            <Text style={[styles.pillText, mapFilter === 'POOP' && styles.pillTextActive]}>
              💩 Poop ({logs.filter((l) => l.type === 'POOP').length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Privacy Blur Toggle */}
        <TouchableOpacity
          style={[styles.blurBtn, blurLocation && styles.blurBtnActive]}
          onPress={toggleBlurLocation}
          accessibilityLabel="Pengaburan Lokasi 50m"
        >
          {blurLocation ? <EyeOff size={16} color={Colors.bothTeal} /> : <Eye size={16} color={Colors.peachTint} />}
        </TouchableOpacity>
      </View>

      {/* Map Content View / Placeholder */}
      <View style={styles.mapArea}>
        <View style={styles.centerCard}>
          <Navigation size={36} color={Colors.peeAmber} style={styles.navIcon} />
          <Text style={styles.cardHeading}>Peta Jejak Pribadi</Text>
          <Text style={styles.cardDesc}>
            {filteredLogs.length > 0
              ? `${filteredLogs.length} titik kelegaan tersimpan aman di database lokal.`
              : 'Belum ada catatan log. Ketuk tombol (+) kuning di bawah untuk mencatat buang air pertamamu!'}
          </Text>

          {blurLocation && (
            <View style={styles.privacyBadge}>
              <Text style={styles.privacyText}>🛡️ Mode Blur 50m Aktif (Privasi Terjaga)</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.darkBg,
  },
  topFilterBar: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  filterPills: {
    flexDirection: 'row',
    backgroundColor: Colors.darkSurface,
    borderRadius: 20,
    padding: 4,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    flex: 1,
  },
  pill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 16,
    alignItems: 'center',
  },
  pillActive: {
    backgroundColor: Colors.peeAmber,
  },
  pillText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.peachTint,
  },
  pillTextActive: {
    color: '#000',
    fontWeight: '900',
  },
  blurBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.darkSurface,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blurBtnActive: {
    borderColor: Colors.bothTeal,
  },
  mapArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  centerCard: {
    backgroundColor: Colors.darkSurface,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
    maxWidth: 340,
  },
  navIcon: {
    marginBottom: 12,
  },
  cardHeading: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.creamBg,
    marginBottom: 8,
  },
  cardDesc: {
    fontSize: 13,
    color: Colors.peachTint,
    opacity: 0.8,
    textAlign: 'center',
    lineHeight: 18,
  },
  privacyBadge: {
    marginTop: 16,
    backgroundColor: 'rgba(47, 184, 172, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(47, 184, 172, 0.3)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  privacyText: {
    color: Colors.bothTeal,
    fontSize: 11,
    fontWeight: '800',
  },
});
