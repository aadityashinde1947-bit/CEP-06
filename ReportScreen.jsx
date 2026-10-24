import { useState } from "react";
import {
  MapPin, LocateFixed, ChevronLeft, ChevronDown, Check, X, Camera, Video,
  Image as ImageIcon,
} from "lucide-react";
import { Field } from "../components.jsx";
import {
  POLLUTION_TYPES, POINTS_PER_REPORT, MAP_ORIGIN, clamp01, wait, getLevelInfo, mockApi,
} from "../data.js";

/** Custom dropdown so each pollution type can show its icon. */
function TypeSelect({ value, onChange, error }) {
  const [open, setOpen] = useState(false);
  const selected = POLLUTION_TYPES.find((t) => t.id === value);
  const SelectedIcon = selected ? selected.icon : null;

  return (
    <div style={{ marginBottom: 14 }}>
      <p id="type-label" className="text-sm font-semibold text-ink" style={{ marginBottom: 6 }}>
        Type of pollution
      </p>
      <button type="button" aria-haspopup="listbox" aria-expanded={open} aria-labelledby="type-label"
        onClick={() => setOpen((o) => !o)}
        className={`field ${error ? "field-error" : ""}`}
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", textAlign: "left" }}>
        <span className="flex items-center gap-2" style={{ color: selected ? "#0E2A38" : "#6B8795" }}>
          {SelectedIcon && <SelectedIcon size={18} className="text-ocean" />}
          {selected ? selected.label : "Choose a type"}
        </span>
        <ChevronDown size={18} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
      </button>

      {open && (
        <ul role="listbox" aria-labelledby="type-label" className="border border-mist"
          style={{ marginTop: 8, borderRadius: 14, overflow: "hidden", background: "#fff", listStyle: "none", padding: 0 }}>
          {POLLUTION_TYPES.map((t) => {
            const Icon = t.icon;
            const active = t.id === value;
            return (
              <li key={t.id} role="presentation">
                <button type="button" role="option" aria-selected={active}
                  onClick={() => { onChange(t.id); setOpen(false); }}
                  className={active ? "bg-foam" : "bg-white"}
                  style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "12px 14px",
                    border: 0, textAlign: "left", fontSize: 16, color: "#0E2A38" }}>
                  <Icon size={18} className="text-ocean" />
                  <span style={{ flex: 1 }}>{t.label}</span>
                  {active && <Check size={18} className="text-ocean" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
      {error && <p role="alert" className="text-warn text-sm" style={{ marginTop: 4 }}>{error}</p>}
    </div>
  );
}

/** Stylised map. Tap anywhere to drop a pin (mock GPS selector). */
function MapPicker({ pin, onPick }) {
  const handleTap = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    onPick(clamp01((e.clientX - r.left) / r.width), clamp01((e.clientY - r.top) / r.height));
  };

  return (
    <div
      role="button" tabIndex={0}
      aria-label="Map. Tap to drop a pin on the pollution location."
      onClick={handleTap}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onPick(0.5, 0.5)}
      style={{ position: "relative", width: "100%", aspectRatio: "3 / 2", borderRadius: 20,
        overflow: "hidden", cursor: "crosshair", border: "1.5px solid #CFE6EE" }}
    >
      <svg viewBox="0 0 360 240" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" aria-hidden="true">
        <rect width="360" height="240" fill="#F2F7F8" />
        {/* streets */}
        <g stroke="#DCE9EE" strokeWidth="3">
          <path d="M0 40 H140 M0 90 H110 M0 200 H150 M40 0 V240 M80 0 V150" />
        </g>
        {/* city blocks */}
        <g fill="#E1EEF2">
          <rect x="48" y="48" width="26" height="34" rx="3" /><rect x="88" y="98" width="22" height="30" rx="3" />
          <rect x="10" y="98" width="24" height="40" rx="3" /><rect x="50" y="208" width="30" height="22" rx="3" />
          <rect x="296" y="12" width="40" height="30" rx="3" />
        </g>
        {/* sea and coast */}
        <path fill="#BFE3EE" d="M215 0 C195 50 170 80 190 120 C208 160 175 200 200 240 H360 V0 Z" />
        <path fill="none" stroke="#9FD3E3" strokeWidth="2" d="M215 0 C195 50 170 80 190 120 C208 160 175 200 200 240" />
        {/* river */}
        <path fill="none" stroke="#BFE3EE" strokeWidth="11" strokeLinecap="round"
          d="M0 160 C50 150 80 178 125 156 S180 112 192 118" />
        {/* far shore */}
        <path fill="#F2F7F8" d="M330 150 C310 170 318 205 305 240 H360 V150 Z" />
      </svg>

      {pin && (
        <>
          <span key={`ring-${pin.fx}-${pin.fy}`} aria-hidden="true"
            style={{ position: "absolute", left: `${pin.fx * 100}%`, top: `${pin.fy * 100}%`, width: 26, height: 26,
              borderRadius: "50%", background: "#0A7EA4", animation: "ring-out 1.2s ease-out 2" }} />
          <span key={`pin-${pin.fx}-${pin.fy}`} aria-hidden="true"
            style={{ position: "absolute", left: `${pin.fx * 100}%`, top: `${pin.fy * 100}%`,
              transform: "translate(-50%,-100%)", animation: "drop-pin .45s ease-out", lineHeight: 0 }}>
            <MapPin size={38} color="#fff" fill="#0A7EA4" strokeWidth={1.8} />
          </span>
        </>
      )}
      {!pin && (
        <span className="bg-abyss text-white text-xs font-semibold"
          style={{ position: "absolute", left: 10, bottom: 10, padding: "6px 10px", borderRadius: 999 }}>
          Tap the map to drop a pin
        </span>
      )}
    </div>
  );
}

function StepHeader({ step, onBack }) {
  const titles = ["What happened", "Where it is", "Details and evidence"];
  return (
    <div style={{ padding: "20px 20px 4px" }}>
      <div className="flex items-center" style={{ gap: 8 }}>
        <button type="button" onClick={onBack} aria-label="Go back" className="bg-foam text-abyss"
          style={{ width: 38, height: 38, borderRadius: 12, border: 0, display: "flex",
            alignItems: "center", justifyContent: "center" }}>
          <ChevronLeft size={22} />
        </button>
        <div>
          <p className="text-sm text-slate-500">Report pollution, step {step + 1} of 3</p>
          <h1 className="font-display text-abyss text-2xl" style={{ fontWeight: 800, lineHeight: 1.1 }}>
            {titles[step]}
          </h1>
        </div>
      </div>
      <div className="flex" style={{ gap: 6, marginTop: 14 }} aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <span key={i} className={i <= step ? "bg-ocean" : "bg-mist"}
            style={{ flex: 1, height: 5, borderRadius: 3, transition: "background .3s" }} />
        ))}
      </div>
    </div>
  );
}

