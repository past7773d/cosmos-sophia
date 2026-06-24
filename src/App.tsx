import React, { useState, useEffect, useMemo } from "react";
import {
  Sparkles,
  BookOpen,
  ArrowRight,
  RefreshCw,
  Award,
  Globe,
  Compass,
  AlertTriangle,
  Lightbulb,
  CheckCircle,
  HelpCircle,
  TrendingUp,
  Cpu,
} from "lucide-react";
import { ConceptNode, Lesson, LessonResponse } from "./types";
import DAGCanvas from "./components/DAGCanvas";
import DiagramRenderer from "./components/DiagramRenderer";
import AudiobookNarrator from "./components/AudiobookNarrator";
import StatsComponent from "./components/StatsComponent";

// Premium prebuilt fallback subject so the application is instantly full of life
const defaultTrail: LessonResponse = {
  subject: "Física de Buracos Negros",
  nodes: [
    {
      id: "c1",
      name: "Gravidade Clássica",
      summary: "A atração mútua de todas as coisas que possuem massa.",
      coordinates: { x: -80, y: -30 },
      dependencies: [],
      symbol: "G",
    },
    {
      id: "c2",
      name: "A Curvatura do Espaço-Tempo",
      summary: "A matéria diz ao espaço como se curvar; o espaço diz à matéria como se mover.",
      coordinates: { x: -30, y: 15 },
      dependencies: ["c1"],
      symbol: "g_μν",
    },
    {
      id: "c3",
      name: "Limite do Colapso Estelar",
      summary: "Estrelas gigantescas implodindo sob o peso do próprio destino.",
      coordinates: { x: 20, y: -25 },
      dependencies: ["c2"],
      symbol: "M_☉",
    },
    {
      id: "c4",
      name: "Horizonte de Eventos",
      summary: "A fronteira de onde nem mesmo a luz consegue escapar.",
      coordinates: { x: 65, y: 35 },
      dependencies: ["c3"],
      symbol: "R_s",
    },
    {
      id: "c5",
      name: "Singularidade",
      summary: "O ponto geométrico onde a matemática da física colapsa em infinito.",
      coordinates: { x: 90, y: -10 },
      dependencies: ["c4"],
      symbol: "∞",
    },
  ],
  lessons: {
    c1: {
      conceptId: "c1",
      title: "Gravidade Clássica: O Elo Invisível",
      feynman:
        "Pense na gravidade como se fosse uma dança invisível onde todos no salão se puxam sutilmente. Isaac Newton percebeu que não é apenas a Terra que puxa a maçã; a maçã também puxa a Terra! Tudo o que tem massa no universo possui uma espécie de magnetismo de afeto físico — quanto mais pesado você é, mais as pessoas ao seu redor sentem a sua presença.",
      sagan:
        "Em algum lugar das planícies da Inglaterra do século XVII, uma mente humana contemplou a queda de um fruto e compreendeu a sinfonia que governa os astros. A mesma força invisível que amarra seus pés à poeira deste mundo mantém a Lua em seu abraço eterno e guia as galáxias pelo abismo escuro do espaço cósmico. Somos poeira estelar flutuando sob as ordens de uma gravidade unificadora.",
      believeItOrNot:
        "Se você pudesse espremer toda a massa do nosso planeta Terra ao tamanho de uma pequena bola de gude (cerca de 1.8 centímetros), a sua gravidade clássica seria tão imensa que ela se transformaria instantaneamente em um buraco negro em miniatura!",
      solomon: [
        "O peso do ferro e a leveza da pluma caem com a mesma determinação na ausência de ventos.",
        "A força invisível governa com maior rigor aquilo que é mais denso e opulento.",
        "A ordem cósmica se estabelece não pelo que se vê, mas pelos fios sutis que unem o grande e o pequeno.",
      ],
      diagram: {
        formula: "F = G * (m1 * m2) / r²",
        labelX: "Distância (r)",
        labelY: "Força de Atração (F)",
        svgTemplate: "wave",
        parameters: [
          { name: "Amplitude", value: "60", desc: "Massa dos corpos envolvidos na atração" },
          { name: "Frequência", value: "3", desc: "Taxa de decaimento inverso do quadrado" },
          { name: "Velocidade", value: "1.2", desc: "Constante gravitacional universal G" },
        ],
      },
      narration: {
        text: "[Tom sereno e contemplativo] Imagine uma maçã caindo em um pomar silencioso. [Pausa curta] Para a física, esse ato singelo é o sussurro de uma lei que abrange o infinito. Richard Feynman nos convida a ver que a maçã puxa a Terra, numa reciprocidade perfeita e eterna. [Tom sussurrado] Cada átomo de seu corpo exerce uma atração sutil sobre cada estrela do firmamento, unindo-nos à arquitetura indestrutível do Cosmos.",
        estimatedDuration: 42,
      },
    },
    c2: {
      conceptId: "c2",
      title: "Espaço-Tempo: O Tecido Cósmico",
      feynman:
        "Esqueça a ideia de que o espaço é um vazio sem nada. Imagine que o universo é uma gigantesca cama elástica. Se você colocar uma bola de boliche no meio (como o Sol), o tecido da cama se afunda. Se você jogar uma bolinha de gude (a Terra) na cama, ela vai começar a girar ao redor do afundamento. O espaço não está empurrando a bolinha; a bolinha está apenas seguindo a rampa curvada criada pelo Sol!",
      sagan:
        "Albert Einstein nos legou uma das maiores catedrais do pensamento humano: a Relatividade Geral. O espaço e o tempo não são palcos rígidos onde o drama cósmico se desenrola; eles são o próprio tecido dinâmico do drama. Um tecido flexível, maleável, que se curva na presença de estrelas e planetas. O espaço-tempo sussurra para a matéria como se mover, e a matéria dita a forma do espaço.",
      believeItOrNot:
        "Como a gravidade curva o tempo, os relógios no topo de um arranha-céu correm ligeiramente mais rápido do que os relógios no nível do mar! Quanto mais perto do chão e da gravidade da Terra você está, mais devagar o seu tempo passa.",
      solomon: [
        "Aquele que caminha pelo vale profundo percebe que a sua própria jornada altera o relevo sob seus pés.",
        "As estradas do tempo não são retas, mas se inclinam perante o peso das grandes criações.",
        "O sábio compreende que o tempo e o espaço são as vestes flexíveis de um Criador infinito.",
      ],
      diagram: {
        formula: "G_μν = 8πG/c⁴ * T_μν",
        labelX: "Massa (Tensão)",
        labelY: "Curvatura do Espaço-Tempo",
        svgTemplate: "grid",
        parameters: [
          { name: "Distorção", value: "55", desc: "Intensidade da curvatura de Einstein" },
          { name: "Densidade", value: "16", desc: "Resolução geométrica do tecido" },
          { name: "Massa", value: "60", desc: "Massa do objeto central gerador" },
        ],
      },
      narration: {
        text: "[Voz empolgada e fascinada] Albert Einstein mudou as regras do jogo. O espaço não é um vazio rígido, mas uma malha elástica de alta tecnologia! [Pausa dramática] Coloque uma estrela brilhante no centro, e a malha se deforma. Os planetas não são puxados por laços mágicos; eles apenas deslizam pelas encostas tridimensionais dessa curvatura eterna. [Sussurro] Estamos todos deslizando na rampa do infinito.",
        estimatedDuration: 38,
      },
    },
    c3: {
      conceptId: "c3",
      title: "Colapso Estelar: O Limiar do Destino",
      feynman:
        "Toda estrela viva é como um cabo de guerra eterno. De um lado, a gravidade tenta esmagar a estrela para dentro. Do outro, o calor ardente do motor nuclear da estrela empurra para fora. Enquanto houver combustível, o cabo de guerra fica empatado. Mas quando o combustível acaba, a força nuclear some e a gravidade vence, esmagando trilhões de toneladas de matéria em um piscar de olhos!",
      sagan:
        "Quando estrelas massivas morrem, elas não partem silenciosamente. Elas esgotam suas fornalhas termonucleares, as fábricas de carbono, oxigênio e ferro que compõem nossos próprios corpos. Sem a pressão interna do fogo, a estrela sucumbe ao seu próprio peso imensurável, implodindo em uma velocidade assombrosa. É o nascimento de um monstro escuro, um rasgo no próprio tecido do universo.",
      believeItOrNot:
        "Uma estrela de nêutrons — o estágio imediatamente anterior a um buraco negro — é tão incrivelmente densa que uma única colher de chá de sua matéria pesaria cerca de 6 bilhões de toneladas, o equivalente a toda a população humana somada!",
      solomon: [
        "Se o fogo interno de uma lâmpada se apaga, a escuridão ao redor a invade sem piedade.",
        "Até mesmo os gigantes dos céus caem sob o fardo de suas próprias grandezas.",
        "A ruína de uma grande estrela é a semente de onde brotam os tijolos da vida universal.",
      ],
      diagram: {
        formula: "M > M_Ch (1.4 M_☉)",
        labelX: "Raio Estelar (R)",
        labelY: "Pressão de Degeneração",
        svgTemplate: "orbit",
        parameters: [
          { name: "Órbitas", value: "4", desc: "Camadas de fusão de elementos pesados" },
          { name: "Gravidade", value: "70", desc: "Força de compressão gravitacional" },
          { name: "Velocidade", value: "2.5", desc: "Taxa de rotação e conservação de momentum" },
        ],
      },
      narration: {
        text: "[Tom dramático e intenso] Uma estrela brilha porque está travando uma batalha desesperada contra si mesma. [Pausa expressiva] De um lado, o calor empurra para fora; do outro, a gravidade esmaga para dentro. Quando o combustível nuclear finalmente cessa, a gravidade se torna senhora absoluta da situação. Uma massa equivalente a milhões de sóis desaba sobre si mesma em segundos, rompendo todos os recordes da física.",
        estimatedDuration: 45,
      },
    },
    c4: {
      conceptId: "c4",
      title: "Horizonte de Eventos: O Ponto Sem Retorno",
      feynman:
        "Imagine um rio rápido que termina em uma cachoeira gigante. Se você estiver nadando rio abaixo, há um ponto onde a velocidade da água fica mais rápida do que a sua velocidade máxima de nado. Se você cruzar essa linha invisível, você nunca mais conseguirá voltar para a margem, por mais forte que nade. O horizonte de eventos de um buraco negro é essa cachoeira invisível para a luz!",
      sagan:
        "Aqui, as fronteiras da realidade conhecida se dissolvem. O Horizonte de Eventos é uma membrana geográfica de mistério absoluto. Cruzar essa fronteira é divorciar-se para sempre do resto do cosmos. Nem mesmo um feixe de luz, viajando a trezentos mil quilômetros por segundo, consegue encontrar o caminho de volta. É o silêncio eterno, onde o próprio futuro aponta apenas para dentro.",
      believeItOrNot:
        "Se você caísse em um buraco negro supermassivo, a gravidade puxaria seus pés com tanta força em relação à sua cabeça que você seria esticado como um espaguete! Os astrofísicos chamam esse processo real de 'Espaguetificação'.",
      solomon: [
        "Há caminhos de onde o homem nunca retorna se ultrapassar a linha do julgamento.",
        "A luz guia os justos, mas até ela é cativa quando a cobiça se torna absoluta.",
        "O silêncio do Horizonte ensina que certas verdades exigem o sacrifício de nunca serem relatadas.",
      ],
      diagram: {
        formula: "R_s = 2GM / c²",
        labelX: "Distância do Centro (r)",
        labelY: "Velocidade de Escape (v_esc)",
        svgTemplate: "spiral",
        parameters: [
          { name: "Expansão", value: "5", desc: "Tamanho do raio do horizonte R_s" },
          { name: "Voltas", value: "4", desc: "Distorção helicoidal dos raios de luz" },
          { name: "Nodos", value: "35", desc: "Fótons orbitando na esfera de fótons" },
        ],
      },
      narration: {
        text: "[Sussurro misterioso e pausado] Imagine uma cachoeira onde a água corre mais rápido do que a velocidade da própria luz. [Pausa de 2 segundos] Cruzar o Horizonte de Eventos é cruzar a fronteira entre o visível e o eterno. Se você der um passo além dessa linha invisível, o seu destino estará selado. Nem mesmo a luz, a mensageira mais veloz do universo, pode escapar de volta para nos contar o que há ali.",
        estimatedDuration: 44,
      },
    },
    c5: {
      conceptId: "c5",
      title: "A Singularidade: O Fim da Matemática",
      feynman:
        "Toda aquela massa gigantesca da estrela original continua caindo e caindo para dentro de si mesma, até ficar menor do que um grão de areia, menor do que um átomo, menor do que um elétron... de fato, ela cai até ocupar um espaço com tamanho EXATAMENTE ZERO! Toda a matéria comprimida em nada. É como tentar dividir um número por zero na calculadora da realidade.",
      sagan:
        "No âmago mais profundo do buraco negro repousa a Singularidade. Um ponto onde a curvatura do espaço-tempo é infinita, e o volume é zero. Aqui, a física de Einstein se rende à mecânica quântica, em um casamento proibido que ainda não compreendemos totalmente. A Singularidade é o limite do nosso conhecimento científico, um convite para as mentes do amanhã desbravarem a penumbra teórica.",
      believeItOrNot:
        "Como o tempo desacelera próximo ao infinito gravitacional, para um observador de fora, você pareceria congelar para sempre no limite do buraco negro, desaparecendo lentamente para o vermelho, sem nunca parecer cruzar a linha em tempo real!",
      solomon: [
        "O princípio da sabedoria é aceitar os limites que nos separam do insondável.",
        "A verdade mais profunda reside em um ponto pequeno e discreto que o tolo desconsidera.",
        "Na ausência de dimensões terrestres, a alma encontra a medida do infinito.",
      ],
      diagram: {
        formula: "ρ = M / V (V → 0, ρ → ∞)",
        labelX: "Densidade (ρ)",
        labelY: "Espaço (V)",
        svgTemplate: "fractal",
        parameters: [
          { name: "Profundidade", value: "5", desc: "Níveis de compressão da singularidade" },
          { name: "Ângulo", value: "45", desc: "Grau de convergência gravitacional" },
          { name: "Ramificação", value: "2", desc: "Campos de vácuo quântico gerados" },
        ],
      },
      narration: {
        text: "[Voz baixa e solene, com grandiosidade] Chegamos ao fim da estrada da física clássica. [Pausa longa] A singularidade. Toda a matéria de milhões de planetas comprimida em um ponto geométrico de tamanho zero. As equações divagam e produzem divisões por zero. [Tom enérgico] É o grito do universo de que precisamos de uma nova teoria da gravidade quântica. É a fronteira final da curiosidade humana.",
        estimatedDuration: 46,
      },
    },
  },
};

