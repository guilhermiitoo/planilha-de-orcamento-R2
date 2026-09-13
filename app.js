/* =====================================================================
   R2 ENERGY — app.js   v2.0
   ---------------------------------------------------------------------
   CHANGELOG
   v4.0 (2026-09-12) — Cena de sobrevoo com dissolução entre fotos inteiras
        (scene.js): sem recortes. "Saiba mais" mantém a placa e dissolve
        para a foto de estúdio. Novas seções: prova social, como funciona
        e perguntas frequentes. Hero com a placa em destaque. Otimizações
        de carregamento (preload, lazy, decoding async).
   v3.0 (2026-09-12) — Cena FOTOGRÁFICA (scene-photo.js): fotos reais em
        camadas, placa recortada descendo e troca para a foto instalada.
        Substitui a cena 3D da v2.0.
   v2.0 (2026-09-12) — Cena 3D em tempo real (Three.js); amanhecer
        dirigido pelo scroll; CNPJ corrigido.
   v1.0 (2026-09-12) — Primeira versão: cabeçalho, hero, duas jornadas
        com scroll scrubbing (15 quadros), modo "Saiba mais" com vídeo
        que encolhe em card, simulador de orçamento com WhatsApp.
   ---------------------------------------------------------------------
   ORGANIZAÇÃO
   1) CONFIG / helpers   2) RENDER estático   3) JORNADAS (scroll)
   4) MODO DETALHE       5) SIMULADOR         6) INIT
   ===================================================================== */
