import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useAppStore } from '@/src/store/useAppStore';
import { Flame, Award, Zap, Compass } from 'lucide-react-native';

export default function StatsScreen() {
  const { logs } = useAppStore();

  const totalPee = logs.filter((l) => l.type === 'PEE').length;
  const totalPoop = logs.filter((l) => l.type === 'POOP').length;
  const totalLogs = logs.length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Streak Hero Banner */}
      <View style={styles.streakCard}>
        <View style={styles.streakIconWrapper}>
          <Flame size={32} color={Colors.peeAmber} />
        </View>
        <View>
          <Text style={styles.streakNumber}>{totalLogs > 0 ? '1 Hari' : '0 Hari'}</Text>
          <Text style={styles.streakLabel}>Streak Konsistensi Aktif</Text>
        </View>
      </View>

      {/* Grid Stats */}
      <View style={styles.statsGrid}>
        <View style={styles.statBox}>
          <Text style={styles.statEmoji}>💧</Text>
          <Text style={styles.statVal}>{totalPee}</Text>
          <Text style={styles.statSub}>Total Kencing</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statEmoji}>💩</Text>
          <Text style={styles.statVal}>{totalPoop}</Text>
          <Text style={styles.statSub}>Total BAB</Text>
        </View>
      </View>

      {/* Badges Preview */}
      <View style={styles.badgeSection}>
        <View style={styles.sectionHeader}>
          <Award size={18} color={Colors.bothTeal} />
          <Text style={styles.sectionTitle}>Koleksi Lencana Master</Text>
        </View>

        <View style={styles.badgeList}>
          <View style={[styles.badgeItem, totalLogs >= 1 && styles.badgeUnlocked]}>
            <Text style={styles.badgeEmoji}>🎖️</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.badgeName}>Lega Perdana</Text>
              <Text style={styles.badgeDesc}>Mencatat buang air pertama kali di aplikasi</Text>
            </View>
            <Text style={[styles.badgeStatus, { color: totalLogs >= 1 ? Colors.bothTeal : Colors.darkBorder }]}>
              {totalLogs >= 1 ? 'Terbuka' : 'Terkunci'}
            </Text>
          </View>

          <View style={[styles.badgeItem, totalPee >= 5 && styles.badgeUnlocked]}>
            <Text style={styles.badgeEmoji}>🌊</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.badgeName}>Hidrasi Terjaga</Text>
              <Text style={styles.badgeDesc}>Mencatat 5x buang air kecil bersama Lil' Drip</Text>
            </View>
            <Text style={[styles.badgeStatus, { color: totalPee >= 5 ? Colors.bothTeal : Colors.darkBorder }]}>
              {totalPee >= 5 ? 'Terbuka' : 'Terkunci'}
            </Text>
          </View>

          <View style={[styles.badgeItem, totalPoop >= 3 && styles.badgeUnlocked]}>
            <Text style={styles.badgeEmoji}>👑</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.badgeName}>Raja Kloset</Text>
              <Text style={styles.badgeDesc}>Mencatat 3x buang air besar bersama Mr. Plop</Text>
            </View>
            <Text style={[styles.badgeStatus, { color: totalPoop >= 3 ? Colors.bothTeal : Colors.darkBorder }]}>
              {totalPoop >= 3 ? 'Terbuka' : 'Terkunci'}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.darkBg,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  streakCard: {
    backgroundColor: Colors.darkSurface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  streakIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(245, 183, 0, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakNumber: {
    fontSize: 24,
    fontWeight: '900',
    color: Colors.creamBg,
  },
  streakLabel: {
    fontSize: 12,
    color: Colors.peachTint,
    opacity: 0.7,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: Colors.darkSurface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    padding: 18,
    alignItems: 'center',
  },
  statEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  statVal: {
    fontSize: 26,
    fontWeight: '900',
    color: Colors.creamBg,
  },
  statSub: {
    fontSize: 11,
    color: Colors.peachTint,
    opacity: 0.7,
    marginTop: 2,
  },
  badgeSection: {
    backgroundColor: Colors.darkSurface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    padding: 18,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: Colors.creamBg,
  },
  badgeList: {
    gap: 10,
  },
  badgeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.darkBg,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
  },
  badgeUnlocked: {
    borderColor: 'rgba(47, 184, 172, 0.5)',
  },
  badgeEmoji: {
    fontSize: 24,
  },
  badgeName: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.creamBg,
  },
  badgeDesc: {
    fontSize: 11,
    color: Colors.peachTint,
    opacity: 0.6,
  },
  badgeStatus: {
    fontSize: 11,
    fontWeight: '800',
  },
});
