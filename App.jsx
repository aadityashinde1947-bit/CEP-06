import { useState, useEffect, useRef } from "react";
import { Home, BookOpen, User, Plus, Sparkles } from "lucide-react";
import AuthScreen from "./screens/AuthScreen.jsx";
import HomeScreen from "./screens/HomeScreen.jsx";
import ReportScreen from "./screens/ReportScreen.jsx";
import LearnScreen from "./screens/LearnScreen.jsx";
import ProfileScreen from "./screens/ProfileScreen.jsx";
import SuccessOverlay from "./screens/SuccessOverlay.jsx";
import {
  LEVELS, POINTS_PER_REPORT, POINTS_PER_TIP, STARTING_POINTS, SEED_REPORTS,
  getLevelInfo, todayKey,
} from "./data.js";

const NAV_ITEMS = [
  { id: "home", label: "Home", icon: Home },
  { id: "report", label: "Report", icon: Plus, accent: true },
  { id: "learn", label: "Learn", icon: BookOpen },
  { id: "profile", label: "Profile", icon: User },
];

function BottomNav({ tab, onChange }) {
  return (
    <nav aria-label="Main" className="bg-white border-mist"
      style={{ display: "flex", borderTop: "1px solid #CFE6EE", padding: "8px 8px 12px", flexShrink: 0 }}>
      {NAV_ITEMS.map(({ id, label, icon: Icon, accent }) => {
        const active = tab === id;
        return (
          <button key={id} type="button" onClick={() => onChange(id)} aria-current={active ? "page" : undefined}
            style={{ flex: 1, background: "none", border: 0, display: "flex", flexDirection: "column",
              alignItems: "center", gap: 3, color: active ? "#0A7EA4" : "#5A7482", fontSize: 12, fontWeight: 600 }}>
            <span style={{ width: 40, height: 30, borderRadius: 15, display: "flex", alignItems: "center",
              justifyContent: "center",
              background: accent ? "#0A7EA4" : active ? "#EAF6FA" : "transparent",
              color: accent ? "#fff" : "inherit" }}>
              <Icon size={20} />
            </span>
            {label}
          </button>
        );
      })}
    </nav>
  );
}

export default function App() {
  // Session
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState("signin");
  const [tab, setTab] = useState("home");

  // Game state (all local; swap for server state later)
  const [points, setPoints] = useState(STARTING_POINTS);
  const [reports, setReports] = useState(SEED_REPORTS);
  const [tipLog, setTipLog] = useState({ day: todayKey(), ids: [] });

  // Feedback
  const [toast, setToast] = useState(null);
  const [celebration, setCelebration] = useState(null);

  const mainRef = useRef(null);

  // Habits reset automatically when the calendar day changes.
  const doneIds = tipLog.day === todayKey() ? tipLog.ids : [];

  useEffect(() => {
    if (mainRef.current) mainRef.current.scrollTo({ top: 0 });
  }, [tab]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(t);
  }, [toast]);

  /** Check or uncheck a daily tip. Unchecking removes the bonus so points can't be farmed. */
  const handleToggleTip = (tip) => {
    const wasDone = doneIds.includes(tip.id);
    const nextPoints = Math.max(0, points + (wasDone ? -POINTS_PER_TIP : POINTS_PER_TIP));
    setTipLog({
      day: todayKey(),
      ids: wasDone ? doneIds.filter((id) => id !== tip.id) : [...doneIds, tip.id],
    });
    setPoints(nextPoints);
    if (!wasDone) {
      const before = getLevelInfo(points).index;
      const after = getLevelInfo(nextPoints).index;
      if (after > before) setToast(`Level up! You're now a ${LEVELS[after].name}.`);
    }
  };

  /** Called by the report form. Saves the report, awards points and shows the celebration. */
  const handleSubmitReport = (report, leveledTo) => {
    setReports((list) => [report, ...list]);
    setPoints((p) => p + POINTS_PER_REPORT);
    setTab("home"); // dashboard updates behind the overlay
    setCelebration({ title: report.title, leveledTo });
  };

  const handleSignOut = (mode = "signin") => {
    setUser(null);
    setAuthMode(mode);
    setTab("home");
    setPoints(STARTING_POINTS);
    setReports(SEED_REPORTS);
    setTipLog({ day: todayKey(), ids: [] });
    setCelebration(null);
  };

  return (
    <div className="tw" style={{ minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", background: "#CFE6EE" }}>
      <div className="phone-shell bg-white" style={{ position: "relative", display: "flex",
        flexDirection: "column", overflow: "hidden" }}>
        {!user ? (
          <AuthScreen key={authMode} initialMode={authMode} onAuthed={(u) => { setUser(u); setTab("home"); }} />
        ) : (
          <>
            <main ref={mainRef} style={{ flex: 1, overflowY: "auto" }}>
              {tab === "home" && (
                <HomeScreen user={user} points={points} doneCount={doneIds.length} reports={reports}
                  onReport={() => setTab("report")} onOpenLearn={() => setTab("learn")}
                  onOpenProfile={() => setTab("profile")} />
              )}
              {tab === "report" && (
                <ReportScreen points={points} onCancel={() => setTab("home")} onSubmit={handleSubmitReport} />
              )}
              {tab === "learn" && <LearnScreen doneIds={doneIds} onToggle={handleToggleTip} />}
              {tab === "profile" && (
                <ProfileScreen user={user} points={points} reports={reports} doneCount={doneIds.length}
                  onSignOut={() => handleSignOut("signin")} onUpgrade={() => handleSignOut("signup")} />
              )}
            </main>
            <BottomNav tab={tab} onChange={setTab} />
          </>
        )}

        {toast && (
          <div role="status" aria-live="polite" className="bg-abyss text-white font-semibold text-sm"
            style={{ position: "absolute", left: "50%", bottom: 92, zIndex: 40, padding: "10px 16px",
              borderRadius: 999, display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap",
              boxShadow: "0 8px 24px rgba(6,42,64,.3)", animation: "toast-in .3s ease-out forwards" }}>
            <Sparkles size={16} className="text-shallows" /> {toast}
          </div>
        )}

        {celebration && <SuccessOverlay {...celebration} onDone={() => setCelebration(null)} />}
      </div>
    </div>
  );
}
