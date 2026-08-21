# Fluxo UX - OrbShare

## Home (Orb Central)
- Usuário abre app, vê Orb central com seu pseudônimo.
- Ao redor, mini-orbs dos amigos próximos (descobertos via WiFi Direct/NSD).
- Mensagem: "Arraste a Orb para cima para enviar"
- Quick actions embaixo: Fotos, Vídeos, Músicas, Apps

### Gesto Enviar
1. Usuário segura Orb e arrasta pra cima
2. Feedback: vibração leve, anel externo preenche em verde (dragProgress)
3. Se drag > 120px (threshold 85%): mostra "Solte para enviar!" + vibração média
4. Ao soltar: animação de pulso, troca para aba Enviar OU se já tem arquivos selecionados, inicia busca por receptores
5. Estado: searching -> connecting -> sending -> completed

### Receber
- Tela Receber por padrão fica "Aguardando envio... 📡" com pulsos
- Quando alguém próximo tenta enviar, aparece card: "[Nome] quer enviar arquivos"
- Opções:
  a) Arrastar Orb pra cima (mesmo gesto)
  b) Clicar botão "Permitir ✓"
- Depois: receiving com Orb mostrando % no centro + anel circular
- Ao completar: confete + mensagem

## Enviar - Seleção de Arquivos
- Filtro categoria: Tudo, Fotos, Vídeos, Músicas, Apps, Docs
- Lista cards com checkbox
- Cada card: ícone categoria, nome, tamanho formatado (3.4 MB), categoria upper
- Bottom bar: badge com quantidade + total (ex: 124 MB) + botão "Enviar via Orb 🔮"
- Info: "📶 Envio por Wi-Fi Direct • 🔒 Criptografado • ⚡ Até 20MB/s"

## Visual da Orb - Detalhes Técnicos UI
- Tamanho: 62% da largura da tela
- Corpo: LinearGradient 4 cores (#9B83FF -> #2A1A66) + inner highlight branco 40% opacidade
- Sombra: 20 de elevação + glow externo animado (opacity 0.3-0.7 loop)
- Olhos: 2 círculos brancos 42px, pupila preta 20px + brilho branco 6px
  - Animação: translate random X/Y a cada 2.5s, blink scaleY 0.1 a cada 4s
- Boca: emoji (😊, 😆, 👀, 😯, 🤩, 🥳) baseado no estado
- Progress ring: react-native-svg Circle, strokeDasharray = circumference, strokeDashoffset animado
  - Durante drag: cor secondary (#00E5CC)
  - Durante send/receive: cor primary (#7C5CFF)
- % no centro: 48px bold 900 quando transferindo

## Bottom Nav
- Pill flutuante: 28px radius, gradiente card
- 5 abas: Orb 🔮, Enviar 📤, Receber 📥, Histórico 🕘, Ajustes ⚙️
- Ativa: gradiente primary com ícone maior
- Badge no Receber quando tem devices próximos

## Permissões
Sem explicar técnico ao usuário, mas pedir na hora certa com mensagem amigável.
