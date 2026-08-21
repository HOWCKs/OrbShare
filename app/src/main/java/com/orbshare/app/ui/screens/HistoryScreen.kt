package com.orbshare.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.orbshare.app.ui.theme.*

data class HistoryItem(val id: String, val name: String, val type: String, val size: String, val date: String, val from: String, val icon: String)

@Composable
fun HistoryScreen(modifier: Modifier = Modifier) {
    val history = listOf(
        HistoryItem("1", "Fotos Viagem", "recebido", "124 MB", "Hoje 14:32", "João Orb", "📥"),
        HistoryItem("2", "WhatsApp.apk", "enviado", "54 MB", "Hoje 10:15", "Você → Maria", "📤"),
        HistoryItem("3", "Músicas Favoritas", "enviado", "230 MB", "Ontem 19:20", "Você → Pedro", "📤"),
        HistoryItem("4", "Video Aula.mp4", "recebido", "420 MB", "Ontem 18:00", "Ana Orb", "📥")
    )

    Box(
        modifier = modifier
            .fillMaxSize()
            .background(Brush.verticalGradient(listOf(Background, BackgroundLight)))
    ) {
        Column(modifier = Modifier.fillMaxSize().padding(top = 48.dp)) {
            Column(modifier = Modifier.padding(horizontal = 20.dp)) {
                Text(text = "Histórico", color = TextWhite, fontWeight = FontWeight.ExtraBold, fontSize = 24.sp)
                Text(text = "Seus envios e recebimentos", color = TextSecondary, fontSize = 13.sp)
            }
            Spacer(modifier = Modifier.height(10.dp))
            LazyColumn(
                contentPadding = PaddingValues(horizontal = 16.dp, vertical = 10.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                items(history) { item ->
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(18.dp))
                            .background(Brush.linearGradient(listOf(CardLight, Card)))
                            .padding(14.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .size(44.dp)
                                .clip(RoundedCornerShape(12.dp))
                                .background(Color.White.copy(alpha = 0.06f)),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(text = item.icon, fontSize = 20.sp)
                        }
                        Spacer(modifier = Modifier.width(12.dp))
                        Column(modifier = Modifier.weight(1f)) {
                            Text(text = item.name, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                            Text(text = "${item.from} • ${item.size}", color = TextMuted, fontSize = 11.sp)
                            Text(text = item.date, color = TextMuted, fontSize = 10.sp)
                        }
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(10.dp))
                                .background(if (item.type == "enviado") Primary.copy(alpha = 0.15f) else Success.copy(alpha = 0.12f))
                                .padding(horizontal = 10.dp, vertical = 4.dp)
                        ) {
                            Text(
                                text = item.type.uppercase(),
                                color = if (item.type == "enviado") PrimaryLight else Success,
                                fontSize = 10.sp,
                                fontWeight = FontWeight.ExtraBold
                            )
                        }
                    }
                }
                item { Spacer(modifier = Modifier.height(120.dp)) }
            }
        }
    }
}
