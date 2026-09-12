# R2 Energy — site vitrine (v5.1)

Site estático em HTML/CSS/JS puro — sem instalação, sem build.

## Como abrir
- Localmente: abra `index.html` no navegador. Para a detecção de localização funcionar (GPS), abra por um servidor simples, ex.: `python -m http.server` e acesse `http://localhost:8000`.
- Online: suba a pasta inteira (Netlify, Vercel, GitHub Pages ou a hospedagem da empresa).

## Arquivos
| Arquivo | Função |
|---|---|
| `index.html` | Estrutura da página |
| `styles.css` | Visual (paleta nas variáveis do `:root`, no topo) |
| `content.js` | **Todos os textos, números, telefone, CNPJ e parâmetros do simulador** |
| `scene.js` | Cena de sobrevoo: dissolve as fotos conforme o scroll |
| `app.js` | Scroll scrubbing, modo "Saiba mais", simulador |
| `assets/` | Quadros, vídeos e imagens — veja `assets/README.md` |

## O que você troca sozinho (sem programar)
- Textos, etapas, ficha técnica, telefone/WhatsApp, CNPJ, e-mail → `content.js`
- Tarifa (R$/kWh), custo por Wp, radiação por cidade → `content.js` → `simulador`
- Cores e fontes → `styles.css` → bloco `:root`
- Imagens e vídeos → pasta `assets/` (nomes em `assets/README.md`)

## O VÍDEO — o que você precisa saber
Os quadros vão em `assets/residencial/quadros/`. O site aceita automaticamente
vários padrões de nome, inclusive `frame (1).jpg` (o que o Windows gera) —
**não é preciso renomear nada**.

O único ajuste é em `content.js`:
```
quadros: { pasta: "assets/residencial/quadros/", total: 131, ... }
```
`total` = quantidade EXATA de arquivos na pasta. Hoje está em **131**.

Funciona dos dois jeitos: abrindo o index.html por duplo clique (file://) ou
por um servidor. Testado nos dois.

Se algo não funcionar, abra o console do navegador (F12 → Console): quando dá
certo aparece "[R2] Modo vídeo ativo: N quadros carregados"; quando falta um
arquivo, aparece o nome exato do quadro que faltou.
Com a pasta vazia, ele usa a dissolução entre as fotos e não quebra.

## Seções do site
Abertura (placa em destaque) → jornada residencial → jornada corporativa → resultados e depoimentos → como funciona → dúvidas frequentes → contato.
Os textos de todas elas estão em `content.js`: `prova`, `processo`, `faq`.

⚠️ **Antes de publicar:** troque os números e depoimentos de exemplo em `content.js` → `prova` pelos dados reais da R2 Energy, e confirme a tarifa (`simulador.tarifaKwh`) e o custo por Wp (`simulador.custoPorWp`).

## Ajustes fáceis da cena (`content.js` → `cena`)
- `camera`: enquadramento inicial e final (`z0/z1` zoom, `x0/x1` e `y0/y1` deslocamento).
- `camadas`: as fotos em ordem; `de` e `ate` dizem em que fração do scroll cada uma aparece.
- `sol`: posição do brilho do sol na tela.
- `estudio`: foto exibida no "Saiba mais".

## Como funciona o scroll (resumo)
Cada seção tem 560 % da altura da tela. Um bloco fica "preso" (sticky) enquanto você rola; o `app.js` calcula a fração rolada (0 → 1) e chama `scene3d.update(fração)`. A cena inteira — posição da câmera, altura do sol, cor do céu, descida da placa — é calculada a partir dessa fração, por isso rolar para cima faz tudo voltar. Os 16 % finais são a pausa antes da página deslizar para a próxima seção.

## Ajustes fáceis na cena 3D (`scene3d.js`)
- Cores do amanhecer: objeto `SKY` no topo do arquivo.
- Enquadramentos da câmera: `this.cam = { pos: [...], look: [...] }` dentro de `buildHouse` / `buildWarehouse` (4 poses: início → fim).
- Momento em que a placa desce: `drop(this.panel, clamp((p - 0.18) / 0.62, 0, 1))` em `update`.
- Celular: `isMobile` reduz prédios, resolução e desliga sombras automaticamente.
