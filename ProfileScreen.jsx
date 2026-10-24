import { Waves, ClipboardList, LogOut } from "lucide-react";
import { ReportCard, SectionTitle } from "../components.jsx";
import { getLevelInfo } from "../data.js";

export default function ProfileScreen({ user, points, reports, doneCount, onSignOut, onUpgrade }) {
  const info = getLevelInfo(points);
  const stats = [
    ["Eco-Points", points],
    ["Reports", reports.length],
    ["Habits today", doneCount],
  ];

  return (
    <div style={{ padding: "24px 20px 28px" }}>
      <div className="flex items-center" style={{ gap: 14 }}>
        <div className="bg-abyss text-shallows" style={{ width: 60, height: 60, borderRadius: 20, display: "flex",
          alignItems: "center", justifyContent: "center" }}>
          <Waves size={28} />
        </div>
        <div>
          <h1 className="font-display text-abyss text-2xl" style={{ fontWeight: 800, lineHeight: 1.1 }}>{user.name}</h1>
          <p className="text-sm text-slate-600">
            {user.type === "guest" ? `${user.id}, temporary account` : user.email || "Member"}
          </p>
          <p className="text-sm font-semibold text-ocean">{info.current.name}</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginTop: 20 }}>
        {stats.map(([label, value]) => (
          <div key={label} className="bg-foam" style={{ padding: "14px 8px", borderRadius: 16, textAlign: "center" }}>
            <p className="font-display text-abyss text-2xl" style={{ fontWeight: 800 }}>{value}</p>
            <p className="text-xs text-slate-600">{label}</p>
          </div>
        ))}
      </div>

      {user.type === "guest" && (
        <div className="bg-abyss" style={{ marginTop: 18, padding: 16, borderRadius: 20 }}>
          <p className="text-white font-semibold">Keep your progress</p>
          <p className="text-mist text-sm" style={{ margin: "4px 0 12px", lineHeight: 1.45 }}>
            Guest data lives only in this session. Create an account to save your points and reports.
          </p>
          <button type="button" className="btn btn-shallows" onClick={onUpgrade}>Create an account</button>
        </div>
      )}

      <SectionTitle>My reports</SectionTitle>
      {reports.length === 0 ? (
        <div className="bg-foam" style={{ padding: 18, borderRadius: 18, textAlign: "center" }}>
          <ClipboardList size={26} className="text-ocean" style={{ margin: "0 auto 8px" }} />
          <p className="text-slate-600 text-sm">No reports yet. Use Report to log your first incident.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {reports.map((r) => <ReportCard key={r.id} report={r} />)}
        </div>
      )}

      <button type="button" className="btn btn-outline" onClick={onSignOut} style={{ marginTop: 26 }}>
        <LogOut size={18} /> Sign out
      </button>
    </div>
  );
}
