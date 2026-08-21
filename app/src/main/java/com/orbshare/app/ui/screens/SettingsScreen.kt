package com.orbshare.app.ui.screens

import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.orbshare.app.ui.theme.*

@Composable
fun SettingsScreen(
    pseudonym: String,
    customImageUri: Uri?,
    onPseudonymChange: (String) -> Unit,
    onImagePick: (Uri?) -> Unit,
    modifier: Modifier = Modifier
) {
    val imagePicker = rememberLauncherForActivityResult(ActivityResultContracts.GetContent()) { uri: Uri? ->
        onImagePick(uri)
    }

    val colors = listOf(
        Color(0xFF4ADE80) to "Verde (padrão)",
        Color(0xFF7C5CFF) to "Roxo",
        Color(0xFF00E5CC) to "Ciano",
        Color(0xFFFF5C9D) to "Rosa",
        Color(0xFFFFB020) to "Amarelo"
    )

    Box(
        modifier = modifier
            .fillMaxSize()
            .background(Brush.verticalGradient(listOf(Background, BackgroundLight)))
    ) {
        Column(modifier = Modifier.fillMaxSize().padding(top = 48.dp)) {
            Column(modifier = Modifier.padding(horizontal = 20.dp)) {
                Text(text = "Ajustes", color = TextWhite, fontWeight = FontWeight.ExtraBold, fontSize = 24.sp)
                Text(text = "Personalize sua Orb", color = TextSecondary, fontSize = 13.sp)
            }
            LazyColumn(
                contentPadding = PaddingValues(horizontal = 16.dp, vertical = 16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                item {
                    // Profile card with image personalization
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(20.dp))
                            .background(Brush.linearGradient(listOf(CardLight, Card)))
                            .border(1.dp, Color.White.copy(alpha = 0.06f), RoundedCornerShape(20.dp))
                            .padding(18.dp),
                        verticalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        Text(text = "Seu Avatar Orb", color = TextWhite, fontWeight = FontWeight.ExtraBold, fontSize = 14.sp)
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            // Preview of orb with custom image
                            Box(
                                modifier = Modifier
                                    .size(72.dp)
                                    .clip(CircleShape)
                                    .background(
                                        if (customImageUri == null) Brush.radialGradient(listOf(OrbGreen, OrbMint, OrbWhite))
                                        else Brush.linearGradient(listOf(Color.Transparent, Color.Transparent))
                                    )
                                    .border(2.dp, Color.White.copy(alpha = 0.15f), CircleShape),
                                contentAlignment = Alignment.Center
                            ) {
                                if (customImageUri != null) {
                                    AsyncImage(
                                        model = customImageUri,
                                        contentDescription = null,
                                        modifier = Modifier.fillMaxSize().clip(CircleShape),
                                        contentScale = ContentScale.Crop
                                    )
                                } else {
                                    Text(text = pseudonym.firstOrNull()?.uppercase() ?: "O", color = Color(0xFF14532D), fontWeight = FontWeight.Black, fontSize = 28.sp)
                                }
                            }
                            Spacer(modifier = Modifier.width(14.dp))
                            Column(modifier = Modifier.weight(1f)) {
                                Text(text = "Pseudônimo", color = TextSecondary, fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                                Spacer(modifier = Modifier.height(6.dp))
                                OutlinedTextField(
                                    value = pseudonym,
                                    onValueChange = onPseudonymChange,
                                    placeholder = { Text(text = "Ex: João Orb", color = TextMuted) },
                                    modifier = Modifier.fillMaxWidth(),
                                    singleLine = true,
                                    colors = OutlinedTextFieldDefaults.colors(
                                        focusedTextColor = Color.White,
                                        unfocusedTextColor = Color.White,
                                        focusedBorderColor = Primary,
                                        unfocusedBorderColor = Border
                                    ),
                                    shape = RoundedCornerShape(12.dp)
                                )
                            }
                        }

                        // Personalize with image
                        Text(text = "Personalizar Orb com foto", color = TextSecondary, fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            Button(
                                onClick = { imagePicker.launch("image/*") },
                                colors = ButtonDefaults.buttonColors(containerColor = Primary),
                                shape = RoundedCornerShape(12.dp)
                            ) {
                                Text(text = if (customImageUri == null) "📷 Escolher foto" else "🔄 Trocar foto", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                            }
                            if (customImageUri != null) {
                                OutlinedButton(
                                    onClick = { onImagePick(null) },
                                    shape = RoundedCornerShape(12.dp),
                                    colors = ButtonDefaults.outlinedButtonColors(contentColor = TextSecondary)
                                ) {
                                    Text(text = "Remover", fontSize = 13.sp)
                                }
                            }
                        }
                        if (customImageUri != null) {
                            Text(
                                text = "Sua foto vai aparecer dentro da Orb! Se não gostar, pode remover e volta ao visual padrão verde.",
                                color = TextMuted,
                                fontSize = 11.sp,
                                lineHeight = 14.sp
                            )
                        } else {
                            Text(
                                text = "Visual padrão: esfera verde com branco (como na imagem que enviou). Escolha uma foto da galeria para personalizar.",
                                color = TextMuted,
                                fontSize = 11.sp,
                                lineHeight = 14.sp
                            )
                        }
                    }
                }

                item {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(20.dp))
                            .background(Brush.linearGradient(listOf(CardLight, Card)))
                            .border(1.dp, Color.White.copy(alpha = 0.06f), RoundedCornerShape(20.dp))
                            .padding(18.dp),
                        verticalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        Text(text = "Conectividade", color = TextWhite, fontWeight = FontWeight.ExtraBold, fontSize = 14.sp)
                        Text(text = "Escolha como a Orb vai se conectar. Recomendado deixar tudo ativo.", color = TextMuted, fontSize = 12.sp)
                        SettingSwitch("📶 Wi-Fi Direct", "Mais rápido • até 20MB/s", true)
                        SettingSwitch("🔵 Bluetooth", "Compatibilidade • até 2MB/s", true)
                        SettingSwitch("📡 Hotspot Automático", "Cria rede se necessário", true)
                    }
                }

                item {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(20.dp))
                            .background(Brush.linearGradient(listOf(CardLight, Card)))
                            .border(1.dp, Color.White.copy(alpha = 0.06f), RoundedCornerShape(20.dp))
                            .padding(18.dp),
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Text(text = "Sobre OrbShare v0.2.0", color = TextWhite, fontWeight = FontWeight.ExtraBold, fontSize = 14.sp)
                        Text(text = "Agora nativo Kotlin + Compose, sem crash! Visual verde padrão inspirado na sua imagem + personalização com foto.", color = TextMuted, fontSize = 12.sp, lineHeight = 16.sp)
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(12.dp))
                                .background(Primary.copy(alpha = 0.1f))
                                .padding(12.dp)
                        ) {
                            Column {
                                Text(text = "🔮 OrbShare • Build Release Nativo", color = PrimaryLight, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                                Text(text = "Desenvolvido 100% no celular + GitHub Actions ☁️", color = TextMuted, fontSize = 11.sp)
                            }
                        }
                    }
                }

                item { Spacer(modifier = Modifier.height(120.dp)) }
            }
        }
    }
}

@Composable
fun SettingSwitch(title: String, sub: String, checked: Boolean) {
    var isChecked by remember { mutableStateOf(checked) }
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 8.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Column(modifier = Modifier.weight(1f)) {
            Text(text = title, color = TextWhite, fontSize = 13.sp, fontWeight = FontWeight.Bold)
            Text(text = sub, color = TextMuted, fontSize = 11.sp)
        }
        Switch(
            checked = isChecked,
            onCheckedChange = { isChecked = it },
            colors = SwitchDefaults.colors(
                checkedThumbColor = Color.White,
                checkedTrackColor = Primary
            )
        )
    }
}
