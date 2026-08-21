# 🔮 OrbShare - MVP

> **Clone do SHAREit com alma de assistente virtual.** Envie qualquer arquivo por proximidade arrastando uma Orb fofa.

### ✨ Conceito Principal (você pediu)

**Home = Orb 3D Central**
- Uma bolha redonda 3D no centro da tela, seu avatar/pseudônimo.
- 2 olhinhos com expressão: felicidade/alegria, que se mexem aleatoriamente e piscam.
- Para enviar: **arrastar a bolha para cima**. Quando arrasta, borda mostra progresso do gesto até travar e disparar.
- Para receber: outro usuário arrasta para cima OU clica em "Permitir" quando conectados/próximos.
- Durante transferência: borda da Orb vira **linha circular de carregamento** + % no centro.
- Abaixo: **Bottom Navigation pill** (Orb, Enviar, Receber, Histórico, Ajustes).

### 📂 O que o app faz (MVP)

- **Envio/recebimento**: música, foto, vídeo, áudio, APK (da memória + apps instalados listados).
- **Tecnologias proximidade**: Wi-Fi Direct (até 20MB/s), Bluetooth, Hotspot automático, Wi-Fi. MVP com arquitetura pronta + mock simulado; troca para implementação real em 1 arquivo (`TransferService`).
- **Tela Enviar**: filtro por categoria, seleção múltipla, mostra tamanho total e quantidade (ex: 3 arquivos • 56.8 MB).
- **Tela Receber**: aguardando, pedido entrando, aceitar arrastando.
- **Sem jargão técnico para usuário**: tudo visual, ícones e gestos.

---

## 📱 Como desenvolver 100% pelo celular Android (sem pesar)

Você NÃO precisa compilar local. Todo build é na nuvem.

### 1. Ferramentas no celular

Instale:
- **Acode** (editor de código) ou **Spck Editor** - para editar arquivos
- **GitHub App** - para dar push
- **Termux** (opcional) se quiser rodar `npm` local só para checar erros, mas não precisa.

### 2. Estrutura do projeto

```
/app
  App.tsx -> controle de abas e transferência
  src/components/Orb.tsx -> A ORB (3D, olhos, progresso circular, gesto arrasta)
  src/screens/HomeScreen.tsx -> orbit com dispositivos próximos
  src/screens/SendScreen.tsx -> seleção de arquivos
  src/screens/ReceiveScreen.tsx -> aceitar envio
  src/components/BottomNav.tsx -> navegação inferior
  src/services/TransferService.ts -> arquitetura WiFiDirect/Bluetooth/Hotspot
/.github/workflows/android-release.yml -> BUILD NA NUVEM
```

### 3. Fluxo de trabalho

1. Abra o repo no **Acode**: `Open Folder > OrbShare`
2. Edite `app/src/...` - ex: cores em `theme/colors.ts`, textos, lógica da Orb em `Orb.tsx`.
3. Faça commit e push para branch `arena/01a01f7e-orbshare` direto pelo Acode ou GitHub App.
4. **Automaticamente** o GitHub Actions vai:
   - Instalar Node, Java, Android SDK
   - Rodar `expo prebuild`
   - Gerar keystore de release automaticamente
   - Rodar `./gradlew assembleRelease`
   - Gerar APK em `Artifacts` e também em `Releases`
5. No celular, abra `github.com/HOWCKs/OrbShare/actions`, baixe o APK do último workflow (seção Artifacts) ou vá em Releases e instale.

> **Resultado**: você testa instalando APK release direto, sem preview, sem emulador, sem pesar seu aparelho.

### 4. Rodar workflow manualmente

- No GitHub site > Actions > OrbShare - Build APK Release > Run workflow.

---

## 🎨 Melhorias que adicionei ao seu conceito (pode revisar)

1. **Orbit visual**: dispositivos próximos aparecem como mini-orbs orbitando ao redor da sua Orb central, com cor e inicial. Dá sensação de proximidade real.
2. **Haptics**: vibração leve quando arrasta e média quando atinge threshold 90% - feedback tátil.
3. **Estados visuais da Orb**: idle (olhos passeando), dragging (sorriso maior), searching (olhos arregalados 👀), sending/receiving (porcentagem), completed (🥳).
4. **Barra de seleção inteligente**: no Enviar, mostra total em MB/GB, não só quantidade.
5. **Fallbacks técnicos**: se Wi-Fi Direct falhar, tenta Bluetooth, depois Hotspot automático (igual SHAREit real).
6. **Segurança**: indicador "Criptografado" e futura camada de criptografia no service.
7. **Histórico**: para usuário ver o que já mandou/recebeu.
8. **Pseudônimo editável + cor da Orb** em Ajustes - personaliza sem precisar login.

Quer que eu adicione mais?
- [ ] Radar sonoro estilo AirDrop
- [ ] Animação de partículas quando envia
- [ ] QR Code para parear rápido
- [ ] Tema claro/escuro

---

## 🔧 Próximos passos técnicos (para depois do MVP visual)

1. **Implementar real Wi-Fi Direct**: usar `react-native-wifi-p2p` (já deixei arquitetura em `TransferService.ts`)
   ```ts
   class WifiDirectRealStrategy implements Strategy { ... }
   ```
2. **Listar APKs instalados**: criar módulo nativo Kotlin que usa `PackageManager.getInstalledApplications()`
3. **File transfer socket**: abrir ServerSocket no receptor, cliente conecta e stream.
4. **Permissões runtime**: pedir `NEARBY_WIFI_DEVICES`, `BLUETOOTH_CONNECT`, `READ_MEDIA_*`.

Por enquanto, MVP finge transferência com progresso para você validar UX instalando APK.

---

## 🚀 Build Local (se quiser testar no PC depois)

```bash
cd app
npm install
npx expo prebuild --platform android
cd android
./gradlew assembleRelease
```

APK sai em `app/android/app/build/outputs/apk/release/app-release.apk`

---

Feito com 💜 para ser desenvolvido no celular.
