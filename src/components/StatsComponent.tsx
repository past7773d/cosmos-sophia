import React, { useState, useEffect } from "react";
import { Clock, Award, ShieldAlert, BrainCircuit, Activity } from "lucide-react";
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from "recharts";
import { ConceptNode } from "../types";

interface StatsComponentProps {
  completedCount: number;
  totalCount: number;
  completedNodes: Record<string, boolean>;
  nodes: ConceptNode[];
}

export default function StatsComponent({
  completedCount,
  totalCount,
  completedNodes,
  nodes,
}: StatsComponentProps) {
  // Real-time tracking of session seconds
  const [secondsSpent, setSecondsSpent] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cosmos_sophia_time_spent");
      return saved ? parseInt(saved, 10) : 0;
    }
    return 0;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsSpent((prev) => {
        const next = prev + 1;
        if (typeof window !== "undefined") {
          localStorage.setItem("cosmos_sophia_time_spent", String(next));
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Calculate Average Complexity of completed concepts
  // We can assign complexity to nodes based on their index or position in the graph.
  // Let's say: c1=1, c2=2, c3=3, c4=4, c5=5, c6=5 etc., or based on its dependencies count + 1.
  const averageComplexity = React.useMemo(() => {
    const completedNodeIds = Object.keys(completedNodes).filter((id) => completedNodes[id]);
    if (completedNodeIds.length === 0) return 0;

    let totalComplexity = 0;
    completedNodeIds.forEach((id) => {
      const node = nodes.find((n) => n.id === id);
      if (node) {
        // Complexity score: 1 base + number of dependencies * 1.5, max 5.0
        const score = Math.min(5.0, 1.0 + (node.dependencies?.length || 0) * 1.5);
        totalComplexity += score;
      } else {
        totalComplexity += 2.0; // fallback
      }
    });

    return parseFloat((totalComplexity / completedNodeIds.length).toFixed(1));
  }, [completedNodes, nodes]);

  // Format time elegantly: HH:MM:SS
  const formatTime = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return [
      hrs > 0 ? String(hrs).padStart(2, "0") : null,
      String(mins).padStart(2, "0"),
      String(secs).padStart(2, "0"),
    ]
      .filter(Boolean)
      .join(":");
  };

  // Completion percentage
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Data for RadialBarChart
  // We want to map completionPercentage (max 100) and averageComplexity scaled to percentage (complexity 5.0 = 100%)
  const chartData = [
    {
      name: "Complexidade Média",
      value: (averageComplexity / 5.0) * 100,
      actualVal: `${averageComplexity}/5.0`,
      fill: "#6366f1", // Indigo
    },
    {
      name: "Domínio Geral",
      value: completionPercentage,
      actualVal: `${completionPercentage}%`,
      fill: "#f59e0b", // Amber
    },
  ];

  return (
    <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-5 backdrop-blur-md shadow-lg">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-900">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-indigo-400" />
          <h3 className="font-display font-medium text-slate-200 text-sm tracking-wide">
            Métricas de Sapiência
          </h3>
        </div>
        <span className="text-[10px] font-mono text-slate-500 uppercase">Resolução de Tensores</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        {/* Radial Bar Chart from Recharts */}
        <div className="flex items-center justify-center relative h-[140px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="50%"
              outerRadius="90%"
              barSize={8}
              data={chartData}
              startAngle={180}
              endAngle={-180}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
              <RadialBar
                background={{ fill: "#1e293b" }}
                dataKey="value"
                cornerRadius={4}
              />
            </RadialBarChart>
          </ResponsiveContainer>

          {/* Absolute center label inside the radial loop */}
          <div className="absolute text-center flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] font-mono text-slate-500 uppercase leading-none">Domínio</span>
            <span className="text-lg font-bold font-display text-amber-400 mt-0.5">{completionPercentage}%</span>
          </div>
        </div>

        {/* Numeric stats list */}
        <div className="space-y-3.5">
          {/* Time spent metric */}
          <div className="bg-slate-950/80 border border-slate-900/60 rounded-lg p-2.5 flex items-center gap-3">
            <div className="p-1.5 rounded bg-indigo-500/10 text-indigo-400">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[9px] font-mono text-slate-500 uppercase block leading-none">Tempo de Foco</span>
              <span className="text-sm font-semibold font-mono text-slate-200 mt-1 block">
                {formatTime(secondsSpent)}
              </span>
            </div>
          </div>

          {/* Average Complexity metric */}
          <div className="bg-slate-950/80 border border-slate-900/60 rounded-lg p-2.5 flex items-center gap-3">
            <div className="p-1.5 rounded bg-amber-500/10 text-amber-400">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[9px] font-mono text-slate-500 uppercase block leading-none">Complexidade Média</span>
              <span className="text-sm font-semibold font-mono text-slate-200 mt-1 block">
                {averageComplexity} <span className="text-slate-500 text-xs">/ 5.0</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3.5 pt-2 border-t border-slate-900 flex justify-between text-[10px] font-mono text-slate-500">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" /> Comp. Média
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> Domínio Geral
        </span>
      </div>
    </div>
  );
}
