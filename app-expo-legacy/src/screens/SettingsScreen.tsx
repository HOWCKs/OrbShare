import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';

const COLORS = ['#7C5CFF', '#00E5CC', '#FF5C9D', '#FFB020', '#00E5A0'];

export function SettingsScreen({ pseudonym, setPseudonym }: { pseudonym: string; setPseudonym: (s: string) => void }) {
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [wifiDirect, setWifiDirect] = useState(true);
  const [bluetooth, setBluetooth] = useState(true);
  const [hotspot, setHotspot] = useState(true);

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#070711', '#111127']} style={StyleSheet.absoluteFill} />
      <View style={styles.header}>
        <Text style={styles.title}>Ajustes</Text>
        <Text style={styles.subtitle}>Personalize sua Orb</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile */}
        <LinearGradient colors={['#1F1F3D', '#17172F']} style={styles.card}>
          <Text style={styles.cardTitle}>Seu Avatar Orb</Text>
          <View style={styles.avatarRow}>
            <LinearGradient colors={[selectedColor, '#2A1A66']} style={styles.avatar}>
              <Text style={styles.avatarText}>{pseudonym[0]?.toUpperCase() || 'O'}</Text>
            </LinearGradient>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Pseudônimo</Text>
              <TextInput
                value={pseudonym}
                onChangeText={setPseudonym}
                placeholder="Ex: João Orb"
                placeholderTextColor={colors.textMuted}
                style={styles.input}
              />
            </View>
          </View>
          <Text style={[styles.label, { marginTop: 16 }]}>Cor da Orb</Text>
          <View style={styles.colorRow}>
            {COLORS.map(c => (
              <TouchableOpacity key={c} onPress={() => setSelectedColor(c)} style={[styles.colorDot, { backgroundColor: c, borderWidth: selectedColor === c ? 3 : 0, borderColor: 'white' }]} />
            ))}
          </View>
        </LinearGradient>

        {/* Connectivity */}
        <LinearGradient colors={['#1F1F3D', '#17172F']} style={styles.card}>
          <Text style={styles.cardTitle}>Conectividade</Text>
          <Text style={styles.desc}>Escolha como a Orb vai se conectar. Recomendado deixar tudo ativo para máxima velocidade.</Text>
          <View style={styles.option}>
            <View style={{ flex: 1 }}>
              <Text style={styles.optionTitle}>📶 Wi-Fi Direct</Text>
              <Text style={styles.optionSub}>Mais rápido • até 20MB/s</Text>
            </View>
            <Switch value={wifiDirect} onValueChange={setWifiDirect} trackColor={{ false: colors.border, true: colors.primary }} thumbColor="white" />
          </View>
          <View style={styles.option}>
            <View style={{ flex: 1 }}>
              <Text style={styles.optionTitle}>🔵 Bluetooth</Text>
              <Text style={styles.optionSub}>Compatibilidade • até 2MB/s</Text>
            </View>
            <Switch value={bluetooth} onValueChange={setBluetooth} trackColor={{ false: colors.border, true: colors.primary }} thumbColor="white" />
          </View>
          <View style={styles.option}>
            <View style={{ flex: 1 }}>
              <Text style={styles.optionTitle}>📡 Hotspot Automático</Text>
              <Text style={styles.optionSub}>Cria rede se necessário</Text>
            </View>
            <Switch value={hotspot} onValueChange={setHotspot} trackColor={{ false: colors.border, true: colors.primary }} thumbColor="white" />
          </View>
        </LinearGradient>

        {/* About */}
        <LinearGradient colors={['#1F1F3D', '#17172F']} style={styles.card}>
          <Text style={styles.cardTitle}>Sobre OrbShare</Text>
          <Text style={styles.desc}>MVP v0.1.0 • Feito para ser simples como arrastar uma bolha. Inspirado no SHAREit mas com alma de assistente.</Text>
          <View style={styles.versionBox}>
            <Text style={styles.versionText}>🔮 OrbShare • Build Release</Text>
            <Text style={styles.versionSub}>Desenvolvido 100% no celular + GitHub Actions ☁️</Text>
          </View>
        </LinearGradient>

        <View style={{ height: 130 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16 },
  title: { fontSize: 24, fontWeight: '800', color: 'white' },
  subtitle: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
  content: { paddingHorizontal: 16, gap: 16, paddingTop: 8 },
  card: { borderRadius: 20, padding: 18, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', gap: 6 },
  cardTitle: { fontSize: 14, fontWeight: '800', color: 'white', marginBottom: 8 },
  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 28, fontWeight: '900', color: 'white' },
  label: { fontSize: 12, color: colors.textSecondary, fontWeight: '600', marginBottom: 6 },
  input: { backgroundColor: 'rgba(0,0,0,0.2)', borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, color: 'white', fontWeight: '600' },
  colorRow: { flexDirection: 'row', gap: 12, marginTop: 4 },
  colorDot: { width: 36, height: 36, borderRadius: 18 },
  desc: { fontSize: 12, color: colors.textMuted, lineHeight: 16, marginBottom: 12 },
  option: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)' },
  optionTitle: { fontSize: 13, fontWeight: '700', color: 'white' },
  optionSub: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  versionBox: { backgroundColor: 'rgba(124,92,255,0.1)', padding: 12, borderRadius: 12, marginTop: 8 },
  versionText: { fontSize: 12, fontWeight: '700', color: colors.primaryLight },
  versionSub: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
});
