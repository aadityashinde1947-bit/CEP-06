import { useEffect } from "react";
import { POINTS_PER_REPORT } from "../data.js";

/** Full-screen reward moment shown after a report is submitted. */
export default function SuccessOverlay({ title, leveledTo, onDone }) {
  // Auto-return to the dashboard; the button lets people skip the wait.
  useEffect(() => {
    const t = setTimeout(onDone, 3800);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-abyss" role="dialog" aria-modal="true" aria-label="Report submitted"
      style={{ position: "absolute", inset: 0, zIndex: 50, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", padding: 28, textAlign: "center",
        animation: "fade-in .25s ease-out" }}>
      <div style={{ position: "relative", width: 96, height: 96, marginBottom: 28 }}>
        {[0, 0.5, 1].map((delay) => (
          <span key={delay} aria-hidden="true"
            style={{ position: "absolute", left: "50%", top: "50%", width: 96, height: 96, borderRadius: "50%",
              border: "2px solid #5CC3DB", animation: `ring-out 1.8s ease-out ${delay}s infinite` }} />
        ))}
        <div className="bg-shallows" style={{ position: "relative", width: 96, height: 96, borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center", animation: "pop-in .5s ease-out" }}>
          <svg width="56" height="56" viewBox="0 0 64 64" fill="none" aria-hidden="true">
            <path d="M16 33 L28 45 L49 21" stroke="#062A40" strokeWidth="6" strokeLinecap="round"
              strokeLinejoin="round" strokeDasharray="60" strokeDashoffset="60"
              style={{ animation: "draw .5s ease-out .3s forwards" }} />
          </svg>
        </div>
      </div>

      <h2 className="font-display text-white" style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.1,
        animation: "pop-in .5s ease-out .5s both" }}>
        +{POINTS_PER_REPORT} Eco-Points Earned!
      </h2>
      <p className="text-mist" style={{ marginTop: 12, maxWidth: 280, lineHeight: 1.5 }}>
        Thanks for reporting "{title}". Your report is saved.
      </p>
      {leveledTo && (
        <p className="bg-deep text-shallows font-semibold"
          style={{ marginTop: 16, padding: "8px 14px", borderRadius: 999, animation: "pop-in .5s ease-out 1s both" }}>
          Level up! You're now a {leveledTo}.
        </p>
      )}
      <button type="button" className="btn btn-shallows" onClick={onDone} style={{ marginTop: 32, maxWidth: 280 }}>
        Back to dashboard
      </button>
    </div>
  );
}
