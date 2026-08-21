package com.orbshare.app.ui.components

import android.net.Uri
import androidx.compose.animation.core.*
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.gestures.detectVerticalDragGestures
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.*
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.orbshare.app.ui.theme.*
import kotlin.math.abs

enum class OrbState { IDLE, DRAGGING, SEARCHING, CONNECTING, SENDING, RECEIVING, COMPLETED }

@Composable
fun Orb(
    state: OrbState,
    progress: Float, // 0..1
    dragProgress: Float, // 0..1 when dragging
    pseudonym: String,
    customImageUri: Uri?,
    orbSize: Dp = 230.dp,
    fileCount: Int = 0,
    onDrag: (Float) -> Unit,
    onDragEnd: (Boolean) -> Unit, // true if should trigger send
    modifier: Modifier = Modifier
) {
    var offsetY by remember { mutableStateOf(0f) }
    val density = LocalDensity.current
    val thresholdPx = with(density) { 120.dp.toPx() }

    // Floating animation
    val infiniteTransition = rememberInfiniteTransition(label = "float")
    val floatOffset by infiniteTransition.animateFloat(
        initialValue = -6f,
        targetValue = 6f,
        animationSpec = infiniteRepeatable(
            animation = tween(2000, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ), label = "float"
    )

    val glowAlpha by infiniteTransition.animateFloat(
        initialValue = 0.3f,
        targetValue = 0.7f,
        animationSpec = infiniteRepeatable(tween(1500), RepeatMode.Reverse),
        label = "glow"
    )

    Box(
        modifier = modifier
            .size(orbSize + 40.dp)
            .offset(y = (floatOffset + offsetY).dp),
        contentAlignment = Alignment.Center
    ) {
        // Glow behind
        Box(
            modifier = Modifier
                .size(orbSize + 40.dp)
                .shadow(30.dp, CircleShape, ambientColor = Primary, spotColor = Primary)
                .background(Primary.copy(alpha = glowAlpha * 0.3f), CircleShape)
        )

        // Progress ring canvas
        Canvas(modifier = Modifier.size(orbSize + 12.dp)) {
            val strokeWidth = 8.dp.toPx()
            // Track
            drawArc(
                color = Border,
                startAngle = -90f,
                sweepAngle = 360f,
                useCenter = false,
                style = Stroke(width = strokeWidth, cap = StrokeCap.Round),
                size = Size(size.width - strokeWidth, size.height - strokeWidth),
                topLeft = Offset(strokeWidth / 2, strokeWidth / 2),
                alpha = 0.3f
            )
            // Progress for transfer
            if (state == OrbState.SENDING || state == OrbState.RECEIVING) {
                drawArc(
                    color = Primary,
                    startAngle = -90f,
                    sweepAngle = 360f * progress,
                    useCenter = false,
                    style = Stroke(width = strokeWidth, cap = StrokeCap.Round),
                    size = Size(size.width - strokeWidth, size.height - strokeWidth),
                    topLeft = Offset(strokeWidth / 2, strokeWidth / 2)
                )
            }
            // Drag progress
            if (dragProgress > 0f && state != OrbState.SENDING && state != OrbState.RECEIVING) {
                drawArc(
                    color = Secondary,
                    startAngle = -90f,
                    sweepAngle = 360f * dragProgress,
                    useCenter = false,
                    style = Stroke(width = strokeWidth, cap = StrokeCap.Round),
                    size = Size(size.width - strokeWidth, size.height - strokeWidth),
                    topLeft = Offset(strokeWidth / 2, strokeWidth / 2),
                    alpha = 0.9f
                )
            }
        }

        // Orb body
        Box(
            modifier = Modifier
                .size(orbSize)
                .shadow(20.dp, CircleShape)
                .clip(CircleShape)
                .background(
                    if (customImageUri == null) Brush.radialGradient(
                        colors = listOf(OrbGreen, OrbMint, OrbWhite),
                        center = Offset(0.3f * orbSize.value * density.density, 0.3f * orbSize.value * density.density),
                        radius = orbSize.value * density.density
                    ) else Brush.radialGradient(
                        colors = listOf(Color.Transparent, Color.Black.copy(alpha = 0.2f)),
                        center = Offset.Zero
                    )
                )
                .pointerInput(Unit) {
                    detectVerticalDragGestures(
                        onDragStart = {
                            onDrag(0f)
                        },
                        onVerticalDrag = { change, dragAmount ->
                            // Only allow drag up (negative)
                            val newOffset = (offsetY + dragAmount / density.density).coerceAtMost(0f)
                            offsetY = newOffset
                            val prog = (abs(newOffset) / 120f).coerceIn(0f, 1f)
                            onDrag(prog)
                        },
                        onDragEnd = {
                            val shouldSend = abs(offsetY) > 100f
                            onDragEnd(shouldSend)
                            offsetY = 0f
                            onDrag(0f)
                        },
                        onDragCancel = {
                            offsetY = 0f
                            onDrag(0f)
                        }
                    )
                },
            contentAlignment = Alignment.Center
        ) {
            // If custom image, show it
            if (customImageUri != null) {
                AsyncImage(
                    model = customImageUri,
                    contentDescription = "Orb personalizada",
                    modifier = Modifier
                        .fillMaxSize()
                        .clip(CircleShape),
                    contentScale = ContentScale.Crop
                )
                // Dark overlay for text readability
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(Color.Black.copy(alpha = 0.25f), CircleShape)
                )
            } else {
                // Default green orb visual - mimics image: green top, white bottom with cloud-like blending
                Canvas(modifier = Modifier.fillMaxSize()) {
                    // Base
                    drawCircle(
                        brush = Brush.linearGradient(
                            colors = listOf(
                                Color(0xFF4ADE80),
                                Color(0xFF86EFAC),
                                Color(0xFFDCFCE7),
                                Color.White
                            ),
                            start = Offset(0f, 0f),
                            end = Offset(size.width * 0.8f, size.height)
                        ),
                        radius = size.minDimension / 2,
                        center = center
                    )
                    // Cloud highlight - soft white blob bottom right
                    drawCircle(
                        brush = Brush.radialGradient(
                            colors = listOf(Color.White.copy(alpha = 0.9f), Color.Transparent),
                            center = Offset(size.width * 0.75f, size.height * 0.65f),
                            radius = size.width * 0.4f
                        ),
                        radius = size.width * 0.4f,
                        center = Offset(size.width * 0.75f, size.height * 0.65f)
                    )
                    // Top green shine
                    drawCircle(
                        color = Color(0xFF22C55E).copy(alpha = 0.3f),
                        radius = size.width * 0.3f,
                        center = Offset(size.width * 0.35f, size.height * 0.35f)
                    )
                }
            }

            // Content inside
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center,
                modifier = Modifier.padding(16.dp)
            ) {
                if (state == OrbState.SENDING || state == OrbState.RECEIVING) {
                    Text(
                        text = "${(progress * 100).toInt()}%",
                        fontSize = 42.sp,
                        fontWeight = FontWeight.Black,
                        color = TextWhite,
                        textAlign = TextAlign.Center
                    )
                    Text(
                        text = if (state == OrbState.SENDING) "Enviando..." else "Recebendo...",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = TextWhite.copy(alpha = 0.9f)
                    )
                    if (fileCount > 0) {
                        Text(
                            text = "$fileCount arquivos",
                            fontSize = 10.sp,
                            color = TextWhite.copy(alpha = 0.7f)
                        )
                    }
                } else {
                    // Show pseudonym and hint
                    Text(
                        text = pseudonym,
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Bold,
                        color = if (customImageUri != null) TextWhite else Color(0xFF14532D),
                        textAlign = TextAlign.Center,
                        modifier = Modifier
                            .background(
                                if (customImageUri != null) Color.Black.copy(alpha = 0.3f) else Color.White.copy(alpha = 0.7f),
                                shape = androidx.compose.foundation.shape.RoundedCornerShape(8.dp)
                            )
                            .padding(horizontal = 10.dp, vertical = 4.dp)
                    )
                    if (dragProgress > 0.2f) {
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            text = if (dragProgress > 0.85f) "Solte para enviar! 🚀" else "Continue ↑",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = Secondary,
                            modifier = Modifier
                                .background(Color.Black.copy(alpha = 0.5f), androidx.compose.foundation.shape.RoundedCornerShape(8.dp))
                                .padding(horizontal = 8.dp, vertical = 3.dp)
                        )
                    }
                }
            }
        }

        // Ripple when near threshold
        if (dragProgress > 0.7f && state != OrbState.SENDING && state != OrbState.RECEIVING) {
            Box(
                modifier = Modifier
                    .size(orbSize + 60.dp + (dragProgress * 20).dp)
                    .background(Color.Transparent, CircleShape)
                    .then(
                        Modifier.drawBehind {
                            drawCircle(
                                color = Secondary.copy(alpha = dragProgress),
                                style = Stroke(width = 2.dp.toPx())
                            )
                        }
                    )
            )
        }
    }
}
