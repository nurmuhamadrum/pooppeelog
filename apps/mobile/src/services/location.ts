import * as Location from 'expo-location';

export interface LocationResult {
  latitude: number;
  longitude: number;
  altitude?: number;
  city: string;
  district: string;
  subdistrict?: string;
  country: string;
}

export async function getCurrentLocationWithAddress(): Promise<LocationResult> {
  // Default fallback (Pusat Jakarta) bila izin belum diizinkan atau offline
  const fallback: LocationResult = {
    latitude: -6.1944,
    longitude: 106.8229,
    city: 'Jakarta Pusat',
    district: 'Menteng',
    country: 'Indonesia',
  };

  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return fallback;
    }

    // Ambil koordinat GPS kilat (balanced accuracy untuk kecepatan < 500ms)
    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const alt = position.coords.altitude ?? undefined;

    // Reverse geocode ke nama kecamatan & kota
    try {
      const addresses = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
      if (addresses && addresses.length > 0) {
        const addr = addresses[0];
        return {
          latitude: lat,
          longitude: lng,
          altitude: alt,
          city: addr.city || addr.subregion || 'Jakarta',
          district: addr.district || addr.region || 'Menteng',
          subdistrict: addr.street || undefined,
          country: addr.country || 'Indonesia',
        };
      }
    } catch (geoError) {
      // Jika reverse geocode gagal (misal sedang offline total), tetap gunakan lat/lng asli
    }

    return {
      latitude: lat,
      longitude: lng,
      altitude: alt,
      city: 'Lokasi Lokal',
      district: 'Sekitar Sini',
      country: 'Indonesia',
    };
  } catch (err) {
    return fallback;
  }
}

