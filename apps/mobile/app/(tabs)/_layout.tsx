import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { MapPin, Calendar, BarChart3, Lock } from 'lucide-react-native';
import { SirFlushIcon } from '@/src/components/MascotIcons';
import { QuickLogModal } from '@/src/components/QuickLogModal';

export default function TabLayout() {
  const [quickLogVisible, setQuickLogVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: Colors.peeAmber,
          tabBarInactiveTintColor: '#807266',
          tabBarShowLabel: true,
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '800',
            marginTop: 2,
          },
          tabBarStyle: {
            backgroundColor: Colors.darkBg,
            borderTopColor: Colors.darkBorder,
            borderTopWidth: 1,
            height: Platform.OS === 'ios' ? 88 : 72,
            paddingBottom: Platform.OS === 'ios' ? 28 : 12,
            paddingTop: 8,
            paddingHorizontal: 8,
          },
        }}
      >
        {/* Tab 1: Peta */}
        <Tabs.Screen
          name="index"
          options={{
            title: 'Peta',
            tabBarIcon: ({ color }) => <MapPin size={22} color={color} />,
          }}
        />

        {/* Tab 2: Diary */}
        <Tabs.Screen
          name="timeline"
          options={{
            title: 'Diary',
            tabBarIcon: ({ color }) => <Calendar size={22} color={color} />,
            tabBarItemStyle: {
              marginRight: 80,
            },
          }}
        />

        {/* Tab Tengah: Spacer khusus agar Diary dan Stats tidak mepet dengan FAB */}
        <Tabs.Screen
          name="fab-spacer"
          options={{
            title: '',
            tabBarButton: () => <View style={{ width: 84 }} />,
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              setQuickLogVisible(true);
            },
          }}
        />

        {/* Tab 3: Stats */}
        <Tabs.Screen
          name="stats"
          options={{
            title: 'Stats',
            tabBarIcon: ({ color }) => <BarChart3 size={22} color={color} />,
            tabBarItemStyle: {
              marginLeft: 10,
            },
          }}
        />

        {/* Tab 4: Kunci / Pengaturan */}
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Kunci',
            tabBarIcon: ({ color }) => <Lock size={22} color={color} />,
          }}
        />
      </Tabs>

      {/* FLOATING ACTION BUTTON (+ LOG) PERSIS SEPERTI MOCKUP */}
      <View style={styles.fabContainer} pointerEvents="box-none">
        <TouchableOpacity
          style={styles.fabButton}
          onPress={() => setQuickLogVisible(true)}
          activeOpacity={0.88}
          accessibilityLabel="Catat Buang Air Cepat"
        >
          <View style={styles.fabInner}>
            <SirFlushIcon size={40} />
            {/* Floating plus badge */}
            <View style={styles.plusBadge}>
              <Text style={styles.plusBadgeText}>+</Text>
            </View>
          </View>
        </TouchableOpacity>
        <Text style={styles.fabLabel}>+ LOG</Text>
      </View>

      {/* Modal Quick Log 2-Tap */}
      <QuickLogModal visible={quickLogVisible} onClose={() => setQuickLogVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.darkBg,
  },
  fabContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 26 : 14,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99,
  },
  fabButton: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: Colors.peeAmber,
    padding: 3,
    borderWidth: 4,
    borderColor: Colors.darkBg,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.peeAmber,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 12,
  },
  fabInner: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  plusBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.ink,
    borderWidth: 1.5,
    borderColor: Colors.peeAmber,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusBadgeText: {
    color: Colors.peeAmber,
    fontWeight: '900',
    fontSize: 11,
    lineHeight: 12,
  },
  fabLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: Colors.peeAmber,
    letterSpacing: 0.8,
    marginTop: 2,
  },
});
