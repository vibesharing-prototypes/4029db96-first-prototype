"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

export type TrackedApp = {
  name: string;
  iconKey: string; // key to resolve to Lucide icon in UI
  iconBg: string;
  category: string;
  weeklyHours: number;
  risk: "high" | "medium" | "low";
  blocked: boolean;
  /** Today's usage in minutes (read-only from "system", not user-editable) */
  todayMinutes: number;
  /** Optional daily limit in minutes; if 0, use global daily goal */
  dailyLimitMinutes: number;
};

export type ScheduleRule = {
  id: string;
  label: string; // e.g. "Weekdays", "Weekend", "Evening"
  days?: number[]; // 0-6 Sunday-Saturday
  startHour?: number; // 0-23
  endHour?: number;
  limitMinutes: number;
  suggestedByAi: boolean;
};

export type LimitingFeatures = {
  greyscaleEnabled: boolean;
  greyscaleAfterMinutes: number;
  autoBlockAppEnabled: boolean;
  autoBlockAfterMinutes: number;
};

export type AppState = {
  hasCompletedOnboarding: boolean;
  userDailyGoalHours: number;
  trackedApps: TrackedApp[];
  /** Consecutive days user stayed under daily goal */
  streakUnderLimitDays: number;
  /** Today's total screen time in minutes (read-only) */
  todayScreenMinutes: number;
  scheduleRules: ScheduleRule[];
  limitingFeatures: LimitingFeatures;
  userName: string;
};

const defaultLimiting: LimitingFeatures = {
  greyscaleEnabled: false,
  greyscaleAfterMinutes: 120,
  autoBlockAppEnabled: false,
  autoBlockAfterMinutes: 180,
};

const defaultSchedule: ScheduleRule[] = [
  { id: "wd", label: "Weekdays", days: [1, 2, 3, 4, 5], limitMinutes: 180, suggestedByAi: true },
  { id: "we", label: "Weekend", days: [0, 6], limitMinutes: 240, suggestedByAi: true },
];

const initialState: AppState = {
  hasCompletedOnboarding: false,
  userDailyGoalHours: 3,
  trackedApps: [],
  streakUnderLimitDays: 0,
  todayScreenMinutes: 222, // 3h 42m in minutes
  scheduleRules: defaultSchedule,
  limitingFeatures: defaultLimiting,
  userName: "Jane Smith",
};

type AppContextValue = AppState & {
  setAppBlocked: (appName: string, blocked: boolean) => void;
  addTrackedApp: (app: Omit<TrackedApp, "blocked" | "todayMinutes" | "dailyLimitMinutes">) => void;
  removeTrackedApp: (appName: string) => void;
  setLimitingFeatures: (patch: Partial<LimitingFeatures>) => void;
  setScheduleRules: (rules: ScheduleRule[]) => void;
  finishOnboarding: (opts: { dailyGoalHours: number; trackedApps: TrackedApp[] }) => void;
  /** For demo: set streak (in real app would be computed from history) */
  setStreakUnderLimitDays: (days: number) => void;
};

const AppContext = createContext<AppContextValue | null>(null);

const STORAGE_KEY = "doomscrolling-app-state";

function loadState(): Partial<AppState> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Partial<AppState>) : null;
  } catch {
    return null;
  }
}

function saveState(state: AppState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => {
    const loaded = loadState();
    if (loaded) {
      return {
        ...initialState,
        ...loaded,
        hasCompletedOnboarding: loaded.hasCompletedOnboarding ?? (Array.isArray(loaded.trackedApps) && loaded.trackedApps.length > 0),
        trackedApps: Array.isArray(loaded.trackedApps) ? loaded.trackedApps : initialState.trackedApps,
        userDailyGoalHours: loaded.userDailyGoalHours ?? initialState.userDailyGoalHours,
        scheduleRules: loaded.scheduleRules ?? initialState.scheduleRules,
        limitingFeatures: loaded.limitingFeatures ?? initialState.limitingFeatures,
      };
    }
    return initialState;
  });

  const persist = useCallback((next: AppState) => {
    setState(next);
    saveState(next);
  }, []);

  const setAppBlocked = useCallback(
    (appName: string, blocked: boolean) => {
      persist({
        ...state,
        trackedApps: state.trackedApps.map((a) =>
          a.name === appName ? { ...a, blocked } : a
        ),
      });
    },
    [state, persist]
  );

  const addTrackedApp = useCallback(
    (app: Omit<TrackedApp, "blocked" | "todayMinutes" | "dailyLimitMinutes">) => {
      if (state.trackedApps.some((a) => a.name === app.name)) return;
      persist({
        ...state,
        trackedApps: [
          ...state.trackedApps,
          {
            ...app,
            blocked: false,
            todayMinutes: 0,
            dailyLimitMinutes: 0,
          },
        ],
      });
    },
    [state, persist]
  );

  const removeTrackedApp = useCallback(
    (appName: string) => {
      persist({
        ...state,
        trackedApps: state.trackedApps.filter((a) => a.name !== appName),
      });
    },
    [state, persist]
  );

  const setLimitingFeatures = useCallback(
    (patch: Partial<LimitingFeatures>) => {
      persist({
        ...state,
        limitingFeatures: { ...state.limitingFeatures, ...patch },
      });
    },
    [state, persist]
  );

  const setScheduleRules = useCallback(
    (rules: ScheduleRule[]) => {
      persist({ ...state, scheduleRules: rules });
    },
    [state, persist]
  );

  const finishOnboarding = useCallback(
    (opts: { dailyGoalHours: number; trackedApps: TrackedApp[] }) => {
      persist({
        ...state,
        hasCompletedOnboarding: true,
        userDailyGoalHours: opts.dailyGoalHours,
        trackedApps: opts.trackedApps,
      });
    },
    [state, persist]
  );

  const setStreakUnderLimitDays = useCallback(
    (days: number) => {
      persist({ ...state, streakUnderLimitDays: days });
    },
    [state, persist]
  );

  return (
    <AppContext.Provider
      value={{
        ...state,
        setAppBlocked,
        addTrackedApp,
        removeTrackedApp,
        setLimitingFeatures,
        setScheduleRules,
        finishOnboarding,
        setStreakUnderLimitDays,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
