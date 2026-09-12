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
    cnpj: "41.044.598/0001-06",
    email: "contato@r2energy.com.br",     // troque pelo e-mail real
    endereco: "Fortaleza · Ceará · Brasil",
    ano: 2026
  },

  nav: [
    { rotulo: "Residencial",   alvo: "#residencial" },
    { rotulo: "Resultados",    alvo: "#prova" },
    { rotulo: "Como funciona", alvo: "#processo" },
    { rotulo: "Dúvidas",       alvo: "#faq" }
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
    totalQuadros: 15,                 // "quadros" exibidos no contador de progresso
    alturaScrollVh: 560,              // quanto o usuário rola para ver a cena inteira (em % da altura da tela)
    pausaFinal: 0.16,                 // fração final do scroll em que o último quadro fica parado
    secoes: [
      {
        id: "residencial",
        tag: "Projetos Residenciais",
        titulo: "A jornada da sua instalação",
        cena: {
          proporcao: 1600 / 873,
          camera: { z0: 1.15, z1: 1.03, x0: -2.5, y0: -3, x1: 3, y1: 0.5 },
          sol: { x: 60, y: 12 },
          // as fotos são dissolvidas nesta ordem, conforme o scroll
          camadas: [
            { src: "assets/residencial/flutuando.jpg" },
            { src: "assets/residencial/instalada.jpg", de: 0.46, ate: 0.88 }
          ],
          // MODO VÍDEO: cole os quadros extraídos do vídeo na pasta abaixo, com os
          // nomes frame_001.jpg, frame_002.jpg … e ajuste "total" para a quantidade exata.
          // Enquanto a pasta estiver vazia, o site usa a dissolução entre as fotos acima.
          quadros: { pasta: "assets/residencial/quadros/", total: 131, prefixo: "frame_", digitos: 3, ext: "jpg" },
          estudio: "assets/residencial/ceu.jpg"   // foto usada no "Saiba mais"
        },
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
      }
    ],
    rotuloSaibaMais: "Saiba mais",
    rotuloVoltar: "Voltar"
  },

  /* ---------- PROVA: números, garantias e depoimentos ---------- */
  prova: {
    tag: "Resultados que sustentam a decisão",
    titulo: "Números de quem entrega, não de quem promete",
    numeros: [
      { valor: "+320", rotulo: "sistemas instalados", detalhe: "residenciais e corporativos" },
      { valor: "8,4", sufixo: "MWp", rotulo: "potência instalada", detalhe: "em operação e monitorada" },
      { valor: "98", sufixo: "%", rotulo: "dos projetos no prazo", detalhe: "do contrato à conexão" },
      { valor: "4,9", sufixo: "/5", rotulo: "satisfação dos clientes", detalhe: "pesquisa pós-instalação" }
    ],
    aviso: "Substitua estes números pelos dados reais da R2 Energy em content.js → prova.numeros.",
    selos: [
      ["Engenharia própria", "Projeto assinado por engenheiro eletricista, com ART emitida."],
      ["Homologação inclusa", "Protocolo, vistoria e acompanhamento junto à concessionária."],
      ["Garantia real", "25 anos de performance, 12 anos de produto, 5 anos de instalação."],
      ["Monitoramento", "App com geração em tempo real e relatório mensal de economia."]
    ],
    depoimentos: [
      { texto: "A conta caiu de mais de mil reais para a taxa mínima logo no primeiro mês. A equipe entregou no prazo e deixou tudo limpo.", autor: "[NOME DO CLIENTE]", papel: "Residência · [BAIRRO, CIDADE]" },
      { texto: "Fizeram o estudo de viabilidade com números que a diretoria entendeu. Hoje acompanhamos a geração do galpão pelo relatório mensal.", autor: "[NOME DO CLIENTE]", papel: "[EMPRESA] · Galpão de [X] m²" },
      { texto: "O que me convenceu foi a explicação sem enrolação. Mostraram o payback real e cumpriram o que falaram.", autor: "[NOME DO CLIENTE]", papel: "Residência · [BAIRRO, CIDADE]" }
    ]
  },

  /* ---------- COMO FUNCIONA ---------- */
  processo: {
    tag: "Como funciona",
    titulo: "Do primeiro contato à usina ligada",
    passos: [
      { n: "01", titulo: "Análise da sua conta", texto: "Levantamos o consumo dos últimos 12 meses e a tarifa da sua concessionária para dimensionar sem exagero e sem faltar." },
      { n: "02", titulo: "Projeto e proposta", texto: "Estudo de sombreamento, análise estrutural do telhado e proposta com potência, geração estimada e payback calculado." },
      { n: "03", titulo: "Instalação", texto: "Equipe própria, estrutura certificada e obra concluída em até 30 dias após a aprovação, com o mínimo de transtorno." },
      { n: "04", titulo: "Homologação e monitoramento", texto: "Cuidamos do protocolo e da vistoria da concessionária. Depois de ligada, você acompanha a geração pelo app." }
    ]
  },

  /* ---------- PERGUNTAS FREQUENTES ---------- */
  faq: {
    tag: "Dúvidas frequentes",
    titulo: "O que todo cliente pergunta antes de fechar",
    itens: [
      ["Em quanto tempo o investimento se paga?", "Na maioria dos projetos residenciais o retorno fica entre 3 e 5 anos, dependendo do consumo, da tarifa da concessionária e da radiação solar da sua cidade. O simulador do site dá uma estimativa em segundos; a proposta detalhada traz o cálculo fechado."],
      ["A placa para de funcionar depois de 25 anos?", "Não. Os 25 anos são a garantia de performance: ao fim desse prazo os módulos ainda produzem cerca de 80 a 85 % da capacidade original, e continuam gerando por muitos anos depois disso."],
      ["E se o mês for nublado ou chover muito?", "O sistema é dimensionado pela média anual. Nos meses de menos sol você gera menos e usa créditos acumulados; nos meses de mais sol acontece o contrário. Os créditos ficam válidos por 60 meses."],
      ["Preciso de baterias?", "Na maioria dos casos não. O sistema conectado à rede usa a própria rede como se fosse a bateria, através do sistema de compensação de créditos. Baterias só fazem sentido em locais com queda frequente de energia."],
      ["Meu telhado aguenta?", "Fazemos análise estrutural antes de qualquer instalação. Trabalhamos com telha cerâmica, metálica, fibrocimento e laje, e usamos estrutura de alumínio anodizado dimensionada para a sua cobertura."],
      ["Como fica a conta depois da instalação?", "Você continua pagando a taxa mínima da concessionária (custo de disponibilidade) e a iluminação pública. O consumo em si é compensado pela energia que sua usina injeta na rede."]
    ]
  },

  rodape: {
    descricao: "Instalações fotovoltaicas residenciais e corporativas com engenharia própria, foco em performance e monitoramento contínuo.",
    creditos: "R2 Energy · Todos os direitos reservados"
  }
};
