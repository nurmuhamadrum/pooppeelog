import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { useAppStore } from '@/src/store/useAppStore';
import { useMobileI18n } from '@/src/i18n/translations';
import { MrPlopIcon, LilDripIcon, SirFlushIcon } from '@/src/components/MascotIcons';
import {
  Flame,
  Droplet,
  Sparkles,
  Award,
  Calendar,
  Clock,
  MapPin,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Lock,
} from 'lucide-react-native';

type TimeRange = 'ALL' | 'YEAR' | 'MONTH' | 'WEEK';

interface BadgeItem {
  id: string;
  title: string;
  category: string;
  description: string;
  mascot: 'drip' | 'plop' | 'flush';
  unlocked: boolean;
  progressText: string;
  accentColor: string;
}

export default function StatsScreen() {
  const { logs } = useAppStore();
  const { t } = useMobileI18n();
  const [timeRange, setTimeRange] = useState<TimeRange>('ALL');

  // Filter logs berdasarkan periode waktu
  const filteredLogs = useMemo(() => {
    const now = new Date();
    return logs.filter((log) => {
      const logDate = new Date(log.loggedAt);
      if (timeRange === 'WEEK') {
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return logDate >= oneWeekAgo;
      }
      if (timeRange === 'MONTH') {
        return (
          logDate.getFullYear() === now.getFullYear() &&
          logDate.getMonth() === now.getMonth()
        );
      }
      if (timeRange === 'YEAR') {
        return logDate.getFullYear() === now.getFullYear();
      }
      return true; // 'ALL'
    });
  }, [logs, timeRange]);

  // Total counts pada filter aktif
  const totalLogs = filteredLogs.length;
  const countPeeOnly = filteredLogs.filter((l) => l.type === 'PEE').length;
  const countPoopOnly = filteredLogs.filter((l) => l.type === 'POOP').length;
  const countCombo = filteredLogs.filter((l) => l.type === 'COMBO').length;

  const totalPeeIncCombo = countPeeOnly + countCombo;
  const totalPoopIncCombo = countPoopOnly + countCombo;

  // Streak calculation (dari seluruh riwayat logs)
  const streakDays = useMemo(() => {
    if (logs.length === 0) return 0;
    const dates = Array.from(
      new Set(logs.map((l) => new Date(l.loggedAt).toDateString()))
    ).map((d) => new Date(d).getTime());
    dates.sort((a, b) => b - a);

    let streak = 0;
    const oneDayMs = 24 * 60 * 60 * 1000;
    const today = new Date().setHours(0, 0, 0, 0);

    // Cek apakah ada catatan hari ini atau kemarin
    const mostRecent = new Date(dates[0]).setHours(0, 0, 0, 0);
    if (today - mostRecent > oneDayMs) {
      return 0; // Streak terputus
    }

    let expected = mostRecent;
    for (const d of dates) {
      const current = new Date(d).setHours(0, 0, 0, 0);
      if (current === expected) {
        streak++;
        expected -= oneDayMs;
      } else {
        break;
      }
    }
    return Math.max(streak, logs.length > 0 ? 1 : 0);
  }, [logs]);

  // Unique lokasi & kota
  const uniqueDistricts = useMemo(() => {
    const set = new Set<string>();
    logs.forEach((l) => {
      if (l.district) set.add(l.district);
    });
    return set.size;
  }, [logs]);

  // Daftar Lencana Menarik & Progresnya
  const badges: BadgeItem[] = useMemo(() => {
    const allTotal = logs.length;
    const allPee = logs.filter((l) => l.type === 'PEE' || l.type === 'COMBO').length;
    const allPoop = logs.filter((l) => l.type === 'POOP' || l.type === 'COMBO').length;
    const allFlush = logs.filter((l) => l.type === 'COMBO').length;

    return [
      {
        id: 'newbie',
        title: 'Pendatang Baru',
        category: 'Awal Perjalanan',
        description: 'Mencatat buang air pertama kali di aplikasi',
        mascot: 'drip',
        unlocked: allTotal >= 1,
        progressText: allTotal >= 1 ? 'Selesai' : `${allTotal}/1 log`,
        accentColor: Colors.peeAmber,
      },
      {
        id: 'hydration-master',
        title: 'Juara Hidrasi',
        category: 'Konsistensi',
        description: 'Mencapai total 10x catatan buang air kecil (Pee)',
        mascot: 'drip',
        unlocked: allPee >= 10,
        progressText: allPee >= 10 ? 'Selesai' : `${allPee}/10 pee`,
        accentColor: Colors.dripBlue,
      },
      {
        id: 'urban-explorer',
        title: 'Penjelajah Kota',
        category: 'Eksplorasi',
        description: 'Mencoba toilet di minimal 3 area / distrik berbeda',
        mascot: 'plop',
        unlocked: uniqueDistricts >= 3,
        progressText: uniqueDistricts >= 3 ? 'Selesai' : `${uniqueDistricts}/3 lokasi`,
        accentColor: Colors.poopLight,
      },
      {
        id: 'flush-royale',
        title: 'Sir Flush Royale',
        category: 'Master Kloset',
        description: 'Melakukan paket kombo Pee & Poop (Sir Flush) 3 kali',
        mascot: 'flush',
        unlocked: allFlush >= 3,
        progressText: allFlush >= 3 ? 'Selesai' : `${allFlush}/3 flush`,
        accentColor: Colors.bothTeal,
      },
      {
        id: 'streak-warrior',
        title: 'Lancar Jaya (Streak 3)',
        category: 'Disiplin',
        description: 'Menjaga streak mencatat buang air 3 hari berturut-turut',
        mascot: 'plop',
        unlocked: streakDays >= 3,
        progressText: streakDays >= 3 ? 'Selesai' : `${streakDays}/3 hari`,
        accentColor: Colors.emergencyRed,
      },
      {
        id: 'centurion',
        title: 'Legenda Toilet',
        category: 'Pencapaian Akbar',
        description: 'Mencatat total 50 riwayat aktivitas biologis',
        mascot: 'flush',
        unlocked: allTotal >= 50,
        progressText: allTotal >= 50 ? 'Selesai' : `${allTotal}/50 log`,
        accentColor: '#A78BFA',
      },
    ];
  }, [logs, uniqueDistricts, streakDays]);

  const unlockedBadgeCount = badges.filter((b) => b.unlocked).length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header Area */}
      <View style={styles.headerArea}>
        <Text style={styles.pageTitle}>{t.stats.title}</Text>
        <Text style={styles.pageSubtitle}>{t.stats.subtitle}</Text>
      </View>

      {/* Filter Waktu: Minggu Ini, Bulan Ini, Tahun Ini, Semua */}
      <View style={styles.filterBarContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterPillsRow}>
          <TouchableOpacity
            style={[styles.timePill, timeRange === 'WEEK' && styles.timePillActive]}
            onPress={() => setTimeRange('WEEK')}
          >
            <Text style={[styles.timePillText, timeRange === 'WEEK' && styles.timePillTextActive]}>
              {t.stats.week}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.timePill, timeRange === 'MONTH' && styles.timePillActive]}
            onPress={() => setTimeRange('MONTH')}
          >
            <Text style={[styles.timePillText, timeRange === 'MONTH' && styles.timePillTextActive]}>
              {t.stats.month}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.timePill, timeRange === 'YEAR' && styles.timePillActive]}
            onPress={() => setTimeRange('YEAR')}
          >
            <Text style={[styles.timePillText, timeRange === 'YEAR' && styles.timePillTextActive]}>
              {t.stats.year}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.timePill, timeRange === 'ALL' && styles.timePillActive]}
            onPress={() => setTimeRange('ALL')}
          >
            <Text style={[styles.timePillText, timeRange === 'ALL' && styles.timePillTextActive]}>
              {t.stats.all}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Streak Hero Banner */}
        <View style={styles.streakCard}>
          <View style={{ flex: 1 }}>
            <View style={styles.streakHeaderTagRow}>
              <Flame size={14} color={Colors.peeAmber} />
              <Text style={styles.streakTag}>STREAK AKTIF</Text>
            </View>
            <View style={styles.streakNumberRow}>
              <Text style={styles.streakNumber}>{streakDays} Hari</Text>
              <Text style={styles.streakFlameEmoji}>🔥</Text>
            </View>
            <Text style={styles.streakHint}>
              {streakDays >= 3
                ? 'Luar biasa! Disiplin biologismu terjaga sangat baik.'
                : logs.length > 0
                ? `${3 - streakDays} hari lagi menuju lencana "Lancar Jaya"!`
                : 'Catat buang air hari ini untuk memulai streak pertamamu!'}
            </Text>
          </View>

          {/* Progress Circle */}
          <View style={styles.progressCircle}>
            <Text style={styles.progressText}>
              {logs.length > 0 ? `${Math.min(100, Math.round((streakDays / 7) * 100))}%` : '0%'}
            </Text>
            <Text style={styles.progressSub}>mingguan</Text>
          </View>
        </View>

        {/* 3 MASCOT KPI CARDS: Lil' Drip, Mr. Plop, Sir Flush */}
        <View style={styles.kpiRow}>
          {/* Card 1: Lil' Drip (Pee) */}
          <View style={[styles.kpiCard, { borderColor: 'rgba(245, 183, 0, 0.35)' }]}>
            <View style={styles.kpiHeader}>
              <View style={[styles.kpiIconWrapper, { backgroundColor: Colors.peeAmber }]}>
                <LilDripIcon size={20} />
              </View>
              <Text style={styles.kpiTitle}>LIL' DRIP</Text>
            </View>
            <Text style={[styles.kpiNumber, { color: Colors.peeAmber }]}>
              {totalPeeIncCombo} <Text style={styles.kpiUnit}>Kali</Text>
            </Text>
            <View style={styles.kpiFooterTag}>
              <Text style={styles.kpiStatusPee}>💧 {countPeeOnly} Pee tunggal</Text>
            </View>
          </View>

          {/* Card 2: Mr. Plop (Poop) */}
          <View style={[styles.kpiCard, { borderColor: 'rgba(201, 138, 88, 0.35)' }]}>
            <View style={styles.kpiHeader}>
              <View style={[styles.kpiIconWrapper, { backgroundColor: Colors.poopBrown }]}>
                <MrPlopIcon size={20} />
              </View>
              <Text style={styles.kpiTitle}>MR. PLOP</Text>
            </View>
            <Text style={[styles.kpiNumber, { color: Colors.peachTint }]}>
              {totalPoopIncCombo} <Text style={styles.kpiUnit}>Kali</Text>
            </Text>
            <View style={styles.kpiFooterTag}>
              <Text style={styles.kpiStatusPoop}>💩 {countPoopOnly} Poop rutin</Text>
            </View>
          </View>
        </View>

        {/* Card 3: Sir Flush (Combo pee + poop / Flush Kloset Bersih) */}
        <View style={styles.flushHighlightCard}>
          <View style={styles.flushLeft}>
            <View style={styles.flushAvatarWrapper}>
              <SirFlushIcon size={34} />
            </View>
            <View>
              <View style={styles.flushBadgeRow}>
                <Sparkles size={12} color={Colors.bothTeal} />
                <Text style={styles.flushTag}>SIR FLUSH • PAKET KOMBO</Text>
              </View>
              <Text style={styles.flushTitle}>Pee & Poop Sekaligus</Text>
              <Text style={styles.flushSubtitle}>Efisiensi waktu & hidrasi seimbang</Text>
            </View>
          </View>

          <View style={styles.flushCountBox}>
            <Text style={styles.flushCountNumber}>{countCombo}</Text>
            <Text style={styles.flushCountLabel}>Kali</Text>
          </View>
        </View>

        {/* Summary Info Bar: Total Kunjungan & Distrik */}
        <View style={styles.summaryBar}>
          <View style={styles.summaryBarItem}>
            <Calendar size={14} color={Colors.peachTint} />
            <Text style={styles.summaryBarText}>
              Total Periode Ini: <Text style={styles.summaryBarHighlight}>{totalLogs} Catatan</Text>
            </Text>
          </View>
          <View style={styles.summaryBarDivider} />
          <View style={styles.summaryBarItem}>
            <MapPin size={14} color={Colors.bothTeal} />
            <Text style={styles.summaryBarText}>
              Jelajah: <Text style={styles.summaryBarHighlight}>{uniqueDistricts} Lokasi</Text>
            </Text>
          </View>
        </View>

        {/* SECTION LENCANA & PENCAPAIAN */}
        <View style={styles.badgeSectionHeader}>
          <View>
            <Text style={styles.sectionHeading}>LENCANA & PRESTASI</Text>
            <Text style={styles.sectionSub}>
              {unlockedBadgeCount} dari {badges.length} lencana telah diraih
            </Text>
          </View>
          <View style={styles.badgeRatioPill}>
            <Award size={13} color={Colors.peeAmber} />
            <Text style={styles.badgeRatioText}>{unlockedBadgeCount}/{badges.length}</Text>
          </View>
        </View>

        {/* Grid Lencana Menarik */}
        <View style={styles.badgesList}>
          {badges.map((b) => (
            <View
              key={b.id}
              style={[
                styles.badgeRowCard,
                b.unlocked
                  ? { borderColor: b.accentColor, backgroundColor: 'rgba(46, 40, 35, 0.95)' }
                  : styles.badgeRowCardLocked,
              ]}
            >
              <View
                style={[
                  styles.badgeIconWrapper,
                  {
                    backgroundColor: b.unlocked ? b.accentColor : 'rgba(255, 255, 255, 0.08)',
                  },
                ]}
              >
                {b.mascot === 'drip' && <LilDripIcon size={26} />}
                {b.mascot === 'plop' && <MrPlopIcon size={26} />}
                {b.mascot === 'flush' && <SirFlushIcon size={26} />}

                {!b.unlocked && (
                  <View style={styles.lockBadgeOverlay}>
                    <Lock size={10} color="#FFF" />
                  </View>
                )}
              </View>

              <View style={{ flex: 1 }}>
                <View style={styles.badgeRowHeader}>
                  <Text
                    style={[
                      styles.badgeTitleText,
                      !b.unlocked && { color: 'rgba(255, 246, 234, 0.5)' },
                    ]}
                  >
                    {b.title}
                  </Text>
                  {b.unlocked ? (
                    <View style={[styles.badgePillUnlocked, { backgroundColor: `${b.accentColor}26` }]}>
                      <CheckCircle2 size={11} color={b.accentColor} />
                      <Text style={[styles.badgePillTextUnlocked, { color: b.accentColor }]}>
                        DIRAIH
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.badgePillLocked}>
                      <Text style={styles.badgePillTextLocked}>{b.progressText}</Text>
                    </View>
                  )}
                </View>

                <Text style={styles.badgeCategoryText}>{b.category}</Text>
                <Text style={styles.badgeDescText}>{b.description}</Text>
              </View>
            </View>
          ))}
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
    paddingBottom: 4,
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
  filterBarContainer: {
    marginTop: 10,
    marginBottom: 4,
  },
  filterPillsRow: {
    paddingHorizontal: 20,
    gap: 8,
    flexDirection: 'row',
  },
  timePill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: Colors.darkSurface,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
  },
  timePillActive: {
    backgroundColor: Colors.peeAmber,
    borderColor: Colors.peeAmber,
  },
  timePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.peachTint,
  },
  timePillTextActive: {
    color: '#000',
    fontWeight: '900',
  },
  content: {
    padding: 18,
    paddingBottom: 110,
  },
  streakCard: {
    backgroundColor: 'rgba(46, 40, 35, 0.96)',
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: 'rgba(245, 183, 0, 0.45)',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  streakHeaderTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
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
    lineHeight: 15,
  },
  progressCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: 'rgba(47, 184, 172, 0.16)',
    borderWidth: 2,
    borderColor: Colors.bothTeal,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  progressText: {
    color: Colors.bothTeal,
    fontSize: 14,
    fontWeight: '900',
  },
  progressSub: {
    color: Colors.bothTeal,
    fontSize: 8,
    fontWeight: '700',
    opacity: 0.8,
  },
  kpiRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: Colors.darkSurface,
    borderWidth: 1.5,
    borderRadius: 20,
    padding: 14,
  },
  kpiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  kpiIconWrapper: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kpiTitle: {
    fontSize: 10,
    fontWeight: '900',
    color: Colors.creamBg,
    letterSpacing: 0.6,
  },
  kpiNumber: {
    fontSize: 22,
    fontWeight: '900',
    marginTop: 8,
  },
  kpiUnit: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.peachTint,
    opacity: 0.6,
  },
  kpiFooterTag: {
    marginTop: 6,
  },
  kpiStatusPee: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.bothTeal,
  },
  kpiStatusPoop: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.peeAmber,
  },
  flushHighlightCard: {
    backgroundColor: 'rgba(47, 184, 172, 0.12)',
    borderWidth: 1.5,
    borderColor: 'rgba(47, 184, 172, 0.45)',
    borderRadius: 20,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  flushLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  flushAvatarWrapper: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.bothTeal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flushBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  flushTag: {
    fontSize: 9,
    fontWeight: '900',
    color: Colors.bothTeal,
    letterSpacing: 0.6,
  },
  flushTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: Colors.creamBg,
    marginTop: 1,
  },
  flushSubtitle: {
    fontSize: 10,
    color: Colors.peachTint,
    opacity: 0.7,
    marginTop: 1,
  },
  flushCountBox: {
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  flushCountNumber: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.bothTeal,
  },
  flushCountLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.peachTint,
    opacity: 0.6,
  },
  summaryBar: {
    flexDirection: 'row',
    backgroundColor: Colors.darkSurface,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
  },
  summaryBarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  summaryBarText: {
    fontSize: 11,
    color: Colors.peachTint,
    opacity: 0.8,
  },
  summaryBarHighlight: {
    fontWeight: '900',
    color: Colors.creamBg,
  },
  summaryBarDivider: {
    width: 1,
    height: 16,
    backgroundColor: Colors.darkBorder,
  },
  badgeSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  sectionHeading: {
    fontSize: 12,
    fontWeight: '900',
    color: Colors.creamBg,
    letterSpacing: 0.8,
  },
  sectionSub: {
    fontSize: 10,
    color: Colors.peachTint,
    opacity: 0.65,
    marginTop: 2,
  },
  badgeRatioPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(245, 183, 0, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(245, 183, 0, 0.35)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  badgeRatioText: {
    fontSize: 11,
    fontWeight: '900',
    color: Colors.peeAmber,
  },
  badgesList: {
    gap: 10,
  },
  badgeRowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 18,
    padding: 12,
    borderWidth: 1.5,
  },
  badgeRowCardLocked: {
    backgroundColor: 'rgba(35, 30, 26, 0.6)',
    borderColor: Colors.darkBorder,
    opacity: 0.75,
  },
  badgeIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockBadgeOverlay: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: Colors.darkBg,
    borderRadius: 8,
    padding: 2,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
  },
  badgeRowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badgeTitleText: {
    fontSize: 13,
    fontWeight: '900',
    color: Colors.creamBg,
  },
  badgeCategoryText: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.peachTint,
    opacity: 0.5,
    textTransform: 'uppercase',
    marginTop: 1,
  },
  badgeDescText: {
    fontSize: 11,
    color: Colors.peachTint,
    opacity: 0.75,
    marginTop: 3,
    lineHeight: 15,
  },
  badgePillUnlocked: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgePillTextUnlocked: {
    fontSize: 9,
    fontWeight: '900',
  },
  badgePillLocked: {
    backgroundColor: Colors.darkSurface,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
  },
  badgePillTextLocked: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.peachTint,
    opacity: 0.6,
  },
});
