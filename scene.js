/* =====================================================================
   R2 ENERGY — scene.js   v4.0
   ---------------------------------------------------------------------
   CENA DE SOBREVOO COM DISSOLUÇÃO.

   Nada é recortado ou colado. A cena são fotos inteiras, geradas com o
   mesmo enquadramento, que o scroll dissolve uma na outra:

       flutuando.jpg  →  instalada.jpg  →  estudio.jpg (no "Saiba mais")

   Ao mesmo tempo a câmera faz um sobrevoo lento (zoom + deslocamento) e
   a luz esquenta. Como as fotos são inteiras, não existe montagem — é a
   mesma técnica usada em sites de produto de marcas grandes.

   MODO VÍDEO: se existirem os quadros na pasta indicada em `quadros`, o site
   detecta sozinho e passa a exibir o vídeo quadro a quadro — cada posição do
   scroll mostra um quadro. Enquanto os arquivos não existirem, vale a
   dissolução entre as fotos. Não é preciso mudar nada além de colar os
   arquivos e ajustar `total`.

   scene.update(p) com p de 0 a 1. Função pura: rolar para cima desfaz.
   ===================================================================== */
window.Scene = (function () {
  "use strict";
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const easeOut = (t) => 1 - Math.pow(1 - clamp(t, 0, 1), 3);
  const easeInOut = (t) => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const seg = (p, a, b) => easeInOut(clamp((p - a) / (b - a), 0, 1));
  const isMobile = matchMedia("(max-width: 960px)").matches;

  function Scene(container, cfg) {
    this.cfg = cfg; this.el = container; this._p = 0;
    const camadas = cfg.camadas;                      // [{src, ate}] em ordem de exibição
    container.innerHTML = `
      <div class="cena">
        <div class="cena-cam">
          ${camadas.map((c, i) => `<img class="cena-img" src="${c.src}" alt="" ${i ? 'loading="lazy"' : ""} decoding="async">`).join("")}
        </div>
        <div class="cena-quadros"></div>
        <div class="cena-sol"></div>
        <div class="cena-brilho"></div>
        <div class="cena-veu"></div>
        <div class="cena-vinheta"></div>
      </div>`;
    this.cena = container.querySelector(".cena");
    this.cam = container.querySelector(".cena-cam");
    this.telaQuadros = container.querySelector(".cena-quadros");
    this.imgs = [...container.querySelectorAll(".cena-img")];
    this.sol = container.querySelector(".cena-sol");
    this.veu = container.querySelector(".cena-veu");
    this.brilho = container.querySelector(".cena-brilho");
    this.ratio = cfg.proporcao || 16 / 9;
    this.fit = this.fit.bind(this);
    this.fit(); window.addEventListener("resize", this.fit);
    this.update(0);
    if (cfg.quadros) this.carregarQuadros(cfg.quadros);
  }

  // a camada da câmera cobre a tela inteira mantendo a proporção da foto
  Scene.prototype.fit = function () {
    const w = this.el.clientWidth || 1, h = this.el.clientHeight || 1;
    const cw = Math.max(w, h * this.ratio), ch = cw / this.ratio;
    this.cam.style.width = cw + "px"; this.cam.style.height = ch + "px";
    this.cam.style.left = (w - cw) / 2 + "px"; this.cam.style.top = (h - ch) / 2 + "px";
  };

  /* ---------------------------------------------------------------
     Procura os quadros do vídeo. Só entra no modo vídeo se TODOS
     carregarem; se faltar algum, o site segue com a dissolução.
     --------------------------------------------------------------- */
  /* Padrões de nome aceitos. O site testa um por um e usa o primeiro que
     existir — assim não importa como a ferramenta de extração nomeou os
     arquivos, você não precisa renomear nada.                         */
  const PADROES = [
    (n) => `frame (${n}).jpg`,          // Windows: frame (1).jpg, frame (2).jpg …
    (n) => `frame_${String(n).padStart(3, "0")}.jpg`,
    (n) => `frame-${String(n).padStart(3, "0")}.jpg`,
    (n) => `frame${String(n).padStart(3, "0")}.jpg`,
    (n) => `frame_${n}.jpg`,
    (n) => `frame-${n}.jpg`,
    (n) => `${String(n).padStart(3, "0")}.jpg`,
    (n) => `frame (${n}).png`,
    (n) => `frame_${String(n).padStart(3, "0")}.png`
  ];

  Scene.prototype.carregarQuadros = function (q) {
    const total = q.total;
    if (!total) return;
    const tentar = (k) => {
      if (k >= PADROES.length) {
        console.warn("[R2] Nenhum quadro encontrado em " + q.pasta +
          " — o site seguirá com as fotos. Confira o nome dos arquivos e o valor de 'total' em content.js.");
        return;
      }
      // testa o padrão com o primeiro e o último arquivo antes de carregar tudo
      const teste = new Image();
      teste.onload = () => this.carregarTodos(q, PADROES[k], () => tentar(k + 1));
      teste.onerror = () => tentar(k + 1);
      teste.src = q.pasta + encodeURIComponent(PADROES[k](1)).replace(/%2F/g, "/");
    };
    tentar(0);
  };

  /* Carrega em DUAS ONDAS, para o site não ficar parado esperando os ~8 MB:

     1ª onda — uma AMOSTRA de quadros espalhados por todo o vídeo (do 1 ao
       último, de tantos em tantos). Assim que ela chega, o modo vídeo já
       liga: a cena inteira funciona de ponta a ponta, só que "picotada".
     2ª onda — todos os outros, em segundo plano. Cada quadro entra na cena
       assim que chega e o movimento vai ficando fluido sozinho.

     Enquanto um quadro ainda não chegou, mostramos o mais próximo que já
     está pronto. Se a AMOSTRA falhar, é sinal de que o padrão de nome está
     errado — aí sim voltamos a tentar o próximo padrão (aoFalhar).      */
  Scene.prototype.carregarTodos = function (q, nome, aoFalhar) {
    const total = q.total;
    const alvoAmostra = Math.min(total, Math.max(2, q.loteInicial || 20));
    // índices espalhados por igual, sempre incluindo o primeiro e o último
    const passo = (total - 1) / (alvoAmostra - 1);
    const amostra = [...new Set(Array.from({ length: alvoAmostra },
      (_, k) => Math.round(1 + k * passo)))];
    const naAmostra = new Set(amostra);

    const imgs = new Array(total), prontos = new Array(total).fill(false);
    let faltam = amostra.length, falhou = false, ativado = false, completos = 0;

    const criar = (i, primeiraOnda) => {
      const im = new Image();
      im.decoding = "async";
      im.onload = () => {
        prontos[i - 1] = true;
        completos++;
        if (ativado) this.acrescentarQuadro(i - 1);
        if (primeiraOnda && !falhou && --faltam === 0) {
          ativado = true;
          this.ativarQuadros(imgs, prontos);
          segundaOnda();
        }
        if (completos === total) {
          console.info("[R2] Modo vídeo ativo: " + total + " quadros carregados.");
        }
      };
      im.onerror = () => {
        if (primeiraOnda) {
          if (falhou) return;
          falhou = true;
          console.warn("[R2] Faltou o quadro: " + im.src);
          aoFalhar();
        } else {
          console.warn("[R2] Quadro não carregado, a cena segue sem ele: " + im.src);
        }
      };
      im.src = q.pasta + encodeURIComponent(nome(i)).replace(/%2F/g, "/");
      imgs[i - 1] = im;
    };

    const segundaOnda = () => {
      for (let i = 1; i <= total; i++) if (!naAmostra.has(i)) criar(i, false);
    };

    amostra.forEach((i) => criar(i, true));
  };

  /* As imagens já carregadas são colocadas empilhadas na tela e apenas uma
     fica visível por vez. Sem canvas: funciona igual abrindo o index.html
     por duplo clique (file://) ou por um servidor.                      */
  Scene.prototype.ativarQuadros = function (imgs, prontos) {
    this.quadros = imgs;
    this.prontos = prontos;
    this.ultimo = -1;
    this.cena.classList.add("tem-quadros");
    imgs.forEach((im, i) => { if (prontos[i]) this.acrescentarQuadro(i); });
    this.update(this._p || 0);
    console.info("[R2] Modo vídeo ativo com " + this.telaQuadros.children.length +
      " de " + imgs.length + " quadros — o restante entra em segundo plano.");
  };

  // coloca na tela um quadro que acabou de chegar e reavalia o quadro exibido
  Scene.prototype.acrescentarQuadro = function (i) {
    const im = this.quadros[i];
    if (!im || im.parentNode) return;
    im.className = "quadro";
    this.telaQuadros.appendChild(im);
    this.desenharQuadro(this._p || 0);
  };

  // o quadro certo para esta posição do scroll; se ainda não chegou, o
  // mais próximo que já estiver pronto
  Scene.prototype.desenharQuadro = function (p) {
    const n = this.quadros.length;
    const alvo = Math.min(n - 1, Math.max(0, Math.round(p * (n - 1))));
    let i = -1;
    if (this.prontos[alvo]) i = alvo;
    else for (let d = 1; d < n && i < 0; d++) {
      if (alvo - d >= 0 && this.prontos[alvo - d]) i = alvo - d;
      else if (alvo + d < n && this.prontos[alvo + d]) i = alvo + d;
    }
    if (i < 0 || i === this.ultimo) return;
    if (this.ultimo >= 0) this.quadros[this.ultimo].classList.remove("is-on");
    this.quadros[i].classList.add("is-on");
    this.ultimo = i;
  };

  Scene.prototype.update = function (p) {
    p = clamp(p, 0, 1); this._p = p;
    const c = this.cfg, q = c.camera || {};

    // ---- modo vídeo: o quadro é a cena inteira ----
    if (this.quadros) {
      this.desenharQuadro(p);
      const luzV = seg(p, 0, 0.85);
      this.sol.style.opacity = (lerp(0.05, 0.3, luzV) * (c.brilhoQuadros ?? 1)).toFixed(3);
      this.veu.style.opacity = "0";
      this.brilho.style.opacity = seg(p, 0.9, 1).toFixed(3);
      return;
    }

    /* 1) sobrevoo: aproxima e desliza, como um drone descendo devagar */
    const z = lerp(q.z0 ?? 1.20, q.z1 ?? 1.02, easeOut(p));
    const x = lerp(q.x0 ?? -3, q.x1 ?? 7, easeInOut(p));
    const y = lerp(q.y0 ?? -4, q.y1 ?? 1, easeInOut(p));
    this.cam.style.transform = `scale(${z.toFixed(4)}) translate(${x.toFixed(2)}%, ${y.toFixed(2)}%)`;

    /* 2) dissolução entre as fotos, conforme o scroll */
    this.imgs.forEach((im, i) => {
      if (i === 0) { im.style.opacity = 1; return; }
      const ini = c.camadas[i].de, fim = c.camadas[i].ate;
      im.style.opacity = seg(p, ini, fim).toFixed(3);
    });

    /* 3) amanhecer: a luz esquenta ao longo da jornada */
    const luz = seg(p, 0, 0.85);
    const filtro = `brightness(${lerp(0.9, 1.04, luz).toFixed(3)}) contrast(${lerp(1.1, 1.0, luz).toFixed(3)}) saturate(${lerp(0.86, 1.1, luz).toFixed(3)})`;
    this.cam.style.filter = filtro;
    this.veu.style.opacity = lerp(0.30, 0.02, luz).toFixed(3);
    this.sol.style.opacity = lerp(0.2, 0.8, luz).toFixed(3);
    this.sol.style.transform = `translate(-50%, -50%) scale(${lerp(0.75, 1.2, luz).toFixed(3)})`;

    /* 4) estouro de luz no vidro quando o sistema "liga" */
    this.brilho.style.opacity = seg(p, 0.88, 1).toFixed(3);
  };

  Scene.prototype.setVisible = function (v) { this.el.classList.toggle("is-off", !v); };
  Scene.isMobile = isMobile;
  return Scene;
})();
