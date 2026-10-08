/* =====================================================================
   R2 ENERGY — app.js   v6.0
   ---------------------------------------------------------------------
   CHANGELOG
   v6.0 (2026-10-08) — Redesenho completo, pensado para quem chega pelo
        anúncio do Instagram: visual no estilo Apple, azul céu no lugar do
        amarelo, celular compacto, orçamento em 1 toque pela faixa da conta
        de luz, barra fixa de WhatsApp no celular, mensagens que avisam o
        vendedor quando o contato veio de anúncio. Depoimentos com nome
        provisório e números de exemplo deixam de aparecer.
   v5.1 (2026-10-08) — Cena do scroll removida; seção residencial comum.
   v5.0 (2026-09-13) — Vídeo em loop no fundo da abertura.
   v4.0 (2026-09-12) — Cena de sobrevoo, prova social, como funciona, FAQ.
   v1.0 (2026-09-12) — Primeira versão.
   ---------------------------------------------------------------------
   ORGANIZAÇÃO
   1) CONFIG / helpers   2) RENDER    3) SEÇÃO RESIDENCIAL
   4) BARRA FIXA         5) SIMULADOR 6) INIT
   ===================================================================== */
(function () {
  "use strict";
  const C = window.CONTENT;
  const $ = (s, el = document) => el.querySelector(s);
  const pad2 = (n) => String(n).padStart(2, "0");
  const brl = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
  const num = (v, d = 0) => v.toLocaleString("pt-BR", { maximumFractionDigits: d, minimumFractionDigits: d });
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- WhatsApp ----
     Se o cliente chegou por anúncio da Meta (o link traz fbclid ou um
     utm_source de Instagram/Facebook), a mensagem ganha uma linha avisando
     o vendedor de onde veio o contato. */
  const veioDeAnuncio = (() => {
    const q = new URLSearchParams(location.search);
    return q.has("fbclid") || /insta|^ig$|face|^fb$|meta/i.test(q.get("utm_source") || "");
  })();
  const whatsLink = (msg) => {
    const texto = veioDeAnuncio && C.whatsapp.origemAnuncio ? `${msg}\n\n${C.whatsapp.origemAnuncio}` : msg;
    return `https://wa.me/${C.empresa.whatsapp}?text=${encodeURIComponent(texto)}`;
  };
  const ICONE_WHATS = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2Zm0 18.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 4.54 0 8.24 3.7 8.24 8.24 0 4.55-3.7 8.24-8.24 8.24Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.15.16-.29.18-.54.06-.25-.13-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.16.04-.31-.02-.43-.06-.13-.56-1.35-.77-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.13.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.16-.48-.29Z"/></svg>';
  const comIcone = (texto) => `${ICONE_WHATS}<span>${texto}</span>`;

  /* =========================== 2) RENDER =========================== */
  /* ---------------------------------------------------------------
     Vídeo de fundo da abertura. Montado a partir de C.hero.video.
     Roda em loop, sem som e sem controles. Se o arquivo não existir,
     o vídeo se remove sozinho e a abertura segue sem ele.
     --------------------------------------------------------------- */
  function montarVideoHero() {
    const v = C.hero && C.hero.video;
    const caixa = $("#heroVideo");
    const hero = $(".hero");
    if (!caixa) return;
    if (!v || !v.ativo || !v.arquivo) { caixa.remove(); return; }

    hero.style.setProperty("--hero-veu", v.veu != null ? v.veu : 0.72);
    if (v.textoClaro) hero.classList.add("video-claro");
    if (v.poster) caixa.style.backgroundImage = `url("${v.poster}")`;

    const el = document.createElement("video");
    el.src = v.arquivo;
    if (v.poster) el.poster = v.poster;
    el.muted = true;          // sem som: exigido para tocar sozinho
    el.defaultMuted = true;
    el.loop = true;
    el.playsInline = true;    // no iPhone, não abre em tela cheia
    el.autoplay = !reduceMotion;
    el.preload = "auto";
    el.setAttribute("aria-hidden", "true");
    el.tabIndex = -1;

    // arquivo ausente ou formato não suportado: desfaz tudo, sem quebrar
    el.addEventListener("error", () => {
      caixa.remove();
      hero.classList.remove("video-claro", "tem-video");
      console.warn("[R2] Vídeo da abertura não carregou (" + v.arquivo +
        "). A abertura segue sem vídeo. Confira o nome do arquivo em content.js.");
    });
    el.addEventListener("loadeddata", () => hero.classList.add("tem-video"));
    // o véu já entra com o pôster, para o texto branco nunca ficar sem fundo
    if (v.poster) hero.classList.add("tem-video");

    caixa.appendChild(el);
    // alguns navegadores recusam o autoplay na primeira tentativa
    const tocar = () => { const p = el.play(); if (p) p.catch(() => {}); };
    if (!reduceMotion) { tocar(); document.addEventListener("touchstart", tocar, { once: true, passive: true }); }
  }

  function renderStatic() {
    const e = C.empresa;
    const msgPadrao = C.whatsapp.mensagemPadrao;
    document.title = `${e.nome} · ${e.slogan}`;

    // cabeçalho
    const nav = $("#nav");
    nav.innerHTML = C.nav.map((n) => `<a href="${n.alvo}">${n.rotulo}</a>`).join("");
    const btnTopo = $("#btnHeaderWhats");
    btnTopo.innerHTML = comIcone(C.ctaCabecalho);
    btnTopo.href = whatsLink(msgPadrao);

    // abertura
    $("#heroTag").textContent = C.hero.tag;
    $("#heroTitle").innerHTML = C.hero.titulo;
    $("#heroSub").textContent = C.hero.subtitulo;
    $("#btnHeroWhats").innerHTML = comIcone(C.hero.ctaPrimario);
    $("#btnHeroWhats").href = whatsLink(msgPadrao);
    $("#btnSimHero").textContent = C.hero.ctaSecundario;
    $("#heroNumbers").innerHTML = C.hero.numeros
      .map((n) => `<li><b>${n.valor}<small>${n.sufixo}</small></b><span>${n.rotulo}</span></li>`).join("");
    montarVideoHero();

    // orçamento em 1 toque
    const R = C.orcamentoRapido;
    $("#rapidoTag").textContent = R.tag;
    $("#rapidoTitulo").textContent = R.titulo;
    $("#rapidoSub").textContent = R.subtitulo;
    $("#rapidoFaixas").innerHTML = R.faixas.map((f) =>
      `<a class="faixa" target="_blank" rel="noopener" href="${whatsLink(R.mensagem.replace("{faixa}", f))}">
         <span>${f}</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
       </a>`).join("");
    $("#rapidoSim").textContent = R.linkSimulador;

    // resultados / diferenciais
    const P = C.prova;
    const comNumeros = P.exibirNumeros === true;
    $("#provaTag").textContent = comNumeros ? P.tag : (P.tagSemNumeros || P.tag);
    $("#provaTitulo").textContent = comNumeros ? P.titulo : (P.tituloSemNumeros || P.titulo);
    if (comNumeros) {
      $("#provaNumeros").innerHTML = P.numeros.map((n) =>
        `<li><b>${n.valor}${n.sufixo ? `<small>${n.sufixo}</small>` : ""}</b><strong>${n.rotulo}</strong><span>${n.detalhe}</span></li>`).join("");
    } else {
      $("#provaNumeros").remove();
    }
    $("#provaSelos").innerHTML = P.selos.map(([t, d]) =>
      `<div class="selo"><span class="selo-ico" aria-hidden="true"></span><h3>${t}</h3><p>${d}</p></div>`).join("");
    // depoimento com nome provisório ([NOME DO CLIENTE]) não vai para o ar
    const reais = P.depoimentos.filter((d) => !/\[/.test(d.autor + d.papel));
    if (reais.length) {
      $("#provaDepo").innerHTML = reais.map((d) =>
        `<figure class="depo"><blockquote>${d.texto}</blockquote><figcaption><strong>${d.autor}</strong><span>${d.papel}</span></figcaption></figure>`).join("");
    } else {
      $("#provaDepo").remove();
    }

    // como funciona
    const PR = C.processo;
    $("#procTag").textContent = PR.tag;
    $("#procTitulo").textContent = PR.titulo;
    $("#procPassos").innerHTML = PR.passos.map((x) =>
      `<li class="passo"><span class="passo-n">${x.n}</span><div><h3>${x.titulo}</h3><p>${x.texto}</p></div></li>`).join("");

    // dúvidas
    $("#faqTag").textContent = C.faq.tag;
    $("#faqTitulo").textContent = C.faq.titulo;
    $("#faqLista").innerHTML = C.faq.itens.map(([q, a]) =>
      `<details class="faq-item"><summary>${q}</summary><p>${a}</p></details>`).join("");

    // chamada final
    const K = C.contato;
    $("#contatoTag").textContent = K.tag;
    $("#contatoTitulo").textContent = K.titulo;
    $("#contatoTexto").textContent = K.texto;
    $("#btnWhatsContato").innerHTML = comIcone(K.ctaPrimario);
    $("#btnWhatsContato").href = whatsLink(msgPadrao);
    $("#btnSimContato").textContent = K.ctaSecundario;

    // rodapé
    $("#footerDesc").textContent = C.rodape.descricao;
    $("#footerFone").textContent = e.telefoneExibicao;
    $("#footerFone").href = `tel:+${e.whatsapp}`;
    $("#footerMail").textContent = e.email;
    $("#footerMail").href = `mailto:${e.email}`;
    $("#footerEnd").textContent = e.endereco;
    $("#footerCnpj").textContent = e.cnpj;
    $("#footerCred").textContent = `© ${e.ano} · ${C.rodape.creditos}`;

    // destaque do link ativo no menu
    const links = [...nav.querySelectorAll("a")];
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        links.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === "#" + en.target.id));
      });
    }, { rootMargin: "-40% 0px -50% 0px" });
    C.nav.forEach((n) => { const s = $(n.alvo); if (s) obs.observe(s); });
  }

  // aparecer suavemente ao entrar na tela
  function animarEntrada() {
    if (reduceMotion || !("IntersectionObserver" in window)) return;
    const aoEntrar = new IntersectionObserver((ents) => {
      ents.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-vis"); aoEntrar.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll(".rapido-card, .sec-titulo, .etapa-card, .ficha-card, .numeros li, .selo, .depo, .passo, .faq-lista, .contato-inner")
      .forEach((el) => { el.classList.add("sobe"); aoEntrar.observe(el); });
  }

  /* =========================== 3) SEÇÃO RESIDENCIAL =========================== */
  /* As etapas da instalação (no celular, um carrossel que desliza para o
     lado) e a ficha técnica aberta na própria página.                   */
  const J = C.jornada;

  function buildSecao(sec) {
    const el = document.createElement("section");
    el.className = "etapasec";
    el.id = sec.id;
    el.innerHTML = `
      <div class="wrap">
        <span class="tag">${sec.tag}</span>
        <h2 class="sec-titulo">${sec.titulo}</h2>
      </div>
      <ol class="etapas-trilho">
        ${sec.etapas.map((et, i) => `
          <li class="etapa-card">
            <span class="etapa-num">${pad2(i + 1)}</span>
            <h3>${et.titulo}</h3>
            <p>${et.texto}</p>
          </li>`).join("")}
      </ol>
      <div class="wrap">
        <div class="ficha-card">
          <div class="ficha-texto">
            <span class="tag">${sec.detalhe.tag}</span>
            <h3>${sec.detalhe.titulo}</h3>
            <p class="desc">${sec.detalhe.descricao}</p>
            <a class="btn btn-primary btn-lg" target="_blank" rel="noopener"
               href="${whatsLink(`Olá, ${C.empresa.nome}! Vi "${sec.detalhe.titulo}" no site e quero falar com um consultor.`)}">${comIcone(sec.detalhe.ctaConsultor)}</a>
          </div>
          <dl class="ficha">${sec.detalhe.ficha.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("")}</dl>
        </div>
      </div>`;
    $("#jornadas").appendChild(el);
  }

  /* =========================== 4) BARRA FIXA =========================== */
  /* No celular, aparece depois que os botões da abertura saem da tela e
     some de novo na chamada final — para nunca haver dois botões iguais
     visíveis ao mesmo tempo.                                            */
  function initBarra() {
    const B = C.barraFixa, barra = $("#barraFixa"), btn = $("#barraBtn");
    $("#barraTitulo").textContent = B.titulo;
    $("#barraTexto").textContent = B.texto;
    btn.innerHTML = comIcone(B.botao);
    btn.href = whatsLink(C.whatsapp.mensagemPadrao);
    if (!("IntersectionObserver" in window)) return;
    let noTopo = true, noFim = false;
    const atualizar = () => {
      const ligada = !noTopo && !noFim;
      barra.classList.toggle("is-on", ligada);
      barra.setAttribute("aria-hidden", String(!ligada));
      btn.tabIndex = ligada ? 0 : -1;
    };
    new IntersectionObserver(([en]) => { noTopo = en.isIntersecting; atualizar(); }).observe($("#heroActions"));
    new IntersectionObserver(([en]) => { noFim = en.isIntersecting; atualizar(); }, { threshold: 0.15 }).observe($("#contato"));
  }

  /* =========================== 5) SIMULADOR =========================== */
  const S = C.simulador;
  const sim = { modo: "reais", cidade: null, hsp: S.hspPadrao, resultado: null };
  const modal = $("#simModal");

  function initSimulador() {
    $("#simTitulo").textContent = S.titulo;
    $("#simSub").textContent = S.subtitulo;
    $("#resNota").innerHTML = S.notaGarantia;
    $("#resWhats").innerHTML = comIcone(S.ctaFinal);

    ["#btnSimHero", "#btnSimContato", "#rapidoSim"].forEach((id) => $(id).addEventListener("click", openSim));
    $("#simClose").addEventListener("click", () => modal.close());
    modal.addEventListener("click", (e) => { if (e.target === modal) modal.close(); });
    modal.addEventListener("close", () => document.body.classList.remove("is-locked"));

    document.querySelectorAll(".seg-btn").forEach((b) => b.addEventListener("click", () => {
      document.querySelectorAll(".seg-btn").forEach((x) => { x.classList.remove("is-active"); x.setAttribute("aria-checked", "false"); });
      b.classList.add("is-active"); b.setAttribute("aria-checked", "true");
      sim.modo = b.dataset.modo;
      const reais = sim.modo === "reais";
      $("#simLabel").textContent = reais ? "Valor médio da conta de energia" : "Consumo médio mensal";
      $("#simPrefix").textContent = reais ? "R$" : "kWh";
      $("#simValor").placeholder = reais ? "Ex.: 450" : "Ex.: 480";
      $("#simDica").textContent = reais ? "Use a média dos últimos 12 meses para um resultado mais preciso." : "O consumo em kWh aparece na sua conta de energia.";
    }));
    $("#simValor").addEventListener("keydown", (e) => { if (e.key === "Enter") calcular(); });
    $("#simCalcular").addEventListener("click", calcular);
    $("#resRefazer").addEventListener("click", () => { $("#simStepResult").classList.add("is-hidden"); $("#simStepInput").classList.remove("is-hidden"); $("#simValor").focus(); });
  }
  function openSim() {
    if (!modal.open) modal.showModal();
    document.body.classList.add("is-locked");
    // no celular, não abre o teclado por cima da folha antes de o cliente ver o simulador
    if (window.matchMedia("(min-width: 834px)").matches) setTimeout(() => $("#simValor").focus(), 50);
    if (!sim.cidade) detectarLocalizacao();
  }

  // "Detecção" de localização: usa o GPS do navegador (se autorizado) e escolhe a capital
  // mais próxima da tabela; se não autorizar, usa o padrão definido em content.js.
  function detectarLocalizacao() {
    const box = $("#locBox"), txt = $("#locTexto");
    const usar = (cid, origem) => {
      sim.cidade = cid; sim.hsp = cid ? cid.hsp : S.hspPadrao;
      box.classList.add("is-ok");
      txt.innerHTML = cid
        ? `Localização: <strong>${cid.nome} · ${cid.uf}</strong> — radiação solar de <strong>${num(cid.hsp, 1)} hsp/dia</strong>${origem ? ` <span class="muted">(${origem})</span>` : ""}`
        : `Radiação solar padrão de <strong>${num(S.hspPadrao, 1)} hsp/dia</strong>`;
    };
    const padrao = () => usar(S.cidades[0], "estimado");
    if (!navigator.geolocation) return padrao();
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude: la, longitude: lo } = pos.coords;
      let best = null, bd = Infinity;
      S.cidades.forEach((c) => { const d = Math.hypot(c.lat - la, c.lon - lo); if (d < bd) { bd = d; best = c; } });
      usar(best, "detectado");
    }, padrao, { timeout: 6000, maximumAge: 600000 });
  }

  // ---- Lógica de dimensionamento ----
  function calcular() {
    const v = parseFloat($("#simValor").value);
    if (!(v > 0)) { $("#simValor").focus(); $("#simValor").parentElement.style.borderColor = "#DC2626"; return; }
    $("#simValor").parentElement.style.borderColor = "";
    const kwhMes = sim.modo === "reais" ? v / S.tarifaKwh : v;
    const contaMes = sim.modo === "reais" ? v : v * S.tarifaKwh;
    const hsp = sim.hsp, perdas = S.perdasSistema;

    // Potência necessária: energia do mês ÷ (radiação diária × 30 dias × rendimento)
    const kwpNecessario = kwhMes / (hsp * 30 * (1 - perdas));
    const modulos = Math.max(1, Math.ceil((kwpNecessario * 1000) / S.potenciaModuloW));
    const potenciaWp = modulos * S.potenciaModuloW;
    const areaM2 = modulos * S.areaModuloM2;
    const geracaoMes = (potenciaWp / 1000) * hsp * 30 * (1 - perdas);          // kWh/mês
    const economiaMes = Math.min(geracaoMes, kwhMes) * S.tarifaKwh;
    const economiaAno = economiaMes * 12;

    // 25 anos: tarifa sobe X % ao ano e a placa perde Y % ao ano
    let economia25 = 0;
    for (let a = 0; a < 25; a++) {
      economia25 += economiaAno * Math.pow(1 + S.reajusteTarifaAno, a) * Math.pow(1 - S.degradacaoAno, a);
    }
    const investimento = potenciaWp * S.custoPorWp;
    const paybackAnos = investimento / economiaAno;
    const co2AnoKg = geracaoMes * 12 * S.fatorCO2kgPorKwh;
    const co2_25t = (co2AnoKg * 25) / 1000;
    const arvores = Math.round((co2AnoKg * 25) / S.co2PorArvoreAnoKg);

    sim.resultado = { kwhMes, contaMes, hsp, kwpNecessario, modulos, potenciaWp, areaM2, geracaoMes, economiaMes, economiaAno, economia25, investimento, paybackAnos, co2_25t, arvores };
    renderResultado();
  }
  function renderResultado() {
    const r = sim.resultado;
    $("#resResumo").textContent = `Para um consumo de ${num(r.kwhMes)} kWh/mês (≈ ${brl(r.contaMes)}), com ${num(r.hsp, 1)} hsp/dia, perdas de ${Math.round(S.perdasSistema * 100)} % e módulos de ${S.potenciaModuloW} W.`;
    const cards = [
      { hero: true, v: brl(r.economia25), s: "", l: "Projeção de economia em 25 anos" },
      { v: num(r.potenciaWp), s: "Wp", l: "Potência total do arranjo FV" },
      { v: num(r.modulos), s: "módulos", l: `Módulos de ${S.potenciaModuloW} W necessários` },
      { v: num(r.areaM2, 1), s: "m²", l: "Área de telhado ocupada" },
      { v: brl(r.economiaMes), s: "/mês", l: "Projeção de economia mensal" },
      { v: brl(r.economiaAno), s: "/ano", l: "Projeção de economia em 1 ano" },
      { v: num(r.paybackAnos, 1), s: "anos", l: "Retorno do investimento (payback)" },
      { v: num(r.arvores), s: "árvores", l: `Equivalente plantado · ${num(r.co2_25t, 1)} t de CO₂ evitadas` }
    ];
    $("#resCards").innerHTML = cards.map((c) =>
      `<div class="card${c.hero ? " is-hero" : ""}"><small>${c.l}</small><b>${c.v}${c.s ? `<em>${c.s}</em>` : ""}</b></div>`).join("");

    const msg = [
      S.mensagemWhats, "",
      `📍 Local: ${sim.cidade ? sim.cidade.nome + "/" + sim.cidade.uf : "não informado"} (${num(r.hsp, 1)} hsp/dia)`,
      `⚡ Consumo: ${num(r.kwhMes)} kWh/mês (≈ ${brl(r.contaMes)})`,
      `🔆 Sistema: ${num(r.potenciaWp)} Wp · ${r.modulos} módulos de ${S.potenciaModuloW} W · ${num(r.areaM2, 1)} m²`,
      `💰 Economia: ${brl(r.economiaMes)}/mês · ${brl(r.economiaAno)}/ano · ${brl(r.economia25)} em 25 anos`,
      `📈 Payback estimado: ${num(r.paybackAnos, 1)} anos`,
      `🌳 ${num(r.co2_25t, 1)} t de CO₂ evitadas (≈ ${num(r.arvores)} árvores)`
    ].join("\n");
    $("#resWhats").href = whatsLink(msg);

    $("#simStepInput").classList.add("is-hidden");
    $("#simStepResult").classList.remove("is-hidden");
    $(".modal-box").scrollTop = 0;
  }

  /* =========================== 6) INIT =========================== */
  function init() {
    renderStatic();
    J.secoes.forEach(buildSecao);
    initBarra();
    initSimulador();
    animarEntrada();
  }
  document.addEventListener("DOMContentLoaded", init);
})();
