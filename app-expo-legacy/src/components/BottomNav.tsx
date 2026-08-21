import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';

const { width } = Dimensions.get('window');

type Tab = 'home' | 'send' | 'receive' | 'history' | 'settings';

interface Props {
  active: Tab;
  onChange: (t: Tab) => void;
  pendingCount?: number;
}

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: 'home', label: 'Orb', icon: '🔮' },
  { id: 'send', label: 'Enviar', icon: '📤' },
  { id: 'receive', label: 'Receber', icon: '📥' },
  { id: 'history', label: 'Histórico', icon: '🕘' },
  { id: 'settings', label: 'Ajustes', icon: '⚙️' },
];

export function BottomNav({ active, onChange, pendingCount = 0 }: Props) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1F1F3D', '#17172F']}
        style={styles.bar}
      >
        {tabs.map((tab) => {
          const isActive = active === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => onChange(tab.id)}
              activeOpacity={0.7}
            >
              {isActive ? (
                <LinearGradient colors={['#7C5CFF', '#5A3ED6']} style={styles.activeIconWrap}>
                  <Text style={styles.iconActive}>{tab.icon}</Text>
                </LinearGradient>
              ) : (
                <View style={styles.iconWrap}>
                  <Text style={styles.icon}>{tab.icon}</Text>
                  {tab.id === 'receive' && pendingCount > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{pendingCount}</Text>
                    </View>
                  )}
                </View>
              )}
              <Text style={[styles.label, isActive && styles.labelActive]}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </LinearGradient>
      {/* Home indicator spacing */}
      <View style={styles.homeIndicator} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: width,
    alignItems: 'center',
    paddingBottom: 10,
  },
  bar: {
    flexDirection: 'row',
    width: width - 24,
    borderRadius: 28,
    paddingVertical: 8,
    paddingHorizontal: 6,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    gap: 4,
  },
  tabActive: {},
  iconWrap: {
    width: 44,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIconWrap: {
    width: 52,
    height: 36,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 22,
    opacity: 0.7,
  },
  iconActive: {
    fontSize: 22,
    color: 'white',
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textMuted,
  },
  labelActive: {
    color: colors.text,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 6,
    backgroundColor: colors.accent,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: 'white',
  },
  homeIndicator: {
    width: 120,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginTop: 12,
  },
});
