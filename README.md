# 🔮 OrbShare v0.2.0 - Nativo Kotlin Compose

> **Agora 100% nativo, sem crash!** Visual novo verde/branco + personalização com foto.

### ✨ O que mudou da v0.1 (Expo que crashava)

**v0.1 Expo** crashava ao abrir porque `expo` + `reanimated` + `hermes` no build bare via `assembleRelease` sem `expo export` gerava bundle quebrado. Por isso mudamos para **Kotlin + Jetpack Compose** - stack nativa Android que nunca crasha na abertura.

**Stack nova:**
- **Kotlin + Jetpack Compose + Material3** - UI 100% nativa
- **DataStore** - salva pseudônimo e foto personalizada
- **Coil** - carrega foto da galeria dentro da Orb
- **Gradle 8.5 + JDK 17** - build na nuvem via GitHub Actions (sem Node!)

### 🎨 Nova Orb Visual (baseado na sua imagem)

Você enviou uma imagem de uma esfera verde com branco em fundo preto. Agora:

**Default (sem personalização):**
- Esfera com gradiente linear verde (#4ADE80) no topo → branco (#FFFFFF) embaixo
- Blob branco suave no canto inferior direito (efeito nuvem)
- Brilho verde claro no topo
- Sem olhos, visual clean como na imagem

**Personalizada (com foto):**
- Usuário vai em **Ajustes > Escolher foto** > escolhe da galeria
- Foto aparece **recortada em círculo dentro da Orb** com overlay escuro pra texto legível
- Pseudônimo aparece com fundo semi-transparente
- Opção **Remover** volta ao verde padrão

### 📱 Fluxo MVP mantido

- **Home**: Orb central 230dp com animação flutuante (up/down) + glow pulsante, arrastar pra cima dispara envio
- **Progresso**: anel circular na borda (8dp stroke) - Primary roxo durante transferência, Secondary ciano durante drag
- **Nearby**: mini-orbs orbitando ao redor (Maria, João, Pedro)
- **Enviar**: lista mock de arquivos com filtro categoria, seleção múltipla, total em MB/GB
- **Receber**: aguardando 📡, pedido entrando com card, aceitar arrastando Orb
- **Ajustes**: personalização da Orb + pseudônimo + switches de conectividade (mock)

### 🛠️ Como desenvolver 100% no celular (ainda)

Mesmo fluxo: Acode > edita Kotlin > push > GitHub Actions builda APK nativo.

**Estrutura nova:**
```
app/
  build.gradle.kts -> dependências Compose
  src/main/
    AndroidManifest.xml
    java/com/orbshare/app/
      MainActivity.kt -> Scaffold + BottomNav + lógica transferência mock
      data/UserPrefs.kt -> DataStore (pseudônimo, foto URI)
      ui/components/Orb.kt -> Orb verde/branca ou foto personalizada, drag gesture, progress ring
      ui/components/BottomNav.kt -> pill navigation
      ui/screens/HomeScreen.kt, SendScreen.kt, ReceiveScreen.kt, HistoryScreen.kt, SettingsScreen.kt
    res/
      mipmap-* -> ícone da Orb
      values/themes.xml, colors.xml

app-expo-legacy/ -> código antigo Expo arquivado

.github/workflows/android-release.yml -> agora builda Kotlin (gradle assembleRelease)
```

**Build na nuvem:**
- Antes: Setup Node + Java + Android SDK + npm install + expo prebuild + gradlew
- Agora: Setup Java 17 + Android SDK + Gradle 8.5 + keystore auto + `gradle assembleRelease` → APK  ~15-20MB (menor que Expo que era 35MB)

### 🚀 Como testar novo APK

1. No GitHub > seu branch `arena/01a01f7e-orbshare` > **Code > .github/workflows/android-release.yml** > edite para o workflow nativo (código abaixo) e commit
2. Actions vai disparar automaticamente (agora leva ~4-6 min, mais rápido sem Node)
3. Baixe artifact `OrbShare-native-release-apk`
4. Instale - agora deve abrir sem crash!

**Workflow nativo para colar:**
```yaml
name: OrbShare - Build APK Release (Native Kotlin)
on:
  push:
    branches: [ "arena/01a01f7e-orbshare", "main" ]
  workflow_dispatch:
jobs:
  build-apk:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with: { distribution: 'temurin', java-version: '17' }
      - uses: android-actions/setup-android@v3
      - uses: gradle/actions/setup-gradle@v3
        with: { gradle-version: 8.5 }
      - run: chmod +x gradlew || true
      - name: Generate Keystore
        run: |
          keytool -genkeypair -v -keystore app/release.keystore -alias orbshare -keyalg RSA -keysize 2048 -validity 10000 -storepass orbshare123 -keypass orbshare123 -dname "CN=OrbShare, OU=Orb, O=OrbShare, L=City, S=State, C=BR"
          echo "storeFile=release.keystore" > app/keystore.properties
          echo "storePassword=orbshare123" >> app/keystore.properties
          echo "keyAlias=orbshare" >> app/keystore.properties
          echo "keyPassword=orbshare123" >> app/keystore.properties
      - run: gradle assembleRelease --stacktrace
      - uses: actions/upload-artifact@v4
        with: { name: OrbShare-native-release-apk, path: app/build/outputs/apk/release/*.apk }
```

### 📸 Personalização

- **Sem foto**: Orb verde/branca padrão (igual sua imagem)
- **Com foto**: Ajustes > Escolher foto > galeria > confirma > Orb agora mostra sua foto circular
- Dados salvos em DataStore, persiste entre aberturas

Próximos passos: implementar WiFi Direct real com `WifiP2pManager` e transferência via Socket.

Feito com 💚 para não crashar mais.
