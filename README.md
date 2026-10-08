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
| `app.js` | Monta as seções a partir do `content.js`, vídeo da abertura e simulador |
| `assets/` | Vídeo da abertura e imagens — veja `assets/README.md` |

## O que você troca sozinho (sem programar)
- Textos, etapas, ficha técnica, telefone/WhatsApp, CNPJ, e-mail → `content.js`
- Tarifa (R$/kWh), custo por Wp, radiação por cidade → `content.js` → `simulador`
- Cores e fontes → `styles.css` → bloco `:root`
- Imagens e vídeos → pasta `assets/` (nomes em `assets/README.md`)

## O vídeo da abertura
Fica em `assets/hero/hero.mp4` e roda em loop, mudo, atrás do título. A receita
do arquivo e os ajustes (`veu`, `textoClaro`, `ativo`) estão em
`assets/hero/LEIA-ME.txt` e em `content.js` → `hero.video`.
Se o arquivo faltar, a abertura fica sem vídeo e nada quebra.

## Seções do site
Abertura com vídeo → residencial (etapas da instalação e ficha técnica) → resultados e depoimentos → como funciona → dúvidas frequentes → contato.
Os textos de todas elas estão em `content.js`: `hero`, `jornada`, `prova`, `processo`, `faq`.

⚠️ **Antes de publicar:** troque os números e depoimentos de exemplo em `content.js` → `prova` pelos dados reais da R2 Energy, e confirme a tarifa (`simulador.tarifaKwh`) e o custo por Wp (`simulador.custoPorWp`).
