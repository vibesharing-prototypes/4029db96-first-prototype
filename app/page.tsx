"use client";

import { useState, useEffect, useCallback } from "react";
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
  Lock,
  Unlock,
  TrendingDown,
  Award,
  Scan,
  Shield,
  Clock,
  Target,
  MessageCircle,
  Music,
  Camera,
  ShoppingBag,
  Mail,
  Globe,
  Gamepad2,
  AlertTriangle,
  Settings,
  User,
  Plus,
} from "lucide-react";
import { AppProvider, useApp, type TrackedApp } from "./context";

/* ─── types ───────────────────────────────────────── */
type Screen = "home" | "stats" | "train" | "rewards" | "profile" | "settings";

const ICON_MAP: Record<string, React.ElementType> = {
  twitter: Twitter,
  youtube: Youtube,
  instagram: Instagram,
  tiktok: Music,
  reddit: MessageCircle,
  snapchat: Camera,
  amazon: ShoppingBag,
  gmail: Mail,
  safari: Globe,
  games: Gamepad2,
  globe: Globe,
};

/* ─── Animated progress helper ────────────────────── */
function useAnimatedValue(target: number, duration = 600) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const initial = 0;
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(initial + (target - initial) * eased);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [target, duration]);
  return value;
}

/* ═══════════════════════════════════════════════════
   ONBOARDING FLOW
   ═══════════════════════════════════════════════════ */

interface DetectedApp {
  name: string;
  icon: React.ElementType;
  iconKey: string;
  iconBg: string;
  category: "social" | "video" | "messaging" | "games" | "shopping" | "productivity" | "other";
  weeklyHours: number;
  risk: "high" | "medium" | "low";
  selected: boolean;
}

const DETECTED_APPS: DetectedApp[] = [
  { name: "Twitter / X", icon: Twitter, iconKey: "twitter", iconBg: "#1D4ED8", category: "social", weeklyHours: 9.8, risk: "high", selected: true },
  { name: "YouTube", icon: Youtube, iconKey: "youtube", iconBg: "#DC2626", category: "video", weeklyHours: 7.2, risk: "high", selected: true },
  { name: "Instagram", icon: Instagram, iconKey: "instagram", iconBg: "#C026D3", category: "social", weeklyHours: 5.4, risk: "high", selected: true },
  { name: "TikTok", icon: Music, iconKey: "tiktok", iconBg: "#18181B", category: "video", weeklyHours: 4.1, risk: "high", selected: true },
  { name: "Reddit", icon: MessageCircle, iconKey: "reddit", iconBg: "#EA580C", category: "social", weeklyHours: 3.3, risk: "medium", selected: true },
  { name: "Snapchat", icon: Camera, iconKey: "snapchat", iconBg: "#FACC15", category: "social", weeklyHours: 1.8, risk: "medium", selected: false },
  { name: "Amazon", icon: ShoppingBag, iconKey: "amazon", iconBg: "#F59E0B", category: "shopping", weeklyHours: 1.2, risk: "low", selected: false },
  { name: "Gmail", icon: Mail, iconKey: "gmail", iconBg: "#DC2626", category: "productivity", weeklyHours: 0.8, risk: "low", selected: false },
  { name: "Safari", icon: Globe, iconKey: "safari", iconBg: "#2563EB", category: "other", weeklyHours: 2.5, risk: "medium", selected: false },
  { name: "Games", icon: Gamepad2, iconKey: "games", iconBg: "#059669", category: "games", weeklyHours: 2.0, risk: "medium", selected: false },
];

type OnboardingStep = "welcome" | "scanning" | "results" | "goal" | "complete";