export default function App() {
  const [subject, setSubject] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [trail, setTrail] = useState<LessonResponse>(defaultTrail);
  const [selectedNodeId, setSelectedNodeId] = useState("c1");
  const [activeTab, setActiveTab] = useState<"feynman" | "sagan" | "enigma" | "solomon" | "diagram">("feynman");

  // User state tracking lesson completion
  const [completedNodes, setCompletedNodes] = useState<Record<string, boolean>>({});

  // Preset search topics for amazing user onboarding
  const presetSubjects = [
    "Física Quântica para Crianças",
    "A Sabedoria Prática do Estoicismo",
    "A Origem das Galáxias de Carl Sagan",
    "Teoria do Caos e Efeito Borboleta",
  ];

  // Map dependencies list to see what is unlocked
  const unlockedNodes = useMemo(() => {
    const unlocked: Record<string, boolean> = {};
    if (!trail || !trail.nodes) return unlocked;

    trail.nodes.forEach((node) => {
      if (!node.dependencies || node.dependencies.length === 0) {
        unlocked[node.id] = true;
      } else {
        unlocked[node.id] = node.dependencies.every((depId) => completedNodes[depId]);
      }
    });
    return unlocked;
  }, [trail, completedNodes]);

  // Set the selected node
  const activeLesson = useMemo(() => {
    return trail.lessons[selectedNodeId];
  }, [trail, selectedNodeId]);

  // Handle auto-progress when changing subjects
  const selectFirstUnlockedNode = (currentTrail: LessonResponse) => {
    const firstNode = currentTrail.nodes.find(
      (n) => !n.dependencies || n.dependencies.length === 0
    );
    if (firstNode) {
      setSelectedNodeId(firstNode.id);
    } else if (currentTrail.nodes.length > 0) {
      setSelectedNodeId(currentTrail.nodes[0].id);
    }
  };

  const handleGenerate = async (searchSubject: string) => {
    if (!searchSubject.trim()) return;
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: searchSubject }),
      });

      if (!response.ok) {
        throw new Error("Falha ao orquestrar a geração com o Cosmos Sophia.");
      }

      const data = await response.json();
      if (data.nodes && data.nodes.length > 0) {
        setTrail(data);
        setCompletedNodes({}); // Reset progress for new topic
        selectFirstUnlockedNode(data);
        setActiveTab("feynman");
      } else {
        throw new Error("Dados de trilha vazios ou inválidos recebidos.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Erro de conexão com o Cosmos Sophia Engine.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleNodeCompleted = (nodeId: string) => {
    setCompletedNodes((prev) => {
      const updated = { ...prev, [nodeId]: !prev[nodeId] };
      return updated;
    });
  };

  const completedCount = useMemo(() => {
    return Object.values(completedNodes).filter(Boolean).length;
  }, [completedNodes]);

  const progressPercent = useMemo(() => {
    if (!trail || trail.nodes.length === 0) return 0;
    return Math.round((completedCount / trail.nodes.length) * 100);
  }, [completedCount, trail]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative selection:bg-amber-500/30 selection:text-amber-200">
      {/* Visual Ambient Background Glimmer */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-amber-900/10 rounded-full blur-3xl pointer-events-none" />

      {/* Elegant Header */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-400 to-indigo-500 p-[1.5px] shadow-lg shadow-amber-950/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Globe className="w-5 h-5 text-amber-400 animate-spin" style={{ animationDuration: "25s" }} />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-bold text-xl tracking-tight text-slate-100">
                  Cosmos Sophia
                </h1>
                <span className="text-[10px] bg-indigo-950/80 text-indigo-400 border border-indigo-900 px-1.5 py-0.5 rounded-full font-mono">
                  v3.5 Sênior
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans">
                A Arte de Ensinar Assuntos Complexos de Forma Simples e Cósmica
              </p>
            </div>
          </div>

          {/* Core Applet Status Box */}
          <div className="flex items-center gap-4 bg-slate-900/80 border border-slate-800/80 rounded-lg px-4 py-2">
            <div className="flex flex-col">
              <span className="text-[10px] font-mono text-slate-500 tracking-wider">DOMÍNIO DA TRILHA</span>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-amber-500 transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span className="text-xs font-mono font-semibold text-amber-400">{progressPercent}%</span>
              </div>
            </div>
            <div className="h-6 w-px bg-slate-800" />
            <div className="text-center">
              <span className="text-[10px] font-mono text-slate-500 block leading-none">CONCLUÍDO</span>
              <span className="text-sm font-semibold font-mono text-slate-200 mt-0.5 inline-block">
                {completedCount} / {trail.nodes.length}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Hand Sidebar - Input & Navigation Canvas */}
        <section className="lg:col-span-5 space-y-6 flex flex-col h-full">
          {/* Sophia Subject Weaver Panel */}
          <div className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-5 backdrop-blur-md shadow-lg shadow-slate-950/50">
            <h2 className="font-display font-medium text-slate-200 text-sm mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              O que você deseja aprender hoje?
            </h2>

            {/* Input field */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleGenerate(subject);
              }}
              className="flex gap-2"
            >
              <input
                id="subject-input"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Ex: Teoria da Relatividade, Mecânica Quântica..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/80 transition font-sans"
                disabled={isLoading}
              />
              <button
                id="btn-generate"
                type="submit"
                disabled={isLoading || !subject.trim()}
                className="bg-amber-500 text-slate-950 font-sans font-semibold text-xs px-4 rounded-lg hover:bg-amber-400 active:scale-95 transition disabled:opacity-50 flex items-center gap-1"
              >
                {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ArrowRight className="w-3.5 h-3.5" />}
                Tecer Trilhas
              </button>
            </form>

            {/* Error Message banner */}
            {errorMessage && (
              <div className="mt-3 flex items-start gap-2 bg-rose-950/50 border border-rose-900/50 rounded-lg p-3 text-xs text-rose-300">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Presets and suggestions */}
            <div className="mt-4 pt-3 border-t border-slate-900">
              <span className="text-[10px] font-mono text-slate-500 block mb-2">SUGESTÕES DE ALTA FIDELIDADE:</span>
              <div className="flex flex-wrap gap-1.5">
                {presetSubjects.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => {
                      setSubject(preset);
                      handleGenerate(preset);
                    }}
                    disabled={isLoading}
                    className="text-[11px] bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800/60 rounded px-2.5 py-1 text-left transition truncate max-w-full"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* DAG Map Canvas */}
          <DAGCanvas
            nodes={trail.nodes}
            selectedNodeId={selectedNodeId}
            onSelectNode={(id) => {
              setSelectedNodeId(id);
              setActiveTab("feynman"); // reset tab focus toeynman when changing nodes
            }}
            completedNodes={completedNodes}
            unlockedNodes={unlockedNodes}
          />

          {/* Immersive Sapiência Metrics Dashboard */}
          <StatsComponent
            completedCount={completedCount}
            totalCount={trail.nodes.length}
            completedNodes={completedNodes}
            nodes={trail.nodes}
          />

          {/* Pedagogical Guidance Box */}
          <div className="bg-[#0c101d] border border-slate-800/40 rounded-xl p-4 flex gap-3 text-xs text-slate-400">
            <Compass className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5 animate-pulse" />
            <div className="space-y-1">
              <p className="font-semibold text-slate-300 font-display">Sabedoria de Orquestração</p>
              <p className="leading-relaxed">
                Cada conceito possui dependências. Ao completar os exercícios e assimilar os pilares, clique em{" "}
                <strong className="text-amber-400">"Marcar como Aprendido"</strong> para liberar os novos portais e prosseguir.
              </p>
            </div>
          </div>
        </section>

        {/* Right Hand Sidebar - Immersive Interactive Lesson Studio */}
        <section className="lg:col-span-7 space-y-6">
          {activeLesson ? (
            <div className="bg-slate-900/30 border border-slate-800/80 rounded-xl p-6 backdrop-blur-md shadow-2xl space-y-6">
              {/* Concept Title Banner */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-900 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded font-mono text-[10px] font-semibold">
                      CONCEITO {selectedNodeId.toUpperCase()}
                    </span>
                    <span className="font-mono text-xs text-slate-500">
                      Símbolo: <strong className="text-slate-300">{trail.nodes.find(n => n.id === selectedNodeId)?.symbol}</strong>
                    </span>
                  </div>
                  <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-100 tracking-tight mt-1.5">
                    {activeLesson.title}
                  </h2>
                </div>

                <button
                  id="btn-toggle-completed"
                  onClick={() => toggleNodeCompleted(selectedNodeId)}
                  className={`w-full sm:w-auto font-sans font-medium text-xs px-4 py-2 rounded-lg border transition flex items-center justify-center gap-1.5 ${
                    completedNodes[selectedNodeId]
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                      : "bg-amber-500 text-slate-950 border-transparent hover:bg-amber-400 font-semibold shadow-lg shadow-amber-950/25"
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  {completedNodes[selectedNodeId] ? "Aprendido ✓" : "Marcar como Aprendido"}
                </button>
              </div>

              {/* Pillars Tabs */}
              <div className="flex flex-wrap border-b border-slate-900 gap-1 p-1 bg-slate-950 rounded-lg">
                {[
                  { id: "feynman", label: "O Elo de Feynman", desc: "Didática da Simplicidade" },
                  { id: "sagan", label: "A Poesia de Sagan", desc: "Maravilhamento Cósmico" },
                  { id: "enigma", label: "O Enigma", desc: "Acredite se Quiser" },
                  { id: "solomon", label: "Provérbios de Salomão", desc: "Sabedoria Axiomática" },
                  { id: "diagram", label: "Diagrama Vetorial", desc: "Espaço Geométrico" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    id={`tab-${tab.id}`}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 min-w-[120px] text-left px-3 py-2 rounded-md transition ${
                      activeTab === tab.id
                        ? "bg-slate-900 border border-slate-800 text-amber-400"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/30"
                    }`}
                  >
                    <span className="text-xs font-semibold block tracking-tight">{tab.label}</span>
                    <span className="text-[9px] text-slate-500 block mt-0.5 leading-none">{tab.desc}</span>
                  </button>
                ))}
              </div>

              {/* Tab Content Panels */}
              <div className="min-h-[220px]">
                {activeTab === "feynman" && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="flex items-center gap-2 text-amber-500">
                      <Lightbulb className="w-4 h-4 animate-pulse" />
                      <h4 className="font-display font-medium text-sm">Richard Feynman Explica:</h4>
                    </div>
                    <div className="bg-slate-950/40 border border-slate-900 rounded-lg p-5 leading-relaxed font-sans text-slate-300 relative">
                      <p className="text-sm italic">"{activeLesson.feynman}"</p>
                      {/* Quote decoration */}
                      <span className="absolute bottom-1 right-3 text-7xl font-serif text-slate-900/75 select-none pointer-events-none">”</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Richard Feynman defendia que se você não conseguir explicar um assunto para uma criança de 10 anos de forma desprovida de jargões complexos, então você mesmo não compreendeu verdadeiramente o assunto.
                    </p>
                  </div>
                )}

                {activeTab === "sagan" && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="flex items-center gap-2 text-indigo-400">
                      <Globe className="w-4 h-4 animate-spin-slow" />
                      <h4 className="font-display font-medium text-sm">Carl Sagan Inspira:</h4>
                    </div>
                    <div className="bg-indigo-950/10 border border-indigo-950 rounded-lg p-5 leading-relaxed font-sans text-slate-300 relative">
                      <p className="text-sm italic">"{activeLesson.sagan}"</p>
                      {/* Quote decoration */}
                      <span className="absolute bottom-1 right-3 text-7xl font-serif text-slate-900/50 select-none pointer-events-none">”</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Carl Sagan nos ajuda a olhar para as equações matemáticas não como meros algoritmos abstratos, mas como portas de deslumbramento que revelam nossa íntima conexão com as estrelas e o cosmos.
                    </p>
                  </div>
                )}

                {activeTab === "enigma" && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="flex items-center gap-2 text-amber-400">
                      <HelpCircle className="w-4 h-4" />
                      <h4 className="font-display font-medium text-sm">Acredite se Quiser (Enigma):</h4>
                    </div>
                    <div className="bg-amber-950/10 border border-amber-950/20 rounded-lg p-5 leading-relaxed font-sans text-amber-200">
                      <p className="text-sm font-medium">{activeLesson.believeItOrNot}</p>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      O universo está repleto de fatos paradoxais que desafiam o bom senso comum e as intuições cotidianas.
                    </p>
                  </div>
                )}

                {activeTab === "solomon" && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="flex items-center gap-2 text-amber-500">
                      <Award className="w-4 h-4" />
                      <h4 className="font-display font-medium text-sm">A Sabedoria de Salomão (Axiomas):</h4>
                    </div>
                    <div className="space-y-2.5">
                      {activeLesson.solomon.map((axiom, idx) => (
                        <div key={idx} className="flex gap-3 bg-slate-950/60 border border-slate-900 rounded-lg p-3.5">
                          <span className="font-mono text-xs text-amber-500 bg-amber-500/10 border border-amber-500/20 h-5 w-5 flex items-center justify-center rounded-sm shrink-0">
                            {idx + 1}
                          </span>
                          <p className="text-xs font-serif italic text-slate-300 leading-relaxed">{axiom}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "diagram" && (
                  <div className="space-y-4 animate-fadeIn">
                    <DiagramRenderer diagram={activeLesson.diagram} />
                  </div>
                )}
              </div>

              {/* Audiobook Narration System Player */}
              <AudiobookNarrator narration={activeLesson.narration} title={activeLesson.title} />
            </div>
          ) : (
            <div className="bg-slate-900/20 border border-slate-900 rounded-xl p-12 text-center text-slate-500">
              <Compass className="w-12 h-12 text-slate-700 mx-auto mb-4 animate-bounce" />
              <p className="text-sm">Selecione um conceito disponível no grafo para iniciar sua assimilação.</p>
            </div>
          )}
        </section>
      </main>

      {/* Footer credits and system metadata */}
      <footer className="border-t border-slate-950 bg-[#02050f] mt-auto py-6 text-center text-slate-600 text-xs font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>Cosmos Sophia © 2026 — Professor Virtual de Maestria Científica</span>
          <div className="flex items-center gap-2">
            <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">T ∈ ℝ^(N×M×K)</span>
            <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">O(n log n)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
