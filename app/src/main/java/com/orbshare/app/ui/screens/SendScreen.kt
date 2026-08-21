package com.orbshare.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.orbshare.app.ui.theme.*

data class ShareFile(
    val id: String,
    val name: String,
    val size: Long,
    val sizeFormatted: String,
    val category: String,
    val icon: String
)

@Composable
fun SendScreen(
    onSend: (List<ShareFile>) -> Unit,
    modifier: Modifier = Modifier
) {
    val mockFiles = remember {
        listOf(
            ShareFile("1", "IMG_20240815_123456.jpg", 3420000, "3.4 MB", "photo", "🖼️"),
            ShareFile("2", "VID_20240814_093012.mp4", 45200000, "45.2 MB", "video", "🎬"),
            ShareFile("3", "musica_favorita.mp3", 8900000, "8.9 MB", "music", "🎵"),
            ShareFile("4", "WhatsApp.apk", 54300000, "54.3 MB", "apk", "📦"),
            ShareFile("5", "Documento.pdf", 1200000, "1.2 MB", "doc", "📄"),
            ShareFile("6", "Audio_voice.ogg", 450000, "450 KB", "audio", "🎙️"),
            ShareFile("7", "Telegram.apk", 38000000, "38 MB", "apk", "🤖"),
            ShareFile("8", "Fotos_Ferias.zip", 123000000, "123 MB", "other", "📁")
        )
    }
    var filter by remember { mutableStateOf("all") }
    var selected by remember { mutableStateOf(setOf<String>()) }

    val filtered = if (filter == "all") mockFiles else mockFiles.filter { it.category == filter }
    val selectedFiles = mockFiles.filter { selected.contains(it.id) }
    val totalSize = selectedFiles.sumOf { it.size }
    fun formatBytes(bytes: Long): String {
        if (bytes < 1024) return "$bytes B"
        if (bytes < 1024 * 1024) return String.format("%.1f KB", bytes / 1024f)
        if (bytes < 1024 * 1024 * 1024) return String.format("%.1f MB", bytes / (1024f * 1024f))
        return String.format("%.2f GB", bytes / (1024f * 1024f * 1024f))
    }

    val categories = listOf(
        "all" to "Tudo 📦",
        "photo" to "Fotos 🖼️",
        "video" to "Vídeos 🎬",
        "music" to "Músicas 🎵",
        "apk" to "Apps 🤖",
        "doc" to "Docs 📄"
    )

    Box(
        modifier = modifier
            .fillMaxSize()
            .background(Brush.verticalGradient(listOf(Background, BackgroundLight)))
    ) {
        Column(modifier = Modifier.fillMaxSize().padding(top = 48.dp)) {
            // Header
            Column(modifier = Modifier.padding(horizontal = 20.dp)) {
                Text(text = "Enviar arquivos", color = TextWhite, fontWeight = FontWeight.ExtraBold, fontSize = 24.sp)
                Text(text = "Selecione o que deseja compartilhar", color = TextSecondary, fontSize = 13.sp)
            }
            Spacer(modifier = Modifier.height(12.dp))
            LazyRow(
                contentPadding = PaddingValues(horizontal = 16.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(categories) { (id, label) ->
                    val active = filter == id
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(14.dp))
                            .background(
                                if (active) Brush.linearGradient(listOf(Primary, Color(0xFF5A3ED6)))
                                else Brush.linearGradient(listOf(Card, Card))
                            )
                            .border(1.dp, if (active) Primary else Color.White.copy(alpha = 0.06f), RoundedCornerShape(14.dp))
                            .clickable { filter = id }
                            .padding(horizontal = 14.dp, vertical = 10.dp)
                    ) {
                        Text(text = label, color = if (active) Color.White else TextSecondary, fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
                    }
                }
            }
            Spacer(modifier = Modifier.height(12.dp))
            LazyColumn(
                modifier = Modifier.weight(1f),
                contentPadding = PaddingValues(horizontal = 16.dp, vertical = 8.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                items(filtered) { file ->
                    val isSelected = selected.contains(file.id)
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(18.dp))
                            .background(Brush.linearGradient(listOf(if (isSelected) Color(0xFF2A1F5A) else Card, Card)))
                            .border(1.dp, if (isSelected) Primary else Color.White.copy(alpha = 0.06f), RoundedCornerShape(18.dp))
                            .clickable {
                                selected = if (isSelected) selected - file.id else selected + file.id
                            }
                            .padding(14.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .size(48.dp)
                                .clip(RoundedCornerShape(12.dp))
                                .background(Primary.copy(alpha = 0.15f)),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(text = file.icon, fontSize = 24.sp)
                        }
                        Spacer(modifier = Modifier.width(12.dp))
                        Column(modifier = Modifier.weight(1f)) {
                            Text(text = file.name, color = Color.White, fontWeight = FontWeight.SemiBold, fontSize = 14.sp, maxLines = 1)
                            Text(text = "${file.sizeFormatted} • ${file.category.uppercase()}", color = TextMuted, fontSize = 12.sp)
                        }
                        Box(
                            modifier = Modifier
                                .size(26.dp)
                                .clip(RoundedCornerShape(13.dp))
                                .background(if (isSelected) Primary else Color.Transparent)
                                .border(2.dp, if (isSelected) Primary else Border, RoundedCornerShape(13.dp)),
                            contentAlignment = Alignment.Center
                        ) {
                            if (isSelected) Text(text = "✓", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 12.sp)
                        }
                    }
                }
                item { Spacer(modifier = Modifier.height(200.dp)) }
            }
        }

        // Bottom bar
        Column(
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .padding(bottom = 100.dp)
                .padding(horizontal = 16.dp)
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(20.dp))
                    .background(Brush.linearGradient(listOf(CardLight, Card)))
                    .border(1.dp, Primary.copy(alpha = 0.2f), RoundedCornerShape(20.dp))
                    .padding(16.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(40.dp)
                            .clip(RoundedCornerShape(12.dp))
                            .background(Primary),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(text = "${selected.size}", color = Color.White, fontWeight = FontWeight.ExtraBold, fontSize = 16.sp)
                    }
                    Spacer(modifier = Modifier.width(12.dp))
                    Column {
                        Text(text = "${selected.size} arquivos selecionados", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                        Text(text = "${formatBytes(totalSize)} no total", color = TextMuted, fontSize = 11.sp)
                    }
                }
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(14.dp))
                        .background(
                            if (selected.isNotEmpty()) Brush.linearGradient(listOf(Primary, Color(0xFF5A3ED6)))
                            else Brush.linearGradient(listOf(Border, Border))
                        )
                        .clickable(enabled = selected.isNotEmpty()) { onSend(selectedFiles) }
                        .padding(horizontal = 18.dp, vertical = 12.dp)
                ) {
                    Text(text = "Enviar via Orb 🔮", color = Color.White, fontWeight = FontWeight.ExtraBold, fontSize = 13.sp)
                }
            }
            Spacer(modifier = Modifier.height(12.dp))
            Text(
                text = "📶 Envio por Wi-Fi Direct • 🔒 Criptografado • ⚡ Até 20MB/s",
                color = TextMuted,
                fontSize = 11.sp,
                modifier = Modifier.align(Alignment.CenterHorizontally)
            )
        }
    }
}
