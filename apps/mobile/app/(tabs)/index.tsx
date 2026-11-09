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
import { Navigation, X, ChevronRight, Calendar, Clock, Smile, FileText, MapPin } from 'lucide-react-native';

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
  const filteredLogs = useMemo(() => {
    return displayLogs.filter((log) => {
      if (mapFilter === 'ALL') return true;
      if (mapFilter === 'PEE') return log.type === 'PEE';
      if (mapFilter === 'POOP') return log.type === 'POOP';
      if (mapFilter === 'COMBO') return log.type === 'COMBO';
      return true;
    });
  }, [displayLogs, mapFilter]);

  // GROUPING LOGS PADA LOKASI YANG SAMA
  // Membulatkan koordinat ke 4 desimal (~10 meter) sehingga log di toilet yang sama menyatu jadi 1 pin akurat dengan badge count
  const locationGroups: LocationGroup[] = useMemo(() => {
    const map = new Map<string, LocationGroup>();

    filteredLogs.forEach((log) => {
      // Pembulatan 4 angka desimal (~11 meter)
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
          const isPee = log.type === 'PEE';
          const isPoop = log.type === 'POOP';
          const isCombo = log.type === 'COMBO';
          const isSelected = selectedGroup?.key === group.key;
          const count = group.logs.length;

          const markerBg = isPee ? Colors.peeAmber : isPoop ? Colors.poopBrown : Colors.bothTeal;

          return (
            <Marker
              key={group.key}
              coordinate={{ latitude: group.latitude, longitude: group.longitude }}
              onPress={() => setSelectedGroup(group)}
              tracksViewChanges={false}
              centerOffset={{ x: 0, y: -18 }}
            >
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
                  {isPee && <LilDripIcon size={22} />}
                  {isPoop && <MrPlopIcon size={22} />}
                  {isCombo && <SirFlushIcon size={22} />}

                  {/* Badge Counter jika lebih dari 1 log di titik ini */}
                  {count > 1 && (
                    <View style={styles.countBadge}>
                      <Text style={styles.countBadgeText}>{count}</Text>
                    </View>
                  )}
                </View>

                {/* Tiny needle pointer */}
                <View style={[styles.pinNeedle, { backgroundColor: markerBg }]} />
              </View>
            </Marker>
          );
        })}
      </MapView>

      {/* 2. TOP FILTER PILLS BAR */}
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
                💧 Pee ({displayLogs.filter((l: any) => l.type === 'PEE').length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.pill, mapFilter === 'POOP' && styles.pillActive]}
              onPress={() => setMapFilter('POOP')}
            >
              <Text style={[styles.pillText, mapFilter === 'POOP' && styles.pillTextActive]}>
                💩 Poop ({displayLogs.filter((l: any) => l.type === 'POOP').length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.pill, mapFilter === 'COMBO' && styles.pillActive]}
              onPress={() => setMapFilter('COMBO')}
            >
              <Text style={[styles.pillText, mapFilter === 'COMBO' && styles.pillTextActive]}>
                🚽 Flush ({displayLogs.filter((l: any) => l.type === 'COMBO').length})
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      {/* 3. FLOATING ACTION: RE-CENTER KE LOKASI GPS PENGGUNA */}
      <TouchableOpacity style={styles.recenterBtn} onPress={centerOnUser}>
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
                    selectedGroup.latestLog.type === 'PEE'
                      ? Colors.peeAmber
                      : selectedGroup.latestLog.type === 'POOP'
                      ? Colors.poopBrown
                      : Colors.bothTeal,
                },
              ]}
            >
              {selectedGroup.latestLog.type === 'PEE' && <LilDripIcon size={26} />}
              {selectedGroup.latestLog.type === 'POOP' && <MrPlopIcon size={26} />}
              {selectedGroup.latestLog.type === 'COMBO' && <SirFlushIcon size={26} />}
            </View>

            <View style={{ flex: 1 }}>
              <View style={styles.popupTitleRow}>
                <Text style={styles.popupTitle}>
                  {selectedGroup.latestLog.type === 'PEE'
                    ? "Lil' Drip • "
                    : selectedGroup.latestLog.type === 'POOP'
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
                    {selectedGroup.logs.filter((l) => l.type === 'PEE').length}
                  </Text>
                  <Text style={styles.statSummaryLabel}>Pee</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statSummaryItem}>
                  <Text style={[styles.statSummaryNumber, { color: Colors.peachTint }]}>
                    {selectedGroup.logs.filter((l) => l.type === 'POOP').length}
                  </Text>
                  <Text style={styles.statSummaryLabel}>Poop</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statSummaryItem}>
                  <Text style={[styles.statSummaryNumber, { color: Colors.bothTeal }]}>
                    {selectedGroup.logs.filter((l) => l.type === 'COMBO').length}
                  </Text>
                  <Text style={styles.statSummaryLabel}>Sir Flush</Text>
                </View>
              </View>

              <Text style={styles.timelineSectionTitle}>Riwayat Catatan di Titik Ini</Text>

              <ScrollView style={styles.logList} showsVerticalScrollIndicator={false}>
                {selectedGroup.logs.map((item, idx) => {
                  const isPee = item.type === 'PEE';
                  const isPoop = item.type === 'POOP';
                  const isCombo = item.type === 'COMBO';
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
    marginTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 28) + 12 : 12,
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
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
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
    overflow: 'visible',
  },
  pinCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 6,
  },
  pinCircleSelected: {
    transform: [{ scale: 1.15 }],
    borderWidth: 3,
    borderColor: '#FFF',
  },
  countBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: Colors.emergencyRed,
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: Colors.darkBg,
    zIndex: 99,
  },
  countBadgeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '900',
  },
  pinNeedle: {
    width: 8,
    height: 8,
    transform: [{ rotate: '45deg' }],
    marginTop: -4,
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
