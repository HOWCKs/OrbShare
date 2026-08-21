# Desenvolvendo OrbShare 100% no Celular

## Objetivo
Nunca compilar local, usar GitHub Actions na nuvem, testar instalando APK release.

## Passo 1: Instalar apps no Android

- **Acode** (Play Store) - Editor com suporte Git
- **GitHub** (Play Store) - Para ver Actions e baixar APK
- Opcional: **Termux** se quiser rodar `npm install` local só pra checar erros de TypeScript, mas NÃO precisa.

## Passo 2: Clonar repo no Acode

1. Abra Acode > Open Folder > GitHub > Clone > cole URL do repo `https://github.com/HOWCKs/OrbShare`
2. Escolha branch `arena/01a01f7e-orbshare`
3. Abra `app/src/...`

## Passo 3: Editar

- Cores: `app/src/theme/colors.ts`
- Orb visual: `app/src/components/Orb.tsx`
- Telas: `app/src/screens/*`
- Lógica transferência: `app/src/services/TransferService.ts`

Acode tem auto-complete TS limitado mas funciona.

## Passo 4: Commit e Push

- No Acode: Menu > Source Control > Stage > Commit "melhorei orb" > Push
- Ou use app GitHub para subir.

## Passo 5: Build na nuvem

1. Assim que der push, GitHub Actions já dispara automaticamente.
2. No app GitHub ou no Chrome: vá em `Seu Repo > Actions > último workflow`
3. Aguarde 6-10 minutos (primeiro build demora por causa do Gradle).
4. No final, baixe artifact `OrbShare-release-apk` OU vá em `Releases` e baixe o APK.

## Passo 6: Instalar

- Abra arquivo APK baixado, Android pede "Permitir instalar de fontes desconhecidas" > Permitir
- Instale.
- Teste fluxo real com 2 celulares com OrbShare.

## Dicas

- Se der erro de build, veja log em Actions > Build Release APK > Step que falhou.
- Erros comuns:
  - Falta asset icon -> workflow já cria placeholder automático
  - Erro TypeScript -> verifica em `App.tsx` e `Orb.tsx`
- Para versão rápida debug, pode usar `npx expo start --tunnel` no Termux e testar no Expo Go, mas seu pedido foi sem preview e direto release, então foque no Actions.

## Estrutura de pastas

```
app/
  assets/icon.png -> seu ícone (já gerei um 3D roxo)
  App.tsx -> root
  src/
    components/Orb.tsx (ESTRELA)
    screens/HomeScreen (orb + orbit)
```

## Como trocar pseudônimo padrão

Em `App.tsx` linha:
```ts
const [pseudonym, setPseudonym] = useState('Sua Orb');
```

Mude pra seu nome.

## Próximos builds

Cada push = novo APK. Você nunca precisa limpar cache do celular, é sempre release fresh.
