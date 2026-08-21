import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { FileCard } from '../components/FileCard';
import { ShareFile, FileCategory } from '../types';

const { width } = Dimensions.get('window');

// Mock files for MVP - in real app uses MediaLibrary, FileSystem, Installed Apps
const MOCK_FILES: ShareFile[] = [
  { id: '1', name: 'IMG_20240815_123456.jpg', uri: 'file://mock/1.jpg', size: 3420000, sizeFormatted: '3.4 MB', category: 'photo' },
  { id: '2', name: 'VID_20240814_093012.mp4', uri: 'file://mock/2.mp4', size: 45200000, sizeFormatted: '45.2 MB', category: 'video' },
  { id: '3', name: 'musica_favorita.mp3', uri: 'file://mock/3.mp3', size: 8900000, sizeFormatted: '8.9 MB', category: 'music' },
  { id: '4', name: 'WhatsApp.apk', uri: 'file://mock/whatsapp.apk', size: 54300000, sizeFormatted: '54.3 MB', category: 'apk', packageName: 'com.whatsapp' },
  { id: '5', name: 'Documento.pdf', uri: 'file://mock/doc.pdf', size: 1200000, sizeFormatted: '1.2 MB', category: 'document' },
  { id: '6', name: 'Audio_voice.ogg', uri: 'file://mock/voice.ogg', size: 450000, sizeFormatted: '450 KB', category: 'audio' },
  { id: '7', name: 'Telegram.apk', uri: 'file://mock/telegram.apk', size: 38000000, sizeFormatted: '38 MB', category: 'apk', packageName: 'org.telegram' },
  { id: '8', name: 'Fotos_Ferias.zip', uri: 'file://mock/fotos.zip', size: 123000000, sizeFormatted: '123 MB', category: 'other' },
];

type CategoryFilter = 'all' | FileCategory;
const CATEGORIES: { id: CategoryFilter; label: string; icon: string }[] = [
  { id: 'all', label: 'Tudo', icon: '📦' },
  { id: 'photo', label: 'Fotos', icon: '🖼️' },
  { id: 'video', label: 'Vídeos', icon: '🎬' },
  { id: 'music', label: 'Músicas', icon: '🎵' },
  { id: 'apk', label: 'Apps', icon: '🤖' },
  { id: 'document', label: 'Docs', icon: '📄' },
];

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
}

interface Props {
  onSend: (files: ShareFile[]) => void;
  selectedFiles: ShareFile[];
  setSelectedFiles: (f: ShareFile[]) => void;
}

export function SendScreen({ onSend, selectedFiles, setSelectedFiles }: Props) {
  const [filter, setFilter] = useState<CategoryFilter>('all');

  const filtered = useMemo(() => {
    if (filter === 'all') return MOCK_FILES;
    return MOCK_FILES.filter(f => f.category === filter);
  }, [filter]);

  const totalSize = useMemo(() => {
    return selectedFiles.reduce((acc, f) => acc + f.size, 0);
  }, [selectedFiles]);

  const toggleFile = (file: ShareFile) => {
    const exists = selectedFiles.find(f => f.id === file.id);
    if (exists) {
      setSelectedFiles(selectedFiles.filter(f => f.id !== file.id));
    } else {
      setSelectedFiles([...selectedFiles, file]);
    }
  };

  const isSelected = (id: string) => !!selectedFiles.find(f => f.id === id);

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#070711', '#111127']} style={StyleSheet.absoluteFill} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Enviar arquivos</Text>
        <Text style={styles.subtitle}>Selecione o que deseja compartilhar</Text>
      </View>

      {/* Category filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll} contentContainerStyle={styles.catContainer}>
        {CATEGORIES.map(cat => {
          const active = filter === cat.id;
          return (
            <TouchableOpacity key={cat.id} onPress={() => setFilter(cat.id)} activeOpacity={0.7}>
              <LinearGradient
                colors={active ? ['#7C5CFF', '#5A3ED6'] : ['#1F1F3D', '#1F1F3D']}
                style={[styles.catChip, active && styles.catChipActive]}
              >
                <Text style={styles.catIcon}>{cat.icon}</Text>
                <Text style={[styles.catLabel, active && styles.catLabelActive]}>{cat.label}</Text>
              </LinearGradient>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* File list */}
      <ScrollView style={styles.list} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {filtered.map(file => (
          <FileCard key={file.id} file={file} selected={isSelected(file.id)} onToggle={() => toggleFile(file)} />
        ))}
        <View style={{ height: 200 }} />
      </ScrollView>

      {/* Bottom summary bar */}
      <View style={styles.bottomBar}>
        <LinearGradient colors={['#1F1F3D', '#17172F']} style={styles.summary}>
          <View style={styles.summaryLeft}>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{selectedFiles.length}</Text>
            </View>
            <View>
              <Text style={styles.selectedLabel}>{selectedFiles.length} arquivos selecionados</Text>
              <Text style={styles.sizeLabel}>{formatBytes(totalSize)} no total</Text>
            </View>
          </View>
          <TouchableOpacity
            disabled={selectedFiles.length === 0}
            onPress={() => onSend(selectedFiles)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={selectedFiles.length > 0 ? ['#7C5CFF', '#5A3ED6'] : ['#2A2A4A', '#2A2A4A']}
              style={styles.sendBtn}
            >
              <Text style={styles.sendBtnText}>Enviar via Orb 🔮</Text>
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>

        {/* Info */}
        <View style={styles.infoRow}>
          <Text style={styles.infoText}>📶 Envio por Wi-Fi Direct • 🔒 Criptografado • ⚡ Até 20MB/s</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: 'white',
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  catScroll: {
    maxHeight: 60,
  },
  catContainer: {
    paddingHorizontal: 16,
    gap: 8,
    paddingVertical: 8,
  },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  catChipActive: {
    borderColor: colors.primary,
  },
  catIcon: {
    fontSize: 14,
  },
  catLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  catLabelActive: {
    color: 'white',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    width: width,
    paddingBottom: 100,
  },
  summary: {
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(124,92,255,0.2)',
  },
  summaryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  countBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    fontSize: 16,
    fontWeight: '800',
    color: 'white',
  },
  selectedLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: 'white',
  },
  sizeLabel: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  sendBtn: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 14,
  },
  sendBtnText: {
    color: 'white',
    fontWeight: '800',
    fontSize: 13,
  },
  infoRow: {
    alignItems: 'center',
    marginTop: 12,
    paddingHorizontal: 20,
  },
  infoText: {
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
