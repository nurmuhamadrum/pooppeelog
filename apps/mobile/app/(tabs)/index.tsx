import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import MapView, { Marker, Callout, PROVIDER_DEFAULT } from 'react-native-maps';
import { Colors } from '@/constants/Colors';
import { darkMapStyle } from '@/constants/MapStyle';
import { useAppStore } from '@/src/store/useAppStore';
import { Log } from '@poop-pee-log/shared';
import { Eye, EyeOff, Navigation, Clock, MapPin } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.08;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default function MapScreen() {
  const { logs, mapFilter, setMapFilter, blurLocation, toggleBlurLocation, initialize, isLoading } =
    useAppStore();

  const mapRef = useRef<MapView>(null);
  const [selectedLog, setSelectedLog] = useState<Log | null>(null);

  useEffect(() => {
    initialize();
  }, []);

  // Filter log berdasarkan Pee / Poop / Semua
  const filteredLogs = logs.filter((log) => {
    if (mapFilter === 'ALL') return true;
    return log.type === mapFilter;
  });

  // Tentukan pusat peta (dari log paling terakhir atau default Jakarta Pusat)
  const initialRegion = {
    latitude: logs[0] ? (blurLocation && logs[0].blurredLatitude ? logs[0].blurredLatitude : logs[0].latitude) : -6.1944,
    longitude: logs[0] ? (blurLocation && logs[0].blurredLongitude ? logs[0].blurredLongitude : logs[0].longitude) : 106.8229,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  };

  const centerOnLatest = () => {
    if (logs[0] && mapRef.current) {
      const lat = blurLocation && logs[0].blurredLatitude ? logs[0].blurredLatitude : logs[0].latitude;
      const lng = blurLocation && logs[0].blurredLongitude ? logs[0].blurredLongitude : logs[0].longitude;
      mapRef.current.animateToRegion({
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.03,
        longitudeDelta: 0.03 * ASPECT_RATIO,
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* 1. NATIVE MAP VIEW */}
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        provider={PROVIDER_DEFAULT}
        initialRegion={initialRegion}
        customMapStyle={darkMapStyle}
        showsUserLocation
        showsMyLocationButton={false}
        showsCompass={false}
        toolbarEnabled={false}
      >
        {filteredLogs.map((log) => {
          const isPee = log.type === 'PEE';
          const lat = blurLocation && log.blurredLatitude ? log.blurredLatitude : log.latitude;
          const lng = blurLocation && log.blurredLongitude ? log.blurredLongitude : log.longitude;

          return (
            <Marker
              key={log.id}
              coordinate={{ latitude: lat, longitude: lng }}
              onPress={() => setSelectedLog(log)}
            >
              {/* Custom Pin Marker */}
              <View
                style={[
                  styles.customMarker,
                  {
                    backgroundColor: isPee ? Colors.peeAmber : Colors.poopBrown,
                    borderColor: Colors.darkBg,
                  },
                ]}
              >
                <Text style={styles.markerEmoji}>{isPee ? '💧' : '💩'}</Text>
              </View>

              {/* Native Callout */}
              <Callout tooltip>
                <View style={styles.calloutContainer}>
                  <Text style={styles.calloutTitle}>
                    {isPee ? "Lil' Drip (Kencing)" : 'Mr. Plop (BAB)'}
                  </Text>
                  <Text style={styles.calloutLocation}>
                    {log.district}, {log.city}
                  </Text>
                  <Text style={styles.calloutTime}>
                    {new Date(log.loggedAt).toLocaleTimeString('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}{' '}
                    • Mood: {log.mood || 'Lega'}
                  </Text>
                  {Boolean(log.note) && (
                    <Text style={styles.calloutNote}>"{log.note}"</Text>
                  )}
                  {blurLocation && (
                    <Text style={styles.calloutBlurHint}>🛡️ Lokasi dikaburkan 50m</Text>
                  )}
                </View>
              </Callout>
            </Marker>
          );
        })}
      </MapView>

      {/* 2. TOP FILTER BAR & BLUR TOGGLE */}
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

      {/* 3. FLOATING ACTION: RE-CENTER BUTTON */}
      <TouchableOpacity style={styles.recenterBtn} onPress={centerOnLatest}>
        <Navigation size={20} color={Colors.creamBg} />
      </TouchableOpacity>

      {/* 4. BOTTOM FLOATING PRIVACY PILL */}
      {blurLocation && (
        <View style={styles.bottomPrivacyBadge}>
          <Text style={styles.bottomPrivacyText}>🛡️ Mode Blur 50m Aktif (Privasi Rumah Aman)</Text>
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
  topFilterBar: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterPills: {
    flexDirection: 'row',
    backgroundColor: 'rgba(46, 40, 35, 0.92)',
    borderRadius: 22,
    padding: 4,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
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
    backgroundColor: 'rgba(46, 40, 35, 0.92)',
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  blurBtnActive: {
    borderColor: Colors.bothTeal,
  },
  recenterBtn: {
    position: 'absolute',
    right: 16,
    bottom: 30,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.darkSurface,
    borderWidth: 1.5,
    borderColor: Colors.darkBorder,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  bottomPrivacyBadge: {
    position: 'absolute',
    bottom: 30,
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
    fontSize: 11,
    fontWeight: '800',
  },
  customMarker: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
  markerEmoji: {
    fontSize: 18,
  },
  calloutContainer: {
    backgroundColor: Colors.darkSurface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    padding: 14,
    minWidth: 180,
    maxWidth: 240,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  calloutTitle: {
    color: Colors.creamBg,
    fontWeight: '900',
    fontSize: 13,
    marginBottom: 2,
  },
  calloutLocation: {
    color: Colors.peachTint,
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 4,
  },
  calloutTime: {
    color: Colors.peachTint,
    opacity: 0.65,
    fontSize: 10,
  },
  calloutNote: {
    marginTop: 6,
    padding: 6,
    backgroundColor: Colors.darkBg,
    borderRadius: 8,
    color: Colors.peachTint,
    fontSize: 10,
    fontStyle: 'italic',
  },
  calloutBlurHint: {
    marginTop: 6,
    color: Colors.bothTeal,
    fontSize: 9,
    fontWeight: '800',
  },
});
