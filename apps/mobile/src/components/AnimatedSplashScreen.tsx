import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { MrPlopIcon, LilDripIcon, SirFlushIcon } from '@/src/components/MascotIcons';

const { width } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish: () => void;
}

export const AnimatedSplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  // Animation values
  const bgFadeAnim = useRef(new Animated.Value(0)).current;
  const plopBounce = useRef(new Animated.Value(50)).current;
  const plopOpacity = useRef(new Animated.Value(0)).current;

  const dripBounce = useRef(new Animated.Value(50)).current;
  const dripOpacity = useRef(new Animated.Value(0)).current;

  const flushBounce = useRef(new Animated.Value(50)).current;
  const flushOpacity = useRef(new Animated.Value(0)).current;

  const titleFade = useRef(new Animated.Value(0)).current;
  const titleSlide = useRef(new Animated.Value(20)).current;

  const taglineFade = useRef(new Animated.Value(0)).current;
  const badgeFade = useRef(new Animated.Value(0)).current;

  const screenFadeOut = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Sequence animasi masuk
    Animated.sequence([
      // 1. Fade in background
      Animated.timing(bgFadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),

      // 2. Muncul bergantian 3 maskot dengan efek bounce pegas
      Animated.stagger(140, [
        // Mr. Plop (Coklat)
        Animated.parallel([
          Animated.spring(plopBounce, {
            toValue: 0,
            friction: 5,
            tension: 40,
            useNativeDriver: true,
          }),
          Animated.timing(plopOpacity, {
            toValue: 1,
            duration: 350,
            useNativeDriver: true,
          }),
        ]),
        // Lil' Drip (Kuning di tengah - paling tinggi)
        Animated.parallel([
          Animated.spring(dripBounce, {
            toValue: 0,
            friction: 4,
            tension: 45,
            useNativeDriver: true,
          }),
          Animated.timing(dripOpacity, {
            toValue: 1,
            duration: 350,
            useNativeDriver: true,
          }),
        ]),
        // Sir Flush (Teal)
        Animated.parallel([
          Animated.spring(flushBounce, {
            toValue: 0,
            friction: 5,
            tension: 40,
            useNativeDriver: true,
          }),
          Animated.timing(flushOpacity, {
            toValue: 1,
            duration: 350,
            useNativeDriver: true,
          }),
        ]),
      ]),

      // 3. Judul Brand "Poop Pee Log" muncul
      Animated.parallel([
        Animated.timing(titleFade, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(titleSlide, {
          toValue: 0,
          friction: 6,
          useNativeDriver: true,
        }),
      ]),

      // 4. Tagline & Privacy Badge
      Animated.parallel([
        Animated.timing(taglineFade, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(badgeFade, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
      ]),

      // Tahan sebentar untuk dilihat user (~900ms)
      Animated.delay(850),

      // 5. Fade out transisi halus ke halaman utama
      Animated.timing(screenFadeOut, {
        toValue: 0,
        duration: 450,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onFinish();
    });
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: screenFadeOut }]}>
      <StatusBar barStyle="light-content" />

      {/* Radial Ambient Glows */}
      <View style={styles.ambientGlow} />

      <View style={styles.centerContent}>
        {/* Trio Mascot Avatars Overlapping Row */}
        <View style={styles.mascotsRow}>
          {/* Mr. Plop (Kiri) */}
          <Animated.View
            style={[
              styles.mascotBadge,
              styles.mascotPlop,
              {
                opacity: plopOpacity,
                transform: [{ translateY: plopBounce }, { rotate: '-6deg' }],
              },
            ]}
          >
            <MrPlopIcon size={56} />
          </Animated.View>

          {/* Lil' Drip (Tengah - Lebih besar & terdepan) */}
          <Animated.View
            style={[
              styles.mascotBadge,
              styles.mascotDrip,
              {
                opacity: dripOpacity,
                transform: [{ translateY: dripBounce }, { scale: 1.08 }],
              },
            ]}
          >
            <LilDripIcon size={64} />
          </Animated.View>

          {/* Sir Flush (Kanan) */}
          <Animated.View
            style={[
              styles.mascotBadge,
              styles.mascotFlush,
              {
                opacity: flushOpacity,
                transform: [{ translateY: flushBounce }, { rotate: '6deg' }],
              },
            ]}
          >
            <SirFlushIcon size={56} />
          </Animated.View>
        </View>

        {/* Title */}
        <Animated.View
          style={{
            opacity: titleFade,
            transform: [{ translateY: titleSlide }],
            alignItems: 'center',
          }}
        >
          <Text style={styles.appName}>Poop Pee Log</Text>
        </Animated.View>

        {/* Tagline "Track. Log. Lega." */}
        <Animated.View style={{ opacity: taglineFade, alignItems: 'center', marginTop: 6 }}>
          <View style={styles.taglineBox}>
            <Text style={styles.taglineTrack}>Track. </Text>
            <Text style={styles.taglineLog}>Log. </Text>
            <Text style={styles.taglineLega}>Lega.</Text>
          </View>
        </Animated.View>

        {/* Feature Highlights Pills */}
        <Animated.View style={[styles.bottomPillContainer, { opacity: badgeFade }]}>
          <View style={styles.pillBadge}>
            <Text style={styles.pillText}>⚡ 3-Detik Sat-set</Text>
          </View>
          <View style={styles.pillBadge}>
            <Text style={styles.pillText}>🛡️ 100% Offline & Privat</Text>
          </View>
        </Animated.View>
      </View>

      {/* Footer Branding */}
      <Animated.View style={[styles.footer, { opacity: badgeFade }]}>
        <Text style={styles.footerSub}>Lifelogger Biologis Personal</Text>
        <Text style={styles.versionText}>v1.0.0 (MVP)</Text>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.darkBg,
    zIndex: 9999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ambientGlow: {
    position: 'absolute',
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: (width * 1.2) / 2,
    backgroundColor: 'rgba(245, 183, 0, 0.08)',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  mascotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  mascotBadge: {
    borderRadius: 999,
    borderWidth: 3,
    borderColor: Colors.darkBg,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 12,
  },
  mascotPlop: {
    width: 76,
    height: 76,
    backgroundColor: Colors.poopBrown,
    marginRight: -18,
    zIndex: 1,
  },
  mascotDrip: {
    width: 88,
    height: 88,
    backgroundColor: Colors.peeAmber,
    zIndex: 3,
  },
  mascotFlush: {
    width: 76,
    height: 76,
    backgroundColor: Colors.bothTeal,
    marginLeft: -18,
    zIndex: 2,
  },
  appName: {
    fontSize: 34,
    fontWeight: '900',
    color: Colors.creamBg,
    letterSpacing: -1,
  },
  taglineBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  taglineTrack: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.peachTint,
    opacity: 0.9,
  },
  taglineLog: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.peeAmber,
  },
  taglineLega: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.bothTeal,
  },
  bottomPillContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 24,
  },
  pillBadge: {
    backgroundColor: Colors.darkSurface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
  },
  pillText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.peachTint,
  },
  footer: {
    position: 'absolute',
    bottom: 48,
    alignItems: 'center',
  },
  footerSub: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.peachTint,
    opacity: 0.5,
  },
  versionText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.peeAmber,
    opacity: 0.8,
    marginTop: 2,
  },
});
