import { useState } from "react";
import { Droplets, User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Field } from "../components.jsx";
import { mockApi, makeGuestId } from "../data.js";

export default function AuthScreen({ initialMode = "signin", onAuthed }) {
  const [mode, setMode] = useState(initialMode);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(null); // "form" | "Google" | "Apple" | null

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (mode === "signup" && !form.name.trim()) e.name = "Enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email address.";
    if (form.password.length < 6) e.password = "Use at least 6 characters.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (busy || !validate()) return;
    setBusy("form");
    onAuthed(await mockApi.authenticate({ mode, ...form }));
  };

  const social = async (provider) => {
    if (busy) return;
    setBusy(provider);
    onAuthed(await mockApi.socialSignIn(provider));
  };

  /** Guests get an instant, temporary ID. No network call needed. */
  const continueAsGuest = () => onAuthed({ type: "guest", id: makeGuestId(), name: "Guest" });

  return (
    <div className="bg-abyss" style={{ height: "100%", overflowY: "auto", display: "flex", flexDirection: "column" }}>
      {/* Brand + guest entry */}
      <div style={{ padding: "36px 24px 0" }}>
        <div className="flex items-center gap-2">
          <div className="bg-shallows text-abyss" style={{ width: 38, height: 38, borderRadius: 12,
            display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Droplets size={22} />
          </div>
          <span className="font-display text-white text-2xl" style={{ fontWeight: 800 }}>Water Guardian</span>
        </div>
        <h1 className="font-display text-white" style={{ fontSize: 32, lineHeight: 1.1, fontWeight: 800, marginTop: 28 }}>
          Spot pollution in the water? Report it.
        </h1>
        <p className="text-mist" style={{ marginTop: 10, lineHeight: 1.5 }}>
          Report incidents, learn what actually helps, and earn Eco-Points as you protect your local waterways.
        </p>

        <button type="button" className="btn btn-shallows" onClick={continueAsGuest}
          style={{ marginTop: 24, padding: "18px 20px", flexDirection: "column", gap: 2, fontSize: 18 }}>
          <span>Continue as guest</span>
          <span style={{ fontSize: 13, fontWeight: 500 }}>Get a temporary Guest ID and start right away</span>
        </button>
      </div>

      {/* Wave edge into the sign-in sheet */}
      <svg viewBox="0 0 1440 40" preserveAspectRatio="none" aria-hidden="true"
        style={{ display: "block", width: "100%", height: 30, marginTop: 20 }}>
        <path fill="#fff" d="M0 20 C240 40 480 0 720 20 C960 40 1200 0 1440 20 V40 H0 Z" />
      </svg>

      {/* Sign in / Sign up sheet */}
      <div
        style={{ background: "#fff", flex: 1, padding: "6px 24px 32px" }}
        onKeyDown={(e) => e.key === "Enter" && submit()}
      >
        <div className="bg-foam" role="tablist" style={{ display: "flex", padding: 4, borderRadius: 14, marginBottom: 18 }}>
          {[["signin", "Sign in"], ["signup", "Create account"]].map(([id, label]) => (
            <button key={id} type="button" role="tab" aria-selected={mode === id}
              onClick={() => { setMode(id); setErrors({}); }}
              style={{
                flex: 1, padding: "10px 0", borderRadius: 11, border: 0, fontWeight: 700, fontSize: 15,
                background: mode === id ? "#fff" : "transparent",
                color: mode === id ? "#062A40" : "#4B6B7B",
                boxShadow: mode === id ? "0 1px 4px rgba(6,42,64,.15)" : "none",
              }}>
              {label}
            </button>
          ))}
        </div>

        {mode === "signup" && (
          <Field label="Name" icon={User} value={form.name} onChange={set("name")}
            placeholder="Your name" autoComplete="name" error={errors.name} />
        )}
        <Field label="Email" icon={Mail} type="email" value={form.email} onChange={set("email")}
          placeholder="you@example.com" autoComplete="email" error={errors.email} />
        <Field label="Password" icon={Lock} type={showPw ? "text" : "password"} value={form.password}
          onChange={set("password")} placeholder="At least 6 characters" error={errors.password}
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
          right={
            <button type="button" onClick={() => setShowPw((s) => !s)}
              aria-label={showPw ? "Hide password" : "Show password"}
              style={{ background: "none", border: 0, padding: 8, color: "#6B8795" }}>
              {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          } />

        <button type="button" className="btn btn-primary" onClick={submit} disabled={!!busy}>
          {busy === "form" ? <span className="spinner" aria-label="Loading" /> : null}
          {mode === "signin" ? "Sign in" : "Create account"}
        </button>

        <p className="text-sm text-slate-500" style={{ textAlign: "center", margin: "18px 0 12px" }}>
          Or continue with
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          {["Google", "Apple"].map((p) => (
            <button key={p} type="button" className="btn btn-outline" onClick={() => social(p)} disabled={!!busy}>
              {busy === p ? <span className="spinner" aria-label="Loading" /> : null}
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
