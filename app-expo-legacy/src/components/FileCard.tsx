import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { ShareFile } from '../types';

interface Props {
  file: ShareFile;
  selected: boolean;
  onToggle: () => void;
}

const categoryIcon: Record<string, string> = {
  photo: '🖼️',
  video: '🎬',
  music: '🎵',
  audio: '🎙️',
  apk: '📦',
  document: '📄',
  other: '📁',
};

export function FileCard({ file, selected, onToggle }: Props) {
  return (
    <TouchableOpacity onPress={onToggle} activeOpacity={0.8} style={styles.container}>
      <LinearGradient
        colors={selected ? ['#2A1F5A', '#1F1F3D'] : ['#1F1F3D', '#17172F']}
        style={[styles.card, selected && styles.cardSelected]}
      >
        <View style={styles.iconBox}>
          <Text style={styles.icon}>{categoryIcon[file.category]}</Text>
        </View>
        <View style={styles.info}>
          <Text numberOfLines={1} style={styles.name}>{file.name}</Text>
          <Text style={styles.size}>{file.sizeFormatted} • {file.category.toUpperCase()}</Text>
        </View>
        <View style={[styles.check, selected && styles.checkSelected]}>
          {selected && <Text style={styles.checkText}>✓</Text>}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    gap: 12,
  },
  cardSelected: {
    borderColor: colors.primary,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(124,92,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 24,
  },
  info: {
    flex: 1,
  },
  name: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  size: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  check: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkText: {
    color: 'white',
    fontWeight: '800',
    fontSize: 12,
  },
});
