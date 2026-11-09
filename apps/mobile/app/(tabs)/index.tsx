import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Platform,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import * as Location from 'expo-location';
import { Colors } from '@/constants/Colors';
import { darkMapStyle } from '@/constants/MapStyle';
import { useAppStore } from '@/src/store/useAppStore';
import { MrPlopIcon, LilDripIcon } from '@/src/components/MascotIcons';
import { Log } from '@poop-pee-log/shared';
import { Eye, EyeOff, Navigation, X } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.04;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

// Mock seed pins awal (seperti pada interactive phone simulator di web)
const DEFAULT_INITIAL_PINS: Partial<Log>[] = [
  {
    id: 'seed-menteng',
    type: 'PEE',
    district: 'Menteng',
    city: 'Jakarta Pusat',
    mood: 'Lega Banget 😌',
    note: 'Setelah meeting 3 jam akhirnya plong!',
    latitude: -6.1944,
    longitude: 106.8229,
    loggedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'seed-gi',
    type: 'POOP',
    district: 'Grand Indonesia',
    city: 'Jakarta Pusat',
    mood: 'Masih Ganjel ⏱️',
    note: 'Kloset otomatisnya dingin bgt',
    latitude: -6.1952,
    longitude: 106.8202,
    loggedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'seed-scbd',
    type: 'PEE',
    district: 'SCBD Sudirman',
    city: 'Jakarta Selatan',
    mood: 'Kombo Sukses 🚽',
    note: 'Paket kombo pee & poop sebelum makan siang',
    latitude: -6.2255,
    longitude: 106.8094,
    loggedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
  },
  {
    id: 'seed-gbk',
    type: 'PEE',
    district: 'Gelora Bung Karno',
    city: 'Jakarta Pusat',
    mood: 'Nahan Lama 🏃',
    note: 'Jogging sore lalu kebelet',
    latitude: -6.2185,
    longitude: 106.8026,
    loggedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
];

export default function MapScreen() {
  const { logs, mapFilter, setMapFilter, blurLocation, toggleBlurLocation, initialize } =
    useAppStore();

  const mapRef = useRef<MapView>(null);
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [currentCoord, setCurrentCoord] = useState<{ latitude: number; longitude: number } | null>(
    null
  );

  useEffect(() => {
    initialize();
    fetchUserLocation();
  }, []);

  const fetchUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const pos = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        const targetCoord = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        };

        setCurrentCoord(targetCoord);

        // Langsung arahkan peta ke lokasi GPS pengguna saat ini secara akurat
        if (mapRef.current) {
          mapRef.current.animateToRegion({
            ...targetCoord,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02 * ASPECT_RATIO,
          });
        }
      }
    } catch (err) {
      console.log('Location fetch error:', err);
    }
  };

  // Gabungkan user logs dengan demo seed awal jika log masih kosong
  const displayLogs: any[] = logs.length > 0 ? logs : DEFAULT_INITIAL_PINS;

  const filteredLogs = displayLogs.filter((log) => {
    if (mapFilter === 'ALL') return true;
    return log.type === mapFilter;
  });

  const centerOnUser = () => {
    if (currentCoord && mapRef.current) {
      mapRef.current.animateToRegion({
        ...currentCoord,
        latitudeDelta: 0.015,
        longitudeDelta: 0.015 * ASPECT_RATIO,
      });
    } else {
      fetchUserLocation();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* 1. NATIVE MAP VIEW */}
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        provider={PROVIDER_DEFAULT}
        initialRegion={{
          latitude: currentCoord ? currentCoord.latitude : -6.1944,
          longitude: currentCoord ? currentCoord.longitude : 106.8229,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
        customMapStyle={darkMapStyle}
        showsUserLocation
        showsMyLocationButton={false}
        showsCompass={false}
        toolbarEnabled={false}
      >
        {filteredLogs.map((log) => {
          const isPee = log.type === 'PEE';
          const isSelected = selectedLog?.id === log.id;
          const lat = blurLocation && log.blurredLatitude ? log.blurredLatitude : log.latitude;
          const lng = blurLocation && log.blurredLongitude ? log.blurredLongitude : log.longitude;

          return (
            <Marker
              key={log.id}
              coordinate={{ latitude: lat, longitude: lng }}
              onPress={() => setSelectedLog(log)}
            >
              <View style={styles.markerContainer}>
                {/* Pin Circle Mascot Avatar */}
                <View
                  style={[
                    styles.pinCircle,
                    {
                      backgroundColor: isPee ? Colors.peeAmber : Colors.poopBrown,
                      borderColor: Colors.darkBg,
                    },
                    isSelected && styles.pinCircleSelected,
                  ]}
                >
                  {isPee ? <LilDripIcon size={20} /> : <MrPlopIcon size={20} />}
                </View>
                {/* Tiny needle pointer */}
                <View
                  style={[
                    styles.pinNeedle,
                    { backgroundColor: isPee ? Colors.peeAmber : Colors.poopBrown },
                  ]}
                />

                {/* Badge Label */}
                {isSelected && (
                  <View style={styles.pinBadgeLabel}>
                    <Text style={styles.pinBadgeText}>{log.district || log.city}</Text>
                  </View>
                )}
              </View>
            </Marker>
          );
        })}
      </MapView>

      {/* 2. TOP FILTER PILLS BAR (DIBERI PADDING/MARGIN DARI STATUS BAR) */}
      <SafeAreaView style={styles.safeTopBar} pointerEvents="box-none">
        <View style={styles.topFilterBar}>
          <View style={styles.filterPills}>
            <TouchableOpacity
              style={[styles.pill, mapFilter === 'ALL' && styles.pillActive]}
              onPress={() => setMapFilter('ALL')}
            >
              <Text style={[styles.pillText, mapFilter === 'ALL' && styles.pillTextActive]}>
                Semua ({displayLogs.length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.pill, mapFilter === 'PEE' && styles.pillActive]}
              onPress={() => setMapFilter('PEE')}
            >
              <Text style={[styles.pillText, mapFilter === 'PEE' && styles.pillTextActive]}>
                💧 Pee ({displayLogs.filter((l) => l.type === 'PEE').length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.pill, mapFilter === 'POOP' && styles.pillActive]}
              onPress={() => setMapFilter('POOP')}
            >
              <Text style={[styles.pillText, mapFilter === 'POOP' && styles.pillTextActive]}>
                💩 Poop ({displayLogs.filter((l) => l.type === 'POOP').length})
              </Text>
            </TouchableOpacity>
          </View>

          {/* Privacy Blur Toggle */}
          <TouchableOpacity
            style={[styles.iconButton, blurLocation && styles.blurBtnActive]}
            onPress={toggleBlurLocation}
            accessibilityLabel="Pengaburan Lokasi 50m"
          >
            {blurLocation ? (
              <EyeOff size={18} color={Colors.bothTeal} />
            ) : (
              <Eye size={18} color={Colors.peachTint} />
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* 3. FLOATING ACTION: RE-CENTER KE LOKASI GPS PENGGUNA */}
      <TouchableOpacity style={styles.recenterBtn} onPress={centerOnUser}>
        <Navigation size={20} color={Colors.creamBg} />
      </TouchableOpacity>

      {/* 4. BOTTOM POPUP CARD: SELECTED PIN */}
      {selectedLog && (
        <View style={styles.popupCard}>
          <View style={styles.popupRow}>
            <View
              style={[
                styles.popupAvatar,
                { backgroundColor: selectedLog.type === 'PEE' ? Colors.peeAmber : Colors.poopBrown },
              ]}
            >
              {selectedLog.type === 'PEE' ? <LilDripIcon size={26} /> : <MrPlopIcon size={26} />}
            </View>

            <View style={{ flex: 1 }}>
              <View style={styles.popupTitleRow}>
                <Text style={styles.popupTitle}>
                  {selectedLog.type === 'PEE' ? "Lil' Drip • " : "Mr. Plop • "}
                  {selectedLog.mood || 'Lega Banget'}
                </Text>
                <Text style={styles.popupTime}>
                  {new Date(selectedLog.loggedAt).toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </View>

              <Text style={styles.popupLocation}>
                {selectedLog.district}, {selectedLog.city}
              </Text>

              {Boolean(selectedLog.note) && (
                <Text style={styles.popupNote}>"{selectedLog.note}"</Text>
              )}
            </View>

            <TouchableOpacity onPress={() => setSelectedLog(null)} style={styles.popupCloseBtn}>
              <X size={16} color={Colors.peachTint} />
            </TouchableOpacity>
          </View>

          <View style={styles.popupFooter}>
            <Text style={styles.popupPrivacyText}>
              🛡️ Lokasi terenkripsi & blur 50m
            </Text>
          </View>
        </View>
      )}

      {/* 5. BOTTOM FLOATING PRIVACY PILL */}
      {!selectedLog && blurLocation && (
        <View style={styles.bottomPrivacyBadge}>
          <Text style={styles.bottomPrivacyText}>🛡️ Mode Blur 50m Aktif (Privasi Terjaga)</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.darkBg,
  },
  safeTopBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  topFilterBar: {
    marginTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 28) + 12 : 12,
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterPills: {
    flexDirection: 'row',
    backgroundColor: 'rgba(46, 40, 35, 0.94)',
    borderRadius: 22,
    padding: 4,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 6,
  },
  pill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 18,
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
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(46, 40, 35, 0.94)',
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 6,
  },
  blurBtnActive: {
    borderColor: Colors.bothTeal,
  },
  recenterBtn: {
    position: 'absolute',
    right: 16,
    bottom: 95,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(46, 40, 35, 0.95)',
    borderWidth: 1.5,
    borderColor: Colors.darkBorder,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  bottomPrivacyBadge: {
    position: 'absolute',
    bottom: 90,
    left: 16,
    backgroundColor: 'rgba(30, 26, 23, 0.92)',
    borderWidth: 1,
    borderColor: 'rgba(47, 184, 172, 0.4)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  bottomPrivacyText: {
    color: Colors.bothTeal,
    fontSize: 10,
    fontWeight: '800',
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  pinCircleSelected: {
    transform: [{ scale: 1.2 }],
    borderWidth: 2.5,
    borderColor: '#FFF',
  },
  pinNeedle: {
    width: 6,
    height: 6,
    transform: [{ rotate: '45deg' }],
    marginTop: -3,
  },
  pinBadgeLabel: {
    marginTop: 4,
    backgroundColor: 'rgba(30, 26, 23, 0.96)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
  },
  pinBadgeText: {
    color: Colors.creamBg,
    fontSize: 9,
    fontWeight: '800',
  },
  popupCard: {
    position: 'absolute',
    bottom: 92,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(46, 40, 35, 0.98)',
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    borderRadius: 24,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 10,
  },
  popupRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  popupAvatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  popupTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  popupTitle: {
    color: Colors.creamBg,
    fontSize: 13,
    fontWeight: '900',
  },
  popupTime: {
    color: Colors.peachTint,
    opacity: 0.6,
    fontSize: 10,
  },
  popupLocation: {
    color: Colors.peachTint,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  popupNote: {
    color: Colors.peeAmber,
    fontSize: 11,
    fontStyle: 'italic',
    marginTop: 3,
  },
  popupCloseBtn: {
    padding: 4,
  },
  popupFooter: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(61, 53, 46, 0.7)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  popupPrivacyText: {
    color: Colors.bothTeal,
    fontSize: 10,
    fontWeight: '800',
  },
});
