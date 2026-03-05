"use client";

import { useState, useEffect } from "react";
import {
  Smartphone,
  Battery,
  Home,
  BarChart2,
  Brain,
  Trophy,
  Twitter,
  Youtube,
  Sparkles,
  ArrowRight,
  Timer,
  Zap,
  Wind,
  Activity,
  Star,
  Instagram,
  Play,
  CheckCircle,
  Pause,
  X,
  ChevronRight,
  Pencil,
  Lock,
  Unlock,
  TrendingDown,
  Award,
} from "lucide-react";

/* ─── types ───────────────────────────────────────── */
type Screen = "home" | "stats" | "train" | "rewards";

/* ─── Status Bar ──────────────────────────────────── */
function StatusBar() {
  const [time, setTime] = useState("9:41");
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(`${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`);
    };
    update();
    const id = setInterval(update, 10000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="flex items-center justify-between px-4 h-7 shrink-0" style={{ background: "#0F172A" }}>
      <span className="text-xs font-semibold" style={{ color: "#E2E8F0" }}>{time}</span>
      <Battery size={14} style={{ color: "#E2E8F0" }} />
    </div>
  );
}

/* ─── Bottom Nav ──────────────────────────────────── */
function BottomNav({ active, onNav }: { active: Screen; onNav: (s: Screen) => void }) {
  const items: { id: Screen; icon: React.ElementType; label: string }[] = [
    { id: "home", icon: Home, label: "Home" },
    { id: "stats", icon: BarChart2, label: "Stats" },
    { id: "train", icon: Brain, label: "Train" },
    { id: "rewards", icon: Trophy, label: "Rewards" },
  ];
  return (
    <div className="flex items-center justify-around px-2 shrink-0" style={{ background: "#1E293B", height: 58, borderTop: "1px solid #334155" }}>
      {items.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          onClick={() => onNav(id)}
          className="flex flex-col items-center justify-center gap-1 transition-all active:scale-90"
          style={{ width: 52, height: 44, background: "none", border: "none", cursor: "pointer" }}
        >
          {active === id && (
            <div className="absolute rounded-full" style={{ width: 4, height: 4, background: "#7C3AED", marginTop: -18 }} />
          )}
          <Icon size={20} style={{ color: active === id ? "#7C3AED" : "#475569", transition: "color 0.2s" }} />
          <span className="text-[9px] transition-colors" style={{ color: active === id ? "#7C3AED" : "#475569", fontWeight: active === id ? 600 : 400 }}>
            {label}
          </span>
        </button>
      ))}
    </div>
  );
}

