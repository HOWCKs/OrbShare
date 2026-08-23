package com.orbshare.app

import android.net.Uri
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import com.orbshare.app.ui.components.Tab
import com.orbshare.app.ui.components.BottomNav
import com.orbshare.app.ui.components.OrbState
import com.orbshare.app.ui.screens.*
import com.orbshare.app.ui.theme.Background
import com.orbshare.app.ui.theme.OrbShareTheme
import kotlinx.coroutines.launch

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContent {
            OrbShareTheme {
                val scope = rememberCoroutineScope()

                var activeTab by remember { mutableStateOf(Tab.HOME) }
                var transferState by remember { mutableStateOf(OrbState.IDLE) }
                var progress by remember { mutableStateOf(0f) }
                var pseudonym by remember { mutableStateOf("Sua Orb") }
                var customImageUri by remember { mutableStateOf<Uri?>(null) }

                val nearbyDevices = remember {
                    listOf(
                        NearbyDevice("1", "Maria Orb", Color(0xFFFF5C9D), "próximo", true),
                        NearbyDevice("2", "João Orb", Color(0xFF00E5CC), "próximo", true),
                        NearbyDevice("3", "Pedro Orb", Color(0xFFFFB020), "médio", true)
                    )
                }

                LaunchedEffect(transferState) {
                    if (transferState == OrbState.SENDING || transferState == OrbState.RECEIVING) {
                        for (i in 0..100) {
                            kotlinx.coroutines.delay(60)
                            progress = i / 100f
                        }
                        transferState = OrbState.COMPLETED
                        kotlinx.coroutines.delay(2500)
                        transferState = OrbState.IDLE
                        progress = 0f
                    }
                }

                Scaffold(
                    containerColor = Background,
                    bottomBar = {
                        BottomNav(
                            active = activeTab,
                            onChange = { activeTab = it },
                            pendingCount = if (transferState == OrbState.IDLE) nearbyDevices.size else 0
                        )
                    }
                ) { padding ->
                    Box(modifier = Modifier.padding(padding)) {
                        when (activeTab) {
                            Tab.HOME -> HomeScreen(
                                pseudonym = pseudonym,
                                customImageUri = customImageUri,
                                transferState = transferState,
                                progress = progress,
                                nearbyDevices = nearbyDevices,
                                onStartSend = {
                                    if (transferState == OrbState.IDLE) {
                                        transferState = OrbState.SEARCHING
                                        scope.launch {
                                            kotlinx.coroutines.delay(800)
                                            transferState = OrbState.CONNECTING
                                            kotlinx.coroutines.delay(1200)
                                            transferState = OrbState.SENDING
                                        }
                                    }
                                }
                            )
                            Tab.SEND -> SendScreen(
                                onSend = { files ->
                                    activeTab = Tab.HOME
                                    transferState = OrbState.SEARCHING
                                    scope.launch {
                                        kotlinx.coroutines.delay(800)
                                        transferState = OrbState.CONNECTING
                                        kotlinx.coroutines.delay(1200)
                                        transferState = OrbState.SENDING
                                    }
                                }
                            )
                            Tab.RECEIVE -> ReceiveScreen(
                                transferState = transferState,
                                progress = progress,
                                nearbyDevices = nearbyDevices,
                                pseudonym = pseudonym,
                                customImageUri = customImageUri,
                                onAccept = { transferState = OrbState.RECEIVING },
                                onDecline = { transferState = OrbState.IDLE }
                            )
                            Tab.HISTORY -> HistoryScreen()
                            Tab.SETTINGS -> SettingsScreen(
                                pseudonym = pseudonym,
                                customImageUri = customImageUri,
                                onPseudonymChange = { pseudonym = it },
                                onImagePick = { customImageUri = it }
                            )
                        }
                    }
                }
            }
        }
    }
}
