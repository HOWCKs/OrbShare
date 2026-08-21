package com.orbshare.app.data

import android.content.Context
import android.net.Uri
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

val Context.dataStore by preferencesDataStore(name = "orb_prefs")

object PrefKeys {
    val PSEUDONYM = stringPreferencesKey("pseudonym")
    val CUSTOM_IMAGE_URI = stringPreferencesKey("custom_image_uri")
    val ORB_COLOR = stringPreferencesKey("orb_color")
}

class UserPrefs(private val context: Context) {
    val pseudonymFlow: Flow<String> = context.dataStore.data.map { it[PrefKeys.PSEUDONYM] ?: "Sua Orb" }
    val customImageUriFlow: Flow<String?> = context.dataStore.data.map { it[PrefKeys.CUSTOM_IMAGE_URI] }
    val orbColorFlow: Flow<String> = context.dataStore.data.map { it[PrefKeys.ORB_COLOR] ?: "green" }

    suspend fun setPseudonym(name: String) {
        context.dataStore.edit { it[PrefKeys.PSEUDONYM] = name }
    }

    suspend fun setCustomImageUri(uri: Uri?) {
        context.dataStore.edit {
            if (uri == null) it.remove(PrefKeys.CUSTOM_IMAGE_URI)
            else it[PrefKeys.CUSTOM_IMAGE_URI] = uri.toString()
        }
    }

    suspend fun setOrbColor(color: String) {
        context.dataStore.edit { it[PrefKeys.ORB_COLOR] = color }
    }
}
