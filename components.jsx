/* Shared UI pieces: WaterVessel, Field, ProgressBar, ReportCard, SectionTitle. */
import { Droplets } from "lucide-react";
import { POLLUTION_TYPES, clamp01, timeAgo } from "./data.js";

/** One looping wave strip. Two of these are layered inside the vessel. */
function WaveStrip({ color, top, duration, reverse }) {
  return (
    <svg
      viewBox="0 0 240 12"
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{
        position: "absolute", top, left: 0, width: "200%", height: 12,
        animation: `wave-slide ${duration}s linear infinite ${reverse ? "reverse" : "normal"}`,
      }}
    >
      <path
        fill={color}
        d="M0 6 Q15 0 30 6 T60 6 T90 6 T120 6 T150 6 T180 6 T210 6 T240 6 V12 H0 Z"
      />
    </svg>
  );
}

/**
 * The signature element: a round vessel whose water level shows
 * progress toward the next rank. Eco-Points sit in the middle.
 */
export function WaterVessel({ points, progress, size = 136 }) {
  const level = Math.max(0.07, progress);
  return (
    <div
      role="img"
      aria-label={`${points} Eco-Points`}
      style={{
        position: "relative", width: size, height: size, borderRadius: "50%",
        overflow: "hidden", background: "#0B3A55", border: "4px solid #1B6F90", flexShrink: 0,
      }}
    >
      <div
        style={{
          position: "absolute", inset: 0,
          transform: `translateY(${(1 - level) * 100}%)`,
          transition: "transform 1.4s cubic-bezier(.22,.8,.2,1)",
        }}
      >
        <WaveStrip color="#5CC3DB" top={-11} duration={5} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, background: "#5CC3DB" }} />
        <WaveStrip color="#0A7EA4" top={-5} duration={7} reverse />
        <div style={{ position: "absolute", left: 0, right: 0, top: 6, bottom: 0, background: "#0A7EA4" }} />
      </div>
      <div
        style={{
          position: "absolute", inset: 0, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", color: "#fff",
          textShadow: "0 1px 6px rgba(6,42,64,.6)",
        }}
      >
        <span className="font-display" style={{ fontSize: 38, fontWeight: 800, lineHeight: 1 }}>
          {points}
        </span>
        <span style={{ fontSize: 13, fontWeight: 600, marginTop: 4 }}>Eco-Points</span>
      </div>
    </div>
  );
}

/** Labelled text input with optional leading icon, trailing slot and error text. */
export function Field({ label, icon: Icon, error, right, multiline, ...props }) {
  const Tag = multiline ? "textarea" : "input";
  return (
    <div style={{ marginBottom: 14 }}>
      <label className="text-sm font-semibold text-ink" style={{ display: "block", marginBottom: 6 }}>
        {label}
        <div style={{ position: "relative", marginTop: 6, fontWeight: 400 }}>
          {Icon && (
            <Icon size={18} color="#6B8795"
              style={{ position: "absolute", left: 14, top: multiline ? 15 : 14 }} />
          )}
          <Tag
            className={`field ${error ? "field-error" : ""}`}
            style={{ paddingLeft: Icon ? 42 : 14, paddingRight: right ? 46 : 14, resize: "none" }}
            aria-invalid={!!error}
            rows={multiline ? 4 : undefined}
            {...props}
          />
          {right && <div style={{ position: "absolute", right: 8, top: 6 }}>{right}</div>}
        </div>
      </label>
      {error && (
        <p role="alert" className="text-warn text-sm" style={{ marginTop: 2 }}>{error}</p>
      )}
    </div>
  );
}

export function ProgressBar({ value, height = 8 }) {
  return (
    <div className="bg-mist" style={{ height, borderRadius: height, overflow: "hidden" }}>
      <div
        className="bg-ocean"
        style={{
          height: "100%", width: `${Math.round(clamp01(value) * 100)}%`,
          borderRadius: height, transition: "width .5s ease",
        }}
      />
    </div>
  );
}

/** A submitted incident, used on Home and Profile. */
export function ReportCard({ report }) {
  const type = POLLUTION_TYPES.find((t) => t.id === report.type);
  const Icon = type ? type.icon : Droplets;
  return (
    <div className="bg-white border border-mist" style={{ borderRadius: 18, padding: 14, display: "flex", gap: 12 }}>
      <div className="bg-foam text-ocean" style={{ width: 42, height: 42, borderRadius: 12, display: "flex",
        alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon size={20} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p className="font-semibold text-ink">{report.title}</p>
        <p className="text-sm text-slate-600">
          {type ? type.label : "Pollution"} near {report.location.label}
        </p>
        <div className="flex items-center gap-2" style={{ marginTop: 6 }}>
          <span className="bg-foam text-ocean text-xs font-bold" style={{ padding: "3px 8px", borderRadius: 999 }}>
            {report.status}
          </span>
          <span className="text-xs text-slate-500">{timeAgo(report.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}

export function SectionTitle({ children, action }) {
  return (
    <div className="flex items-center justify-between" style={{ margin: "26px 0 12px" }}>
      <h2 className="font-display text-xl text-abyss" style={{ fontWeight: 800 }}>{children}</h2>
      {action}
    </div>
  );
}
