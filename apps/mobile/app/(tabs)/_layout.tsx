import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Map, Calendar, BarChart2, Settings, Plus } from 'lucide-react-native';
import { QuickLogModal } from '@/src/components/QuickLogModal';

export default function TabLayout() {
  const [quickLogVisible, setQuickLogVisible] = useState(false);

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors.peeAmber,
          tabBarInactiveTintColor: Colors.dark.tabIconDefault,
          tabBarStyle: {
            backgroundColor: Colors.darkBg,
            borderTopColor: Colors.darkBorder,
            borderTopWidth: 1,
            height: Platform.OS === 'ios' ? 88 : 68,
            paddingBottom: Platform.OS === 'ios' ? 28 : 10,
            paddingTop: 8,
          },
          headerStyle: {
            backgroundColor: Colors.darkBg,
            borderBottomColor: Colors.darkBorder,
            borderBottomWidth: 1,
          },
          headerTitleStyle: {
            color: Colors.creamBg,
            fontWeight: '900',
            fontSize: 18,
          },
        }}
      >
        {/* Tab 1: Peta Pribadi */}
        <Tabs.Screen
          name="index"
          options={{
            title: 'Peta',
            tabBarIcon: ({ color }) => <Map size={22} color={color} />,
          }}
        />

        {/* Tab 2: Timeline Buku Harian */}
        <Tabs.Screen
          name="timeline"
          options={{
            title: 'Riwayat',
            tabBarIcon: ({ color }) => <Calendar size={22} color={color} />,
          }}
        />

        {/* Placeholder Tab untuk FAB Tengah */}
        <Tabs.Screen
          name="fab-placeholder"
          options={{
            title: '',
            tabBarButton: () => (
              <View style={styles.fabWrapper}>
                <TouchableOpacity
                  style={styles.fabButton}
                  onPress={() => setQuickLogVisible(true)}
                  activeOpacity={0.85}
                >
                  <Plus size={28} color="#000" strokeWidth={3} />
                </TouchableOpacity>
              </View>
            ),
          }}
        />

        {/* Tab 3: Statistik & Lencana */}
        <Tabs.Screen
          name="stats"
          options={{
            title: 'Stats',
            tabBarIcon: ({ color }) => <BarChart2 size={22} color={color} />,
          }}
        />

        {/* Tab 4: Pengaturan */}
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Pengaturan',
            tabBarIcon: ({ color }) => <Settings size={22} color={color} />,
          }}
        />

        {/* Sembunyikan default template two.tsx jika masih ada */}
        <Tabs.Screen
          name="two"
          options={{
            href: null,
          }}
        />
      </Tabs>

      {/* Modal Quick Log 2-Tap (Lil Drip / Mr Plop) */}
      <QuickLogModal visible={quickLogVisible} onClose={() => setQuickLogVisible(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  fabWrapper: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.peeAmber,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.peeAmber,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 4,
    borderColor: Colors.darkBg,
  },
});
