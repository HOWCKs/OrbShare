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

data class NearbyDevice(
    val id: String,
    val name: String,
    val color: Color,
    val distance: String,
    val isAvailable: Boolean
)

@Composable
fun HomeScreen(
    pseudonym: String,
    customImageUri: Uri?,
    transferState: OrbState,
    progress: Float,
    nearbyDevices: List<NearbyDevice>,
    onStartSend: () -> Unit,
    modifier: Modifier = Modifier
) {
    var dragProgress by remember { mutableStateOf(0f) }

    Box(
        modifier = modifier
            .fillMaxSize()
            .background(Brush.verticalGradient(listOf(Background, BackgroundLight, Color(0xFF0F1A0F))))
    ) {
        // Header
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = 48.dp, start = 20.dp, end = 20.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(text = "Olá, $pseudonym 👋", color = TextWhite, fontWeight = FontWeight.ExtraBold, fontSize = 22.sp)
                Text(
                    text = if (nearbyDevices.isNotEmpty()) "${nearbyDevices.size} por perto" else "Procurando amigos...",
                    color = TextSecondary,
                    fontSize = 13.sp
                )
            }
            Row(
                modifier = Modifier
                    .clip(RoundedCornerShape(20.dp))
                    .background(Success.copy(alpha = 0.12f))
                    .padding(horizontal = 10.dp, vertical = 6.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(modifier = Modifier.size(8.dp).clip(RoundedCornerShape(4.dp)).background(Success))
                Spacer(modifier = Modifier.width(6.dp))
                Text(text = "Online", color = Success, fontSize = 12.sp, fontWeight = FontWeight.Bold)
            }
        }

        // Orbit visualization
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(top = 80.dp),
            contentAlignment = Alignment.Center
        ) {
            // Orbit rings (simple circles via background)
            Box(
                modifier = Modifier
                    .size(340.dp)
                    .clip(RoundedCornerShape(170.dp))
                    .background(Color.Transparent)
            )
            // Nearby devices as mini orbs around
            nearbyDevices.forEachIndexed { idx, device ->
                val angle = (idx.toFloat() / nearbyDevices.size) * 360f
                val radius = 130.dp
                val x = kotlin.math.cos(Math.toRadians(angle.toDouble())).toFloat() * radius.value
                val y = kotlin.math.sin(Math.toRadians(angle.toDouble())).toFloat() * radius.value
                Column(
                    modifier = Modifier.offset(x = x.dp, y = y.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Box(
                        modifier = Modifier
                            .size(54.dp)
                            .clip(RoundedCornerShape(27.dp))
                            .background(Brush.linearGradient(listOf(device.color, Color(0xFF2A1A66))))
                            .padding(2.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(text = device.name.first().toString(), color = Color.White, fontWeight = FontWeight.ExtraBold, fontSize = 18.sp)
                    }
                    Text(text = device.name, color = TextSecondary, fontSize = 10.sp, fontWeight = FontWeight.SemiBold)
                    Box(
                        modifier = Modifier
                            .size(6.dp)
                            .clip(RoundedCornerShape(3.dp))
                            .background(if (device.isAvailable) Success else TextMuted)
                    )
                }
            }

            // Main Orb
            Orb(
                state = if (dragProgress > 0f && transferState == OrbState.IDLE) OrbState.DRAGGING else transferState,
                progress = progress,
                dragProgress = dragProgress,
                pseudonym = pseudonym,
                customImageUri = customImageUri,
                onDrag = { dragProgress = it },
                onDragEnd = { shouldSend ->
                    if (shouldSend) onStartSend()
                }
            )
        }

        // Bottom hint
        Column(
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .padding(bottom = 160.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            if (transferState == OrbState.IDLE && dragProgress == 0f) {
                Box(modifier = Modifier.width(2.dp).height(24.dp).background(Primary.copy(alpha = 0.3f)))
                Spacer(modifier = Modifier.height(6.dp))
                Text(text = "Arraste a Orb para cima para enviar", color = TextWhite, fontWeight = FontWeight.Bold, fontSize = 15.sp)
                Text(
                    text = "Selecione arquivos e compartilhe por proximidade",
                    color = TextMuted,
                    fontSize = 12.sp
                )
            } else if (dragProgress > 0f) {
                Text(
                    text = if (dragProgress > 0.85f) "🚀 Quase lá!" else "↑ Continue puxando",
                    color = Secondary,
                    fontWeight = FontWeight.Bold,
                    fontSize = 15.sp
                )
                Spacer(modifier = Modifier.height(6.dp))
                Box(
                    modifier = Modifier
                        .width(120.dp)
                        .height(4.dp)
                        .clip(RoundedCornerShape(2.dp))
                        .background(Border)
                ) {
                    Box(
                        modifier = Modifier
                            .fillMaxHeight()
                            .fillMaxWidth(dragProgress)
                            .background(Secondary)
                    )
                }
            } else {
                Text(
                    text = when (transferState) {
                        OrbState.SEARCHING -> "🔍 Buscando dispositivos..."
                        OrbState.CONNECTING -> "🤝 Conectando..."
                        OrbState.SENDING -> "📤 Enviando arquivos..."
                        OrbState.COMPLETED -> "✅ Envio concluído!"
                        else -> ""
                    },
                    color = TextWhite,
                    fontWeight = FontWeight.Bold,
                    fontSize = 15.sp
                )
                Text(
                    text = if (transferState == OrbState.SENDING) "Mantenha os aparelhos próximos" else "Aguarde um momento",
                    color = TextMuted,
                    fontSize = 12.sp
                )
            }
        }

        // Quick actions
        Row(
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .padding(bottom = 110.dp)
                .padding(horizontal = 16.dp),
            horizontalArrangement = Arrangement.SpaceEvenly
        ) {
            listOf("📷" to "Fotos", "🎬" to "Vídeos", "🎵" to "Músicas", "📦" to "Apps").forEach { (icon, label) ->
                Column(
                    modifier = Modifier
                        .clip(RoundedCornerShape(16.dp))
                        .background(Color.White.copy(alpha = 0.06f))
                        .padding(horizontal = 18.dp, vertical = 12.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text(text = icon, fontSize = 20.sp)
                    Text(text = label, color = TextSecondary, fontSize = 11.sp, fontWeight = FontWeight.SemiBold)
                }
                Spacer(modifier = Modifier.width(8.dp))
            }
        }
    }
}