function OnboardingFlow({ onFinish }: { onFinish: (opts: { dailyGoalHours: number; selectedApps: DetectedApp[] }) => void }) {
  const [step, setStep] = useState<OnboardingStep>("welcome");
  const [scanProgress, setScanProgress] = useState(0);
  const [apps, setApps] = useState(DETECTED_APPS);
  const [dailyGoal, setDailyGoal] = useState(3);
  const [scanComplete, setScanComplete] = useState(false);

  useEffect(() => {
    if (step !== "scanning") return;
    setScanProgress(0);
    setScanComplete(false);
    let frame = 0;
    const total = 60;
    const id = setInterval(() => {
      frame++;
      setScanProgress(frame / total * 100);
      if (frame >= total) {
        clearInterval(id);
        setScanComplete(true);
        setTimeout(() => setStep("results"), 600);
      }
    }, 50);
    return () => clearInterval(id);
  }, [step]);

  const toggleApp = useCallback((name: string) => {
    setApps((prev) => prev.map((a) => a.name === name ? { ...a, selected: !a.selected } : a));
  }, []);

  const selectedApps = apps.filter((a) => a.selected);
  const totalWeeklyHours = selectedApps.reduce((sum, a) => sum + a.weeklyHours, 0);
  const highRiskCount = selectedApps.filter((a) => a.risk === "high").length;

  const riskColor = (risk: string) =>
    risk === "high" ? "#EF4444" : risk === "medium" ? "#F59E0B" : "#34D399";

  return (
    <div className="flex flex-col flex-1 overflow-hidden" style={{ background: "#0F172A" }}>
      {/* Step: Welcome */}
      {step === "welcome" && (
        <div className="flex flex-col flex-1 items-center justify-center px-6 gap-5">
          <div className="flex items-center justify-center rounded-2xl" style={{ width: 56, height: 56, background: "linear-gradient(135deg, #7C3AED, #4F46E5)" }}>
            <Shield size={28} className="text-white" />
          </div>
          <div className="text-center">
            <div className="text-lg font-bold" style={{ color: "#F1F5F9" }}>Take back your time</div>
            <div className="text-[11px] mt-1 leading-relaxed" style={{ color: "#94A3B8" }}>
              We'll scan your apps to understand your<br />screen habits and build a personalized plan.
            </div>
          </div>

          <div className="flex flex-col gap-2.5 w-full mt-2">
            {[
              { icon: Scan, text: "Analyze your installed apps", color: "#7C3AED" },
              { icon: AlertTriangle, text: "Identify high-risk doomscroll apps", color: "#F59E0B" },
              { icon: Target, text: "Set your daily screen time goal", color: "#34D399" },
            ].map(({ icon: Icon, text, color }) => (
              <div key={text} className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: "#1E293B" }}>
                <div className="flex items-center justify-center rounded-lg shrink-0" style={{ width: 28, height: 28, background: `${color}22` }}>
                  <Icon size={14} style={{ color }} />
                </div>
                <span className="text-[11px] font-medium" style={{ color: "#CBD5E1" }}>{text}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => setStep("scanning")}
            className="w-full rounded-full py-3 text-[12px] font-bold text-white mt-2 transition-all active:scale-95"
            style={{ background: "linear-gradient(135deg, #7C3AED, #4F46E5)", border: "none", cursor: "pointer" }}
          >
            Scan My Apps
          </button>
          <button
            onClick={() => onFinish({ dailyGoalHours: 3, selectedApps: apps.filter((a) => a.selected) })}
            className="text-[11px] mt-0.5 transition-opacity active:opacity-60"
            style={{ color: "#64748B", background: "none", border: "none", cursor: "pointer" }}
          >
            Skip for now
          </button>
        </div>
      )}

      {/* Step: Scanning */}
      {step === "scanning" && (
        <div className="flex flex-col flex-1 items-center justify-center px-6 gap-4">
          <div className="relative flex items-center justify-center" style={{ width: 100, height: 100 }}>
            <svg width="100" height="100" style={{ position: "absolute", transform: "rotate(-90deg)" }}>
              <circle cx="50" cy="50" r="42" fill="none" stroke="#1E293B" strokeWidth="5" />
              <circle
                cx="50" cy="50" r="42" fill="none"
                stroke={scanComplete ? "#34D399" : "#7C3AED"}
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 42}`}
                strokeDashoffset={`${2 * Math.PI * 42 * (1 - scanProgress / 100)}`}
                style={{ transition: "stroke-dashoffset 0.1s linear, stroke 0.3s" }}
              />
            </svg>
            <div className="text-center">
              {scanComplete ? (
                <CheckCircle size={28} style={{ color: "#34D399" }} />
              ) : (
                <Scan size={24} className="animate-pulse" style={{ color: "#7C3AED" }} />
              )}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm font-bold" style={{ color: "#F1F5F9" }}>
              {scanComplete ? "Scan Complete!" : "Scanning Apps..."}
            </div>
            <div className="text-[11px] mt-0.5" style={{ color: "#94A3B8" }}>
              {scanComplete ? `Found ${apps.length} apps to monitor` : "Analyzing your installed applications"}
            </div>
          </div>

          {/* Animated app icons appearing */}
          <div className="flex flex-wrap justify-center gap-2 mt-2 px-2">
            {apps.map((app, i) => {
              const visible = scanProgress > (i / apps.length) * 90;
              return (
                <div
                  key={app.name}
                  className="flex items-center justify-center rounded-lg transition-all"
                  style={{
                    width: 32,
                    height: 32,
                    background: app.iconBg,
                    opacity: visible ? 1 : 0,
                    transform: visible ? "scale(1)" : "scale(0.5)",
                    transition: "opacity 0.3s, transform 0.3s",
                  }}
                >
                  <app.icon size={14} className="text-white" />
                </div>
              );
            })}
          </div>

          <div className="w-full rounded-full h-1.5 mt-3" style={{ background: "#1E293B" }}>
            <div
              className="rounded-full h-1.5 transition-all"
              style={{ width: `${scanProgress}%`, background: scanComplete ? "#34D399" : "#7C3AED" }}
            />
          </div>
          <span className="text-[10px]" style={{ color: "#64748B" }}>{Math.round(scanProgress)}%</span>
        </div>
      )}

      {/* Step: Results — app analysis */}
      {step === "results" && (
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="px-4 pt-3 pb-2 shrink-0">
            <div className="text-sm font-bold" style={{ color: "#F1F5F9" }}>App Analysis</div>
            <div className="text-[10px] mt-0.5" style={{ color: "#94A3B8" }}>
              Select apps to monitor · {selectedApps.length} selected
            </div>
          </div>

          {/* Summary card */}
          <div className="mx-3 rounded-xl p-3 flex gap-3 shrink-0" style={{ background: "#1E293B" }}>
            <div className="flex flex-col items-center flex-1 gap-0.5">
              <span className="text-lg font-bold" style={{ color: "#EF4444" }}>{totalWeeklyHours.toFixed(1)}h</span>
              <span className="text-[9px]" style={{ color: "#64748B" }}>Weekly total</span>
            </div>
            <div className="w-px" style={{ background: "#334155" }} />
            <div className="flex flex-col items-center flex-1 gap-0.5">
              <span className="text-lg font-bold" style={{ color: "#F59E0B" }}>{highRiskCount}</span>
              <span className="text-[9px]" style={{ color: "#64748B" }}>High risk apps</span>
            </div>
            <div className="w-px" style={{ background: "#334155" }} />
            <div className="flex flex-col items-center flex-1 gap-0.5">
              <span className="text-lg font-bold" style={{ color: "#7C3AED" }}>{(totalWeeklyHours / 7).toFixed(1)}h</span>
              <span className="text-[9px]" style={{ color: "#64748B" }}>Daily avg</span>
            </div>
          </div>

          {/* App list */}
          <div className="flex-1 overflow-y-auto phone-scroll px-3 mt-2">
            {apps.map((app) => (
              <button
                key={app.name}
                onClick={() => toggleApp(app.name)}
                className="flex items-center gap-2.5 w-full py-2 rounded-lg transition-all active:scale-[0.98] mb-1 px-2"
                style={{
                  background: app.selected ? "#1E293B" : "transparent",
                  border: app.selected ? `1px solid ${riskColor(app.risk)}44` : "1px solid transparent",
                  cursor: "pointer",
                }}
              >
                <div className="flex items-center justify-center rounded-lg shrink-0" style={{ width: 28, height: 28, background: app.iconBg }}>
                  <app.icon size={13} className="text-white" />
                </div>
                <div className="flex flex-col items-start flex-1 gap-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-semibold" style={{ color: "#CBD5E1" }}>{app.name}</span>
                    <span className="text-[8px] font-bold px-1.5 rounded-full" style={{ background: `${riskColor(app.risk)}22`, color: riskColor(app.risk) }}>
                      {app.risk}
                    </span>
                  </div>
                  <span className="text-[9px]" style={{ color: "#64748B" }}>{app.weeklyHours}h / week · {app.category}</span>
                </div>
                <div
                  className="flex items-center justify-center rounded-full shrink-0 transition-all"
                  style={{
                    width: 22,
                    height: 22,
                    background: app.selected ? "#7C3AED" : "#334155",
                    border: app.selected ? "none" : "1px solid #475569",
                  }}
                >
                  {app.selected && <CheckCircle size={12} className="text-white" />}
                </div>
              </button>
            ))}
          </div>

          <div className="px-3 pb-3 pt-2 shrink-0">
            <button
              onClick={() => setStep("goal")}
              className="w-full rounded-full py-3 text-[12px] font-bold text-white transition-all active:scale-95"
              style={{ background: "linear-gradient(135deg, #7C3AED, #4F46E5)", border: "none", cursor: "pointer" }}
            >
              Continue with {selectedApps.length} apps
            </button>
          </div>
        </div>
      )}

      {/* Step: Goal setting */}
      {step === "goal" && (
        <div className="flex flex-col flex-1 items-center justify-center px-6 gap-5">
          <div className="flex items-center justify-center rounded-2xl" style={{ width: 56, height: 56, background: "linear-gradient(135deg, #059669, #34D399)" }}>
            <Target size={28} className="text-white" />
          </div>
          <div className="text-center">
            <div className="text-lg font-bold" style={{ color: "#F1F5F9" }}>Set Your Daily Goal</div>
            <div className="text-[11px] mt-1" style={{ color: "#94A3B8" }}>
              Your current daily average is {(totalWeeklyHours / 7).toFixed(1)}h.<br />
              We recommend starting with a realistic target.
            </div>
          </div>

          {/* Goal slider */}
          <div className="w-full flex flex-col items-center gap-3 mt-2">
            <div className="text-3xl font-bold" style={{ color: "#F1F5F9" }}>{dailyGoal}h 00m</div>
            <div className="flex items-center gap-3 w-full">
              <button
                onClick={() => setDailyGoal(Math.max(1, dailyGoal - 0.5))}
                className="flex items-center justify-center rounded-full text-base font-bold transition-all active:scale-90"
                style={{ width: 40, height: 40, background: "#1E293B", color: "#F1F5F9", border: "1px solid #334155", cursor: "pointer" }}
              >
                −
              </button>
              <div className="flex-1 rounded-full h-2 relative" style={{ background: "#334155" }}>
                <div
                  className="rounded-full h-2 transition-all"
                  style={{
                    width: `${((dailyGoal - 1) / 7) * 100}%`,
                    background: dailyGoal <= 2 ? "#34D399" : dailyGoal <= 4 ? "#F59E0B" : "#EF4444",
                  }}
                />
              </div>
              <button
                onClick={() => setDailyGoal(Math.min(8, dailyGoal + 0.5))}
                className="flex items-center justify-center rounded-full text-base font-bold transition-all active:scale-90"
                style={{ width: 40, height: 40, background: "#1E293B", color: "#F1F5F9", border: "1px solid #334155", cursor: "pointer" }}
              >
                +
              </button>
            </div>
            <div className="flex items-center justify-between w-full">
              <span className="text-[9px]" style={{ color: "#64748B" }}>1h (strict)</span>
              <span className="text-[9px]" style={{ color: "#64748B" }}>8h (relaxed)</span>
            </div>
          </div>

          {/* AI recommendation */}
          <div className="w-full flex items-center gap-2.5 rounded-xl p-2.5" style={{ background: "#1E293B", border: "1px solid #7C3AED44" }}>
            <Sparkles size={14} style={{ color: "#A78BFA" }} />
            <div className="flex flex-col gap-0.5 flex-1">
              <span className="text-[9px] font-bold" style={{ color: "#A78BFA" }}>AI Recommendation</span>
              <span className="text-[10px]" style={{ color: "#CBD5E1" }}>
                Start with 3h daily — that's 20% less than your current average.
              </span>
            </div>
          </div>

          <button
            onClick={() => setStep("complete")}
            className="w-full rounded-full py-3 text-[12px] font-bold text-white transition-all active:scale-95"
            style={{ background: "linear-gradient(135deg, #059669, #34D399)", border: "none", cursor: "pointer" }}
          >
            Set Goal: {dailyGoal}h / day
          </button>
        </div>
      )}

      {/* Step: Complete */}
      {step === "complete" && (
        <div className="flex flex-col flex-1 items-center justify-center px-6 gap-4">
          <div
            className="flex items-center justify-center rounded-full"
            style={{ width: 64, height: 64, background: "linear-gradient(135deg, #059669, #34D399)", animation: "pulse 2s infinite" }}
          >
            <CheckCircle size={32} className="text-white" />
          </div>
          <div className="text-center">
            <div className="text-lg font-bold" style={{ color: "#F1F5F9" }}>You're All Set!</div>
            <div className="text-[11px] mt-1 leading-relaxed" style={{ color: "#94A3B8" }}>
              Monitoring {selectedApps.length} apps with a<br />{dailyGoal}h daily screen time goal.
            </div>
          </div>

          <div className="flex flex-col gap-2 w-full mt-2">
            {[
              { icon: Shield, text: `${selectedApps.length} apps monitored`, color: "#7C3AED" },
              { icon: Clock, text: `${dailyGoal}h daily limit set`, color: "#F59E0B" },
              { icon: Sparkles, text: "AI coaching enabled", color: "#34D399" },
            ].map(({ icon: Icon, text, color }) => (
              <div key={text} className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: "#1E293B" }}>
                <Icon size={14} style={{ color }} />
                <span className="text-[11px] font-medium" style={{ color: "#CBD5E1" }}>{text}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => onFinish({ dailyGoalHours: dailyGoal, selectedApps: apps.filter((a) => a.selected) })}
            className="w-full rounded-full py-3 text-[12px] font-bold text-white mt-3 transition-all active:scale-95"
            style={{ background: "linear-gradient(135deg, #7C3AED, #4F46E5)", border: "none", cursor: "pointer" }}
          >
            Start Using App
          </button>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   STATUS BAR
   ═══════════════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════════════
   BOTTOM NAV — fixed: relative parent for dot
   ═══════════════════════════════════════════════════ */
function BottomNav({ active, onNav }: { active: Screen; onNav: (s: Screen) => void }) {
  const items: { id: Screen; icon: React.ElementType; label: string }[] = [
    { id: "home", icon: Home, label: "Home" },
    { id: "stats", icon: BarChart2, label: "Stats" },
    { id: "train", icon: Brain, label: "Train" },
    { id: "rewards", icon: Trophy, label: "Leaderboard" },
    { id: "profile", icon: User, label: "Profile" },
  ];
  return (
    <div className="flex items-center justify-around px-2 shrink-0" style={{ background: "#1E293B", height: 58, borderTop: "1px solid #334155" }}>
      {items.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          onClick={() => onNav(id)}
          className="relative flex flex-col items-center justify-center gap-1 transition-all active:scale-90"
          style={{ width: 52, height: 48, background: "none", border: "none", cursor: "pointer", padding: 0 }}
        >
          {active === id && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 rounded-full" style={{ width: 4, height: 4, background: "#7C3AED" }} />
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

/* ═══════════════════════════════════════════════════
   SCREEN 1: HOME DASHBOARD — consistent block/enable only, no manual usage edit
   ═══════════════════════════════════════════════════ */
function HomeDashboard({ onNav }: { onNav: (s: Screen) => void }) {
  const {
    trackedApps,
    userDailyGoalHours,
    todayScreenMinutes,
    streakUnderLimitDays,
    setAppBlocked,
  } = useApp();
  const [suggestionDismissed, setSuggestionDismissed] = useState(false);
  const [selectedAppStats, setSelectedAppStats] = useState<TrackedApp | null>(null);

  const goalMinutes = userDailyGoalHours * 60;
  const overLimit = todayScreenMinutes > goalMinutes;
  const pct = Math.min(100, (todayScreenMinutes / goalMinutes) * 100);

  const displayApps = trackedApps.length > 0 ? trackedApps : [
    { name: "Twitter / X", iconKey: "twitter", iconBg: "#1D4ED8", category: "social", weeklyHours: 9.8, risk: "high" as const, blocked: true, todayMinutes: 82, dailyLimitMinutes: 0 },
    { name: "YouTube", iconKey: "youtube", iconBg: "#DC2626", category: "video", weeklyHours: 7.2, risk: "high" as const, blocked: false, todayMinutes: 58, dailyLimitMinutes: 0 },
  ];

  const usedLabel = `${Math.floor(todayScreenMinutes / 60)}h ${todayScreenMinutes % 60}m`;
  const limitLabel = `${userDailyGoalHours}h 00m`;

  return (
    <div className="flex flex-col flex-1 overflow-y-auto phone-scroll" style={{ background: "#0F172A" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 shrink-0" style={{ height: 60 }}>
        <div className="flex flex-col gap-0.5">
          <span className="text-[11px]" style={{ color: "#94A3B8" }}>Good Morning</span>
          <span className="text-base font-bold" style={{ color: "#F1F5F9" }}>Jane Smith</span>
        </div>
        <button
          onClick={() => onNav("profile")}
          className="flex items-center justify-center rounded-full text-xs font-bold text-white transition-transform active:scale-90"
          style={{ width: 36, height: 36, background: "#7C3AED", border: "none", cursor: "pointer" }}
        >
          JS
        </button>
      </div>

      {/* Usage Card — used vs available limit */}
      <div className="mx-3 rounded-xl p-3.5 flex flex-col gap-2" style={{ background: "#1E293B" }}>
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold" style={{ color: "#94A3B8" }}>Today&apos;s Screen Time</span>
          {overLimit && (
            <span className="text-[9px] font-bold text-white px-2 py-0.5 rounded-full" style={{ background: "#DC2626" }}>Over limit</span>
          )}
        </div>
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-3xl font-bold" style={{ color: "#F1F5F9" }}>{usedLabel}</span>
          <span className="text-sm" style={{ color: "#64748B" }}>used of</span>
          <span className="text-xl font-semibold" style={{ color: "#94A3B8" }}>{limitLabel}</span>
          <span className="text-sm" style={{ color: "#64748B" }}>available</span>
        </div>
        <div className="rounded-full h-1.5 w-full" style={{ background: "#334155" }}>
          <div className="rounded-full h-1.5 transition-all" style={{ width: `${pct}%`, background: overLimit ? "#DC2626" : pct > 80 ? "#F59E0B" : "#34D399" }} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[9px]" style={{ color: "#64748B" }}>0h</span>
          <span className="text-[9px]" style={{ color: "#64748B" }}>Goal: {limitLabel}</span>
          <span className="text-[9px]" style={{ color: "#64748B" }}>{userDailyGoalHours + 2}h max</span>
        </div>
      </div>

      {/* Quick Stats — streak = days under limit */}
      <div className="flex gap-2 mx-3 mt-2 shrink-0" style={{ height: 72 }}>
        <button
          onClick={() => onNav("profile")}
          className="flex-1 flex flex-col items-center justify-center gap-1 rounded-xl transition-transform active:scale-95"
          style={{ background: "#1E293B", border: "none", cursor: "pointer" }}
        >
          <span className="text-lg font-bold" style={{ color: "#F472B6" }}>{streakUnderLimitDays}</span>
          <span className="text-[9px]" style={{ color: "#64748B" }}>Days under limit</span>
        </button>
        <button
          onClick={() => onNav("rewards")}
          className="flex-1 flex flex-col items-center justify-center gap-1 rounded-xl transition-transform active:scale-95"
          style={{ background: "#1E293B", border: "none", cursor: "pointer" }}
        >
          <span className="text-lg font-bold" style={{ color: "#34D399" }}>42</span>
          <span className="text-[9px]" style={{ color: "#64748B" }}>XP Today</span>
        </button>
        <button
          onClick={() => onNav("rewards")}
          className="flex-1 flex flex-col items-center justify-center gap-1 rounded-xl transition-transform active:scale-95"
          style={{ background: "#1E293B", border: "none", cursor: "pointer" }}
        >
          <span className="text-lg font-bold" style={{ color: "#FBBF24" }}>#4</span>
          <span className="text-[9px]" style={{ color: "#64748B" }}>Leaderboard</span>
        </button>
      </div>

      {/* App Limits — all apps: block/enable only, no manual usage edit */}
      <div className="flex items-center justify-between px-4 mt-2 py-1.5 shrink-0">
        <span className="text-xs font-bold" style={{ color: "#F1F5F9" }}>App Limits</span>
        <button
          onClick={() => onNav("settings")}
          className="flex items-center gap-1 text-[11px] transition-opacity active:opacity-60"
          style={{ color: "#7C3AED", background: "none", border: "none", cursor: "pointer", minWidth: 44, minHeight: 32 }}
        >
          <Settings size={10} /> Settings
        </button>
      </div>

      {displayApps.map((app) => {
        const Icon = ICON_MAP[app.iconKey] ?? Globe;
        const limitMin = app.dailyLimitMinutes || goalMinutes;
        const usagePct = limitMin ? Math.min(100, (app.todayMinutes / limitMin) * 100) : 0;
        return (
          <button
            key={app.name}
            onClick={() => setSelectedAppStats(app)}
            className="flex items-center gap-2.5 px-4 w-full shrink-0 text-left transition-opacity active:opacity-90"
            style={{ height: 48, background: "none", border: "none", cursor: "pointer" }}
          >
            <div className="flex items-center justify-center rounded-lg shrink-0" style={{ width: 28, height: 28, background: app.iconBg }}>
              <Icon size={14} className="text-white" />
            </div>
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <span className="text-[11px] font-semibold truncate" style={{ color: "#CBD5E1" }}>{app.name}</span>
              <div className="rounded h-1" style={{ background: "#334155" }}>
                <div className="rounded h-1 transition-all" style={{ width: `${app.blocked ? 100 : usagePct}%`, background: app.blocked ? "#EF4444" : usagePct > 80 ? "#F59E0B" : "#34D399" }} />
              </div>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); setAppBlocked(app.name, !app.blocked); }}
              className="flex items-center gap-1 text-[9px] rounded-md transition-opacity active:opacity-70 shrink-0"
              style={{ color: "#64748B", background: "none", border: "1px solid #334155", cursor: "pointer", padding: "4px 8px" }}
            >
              {app.blocked ? <Lock size={8} style={{ color: "#94A3B8" }} /> : <Unlock size={8} style={{ color: "#94A3B8" }} />}
              <span style={{ color: "#94A3B8" }}>{app.blocked ? "Blocked" : "On"}</span>
            </button>
          </button>
        );
      })}

      {/* Add more apps */}
      <button
        onClick={() => onNav("settings")}
        className="flex items-center gap-2.5 px-4 py-2.5 mx-3 mt-1 rounded-xl transition-all active:scale-98"
        style={{ background: "#1E293B", border: "1px dashed #334155", cursor: "pointer" }}
      >
        <div className="flex items-center justify-center rounded-lg shrink-0" style={{ width: 28, height: 28, background: "#334155" }}>
          <Plus size={14} style={{ color: "#94A3B8" }} />
        </div>
        <span className="text-[11px] font-semibold" style={{ color: "#94A3B8" }}>Add more apps</span>
      </button>

      {/* AI Suggestion */}
      {!suggestionDismissed && (
        <div className="mx-3 mt-2 flex items-center gap-2.5 rounded-xl p-2.5 shrink-0" style={{ background: "#1E293B", border: "1px solid #7C3AED" }}>
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
          <button
            onClick={() => setSuggestionDismissed(true)}
            className="flex items-center justify-center rounded-full shrink-0 transition-opacity active:opacity-60"
            style={{ width: 28, height: 28, background: "#334155", border: "none", cursor: "pointer" }}
          >
            <X size={12} style={{ color: "#94A3B8" }} />
          </button>
        </div>
      )}

      {/* Individual app stats modal */}
      {selectedAppStats && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center px-4" style={{ background: "rgba(15,23,42,0.95)" }}>
          <div className="w-full max-w-sm rounded-xl p-4" style={{ background: "#1E293B", border: "1px solid #334155" }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center rounded-lg" style={{ width: 32, height: 32, background: selectedAppStats.iconBg }}>
                  {(() => { const Icon = ICON_MAP[selectedAppStats.iconKey] ?? Globe; return <Icon size={16} className="text-white" />; })()}
                </div>
                <span className="text-sm font-bold" style={{ color: "#F1F5F9" }}>{selectedAppStats.name}</span>
              </div>
              <button onClick={() => setSelectedAppStats(null)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                <X size={18} style={{ color: "#94A3B8" }} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="rounded-lg p-2" style={{ background: "#0F172A" }}>
                <span className="text-[10px]" style={{ color: "#64748B" }}>Today</span>
                <div className="text-sm font-bold" style={{ color: "#F1F5F9" }}>{selectedAppStats.todayMinutes}m</div>
              </div>
              <div className="rounded-lg p-2" style={{ background: "#0F172A" }}>
                <span className="text-[10px]" style={{ color: "#64748B" }}>Weekly avg</span>
                <div className="text-sm font-bold" style={{ color: "#F1F5F9" }}>{Math.round(selectedAppStats.weeklyHours * 60 / 7)}m</div>
              </div>
            </div>
            <div className="mt-2 text-[10px]" style={{ color: "#94A3B8" }}>
              Limit: {selectedAppStats.blocked ? "Blocked" : "Enabled"} · Category: {selectedAppStats.category}
            </div>
            <button
              onClick={() => setSelectedAppStats(null)}
              className="w-full mt-3 py-2 rounded-full text-[11px] font-semibold"
              style={{ background: "#334155", color: "#F1F5F9", border: "none", cursor: "pointer" }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="pb-4" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SCREEN 2: USAGE ANALYTICS — fixed day labels
   ═══════════════════════════════════════════════════ */
const barData = [
  { day: "Mon", height: 58, color: "#475569" },
  { day: "Tue", height: 72, color: "#475569" },
  { day: "Wed", height: 90, color: "#EF4444" },
  { day: "Thu", height: 65, color: "#475569" },
  { day: "Fri", height: 80, color: "#F59E0B" },
  { day: "Sat", height: 48, color: "#34D399" },
  { day: "Sun", height: 52, color: "#34D399" },
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
    <div className="flex flex-col flex-1 overflow-y-auto phone-scroll" style={{ background: "#0F172A" }}>
      <div className="flex items-center justify-between px-4 shrink-0" style={{ height: 50 }}>
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

      <div className="mx-3 rounded-xl p-3.5 flex flex-col gap-3" style={{ background: "#1E293B", height: 160 }}>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold" style={{ color: "#94A3B8" }}>
            {selectedBar !== null
              ? `${data[selectedBar].day}: ${(data[selectedBar].height / 18).toFixed(1)}h`
              : "Daily Screen Time (hours)"}
          </span>
        </div>
        <div className="flex items-end justify-between flex-1 gap-1.5">
          {data.map(({ day, height, color }, i) => (
            <button
              key={i}
              onClick={() => setSelectedBar(selectedBar === i ? null : i)}
              className="flex flex-col items-center gap-1 flex-1 justify-end h-full transition-all"
              style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
            >
              <div
                className="rounded-t transition-all"
                style={{
                  width: 18,
                  height: selectedBar === i ? height + 6 : height,
                  background: selectedBar === i ? "#A78BFA" : color,
                  boxShadow: selectedBar === i ? "0 0 8px #7C3AED88" : "none",
                }}
              />
              <span className="text-[8px]" style={{ color: selectedBar === i ? "#A78BFA" : "#64748B" }}>
                {day.slice(0, 2)}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 mx-3 mt-2 shrink-0" style={{ height: 56 }}>
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

      <div className="flex items-center justify-between px-3.5 mt-2 py-1.5 shrink-0">
        <span className="text-xs font-bold" style={{ color: "#F1F5F9" }}>Top Apps This Week</span>
      </div>

      {[
        { icon: Twitter, iconBg: "#1D4ED8", name: "Twitter / X", time: "1h 22m", pct: 68 },
        { icon: Youtube, iconBg: "#DC2626", name: "YouTube", time: "58m", pct: 45 },
        { icon: Instagram, iconBg: "#7C3AED", name: "Instagram", time: "42m", pct: 33 },
      ].map(({ icon: Icon, iconBg, name, time, pct }) => (
        <div key={name} className="flex items-center gap-2.5 px-3.5 shrink-0" style={{ height: 44 }}>
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

      <button
        onClick={() => onNav("stats")}
        className="mx-3 mt-3 flex items-center justify-between rounded-xl p-3 transition-all active:scale-95 shrink-0"
        style={{ background: "#1E293B", border: "1px solid #334155", cursor: "pointer" }}
      >
        <div className="flex items-center gap-2">
          <TrendingDown size={16} style={{ color: "#34D399" }} />
          <div className="text-left">
            <div className="text-[11px] font-bold" style={{ color: "#F1F5F9" }}>You saved 45min this week</div>
            <div className="text-[9px]" style={{ color: "#64748B" }}>Keep it up! On track to hit your goal</div>
          </div>
        </div>
        <ChevronRight size={14} style={{ color: "#475569" }} />
      </button>

      <div className="pb-4" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SESSION MODAL — added end-confirmation
   ═══════════════════════════════════════════════════ */
function SessionModal({ title, duration, onClose, guide }: { title: string; duration: number; onClose: () => void; guide?: string }) {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(true);
  const [confirmEnd, setConfirmEnd] = useState(false);

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
  const done = elapsed >= duration;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-50" style={{ background: "rgba(15,23,42,0.95)" }}>
      {confirmEnd ? (
        <div className="flex flex-col items-center gap-4 px-6 w-full">
          <AlertTriangle size={32} style={{ color: "#F59E0B" }} />
          <div className="text-center">
            <div className="text-sm font-bold" style={{ color: "#F1F5F9" }}>End session early?</div>
            <div className="text-[11px] mt-1" style={{ color: "#94A3B8" }}>
              You've completed {mins}m {secs}s of {Math.round(duration / 60)} min.
            </div>
          </div>
          <div className="flex gap-3 w-full">
            <button
              onClick={() => setConfirmEnd(false)}
              className="flex-1 rounded-full py-2.5 text-[11px] font-semibold transition-all active:scale-95"
              style={{ background: "#1E293B", color: "#F1F5F9", border: "1px solid #334155", cursor: "pointer" }}
            >
              Continue
            </button>
            <button
              onClick={onClose}
              className="flex-1 rounded-full py-2.5 text-[11px] font-semibold transition-all active:scale-95"
              style={{ background: "#7F1D1D", color: "#EF4444", border: "none", cursor: "pointer" }}
            >
              End Session
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 px-6 w-full">
          <div className="flex items-center justify-center rounded-full" style={{ width: 64, height: 64, background: "linear-gradient(135deg, #059669, #0891B2)" }}>
            <Wind size={28} className="text-white" />
          </div>
          <div className="text-center">
            <div className="text-sm font-bold" style={{ color: "#F1F5F9" }}>{title}</div>
            <div className="text-[11px] mt-0.5" style={{ color: "#94A3B8" }}>{guide || "Focus on your breath"}</div>
          </div>

          <div className="relative flex items-center justify-center" style={{ width: 120, height: 120 }}>
            <svg width="120" height="120" style={{ position: "absolute", transform: "rotate(-90deg)" }}>
              <circle cx="60" cy="60" r="52" fill="none" stroke="#334155" strokeWidth="6" />
              <circle
                cx="60" cy="60" r="52" fill="none"
                stroke={done ? "#34D399" : "#7C3AED"}
                strokeWidth="6" strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 52}`}
                strokeDashoffset={`${2 * Math.PI * 52 * (1 - pct / 100)}`}
                style={{ transition: "stroke-dashoffset 1s linear, stroke 0.5s" }}
              />
            </svg>
            <div className="text-center">
              {done ? (
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

          {done ? (
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
            {!done && (
              <button
                onClick={() => setRunning(!running)}
                className="flex-1 flex items-center justify-center gap-2 rounded-full py-2.5 text-[11px] font-semibold transition-all active:scale-95"
                style={{ background: "#1E293B", color: "#F1F5F9", border: "1px solid #334155", cursor: "pointer" }}
              >
                {running ? <><Pause size={12} /> Pause</> : <><Play size={12} /> Resume</>}
              </button>
            )}
            <button
              onClick={done ? onClose : () => setConfirmEnd(true)}
              className="flex-1 flex items-center justify-center gap-2 rounded-full py-2.5 text-[11px] font-semibold transition-all active:scale-95"
              style={{ background: done ? "#059669" : "#7F1D1D", color: "#fff", border: "none", cursor: "pointer" }}
            >
              {done ? <><CheckCircle size={12} /> Done</> : <><X size={12} /> End</>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SCREEN 3: MENTAL TRAINING — usage suggestions + guides
   ═══════════════════════════════════════════════════ */
const sessions: Array<{
  icon: React.ElementType;
  label: string;
  category: string;
  duration: number;
  color: string;
  bg: string;
  level: string;
  description?: string;
  guide?: string;
}> = [
  { icon: Wind, label: "Morning Clarity Meditation", category: "Meditation", duration: 20, color: "#0891B2", bg: "linear-gradient(135deg, #059669 0%, #0891B2 100%)", level: "Beginner", description: "Start the day with a clear mind. Guided body scan and breath awareness." },
  { icon: Brain, label: "Deep Focus Block", category: "Focus", duration: 15, color: "#7C3AED", bg: "linear-gradient(135deg, #4C1D95 0%, #7C3AED 100%)", level: "Intermediate", description: "Single-tasking practice. Build sustained attention without switching." },
  { icon: Wind, label: "Box Breathing", category: "Breathe", duration: 10, color: "#0891B2", bg: "linear-gradient(135deg, #0891B2 0%, #06B6D4 100%)", level: "Beginner", description: "Navy SEAL-style tactical breathing to calm the nervous system.", guide: "Inhale 4 sec → Hold 4 sec → Exhale 4 sec → Hold 4 sec. Repeat. One full cycle = 16 sec. Do 3–5 cycles for quick reset." },
  { icon: Star, label: "Memory Palace", category: "Memory", duration: 25, color: "#F59E0B", bg: "linear-gradient(135deg, #B45309 0%, #F59E0B 100%)", level: "Advanced", description: "Visualize a familiar place and place items along a path. Walk the path to recall." },
];

function MentalTraining() {
  const { todayScreenMinutes } = useApp();
  const [activeSession, setActiveSession] = useState<(typeof sessions)[0] | null>(null);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [expanded, setExpanded] = useState(false);

  const usageSuggestion = todayScreenMinutes > 120
    ? "You've been on screen a lot today. A short 5–10 min breathing break can help reset focus."
    : todayScreenMinutes > 60
      ? "Nice balance so far. A quick Box Breathing session can boost clarity."
      : "Light screen use today. Try a longer meditation to build the habit.";

  const handleClose = () => {
    if (activeSession) setCompletedIds((p) => [...p, activeSession.label]);
    setActiveSession(null);
  };

  const xp = completedIds.length * 25;
  const score = 342 + xp;

  return (
    <div className="relative flex flex-col flex-1 overflow-hidden" style={{ background: "#0F172A" }}>
      <div className="flex items-center justify-between px-4 shrink-0" style={{ height: 50 }}>
        <span className="text-base font-bold" style={{ color: "#F1F5F9" }}>Mental Training</span>
        <div className="flex items-center gap-1 rounded-md px-2.5 py-1.5" style={{ background: "#1E293B" }}>
          <Zap size={10} style={{ color: "#FBBF24" }} />
          <span className="text-[10px] font-semibold" style={{ color: "#FBBF24" }}>7 day streak</span>
        </div>
      </div>

      <div className="flex flex-col flex-1 overflow-y-auto phone-scroll">
        <div className="mx-3 flex flex-col gap-1.5 px-2.5 py-2 rounded-lg" style={{ background: "#1E293B", border: "1px solid #7C3AED33" }}>
          <div className="flex items-center gap-1.5">
            <Sparkles size={11} style={{ color: "#A78BFA" }} />
            <span className="text-[10px] font-medium" style={{ color: "#94A3B8" }}>Based on your usage</span>
          </div>
          <span className="text-[11px]" style={{ color: "#CBD5E1" }}>{usageSuggestion}</span>
        </div>

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

        <div className="flex items-center justify-between px-3.5 mt-2 py-1">
          <span className="text-xs font-bold" style={{ color: "#F1F5F9" }}>More Trainings</span>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-[10px] transition-colors"
            style={{ color: "#7C3AED", background: "none", border: "none", cursor: "pointer", minHeight: 28, minWidth: 44 }}
          >
            {expanded ? "Show less" : "See all"}
          </button>
        </div>

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

        {expanded && (
          <div className="flex flex-col gap-2 px-3.5 mt-2">
            {sessions.slice(1).map((s) => {
              const done = completedIds.includes(s.label);
              return (
                <button
                  key={s.label}
                  onClick={() => setActiveSession(s)}
                  className="flex items-start gap-3 rounded-xl p-2.5 transition-all active:scale-95 text-left"
                  style={{ background: "#1E293B", border: done ? "1px solid #059669" : "1px solid #334155", cursor: "pointer" }}
                >
                  <div className="flex items-center justify-center rounded-full shrink-0" style={{ width: 36, height: 36, background: s.bg }}>
                    <s.icon size={16} className="text-white" />
                  </div>
                  <div className="flex flex-col items-start flex-1 min-w-0">
                    <span className="text-[11px] font-semibold" style={{ color: "#F1F5F9" }}>{s.label}</span>
                    <span className="text-[9px]" style={{ color: "#64748B" }}>{s.duration} min · {s.level}</span>
                    {s.description && <span className="text-[9px] mt-0.5 leading-snug" style={{ color: "#94A3B8" }}>{s.description}</span>}
                    {s.guide && <span className="text-[9px] mt-1 italic" style={{ color: "#A78BFA" }}>{s.guide}</span>}
                  </div>
                  {done ? <CheckCircle size={14} style={{ color: "#34D399" }} className="shrink-0" /> : <Play size={12} style={{ color: "#7C3AED" }} className="shrink-0" />}
                </button>
              );
            })}
          </div>
        )}

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

      {activeSession && (
        <SessionModal title={activeSession.label} duration={activeSession.duration * 60} onClose={handleClose} guide={activeSession.guide} />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SCREEN 4: REWARDS
   ═══════════════════════════════════════════════════ */
function RewardsScreen({ onNav }: { onNav: (s: Screen) => void }) {
  return (
    <div className="flex flex-col flex-1 overflow-y-auto phone-scroll" style={{ background: "#0F172A" }}>
      <div className="flex items-center justify-between px-4 shrink-0" style={{ height: 50 }}>
        <span className="text-base font-bold" style={{ color: "#F1F5F9" }}>Rewards</span>
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full" style={{ background: "#1E293B" }}>
          <Star size={11} style={{ color: "#FBBF24" }} />
          <span className="text-[11px] font-bold" style={{ color: "#FBBF24" }}>342 XP</span>
        </div>
      </div>

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

      <div className="flex items-center justify-between px-4 mt-3 mb-1 shrink-0">
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

      <button
        onClick={() => onNav("profile")}
        className="mx-3 mt-3 flex items-center justify-center gap-2 rounded-xl py-2.5 text-[11px] font-semibold"
        style={{ background: "#1E293B", border: "1px solid #334155", color: "#A78BFA", cursor: "pointer" }}
      >
        <Award size={14} /> View badges on Profile
      </button>
      <div className="pb-4" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PROFILE — awards/badges moved here
   ═══════════════════════════════════════════════════ */
function ProfileScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { userName, streakUnderLimitDays } = useApp();
  const [claimed, setClaimed] = useState<string[]>([]);

  const badges = [
    { id: "streak7", icon: Zap, label: "7-Day Under Limit", desc: "Stayed under goal 7 days in a row", color: "#FBBF24", unlocked: true },
    { id: "focus5", icon: Brain, label: "Focus Master", desc: "Completed 5 focus sessions", color: "#7C3AED", unlocked: true },
    { id: "detox", icon: TrendingDown, label: "Digital Detox", desc: "Stayed under goal 3 days", color: "#34D399", unlocked: true },
    { id: "legend", icon: Award, label: "Legend", desc: "Reach Gold tier", color: "#F59E0B", unlocked: false },
  ];

  return (
    <div className="flex flex-col flex-1 overflow-y-auto phone-scroll" style={{ background: "#0F172A" }}>
      <div className="flex items-center justify-between px-4 shrink-0" style={{ height: 50 }}>
        <span className="text-base font-bold" style={{ color: "#F1F5F9" }}>Profile</span>
        <button
          onClick={() => onNav("settings")}
          className="flex items-center gap-1 text-[11px]"
          style={{ color: "#7C3AED", background: "none", border: "none", cursor: "pointer" }}
        >
          <Settings size={14} /> Settings
        </button>
      </div>
      <div className="mx-3 rounded-xl p-4 flex flex-col gap-3" style={{ background: "#1E293B" }}>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center rounded-full text-lg font-bold text-white" style={{ width: 56, height: 56, background: "#7C3AED" }}>
            {userName.split(" ").map((n) => n[0]).join("")}
          </div>
          <div>
            <div className="text-base font-bold" style={{ color: "#F1F5F9" }}>{userName}</div>
            <div className="text-[10px]" style={{ color: "#94A3B8" }}>Bronze League · 342 XP</div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[10px]" style={{ color: "#64748B" }}>Days under limit streak</span>
          <span className="text-sm font-bold" style={{ color: "#F472B6" }}>{streakUnderLimitDays}</span>
        </div>
        <span className="text-[9px]" style={{ color: "#475569" }}>Tracked automatically</span>
      </div>
      <div className="px-4 mt-3 mb-1 shrink-0">
        <span className="text-xs font-bold" style={{ color: "#F1F5F9" }}>Awards</span>
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
              {!unlocked && <span className="text-[9px]" style={{ color: "#475569" }}>🔒 Locked</span>}
            </button>
          );
        })}
      </div>
      <div className="pb-4" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SETTINGS — scheduling, limiting features, add apps
   ═══════════════════════════════════════════════════ */
function SettingsScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const {
    scheduleRules,
    setScheduleRules,
    limitingFeatures,
    setLimitingFeatures,
    trackedApps,
    addTrackedApp,
    removeTrackedApp,
  } = useApp();
  const [showAddApps, setShowAddApps] = useState(false);

  const availableToAdd = DETECTED_APPS.filter((a) => !trackedApps.some((t) => t.name === a.name));

  return (
    <div className="flex flex-col flex-1 overflow-y-auto phone-scroll" style={{ background: "#0F172A" }}>
      <div className="flex items-center justify-between px-4 shrink-0" style={{ height: 50 }}>
        <button onClick={() => onNav("home")} className="text-[11px] font-semibold" style={{ color: "#7C3AED", background: "none", border: "none", cursor: "pointer" }}>← Back</button>
        <span className="text-base font-bold" style={{ color: "#F1F5F9" }}>Settings</span>
        <div style={{ width: 48 }} />
      </div>

      <div className="px-4 mt-1 mb-1">
        <span className="text-[10px] font-bold uppercase" style={{ color: "#64748B" }}>Limiting features</span>
      </div>
      <div className="mx-3 rounded-xl p-3 space-y-3" style={{ background: "#1E293B" }}>
        <div className="flex items-center justify-between">
          <span className="text-[11px]" style={{ color: "#CBD5E1" }}>Greyscale after time</span>
          <button
            onClick={() => setLimitingFeatures({ greyscaleEnabled: !limitingFeatures.greyscaleEnabled })}
            className="rounded-full w-10 h-5 transition-colors"
            style={{ background: limitingFeatures.greyscaleEnabled ? "#7C3AED" : "#334155", border: "none", cursor: "pointer" }}
          >
            <div className="rounded-full w-4 h-4 bg-white transition-transform" style={{ transform: limitingFeatures.greyscaleEnabled ? "translateX(22px)" : "translateX(2px)", marginTop: 2 }} />
          </button>
        </div>
        {limitingFeatures.greyscaleEnabled && (
          <div className="flex items-center justify-between">
            <span className="text-[10px]" style={{ color: "#94A3B8" }}>After (minutes)</span>
            <input
              type="number"
              min={30}
              max={480}
              value={limitingFeatures.greyscaleAfterMinutes}
              onChange={(e) => setLimitingFeatures({ greyscaleAfterMinutes: Number(e.target.value) || 120 })}
              className="w-16 rounded px-2 py-1 text-[11px] text-right"
              style={{ background: "#0F172A", color: "#F1F5F9", border: "1px solid #334155" }}
            />
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="text-[11px]" style={{ color: "#CBD5E1" }}>Auto-block app after time</span>
          <button
            onClick={() => setLimitingFeatures({ autoBlockAppEnabled: !limitingFeatures.autoBlockAppEnabled })}
            className="rounded-full w-10 h-5 transition-colors"
            style={{ background: limitingFeatures.autoBlockAppEnabled ? "#7C3AED" : "#334155", border: "none", cursor: "pointer" }}
          >
            <div className="rounded-full w-4 h-4 bg-white transition-transform" style={{ transform: limitingFeatures.autoBlockAppEnabled ? "translateX(22px)" : "translateX(2px)", marginTop: 2 }} />
          </button>
        </div>
        {limitingFeatures.autoBlockAppEnabled && (
          <div className="flex items-center justify-between">
            <span className="text-[10px]" style={{ color: "#94A3B8" }}>After (minutes)</span>
            <input
              type="number"
              min={30}
              max={480}
              value={limitingFeatures.autoBlockAfterMinutes}
              onChange={(e) => setLimitingFeatures({ autoBlockAfterMinutes: Number(e.target.value) || 180 })}
              className="w-16 rounded px-2 py-1 text-[11px] text-right"
              style={{ background: "#0F172A", color: "#F1F5F9", border: "1px solid #334155" }}
            />
          </div>
        )}
      </div>

      <div className="px-4 mt-3 mb-1">
        <span className="text-[10px] font-bold uppercase" style={{ color: "#64748B" }}>Scheduling — AI suggested limits</span>
      </div>
      <div className="mx-3 rounded-xl p-3 space-y-2" style={{ background: "#1E293B" }}>
        {scheduleRules.map((r) => (
          <div key={r.id} className="flex items-center justify-between py-1.5" style={{ borderBottom: "1px solid #334155" }}>
            <div>
              <span className="text-[11px] font-semibold" style={{ color: "#F1F5F9" }}>{r.label}</span>
              {r.suggestedByAi && <span className="ml-1.5 text-[9px]" style={{ color: "#A78BFA" }}>AI</span>}
            </div>
            <span className="text-[11px] font-bold" style={{ color: "#7C3AED" }}>{Math.floor(r.limitMinutes / 60)}h {r.limitMinutes % 60}m</span>
          </div>
        ))}
        <div className="text-[9px] mt-1" style={{ color: "#64748B" }}>Limits can vary by day or time. Edit in a future version.</div>
      </div>

      <div className="px-4 mt-3 mb-1 flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase" style={{ color: "#64748B" }}>Tracked apps</span>
        <button
          onClick={() => setShowAddApps(!showAddApps)}
          className="text-[11px] font-semibold"
          style={{ color: "#7C3AED", background: "none", border: "none", cursor: "pointer" }}
        >
          {showAddApps ? "Done" : "Add apps"}
        </button>
      </div>
      {showAddApps ? (
        <div className="mx-3 rounded-xl p-2 space-y-1 max-h-48 overflow-y-auto phone-scroll" style={{ background: "#1E293B" }}>
          {availableToAdd.length === 0 ? (
            <div className="text-[10px] py-2" style={{ color: "#64748B" }}>All available apps are already added.</div>
          ) : (
            availableToAdd.map((a) => {
              const Icon = a.icon;
              return (
                <button
                  key={a.name}
                  onClick={() => addTrackedApp({ name: a.name, iconKey: a.iconKey, iconBg: a.iconBg, category: a.category, weeklyHours: a.weeklyHours, risk: a.risk })}
                  className="flex items-center gap-2 w-full py-2 px-2 rounded-lg text-left transition-colors"
                  style={{ background: "#0F172A", border: "none", cursor: "pointer" }}
                >
                  <div className="flex items-center justify-center rounded-lg shrink-0" style={{ width: 24, height: 24, background: a.iconBg }}>
                    <Icon size={12} className="text-white" />
                  </div>
                  <span className="text-[11px] font-semibold flex-1" style={{ color: "#CBD5E1" }}>{a.name}</span>
                  <Plus size={12} style={{ color: "#34D399" }} />
                </button>
              );
            })
          )}
        </div>
      ) : (
        <div className="mx-3 rounded-xl p-2" style={{ background: "#1E293B" }}>
          {trackedApps.map((a) => (
            <div key={a.name} className="flex items-center justify-between py-1.5" style={{ borderBottom: "1px solid #334155" }}>
              <span className="text-[11px]" style={{ color: "#CBD5E1" }}>{a.name}</span>
              <button onClick={() => removeTrackedApp(a.name)} className="text-[10px] font-semibold" style={{ color: "#EF4444", background: "none", border: "none", cursor: "pointer" }}>Remove</button>
            </div>
          ))}
        </div>
      )}

      <div className="pb-4" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PHONE SHELL — onboarding gated
   ═══════════════════════════════════════════════════ */
function PhoneShell() {
  const { finishOnboarding, hasCompletedOnboarding } = useApp();
  const [screen, setScreen] = useState<Screen>("home");

  if (!hasCompletedOnboarding) {
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
          <OnboardingFlow
            onFinish={(opts) => {
              const trackedApps: TrackedApp[] = opts.selectedApps.map((a) => ({
                name: a.name,
                iconKey: a.iconKey,
                iconBg: a.iconBg,
                category: a.category,
                weeklyHours: a.weeklyHours,
                risk: a.risk,
                blocked: false,
                todayMinutes: Math.round((a.weeklyHours / 7) * 60) + 10,
                dailyLimitMinutes: 0,
              }));
              finishOnboarding({ dailyGoalHours: opts.dailyGoalHours, trackedApps });
            }}
          />
        </div>
      </div>
    );
  }

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
            <RewardsScreen onNav={setScreen} />
          </div>
          <div style={{ display: screen === "profile" ? "flex" : "none", flexDirection: "column", flex: 1, overflow: "hidden" }}>
            <ProfileScreen onNav={setScreen} />
          </div>
          <div style={{ display: screen === "settings" ? "flex" : "none", flexDirection: "column", flex: 1, overflow: "hidden" }}>
            <SettingsScreen onNav={setScreen} />
          </div>
        </div>
        <BottomNav active={screen} onNav={setScreen} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   TOP BAR
   ═══════════════════════════════════════════════════ */
function TopBar() {
  return (
    <div className="flex items-center gap-4 px-8 shrink-0" style={{ height: 60, background: "#161B22", borderBottom: "1px solid #30363D" }}>
      <div className="flex items-center justify-center rounded-lg shrink-0" style={{ width: 32, height: 32, background: "#7C3AED" }}>
        <Smartphone size={16} className="text-white" />
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-bold" style={{ color: "#E6EDF3" }}>Project Doomscrolling</span>
        <span className="text-[11px]" style={{ color: "#7D8590" }}>Clickable Prototype</span>
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

/* ═══════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════ */
export default function Page() {
  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col" style={{ background: "#0d1117" }}>
        <TopBar />
        <div className="flex flex-1 items-center justify-center py-10">
          <PhoneShell />
        </div>
        <div className="flex items-center justify-center pb-5 text-[11px]" style={{ color: "#475569" }}>
          Project Doomscrolling — Screen Time Management App
        </div>
      </div>
    </AppProvider>
  );
}
