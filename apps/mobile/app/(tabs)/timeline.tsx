import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, SafeAreaView, Platform, StatusBar } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useAppStore } from '@/src/store/useAppStore';
import { Trash2, MapPin, Clock } from 'lucide-react-native';

export default function TimelineScreen() {
  const { logs, removeLog } = useAppStore();

  const renderItem = ({ item }: { item: any }) => {
    const isPee = item.type === 'PEE';
    const dateFormatted = new Date(item.loggedAt).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return (
      <View style={styles.logCard}>
        <View style={styles.cardHeader}>
          <View style={styles.typeBadge}>
            <Text style={styles.emoji}>{isPee ? '💧' : '💩'}</Text>
            <Text style={[styles.typeTitle, { color: isPee ? Colors.peeAmber : Colors.poopLight }]}>
              {isPee ? "Lil' Drip (Kencing)" : 'Mr. Plop (BAB)'}
            </Text>
          </View>
          <TouchableOpacity onPress={() => removeLog(item.id)} style={styles.deleteBtn}>
            <Trash2 size={16} color={Colors.darkBorder} />
          </TouchableOpacity>
        </View>

        <View style={styles.infoRow}>
          <MapPin size={14} color={Colors.peachTint} opacity={0.6} />
          <Text style={styles.locationText}>
            {item.district}, {item.city}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Clock size={14} color={Colors.peachTint} opacity={0.6} />
          <Text style={styles.timeText}>
            {dateFormatted} • Mood: {item.mood || 'Lega'}
          </Text>
        </View>

        {Boolean(item.note) && (
          <View style={styles.noteBox}>
            <Text style={styles.noteText}>"{item.note}"</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerArea}>
        <Text style={styles.pageTitle}>Buku Harian Lega</Text>
        <Text style={styles.pageSubtitle}>
          {logs.length > 0 ? `Total ${logs.length} jejak buang air tercatat` : 'Belum ada catatan aktivitas'}
        </Text>
      </View>

      {logs.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>📜</Text>
          <Text style={styles.emptyTitle}>Belum Ada Catatan</Text>
          <Text style={styles.emptySubtitle}>
            Gunakan tombol (+) di tab bar untuk mulai mendokumentasikan riwayat kelegaanmu.
          </Text>
        </View>
      ) : (
        <FlatList
          data={logs}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      )}
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
    paddingBottom: 12,
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
  listContent: {
    padding: 16,
    gap: 12,
  },
  logCard: {
    backgroundColor: Colors.darkSurface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emoji: {
    fontSize: 18,
  },
  typeTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  deleteBtn: {
    padding: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  locationText: {
    fontSize: 12,
    color: Colors.creamBg,
    fontWeight: '600',
  },
  timeText: {
    fontSize: 11,
    color: Colors.peachTint,
    opacity: 0.7,
  },
  noteBox: {
    marginTop: 8,
    backgroundColor: Colors.darkBg,
    padding: 8,
    borderRadius: 12,
  },
  noteText: {
    fontSize: 11,
    color: Colors.peachTint,
    fontStyle: 'italic',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.creamBg,
  },
  emptySubtitle: {
    fontSize: 12,
    color: Colors.peachTint,
    opacity: 0.7,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
});