/* ─── Screen 1: Home Dashboard ─────────────────────── */
function HomeDashboard({ onNav }: { onNav: (s: Screen) => void }) {
  const [ytBlocked, setYtBlocked] = useState(true);
  const [editLimits, setEditLimits] = useState(false);
  const [suggestionDismissed, setSuggestionDismissed] = useState(false);
  const [twitterLimit, setTwitterLimit] = useState(87);

  return (
    <div className="flex flex-col flex-1 overflow-y-auto" style={{ background: "#0F172A" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4" style={{ height: 60 }}>
        <div className="flex flex-col gap-0.5">
          <span className="text-[11px]" style={{ color: "#94A3B8" }}>Good Morning</span>
          <span className="text-base font-bold" style={{ color: "#F1F5F9" }}>Jane Smith</span>
        </div>
        <button
          onClick={() => onNav("rewards")}
          className="flex items-center justify-center rounded-full text-xs font-bold text-white transition-transform active:scale-90"
          style={{ width: 36, height: 36, background: "#7C3AED" }}
        >
          JS
        </button>
      </div>

      {/* Usage Card */}
      <div className="mx-3 rounded-xl p-3.5 flex flex-col gap-2" style={{ background: "#1E293B" }}>
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold" style={{ color: "#94A3B8" }}>Today's Screen Time</span>
          <span className="text-[9px] font-bold text-white px-2 py-0.5 rounded-full" style={{ background: "#DC2626" }}>Over limit</span>
        </div>
        <span className="text-3xl font-bold" style={{ color: "#F1F5F9" }}>3h 42m</span>
        <div className="rounded-full h-1.5 w-full" style={{ background: "#334155" }}>
          <div className="rounded-full h-1.5 transition-all" style={{ width: "74%", background: "#DC2626" }} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[9px]" style={{ color: "#64748B" }}>0h</span>
          <span className="text-[9px]" style={{ color: "#64748B" }}>Goal: 3h 00m</span>
          <span className="text-[9px]" style={{ color: "#64748B" }}>5h max</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="flex gap-2 mx-3 mt-2" style={{ height: 72 }}>
        {[
          { value: "7", label: "Day Streak", color: "#F472B6", screen: "rewards" as Screen },
          { value: "42", label: "XP Today", color: "#34D399", screen: "rewards" as Screen },
          { value: "#4", label: "Leaderboard", color: "#FBBF24", screen: "rewards" as Screen },
        ].map(({ value, label, color, screen }) => (
          <button
            key={label}
            onClick={() => onNav(screen)}
            className="flex-1 flex flex-col items-center justify-center gap-1 rounded-xl transition-transform active:scale-95"
            style={{ background: "#1E293B", border: "none", cursor: "pointer" }}
          >
            <span className="text-lg font-bold" style={{ color }}>{value}</span>
            <span className="text-[9px]" style={{ color: "#64748B" }}>{label}</span>
          </button>
        ))}
      </div>

      {/* App Limits */}
      <div className="flex items-center justify-between px-4 mt-2 py-1.5">
        <span className="text-xs font-bold" style={{ color: "#F1F5F9" }}>App Limits</span>
        <button
          onClick={() => setEditLimits(!editLimits)}
          className="flex items-center gap-1 text-[11px] transition-opacity active:opacity-60"
          style={{ color: "#7C3AED", background: "none", border: "none", cursor: "pointer" }}
        >
          <Pencil size={10} />
          {editLimits ? "Done" : "Edit"}
        </button>
      </div>

      {/* Twitter row */}
      <div className="flex items-center gap-2.5 px-4" style={{ height: 44 }}>
        <div className="flex items-center justify-center rounded-lg shrink-0" style={{ width: 28, height: 28, background: "#1D4ED8" }}>
          <Twitter size={14} className="text-white" />
        </div>
        <div className="flex flex-col gap-1 flex-1">
          <span className="text-[11px] font-semibold" style={{ color: "#CBD5E1" }}>Twitter / X</span>
          <div className="rounded h-1 cursor-pointer" style={{ background: "#334155" }} onClick={() => !editLimits || setTwitterLimit(Math.min(100, twitterLimit + 5))}>
            <div className="rounded h-1 transition-all" style={{ width: `${twitterLimit}%`, background: twitterLimit > 80 ? "#F59E0B" : "#34D399" }} />
          </div>
        </div>
        {editLimits ? (
          <div className="flex items-center gap-1">
            <button onClick={() => setTwitterLimit(Math.max(0, twitterLimit - 10))} className="text-[11px] font-bold px-1.5 py-0.5 rounded" style={{ background: "#334155", color: "#F1F5F9", border: "none", cursor: "pointer" }}>−</button>
            <button onClick={() => setTwitterLimit(Math.min(100, twitterLimit + 10))} className="text-[11px] font-bold px-1.5 py-0.5 rounded" style={{ background: "#334155", color: "#F1F5F9", border: "none", cursor: "pointer" }}>+</button>
          </div>
        ) : (
          <span className="text-[11px] font-bold" style={{ color: twitterLimit > 80 ? "#F59E0B" : "#34D399" }}>{twitterLimit}%</span>
        )}
      </div>

      {/* YouTube row */}
      <div className="flex items-center gap-2.5 px-4" style={{ height: 44 }}>
        <div className="flex items-center justify-center rounded-lg shrink-0" style={{ width: 28, height: 28, background: "#DC2626" }}>
          <Youtube size={14} className="text-white" />
        </div>
        <div className="flex flex-col gap-1 flex-1">
          <span className="text-[11px] font-semibold" style={{ color: "#CBD5E1" }}>YouTube</span>
          <div className="rounded h-1" style={{ background: "#334155" }}>
            <div className="rounded h-1" style={{ width: ytBlocked ? "100%" : "55%", background: ytBlocked ? "#EF4444" : "#34D399", transition: "all 0.3s" }} />
          </div>
        </div>
        <button
          onClick={() => setYtBlocked(!ytBlocked)}
          className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full transition-all active:scale-90"
          style={{ background: ytBlocked ? "#7F1D1D" : "#14532D", color: ytBlocked ? "#EF4444" : "#34D399", border: "none", cursor: "pointer" }}
        >
          {ytBlocked ? <><Lock size={8} /> BLOCKED</> : <><Unlock size={8} /> OPEN</>}
        </button>
      </div>

      {/* AI Suggestion */}
      {!suggestionDismissed && (
        <div className="mx-3 mt-2 flex items-center gap-2.5 rounded-xl p-2.5" style={{ background: "#1E293B", border: "1px solid #7C3AED" }}>
          <div className="flex items-center justify-center rounded-full shrink-0" style={{ width: 28, height: 28, background: "#7C3AED" }}>
            <Sparkles size={14} className="text-white" />
          </div>
          <div className="flex flex-col gap-0.5 flex-1">
            <span className="text-[9px] font-bold" style={{ color: "#A78BFA" }}>AI Suggestion</span>
            <span className="text-[11px] font-semibold" style={{ color: "#E2E8F0" }}>Try 10 min meditation now</span>
          </div>
          <button
            onClick={() => onNav("train")}
            className="flex items-center justify-center rounded-full shrink-0 transition-transform active:scale-90"
            style={{ width: 32, height: 32, background: "#7C3AED", border: "none", cursor: "pointer" }}
          >
            <ArrowRight size={14} className="text-white" />
          </button>
          <button onClick={() => setSuggestionDismissed(true)} style={{ background: "none", border: "none", cursor: "pointer", color: "#475569" }}>
            <X size={12} />
          </button>
        </div>
      )}

      <div className="pb-4" />
    </div>
  );
}

/* ─── Screen 2: Usage Analytics ──────────────────── */
const barData = [
  { day: "M", height: 58, color: "#475569" },
  { day: "T", height: 72, color: "#475569" },
  { day: "W", height: 90, color: "#EF4444" },
  { day: "T", height: 65, color: "#475569" },
  { day: "F", height: 80, color: "#F59E0B" },
  { day: "S", height: 48, color: "#34D399" },
  { day: "S", height: 52, color: "#34D399" },
];

function UsageAnalytics({ onNav }: { onNav: (s: Screen) => void }) {
  const [period, setPeriod] = useState<"week" | "month">("week");
  const [selectedBar, setSelectedBar] = useState<number | null>(null);

  const monthData = [
    { day: "W1", height: 68, color: "#475569" },
    { day: "W2", height: 75, color: "#F59E0B" },
    { day: "W3", height: 52, color: "#34D399" },
    { day: "W4", height: 60, color: "#34D399" },
  ];

  const data = period === "week" ? barData : monthData;

  return (
    <div className="flex flex-col flex-1 overflow-y-auto" style={{ background: "#0F172A" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4" style={{ height: 50 }}>
        <span className="text-base font-bold" style={{ color: "#F1F5F9" }}>Usage Analytics</span>
        <div className="flex rounded-md overflow-hidden" style={{ border: "1px solid #334155" }}>
          {(["week", "month"] as const).map((p) => (
            <button
              key={p}
              onClick={() => { setPeriod(p); setSelectedBar(null); }}
              className="px-2.5 py-1.5 text-[10px] font-semibold transition-all"
              style={{ background: period === p ? "#7C3AED" : "#1E293B", color: period === p ? "#fff" : "#7D8590", border: "none", cursor: "pointer" }}
            >
              {p === "week" ? "This Week" : "This Month"}
            </button>
          ))}
        </div>
      </div>

      {/* Bar Chart */}
      <div className="mx-3 rounded-xl p-3.5 flex flex-col gap-3" style={{ background: "#1E293B", height: 160 }}>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold" style={{ color: "#94A3B8" }}>
            Daily Screen Time {selectedBar !== null ? `— ${data[selectedBar].day}: ${Math.round(data[selectedBar].height / 18 * 10) / 10}h` : "(hours)"}
          </span>
        </div>
        <div className="flex items-end justify-between flex-1 gap-1.5">
          {data.map(({ day, height, color }, i) => (
            <button
              key={i}
              onClick={() => setSelectedBar(selectedBar === i ? null : i)}
              className="flex flex-col items-center gap-1 flex-1 justify-end h-full transition-all"
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              <div
                className="rounded-t w-[18px] transition-all"
                style={{
                  height: selectedBar === i ? height + 6 : height,
                  background: selectedBar === i ? "#A78BFA" : color,
                  boxShadow: selectedBar === i ? "0 0 8px #7C3AED88" : "none",
                }}
              />
              <span className="text-[8px]" style={{ color: selectedBar === i ? "#A78BFA" : "#64748B" }}>{day}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div className="flex gap-2 mx-3 mt-2" style={{ height: 56 }}>
        {[
          { value: "3h 42m", label: "Avg / Day", color: "#EF4444" },
          { value: "-18%", label: "vs Last Week", color: "#34D399" },
          { value: "2h 30m", label: "Goal", color: "#7C3AED" },
        ].map(({ value, label, color }) => (
          <div key={label} className="flex-1 flex flex-col items-center justify-center gap-0.5 rounded-lg" style={{ background: "#1E293B" }}>
            <span className="text-sm font-bold" style={{ color }}>{value}</span>
            <span className="text-[9px]" style={{ color: "#64748B" }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Top Apps */}
      <div className="flex items-center justify-between px-3.5 mt-2 py-1.5">
        <span className="text-xs font-bold" style={{ color: "#F1F5F9" }}>Top Apps This Week</span>
      </div>

      {[
        { icon: Twitter, iconBg: "#1D4ED8", name: "Twitter / X", time: "1h 22m", pct: 68 },
        { icon: Youtube, iconBg: "#DC2626", name: "YouTube", time: "58m", pct: 45 },
        { icon: Instagram, iconBg: "#7C3AED", name: "Instagram", time: "42m", pct: 33 },
      ].map(({ icon: Icon, iconBg, name, time, pct }) => (
        <div key={name} className="flex items-center gap-2.5 px-3.5" style={{ height: 44 }}>
          <div className="flex items-center justify-center rounded-md shrink-0" style={{ width: 24, height: 24, background: iconBg }}>
            <Icon size={12} className="text-white" />
          </div>
          <div className="flex flex-col gap-0.5 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold" style={{ color: "#CBD5E1" }}>{name}</span>
              <span className="text-[10px]" style={{ color: "#94A3B8" }}>{time}</span>
            </div>
            <div className="rounded h-[3px] w-full" style={{ background: "#334155" }}>
              <div className="rounded h-[3px]" style={{ width: `${pct}%`, background: "#7C3AED" }} />
            </div>
          </div>
        </div>
      ))}

      {/* Set Goal CTA */}
      <button
        onClick={() => onNav("home")}
        className="mx-3 mt-3 flex items-center justify-between rounded-xl p-3 transition-all active:scale-95"
        style={{ background: "#1E293B", border: "1px solid #334155", cursor: "pointer" }}
      >
        <div className="flex items-center gap-2">
          <TrendingDown size={16} style={{ color: "#34D399" }} />
          <div className="text-left">
            <div className="text-[11px] font-bold" style={{ color: "#F1F5F9" }}>You saved 45min this week</div>
            <div className="text-[9px]" style={{ color: "#64748B" }}>Tap to adjust your goal</div>
          </div>
        </div>
        <ChevronRight size={14} style={{ color: "#475569" }} />
      </button>

      <div className="pb-4" />
    </div>
  );
}

/* ─── Session Modal ───────────────────────────────── */
function SessionModal({ title, duration, onClose }: { title: string; duration: number; onClose: () => void }) {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setElapsed((e) => {
      if (e >= duration) { setRunning(false); return e; }
      return e + 1;
    }), 1000);
    return () => clearInterval(id);
  }, [running, duration]);

  const pct = (elapsed / duration) * 100;
  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-50" style={{ background: "rgba(15,23,42,0.95)" }}>
      <div className="flex flex-col items-center gap-4 px-6 w-full">
        <div className="flex items-center justify-center rounded-full" style={{ width: 64, height: 64, background: "linear-gradient(135deg, #059669, #0891B2)" }}>
          <Wind size={28} className="text-white" />
        </div>
        <div className="text-center">
          <div className="text-sm font-bold" style={{ color: "#F1F5F9" }}>{title}</div>
          <div className="text-[11px] mt-0.5" style={{ color: "#94A3B8" }}>Focus on your breath</div>
        </div>

        {/* Radial progress */}
        <div className="relative flex items-center justify-center" style={{ width: 120, height: 120 }}>
          <svg width="120" height="120" style={{ position: "absolute", transform: "rotate(-90deg)" }}>
            <circle cx="60" cy="60" r="52" fill="none" stroke="#334155" strokeWidth="6" />
            <circle
              cx="60" cy="60" r="52" fill="none"
              stroke={elapsed >= duration ? "#34D399" : "#7C3AED"}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 52}`}
              strokeDashoffset={`${2 * Math.PI * 52 * (1 - pct / 100)}`}
              style={{ transition: "stroke-dashoffset 1s linear, stroke 0.5s" }}
            />
          </svg>
          <div className="text-center">
            {elapsed >= duration ? (
              <CheckCircle size={28} style={{ color: "#34D399" }} />
            ) : (
              <>
                <div className="text-xl font-bold" style={{ color: "#F1F5F9" }}>
                  {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
                </div>
                <div className="text-[9px]" style={{ color: "#64748B" }}>elapsed</div>
              </>
            )}
          </div>
        </div>

        {elapsed >= duration ? (
          <div className="text-center">
            <div className="text-sm font-bold" style={{ color: "#34D399" }}>Session Complete!</div>
            <div className="text-[11px] mt-1" style={{ color: "#94A3B8" }}>+25 XP earned</div>
          </div>
        ) : (
          <div className="text-[11px]" style={{ color: "#94A3B8" }}>
            {Math.ceil((duration - elapsed) / 60)} min remaining
          </div>
        )}

        <div className="flex gap-3 w-full">
          <button
            onClick={() => setRunning(!running)}
            className="flex-1 flex items-center justify-center gap-2 rounded-full py-2.5 text-[11px] font-semibold transition-all active:scale-95"
            style={{ background: "#1E293B", color: "#F1F5F9", border: "1px solid #334155", cursor: "pointer" }}
          >
            {running ? <><Pause size={12} /> Pause</> : <><Play size={12} /> Resume</>}
          </button>
          <button
            onClick={onClose}
            className="flex-1 flex items-center justify-center gap-2 rounded-full py-2.5 text-[11px] font-semibold transition-all active:scale-95"
            style={{ background: elapsed >= duration ? "#059669" : "#7F1D1D", color: "#fff", border: "none", cursor: "pointer" }}
          >
            <X size={12} /> {elapsed >= duration ? "Done" : "End"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Screen 3: Mental Training ──────────────────── */
const sessions = [
  { icon: Wind, label: "Morning Clarity Meditation", category: "Meditation", duration: 20, color: "#0891B2", bg: "linear-gradient(135deg, #059669 0%, #0891B2 100%)", level: "Beginner" },
  { icon: Brain, label: "Deep Focus Block", category: "Focus", duration: 15, color: "#7C3AED", bg: "linear-gradient(135deg, #4C1D95 0%, #7C3AED 100%)", level: "Intermediate" },
  { icon: Wind, label: "Box Breathing", category: "Breathe", duration: 10, color: "#0891B2", bg: "linear-gradient(135deg, #0891B2 0%, #06B6D4 100%)", level: "Beginner" },
  { icon: Star, label: "Memory Palace", category: "Memory", duration: 25, color: "#F59E0B", bg: "linear-gradient(135deg, #B45309 0%, #F59E0B 100%)", level: "Advanced" },
];

function MentalTraining() {
  const [activeSession, setActiveSession] = useState<(typeof sessions)[0] | null>(null);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [expanded, setExpanded] = useState(false);

  const handleClose = () => {
    if (activeSession) setCompletedIds((p) => [...p, activeSession.label]);
    setActiveSession(null);
  };

  const xp = completedIds.length * 25;
  const score = 342 + xp;

  return (
    <div className="relative flex flex-col flex-1 overflow-hidden" style={{ background: "#0F172A" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 shrink-0" style={{ height: 50 }}>
        <span className="text-base font-bold" style={{ color: "#F1F5F9" }}>Mental Training</span>
        <div className="flex items-center gap-1 rounded-md px-2.5 py-1.5" style={{ background: "#1E293B" }}>
          <Zap size={10} style={{ color: "#FBBF24" }} />
          <span className="text-[10px] font-semibold" style={{ color: "#FBBF24" }}>7 day streak</span>
        </div>
      </div>

      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* Recommendation chip */}
        <div className="mx-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg" style={{ background: "#1E293B" }}>
          <Sparkles size={11} style={{ color: "#A78BFA" }} />
          <span className="text-[10px] font-medium" style={{ color: "#94A3B8" }}>Recommended for you</span>
        </div>

        {/* Featured session */}
        <button
          onClick={() => setActiveSession(sessions[0])}
          className="mx-3 mt-2 rounded-xl p-3.5 flex flex-col gap-2.5 text-left transition-all active:scale-95 active:opacity-90"
          style={{ background: sessions[0].bg, border: "none", cursor: "pointer" }}
        >
          <div className="flex items-center gap-1.5">
            <Wind size={12} className="text-white opacity-80" />
            <span className="text-[9px] font-bold text-white opacity-80 tracking-wide uppercase">{sessions[0].category}</span>
          </div>
          <span className="text-sm font-bold text-white leading-tight">Morning Clarity<br />Meditation</span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1"><Timer size={10} className="text-white opacity-70" /><span className="text-[10px] text-white opacity-70">{sessions[0].duration} min</span></div>
            <div className="flex items-center gap-1"><Activity size={10} className="text-white opacity-70" /><span className="text-[10px] text-white opacity-70">{sessions[0].level}</span></div>
          </div>
          <div className="flex items-center justify-center gap-1.5 rounded-full py-2" style={{ background: "rgba(255,255,255,0.9)" }}>
            <Play size={10} style={{ color: "#059669" }} />
            <span className="text-[11px] font-semibold" style={{ color: "#059669" }}>Start Session</span>
          </div>
        </button>

        {/* More Trainings */}
        <div className="flex items-center justify-between px-3.5 mt-2 py-1">
          <span className="text-xs font-bold" style={{ color: "#F1F5F9" }}>More Trainings</span>
          <button onClick={() => setExpanded(!expanded)} className="text-[10px] transition-colors" style={{ color: "#7C3AED", background: "none", border: "none", cursor: "pointer" }}>
            {expanded ? "Show less" : "See all"}
          </button>
        </div>

        {/* Training grid */}
        <div className="flex gap-2 px-3.5">
          {[
            { icon: Wind, label: "Breathe", color: "#0891B2", bg: "#0E2A3A", session: sessions[2] },
            { icon: Brain, label: "Focus", color: "#7C3AED", bg: "#1E1040", session: sessions[1] },
            { icon: Star, label: "Memory", color: "#F59E0B", bg: "#2A1E00", session: sessions[3] },
          ].map(({ icon: Icon, label, color, bg, session }) => (
            <button
              key={label}
              onClick={() => setActiveSession(session)}
              className="flex flex-col items-center justify-center gap-1 rounded-xl flex-1 transition-all active:scale-90"
              style={{ height: 64, background: bg, border: `1px solid ${color}33`, cursor: "pointer" }}
            >
              <Icon size={18} style={{ color }} />
              <span className="text-[10px] font-semibold" style={{ color }}>{label}</span>
            </button>
          ))}
        </div>

        {/* Expanded sessions */}
        {expanded && (
          <div className="flex flex-col gap-2 px-3.5 mt-2">
            {sessions.slice(1).map((s) => {
              const done = completedIds.includes(s.label);
              return (
                <button
                  key={s.label}
                  onClick={() => setActiveSession(s)}
                  className="flex items-center gap-3 rounded-xl p-2.5 transition-all active:scale-95"
                  style={{ background: "#1E293B", border: done ? "1px solid #059669" : "1px solid #334155", cursor: "pointer" }}
                >
                  <div className="flex items-center justify-center rounded-full shrink-0" style={{ width: 36, height: 36, background: s.bg }}>
                    <s.icon size={16} className="text-white" />
                  </div>
                  <div className="flex flex-col items-start flex-1">
                    <span className="text-[11px] font-semibold" style={{ color: "#F1F5F9" }}>{s.label}</span>
                    <span className="text-[9px]" style={{ color: "#64748B" }}>{s.duration} min · {s.level}</span>
                  </div>
                  {done ? <CheckCircle size={14} style={{ color: "#34D399" }} /> : <Play size={12} style={{ color: "#7C3AED" }} />}
                </button>
              );
            })}
          </div>
        )}

        {/* XP Progress */}
        <div className="mx-3 mt-3 rounded-xl p-3" style={{ background: "#1E293B" }}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <CheckCircle size={13} style={{ color: "#34D399" }} />
              <span className="text-[11px] font-semibold" style={{ color: "#F1F5F9" }}>Training Score</span>
            </div>
            <span className="text-[10px] font-bold" style={{ color: "#34D399" }}>{score} / 500</span>
          </div>
          <div className="rounded-full h-2 w-full" style={{ background: "#334155" }}>
            <div className="rounded-full h-2 transition-all duration-700" style={{ width: `${Math.min(100, (score / 500) * 100)}%`, background: "linear-gradient(90deg, #059669, #34D399)" }} />
          </div>
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-[9px]" style={{ color: "#64748B" }}>Level: Bronze</span>
            <span className="text-[9px]" style={{ color: "#64748B" }}>{Math.max(0, 500 - score)} XP to Silver</span>
          </div>
        </div>

        {/* Completed badges */}
        {completedIds.length > 0 && (
          <div className="mx-3 mt-2 mb-3 flex flex-wrap gap-1.5">
            {completedIds.map((id) => (
              <div key={id} className="flex items-center gap-1 rounded-full px-2 py-0.5" style={{ background: "#1E293B", border: "1px solid #05966933" }}>
                <CheckCircle size={9} style={{ color: "#34D399" }} />
                <span className="text-[9px]" style={{ color: "#94A3B8" }}>{id.split(" ").slice(0, 2).join(" ")}</span>
              </div>
            ))}
          </div>
        )}

        <div className="pb-4" />
      </div>

      {/* Session overlay */}
      {activeSession && (
        <SessionModal
          title={activeSession.label}
          duration={activeSession.duration * 60}
          onClose={handleClose}
        />
      )}
    </div>
  );
}

/* ─── Screen 4: Rewards ───────────────────────────── */
function RewardsScreen() {
  const [claimed, setClaimed] = useState<string[]>([]);

  const badges = [
    { id: "streak7", icon: Zap, label: "7-Day Streak", desc: "Logged in 7 days in a row", color: "#FBBF24", unlocked: true },
    { id: "focus5", icon: Brain, label: "Focus Master", desc: "Completed 5 focus sessions", color: "#7C3AED", unlocked: true },
    { id: "detox", icon: TrendingDown, label: "Digital Detox", desc: "Stayed under goal 3 days", color: "#34D399", unlocked: true },
    { id: "legend", icon: Award, label: "Legend", desc: "Reach Gold tier", color: "#F59E0B", unlocked: false },
  ];

  return (
    <div className="flex flex-col flex-1 overflow-y-auto" style={{ background: "#0F172A" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4" style={{ height: 50 }}>
        <span className="text-base font-bold" style={{ color: "#F1F5F9" }}>Rewards</span>
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full" style={{ background: "#1E293B" }}>
          <Star size={11} style={{ color: "#FBBF24" }} />
          <span className="text-[11px] font-bold" style={{ color: "#FBBF24" }}>342 XP</span>
        </div>
      </div>

      {/* Rank card */}
      <div className="mx-3 rounded-xl p-4 flex flex-col gap-2" style={{ background: "linear-gradient(135deg, #1e293b 0%, #312e81 100%)", border: "1px solid #4338ca" }}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: "#A5B4FC" }}>Current Rank</div>
            <div className="text-xl font-bold mt-0.5" style={{ color: "#F1F5F9" }}>Bronze League</div>
          </div>
          <div className="flex items-center justify-center rounded-full" style={{ width: 48, height: 48, background: "linear-gradient(135deg, #b45309, #f59e0b)" }}>
            <Trophy size={22} className="text-white" />
          </div>
        </div>
        <div className="rounded-full h-2 w-full" style={{ background: "#334155" }}>
          <div className="rounded-full h-2" style={{ width: "68%", background: "linear-gradient(90deg, #4338ca, #7C3AED)" }} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[9px]" style={{ color: "#94A3B8" }}>342 / 500 XP</span>
          <span className="text-[9px]" style={{ color: "#A5B4FC" }}>Silver at 500 XP →</span>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="flex items-center justify-between px-4 mt-3 mb-1">
        <span className="text-xs font-bold" style={{ color: "#F1F5F9" }}>Leaderboard</span>
        <span className="text-[10px]" style={{ color: "#7C3AED" }}>This week</span>
      </div>

      {[
        { rank: 1, name: "Alex K.", xp: 720, you: false, color: "#FBBF24" },
        { rank: 2, name: "Maria L.", xp: 610, you: false, color: "#94A3B8" },
        { rank: 3, name: "Tom S.", xp: 490, you: false, color: "#F59E0B" },
        { rank: 4, name: "Jane Smith", xp: 342, you: true, color: "#7C3AED" },
        { rank: 5, name: "Chris R.", xp: 290, you: false, color: "#475569" },
      ].map(({ rank, name, xp, you, color }) => (
        <div
          key={rank}
          className="flex items-center gap-3 px-4 py-2 mx-3 mb-1 rounded-lg"
          style={{ background: you ? "#1e1040" : "transparent", border: you ? "1px solid #7C3AED44" : "1px solid transparent" }}
        >
          <span className="text-sm font-bold w-5 text-center" style={{ color }}>{rank}</span>
          <span className="flex-1 text-[11px] font-semibold" style={{ color: you ? "#A78BFA" : "#CBD5E1" }}>
            {name} {you && <span className="text-[9px]" style={{ color: "#7C3AED" }}>(you)</span>}
          </span>
          <span className="text-[11px] font-bold" style={{ color }}>{xp} XP</span>
        </div>
      ))}

      {/* Badges */}
      <div className="px-4 mt-3 mb-1">
        <span className="text-xs font-bold" style={{ color: "#F1F5F9" }}>Badges</span>
      </div>
      <div className="grid grid-cols-2 gap-2 mx-3 mb-4">
        {badges.map(({ id, icon: Icon, label, desc, color, unlocked }) => {
          const isClaimed = claimed.includes(id);
          return (
            <button
              key={id}
              onClick={() => unlocked && !isClaimed && setClaimed((p) => [...p, id])}
              className="flex flex-col items-center gap-1.5 rounded-xl p-3 text-center transition-all active:scale-95"
              style={{
                background: unlocked ? "#1E293B" : "#0F172A",
                border: isClaimed ? `1px solid ${color}` : unlocked ? "1px solid #334155" : "1px solid #1e293b",
                opacity: unlocked ? 1 : 0.4,
                cursor: unlocked ? "pointer" : "default",
              }}
            >
              <div className="flex items-center justify-center rounded-full" style={{ width: 36, height: 36, background: unlocked ? `${color}22` : "#1E293B" }}>
                <Icon size={18} style={{ color: unlocked ? color : "#475569" }} />
              </div>
              <span className="text-[10px] font-bold" style={{ color: unlocked ? "#F1F5F9" : "#475569" }}>{label}</span>
              <span className="text-[9px]" style={{ color: "#64748B" }}>{desc}</span>
              {isClaimed && <span className="text-[9px] font-bold" style={{ color: "#34D399" }}>✓ Claimed</span>}
              {unlocked && !isClaimed && <span className="text-[9px] font-semibold" style={{ color }}>Tap to claim</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Phone Shell ─────────────────────────────────── */
function PhoneShell() {
  const [screen, setScreen] = useState<Screen>("home");

  return (
    <div
      className="relative rounded-[40px] overflow-hidden"
      style={{
        width: 280,
        height: 580,
        background: "#1C1C1E",
        border: "8px solid #3F3F46",
        boxShadow: "0 0 0 1px #52525b, 0 40px 80px rgba(0,0,0,0.7), 0 0 60px rgba(124,58,237,0.08)",
      }}
    >
      <div className="flex flex-col rounded-[30px] overflow-hidden" style={{ width: "100%", height: "100%" }}>
        <StatusBar />
        <div className="flex flex-col flex-1 overflow-hidden" style={{ position: "relative" }}>
          <div style={{ display: screen === "home" ? "flex" : "none", flexDirection: "column", flex: 1, overflow: "hidden" }}>
            <HomeDashboard onNav={setScreen} />
          </div>
          <div style={{ display: screen === "stats" ? "flex" : "none", flexDirection: "column", flex: 1, overflow: "hidden" }}>
            <UsageAnalytics onNav={setScreen} />
          </div>
          <div style={{ display: screen === "train" ? "flex" : "none", flexDirection: "column", flex: 1, overflow: "hidden" }}>
            <MentalTraining />
          </div>
          <div style={{ display: screen === "rewards" ? "flex" : "none", flexDirection: "column", flex: 1, overflow: "hidden" }}>
            <RewardsScreen />
          </div>
        </div>
        <BottomNav active={screen} onNav={setScreen} />
      </div>
    </div>
  );
}

/* ─── Top Bar ─────────────────────────────────────── */
function TopBar() {
  return (
    <div className="flex items-center gap-4 px-8 shrink-0" style={{ height: 60, background: "#161B22", borderBottom: "1px solid #30363D" }}>
      <div className="flex items-center justify-center rounded-lg shrink-0" style={{ width: 32, height: 32, background: "#7C3AED" }}>
        <Smartphone size={16} className="text-white" />
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-bold" style={{ color: "#E6EDF3" }}>Project Doomscrolling</span>
        <span className="text-[11px]" style={{ color: "#7D8590" }}>Clickable Prototype — 4 Screens</span>
      </div>
      <div className="flex-1" />
      <div className="hidden sm:flex items-center gap-1.5 text-[11px]" style={{ color: "#7D8590" }}>
        <span style={{ color: "#475569" }}>↑↓ scroll inside phone</span>
        <span className="mx-2" style={{ color: "#30363D" }}>|</span>
        <span>tap nav to switch screens</span>
      </div>
      <div className="rounded-md px-3 py-1.5 text-[11px] font-semibold text-white" style={{ background: "#238636" }}>
        AI Build Day
      </div>
    </div>
  );
}

/* ─── Page ────────────────────────────────────────── */
export default function Page() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#0d1117" }}>
      <TopBar />
      <div className="flex flex-1 items-center justify-center py-10">
        <PhoneShell />
      </div>
      <div className="flex items-center justify-center pb-5 text-[11px]" style={{ color: "#475569" }}>
        Project Doomscrolling — Screen Time Management App
      </div>
    </div>
  );
}
