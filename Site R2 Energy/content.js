/* =====================================================================
   R2 ENERGY — content.js
   TODO texto, número e caminho de arquivo do site vive aqui.
   Para trocar um texto, uma cor de destaque ou o número de quadros,
   edite este arquivo — não é preciso mexer no index.html nem no app.js.
   ===================================================================== */
window.CONTENT = {
  empresa: {
    nome: "R2 Energy",
    slogan: "Energia solar de alta performance",
    whatsapp: "5585992362517",            // só números, com DDI + DDD
    telefoneExibicao: "(85) 9 9236-2517",
    cnpj: "27.568.657/0001-06",
    email: "contato@r2energy.com.br",     // troque pelo e-mail real
    endereco: "Fortaleza · Ceará · Brasil",
    ano: 2026
  },

  nav: [
    { rotulo: "Residencial", alvo: "#residencial" },
    { rotulo: "Corporativo", alvo: "#corporativo" },
    { rotulo: "Contato",     alvo: "#contato" }
  ],

  hero: {
    tag: "Instalações de alta performance",
    titulo: "Sua energia,<br>sob o seu controle.",
    subtitulo: "Projetos fotovoltaicos dimensionados por engenharia, instalados com precisão e monitorados em tempo real.",
    ctaPrimario: "Simular Orçamento",
    ctaSecundario: "Ver a instalação",
    numeros: [
      { valor: "25", sufixo: "anos", rotulo: "garantia de performance" },
      { valor: "620", sufixo: "W",   rotulo: "módulos de última geração" },
      { valor: "90", sufixo: "%",    rotulo: "de economia média na conta" }
    ]
  },

  /* ---------- SIMULADOR ---------- */
  simulador: {
    titulo: "Simule seu sistema solar",
    subtitulo: "Informe o valor da sua conta ou o consumo mensal e veja em segundos o tamanho do sistema ideal.",
    // Parâmetros técnicos (fixos no código, conforme especificação)
    perdasSistema: 0.16,        // 16 %
    potenciaModuloW: 620,       // W por módulo
    areaModuloM2: 2.7,          // m² ocupados por módulo de 620 W
    tarifaKwh: 0.95,            // R$/kWh — média usada para converter R$ → kWh
    custoPorWp: 3.9,            // R$/Wp — estimativa de investimento para o payback
    reajusteTarifaAno: 0.05,    // 5 % ao ano na projeção de 25 anos
    degradacaoAno: 0.005,       // 0,5 % ao ano (chega a ~87 % em 25 anos)
    fatorCO2kgPorKwh: 0.084,    // kg de CO₂ evitados por kWh (rede brasileira)
    co2PorArvoreAnoKg: 22,      // kg de CO₂ absorvidos por árvore/ano
    hspPadrao: 4.8,             // usado se a localização não for detectada
    // Tabela de radiação solar por capital (hsp/dia). O app escolhe a mais próxima da localização.
    cidades: [
      { nome: "Fortaleza",      uf: "CE", lat: -3.72,  lon: -38.54, hsp: 5.0 },
      { nome: "Teresina",       uf: "PI", lat: -5.09,  lon: -42.80, hsp: 5.0 },
      { nome: "Natal",          uf: "RN", lat: -5.79,  lon: -35.21, hsp: 5.0 },
      { nome: "João Pessoa",    uf: "PB", lat: -7.12,  lon: -34.86, hsp: 4.9 },
      { nome: "Recife",         uf: "PE", lat: -8.05,  lon: -34.90, hsp: 4.9 },
      { nome: "Maceió",         uf: "AL", lat: -9.67,  lon: -35.74, hsp: 4.9 },
      { nome: "Salvador",       uf: "BA", lat: -12.97, lon: -38.51, hsp: 4.8 },
      { nome: "São Luís",       uf: "MA", lat: -2.53,  lon: -44.30, hsp: 4.8 },
      { nome: "Belém",          uf: "PA", lat: -1.46,  lon: -48.50, hsp: 4.6 },
      { nome: "Manaus",         uf: "AM", lat: -3.12,  lon: -60.02, hsp: 4.5 },
      { nome: "Brasília",       uf: "DF", lat: -15.79, lon: -47.88, hsp: 5.0 },
      { nome: "Goiânia",        uf: "GO", lat: -16.69, lon: -49.26, hsp: 5.0 },
      { nome: "Belo Horizonte", uf: "MG", lat: -19.92, lon: -43.94, hsp: 4.9 },
      { nome: "Rio de Janeiro", uf: "RJ", lat: -22.91, lon: -43.17, hsp: 4.6 },
      { nome: "São Paulo",      uf: "SP", lat: -23.55, lon: -46.63, hsp: 4.5 },
      { nome: "Curitiba",       uf: "PR", lat: -25.43, lon: -49.27, hsp: 4.5 },
      { nome: "Florianópolis",  uf: "SC", lat: -27.60, lon: -48.55, hsp: 4.5 },
      { nome: "Porto Alegre",   uf: "RS", lat: -30.03, lon: -51.23, hsp: 4.5 },
      { nome: "Campo Grande",   uf: "MS", lat: -20.44, lon: -54.65, hsp: 4.9 },
      { nome: "Cuiabá",         uf: "MT", lat: -15.60, lon: -56.10, hsp: 4.9 }
    ],
    notaGarantia: "25 anos é o prazo de <strong>garantia de performance</strong>: ao fim dele os módulos ainda produzem cerca de 80 a 85 % da capacidade original. A placa não para de funcionar — ela continua gerando por décadas.",
    ctaFinal: "Receber Proposta Detalhada",
    mensagemWhats: "Olá, R2 Energy! Fiz uma simulação no site e quero receber uma proposta detalhada."
  },

  /* ---------- SEÇÕES DE SCROLL (a jornada da instalação) ---------- */
  jornada: {
    totalQuadros: 15,                 // exatamente 15 quadros por seção
    alturaScrollVh: 520,              // quanto o usuário rola para ver a cena inteira (em % da altura da tela)
    pausaFinal: 0.16,                 // fração final do scroll em que o último quadro fica parado
    secoes: [
      {
        id: "residencial",
        tag: "Projetos Residenciais",
        titulo: "A jornada da sua instalação",
        pastaQuadros: "assets/residencial/",   // frame_01.jpg … frame_15.jpg
        fundoBase: "assets/residencial/base.png", // usado enquanto os 15 quadros não existirem
        video: "assets/residencial/instalacao.mp4",
        etapas: [
          { titulo: "Discussão inicial", texto: "Dimensionamento de alta performance para sua demanda." },
          { titulo: "Planejamento",      texto: "Mapeamento estrutural e máxima captação solar." },
          { titulo: "Instalação",        texto: "Fixação robusta, engenharia de ponta e segurança." },
          { titulo: "Conexão",           texto: "Sistema ativo e monitoramento de resultados em tempo real." }
        ],
        detalhe: {
          tag: "Solução residencial",
          titulo: "Engenharia de ponta para o seu telhado",
          descricao: "Sistemas on-grid dimensionados a partir do seu histórico real de consumo, com estruturas de fixação certificadas para telhas cerâmicas, metálicas e lajes. Cada projeto passa por análise estrutural, estudo de sombreamento e homologação junto à concessionária — você recebe a usina pronta, conectada e monitorada.",
          ficha: [
            ["Módulos",        "Monocristalinos 620 W · tecnologia N-Type TOPCon"],
            ["Inversor",       "String ou microinversor, com monitoramento via app"],
            ["Estrutura",      "Alumínio anodizado e aço inox · resistente a 150 km/h"],
            ["Garantias",      "25 anos de performance · 12 anos de produto · 5 anos de instalação"],
            ["Prazo",          "Projeto e instalação em até 30 dias após aprovação"],
            ["Homologação",    "Inclusa · protocolo e vistoria junto à concessionária"]
          ],
          ctaConsultor: "Falar com Consultor"
        }
      },
      {
        id: "corporativo",
        tag: "Projetos Corporativos",
        titulo: "Escala industrial, resultado no balanço",
        pastaQuadros: "assets/corporativo/",   // frame_01.jpg … frame_15.jpg
        fundoBase: "",                          // opcional: assets/corporativo/base.jpg
        video: "assets/corporativo/instalacao.mp4",
        etapas: [
          { titulo: "Discussão inicial", texto: "Dimensionamento de alta performance para sua demanda." },
          { titulo: "Planejamento",      texto: "Mapeamento estrutural e máxima captação solar." },
          { titulo: "Instalação",        texto: "Fixação robusta, engenharia de ponta e segurança." },
          { titulo: "Conexão",           texto: "Sistema ativo e monitoramento de resultados em tempo real." }
        ],
        detalhe: {
          tag: "Solução corporativa",
          titulo: "Usinas para galpões, lajes e indústrias",
          descricao: "Projetos de médio e grande porte para reduzir o custo operacional e cumprir metas ESG. Trabalhamos com estudo de viabilidade financeira (TIR, VPL e payback), análise de carga estrutural do galpão, gestão de obra com equipe própria e relatórios mensais de geração para a diretoria.",
          ficha: [
            ["Porte",          "De 30 kWp a 5 MWp · geração distribuída ou autoconsumo remoto"],
            ["Inversores",     "Trifásicos de alta eficiência com monitoramento por string"],
            ["Estrutura",      "Perfis de alumínio para telha metálica, laje e solo"],
            ["Financeiro",     "Estudo de viabilidade e apoio na linha de crédito"],
            ["Operação",       "O&M com limpeza, termografia e relatórios de performance"],
            ["ESG",            "Relatório de CO₂ evitado para relatórios de sustentabilidade"]
          ],
          ctaConsultor: "Falar com Consultor"
        }
      }
    ],
    rotuloSaibaMais: "Saiba mais",
    rotuloVoltar: "Voltar"
  },

  rodape: {
    descricao: "Instalações fotovoltaicas residenciais e corporativas com engenharia própria, foco em performance e monitoramento contínuo.",
    creditos: "R2 Energy · Todos os direitos reservados"
  }
};
