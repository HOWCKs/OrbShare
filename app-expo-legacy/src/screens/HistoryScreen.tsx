import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';

const MOCK_HISTORY = [
  { id: '1', name: 'Fotos Viagem', type: 'recebido', size: '124 MB', date: 'Hoje 14:32', from: 'João Orb', icon: '📥' },
  { id: '2', name: 'WhatsApp.apk', type: 'enviado', size: '54 MB', date: 'Hoje 10:15', from: 'Você → Maria', icon: '📤' },
  { id: '3', name: 'Músicas Favoritas', type: 'enviado', size: '230 MB', date: 'Ontem 19:20', from: 'Você → Pedro', icon: '📤' },
  { id: '4', name: 'Video Aula.mp4', type: 'recebido', size: '420 MB', date: 'Ontem 18:00', from: 'Ana Orb', icon: '📥' },
];

export function HistoryScreen() {
  return (
    <View style={styles.container}>
      <LinearGradient colors={['#070711', '#111127']} style={StyleSheet.absoluteFill} />
      <View style={styles.header}>
        <Text style={styles.title}>Histórico</Text>
        <Text style={styles.subtitle}>Seus envios e recebimentos</Text>
      </View>
      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {MOCK_HISTORY.map(item => (
          <LinearGradient key={item.id} colors={['#1F1F3D', '#17172F']} style={styles.card}>
            <View style={styles.iconBox}><Text style={styles.icon}>{item.icon}</Text></View>
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.meta}>{item.from} • {item.size}</Text>
              <Text style={styles.date}>{item.date}</Text>
            </View>
            <View style={[styles.typeBadge, { backgroundColor: item.type === 'enviado' ? 'rgba(124,92,255,0.15)' : 'rgba(0,229,160,0.12)' }]}>
              <Text style={[styles.typeText, { color: item.type === 'enviado' ? colors.primaryLight : colors.success }]}>{item.type}</Text>
            </View>
          </LinearGradient>
        ))}
        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16 },
  title: { fontSize: 24, fontWeight: '800', color: 'white' },
  subtitle: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
  list: { paddingHorizontal: 16, paddingTop: 10, gap: 10 },
  card: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 18, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', gap: 12 },
  iconBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.06)', alignItems: 'center', justifyContent: 'center' },
  icon: { fontSize: 20 },
  info: { flex: 1 },
  name: { color: 'white', fontWeight: '700', fontSize: 14 },
  meta: { color: colors.textMuted, fontSize: 11, marginTop: 2 },
  date: { color: colors.textMuted, fontSize: 10, marginTop: 2 },
  typeBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  typeText: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
});
