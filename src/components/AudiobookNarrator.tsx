import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, HelpCircle } from "lucide-react";

interface AudiobookNarratorProps {
  narration: {
    text: string;
    estimatedDuration: number;
  };
  title: string;
}

export default function AudiobookNarrator({ narration, title }: AudiobookNarratorProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [progress, setProgress] = useState(0); // 0 to 100
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [activeSegmentIndex, setActiveSegmentIndex] = useState<number | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Parse dramatic directions from narration (e.g., "[Pausa reflexiva] Bem-vindo...")
  const segments = React.useMemo(() => {
    const rawText = narration.text;
    // Regex to match brackets and text: e.g., "[Direção] Texto aqui"
    const regex = /(\[[^\]]+\])/g;
    const parts = rawText.split(regex);
    const result: { type: "direction" | "text"; content: string }[] = [];

    parts.forEach((part) => {
      if (!part.trim()) return;
      if (part.startsWith("[") && part.endsWith("]")) {
        result.push({ type: "direction", content: part });
      } else {
        result.push({ type: "text", content: part });
      }
    });

    return result;
  }, [narration.text]);

  const cleanText = React.useMemo(() => {
    // text without [bracket instructions]
    return narration.text.replace(/\[[^\]]+\]/g, "");
  }, [narration.text]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      setSpeechSupported(true);
    }
    return () => {
      stopAudio();
    };
  }, [narration.text]);

  // Clean-up on unmount or slide change
  useEffect(() => {
    stopAudio();
  }, [narration.text]);

  // Handle play/pause toggle
  const togglePlay = () => {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  };

  const playAudio = () => {
    setIsPlaying(true);

    if (speechSupported && !isMuted) {
      // Use Web Speech Synthesis
      window.speechSynthesis.cancel(); // Reset any ongoing speech
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = "pt-BR";
      utterance.rate = playbackRate;

      // Try to find a nice male/female Portuguese voice if possible
      const voices = window.speechSynthesis.getVoices();
      const ptVoice = voices.find(
        (v) => v.lang.startsWith("pt") && (v.name.includes("Google") || v.name.includes("Natural"))
      ) || voices.find((v) => v.lang.startsWith("pt"));
      if (ptVoice) {
        utterance.voice = ptVoice;
      }

      utterance.onend = () => {
        setIsPlaying(false);
        setProgress(100);
        setCurrentTime(narration.estimatedDuration);
      };

      utterance.onerror = () => {
        // Fallback to simulation if speech engine fails
        startSimulation();
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);

      // We still update progress bar based on time
      startProgressTracker();
    } else {
      // Simulation mode
      startSimulation();
    }
  };

  const startProgressTracker = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    const start = Date.now() - (currentTime * 1000) / playbackRate;

    timerRef.current = setInterval(() => {
      const elapsed = ((Date.now() - start) * playbackRate) / 1000;
      if (elapsed >= narration.estimatedDuration) {
        setIsPlaying(false);
        setCurrentTime(narration.estimatedDuration);
        setProgress(100);
        if (timerRef.current) clearInterval(timerRef.current);
      } else {
        setCurrentTime(elapsed);
        setProgress((elapsed / narration.estimatedDuration) * 10000 / 100);

        // Highlight text based on fraction elapsed
        const currentSegment = Math.floor((elapsed / narration.estimatedDuration) * segments.length);
        setActiveSegmentIndex(currentSegment < segments.length ? currentSegment : segments.length - 1);
      }
    }, 100);
  };

  const startSimulation = () => {
    startProgressTracker();
  };

  const pauseAudio = () => {
    setIsPlaying(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (speechSupported) {
      window.speechSynthesis.pause();
    }
  };

  const stopAudio = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    setProgress(0);
    setActiveSegmentIndex(null);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (speechSupported) {
      window.speechSynthesis.cancel();
    }
  };

  const handleRateChange = (rate: number) => {
    setPlaybackRate(rate);
    if (isPlaying) {
      // Restart speech with new rate to apply seamlessly
      pauseAudio();
      setTimeout(() => {
        playAudio();
      }, 50);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div id="audiobook-section" className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-6 backdrop-blur-md relative overflow-hidden">
      {/* Decorative gradient blur */}
      <div className="absolute -top-16 -right-16 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
          <h3 className="font-display font-medium text-slate-200 text-sm tracking-wide">
            AUDIOLIVRO: {title}
          </h3>
        </div>
        <div className="flex items-center gap-3">
          {/* Rate Selector */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded px-1 py-0.5">
            {[1.0, 1.25, 1.5].map((rate) => (
              <button
                key={rate}
                id={`rate-${rate}`}
                onClick={() => handleRateChange(rate)}
                className={`text-[10px] font-mono px-2 py-0.5 rounded transition ${
                  playbackRate === rate
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>

          <button
            id="toggle-mute"
            onClick={() => setIsMuted(!isMuted)}
            className="text-slate-400 hover:text-amber-400 p-1 rounded hover:bg-slate-800 transition"
            title={isMuted ? "Ativar Narração de Voz" : "Modo Silencioso (Apenas Legendas)"}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Narration Script Text Box */}
      <div className="bg-slate-950/80 border border-slate-950 rounded-lg p-5 max-h-[180px] overflow-y-auto mb-6 relative">
        <div className="space-y-2 text-sm leading-relaxed font-sans text-slate-300">
          {segments.map((seg, idx) => {
            if (seg.type === "direction") {
              return (
                <span
                  key={idx}
                  className="inline-block text-[11px] font-mono font-medium text-indigo-400 bg-indigo-950/40 border border-indigo-900/30 px-1.5 py-0.5 rounded mr-1.5"
                >
                  {seg.content}
                </span>
              );
            } else {
              const isActive = activeSegmentIndex !== null && idx >= activeSegmentIndex - 1 && idx <= activeSegmentIndex + 1;
              return (
                <span
                  key={idx}
                  className={`transition-all duration-300 ${
                    isActive ? "text-amber-200 font-medium drop-shadow-[0_0_1px_rgba(251,191,36,0.3)] bg-amber-500/5 px-0.5 rounded" : "opacity-80"
                  }`}
                >
                  {seg.content}
                </span>
              );
            }
          })}
        </div>
      </div>

      {/* Audio Controller Bar */}
      <div className="flex flex-col gap-3">
        {/* Progress slide */}
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(narration.estimatedDuration)}</span>
        </div>

        <div className="relative w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-amber-500 transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Playback controls */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <button
              id="narrator-play-pause"
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-950/40 hover:scale-105 active:scale-95 transition"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-slate-950" /> : <Play className="w-5 h-5 fill-slate-950 translate-x-0.5" />}
            </button>

            <button
              id="narrator-reset"
              onClick={stopAudio}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            {isPlaying ? "Executando síntese cósmica..." : "Aguardando transmissão"}
          </div>
        </div>
      </div>
    </div>
  );
}
