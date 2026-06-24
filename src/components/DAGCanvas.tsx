import React, { useMemo } from "react";
import { ConceptNode } from "../types";
import { Network, CheckCircle2, ChevronRight, Lock } from "lucide-react";
import { motion } from "motion/react";

interface DAGCanvasProps {
  nodes: ConceptNode[];
  selectedNodeId: string;
  onSelectNode: (id: string) => void;
  completedNodes: Record<string, boolean>;
  unlockedNodes: Record<string, boolean>;
}

export default function DAGCanvas({
  nodes,
  selectedNodeId,
  onSelectNode,
  completedNodes,
  unlockedNodes,
}: DAGCanvasProps) {
  // SVG size boundaries
  const width = 600;
  const height = 320;

  // Map coordinate range [-100, 100] to SVG canvas coordinates [40, width - 40]
  const scaleX = (x: number) => {
    const minCoord = -100;
    const maxCoord = 100;
    const padding = 60;
    return padding + ((x - minCoord) / (maxCoord - minCoord)) * (width - 2 * padding);
  };

  const scaleY = (y: number) => {
    const minCoord = -100;
    const maxCoord = 100;
    const padding = 40;
    return padding + ((y - minCoord) / (maxCoord - minCoord)) * (height - 2 * padding);
  };

  // Pre-calculate positions of all nodes
  const nodesWithPositions = useMemo(() => {
    return nodes.map((node) => ({
      ...node,
      px: scaleX(node.coordinates.x),
      py: scaleY(node.coordinates.y),
    }));
  }, [nodes]);

  // Find connections (arrows from dependency to dependent node)
  const links = useMemo(() => {
    const list: { from: typeof nodesWithPositions[0]; to: typeof nodesWithPositions[0]; id: string }[] = [];
    nodesWithPositions.forEach((node) => {
      node.dependencies.forEach((depId) => {
        const depNode = nodesWithPositions.find((n) => n.id === depId);
        if (depNode) {
          list.push({
            from: depNode,
            to: node,
            id: `${depNode.id}-${node.id}`,
          });
        }
      });
    });
    return list;
  }, [nodesWithPositions]);

  return (
    <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-6 backdrop-blur-md relative overflow-hidden shadow-2xl shadow-indigo-950/20">
      {/* Absolute grid lines simulating vector fields */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Network className="w-5 h-5 text-amber-500" />
          <h3 className="font-display font-medium text-lg text-amber-500 tracking-tight">
            A Malha de Grafeno (DAG de Conceitos)
          </h3>
        </div>
        <span className="font-mono text-xs text-slate-500 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-md">
          T ∈ ℝ^(N×M) · Det(Σ) ≠ 0
        </span>
      </div>

      <p className="text-sm text-slate-400 mb-6 font-sans">
        Os conceitos estão mapeados geometricamente. Siga as flechas de dependência em ordem lógica de assimilação para obter domínio completo.
      </p>

      {/* Interactive SVG Canvas */}
      <div className="relative overflow-x-auto overflow-y-hidden pb-2" style={{ minWidth: "100%" }}>
        <div className="w-[600px] mx-auto bg-slate-950/90 border border-slate-900 rounded-lg p-2 relative shadow-inner">
          {/* Legend absolute bar */}
          <div className="absolute bottom-2 left-2 flex items-center gap-3 text-[10px] font-mono text-slate-400 bg-slate-900/80 px-2 py-1 rounded border border-slate-800/50 backdrop-blur-sm z-10">
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-600 block" /> Bloqueado
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500/20 border border-indigo-500 block" /> Disponível
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500 block" /> Atual
            </div>
            <div className="flex items-center gap-1 flex-nowrap">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500 block" /> Concluído
            </div>
          </div>

          <svg width={width} height={height} className="relative z-0 select-none">
            {/* Draw grid background lines inside SVG */}
            <defs>
              <pattern id="innerGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.5" opacity="0.4" />
              </pattern>
              <marker
                id="arrow"
                viewBox="0 0 10 10"
                refX="22"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#c2410c" opacity="0.7" />
              </marker>
              <marker
                id="arrow-unlocked"
                viewBox="0 0 10 10"
                refX="22"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#f59e0b" opacity="0.8" />
              </marker>
            </defs>
            <rect width="100%" height="100%" fill="url(#innerGrid)" />

            {/* Cartesian Axis indicator */}
            <line x1="40" y1={height / 2} x2={width - 40} y2={height / 2} stroke="#334155" strokeWidth="0.5" strokeDasharray="2,4" />
            <line x1={width / 2} y1="40" x2={width / 2} y2={height - 40} stroke="#334155" strokeWidth="0.5" strokeDasharray="2,4" />
            <text x={width - 55} y={height / 2 - 5} fill="#475569" className="font-mono text-[9px]">X (Espaço)</text>
            <text x={width / 2 + 5} y="50" fill="#475569" className="font-mono text-[9px]">Y (Tensão)</text>

            {/* Render Link Paths */}
            {links.map((link) => {
              const isUnlocked = unlockedNodes[link.to.id];
              const isSelectedPath = selectedNodeId === link.to.id || selectedNodeId === link.from.id;
              return (
                <g key={link.id}>
                  {/* Outer glow line if active */}
                  {isSelectedPath && isUnlocked && (
                    <line
                      x1={link.from.px}
                      y1={link.from.py}
                      x2={link.to.px}
                      y2={link.to.py}
                      stroke="#f59e0b"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      className="opacity-25"
                    />
                  )}
                  {/* Core connection line */}
                  <line
                    x1={link.from.px}
                    y1={link.from.py}
                    x2={link.to.px}
                    y2={link.to.py}
                    stroke={isUnlocked ? "#d97706" : "#334155"}
                    strokeWidth={isSelectedPath ? "1.5" : "1"}
                    strokeDasharray={isUnlocked ? "0" : "3,3"}
                    markerEnd={isUnlocked ? "url(#arrow-unlocked)" : "url(#arrow)"}
                    className="transition-all duration-300"
                  />
                </g>
              );
            })}

            {/* Render Nodes as SVG structures */}
            {nodesWithPositions.map((node) => {
              const isSelected = selectedNodeId === node.id;
              const isCompleted = completedNodes[node.id];
              const isUnlocked = unlockedNodes[node.id];

              // Base style classes
              let strokeColor = "#334155";
              let fillColor = "#0b1329";
              let textColor = "text-slate-400";
              let glowEffect = "";

              if (isCompleted) {
                strokeColor = "#10b981"; // Emerald
                fillColor = "#022c22";
                textColor = "text-emerald-400";
              } else if (isSelected) {
                strokeColor = "#f59e0b"; // Amber Gold
                fillColor = "#451a03";
                textColor = "text-amber-400 font-bold";
                glowEffect = "animate-pulse";
              } else if (isUnlocked) {
                strokeColor = "#6366f1"; // Indigo
                fillColor = "#1e1b4b";
                textColor = "text-indigo-300";
              }

              return (
                <g
                  key={node.id}
                  className={`cursor-pointer group`}
                  onClick={() => isUnlocked && onSelectNode(node.id)}
                >
                  {/* External visual rings for hovering and unlocked state */}
                  {isUnlocked && (
                    <circle
                      cx={node.px}
                      cy={node.py}
                      r={isSelected ? "20" : "16"}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth="1"
                      strokeDasharray="4,2"
                      className="opacity-40 group-hover:rotate-180 transition-all duration-1000 origin-center"
                      style={{ transformOrigin: `${node.px}px ${node.py}px` }}
                    />
                  )}

                  {/* Node solid shape */}
                  <circle
                    cx={node.px}
                    cy={node.py}
                    r={isSelected ? "16" : "13"}
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth={isSelected ? "2.5" : "1.5"}
                    className={`transition-all duration-300 ${glowEffect} group-hover:scale-110`}
                  />

                  {/* Render scientific glyph or symbol */}
                  <text
                    x={node.px}
                    y={node.py + 4}
                    textAnchor="middle"
                    className="font-mono text-[10px] select-none fill-slate-200 pointer-events-none font-semibold"
                  >
                    {isUnlocked ? node.symbol : "?"}
                  </text>

                  {/* Render Node Name badge below */}
                  <foreignObject
                    x={node.px - 60}
                    y={node.py + (isSelected ? 20 : 17)}
                    width="120"
                    height="50"
                    className="pointer-events-none"
                  >
                    <div className="text-center px-1">
                      <p
                        className={`text-[10px] leading-tight tracking-tight line-clamp-2 ${textColor} ${
                          isSelected ? "font-semibold" : "font-medium opacity-80"
                        } group-hover:opacity-100`}
                      >
                        {node.name}
                      </p>
                      {isCompleted && (
                        <span className="inline-block text-[8px] bg-emerald-950 text-emerald-400 border border-emerald-800/50 px-1 rounded-sm mt-0.5">
                          ✓ Concluído
                        </span>
                      )}
                      {!isUnlocked && (
                        <div className="flex items-center justify-center gap-0.5 text-slate-600 text-[8px] mt-0.5">
                          <Lock className="w-2 h-2" /> Bloqueado
                        </div>
                      )}
                    </div>
                  </foreignObject>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 items-center justify-between text-xs text-slate-500 border-t border-slate-900 pt-3">
        <span>Matriz Topológica Resolvida</span>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-emerald-500">
            <CheckCircle2 className="w-3.5 h-3.5" /> Conclua lições para desbloquear as próximas
          </span>
        </div>
      </div>
    </div>
  );
}
