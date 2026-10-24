import { useState } from "react";
import { Check } from "lucide-react";
import { ProgressBar } from "../components.jsx";
import { TIP_CATEGORIES, ALL_TIPS, POINTS_PER_TIP } from "../data.js";

function TipRow({ tip, done, justChecked, onToggle }) {
  const Icon = tip.icon;
  return (
    <button type="button" role="checkbox" aria-checked={done} onClick={() => onToggle(tip)}
      className={`border ${done ? "bg-foam border-ocean" : "bg-white border-mist"}`}
      style={{ position: "relative", width: "100%", display: "flex", alignItems: "flex-start", gap: 12,
        textAlign: "left", padding: 14, borderRadius: 18, transition: "background .2s, border-color .2s" }}>
      <span style={{ marginTop: 2, width: 26, height: 26, borderRadius: 8, flexShrink: 0, display: "flex",
        alignItems: "center", justifyContent: "center",
        border: done ? "2px solid #0A7EA4" : "2px solid #9CC7D6",
        background: done ? "#0A7EA4" : "#fff", transition: "background .2s" }}>
        {done && <Check size={16} color="#fff" strokeWidth={3} />}
      </span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span className="flex items-center gap-2 font-semibold text-ink">
          <Icon size={16} className="text-ocean" style={{ flexShrink: 0 }} />
          <span>{tip.title}</span>
        </span>
        <span className="text-sm text-slate-600" style={{ display: "block", marginTop: 6, lineHeight: 1.45 }}>
          {tip.detail}
        </span>
      </span>
      {!done && <span className="text-xs font-bold text-ocean" style={{ marginTop: 4 }}>+{POINTS_PER_TIP}</span>}
      {justChecked && (
        <span aria-hidden="true" className="text-ocean font-bold"
          style={{ position: "absolute", right: 14, top: 10, animation: "float-up .9s ease-out forwards" }}>
          +{POINTS_PER_TIP}
        </span>
      )}
    </button>
  );
}

export default function LearnScreen({ doneIds, onToggle }) {
  const [justChecked, setJustChecked] = useState(null);
  const done = doneIds.length;

  const handleToggle = (tip) => {
    const willCheck = !doneIds.includes(tip.id);
    onToggle(tip);
    if (willCheck) {
      setJustChecked(tip.id);
      setTimeout(() => setJustChecked(null), 900);
    }
  };

  return (
    <div style={{ padding: "24px 20px 28px" }}>
      <h1 className="font-display text-abyss" style={{ fontSize: 30, fontWeight: 800, lineHeight: 1.1 }}>
        Keep water clean
      </h1>
      <p className="text-slate-600" style={{ marginTop: 8, lineHeight: 1.5 }}>
        Check off a habit once you've done it today. Each one earns +{POINTS_PER_TIP} Eco-Points, and the list resets tomorrow.
      </p>

      <div className="bg-foam" style={{ marginTop: 16, padding: 16, borderRadius: 20 }}>
        <div className="flex items-center justify-between" style={{ marginBottom: 10 }}>
          <span className="font-semibold text-abyss">{done} of {ALL_TIPS.length} done today</span>
          <span className="text-sm font-bold text-ocean">+{done * POINTS_PER_TIP} points</span>
        </div>
        <ProgressBar value={done / ALL_TIPS.length} />
        {done === ALL_TIPS.length && (
          <p className="text-sm text-abyss font-semibold" style={{ marginTop: 10 }}>
            Every habit done. Come back tomorrow for more.
          </p>
        )}
      </div>

      {TIP_CATEGORIES.map((cat) => {
        const catDone = cat.tips.filter((t) => doneIds.includes(t.id)).length;
        return (
          <section key={cat.id} aria-label={cat.title} style={{ marginTop: 26 }}>
            <div className="flex items-end justify-between" style={{ marginBottom: 10 }}>
              <div>
                <h2 className="font-display text-abyss text-xl" style={{ fontWeight: 800 }}>{cat.title}</h2>
                <p className="text-sm text-slate-500">{cat.subtitle}</p>
              </div>
              <span className="text-sm font-semibold text-ocean">{catDone}/{cat.tips.length}</span>
            </div>
            <div style={{ display: "grid", gap: 10 }}>
              {cat.tips.map((tip) => (
                <TipRow key={tip.id} tip={tip} done={doneIds.includes(tip.id)}
                  justChecked={justChecked === tip.id} onToggle={handleToggle} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
