import React, { useMemo } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useAppStore } from '@/src/store/useAppStore';
import { evaluateBadges } from '@/src/services/badgeEvaluator';
import { Flame, Award, MapPin, Zap } from 'lucide-react-native';

export default function StatsScreen() {
  const { logs } = useAppStore();

  const totalPee = logs.filter((l) => l.type === 'PEE').length;
  const totalPoop = logs.filter((l) => l.type === 'POOP').length;
  const totalLogs = logs.length;

  const badges = useMemo(() => evaluateBadges(logs), [logs]);
  const unlockedCount = badges.filter((b) => b.isUnlocked).length;

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

      {/* Badges Collection Section */}
      <View style={styles.badgeSection}>
        <View style={styles.sectionHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Award size={18} color={Colors.bothTeal} />
            <Text style={styles.sectionTitle}>Koleksi Lencana Master</Text>
          </View>
          <Text style={styles.badgeCounterText}>
            {unlockedCount} / {badges.length} Terbuka
          </Text>
        </View>

        <View style={styles.badgeList}>
          {badges.map((badge) => (
            <View
              key={badge.id}
              style={[styles.badgeItem, badge.isUnlocked && styles.badgeUnlocked]}
            >
              <Text style={[styles.badgeEmoji, !badge.isUnlocked && styles.badgeEmojiLocked]}>
                {badge.emoji}
              </Text>
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.badgeName,
                    !badge.isUnlocked && { color: Colors.peachTint, opacity: 0.6 },
                  ]}
                >
                  {badge.name}
                </Text>
                <Text style={styles.badgeDesc}>{badge.description}</Text>
              </View>
              <View
                style={[
                  styles.statusPill,
                  badge.isUnlocked ? styles.statusPillActive : styles.statusPillLocked,
                ]}
              >
                <Text
                  style={[
                    styles.statusPillText,
                    badge.isUnlocked ? styles.statusPillTextActive : styles.statusPillTextLocked,
                  ]}
                >
                  {badge.progressText}
                </Text>
              </View>
            </View>
          ))}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: Colors.creamBg,
  },
  badgeCounterText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.bothTeal,
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
    backgroundColor: 'rgba(47, 184, 172, 0.05)',
  },
  badgeEmoji: {
    fontSize: 24,
  },
  badgeEmojiLocked: {
    opacity: 0.35,
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
    marginTop: 2,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusPillActive: {
    backgroundColor: 'rgba(47, 184, 172, 0.2)',
  },
  statusPillLocked: {
    backgroundColor: Colors.darkSurface,
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '800',
  },
  statusPillTextActive: {
    color: Colors.bothTeal,
  },
  statusPillTextLocked: {
    color: Colors.peachTint,
    opacity: 0.5,
  },
});
