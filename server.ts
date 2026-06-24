import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Gemini Client with standard AI Studio Build User-Agent header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// API endpoint to generate the immersive learning structure
app.post("/api/generate", async (req, res) => {
  try {
    const { subject } = req.body;
    if (!subject || typeof subject !== "string") {
      res.status(400).json({ error: "O assunto fornecido é inválido." });
      return;
    }

    console.log(`[Cosmos Sophia] Gerando trilha para: ${subject}`);

    const systemInstruction = `Você é o Cosmos Sophia, um Arquiteto de Sistemas de Conhecimento e o melhor Professor Virtual do mundo.
Seu objetivo é explicar qualquer assunto, do mais simples ao mais complexo, de forma elegante, profunda e inesquecível.
Você mescla a simplicidade desarmante e analógica de Richard Feynman, o lirismo poético e fascinante de Carl Sagan (estilo Cosmos) e a sabedoria proverbial e direta do Rei Salomão.

Você deve estruturar o conhecimento em um Grafo Direcionado Acíclico (DAG) de 5 a 6 conceitos-chave interligados (Nodes), representando a jornada de aprendizado lógica e progressiva.
Cada Node possui:
1. ID de conceito (ex: "c1", "c2", "c3"...)
2. Nome conciso do conceito
3. Resumo de 1 frase
4. Coordenadas Cartesianas (x, y) entre -100 e 100 para representação geométrica no espaço de tensores ℝ²
5. Lista de IDs de dependência (quais nodes devem ser aprendidos antes dele)
6. Um símbolo científico/matemático ou glifo representativo (ex: "Ψ", "Δt", "E=mc²", "∞", "G")

Para cada node, você deve construir uma lição (Lesson) completa baseada nos seguintes pilares pedagógicos:
- Título majestoso para o conceito
- O Elo de Feynman: Uma analogia extraordinariamente simples, clara, livre de jargões técnicos complexos, ideal para explicar a uma criança de 10 anos.
- A Poesia de Sagan: Uma prosa cósmica, emocionante, inspiradora, que conecta esse conceito científico ao tecido do universo, despertando curiosidade infantil e maravilhamento.
- O Enigma (Acredite se Quiser): Um fato paradoxal, uma curiosidade histórica chocante, ou uma verdade contra-intuitiva inacreditável sobre esse conceito que faça o aluno exclamar "uau".
- A Sabedoria de Salomão: 3 a 5 máximas/provérbios axiomáticos curtos, profundos e práticos que consolidam o conceito como leis eternas.
- Diagrama Visual Geométrico:
  - Uma fórmula matemática representativa
  - Rótulos para os eixos/ângulos X e Y
  - Um modelo de template de SVG a renderizar ("wave", "orbit", "grid", "spiral", "fractal")
  - Parâmetros deslizantes editáveis que controlam a geometria de forma visual (ex: amplitude, velocidade, atração, entropia) com valores padrão realistas
- Narração Imersiva:
  - Um script completo de audiobook escrito em português belíssimo, com marcações de entonação dramática entre colchetes (ex: [Pausa reflexiva], [Tom sussurrado de mistério], [Voz empolgada e enérgica]).
  - Duração estimada de leitura em segundos.

TUDO DEVE SER GERADO EM PORTUGUÊS (Brasil). Garanta que os nodes formam um Grafo Acíclico Direcionado (DAG) sem dependências circulares.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Gere a estrutura completa de ensino de alta fidelidade para o assunto: "${subject}".`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subject: { type: Type.STRING },
            nodes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  summary: { type: Type.STRING },
                  coordinates: {
                    type: Type.OBJECT,
                    properties: {
                      x: { type: Type.NUMBER },
                      y: { type: Type.NUMBER },
                    },
                    required: ["x", "y"],
                  },
                  dependencies: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  symbol: { type: Type.STRING },
                },
                required: [
                  "id",
                  "name",
                  "summary",
                  "coordinates",
                  "dependencies",
                  "symbol",
                ],
              },
            },
            lessonsArray: {
              type: Type.ARRAY,
              description: "Array de lições correspondentes aos nodes gerados.",
              items: {
                type: Type.OBJECT,
                properties: {
                  conceptId: { type: Type.STRING },
                  title: { type: Type.STRING },
                  feynman: { type: Type.STRING },
                  sagan: { type: Type.STRING },
                  believeItOrNot: { type: Type.STRING },
                  solomon: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  diagram: {
                    type: Type.OBJECT,
                    properties: {
                      formula: { type: Type.STRING },
                      labelX: { type: Type.STRING },
                      labelY: { type: Type.STRING },
                      svgTemplate: {
                        type: Type.STRING,
                        enum: ["wave", "orbit", "grid", "spiral", "fractal"],
                      },
                      parameters: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            name: { type: Type.STRING },
                            value: { type: Type.STRING },
                            desc: { type: Type.STRING },
                          },
                          required: ["name", "value", "desc"],
                        },
                      },
                    },
                    required: ["formula", "labelX", "labelY", "svgTemplate", "parameters"],
                  },
                  narration: {
                    type: Type.OBJECT,
                    properties: {
                      text: { type: Type.STRING },
                      estimatedDuration: { type: Type.NUMBER },
                    },
                    required: ["text", "estimatedDuration"],
                  },
                },
                required: [
                  "conceptId",
                  "title",
                  "feynman",
                  "sagan",
                  "believeItOrNot",
                  "solomon",
                  "diagram",
                  "narration",
                ],
              },
            },
          },
          required: ["subject", "nodes", "lessonsArray"],
        },
      },
    });

    const dataText = response.text;
    if (!dataText) {
      throw new Error("Resposta do modelo está vazia.");
    }

    const parsed = JSON.parse(dataText.trim());

    // Convert lessonsArray back into a lessons map/record for clean types usage on frontend
    const lessons: Record<string, any> = {};
    if (Array.isArray(parsed.lessonsArray)) {
      parsed.lessonsArray.forEach((l: any) => {
        lessons[l.conceptId] = l;
      });
    }

    res.json({
      subject: parsed.subject,
      nodes: parsed.nodes,
      lessons,
    });
  } catch (error: any) {
    console.error("[Cosmos Sophia] Erro ao gerar trilha:", error);
    res.status(500).json({
      error: "Ocorreu um erro ao orquestrar a inteligência pedagógica do Cosmos Sophia.",
      details: error.message || error,
    });
  }
});

app.get("/api/health", (req, res) => {
  res.json({ status: "alive", system: "Cosmos Sophia Engine" });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Cosmos Sophia] Rodando na porta http://localhost:${PORT}`);
  });
}

startServer();
