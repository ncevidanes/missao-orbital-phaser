# Missão Orbital — Phaser

Jogo 2D construído com **JavaScript, Phaser 4 e Vite**.

Versão atual: **0.3.2**. Esta atualização mantém os controles táteis da versão
anterior e garante que o canvas caiba na área realmente visível do navegador móvel.

## Recursos da versão 0.3.2

- menu inicial com instruções e exibição do recorde;
- movimento da nave com setas, `WASD` ou direcional tátil;
- botão de menu disponível durante partidas em dispositivos móveis;
- suporte a múltiplos toques para movimentos diagonais;
- orientação horizontal recomendada e layout móvel otimizado;
- ajuste automático à barra móvel do navegador, sem cortar o direcional ou o menu;
- cinco níveis automáticos de dificuldade;
- três classes de asteroide: pequeno e veloz, médio e equilibrado, grande e lento;
- asteroides progressivamente mais rápidos e frequentes, com limite ativo por nível;
- três vidas e invulnerabilidade temporária após uma colisão;
- cristais que valem 10 pontos;
- escudo azul que absorve um impacto por até oito segundos;
- reparo verde que recupera uma vida ou concede 20 pontos quando as vidas estão cheias;
- cronômetro de 60 segundos;
- recorde salvo no navegador;
- nave animada com propulsor e rastro, fundo em paralaxe e novos efeitos de coleta;
- explosões, impacto de câmera e efeito visual do escudo;
- sons sintetizados pelo próprio jogo, com botão para ligar e desligar;
- tela de resultado com reinício e retorno ao menu;
- layout responsivo para navegadores desktop e móveis.

Os desenhos e sons são criados pelo próprio código. O jogo não depende de
arquivos externos de imagem ou áudio.

## Requisitos

- Node.js 20.19 ou mais recente;
- npm.

No Ubuntu, verifique com:

```bash
node --version
npm --version
```

## Executar durante o desenvolvimento

Abra o terminal na pasta do projeto e execute:

```bash
npm install
npm run dev
```

Depois abra o endereço exibido pelo Vite, normalmente:

```text
http://localhost:8080
```

## Controles

- setas, `WASD` ou direcional tátil: movimentar a nave;
- `M`: voltar ao menu inicial;
- `R`: reiniciar depois do fim da partida;
- botões `SOM ON`/`SOM OFF`: ligar ou desligar o áudio.

## Testar e compilar

```bash
npm test
npm run build
```

O jogo publicável será criado em `dist/`. Para publicar no itch.io, compacte o
**conteúdo** de `dist/` em um arquivo ZIP e selecione o tipo de projeto HTML.

## Organização do código

```text
src/
├── main.js
├── style.css
└── game/
    ├── config/
    │   ├── AsteroidCatalog.js
    │   ├── GameBalance.js
    │   ├── gameConfig.js
    │   └── PowerUpCatalog.js
    ├── entities/
    │   ├── Player.js
    │   ├── Asteroid.js
    │   ├── Crystal.js
    │   └── PowerUp.js
    ├── scenes/
    │   ├── MenuScene.js
    │   └── GameScene.js
    ├── systems/
    │   ├── AsteroidRegistration.js
    │   ├── ExplosionEffect.js
    │   ├── GameViewport.js
    │   ├── HighScoreRepository.js
    │   ├── MovementInput.js
    │   ├── ShieldAura.js
    │   ├── ShieldController.js
    │   ├── ShipAnimator.js
    │   ├── Starfield.js
    │   ├── SynthSoundManager.js
    │   ├── TextureFactory.js
    │   └── TouchDirectionState.js
    └── ui/
        ├── Hud.js
        ├── TextButton.js
        └── TouchControls.js
```

## Histórico essencial

- `0.1.0`: primeiro protótipo;
- `0.1.1`: correção da iteração dos grupos no Phaser 4;
- `0.1.2`: correção da velocidade dos asteroides após o registro no grupo;
- `0.2.0`: menu, recorde, efeitos, som e dificuldade em cinco níveis;
- `0.3.0`: nave animada, três asteroides, escudo, reparo e balanceamento revisado.
- `0.3.1`: direcional tátil, múltiplos toques, botão de menu e layout móvel otimizado.
- `0.3.2`: canvas ajustado ao viewport visual e controles afastados da borda inferior.

## Referências oficiais

- [Phaser](https://phaser.io/)
- [Modelos oficiais de projeto](https://docs.phaser.io/phaser/getting-started/project-templates)
- [Template oficial Phaser + Vite](https://github.com/phaserjs/template-vite)
