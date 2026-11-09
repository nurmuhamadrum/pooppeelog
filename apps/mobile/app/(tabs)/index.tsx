import React, { useEffect, useState, useRef, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Platform,
  SafeAreaView,
  StatusBar,
  Modal,
  ScrollView,
} from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import * as Location from 'expo-location';
import { Colors } from '@/constants/Colors';
import { darkMapStyle } from '@/constants/MapStyle';
import { useAppStore } from '@/src/store/useAppStore';
import { MrPlopIcon, LilDripIcon, SirFlushIcon } from '@/src/components/MascotIcons';
import { Log } from '@poop-pee-log/shared';
import {
  Navigation,
  X,
  ChevronRight,
  Calendar,
  Clock,
  Smile,
  FileText,
  MapPin,
  Sparkles,
  Layers,
} from 'lucide-react-native';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.04;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

// Mock seed pins awal (lokasi representatif Jakarta)
const DEFAULT_INITIAL_PINS: Partial<Log>[] = [
  {
    id: 'seed-menteng',
    type: 'PEE',
    district: 'Menteng',
    city: 'Jakarta Pusat',
    mood: 'Lega Banget',
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
    mood: 'Plong Sekali',
    note: 'Kloset otomatisnya dingin bgt',
    latitude: -6.1952,
    longitude: 106.8202,
    loggedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'seed-scbd',
    type: 'COMBO',
    district: 'SCBD Sudirman',
    city: 'Jakarta Selatan',
    mood: 'Kombo Sukses',
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
    mood: 'Nahan Lama',
    note: 'Jogging sore lalu kebelet',
    latitude: -6.2185,
    longitude: 106.8026,
    loggedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
];

interface LocationGroup {
  key: string;
  latitude: number;
  longitude: number;
  district: string;
  city: string;
  logs: Log[];
  latestLog: Log;
}

export default function MapScreen() {
  const { logs, mapFilter, setMapFilter, initialize } = useAppStore();

  const mapRef = useRef<MapView>(null);
  const [selectedGroup, setSelectedGroup] = useState<LocationGroup | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
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

  const displayLogs: any[] = logs.length > 0 ? logs : DEFAULT_INITIAL_PINS;

  // Filter jenis buang air
  // Normalisasi type menjadi UPPERCASE agar konsisten saat perbandingan
  const filteredLogs = useMemo(() => {
    return displayLogs.filter((log) => {
      const logType = String(log.type || '').toUpperCase();
      if (mapFilter === 'ALL') return true;
      if (mapFilter === 'PEE') return logType === 'PEE';
      if (mapFilter === 'POOP') return logType === 'POOP';
      if (mapFilter === 'COMBO') return logType === 'COMBO';
      return true;
    });
  }, [displayLogs, mapFilter]);

  // Hitung jumlah masing-masing kategori untuk badge di filter pills
  const counts = useMemo(() => {
    let pee = 0;
    let poop = 0;
    let combo = 0;
    displayLogs.forEach((l) => {
      const t = String(l.type || '').toUpperCase();
      if (t === 'PEE') pee++;
      else if (t === 'POOP') poop++;
      else if (t === 'COMBO') combo++;
    });
    return { all: displayLogs.length, pee, poop, combo };
  }, [displayLogs]);

  // GROUPING LOGS PADA LOKASI YANG SAMA
  const locationGroups: LocationGroup[] = useMemo(() => {
    const map = new Map<string, LocationGroup>();

    filteredLogs.forEach((log) => {
      const latKey = log.latitude.toFixed(4);
      const lngKey = log.longitude.toFixed(4);
      const groupKey = `${latKey}_${lngKey}`;

      if (!map.has(groupKey)) {
        map.set(groupKey, {
          key: groupKey,
          latitude: log.latitude,
          longitude: log.longitude,
          district: log.district || 'Sekitar Sini',
          city: log.city || 'Jakarta',
          logs: [log],
          latestLog: log,
        });
      } else {
        const group = map.get(groupKey)!;
        group.logs.push(log);
      }
    });

    return Array.from(map.values());
  }, [filteredLogs]);

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
        {locationGroups.map((group) => {
          const log = group.latestLog;
          const logType = String(log.type || '').toUpperCase();
          const isPee = logType === 'PEE';
          const isPoop = logType === 'POOP';
          const isCombo = logType === 'COMBO';
          const isSelected = selectedGroup?.key === group.key;
          const count = group.logs.length;

          const markerBg = isPee ? Colors.peeAmber : isPoop ? Colors.poopBrown : Colors.bothTeal;

          return (
            <Marker
              key={group.key}
              coordinate={{ latitude: group.latitude, longitude: group.longitude }}
              onPress={() => setSelectedGroup(group)}
              tracksViewChanges={true}
              anchor={{ x: 0.5, y: 0.88 }}
            >
              {/* Outer fixed canvas wrapper untuk mencegah clipping/terpotong di iOS & Android */}
              <View style={styles.markerAnchorWrapper}>
                <View style={styles.markerContainer}>
                  {/* Pin Circle Mascot Avatar */}
                  <View
                    style={[
                      styles.pinCircle,
                      {
                        backgroundColor: markerBg,
                        borderColor: isSelected ? '#FFFFFF' : Colors.darkBg,
                      },
                      isSelected && styles.pinCircleSelected,
                    ]}
                  >
                    {isPee && <LilDripIcon size={20} />}
                    {isPoop && <MrPlopIcon size={20} />}
                    {isCombo && <SirFlushIcon size={20} />}

                    {/* Badge Counter jika lebih dari 1 log di titik ini */}
                    {count > 1 && (
                      <View style={styles.countBadge}>
                        <Text style={styles.countBadgeText}>{count}</Text>
                      </View>
                    )}
                  </View>

                  {/* Tiny needle pointer */}
                  <View style={[styles.pinNeedle, { backgroundColor: markerBg }]} />

                  {/* Pulsing selection ring glow */}
                  {isSelected && <View style={[styles.selectionPulse, { borderColor: markerBg }]} />}
                </View>
              </View>
            </Marker>
          );
        })}
      </MapView>

      {/* 2. TOP FILTER PILLS BAR */}
      <SafeAreaView style={styles.safeTopBar} pointerEvents="box-none">
        <View style={styles.topFilterBar}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterPillsScroll}
          >
            <TouchableOpacity
              style={[styles.pill, mapFilter === 'ALL' && styles.pillActive]}
              onPress={() => setMapFilter('ALL')}
              activeOpacity={0.8}
            >
              <Text style={[styles.pillText, mapFilter === 'ALL' && styles.pillTextActive]}>
                Semua ({counts.all})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.pill, mapFilter === 'PEE' && styles.pillActive]}
              onPress={() => setMapFilter('PEE')}
              activeOpacity={0.8}
            >
              <Text style={[styles.pillText, mapFilter === 'PEE' && styles.pillTextActive]}>
                💧 Pee ({counts.pee})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.pill, mapFilter === 'POOP' && styles.pillActive]}
              onPress={() => setMapFilter('POOP')}
              activeOpacity={0.8}
            >
              <Text style={[styles.pillText, mapFilter === 'POOP' && styles.pillTextActive]}>
                💩 Poop ({counts.poop})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.pill,
                mapFilter === 'COMBO' && styles.pillActiveFlush,
              ]}
              onPress={() => setMapFilter('COMBO')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.pillText,
                  mapFilter === 'COMBO' && styles.pillTextActiveDark,
                ]}
              >
                🚽 Flush ({counts.combo})
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Top Floating Stats Pill (Informatif: Total titik & total log aktif) */}
        <View style={styles.mapInfoPillRow} pointerEvents="none">
          <View style={styles.mapInfoPill}>
            <MapPin size={12} color={Colors.peeAmber} />
            <Text style={styles.mapInfoPillText}>
              <Text style={{ fontWeight: '900', color: Colors.creamBg }}>{locationGroups.length}</Text> Titik Terpetakan
            </Text>
            <View style={styles.infoPillDivider} />
            <Layers size={12} color={Colors.bothTeal} />
            <Text style={styles.mapInfoPillText}>
              <Text style={{ fontWeight: '900', color: Colors.creamBg }}>{filteredLogs.length}</Text> Catatan
            </Text>
          </View>
        </View>
      </SafeAreaView>

      {/* 3. FLOATING ACTION: RE-CENTER KE LOKASI GPS PENGGUNA */}
      <TouchableOpacity style={styles.recenterBtn} onPress={centerOnUser} activeOpacity={0.85}>
        <Navigation size={20} color={Colors.creamBg} />
      </TouchableOpacity>

      {/* 4. BOTTOM POPUP CARD: SELECTED LOCATION PIN GROUP */}
      {selectedGroup && (
        <View style={styles.popupCard}>
          <View style={styles.popupRow}>
            <View
              style={[
                styles.popupAvatar,
                {
                  backgroundColor:
                    String(selectedGroup.latestLog.type).toUpperCase() === 'PEE'
                      ? Colors.peeAmber
                      : String(selectedGroup.latestLog.type).toUpperCase() === 'POOP'
                      ? Colors.poopBrown
                      : Colors.bothTeal,
                },
              ]}
            >
              {String(selectedGroup.latestLog.type).toUpperCase() === 'PEE' && <LilDripIcon size={26} />}
              {String(selectedGroup.latestLog.type).toUpperCase() === 'POOP' && <MrPlopIcon size={26} />}
              {String(selectedGroup.latestLog.type).toUpperCase() === 'COMBO' && <SirFlushIcon size={26} />}
            </View>

            <View style={{ flex: 1 }}>
              <View style={styles.popupTitleRow}>
                <Text style={styles.popupTitle}>
                  {String(selectedGroup.latestLog.type).toUpperCase() === 'PEE'
                    ? "Lil' Drip • "
                    : String(selectedGroup.latestLog.type).toUpperCase() === 'POOP'
                    ? "Mr. Plop • "
                    : "Sir Flush • "}
                  {selectedGroup.latestLog.mood || 'Lega Banget'}
                </Text>
                <Text style={styles.popupTime}>
                  {new Date(selectedGroup.latestLog.loggedAt).toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </View>

              <Text style={styles.popupLocation}>
                {selectedGroup.district}, {selectedGroup.city}
              </Text>

              {Boolean(selectedGroup.latestLog.note) && (
                <Text style={styles.popupNote} numberOfLines={2}>
                  "{selectedGroup.latestLog.note}"
                </Text>
              )}
            </View>

            <TouchableOpacity onPress={() => setSelectedGroup(null)} style={styles.popupCloseBtn}>
              <X size={16} color={Colors.peachTint} />
            </TouchableOpacity>
          </View>

          {/* Footer Pop-up Info & Lihat Detail Button */}
          <View style={styles.popupFooter}>
            <Text style={styles.popupLocationCount}>
              📍 {selectedGroup.logs.length} kali buang air di titik ini
            </Text>
            <TouchableOpacity
              style={styles.detailButton}
              onPress={() => setDetailModalVisible(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.detailButtonText}>Lihat Detail</Text>
              <ChevronRight size={14} color={Colors.peeAmber} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* 5. MODAL DETAIL RIWAYAT LOKASI PIN */}
      {selectedGroup && (
        <Modal
          visible={detailModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setDetailModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {/* Header Modal */}
              <View style={styles.modalHeader}>
                <View>
                  <Text style={styles.modalTitle}>Detail Titik Lokasi</Text>
                  <Text style={styles.modalSubtitle}>
                    {selectedGroup.district}, {selectedGroup.city}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setDetailModalVisible(false)}
                  style={styles.modalCloseBtn}
                >
                  <X size={20} color={Colors.peachTint} />
                </TouchableOpacity>
              </View>

              <View style={styles.statSummaryBox}>
                <View style={styles.statSummaryItem}>
                  <Text style={styles.statSummaryNumber}>{selectedGroup.logs.length}</Text>
                  <Text style={styles.statSummaryLabel}>Total Kunjungan</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statSummaryItem}>
                  <Text style={[styles.statSummaryNumber, { color: Colors.peeAmber }]}>
                    {selectedGroup.logs.filter((l) => String(l.type).toUpperCase() === 'PEE').length}
                  </Text>
                  <Text style={styles.statSummaryLabel}>Pee</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statSummaryItem}>
                  <Text style={[styles.statSummaryNumber, { color: Colors.peachTint }]}>
                    {selectedGroup.logs.filter((l) => String(l.type).toUpperCase() === 'POOP').length}
                  </Text>
                  <Text style={styles.statSummaryLabel}>Poop</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statSummaryItem}>
                  <Text style={[styles.statSummaryNumber, { color: Colors.bothTeal }]}>
                    {selectedGroup.logs.filter((l) => String(l.type).toUpperCase() === 'COMBO').length}
                  </Text>
                  <Text style={styles.statSummaryLabel}>Sir Flush</Text>
                </View>
              </View>

              <Text style={styles.timelineSectionTitle}>Riwayat Catatan di Titik Ini</Text>

              <ScrollView style={styles.logList} showsVerticalScrollIndicator={false}>
                {selectedGroup.logs.map((item, idx) => {
                  const t = String(item.type || '').toUpperCase();
                  const isPee = t === 'PEE';
                  const isPoop = t === 'POOP';
                  const isCombo = t === 'COMBO';
                  const logColor = isPee
                    ? Colors.peeAmber
                    : isPoop
                    ? Colors.poopBrown
                    : Colors.bothTeal;

                  const dateObj = new Date(item.loggedAt);
                  const formattedDate = dateObj.toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  });
                  const formattedTime = dateObj.toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <View key={item.id || idx} style={styles.logItemCard}>
                      <View style={[styles.logItemAvatar, { backgroundColor: logColor }]}>
                        {isPee && <LilDripIcon size={22} />}
                        {isPoop && <MrPlopIcon size={22} />}
                        {isCombo && <SirFlushIcon size={22} />}
                      </View>
                      <View style={{ flex: 1 }}>
                        <View style={styles.logItemHeaderRow}>
                          <Text style={styles.logItemTitle}>
                            {isPee
                              ? "Lil' Drip (Pee)"
                              : isPoop
                              ? "Mr. Plop (Poop)"
                              : "Sir Flush (Combo)"}
                          </Text>
                          <Text style={styles.logItemTime}>{formattedTime}</Text>
                        </View>
                        <Text style={styles.logItemDate}>{formattedDate}</Text>

                        {Boolean(item.mood) && (
                          <View style={styles.logItemMoodPill}>
                            <Smile size={11} color={Colors.peeAmber} />
                            <Text style={styles.logItemMoodText}>{item.mood}</Text>
                          </View>
                        )}

                        {Boolean(item.note) && (
                          <View style={styles.logItemNoteBox}>
                            <FileText size={11} color={Colors.peachTint} />
                            <Text style={styles.logItemNoteText}>"{item.note}"</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          </View>
        </Modal>
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
    marginTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 28) + 10 : 10,
    marginHorizontal: 12,
  },
  filterPillsScroll: {
    flexDirection: 'row',
    backgroundColor: 'rgba(46, 40, 35, 0.94)',
    borderRadius: 24,
    padding: 4,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 6,
    gap: 4,
  },
  pill: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillActive: {
    backgroundColor: Colors.peeAmber,
  },
  pillActiveFlush: {
    backgroundColor: Colors.bothTeal,
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
  pillTextActiveDark: {
    color: '#000',
    fontWeight: '900',
  },
  mapInfoPillRow: {
    alignItems: 'center',
    marginTop: 8,
  },
  mapInfoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(30, 26, 23, 0.88)',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(61, 53, 46, 0.8)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  mapInfoPillText: {
    fontSize: 10,
    color: Colors.peachTint,
    opacity: 0.9,
  },
  infoPillDivider: {
    width: 1,
    height: 12,
    backgroundColor: Colors.darkBorder,
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
  markerAnchorWrapper: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
  },
  pinCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 5,
  },
  pinCircleSelected: {
    borderWidth: 2.5,
    borderColor: '#FFF',
    shadowColor: '#FFF',
    shadowOpacity: 0.5,
  },
  countBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: Colors.emergencyRed,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: Colors.darkBg,
  },
  countBadgeText: {
    color: '#FFF',
    fontSize: 8,
    fontWeight: '900',
  },
  pinNeedle: {
    width: 7,
    height: 7,
    transform: [{ rotate: '45deg' }],
    marginTop: -3,
    borderRadius: 1,
  },
  selectionPulse: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    opacity: 0.7,
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
  popupLocationCount: {
    color: Colors.bothTeal,
    fontSize: 11,
    fontWeight: '800',
  },
  detailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(245, 183, 0, 0.15)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(245, 183, 0, 0.4)',
  },
  detailButtonText: {
    color: Colors.peeAmber,
    fontSize: 11,
    fontWeight: '900',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.darkBg,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    maxHeight: '82%',
    borderWidth: 1,
    borderColor: Colors.darkBorder,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.creamBg,
  },
  modalSubtitle: {
    fontSize: 12,
    color: Colors.peachTint,
    opacity: 0.7,
    marginTop: 2,
  },
  modalCloseBtn: {
    backgroundColor: Colors.darkSurface,
    padding: 6,
    borderRadius: 16,
  },
  statSummaryBox: {
    flexDirection: 'row',
    backgroundColor: Colors.darkSurface,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
  },
  statSummaryItem: {
    alignItems: 'center',
  },
  statSummaryNumber: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.creamBg,
  },
  statSummaryLabel: {
    fontSize: 10,
    color: Colors.peachTint,
    opacity: 0.6,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.darkBorder,
  },
  timelineSectionTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: Colors.creamBg,
    marginBottom: 12,
  },
  logList: {
    marginBottom: 10,
  },
  logItemCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.darkSurface,
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    gap: 12,
  },
  logItemAvatar: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logItemHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logItemTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: Colors.creamBg,
  },
  logItemTime: {
    fontSize: 10,
    color: Colors.peachTint,
    opacity: 0.6,
  },
  logItemDate: {
    fontSize: 10,
    color: Colors.peachTint,
    opacity: 0.5,
    marginTop: 1,
  },
  logItemMoodPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(245, 183, 0, 0.12)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginTop: 6,
  },
  logItemMoodText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.peeAmber,
  },
  logItemNoteBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 5,
    marginTop: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    padding: 8,
    borderRadius: 8,
  },
  logItemNoteText: {
    fontSize: 11,
    color: Colors.peachTint,
    opacity: 0.9,
    flex: 1,
  },
});