export default function ReportScreen({ points, onCancel, onSubmit }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ title: "", type: "", landmark: "", description: "" });
  const [pin, setPin] = useState(null); // { fx, fy, lat, lng }
  const [evidence, setEvidence] = useState([]); // mock attachments
  const [errors, setErrors] = useState({});
  const [locating, setLocating] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const update = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: undefined }));
  };

  /** Convert a tap position (0 to 1) into mock GPS coordinates. */
  const pickLocation = (fx, fy) => {
    setPin({
      fx, fy,
      lat: MAP_ORIGIN.lat + (0.5 - fy) * 0.06,
      lng: MAP_ORIGIN.lng + (fx - 0.5) * 0.09,
    });
    setErrors((er) => ({ ...er, pin: undefined }));
  };

  /** Mock "use my current location": waits briefly, then drops a pin near the middle. */
  const useCurrentLocation = async () => {
    setLocating(true);
    await wait(900);
    pickLocation(0.4 + Math.random() * 0.12, 0.38 + Math.random() * 0.2);
    setLocating(false);
  };

  /** Mock camera/gallery: adds a placeholder attachment instead of opening a real picker. */
  const addEvidence = (kind) => {
    setEvidence((list) => {
      if (list.length >= 4) return list;
      const n = list.filter((e) => e.kind === kind).length + 1;
      return [...list, {
        id: `${kind}-${Date.now()}-${n}`, kind,
        name: kind === "photo" ? `photo_${n}.jpg` : `clip_${n}.mp4`,
      }];
    });
  };

  const validateStep = (s) => {
    const e = {};
    if (s === 0) {
      if (!form.title.trim()) e.title = "Add a short title for the incident.";
      if (!form.type) e.type = "Choose the type of pollution.";
    }
    if (s === 1 && !pin) e.pin = "Tap the map or use your current location to mark the spot.";
    if (s === 2 && form.description.trim().length < 10) {
      e.description = "Describe what you saw in at least 10 characters.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => validateStep(step) && setStep(step + 1);
  const back = () => (step === 0 ? onCancel() : setStep(step - 1));

  const submit = async () => {
    if (submitting || !validateStep(2)) return;
    setSubmitting(true);
    const label = form.landmark.trim() || `${pin.lat.toFixed(4)}, ${pin.lng.toFixed(4)}`;
    const report = await mockApi.submitReport({
      title: form.title.trim(),
      type: form.type,
      description: form.description.trim(),
      location: { lat: pin.lat, lng: pin.lng, label },
      evidence,
    });
    const before = getLevelInfo(points).current.name;
    const after = getLevelInfo(points + POINTS_PER_REPORT).current.name;
    onSubmit(report, after !== before ? after : null);
  };

  const typeLabel = POLLUTION_TYPES.find((t) => t.id === form.type)?.label;

  return (
    <div style={{ paddingBottom: 28 }}>
      <StepHeader step={step} onBack={back} />

      <div style={{ padding: "18px 20px 0" }}>
        {/* Step 1: what happened */}
        {step === 0 && (
          <>
            <Field label="Incident title" value={form.title} onChange={update("title")} maxLength={80}
              placeholder="e.g. Oil sheen near the boat ramp" error={errors.title} />
            <TypeSelect value={form.type} error={errors.type}
              onChange={(id) => { setForm((f) => ({ ...f, type: id })); setErrors((er) => ({ ...er, type: undefined })); }} />
          </>
        )}

        {/* Step 2: where it is */}
        {step === 1 && (
          <>
            <MapPicker pin={pin} onPick={pickLocation} />
            {errors.pin && <p role="alert" className="text-warn text-sm" style={{ marginTop: 8 }}>{errors.pin}</p>}

            <button type="button" className="btn btn-outline" onClick={useCurrentLocation} disabled={locating}
              style={{ marginTop: 12 }}>
              {locating ? <span className="spinner" aria-label="Locating" /> : <LocateFixed size={18} className="text-ocean" />}
              {locating ? "Finding your location" : "Use my current location"}
            </button>

            {pin && (
              <p className="text-sm text-slate-600" style={{ margin: "12px 0 4px" }}>
                Pin set at <strong>{pin.lat.toFixed(4)}, {pin.lng.toFixed(4)}</strong>
              </p>
            )}
            <div style={{ marginTop: 14 }}>
              <Field label="Nearby landmark (optional)" icon={MapPin} value={form.landmark}
                onChange={update("landmark")} placeholder="e.g. Under the red footbridge" />
            </div>
          </>
        )}

        {/* Step 3: description, evidence, review */}
        {step === 2 && (
          <>
            <Field label="Description" multiline value={form.description} onChange={update("description")}
              maxLength={400} placeholder="What do you see, smell or notice? How large is the affected area?"
              error={errors.description} />

            <p className="text-sm font-semibold text-ink" style={{ marginBottom: 8 }}>Photo or video evidence</p>
            <div style={{ display: "flex", gap: 10 }}>
              <button type="button" className="btn btn-outline" onClick={() => addEvidence("photo")}
                disabled={evidence.length >= 4}>
                <Camera size={18} className="text-ocean" /> Add photo
              </button>
              <button type="button" className="btn btn-outline" onClick={() => addEvidence("video")}
                disabled={evidence.length >= 4}>
                <Video size={18} className="text-ocean" /> Add video
              </button>
            </div>
            <p className="text-xs text-slate-500" style={{ marginTop: 6 }}>
              Prototype only: attachments are placeholders. Up to 4.
            </p>

            {evidence.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 12 }}>
                {evidence.map((item, i) => {
                  const Icon = item.kind === "photo" ? ImageIcon : Video;
                  return (
                    <div key={item.id} className={i % 2 ? "bg-deep" : "bg-ocean"}
                      style={{ position: "relative", height: 88, borderRadius: 14, color: "#fff",
                        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                      <Icon size={24} />
                      <span className="text-xs font-semibold" style={{ marginTop: 6 }}>{item.name}</span>
                      <button type="button" aria-label={`Remove ${item.name}`}
                        onClick={() => setEvidence((list) => list.filter((e) => e.id !== item.id))}
                        className="bg-abyss"
                        style={{ position: "absolute", top: 6, right: 6, width: 26, height: 26, borderRadius: "50%",
                          border: 0, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <X size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="bg-foam" style={{ marginTop: 18, padding: 14, borderRadius: 16 }}>
              <p className="font-semibold text-abyss">{form.title}</p>
              <p className="text-sm text-slate-600">
                {typeLabel} at {form.landmark.trim() || (pin && `${pin.lat.toFixed(4)}, ${pin.lng.toFixed(4)}`)}
              </p>
            </div>
          </>
        )}

        {/* Navigation buttons */}
        <div style={{ marginTop: 22 }}>
          {step < 2 ? (
            <button type="button" className="btn btn-primary" onClick={next}>Continue</button>
          ) : (
            <button type="button" className="btn btn-primary" onClick={submit} disabled={submitting}>
              {submitting && <span className="spinner" aria-label="Submitting" />}
              {submitting ? "Submitting" : `Submit report (+${POINTS_PER_REPORT} Eco-Points)`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
