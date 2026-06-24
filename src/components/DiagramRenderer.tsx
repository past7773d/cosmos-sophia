import React, { useState, useEffect } from "react";
import { LessonDiagram } from "../types";
import { Sliders, Activity } from "lucide-react";

interface DiagramRendererProps {
  diagram: LessonDiagram;
}

export default function DiagramRenderer({ diagram }: DiagramRendererProps) {
  // Store slider values in local state, initialized with diagram default values
  const [params, setParams] = useState<Record<string, number>>({});

  useEffect(() => {
    const initialParams: Record<string, number> = {};
    diagram.parameters.forEach((p) => {
      // Extract numeric value from string (e.g., "0.5" or "12" or "40")
      const numVal = parseFloat(p.value) || 50;
      initialParams[p.name] = numVal;
    });
    setParams(initialParams);
  }, [diagram]);

  const handleSliderChange = (name: string, val: number) => {
    setParams((prev) => ({
      ...prev,
      [name]: val,
    }));
  };

  // SVG parameters
  const svgSize = 300;
  const center = svgSize / 2;

  // Render SVG based on the selected template
  const renderGeometry = () => {
    switch (diagram.svgTemplate) {
      case "wave": {
        const amp = params["Amplitude"] !== undefined ? params["Amplitude"] : 40;
        const freq = params["Frequência"] !== undefined ? params["Frequência"] : 4;
        const speed = params["Velocidade"] !== undefined ? params["Velocidade"] : 1;
        const entropy = params["Entropia"] !== undefined ? params["Entropia"] : 0;

        const points: string[] = [];
        const resolution = 120;
        for (let i = 0; i <= resolution; i++) {
          const x = (i / resolution) * svgSize;
          // Calculate wave height with optional random entropy
          const angle = (i / resolution) * freq * Math.PI * 2;
          const noise = entropy > 0 ? (Math.sin(angle * 4) * (entropy / 2) * Math.sin(Date.now() / 200)) : 0;
          const y = center + Math.sin(angle) * amp + noise;
          points.push(`${x},${y}`);
        }

        return (
          <g>
            {/* Axis lines */}
            <line x1="0" y1={center} x2={svgSize} y2={center} stroke="#1e293b" strokeWidth="1" strokeDasharray="4,4" />
            {/* Main wave line */}
            <polyline
              points={points.join(" ")}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]"
            />
            {/* Harmonious overlapping wave (offset phase) */}
            <polyline
              points={points.map((pStr) => {
                const [x, y] = pStr.split(",").map(Number);
                const originalY = y - center;
                return `${x},${center - originalY * 0.5}`;
              }).join(" ")}
              fill="none"
              stroke="#6366f1"
              strokeWidth="1.5"
              strokeDasharray="3,3"
              className="opacity-50"
            />
          </g>
        );
      }

      case "orbit": {
        const orbitsCount = params["Órbitas"] !== undefined ? params["Órbitas"] : 3;
        const gravity = params["Gravidade"] !== undefined ? params["Gravidade"] : 30;
        const speed = params["Velocidade"] !== undefined ? params["Velocidade"] : 2;

        return (
          <g>
            {/* Central massive core */}
            <circle
              cx={center}
              cy={center}
              r={12 + gravity * 0.3}
              fill="url(#goldGrad)"
              className="drop-shadow-[0_0_15px_rgba(245,158,11,0.6)]"
            />

            {/* Ellipses / Orbits */}
            {Array.from({ length: Math.min(6, Math.max(1, Math.round(orbitsCount))) }).map((_, idx) => {
              const radiusX = 40 + idx * 30;
              const radiusY = radiusX * 0.65; // Flattened for perspective
              const duration = (20 - idx * 3) / (speed || 1); // dynamic rotation duration

              return (
                <g key={idx}>
                  {/* Orbit track */}
                  <ellipse
                    cx={center}
                    cy={center}
                    rx={radiusX}
                    ry={radiusY}
                    fill="none"
                    stroke="#334155"
                    strokeWidth="1"
                    strokeDasharray="4,3"
                  />
                  {/* Orbiting particle */}
                  <circle cx={center} cy={center} r="4.5" fill="#6366f1">
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from="0"
                      to="360"
                      begin="0s"
                      dur={`${duration}s`}
                      repeatCount="indefinite"
                      style={{ transformOrigin: `${center}px ${center}px` }}
                    />
                  </circle>
                </g>
              );
            })}
          </g>
        );
      }

      case "grid": {
        const warp = params["Distorção"] !== undefined ? params["Distorção"] : 40;
        const density = params["Densidade"] !== undefined ? params["Densidade"] : 12;
        const mass = params["Massa"] !== undefined ? params["Massa"] : 50;

        const gridLines: React.ReactNode[] = [];
        const linesNum = Math.min(24, Math.max(6, Math.round(density)));

        // Horizontal and Vertical lines curved around center gravity
        for (let i = 0; i <= linesNum; i++) {
          const ratio = i / linesNum;
          const pos = ratio * svgSize;

          // Generate paths instead of lines to allow curvature distortion
          const pointsH: string[] = [];
          const pointsV: string[] = [];

          for (let j = 0; j <= 20; j++) {
            const stepRatio = j / 20;
            const stepPos = stepRatio * svgSize;

            // Compute distance from center to warp coordinates
            const distH = Math.hypot(stepPos - center, pos - center) || 1;
            const factorH = Math.max(0, 1 - distH / (mass * 2));
            const offsetH = factorH * warp * 0.8;

            const finalY = pos + (pos < center ? offsetH : -offsetH) * (1 - Math.abs(pos - center) / center);
            pointsH.push(`${stepPos},${finalY}`);

            const distV = Math.hypot(pos - center, stepPos - center) || 1;
            const factorV = Math.max(0, 1 - distV / (mass * 2));
            const offsetV = factorV * warp * 0.8;

            const finalX = pos + (pos < center ? offsetV : -offsetV) * (1 - Math.abs(pos - center) / center);
            pointsV.push(`${finalX},${stepPos}`);
          }

          gridLines.push(
            <polyline key={`h-${i}`} points={pointsH.join(" ")} fill="none" stroke="#1e293b" strokeWidth="1" />
          );
          gridLines.push(
            <polyline key={`v-${i}`} points={pointsV.join(" ")} fill="none" stroke="#1e293b" strokeWidth="1" />
          );
        }

        return (
          <g>
            {gridLines}
            {/* Singular warping point */}
            <circle
              cx={center}
              cy={center}
              r="6"
              fill="#6366f1"
              className="animate-ping"
              style={{ animationDuration: "3s" }}
            />
            <circle cx={center} cy={center} r="4" fill="#a78bfa" />
          </g>
        );
      }

      case "spiral": {
        const expansion = params["Expansão"] !== undefined ? params["Expansão"] : 4;
        const turns = params["Voltas"] !== undefined ? params["Voltas"] : 3;
        const nodesCount = params["Nodos"] !== undefined ? params["Nodos"] : 40;

        const points: string[] = [];
        const maxAngle = turns * Math.PI * 2;
        const steps = 200;

        for (let i = 0; i <= steps; i++) {
          const ratio = i / steps;
          const theta = ratio * maxAngle;
          // Logarithmic spiral: r = a * e^(b * theta)
          const r = Math.pow(ratio, 1.2) * (center - 10);
          const x = center + r * Math.cos(theta);
          const y = center + r * Math.sin(theta);
          points.push(`${x},${y}`);
        }

        return (
          <g>
            {/* Golden spiral skeleton */}
            <polyline points={points.join(" ")} fill="none" stroke="#334155" strokeWidth="1.2" />
            <polyline
              points={points.slice(0, Math.floor(steps * 0.8)).join(" ")}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="drop-shadow-[0_0_6px_rgba(245,158,11,0.4)]"
            />
            {/* Glowing nodes along spiral */}
            {Array.from({ length: Math.min(30, Math.round(nodesCount / 2)) }).map((_, idx) => {
              const stepIdx = Math.floor((idx / 15) * steps * 0.9);
              const ptStr = points[stepIdx];
              if (!ptStr) return null;
              const [x, y] = ptStr.split(",").map(Number);
              return (
                <circle
                  key={idx}
                  cx={x}
                  cy={y}
                  r={2 + (idx * 0.25)}
                  fill="#6366f1"
                  className="opacity-85"
                />
              );
            })}
          </g>
        );
      }

      case "fractal": {
        const depth = params["Profundidade"] !== undefined ? params["Profundidade"] : 4;
        const angle = params["Ângulo"] !== undefined ? params["Ângulo"] : 30;
        const density = params["Ramificação"] !== undefined ? params["Ramificação"] : 2;

        // Recursive generator for a tree/fractal geometry
        const branches: React.ReactNode[] = [];
        const drawBranch = (
          x1: number,
          y1: number,
          length: number,
          currentAngle: number,
          currentDepth: number,
          key: string
        ) => {
          if (currentDepth <= 0) return;

          const rad = (currentAngle * Math.PI) / 180;
          const x2 = x1 + length * Math.sin(rad);
          const y2 = y1 - length * Math.cos(rad);

          // Render branch line
          branches.push(
            <line
              key={key}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={currentDepth > 2 ? "#d97706" : "#6366f1"}
              strokeWidth={Math.max(0.8, currentDepth * 0.7)}
              strokeLinecap="round"
              opacity={0.3 + (currentDepth / depth) * 0.7}
            />
          );

          // Fork branch
          const angleDiff = angle;
          const nextLength = length * 0.72;

          drawBranch(x2, y2, nextLength, currentAngle - angleDiff, currentDepth - 1, `${key}-l`);
          drawBranch(x2, y2, nextLength, currentAngle + angleDiff, currentDepth - 1, `${key}-r`);
        };

        // Start drawing from bottom-center
        const rootY = svgSize - 25;
        const rootX = center;
        const initialLength = svgSize * 0.22;
        drawBranch(rootX, rootY, initialLength, 0, Math.min(5, Math.round(depth)), "root");

        return <g>{branches}</g>;
      }

      default:
        return null;
    }
  };

  return (
    <div className="bg-slate-950/80 border border-slate-900 rounded-xl p-5 shadow-inner">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Dynamic Vector Space */}
        <div className="flex flex-col items-center justify-center bg-[#090d16] border border-slate-900 rounded-lg p-4 relative">
          <span className="absolute top-2 right-2 text-[9px] font-mono text-slate-500 flex items-center gap-1">
            <Activity className="w-3 h-3 text-amber-500 animate-pulse" />
            VETOR: {diagram.svgTemplate.toUpperCase()}
          </span>

          <svg width={svgSize} height={svgSize} className="bg-slate-950 rounded border border-slate-900">
            <defs>
              <radialGradient id="goldGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="70%" stopColor="#d97706" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#78350f" stopOpacity="0" />
              </radialGradient>
            </defs>

            {renderGeometry()}

            {/* Axes display values */}
            <text x="10" y="20" fill="#475569" className="font-mono text-[9px]">{diagram.labelY}</text>
            <text x={svgSize - 75} y={svgSize - 10} fill="#475569" className="font-mono text-[9px]">{diagram.labelX}</text>
          </svg>

          <p className="mt-3 text-center font-mono text-sm font-semibold tracking-wider text-amber-400 bg-slate-900/50 px-3 py-1 border border-slate-800/80 rounded">
            {diagram.formula}
          </p>
        </div>

        {/* Sliders panel */}
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-900 pb-2">
            <Sliders className="w-4 h-4 text-indigo-400" />
            <h4 className="font-display font-medium text-sm text-slate-200">
              Manipulador de Campos e Tensores
            </h4>
          </div>

          <p className="text-xs text-slate-400 mb-4 leading-relaxed">
            Ajuste os parâmetros geométricos para observar como as variáveis interferem no equacionamento e comportamento espacial da teoria.
          </p>

          <div className="space-y-4">
            {diagram.parameters.map((p) => {
              const currentVal = params[p.name] !== undefined ? params[p.name] : parseFloat(p.value) || 50;
              // Guess range min/max based on the value size
              let min = 0;
              let max = 100;
              let step = 1;

              if (p.name === "Frequência" || p.name === "Órbitas" || p.name === "Profundidade") {
                min = 1;
                max = 8;
                step = 1;
              } else if (p.name === "Velocidade") {
                min = 0.5;
                max = 5;
                step = 0.1;
              } else if (p.name === "Ângulo") {
                min = 10;
                max = 75;
                step = 5;
              }

              return (
                <div key={p.name} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-300 font-medium">{p.name}</span>
                    <span className="text-amber-500 font-semibold">{currentVal}</span>
                  </div>
                  <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={currentVal}
                    onChange={(e) => handleSliderChange(p.name, parseFloat(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                  <span className="text-[10px] text-slate-500 leading-none">{p.desc}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
