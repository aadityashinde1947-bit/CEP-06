import { Camera } from "lucide-react";
import { WaterVessel, ProgressBar, ReportCard, SectionTitle } from "../components.jsx";
import {
  LEVELS, ALL_TIPS, HOME_TIPS, POINTS_PER_REPORT, POINTS_PER_TIP, getLevelInfo,
} from "../data.js";

export default function HomeScreen({ user, points, doneCount, reports, onReport, onOpenLearn, onOpenProfile }) {
  const info = getLevelInfo(points);

  return (
    <div style={{ paddingBottom: 28 }}>
      {/* Header: greeting, vessel, rank */}
      <header className="bg-abyss" style={{ padding: "24px 20px 54px", borderRadius: "0 0 32px 32px" }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-mist text-sm">Hello,</p>
            <h1 className="font-display text-white text-2xl" style={{ fontWeight: 800 }}>{user.name}</h1>
          </div>
          <span className="bg-deep text-mist text-xs font-semibold" style={{ padding: "6px 10px", borderRadius: 999 }}>
            {user.type === "guest" ? user.id : "Member"}
          </span>
        </div>

        <div className="flex items-center" style={{ gap: 20, marginTop: 22 }}>
          <WaterVessel points={points} progress={info.progress} />
          <div style={{ minWidth: 0 }}>
            <p className="text-shallows text-sm font-semibold">Your rank</p>
            <p className="font-display text-white" style={{ fontSize: 26, fontWeight: 800, lineHeight: 1.1 }}>
              {info.current.name}
            </p>
            <div className="flex" style={{ gap: 4, margin: "10px 0 8px" }} aria-hidden="true">
              {LEVELS.map((l, i) => (
                <span key={l.name} style={{ width: 22, height: 6, borderRadius: 3,
                  background: i <= info.index ? "#5CC3DB" : "#0B4F6C" }} />
              ))}
            </div>
            <p className="text-mist text-sm">
              {info.next
                ? `${info.toNext} more points to reach ${info.next.name}`
                : "You've reached the top rank"}
            </p>
          </div>
        </div>
      </header>

      {/* Primary action, overlapping the header */}
      <div style={{ padding: "0 20px", marginTop: -28 }}>
        <button type="button" className="btn btn-primary" onClick={onReport}
          style={{ padding: "16px 18px", justifyContent: "space-between", textAlign: "left",
            boxShadow: "0 12px 26px rgba(6,42,64,.28)" }}>
          <span className="flex items-center" style={{ gap: 12 }}>
            <span className="bg-deep" style={{ width: 42, height: 42, borderRadius: 14, display: "flex",
              alignItems: "center", justifyContent: "center" }}>
              <Camera size={22} />
            </span>
            <span>
              <span style={{ display: "block", fontSize: 18 }}>Report pollution</span>
              <span style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#CFE6EE" }}>
                Mark the spot and add evidence
              </span>
            </span>
          </span>
          <span className="bg-white text-ocean font-bold" style={{ padding: "6px 10px", borderRadius: 999, fontSize: 14 }}>
            +{POINTS_PER_REPORT}
          </span>
        </button>
      </div>

      <div style={{ padding: "0 20px" }}>
        {/* Daily habits summary */}
        <button type="button" onClick={onOpenLearn} className="bg-foam"
          style={{ width: "100%", marginTop: 18, padding: 16, borderRadius: 20, border: 0, textAlign: "left" }}>
          <div className="flex items-center justify-between" style={{ marginBottom: 10 }}>
            <span className="font-semibold text-abyss">Today's habits</span>
            <span className="text-sm font-semibold text-ocean">{doneCount} of {ALL_TIPS.length} done</span>
          </div>
          <ProgressBar value={doneCount / ALL_TIPS.length} />
          <p className="text-sm text-slate-600" style={{ marginTop: 8 }}>
            Check off habits to earn +{POINTS_PER_TIP} points each.
          </p>
        </button>

        {/* Recent reports */}
        {reports.length > 0 && (
          <>
            <SectionTitle
              action={
                <button type="button" onClick={onOpenProfile} className="text-ocean text-sm font-semibold"
                  style={{ background: "none", border: 0 }}>
                  See all
                </button>
              }>
              Your recent reports
            </SectionTitle>
            <div style={{ display: "grid", gap: 10 }}>
              {reports.slice(0, 2).map((r) => <ReportCard key={r.id} report={r} />)}
            </div>
          </>
        )}

        {/* Tips feed */}
        <SectionTitle
          action={
            <button type="button" onClick={onOpenLearn} className="text-ocean text-sm font-semibold"
              style={{ background: "none", border: 0 }}>
              See all tips
            </button>
          }>
          Ways to keep water clean
        </SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {HOME_TIPS.map((tip) => {
            const Icon = tip.icon;
            return (
              <button key={tip.id} type="button" onClick={onOpenLearn} className="bg-white border border-mist"
                style={{ textAlign: "left", padding: 14, borderRadius: 18 }}>
                <span className="bg-foam text-ocean" style={{ width: 36, height: 36, borderRadius: 11, display: "flex",
                  alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                  <Icon size={18} />
                </span>
                <span className="text-ink font-semibold text-sm" style={{ display: "block", lineHeight: 1.3 }}>
                  {tip.title}
                </span>
                <span className="text-xs text-slate-500" style={{ display: "block", marginTop: 6 }}>
                  {tip.categoryTitle}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
