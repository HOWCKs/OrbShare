package com.orbshare.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
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

enum class Tab { HOME, SEND, RECEIVE, HISTORY, SETTINGS }

data class TabItem(val id: Tab, val label: String, val icon: String)

@Composable
fun BottomNav(
    active: Tab,
    onChange: (Tab) -> Unit,
    pendingCount: Int = 0,
    modifier: Modifier = Modifier
) {
    val tabs = listOf(
        TabItem(Tab.HOME, "Orb", "🔮"),
        TabItem(Tab.SEND, "Enviar", "📤"),
        TabItem(Tab.RECEIVE, "Receber", "📥"),
        TabItem(Tab.HISTORY, "Histórico", "🕘"),
        TabItem(Tab.SETTINGS, "Ajustes", "⚙️")
    )

    Column(
        modifier = modifier
            .fillMaxWidth()
            .padding(bottom = 12.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Row(
            modifier = Modifier
                .padding(horizontal = 12.dp)
                .clip(RoundedCornerShape(28.dp))
                .background(Brush.linearGradient(listOf(CardLight, Card)))
                .padding(vertical = 8.dp, horizontal = 6.dp),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            tabs.forEach { tab ->
                val isActive = active == tab.id
                Column(
                    modifier = Modifier
                        .weight(1f)
                        .clip(RoundedCornerShape(14.dp))
                        .background(
                            if (isActive) Brush.linearGradient(listOf(Primary, Color(0xFF5A3ED6)))
                            else Brush.linearGradient(listOf(Color.Transparent, Color.Transparent))
                        )
                        .clickable { onChange(tab.id) }
                        .padding(vertical = 6.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Box {
                        Text(
                            text = tab.icon,
                            fontSize = if (isActive) 22.sp else 20.sp,
                            modifier = Modifier.padding(2.dp)
                        )
                        if (tab.id == Tab.RECEIVE && pendingCount > 0 && !isActive) {
                            Box(
                                modifier = Modifier
                                    .offset(x = 12.dp, y = (-4).dp)
                                    .size(16.dp)
                                    .clip(RoundedCornerShape(8.dp))
                                    .background(Accent),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(
                                    text = "$pendingCount",
                                    fontSize = 9.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Color.White
                                )
                            }
                        }
                    }
                    Text(
                        text = tab.label,
                        fontSize = 10.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = if (isActive) TextWhite else TextMuted
                    )
                }
            }
        }
        Spacer(modifier = Modifier.height(12.dp))
        Box(
            modifier = Modifier
                .width(120.dp)
                .height(4.dp)
                .clip(RoundedCornerShape(2.dp))
                .background(Color.White.copy(alpha = 0.2f))
        )
    }
}
