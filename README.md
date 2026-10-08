# R2 Energy — site vitrine (v6.0)

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
- Mensagens que chegam no WhatsApp do vendedor → `content.js` → `whatsapp`, `orcamentoRapido.mensagem`
- Faixas de conta de luz do orçamento em 1 toque → `content.js` → `orcamentoRapido.faixas`
- Tarifa (R$/kWh), custo por Wp, radiação por cidade → `content.js` → `simulador`
- Cores → `styles.css` → bloco `:root` (`--accent` é o azul dos botões)
- Imagens e vídeos → pasta `assets/` (nomes em `assets/README.md`)

## O vídeo da abertura
Fica em `assets/hero/hero.mp4` e roda em loop, mudo, atrás do título. A receita
do arquivo e os ajustes (`veu`, `textoClaro`, `ativo`) estão em
`assets/hero/LEIA-ME.txt` e em `content.js` → `hero.video`.
Se o arquivo faltar, a abertura fica sem vídeo e nada quebra.

## Seções do site
Abertura com vídeo → orçamento em 1 toque → residencial (etapas e ficha técnica) → diferenciais → como funciona → dúvidas → chamada final.
No celular, uma barra fixa de WhatsApp aparece depois da abertura.
Os textos de todas elas estão em `content.js`: `hero`, `orcamentoRapido`, `jornada`, `prova`, `processo`, `faq`, `contato`, `barraFixa`.

## Anúncio do Instagram
Quando o link do anúncio traz `fbclid` (a Meta põe sozinha) ou `utm_source=instagram`,
toda mensagem de WhatsApp ganha a linha de `whatsapp.origemAnuncio` — o vendedor
sabe na hora que o contato veio do anúncio.

⚠️ **Antes de anunciar:**
- Os números da empresa em `prova.numeros` são exemplos e ficam **escondidos** (`exibirNumeros: false`). Troque pelos reais e mude para `true`.
- Depoimento com colchete no nome (`[NOME DO CLIENTE]`) **não aparece**. Troque pelo nome real, com autorização do cliente, e ele surge sozinho.
- Confirme a tarifa (`simulador.tarifaKwh`), o custo por Wp (`simulador.custoPorWp`) e o e-mail (`empresa.email`).
