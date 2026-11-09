import React, { useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { useAppStore } from '@/src/store/useAppStore';
import { MrPlopIcon, LilDripIcon } from '@/src/components/MascotIcons';

export default function StatsScreen() {
  const { logs } = useAppStore();

  const totalPee = logs.filter((l) => l.type === 'PEE' || l.type === 'COMBO').length;
  const totalPoop = logs.filter((l) => l.type === 'POOP' || l.type === 'COMBO').length;
  const totalLogs = logs.length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header Area */}
      <View style={styles.headerArea}>
        <Text style={styles.pageTitle}>Statistik & Lencana</Text>
        <Text style={styles.pageSubtitle}>Pencapaian bersama Mr. Plop & Lil' Drip</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Streak Hero Banner (Persis Mockup Phone Simulator) */}
        <View style={styles.streakCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.streakTag}>STREAK AKTIF</Text>
            <View style={styles.streakNumberRow}>
              <Text style={styles.streakNumber}>{totalLogs > 0 ? '5 Hari' : '0 Hari'}</Text>
              <Text style={styles.streakFlameEmoji}>🔥</Text>
            </View>
            <Text style={styles.streakHint}>
              {totalLogs > 0 ? '2 hari lagi menuju badge "Lancar Jaya"!' : 'Catat buang air hari ini untuk memulai streak!'}
            </Text>
          </View>

          {/* Progress Circle Pill */}
          <View style={styles.progressCircle}>
            <Text style={styles.progressText}>{totalLogs > 0 ? '71%' : '0%'}</Text>
          </View>
        </View>

        {/* 2x2 KPI Cards (Persis Mockup Simulator) */}
        <View style={styles.kpiGrid}>
          {/* Card Total Pee */}
          <View style={styles.kpiCard}>
            <View style={styles.kpiHeader}>
              <View style={[styles.kpiIconWrapper, { backgroundColor: Colors.peeAmber }]}>
                <LilDripIcon size={18} />
              </View>
              <Text style={styles.kpiTitle}>TOTAL PEE</Text>
            </View>
            <Text style={[styles.kpiNumber, { color: Colors.peeAmber }]}>
              {totalLogs > 0 ? `${totalPee} Kali` : '0 Kali'}
            </Text>
            <Text style={styles.kpiStatusPee}>💧 Hidrasi prima</Text>
          </View>

          {/* Card Total Poop */}
          <View style={styles.kpiCard}>
            <View style={styles.kpiHeader}>
              <View style={[styles.kpiIconWrapper, { backgroundColor: Colors.poopBrown }]}>
                <MrPlopIcon size={18} />
              </View>
              <Text style={styles.kpiTitle}>TOTAL POOP</Text>
            </View>
            <Text style={[styles.kpiNumber, { color: Colors.peachTint }]}>
              {totalLogs > 0 ? `${totalPoop} Kali` : '0 Kali'}
            </Text>
            <Text style={styles.kpiStatusPoop}>💩 Teratur</Text>
          </View>
        </View>

        {/* Section Title Lencana */}
        <Text style={styles.sectionHeading}>LENCANA DIRAIH</Text>

        {/* 2-Column Badges Grid (Persis Mockup Phone Simulator) */}
        <View style={styles.badgeGrid}>
          {/* Badge 1: Pendatang Baru (Lil' Drip) */}
          <View style={[styles.badgeCard, { borderColor: 'rgba(245, 183, 0, 0.45)' }]}>
            <View style={[styles.badgeAvatar, { backgroundColor: Colors.peeAmber }]}>
              <LilDripIcon size={34} />
            </View>
            <Text style={styles.badgeTitle}>Pendatang Baru</Text>
            <View style={styles.badgePillUnlocked}>
              <Text style={styles.badgePillTextUnlocked}>DIRAIH</Text>
            </View>
          </View>

          {/* Badge 2: Penjelajah Kota (Mr. Plop) */}
          <View style={[styles.badgeCard, { borderColor: 'rgba(201, 138, 88, 0.45)' }]}>
            <View style={[styles.badgeAvatar, { backgroundColor: Colors.poopBrown }]}>
              <MrPlopIcon size={34} />
            </View>
            <Text style={styles.badgeTitle}>Penjelajah Kota</Text>
            <View style={styles.badgePillUnlocked}>
              <Text style={styles.badgePillTextUnlocked}>DIRAIH</Text>
            </View>
          </View>
        </View>
      </ScrollView>
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
  content: {
    padding: 16,
    paddingBottom: 110,
  },
  streakCard: {
    backgroundColor: 'rgba(46, 40, 35, 0.96)',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(245, 183, 0, 0.4)',
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  streakTag: {
    fontSize: 10,
    fontWeight: '900',
    color: Colors.peeAmber,
    letterSpacing: 0.8,
  },
  streakNumberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  streakNumber: {
    fontSize: 26,
    fontWeight: '900',
    color: Colors.creamBg,
  },
  streakFlameEmoji: {
    fontSize: 22,
  },
  streakHint: {
    fontSize: 11,
    color: Colors.peachTint,
    opacity: 0.75,
    marginTop: 2,
  },
  progressCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(47, 184, 172, 0.16)',
    borderWidth: 2,
    borderColor: Colors.bothTeal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressText: {
    color: Colors.bothTeal,
    fontSize: 13,
    fontWeight: '900',
  },
  kpiGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: Colors.darkSurface,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    borderRadius: 20,
    padding: 14,
  },
  kpiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  kpiIconWrapper: {
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kpiTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.peachTint,
    opacity: 0.7,
  },
  kpiNumber: {
    fontSize: 20,
    fontWeight: '900',
    marginTop: 8,
  },
  kpiStatusPee: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.bothTeal,
    marginTop: 4,
  },
  kpiStatusPoop: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.peeAmber,
    marginTop: 4,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '900',
    color: Colors.creamBg,
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  badgeGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  badgeCard: {
    flex: 1,
    backgroundColor: Colors.darkSurface,
    borderWidth: 1.5,
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
  },
  badgeAvatar: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  badgeTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.creamBg,
    textAlign: 'center',
    marginBottom: 6,
  },
  badgePillUnlocked: {
    backgroundColor: 'rgba(47, 184, 172, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgePillTextUnlocked: {
    fontSize: 9,
    fontWeight: '900',
    color: Colors.bothTeal,
  },
});
