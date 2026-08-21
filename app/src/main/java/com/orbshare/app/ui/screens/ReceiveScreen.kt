package com.orbshare.app.ui.screens

import android.net.Uri
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
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
import com.orbshare.app.ui.components.Orb
import com.orbshare.app.ui.components.OrbState
import com.orbshare.app.ui.theme.*

@Composable
fun ReceiveScreen(
    transferState: OrbState,
    progress: Float,
    nearbyDevices: List<NearbyDevice>,
    pseudonym: String,
    customImageUri: Uri?,
    onAccept: () -> Unit,
    onDecline: () -> Unit,
    modifier: Modifier = Modifier
) {
    var dragProgress by remember { mutableStateOf(0f) }

    Box(
        modifier = modifier
            .fillMaxSize()
            .background(Brush.verticalGradient(listOf(Background, BackgroundLight)))
    ) {
        if (transferState == OrbState.IDLE) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(bottom = 100.dp),
                verticalArrangement = Arrangement.Center,
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Box(
                    modifier = Modifier
                        .size(100.dp)
                        .clip(RoundedCornerShape(50.dp))
                        .background(Brush.linearGradient(listOf(CardLight, Card)))
                        .padding(1.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text(text = "📡", fontSize = 40.sp)
                }
                Spacer(modifier = Modifier.height(20.dp))
                Text(text = "Aguardando envio...", color = TextWhite, fontWeight = FontWeight.ExtraBold, fontSize = 18.sp)
                Text(
                    text = "Deixe sua Orb visível para amigos próximos",
                    color = TextSecondary,
                    fontSize = 13.sp,
                    modifier = Modifier.padding(horizontal = 40.dp)
                )
                Spacer(modifier = Modifier.height(30.dp))
                Column(
                    modifier = Modifier
                        .padding(horizontal = 24.dp)
                        .fillMaxWidth(0.85f),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(12.dp))
                            .background(Color.White.copy(alpha = 0.06f))
                            .padding(12.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(text = "💡", fontSize = 16.sp)
                        Spacer(modifier = Modifier.width(10.dp))
                        Text(text = "Ative Wi-Fi, Bluetooth e Localização", color = TextSecondary, fontSize = 12.sp)
                    }
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(12.dp))
                            .background(Color.White.copy(alpha = 0.06f))
                            .padding(12.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(text = "📶", fontSize = 16.sp)
                        Spacer(modifier = Modifier.width(10.dp))
                        Text(text = "Fique próximo do remetente (até 10m)", color = TextSecondary, fontSize = 12.sp)
                    }
                }
            }
        } else if (transferState == OrbState.SEARCHING || transferState == OrbState.CONNECTING) {
            val sender = nearbyDevices.firstOrNull()
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(horizontal = 20.dp)
                    .padding(bottom = 120.dp),
                verticalArrangement = Arrangement.Center,
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                // Incoming card
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(24.dp))
                        .background(Brush.linearGradient(listOf(Color(0xFF2A1F5A), Card)))
                        .padding(18.dp),
                    verticalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .size(56.dp)
                                .clip(RoundedCornerShape(28.dp))
                                .background(Brush.linearGradient(listOf(sender?.color ?: Primary, Color(0xFF2A1A66)))),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(text = (sender?.name?.firstOrNull()?.toString() ?: "?"), color = Color.White, fontWeight = FontWeight.ExtraBold, fontSize = 22.sp)
                        }
                        Spacer(modifier = Modifier.width(14.dp))
                        Column {
                            Text(text = sender?.name ?: "Amigo Orb", color = Color.White, fontWeight = FontWeight.ExtraBold, fontSize = 16.sp)
                            Text(text = "quer enviar arquivos para você", color = TextSecondary, fontSize = 13.sp)
                            Text(text = "via Wi-Fi Direct • ${sender?.distance ?: "próximo"}", color = TextMuted, fontSize = 11.sp)
                        }
                    }
                    Row(
                        modifier = Modifier
                            .clip(RoundedCornerShape(12.dp))
                            .background(Color.Black.copy(alpha = 0.2f))
                            .padding(10.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(text = "📦", fontSize = 16.sp)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(text = "3 arquivos • 56.8 MB", color = TextSecondary, fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                    }
                }
                Spacer(modifier = Modifier.height(40.dp))
                Orb(
                    state = transferState,
                    progress = 0f,
                    dragProgress = dragProgress,
                    pseudonym = "Aceitar",
                    customImageUri = customImageUri,
                    onDrag = { dragProgress = it },
                    onDragEnd = { should -> if (should) onAccept() }
                )
                Spacer(modifier = Modifier.height(16.dp))
                Text(text = "Arraste a Orb para cima para aceitar", color = Secondary, fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
                Spacer(modifier = Modifier.height(20.dp))
                Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(14.dp))
                            .background(Color.White.copy(alpha = 0.08f))
                            .padding(horizontal = 24.dp, vertical = 12.dp)
                    ) {
                        Text(text = "Recusar", color = TextSecondary, fontWeight = FontWeight.Bold)
                    }
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(14.dp))
                            .background(Brush.linearGradient(listOf(Primary, Color(0xFF5A3ED6))))
                            .padding(horizontal = 24.dp, vertical = 12.dp)
                    ) {
                        Text(text = "Permitir ✓", color = Color.White, fontWeight = FontWeight.ExtraBold)
                    }
                }
            }
        } else {
            // Receiving
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(bottom = 100.dp),
                verticalArrangement = Arrangement.Center,
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Orb(
                    state = transferState,
                    progress = progress,
                    dragProgress = 0f,
                    pseudonym = "Recebendo",
                    customImageUri = customImageUri,
                    onDrag = {},
                    onDragEnd = {}
                )
                Spacer(modifier = Modifier.height(30.dp))
                Text(text = "Recebendo...", color = TextWhite, fontWeight = FontWeight.ExtraBold, fontSize = 18.sp)
                Text(text = "arquivo", color = TextSecondary, fontSize = 13.sp)
                Text(text = "${(progress * 100).toInt()}% • Wi-Fi Direct 12MB/s", color = TextMuted, fontSize = 11.sp)
            }
        }
    }
}