(function () {
  "use strict";
  const C = window.CONTENT;
  const $ = (s, el = document) => el.querySelector(s);
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const pad2 = (n) => String(n).padStart(2, "0");
  const brl = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
  const num = (v, d = 0) => v.toLocaleString("pt-BR", { maximumFractionDigits: d, minimumFractionDigits: d });
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const whatsLink = (msg) => `https://wa.me/${C.empresa.whatsapp}?text=${encodeURIComponent(msg)}`;

  /* =========================== 2) RENDER ESTÁTICO =========================== */
  /* ---------------------------------------------------------------
     Vídeo de fundo da abertura. Montado a partir de C.hero.video.
     Roda em loop, sem som e sem controles. Se o arquivo não existir,
     o vídeo se remove sozinho e a abertura volta a ser a de hoje —
     por isso dá para preparar o site antes de ter o arquivo.
     --------------------------------------------------------------- */
  function montarVideoHero() {
    const v = C.hero && C.hero.video;
    const caixa = $("#heroVideo");
    if (!caixa) return;
    if (!v || !v.ativo || !v.arquivo) { caixa.remove(); return; }

    const hero = $(".hero");
    hero.style.setProperty("--hero-veu", v.veu != null ? v.veu : 0.72);
    if (v.textoClaro) hero.classList.add("video-claro");

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

    caixa.appendChild(el);
    // alguns navegadores recusam o autoplay na primeira tentativa
    const tocar = () => { const p = el.play(); if (p) p.catch(() => {}); };
    if (!reduceMotion) { tocar(); document.addEventListener("click", tocar, { once: true }); }
  }

  function renderStatic() {
    // navegação
    const nav = $("#nav");
    nav.innerHTML = C.nav.map((n) => `<a href="${n.alvo}">${n.rotulo}</a>`).join("");
    const toggle = $("#menuToggle");
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    nav.addEventListener("click", (e) => { if (e.target.tagName === "A") nav.classList.remove("is-open"); });

    // hero
    $("#heroTag").textContent = C.hero.tag;
    $("#heroTitle").innerHTML = C.hero.titulo;
    $("#heroSub").textContent = C.hero.subtitulo;
    $("#btnSimHero").textContent = C.hero.ctaPrimario;
    $("#btnVerInstalacao").textContent = C.hero.ctaSecundario;
    $("#heroNumbers").innerHTML = C.hero.numeros
      .map((n) => `<li><b>${n.valor}<small>${n.sufixo}</small></b><span>${n.rotulo}</span></li>`).join("");
    montarVideoHero();

    // contato + rodapé
    const e = C.empresa;
    $("#btnWhatsContato").href = whatsLink(`Olá, ${e.nome}! Quero falar com um consultor sobre energia solar.`);
    $("#footerDesc").textContent = C.rodape.descricao;
    $("#footerFone").textContent = e.telefoneExibicao;
    $("#footerFone").href = `tel:+${e.whatsapp}`;
    $("#footerMail").textContent = e.email;
    $("#footerMail").href = `mailto:${e.email}`;
    $("#footerEnd").textContent = e.endereco;
    $("#footerCnpj").textContent = e.cnpj;
    $("#footerCred").textContent = `© ${e.ano} · ${C.rodape.creditos}`;
    document.title = `${e.nome} · ${e.slogan}`;

    // ---- prova social ----
    const P = C.prova;
    $("#provaTag").textContent = P.tag;
    $("#provaTitulo").textContent = P.titulo;
    $("#provaNumeros").innerHTML = P.numeros.map((n) =>
      `<li><b>${n.valor}${n.sufixo ? `<small>${n.sufixo}</small>` : ""}</b><strong>${n.rotulo}</strong><span>${n.detalhe}</span></li>`).join("");
    $("#provaSelos").innerHTML = P.selos.map(([t, d]) =>
      `<div class="selo"><h3>${t}</h3><p>${d}</p></div>`).join("");
    $("#provaDepo").innerHTML = P.depoimentos.map((d) =>
      `<figure class="depo"><blockquote>${d.texto}</blockquote><figcaption><strong>${d.autor}</strong><span>${d.papel}</span></figcaption></figure>`).join("");

    // ---- como funciona ----
    const PR = C.processo;
    $("#procTag").textContent = PR.tag;
    $("#procTitulo").textContent = PR.titulo;
    $("#procPassos").innerHTML = PR.passos.map((x) =>
      `<li class="passo"><span class="passo-n">${x.n}</span><h3>${x.titulo}</h3><p>${x.texto}</p></li>`).join("");

    // ---- perguntas frequentes ----
    $("#faqTag").textContent = C.faq.tag;
    $("#faqTitulo").textContent = C.faq.titulo;
    $("#faqLista").innerHTML = C.faq.itens.map(([q, a], i) =>
      `<details class="faq-item"${i === 0 ? " open" : ""}><summary>${q}</summary><p>${a}</p></details>`).join("");

    // aparecer suavemente ao entrar na tela
    const aoEntrar = new IntersectionObserver((ents) => {
      ents.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-vis"); aoEntrar.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -12% 0px" });
    document.querySelectorAll(".numeros li, .selo, .depo, .passo, .faq-item, .sec-titulo, .prova .tag, .processo .tag, .faq .tag")
      .forEach((el) => { el.classList.add("sobe"); aoEntrar.observe(el); });

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

  /* =========================== 3) JORNADAS (scroll scrubbing) =========================== */
  const J = C.jornada;
  const jornadas = [];   // um objeto de estado por seção
  let detail = null;     // seção atualmente em modo detalhe (ou null)

  function buildJornada(sec) {
    const el = document.createElement("section");
    el.className = "jornada";
    el.id = sec.id;
    el.style.height = J.alturaScrollVh + "vh";
    el.innerHTML = `
      <div class="jornada-sticky">
        <div class="scene" aria-hidden="true"></div>
        <div class="scene-shade"></div>

        <div class="jornada-head">
          <span class="tag">${sec.tag}</span>
          <h2>${sec.titulo}</h2>
        </div>

        <div class="etapas">
          ${sec.etapas.map((et) => `<div class="etapa"><small>${et.titulo}</small><p>${et.texto}</p></div>`).join("")}
          <button class="btn btn-primary btn-saiba" type="button">${J.rotuloSaibaMais}</button>
        </div>

        <div class="progress"><span class="idx">01 / ${pad2(J.totalQuadros)}</span><span class="bar"><i></i></span></div>

        <div class="detalhe-bg"></div>
        <div class="video-wrap">
          <img class="estudio-img" src="${sec.cena.estudio}" alt="Placa solar de alta eficiência vista de frente" loading="lazy" decoding="async">
        </div>
        <div class="detalhe-texto">
          <span class="tag">${sec.detalhe.tag}</span>
          <h2>${sec.detalhe.titulo}</h2>
          <p class="desc">${sec.detalhe.descricao}</p>
          <ul class="ficha">${sec.detalhe.ficha.map(([k, v]) => `<li><b>${k}</b><span>${v}</span></li>`).join("")}</ul>
          <div class="detalhe-actions">
            <a class="btn btn-primary btn-lg" target="_blank" rel="noopener"
               href="${whatsLink(`Olá, ${C.empresa.nome}! Vi a página "${sec.detalhe.titulo}" no site e quero falar com um consultor.`)}">${sec.detalhe.ctaConsultor}</a>
            <button class="btn btn-ghost btn-lg btn-voltar" type="button">${J.rotuloVoltar}</button>
          </div>
        </div>
      </div>`;
    $("#jornadas").appendChild(el);

    const st = {
      sec, el,
      sticky: $(".jornada-sticky", el),
      sceneEl: $(".scene", el),
      etapas: [...el.querySelectorAll(".etapa")],
      btnSaiba: $(".btn-saiba", el),
      btnVoltar: $(".btn-voltar", el),
      progIdx: $(".progress .idx", el),
      progBar: $(".progress .bar i", el),
      phase: 0             // 0..1 — posição dentro da jornada
    };
    st.scene3d = new window.Scene(st.sceneEl, sec.cena);
    st.sceneEl.style.setProperty("--sol-x", sec.cena.sol.x + "%");
    st.sceneEl.style.setProperty("--sol-y", sec.cena.sol.y + "%");
    new IntersectionObserver((en) => st.scene3d.setVisible(en[0].isIntersecting)).observe(el);
    st.btnSaiba.addEventListener("click", () => openDetail(st));
    st.btnVoltar.addEventListener("click", () => closeDetail(st));

    jornadas.push(st);
    return st;
  }

  // Fração rolada da seção (0 = topo encostou, 1 = fim da seção)
  function progressOf(st) {
    const rect = st.el.getBoundingClientRect();
    const total = st.el.offsetHeight - window.innerHeight;
    return clamp(-rect.top / total, 0, 1);
  }

  // Desenha a cena inteira a partir de "phase" (0..1). É uma função pura do scroll:
  // rolar para cima refaz a cena exatamente ao contrário.
  function paintScene(st, phase) {
    st.scene3d.update(phase);
    const idx = Math.round(phase * (J.totalQuadros - 1));
    st.progIdx.textContent = `${pad2(idx + 1)} / ${pad2(J.totalQuadros)}`;
    st.progBar.style.width = (phase * 100).toFixed(1) + "%";
  }
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  // Os textos surgem em pontos fixos da jornada
  const ETAPA_PONTOS = [0.06, 0.32, 0.58, 0.82];
  function paintTexts(st, phase) {
    let ativa = -1;
    ETAPA_PONTOS.forEach((pt, i) => { if (phase >= pt) ativa = i; });
    st.etapas.forEach((e, i) => {
      e.classList.toggle("is-in", phase >= ETAPA_PONTOS[i]);
      e.classList.toggle("is-atual", i === ativa);        // no celular, só a atual fica visível
    });
    st.etapas[0].parentElement.classList.toggle("is-empty", phase < ETAPA_PONTOS[0]);
    st.btnSaiba.classList.toggle("is-in", phase >= 0.86);
  }

  function renderJornada(st) {
    if (detail === st) return;                       // em modo detalhe a cena fica congelada no último quadro
    const p = progressOf(st);
    // a parte final do scroll é uma "pausa": o último quadro fica parado antes da página deslizar
    const phase = reduceMotion ? 1 : clamp(p / (1 - J.pausaFinal), 0, 1);
    st.phase = phase;
    paintScene(st, phase);
    paintTexts(st, phase);
  }

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { jornadas.forEach(renderJornada); ticking = false; });
  }

  /* =========================== 4) MODO DETALHE ("Saiba mais") =========================== */
  function openDetail(st) {
    if (detail) return;
    detail = st;
    st.savedScroll = window.scrollY;
    document.body.classList.add("is-locked");       // trava a página; a posição do scroll é preservada
    st.sticky.classList.add("is-detail");
    st.btnVoltar.focus({ preventScroll: true });

    // 1) os quadros correm sozinhos até o último
    animatePhase(st, st.phase, 1, reduceMotion ? 0 : 700, () => {
      // 2) a foto de estúdio entra em tela cheia (a placa continua no mesmo lugar)
      // 3) depois de um instante, encolhe para o card ao lado do texto
      setTimeout(() => st.sticky.classList.add("is-detail-docked"), reduceMotion ? 0 : 1100);
    });
  }
  function closeDetail(st) {
    if (detail !== st) return;
    st.sticky.classList.remove("is-detail-docked");
    setTimeout(() => {
      st.sticky.classList.remove("is-detail");
      document.body.classList.remove("is-locked");
      document.documentElement.classList.add("no-smooth");
      window.scrollTo(0, st.savedScroll);              // garante o mesmo ponto do scroll
      document.documentElement.classList.remove("no-smooth");
      detail = null;
      renderJornada(st);                              // volta à vitrine exatamente no ponto em que estava
      st.btnSaiba.focus({ preventScroll: true });
    }, reduceMotion ? 0 : 650);
  }
  function animatePhase(st, from, to, ms, done) {
    if (ms === 0) { paintScene(st, to); done && done(); return; }
    const t0 = performance.now();
    (function step(now) {
      const t = clamp((now - t0) / ms, 0, 1);
      paintScene(st, lerp(from, to, easeOut(t)));
      if (t < 1) requestAnimationFrame(step); else done && done();
    })(t0);
  }
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && detail) closeDetail(detail); });

  /* =========================== 5) SIMULADOR =========================== */
  const S = C.simulador;
  const sim = { modo: "reais", cidade: null, hsp: S.hspPadrao, resultado: null };
  const modal = $("#simModal");

  function initSimulador() {
    $("#simTitulo").textContent = S.titulo;
    $("#simSub").textContent = S.subtitulo;
    $("#resNota").innerHTML = S.notaGarantia;
    $("#resWhats").textContent = S.ctaFinal;

    ["#btnSimHeader", "#btnSimHero", "#btnSimContato"].forEach((id) => $(id).addEventListener("click", openSim));
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
    setTimeout(() => $("#simValor").focus(), 50);
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
    J.secoes.forEach(buildJornada);
    initSimulador();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", () => jornadas.forEach(renderJornada));
    jornadas.forEach(renderJornada);
    window.__r2 = { jornadas };                     // acesso para depuração no console
  }
  document.addEventListener("DOMContentLoaded", init);
})();
