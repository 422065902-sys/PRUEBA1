import { useState, useEffect, useRef } from "react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from "recharts";

// ─── CONSTANTS ──────────────────────────────────────────────────────────────
const ACCENT_OPTIONS = [
  { name: "Cyber Cyan",    value: "#00E5FF" },
  { name: "Neon Purple",   value: "#BF5FFF" },
  { name: "Matrix Green",  value: "#39FF14" },
  { name: "Solar Amber",   value: "#FFB800" },
  { name: "Plasma Pink",   value: "#FF2D78" },
  { name: "Ice Blue",      value: "#4FC3F7" },
];

const NAV_ITEMS = [
  { id: "dashboard", icon: "⊞", label: "Tablero"    },
  { id: "habits",    icon: "◈", label: "Hábitos"    },
  { id: "physical",  icon: "◉", label: "Físico"     },
  { id: "routines",  icon: "⊕", label: "Rutinas"    },
  { id: "financial", icon: "◈", label: "Financiero" },
  { id: "brain",     icon: "◎", label: "2° Cerebro" },
  { id: "goals",     icon: "◐", label: "Metas"      },
  { id: "agency",    icon: "⊛", label: "Agencia"    },
  { id: "settings",  icon: "⊙", label: "Ajustes"    },
];

// ─── CONFETTI ────────────────────────────────────────────────────────────────
function ConfettiEffect({ accent }) {
  const colors = [accent, "#FFD700", "#FF69B4", "#00CED1", "#FF6347", "#7B68EE", "#FF1493"];
  const pieces = Array.from({ length: 70 }, (_, i) => ({
    id: i,
    color: colors[i % colors.length],
    left: Math.random() * 100,
    delay: Math.random() * 0.6,
    dur: 1.5 + Math.random() * 1.2,
    size: 5 + Math.random() * 7,
    radius: Math.random() > 0.5 ? "50%" : Math.random() > 0.5 ? "2px" : "0%",
  }));
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999 }}>
      {pieces.map(p => (
        <div key={p.id} style={{
          position: "absolute",
          left: `${p.left}%`, top: -12,
          width: p.size, height: p.size,
          background: p.color,
          borderRadius: p.radius,
          animation: `confettiFall ${p.dur}s ${p.delay}s linear forwards`,
        }} />
      ))}
    </div>
  );
}

// ─── STRENGTH COIN MODAL ─────────────────────────────────────────────────────
function StrengthCoinModal({ onClose, theme }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10000,
    }}>
      <div style={{
        background: theme.surface, border: `2px solid ${theme.accent}`,
        borderRadius: 20, padding: "40px 48px", textAlign: "center", maxWidth: 340,
        boxShadow: `0 0 80px ${theme.accent}50`, animation: "coinPop 0.5s cubic-bezier(0.175,0.885,0.32,1.275)",
      }}>
        <div style={{ fontSize: 80, marginBottom: 12, lineHeight: 1 }}>🏅</div>
        <div style={{
          fontFamily: "'Orbitron', monospace", fontSize: 22, fontWeight: 800,
          color: theme.accent, letterSpacing: 2, marginBottom: 8,
        }}>¡NUEVO RÉCORD!</div>
        <p style={{ color: theme.text, fontSize: 16, marginBottom: 20 }}>
          Superaste tu marca personal anterior
        </p>
        <div style={{
          background: `${theme.accent}18`, border: `1px solid ${theme.accent}50`,
          borderRadius: 12, padding: "12px 28px", display: "inline-block", marginBottom: 28,
        }}>
          <span style={{ color: "#FFD700", fontWeight: 700, fontSize: 20 }}>
            +1 Moneda de Fuerza 💪
          </span>
        </div>
        <br />
        <button onClick={onClose} style={{
          background: theme.accent, color: "#000", border: "none",
          padding: "12px 36px", borderRadius: 10, fontWeight: 800, fontSize: 16, cursor: "pointer",
          fontFamily: "'Orbitron', monospace",
        }}>¡GENIAL!</button>
      </div>
    </div>
  );
}

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────
function Sidebar({ currentView, setCurrentView, theme, xpTotal, open, setOpen }) {
  const level = Math.floor(xpTotal / 500) + 1;
  const xpPct = ((xpTotal % 500) / 500) * 100;
  return (
    <aside style={{
      position: "fixed", left: 0, top: 0, bottom: 0,
      width: open ? 240 : 64, background: theme.surface,
      borderRight: `1px solid ${theme.border}`,
      display: "flex", flexDirection: "column",
      transition: "width 0.3s ease", zIndex: 100, overflow: "hidden",
    }}>
      {/* Logo */}
      <div style={{
        padding: "18px 14px", borderBottom: `1px solid ${theme.border}`,
        display: "flex", alignItems: "center", gap: 10, minHeight: 64,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, flexShrink: 0,
          background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent}80)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'Orbitron', monospace", fontWeight: 800, fontSize: 16, color: "#000",
        }}>A</div>
        {open && (
          <span style={{
            fontFamily: "'Orbitron', monospace", fontWeight: 800, fontSize: 17,
            color: theme.accent, letterSpacing: 3, whiteSpace: "nowrap",
          }}>AURALAB</span>
        )}
      </div>

      {/* XP bar */}
      {open && (
        <div style={{ padding: "10px 14px", borderBottom: `1px solid ${theme.border}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: theme.textMuted, marginBottom: 5 }}>
            <span>Nivel {level}</span>
            <span style={{ fontFamily: "'Orbitron', monospace" }}>{xpTotal} XP</span>
          </div>
          <div style={{ height: 4, background: theme.surface2, borderRadius: 2, overflow: "hidden" }}>
            <div style={{
              width: `${xpPct}%`, height: "100%",
              background: `linear-gradient(90deg, ${theme.accent}, ${theme.accent}CC)`,
              borderRadius: 2, transition: "width 0.6s ease",
            }} />
          </div>
          <div style={{ fontSize: 10, color: theme.textMuted, marginTop: 4 }}>
            {500 - (xpTotal % 500)} XP para nivel {level + 1}
          </div>
        </div>
      )}

      {/* Nav */}
      <nav style={{ flex: 1, padding: "6px 0", overflowY: "auto" }}>
        {NAV_ITEMS.map(item => {
          const active = currentView === item.id;
          return (
            <button key={item.id} onClick={() => setCurrentView(item.id)} style={{
              width: "100%", padding: open ? "11px 14px" : "11px",
              display: "flex", alignItems: "center", gap: 12,
              background: active ? `${theme.accent}18` : "transparent",
              border: "none",
              borderLeft: active ? `3px solid ${theme.accent}` : "3px solid transparent",
              cursor: "pointer", textAlign: "left", transition: "all 0.15s",
              color: active ? theme.accent : theme.textMuted,
              fontSize: 13, fontWeight: active ? 600 : 400, fontFamily: "inherit",
            }}>
              <span style={{ fontSize: 17, flexShrink: 0, width: 20, textAlign: "center" }}>{item.icon}</span>
              {open && <span style={{ whiteSpace: "nowrap" }}>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Toggle */}
      <button onClick={() => setOpen(!open)} style={{
        padding: "12px 14px", borderTop: `1px solid ${theme.border}`,
        background: "transparent", border: "none", cursor: "pointer",
        color: theme.textMuted, fontSize: 16,
        display: "flex", justifyContent: open ? "flex-end" : "center",
        fontFamily: "inherit",
      }}>
        {open ? "◁" : "▷"}
      </button>
    </aside>
  );
}

// ─── DASHBOARD ───────────────────────────────────────────────────────────────
function Dashboard({ theme, addXP }) {
  const [tasks, setTasks] = useState([
    { id: 1, name: "Completar módulo de diseño",  desc: "Revisar Figma y prototipos",     done: false },
    { id: 2, name: "Entrenar piernas",             desc: "Rutina completa de piernas",      done: false },
    { id: 3, name: "Revisar finanzas del mes",     desc: "Actualizar gastos y ahorros",     done: false },
  ]);
  const [taskName, setTaskName] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [radarPeriod, setRadarPeriod] = useState("daily");

  const dailyData = [
    { s: "Físico", v: 80 }, { s: "Finanzas", v: 65 }, { s: "Enfoque", v: 72 },
    { s: "Hábitos", v: 85 }, { s: "Social",  v: 58 }, { s: "Trabajo", v: 78 },
  ];
  const monthlyData = [
    { s: "Físico", v: 74 }, { s: "Finanzas", v: 69 }, { s: "Enfoque", v: 68 },
    { s: "Hábitos", v: 80 }, { s: "Social",  v: 62 }, { s: "Trabajo", v: 83 },
  ];
  const radarData = (radarPeriod === "daily" ? dailyData : monthlyData).map(d => ({ subject: d.s, A: d.v }));

  const addTask = () => {
    if (!taskName.trim()) return;
    setTasks(p => [...p, { id: Date.now(), name: taskName, desc: taskDesc, done: false }]);
    setTaskName(""); setTaskDesc("");
  };
  const completeTask = (id) => {
    setTasks(p => p.map(t => t.id === id ? { ...t, done: true } : t));
    addXP(50 + Math.floor(Math.random() * 51));
  };

  return (
    <div style={{ animation: "slideIn 0.35s ease" }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 30, fontWeight: 800, color: theme.text, fontFamily: "'Orbitron', monospace", letterSpacing: 1 }}>
          TABLERO
        </h1>
        <p style={{ color: theme.textMuted, fontSize: 13, marginTop: 4 }}>
          {new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      {/* Top summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 20 }}>
        {/* Physical */}
        <Card theme={theme} accent title="RESUMEN FÍSICO">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <Num theme={theme} n="847" unit="" mono />
              <Muted theme={theme}>Score Físico Global</Muted>
            </div>
            <div style={{ textAlign: "right", fontSize: 12 }}>
              <div style={{ color: "#00FF88" }}>+12 esta semana</div>
              <div style={{ color: theme.textMuted }}>Peso: 74.5 kg</div>
              <div style={{ color: theme.textMuted }}>Vol: 18.4 ton</div>
            </div>
          </div>
        </Card>

        {/* Personal Finance */}
        <Card theme={theme} title="FINANZAS PERSONALES">
          <Num theme={theme} n="$12,450" />
          <div style={{ display: "flex", gap: 14, marginTop: 8 }}>
            <span style={{ color: "#00FF88", fontSize: 12 }}>↑ $3,200</span>
            <span style={{ color: "#FF4455", fontSize: 12 }}>↓ $1,850</span>
          </div>
        </Card>

        {/* Agency Finance */}
        <Card theme={theme} title="FINANZAS AGENCIA">
          <Num theme={theme} n="$38,200" />
          <div style={{ display: "flex", gap: 14, marginTop: 8 }}>
            <span style={{ color: "#00FF88", fontSize: 12 }}>↑ $15,000</span>
            <span style={{ color: "#FF4455", fontSize: 12 }}>↓ $4,200</span>
          </div>
        </Card>

        {/* Focus meter */}
        <Card theme={theme} title="ENFOQUE MENTAL">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "4px 0" }}>
            <CircleGauge value={72} color={theme.accent} bg={theme.border} size={90} theme={theme} />
          </div>
          <div style={{ textAlign: "center", fontSize: 11, color: theme.textMuted, marginTop: 6 }}>Nivel de Enfoque Actual</div>
        </Card>
      </div>

      {/* Radar + Tasks */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Radar */}
        <Card theme={theme} title="RADAR DE RENDIMIENTO" extra={
          <div style={{ display: "flex", gap: 4 }}>
            {[["daily", "Hoy"], ["monthly", "Mensual"]].map(([k, lbl]) => (
              <button key={k} onClick={() => setRadarPeriod(k)} style={{
                background: radarPeriod === k ? theme.accent : "transparent",
                color: radarPeriod === k ? "#000" : theme.textMuted,
                border: `1px solid ${radarPeriod === k ? theme.accent : theme.border}`,
                padding: "3px 10px", borderRadius: 6, cursor: "pointer", fontSize: 11, fontFamily: "inherit",
              }}>{lbl}</button>
            ))}
          </div>
        }>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
              <PolarGrid stroke={theme.border} />
              <PolarAngleAxis dataKey="subject" tick={{ fill: theme.textMuted, fontSize: 11, fontFamily: "inherit" }} />
              <Radar dataKey="A" stroke={theme.accent} fill={theme.accent} fillOpacity={0.22} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </Card>

        {/* Task manager */}
        <Card theme={theme} title="TAREAS RÁPIDAS ⚡">
          {/* Form */}
          <div style={{ marginBottom: 14 }}>
            <input value={taskName} onChange={e => setTaskName(e.target.value)} placeholder="Nombre del trabajo/tarea..." style={{ marginBottom: 6 }} onKeyDown={e => e.key === "Enter" && addTask()} />
            <input value={taskDesc} onChange={e => setTaskDesc(e.target.value)} placeholder="Descripción..." style={{ marginBottom: 8 }} />
            <button onClick={addTask} className="btn-accent" style={{ width: "100%" }}>+ Agregar Tarea</button>
          </div>
          {/* List */}
          <div style={{ maxHeight: 220, overflowY: "auto", display: "flex", flexDirection: "column", gap: 6 }}>
            {tasks.map(t => (
              <div key={t.id} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "9px 11px",
                background: t.done ? `${theme.accent}0E` : theme.surface2,
                border: `1px solid ${t.done ? theme.accent + "40" : theme.border}`,
                borderRadius: 8, opacity: t.done ? 0.68 : 1, transition: "all 0.3s",
              }}>
                <input type="checkbox" checked={t.done} onChange={() => !t.done && completeTask(t.id)}
                  style={{ width: 16, height: 16, cursor: "pointer", accentColor: theme.accent, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: theme.text, textDecoration: t.done ? "line-through" : "none", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.name}</div>
                  {t.desc && <div style={{ fontSize: 11, color: theme.textMuted }}>{t.desc}</div>}
                </div>
                {t.done
                  ? <span style={{ fontSize: 11, color: theme.accent, fontWeight: 700, flexShrink: 0 }}>✓ XP</span>
                  : <span style={{ fontSize: 11, color: theme.textMuted, flexShrink: 0 }}>+50 XP</span>
                }
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── HABITS ──────────────────────────────────────────────────────────────────
function Habits({ theme, addXP }) {
  const [habits, setHabits] = useState([
    { id: 1, name: "Meditación 10 min",   streak: 7  },
    { id: 2, name: "Leer 30 páginas",     streak: 4  },
    { id: 3, name: "Entrenar",            streak: 12 },
    { id: 4, name: "Sin azúcar procesada",streak: 3  },
  ]);
  const [input, setInput] = useState("");

  const heatmap = Array.from({ length: 364 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (363 - i));
    return { date: d.toLocaleDateString("es-MX", { month: "short", day: "numeric" }), v: Math.random() > 0.33 ? Math.floor(Math.random() * 4) + 1 : 0 };
  });

  const getHeat = v => {
    if (!v) return theme.dark ? "#1A1A24" : "#EAEEF2";
    const ops = ["", `${theme.accent}3A`, `${theme.accent}66`, `${theme.accent}99`, theme.accent];
    return ops[v];
  };

  const addHabit = () => {
    if (!input.trim()) return;
    setHabits(p => [...p, { id: Date.now(), name: input, streak: 0 }]);
    setInput("");
  };
  const markHabit = id => {
    setHabits(p => p.map(h => h.id === id ? { ...h, streak: h.streak + 1 } : h));
    addXP(25);
  };

  return (
    <div style={{ animation: "slideIn 0.35s ease" }}>
      <PageHeader title="HÁBITOS" theme={theme} />
      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 18 }}>
        {/* Left panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Card theme={theme} title="AGREGAR HÁBITO">
            <input value={input} onChange={e => setInput(e.target.value)} placeholder="Nombre del hábito..." style={{ marginBottom: 8 }} onKeyDown={e => e.key === "Enter" && addHabit()} />
            <button onClick={addHabit} className="btn-accent" style={{ width: "100%" }}>+ Crear Hábito</button>
          </Card>

          <Card theme={theme} title="MIS HÁBITOS">
            {habits.map(h => (
              <div key={h.id} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "10px 0", borderBottom: `1px solid ${theme.border}`,
              }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: theme.text }}>{h.name}</div>
                  <div style={{ fontSize: 11, color: theme.accent, marginTop: 2 }}>🔥 {h.streak} días</div>
                </div>
                <button onClick={() => markHabit(h.id)} style={{
                  background: theme.accent, border: "none", borderRadius: 7,
                  padding: "5px 12px", cursor: "pointer", fontSize: 13, fontWeight: 700, color: "#000", fontFamily: "inherit",
                }}>✓</button>
              </div>
            ))}
          </Card>
        </div>

        {/* Heatmap */}
        <Card theme={theme} title="MAPA DE CONSTANCIA — Últimos 12 meses">
          <div style={{ overflowX: "auto", paddingBottom: 8 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
              {heatmap.map((d, i) => (
                <div key={i} title={`${d.date}: ${d.v ? d.v + " hábito(s)" : "Sin completar"}`} style={{
                  width: 11, height: 11, borderRadius: 2, background: getHeat(d.v),
                  cursor: "pointer", transition: "transform 0.15s, box-shadow 0.15s",
                }}
                  onMouseEnter={e => { e.target.style.transform = "scale(1.8)"; e.target.style.boxShadow = `0 0 6px ${theme.accent}80`; }}
                  onMouseLeave={e => { e.target.style.transform = "scale(1)"; e.target.style.boxShadow = "none"; }}
                />
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 14, fontSize: 11, color: theme.textMuted }}>
              <span>Menos</span>
              {[0, 1, 2, 3, 4].map(v => (
                <div key={v} style={{ width: 11, height: 11, borderRadius: 2, background: getHeat(v) }} />
              ))}
              <span>Más</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── PHYSICAL ────────────────────────────────────────────────────────────────
function Physical({ theme }) {
  const muscles = [
    { name: "Pecho",       vol: 85, c: "#FF4455" },
    { name: "Espalda",     vol: 90, c: "#FF6644" },
    { name: "Piernas",     vol: 45, c: "#FFAA00" },
    { name: "Hombros",     vol: 70, c: "#00CCFF" },
    { name: "Bíceps",      vol: 80, c: "#BB44FF" },
    { name: "Tríceps",     vol: 75, c: "#00FF88" },
    { name: "Core",        vol: 35, c: "#FF4499" },
    { name: "Pantorrillas",vol: 22, c: "#44AAFF" },
  ];
  const weekVol = [
    { w: "S-5", v: 12.4 }, { w: "S-4", v: 15.2 }, { w: "S-3", v: 13.8 },
    { w: "S-2", v: 18.4 }, { w: "S-1", v: 16.9 }, { w: "Hoy", v: 20.1 },
  ];
  const days = Array.from({ length: 30 }, (_, i) => ({
    d: i + 1,
    ok: [1,3,5,8,10,12,15,17,19,22,24,26,29].includes(i + 1),
  }));

  return (
    <div style={{ animation: "slideIn 0.35s ease" }}>
      <PageHeader title="PILAR FÍSICO" theme={theme} />

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 20 }}>
        <Card theme={theme} accent>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 56, fontWeight: 800, color: theme.accent, lineHeight: 1 }}>847</div>
            <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 4, letterSpacing: 2 }}>SCORE FÍSICO</div>
          </div>
        </Card>
        <Card theme={theme} title="PESO ACTUAL">
          <Num theme={theme} n="74.5" unit=" kg" />
          <div style={{ fontSize: 11, color: "#00FF88", marginTop: 4 }}>↓ -0.5 kg esta semana</div>
        </Card>
        <Card theme={theme} title="VOLUMEN SEMANAL">
          <Num theme={theme} n="18.4" unit=" ton" />
          <div style={{ fontSize: 11, color: theme.accent, marginTop: 4 }}>+2.1 ton vs semana ant.</div>
        </Card>
        <Card theme={theme} title="SESIONES AL MES">
          <Num theme={theme} n="13" unit=" /30" />
          <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 4 }}>43% asistencia</div>
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        {/* Muscle map */}
        <Card theme={theme} title="MAPA MUSCULAR">
          {muscles.map(m => (
            <div key={m.name} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                <span style={{ fontSize: 12, color: theme.text }}>{m.name}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: m.vol < 40 ? "#FF4455" : m.vol < 65 ? "#FFAA00" : "#00FF88" }}>
                  {m.vol}% {m.vol < 40 ? "⚠" : ""}
                </span>
              </div>
              <div style={{ height: 6, background: theme.surface2, borderRadius: 3, overflow: "hidden" }}>
                <div style={{ width: `${m.vol}%`, height: "100%", background: m.c, borderRadius: 3, transition: "width 1.2s ease" }} />
              </div>
            </div>
          ))}
          <div style={{ marginTop: 10, fontSize: 11, color: "#FFAA00" }}>⚠ Piernas y Core requieren más atención</div>
        </Card>

        {/* Volume chart */}
        <Card theme={theme} title="PROGRESIÓN DE VOLUMEN SEMANAL">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={weekVol} margin={{ top: 5, right: 10, bottom: 5, left: -10 }}>
              <CartesianGrid stroke={theme.border} strokeDasharray="3 3" />
              <XAxis dataKey="w" tick={{ fill: theme.textMuted, fontSize: 11, fontFamily: "inherit" }} />
              <YAxis tick={{ fill: theme.textMuted, fontSize: 11, fontFamily: "inherit" }} />
              <Tooltip contentStyle={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 8, fontFamily: "inherit" }} labelStyle={{ color: theme.text }} itemStyle={{ color: theme.accent }} formatter={v => [`${v} ton`, "Volumen"]} />
              <Line type="monotone" dataKey="v" stroke={theme.accent} strokeWidth={2.5} dot={{ fill: theme.accent, r: 5 }} activeDot={{ r: 7 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Calendar */}
      <Card theme={theme} title="FRECUENCIA DE ENTRENAMIENTO — Este Mes">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {days.map(d => (
            <div key={d.d} style={{
              width: 38, height: 38, borderRadius: 8,
              background: d.ok ? `${theme.accent}28` : "transparent",
              border: `1px solid ${d.ok ? theme.accent : theme.border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: d.ok ? 700 : 400,
              color: d.ok ? theme.accent : theme.textMuted,
            }}>
              {d.ok ? "✓" : d.d}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 14, fontSize: 12, color: theme.textMuted }}>
          13 sesiones completadas · Meta: 20/mes
        </div>
      </Card>
    </div>
  );
}

// ─── ROUTINES ────────────────────────────────────────────────────────────────
function Routines({ theme, setShowStrengthCoin, addXP }) {
  const [routines, setRoutines] = useState([
    { id: 1, name: "Día de Piernas", exercises: [
      { id: 1, name: "Prensa de Piernas", sets: 4, reps: 10, lastWeight: 120 },
      { id: 2, name: "Sentadilla Libre",  sets: 4, reps: 8,  lastWeight: 80  },
      { id: 3, name: "Extensiones",       sets: 3, reps: 12, lastWeight: 50  },
      { id: 4, name: "Curl de Piernas",   sets: 3, reps: 12, lastWeight: 40  },
    ]},
    { id: 2, name: "Día de Pecho + Tríceps", exercises: [
      { id: 5, name: "Press Banca",       sets: 4, reps: 8,  lastWeight: 90 },
      { id: 6, name: "Aperturas Cable",   sets: 3, reps: 12, lastWeight: 25 },
      { id: 7, name: "Press Cuerda",      sets: 3, reps: 12, lastWeight: 45 },
    ]},
  ]);
  const [active, setActive]   = useState(null);   // { ...routine, exercises: [...with currentWeight] }
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newExName, setNewExName] = useState("");
  const [liftedWeights, setLiftedWeights] = useState({});

  const startRoutine = r => {
    setActive(r);
    const w = {};
    r.exercises.forEach(e => { w[e.id] = ""; });
    setLiftedWeights(w);
  };

  const registerSet = (ex) => {
    const kg = parseFloat(liftedWeights[ex.id]);
    if (!kg) return;
    if (kg > ex.lastWeight) {
      setRoutines(prev => prev.map(r => ({
        ...r,
        exercises: r.exercises.map(e => e.id === ex.id ? { ...e, lastWeight: kg } : e),
      })));
      // update active
      setActive(prev => ({ ...prev, exercises: prev.exercises.map(e => e.id === ex.id ? { ...e, lastWeight: kg } : e) }));
      setShowStrengthCoin(true);
      addXP(100);
    } else {
      addXP(30);
    }
  };

  const createRoutine = () => {
    if (!newName.trim()) return;
    const exs = newExName.trim()
      ? [{ id: Date.now(), name: newExName, sets: 4, reps: 10, lastWeight: 0 }]
      : [];
    setRoutines(p => [...p, { id: Date.now(), name: newName, exercises: exs }]);
    setNewName(""); setNewExName(""); setShowCreate(false);
  };

  if (active) {
    return (
      <div style={{ animation: "slideIn 0.35s ease" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 26 }}>
          <button onClick={() => setActive(null)} className="btn-ghost">← Salir</button>
          <h1 style={{ fontFamily: "'Orbitron', monospace", fontSize: 22, color: theme.accent, fontWeight: 800 }}>
            🏋️ {active.name}
          </h1>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {active.exercises.map(ex => {
            const cur = parseFloat(liftedWeights[ex.id] || 0);
            const isRecord = cur > 0 && cur > ex.lastWeight;
            return (
              <Card key={ex.id} theme={theme} style={{ borderLeft: `4px solid ${isRecord ? "#FFD700" : theme.accent}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: theme.text }}>{ex.name}</div>
                    <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 2 }}>{ex.sets} series × {ex.reps} reps</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 11, color: theme.textMuted }}>Récord anterior</div>
                    <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 22, fontWeight: 700, color: theme.accent }}>{ex.lastWeight} kg</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <input type="number" min="0" step="0.5"
                    value={liftedWeights[ex.id]}
                    onChange={e => setLiftedWeights(p => ({ ...p, [ex.id]: e.target.value }))}
                    placeholder="Peso kg..." style={{ width: 130, fontSize: 20, textAlign: "center", fontFamily: "'Orbitron', monospace" }}
                  />
                  <span style={{ color: theme.textMuted }}>kg</span>
                  <button onClick={() => registerSet(ex)} className="btn-accent" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    ✓ Registrar Serie
                    {isRecord && <span style={{ color: "#FFD700", fontSize: 11 }}>🏅 ¡NUEVO REC!</span>}
                  </button>
                </div>
                {isRecord && (
                  <div style={{ marginTop: 10, padding: "8px 12px", background: "#FFD70020", border: "1px solid #FFD70050", borderRadius: 8, fontSize: 12, color: "#FFD700", textAlign: "center" }}>
                    ⚡ ¡Estás superando tu récord! Confirma para ganar una Moneda de Fuerza
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div style={{ animation: "slideIn 0.35s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <PageHeader title="RUTINAS" theme={theme} noMargin />
        <button onClick={() => setShowCreate(!showCreate)} className="btn-accent">+ Nueva Rutina</button>
      </div>

      {showCreate && (
        <Card theme={theme} style={{ marginBottom: 18, border: `1px solid ${theme.accent}50` }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: theme.text, marginBottom: 12 }}>Crear Nueva Rutina</div>
          <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Nombre de la rutina (ej: Día de Espalda)" style={{ marginBottom: 8 }} />
          <input value={newExName} onChange={e => setNewExName(e.target.value)} placeholder="Primer ejercicio (opcional)" style={{ marginBottom: 10 }} />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={createRoutine} className="btn-accent">Crear Rutina</button>
            <button onClick={() => setShowCreate(false)} className="btn-ghost">Cancelar</button>
          </div>
        </Card>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {routines.map(r => (
          <Card key={r.id} theme={theme}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: theme.text }}>{r.name}</div>
                <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 2 }}>{r.exercises.length} ejercicios</div>
              </div>
              <button onClick={() => startRoutine(r)} className="btn-accent" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                🏋️ Iniciar Entrenamiento
              </button>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
              {r.exercises.map(e => (
                <span key={e.id} style={{
                  background: `${theme.accent}15`, border: `1px solid ${theme.accent}30`,
                  color: theme.accent, padding: "3px 10px", borderRadius: 16, fontSize: 11,
                }}>{e.name} · {e.lastWeight}kg</span>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── FINANCIAL ───────────────────────────────────────────────────────────────
function Financial({ theme }) {
  const [txs, setTxs] = useState([
    { id: 1, type: "income",  cat: "Salario",       amt: 5000, src: "personal", date: "2025-01-01" },
    { id: 2, type: "expense", cat: "Renta",          amt: 1200, src: "personal", date: "2025-01-02" },
    { id: 3, type: "expense", cat: "Comida",         amt:  400, src: "personal", date: "2025-01-03" },
    { id: 4, type: "expense", cat: "Transporte",     amt:  150, src: "personal", date: "2025-01-05" },
    { id: 5, type: "income",  cat: "Cliente A",      amt: 8000, src: "agency",   date: "2025-01-04" },
    { id: 6, type: "income",  cat: "Cliente B",      amt: 7000, src: "agency",   date: "2025-01-06" },
    { id: 7, type: "expense", cat: "Software",       amt:  200, src: "agency",   date: "2025-01-05" },
    { id: 8, type: "expense", cat: "Publicidad",     amt:  600, src: "agency",   date: "2025-01-07" },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [cards, setCards] = useState([{ id: 1, name: "Visa *4521", bank: "BBVA" }]);
  const [newCard, setNewCard] = useState({ name: "", bank: "" });
  const [form, setForm] = useState({ type: "expense", cat: "", amt: "", src: "personal", desc: "", installments: false, numQuotas: 2, date: new Date().toISOString().split("T")[0] });
  const [debts, setDebts] = useState([
    { id: 1, name: "Laptop Pro", total: 36000, paid: 12000 },
  ]);

  const pIncome  = txs.filter(t => t.type === "income"  && t.src === "personal").reduce((a, t) => a + t.amt, 0);
  const pExpense = txs.filter(t => t.type === "expense" && t.src === "personal").reduce((a, t) => a + t.amt, 0);
  const aIncome  = txs.filter(t => t.type === "income"  && t.src === "agency").reduce((a, t) => a + t.amt, 0);
  const aExpense = txs.filter(t => t.type === "expense" && t.src === "agency").reduce((a, t) => a + t.amt, 0);

  const grp = (list) => {
    const m = {};
    list.forEach(t => { m[t.cat] = (m[t.cat] || 0) + t.amt; });
    return Object.entries(m).map(([name, value]) => ({ name, value }));
  };
  const PIE = ["#FF4455","#FF8844","#FFBB00","#00FF88","#00CCFF","#BB44FF","#FF44AA","#44FFCC"];

  const addTx = () => {
    if (!form.cat || !form.amt) return;
    setTxs(p => [...p, { ...form, id: Date.now(), amt: parseFloat(form.amt) }]);
    setForm({ type: "expense", cat: "", amt: "", src: "personal", desc: "", installments: false, numQuotas: 2, date: new Date().toISOString().split("T")[0] });
    setShowForm(false);
  };

  const f = n => n.toLocaleString("es-MX", { style: "currency", currency: "MXN", minimumFractionDigits: 0 });

  return (
    <div style={{ animation: "slideIn 0.35s ease" }}>
      <PageHeader title="PANEL FINANCIERO" theme={theme} />

      {/* Balances */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        <Card theme={theme} style={{ borderTop: `3px solid #00FF88` }}>
          <div style={{ fontSize: 11, color: theme.textMuted, letterSpacing: 2, marginBottom: 6 }}>SALDO PERSONAL</div>
          <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 38, fontWeight: 800, color: theme.text }}>{f(pIncome - pExpense)}</div>
          <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
            <span style={{ color: "#00FF88", fontSize: 12 }}>↑ {f(pIncome)}</span>
            <span style={{ color: "#FF4455", fontSize: 12 }}>↓ {f(pExpense)}</span>
          </div>
        </Card>
        <Card theme={theme} style={{ borderTop: `3px solid ${theme.accent}` }}>
          <div style={{ fontSize: 11, color: theme.textMuted, letterSpacing: 2, marginBottom: 6 }}>SALDO AGENCIA</div>
          <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 38, fontWeight: 800, color: theme.text }}>{f(aIncome - aExpense)}</div>
          <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
            <span style={{ color: "#00FF88", fontSize: 12 }}>↑ {f(aIncome)}</span>
            <span style={{ color: "#FF4455", fontSize: 12 }}>↓ {f(aExpense)}</span>
          </div>
        </Card>
      </div>

      {/* Pie charts */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        <Card theme={theme} title="GASTOS PERSONALES POR CATEGORÍA">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={grp(txs.filter(t => t.type === "expense" && t.src === "personal"))} cx="50%" cy="50%" outerRadius={72} dataKey="value" label={({ name, value }) => `${name} $${value}`} labelLine={false}>
                {grp(txs.filter(t => t.type === "expense" && t.src === "personal")).map((_, i) => <Cell key={i} fill={PIE[i % PIE.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: theme.surface, border: `1px solid ${theme.border}`, fontFamily: "inherit" }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
        <Card theme={theme} title="GASTOS DE AGENCIA POR CATEGORÍA">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={grp(txs.filter(t => t.type === "expense" && t.src === "agency"))} cx="50%" cy="50%" outerRadius={72} dataKey="value" label={({ name, value }) => `${name} $${value}`} labelLine={false}>
                {grp(txs.filter(t => t.type === "expense" && t.src === "agency")).map((_, i) => <Cell key={i} fill={PIE[(i + 3) % PIE.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: theme.surface, border: `1px solid ${theme.border}`, fontFamily: "inherit" }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <button onClick={() => setShowForm(!showForm)} className="btn-accent">+ Registrar Transacción</button>
        <button onClick={() => setShowCardModal(!showCardModal)} className="btn-ghost">💳 Vincular Tarjeta</button>
      </div>

      {/* Card modal */}
      {showCardModal && (
        <Card theme={theme} style={{ marginBottom: 16, border: `1px solid ${theme.accent}50` }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: theme.text, marginBottom: 10 }}>Tarjetas Vinculadas</div>
          {cards.map(c => (
            <div key={c.id} style={{ padding: "8px 0", borderBottom: `1px solid ${theme.border}`, color: theme.text, fontSize: 13 }}>
              💳 {c.name} <span style={{ color: theme.textMuted }}>— {c.bank}</span>
            </div>
          ))}
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <input value={newCard.name} onChange={e => setNewCard(p => ({ ...p, name: e.target.value }))} placeholder="Nombre / N° tarjeta" style={{ flex: 1 }} />
            <input value={newCard.bank} onChange={e => setNewCard(p => ({ ...p, bank: e.target.value }))} placeholder="Banco" style={{ width: 120 }} />
            <button onClick={() => { if (newCard.name) { setCards(p => [...p, { id: Date.now(), ...newCard }]); setNewCard({ name: "", bank: "" }); }}} className="btn-accent">Agregar</button>
            <button onClick={() => setShowCardModal(false)} className="btn-ghost">×</button>
          </div>
        </Card>
      )}

      {/* Transaction form */}
      {showForm && (
        <Card theme={theme} style={{ marginBottom: 20, border: `1px solid ${theme.accent}40` }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: theme.text, marginBottom: 14 }}>Nueva Transacción</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10, marginBottom: 10 }}>
            <div>
              <label style={{ fontSize: 11, color: theme.textMuted, display: "block", marginBottom: 4 }}>Tipo</label>
              <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
                <option value="income">↑ Entrada</option>
                <option value="expense">↓ Salida</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, color: theme.textMuted, display: "block", marginBottom: 4 }}>Fuente</label>
              <select value={form.src} onChange={e => setForm(p => ({ ...p, src: e.target.value }))}>
                <option value="personal">Personal</option>
                <option value="agency">Agencia</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, color: theme.textMuted, display: "block", marginBottom: 4 }}>Categoría</label>
              <input value={form.cat} onChange={e => setForm(p => ({ ...p, cat: e.target.value }))} placeholder="Ej: Renta, Comida..." />
            </div>
            <div>
              <label style={{ fontSize: 11, color: theme.textMuted, display: "block", marginBottom: 4 }}>Monto ($)</label>
              <input type="number" value={form.amt} onChange={e => setForm(p => ({ ...p, amt: e.target.value }))} placeholder="0.00" />
            </div>
            <div>
              <label style={{ fontSize: 11, color: theme.textMuted, display: "block", marginBottom: 4 }}>Fecha</label>
              <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
            </div>
          </div>
          <input value={form.desc} onChange={e => setForm(p => ({ ...p, desc: e.target.value }))} placeholder="Descripción opcional..." style={{ marginBottom: 10 }} />

          {form.type === "expense" && (
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: theme.text }}>
                <input type="checkbox" checked={form.installments} onChange={e => setForm(p => ({ ...p, installments: e.target.checked }))}
                  style={{ accentColor: theme.accent, width: 15, height: 15 }} />
                Compra a plazos (pagar en cuotas)
              </label>
              {form.installments && (
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
                  <label style={{ fontSize: 13, color: theme.textMuted }}>Número de cuotas:</label>
                  <input type="number" min="2" max="60" value={form.numQuotas}
                    onChange={e => setForm(p => ({ ...p, numQuotas: Math.max(2, parseInt(e.target.value) || 2) }))}
                    style={{ width: 70 }} />
                  {form.amt > 0 && (
                    <span style={{ color: theme.accent, fontSize: 12 }}>
                      = ${(parseFloat(form.amt) / form.numQuotas).toFixed(2)}/cuota
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={addTx} className="btn-accent">Guardar Transacción</button>
            <button onClick={() => setShowForm(false)} className="btn-ghost">Cancelar</button>
          </div>
        </Card>
      )}

      {/* Debts */}
      <Card theme={theme} title="DEUDAS ACTIVAS" style={{ marginBottom: 16 }}>
        {debts.length === 0
          ? <div style={{ color: theme.textMuted, fontSize: 13 }}>Sin deudas registradas 🎉</div>
          : debts.map(d => (
            <div key={d.id} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 13, color: theme.text }}>{d.name}</span>
                <span style={{ fontSize: 12, color: theme.textMuted }}>{f(d.paid)} / {f(d.total)}</span>
              </div>
              <div style={{ height: 6, background: theme.surface2, borderRadius: 3, overflow: "hidden" }}>
                <div style={{ width: `${(d.paid / d.total) * 100}%`, height: "100%", background: "#FF4455", borderRadius: 3, transition: "width 1s" }} />
              </div>
              <div style={{ fontSize: 11, color: "#FF4455", marginTop: 3 }}>Pendiente: {f(d.total - d.paid)}</div>
            </div>
          ))
        }
      </Card>

      {/* Transaction list */}
      <Card theme={theme} title="HISTORIAL DE TRANSACCIONES">
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${theme.accent}40` }}>
                {["Fecha", "Tipo", "Categoría", "Fuente", "Descripción", "Monto"].map(h => (
                  <th key={h} style={{ padding: "8px 10px", textAlign: "left", color: theme.textMuted, fontWeight: 600, letterSpacing: 1, fontSize: 11 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {txs.map(t => (
                <tr key={t.id} style={{ borderBottom: `1px solid ${theme.border}` }}
                  onMouseEnter={e => e.currentTarget.style.background = `${theme.accent}08`}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "8px 10px", color: theme.textMuted }}>{t.date}</td>
                  <td style={{ padding: "8px 10px", color: t.type === "income" ? "#00FF88" : "#FF4455", fontWeight: 600 }}>
                    {t.type === "income" ? "↑ Entrada" : "↓ Salida"}
                  </td>
                  <td style={{ padding: "8px 10px", color: theme.text }}>{t.cat}</td>
                  <td style={{ padding: "8px 10px", color: theme.textMuted }}>{t.src === "personal" ? "Personal" : "Agencia"}</td>
                  <td style={{ padding: "8px 10px", color: theme.textMuted }}>{t.desc || "—"}</td>
                  <td style={{ padding: "8px 10px", color: t.type === "income" ? "#00FF88" : "#FF4455", fontWeight: 700, fontFamily: "'Orbitron', monospace", fontSize: 11 }}>
                    {t.type === "income" ? "+" : "-"}{f(t.amt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─── SECOND BRAIN ─────────────────────────────────────────────────────────────
function SecondBrain({ theme }) {
  const [messages, setMessages] = useState([
    { id: 1, role: "ai", text: "🧠 Hola. Soy tu Segundo Cerebro — una IA integrada con todos tus datos de Auralab. Puedo analizar tu progreso físico, resumir finanzas, detectar patrones en tus hábitos, generar planes de acción y automatizar reportes. ¿Qué necesitas hoy?" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  const suggestions = [
    "Analizar mi progreso físico del mes",
    "Resumir mis finanzas de la semana",
    "¿En qué hábitos estoy fallando?",
    "Crear mi plan de acción semanal",
    "Dame un reporte de mi agencia",
    "¿Cuáles son mis metas prioritarias?",
  ];

  const botReply = (text) => {
    const t = text.toLowerCase();
    if (t.includes("físic") || t.includes("físico") || t.includes("progres"))
      return "📊 **Análisis Físico del Mes:**\n\n• Score Físico: 847 (+12 pts, +1.4%)\n• Volumen semanal: 18.4 ton (↑2.1 vs semana ant.)\n• Asistencia: 13/30 días (43%) — Meta: 20/mes\n• Grupos descuidados: Piernas (45%) y Core (35%)\n\n⚠ Recomendación: Agrega 2 sesiones de piernas esta semana para equilibrar tu mapa muscular.";
    if (t.includes("finanz") || t.includes("dinero") || t.includes("saldo"))
      return "💰 **Resumen Financiero:**\n\n• Saldo personal: $12,450 (+$1,350 neto)\n• Saldo agencia: $38,200 (+$14,200 neto)\n• Top gasto personal: Renta ($1,200)\n• Ingreso agencia mes: $15,000\n\n📈 Tendencia positiva. Considera mover 20% del saldo a inversión.";
    if (t.includes("hábito") || t.includes("habit"))
      return "🔍 **Análisis de Hábitos:**\n\n• Racha más larga: Entrenar (12 días) 🔥\n• Racha más baja: Sin azúcar (3 días) ⚠\n• Promedio de cumplimiento: 72%\n\n💡 Los hábitos de mañana tienen 85% de éxito vs 58% los hábitos nocturnos. Mueve \"Sin azúcar\" a tu checklist matutino.";
    if (t.includes("plan") || t.includes("semana"))
      return "📋 **Plan Semanal Generado:**\n\nLun — Piernas + Hábitos AM\nMar — Cardio 30min + Revisar finanzas\nMié — Pecho/Tríceps + Lectura 30min\nJue — Descanso activo + Actualizar metas\nVie — Espalda/Bíceps + Meditación\nSáb — Core + Revisar agencia\nDom — Recuperación + Plan semanal siguiente";
    if (t.includes("agencia") || t.includes("negocio"))
      return "🏢 **Reporte de Agencia:**\n\n• Total ventas registradas: $15,000\n• Ganancia neta estimada: $7,536 (50.24%)\n• Reserva de ley separada: $3,000\n• Tickets abiertos: 2 vuelos, 1 hotel\n\n📌 Recuerda registrar los vuelos externos del mes para un cálculo preciso.";
    if (t.includes("meta"))
      return "🎯 **Estado de Metas:**\n\n1. Conseguir 10 clientes agencia → 40% (2/5 hitos)\n2. Masa muscular 80kg → 65% (2/4 hitos)\n\nProgreso global de vida: 52.5%\n\n💡 Completa el hito 'Contactar 50 prospectos' para un salto del +25% en tu primera meta.";
    return "🤖 Procesado. Basándome en tus datos actuales de Auralab, tu rendimiento global está en el percentil 78. ¿Quieres un análisis más específico? Prueba preguntarme por finanzas, hábitos, físico o metas.";
  };

  const send = (text) => {
    const msg = (text || input).trim();
    if (!msg) return;
    setMessages(p => [...p, { id: Date.now(), role: "user", text: msg }]);
    setInput(""); setTyping(true);
    setTimeout(() => {
      setMessages(p => [...p, { id: Date.now() + 1, role: "ai", text: botReply(msg) }]);
      setTyping(false);
    }, 1200 + Math.random() * 600);
  };

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

  return (
    <div style={{ animation: "slideIn 0.35s ease", display: "flex", flexDirection: "column", height: "calc(100vh - 80px)" }}>
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontFamily: "'Orbitron', monospace", fontSize: 26, fontWeight: 800, color: theme.text, letterSpacing: 2 }}>SEGUNDO CEREBRO</h1>
        <p style={{ color: theme.textMuted, fontSize: 12, marginTop: 4 }}>IA conectada a todos tus módulos de Auralab</p>
      </div>

      {/* Chat */}
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12, paddingBottom: 8 }}>
        {messages.map(m => (
          <div key={m.id} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            {m.role === "ai" && (
              <div style={{
                width: 30, height: 30, borderRadius: "50%", background: `${theme.accent}25`,
                border: `1px solid ${theme.accent}50`, display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 14, flexShrink: 0, marginRight: 8, marginTop: 2,
              }}>🧠</div>
            )}
            <div style={{
              maxWidth: "74%", padding: "11px 15px",
              borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
              background: m.role === "user" ? theme.accent : theme.surface,
              color: m.role === "user" ? "#000" : theme.text,
              border: m.role === "ai" ? `1px solid ${theme.border}` : "none",
              fontSize: 13, lineHeight: 1.6, whiteSpace: "pre-line",
            }}>{m.text}</div>
          </div>
        ))}
        {typing && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: `${theme.accent}25`, border: `1px solid ${theme.accent}50`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🧠</div>
            <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, padding: "12px 18px", borderRadius: "16px 16px 16px 4px", fontSize: 18, color: theme.accent, animation: "pulse 1s infinite" }}>
              ● ● ●
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
        {suggestions.map((s, i) => (
          <button key={i} onClick={() => send(s)} style={{
            background: `${theme.accent}12`, border: `1px solid ${theme.accent}30`,
            color: theme.accent, padding: "5px 12px", borderRadius: 20, cursor: "pointer",
            fontSize: 11, fontFamily: "inherit", transition: "all 0.15s",
          }}>{s}</button>
        ))}
      </div>

      {/* Input */}
      <div style={{ display: "flex", gap: 10 }}>
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
          placeholder="Pregúntale algo a tu Segundo Cerebro..." style={{ flex: 1, padding: "12px 16px", fontSize: 14 }} />
        <button onClick={() => send()} className="btn-accent" style={{ padding: "12px 24px", fontSize: 14 }}>Enviar →</button>
      </div>
    </div>
  );
}

// ─── GOALS ───────────────────────────────────────────────────────────────────
function Goals({ theme, addXP }) {
  const [goals, setGoals] = useState([
    {
      id: 1, title: "Conseguir 10 clientes para la agencia",
      cat: "Negocio", progress: 40,
      milestones: ["Definir propuesta de valor", "Crear portfolio digital", "Contactar 50 prospectos", "Cerrar 5 clientes", "Escalar a 10 clientes"],
      done: [true, true, false, false, false],
    },
    {
      id: 2, title: "Alcanzar 80 kg de masa muscular",
      cat: "Físico", progress: 65,
      milestones: ["Definir plan nutricional", "Entrenar 4x/semana", "Alcanzar 78 kg", "Alcanzar 80 kg"],
      done: [true, true, false, false],
    },
    {
      id: 3, title: "Ahorrar $100,000 pesos",
      cat: "Finanzas", progress: 28,
      milestones: ["Abrir cuenta de ahorro", "Ahorrar $10k", "Ahorrar $50k", "Llegar a $100k"],
      done: [true, false, false, false],
    },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: "", cat: "Personal" });

  const globalPct = goals.length ? Math.round(goals.reduce((a, g) => a + g.progress, 0) / goals.length) : 0;

  const toggle = (gid, mi) => {
    setGoals(p => p.map(g => {
      if (g.id !== gid) return g;
      const nd = [...g.done];
      nd[mi] = !nd[mi];
      const prog = Math.round((nd.filter(Boolean).length / nd.length) * 100);
      if (!g.done[mi]) addXP(75);
      return { ...g, done: nd, progress: prog };
    }));
  };

  const cats = ["Personal", "Físico", "Negocio", "Finanzas", "Educación", "Social", "Relaciones"];

  return (
    <div style={{ animation: "slideIn 0.35s ease" }}>
      <PageHeader title="METAS DE VIDA" theme={theme} />

      {/* Global progress */}
      <Card theme={theme} style={{ marginBottom: 24, textAlign: "center" }}>
        <div style={{ fontSize: 11, color: theme.textMuted, letterSpacing: 3, marginBottom: 10 }}>PROGRESO GLOBAL DE VIDA</div>
        <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 72, fontWeight: 800, color: theme.accent, lineHeight: 1, marginBottom: 16 }}>
          {globalPct}<span style={{ fontSize: 32 }}>%</span>
        </div>
        <div style={{ height: 10, background: theme.surface2, borderRadius: 5, maxWidth: 500, margin: "0 auto 10px" }}>
          <div style={{ width: `${globalPct}%`, height: "100%", background: `linear-gradient(90deg, ${theme.accent}, ${theme.accent}BB)`, borderRadius: 5, transition: "width 1s ease" }} />
        </div>
        <div style={{ fontSize: 12, color: theme.textMuted }}>
          Calculado en base a todos tus hitos completados en todas las áreas
        </div>
      </Card>

      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <button onClick={() => setShowForm(!showForm)} className="btn-accent">+ Definir Nueva Meta</button>
      </div>

      {showForm && (
        <Card theme={theme} style={{ marginBottom: 18, border: `1px solid ${theme.accent}50` }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: theme.text, marginBottom: 12 }}>Nueva Meta de Vida</div>
          <input value={newGoal.title} onChange={e => setNewGoal(p => ({ ...p, title: e.target.value }))} placeholder="¿Cuál es tu gran meta? (ej: Llegar a tener 20 clientes)" style={{ marginBottom: 8 }} />
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <select value={newGoal.cat} onChange={e => setNewGoal(p => ({ ...p, cat: e.target.value }))} style={{ flex: 1 }}>
              {cats.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => {
              if (!newGoal.title) return;
              setGoals(p => [...p, { id: Date.now(), title: newGoal.title, cat: newGoal.cat, progress: 0, milestones: ["Primer hito"], done: [false] }]);
              setNewGoal({ title: "", cat: "Personal" }); setShowForm(false);
            }} className="btn-accent">Crear Meta</button>
            <button onClick={() => setShowForm(false)} className="btn-ghost">Cancelar</button>
          </div>
        </Card>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {goals.map(g => (
          <Card key={g.id} theme={theme}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: theme.text, marginBottom: 6 }}>{g.title}</div>
                <span style={{
                  background: `${theme.accent}20`, color: theme.accent, border: `1px solid ${theme.accent}40`,
                  padding: "2px 10px", borderRadius: 20, fontSize: 11,
                }}>{g.cat}</span>
              </div>
              <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 32, fontWeight: 800, color: theme.accent, flexShrink: 0 }}>
                {g.progress}%
              </div>
            </div>
            <div style={{ height: 6, background: theme.surface2, borderRadius: 3, marginBottom: 16, overflow: "hidden" }}>
              <div style={{ width: `${g.progress}%`, height: "100%", background: theme.accent, borderRadius: 3, transition: "width 0.6s ease" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {g.milestones.map((m, i) => (
                <label key={i} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                  <input type="checkbox" checked={g.done[i]} onChange={() => toggle(g.id, i)}
                    style={{ accentColor: theme.accent, width: 16, height: 16, flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: 13, color: g.done[i] ? theme.textMuted : theme.text, textDecoration: g.done[i] ? "line-through" : "none" }}>
                    {m}
                  </span>
                  {!g.done[i] && <span style={{ fontSize: 11, color: theme.accent }}>+75 XP</span>}
                  {g.done[i] && <span style={{ fontSize: 11, color: "#00FF88" }}>✓</span>}
                </label>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── AGENCY ──────────────────────────────────────────────────────────────────
const emptyAgencia = { fechaIda: "", fechaRegreso: "", cliente: "", numPax: 1, paxAdicionales: "", origen: "", destino: "", precioReal: "", precioVenta: "" };
const emptyExterno = { fechaIda: "", fechaRegreso: "", cliente: "", numPax: 1, paxAdicionales: "", origen: "", destino: "", costoProveedor: "", precioVenta: "" };

function calcAgencia(r) {
  const real  = parseFloat(r.precioReal)  || 0;
  const venta = parseFloat(r.precioVenta) || 0;
  return {
    costoProveedor:     (real  * 0.40).toFixed(2),
    separacionInversion:(venta * 0.2976).toFixed(2),
    reservaLey:         (venta * 0.20).toFixed(2),
    gananciaNeta:       (venta * (1 - 0.2976 - 0.20)).toFixed(2),
  };
}
function calcExterno(r) {
  const costo = parseFloat(r.costoProveedor) || 0;
  const venta = parseFloat(r.precioVenta)    || 0;
  return {
    reservaLey:  (venta * 0.20).toFixed(2),
    gananciaNeta:(venta - costo - venta * 0.20).toFixed(2),
  };
}

function Agency({ theme }) {
  const [tab, setTab]     = useState(0);
  const [rows, setRows]   = useState([[], [], []]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]   = useState(emptyAgencia);

  const isExt = tab === 2;
  const tabs  = ["✈ Vuelos (Agencia)", "🏨 Hoteles (Agencia)", "✈ Vuelos (Externos)"];

  const cur   = rows[tab];
  const totVentas    = cur.reduce((a, r) => a + (parseFloat(r.precioVenta)  || 0), 0);
  const totGanancias = cur.reduce((a, r) => {
    const g = isExt ? calcExterno(r).gananciaNeta : calcAgencia(r).gananciaNeta;
    return a + (parseFloat(g) || 0);
  }, 0);

  const switchTab = i => { setTab(i); setShowForm(false); setForm(i < 2 ? emptyAgencia : emptyExterno); };

  const addRow = () => {
    if (!form.cliente || !form.precioVenta) return;
    setRows(p => p.map((r, i) => i === tab ? [...r, { ...form, id: Date.now() }] : r));
    setForm(isExt ? emptyExterno : emptyAgencia);
    setShowForm(false);
  };
  const delRow = id => setRows(p => p.map((r, i) => i === tab ? r.filter(x => x.id !== id) : r));

  const liveCalc = isExt ? calcExterno(form) : calcAgencia(form);
  const havePreview = form.precioVenta > 0;

  /* Column definitions */
  const colsAg = [
    "Fecha Ida","Fecha Regreso","Cliente","Pax","Adicionales","Origen","Destino",
    "P. Real","C. Proveedor (40%)","P. Venta","Sep. Inversión (29.76%)","Reserva Ley (20%)","Ganancia Neta","",
  ];
  const colsEx = [
    "Fecha Ida","Fecha Regreso","Cliente","Pax","Adicionales","Origen","Destino",
    "Costo Proveedor","P. Venta","Reserva Ley (20%)","Ganancia Neta","",
  ];
  const cols = isExt ? colsEx : colsAg;

  return (
    <div style={{ animation: "slideIn 0.35s ease" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Orbitron', monospace", fontSize: 26, fontWeight: 800, color: theme.text, letterSpacing: 1 }}>MÓDULO OPERATIVO DE AGENCIA</h1>
        <p style={{ color: theme.textMuted, fontSize: 12, marginTop: 4 }}>Sistema automatizado de gestión — Tablas vacías, lógica 100% funcional</p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, background: theme.surface, borderRadius: 10, padding: 4, width: "fit-content", marginBottom: 18 }}>
        {tabs.map((t, i) => (
          <button key={i} onClick={() => switchTab(i)} style={{
            padding: "9px 20px", borderRadius: 8, border: "none", cursor: "pointer",
            fontSize: 13, fontWeight: tab === i ? 700 : 400, fontFamily: "inherit",
            background: tab === i ? theme.accent : "transparent",
            color: tab === i ? "#000" : theme.textMuted, transition: "all 0.2s",
          }}>{t}</button>
        ))}
      </div>

      <button onClick={() => setShowForm(!showForm)} className="btn-accent" style={{ marginBottom: 16 }}>+ Agregar Registro</button>

      {/* Form */}
      {showForm && (
        <Card theme={theme} style={{ marginBottom: 18, border: `1px solid ${theme.accent}50` }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: theme.text, marginBottom: 14 }}>
            Nuevo Registro — {tabs[tab]}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(155px, 1fr))", gap: 10, marginBottom: 12 }}>
            <Fl l="Fecha de Ida"     ><input type="date" value={form.fechaIda}       onChange={e => setForm(p => ({ ...p, fechaIda: e.target.value }))} /></Fl>
            <Fl l="Fecha de Regreso" ><input type="date" value={form.fechaRegreso}   onChange={e => setForm(p => ({ ...p, fechaRegreso: e.target.value }))} /></Fl>
            <Fl l="Nombre del Cliente"><input value={form.cliente} onChange={e => setForm(p => ({ ...p, cliente: e.target.value }))} placeholder="Ej: Juan García" /></Fl>
            <Fl l="N° Pasajeros"      ><input type="number" min="1" value={form.numPax} onChange={e => setForm(p => ({ ...p, numPax: e.target.value }))} /></Fl>
            <Fl l="Pasajeros Adicionales"><input value={form.paxAdicionales} onChange={e => setForm(p => ({ ...p, paxAdicionales: e.target.value }))} placeholder="Si aplica" /></Fl>
            <Fl l="Origen"><input value={form.origen} onChange={e => setForm(p => ({ ...p, origen: e.target.value }))} placeholder="Ej: MEX" /></Fl>
            <Fl l="Destino"><input value={form.destino} onChange={e => setForm(p => ({ ...p, destino: e.target.value }))} placeholder="Ej: CUN" /></Fl>
            {!isExt
              ? <Fl l="Precio Real (sin descuento)"><input type="number" value={form.precioReal} onChange={e => setForm(p => ({ ...p, precioReal: e.target.value }))} placeholder="$" /></Fl>
              : <Fl l="Costo Proveedor"><input type="number" value={form.costoProveedor} onChange={e => setForm(p => ({ ...p, costoProveedor: e.target.value }))} placeholder="$" /></Fl>
            }
            <Fl l="Precio de Venta"><input type="number" value={form.precioVenta} onChange={e => setForm(p => ({ ...p, precioVenta: e.target.value }))} placeholder="$" /></Fl>
          </div>

          {/* Live calc preview */}
          {havePreview && (
            <div style={{ background: `${theme.accent}10`, border: `1px solid ${theme.accent}30`, borderRadius: 8, padding: "10px 14px", marginBottom: 12, display: "flex", flexWrap: "wrap", gap: 20 }}>
              {!isExt ? <>
                <PreviewStat l="Costo Proveedor (40%)"   v={`$${liveCalc.costoProveedor}`}     c={theme.accent} />
                <PreviewStat l="Sep. Inversión (29.76%)" v={`$${liveCalc.separacionInversion}`} c={theme.accent} />
                <PreviewStat l="Reserva Ley (20%)"       v={`$${liveCalc.reservaLey}`}          c="#FFAA00" />
                <PreviewStat l="Ganancia Neta"           v={`$${liveCalc.gananciaNeta}`}        c="#00FF88" />
              </> : <>
                <PreviewStat l="Reserva Ley (20%)"  v={`$${liveCalc.reservaLey}`}   c="#FFAA00" />
                <PreviewStat l="Ganancia Neta"       v={`$${liveCalc.gananciaNeta}`} c="#00FF88" />
              </>}
            </div>
          )}
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={addRow} className="btn-accent">Guardar Registro</button>
            <button onClick={() => setShowForm(false)} className="btn-ghost">Cancelar</button>
          </div>
        </Card>
      )}

      {/* Table */}
      <Card theme={theme} style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, minWidth: isExt ? 780 : 980 }}>
          <thead>
            <tr style={{ borderBottom: `2px solid ${theme.accent}40` }}>
              {cols.map(c => (
                <th key={c} style={{ padding: "9px 7px", textAlign: "left", color: theme.textMuted, fontWeight: 600, whiteSpace: "nowrap", letterSpacing: 0.5 }}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cur.length === 0 ? (
              <tr><td colSpan={cols.length} style={{ padding: "44px 0", textAlign: "center", color: theme.textMuted, fontSize: 13 }}>
                Sin registros. Haz clic en "+ Agregar Registro" para comenzar.
              </td></tr>
            ) : cur.map(r => {
              const c = isExt ? calcExterno(r) : calcAgencia(r);
              const gn = parseFloat(c.gananciaNeta);
              return (
                <tr key={r.id} style={{ borderBottom: `1px solid ${theme.border}` }}
                  onMouseEnter={e => e.currentTarget.style.background = `${theme.accent}08`}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "8px 7px", color: theme.textMuted }}>{r.fechaIda || "—"}</td>
                  <td style={{ padding: "8px 7px", color: theme.textMuted }}>{r.fechaRegreso || "—"}</td>
                  <td style={{ padding: "8px 7px", color: theme.text, fontWeight: 600 }}>{r.cliente}</td>
                  <td style={{ padding: "8px 7px", color: theme.textMuted, textAlign: "center" }}>{r.numPax}</td>
                  <td style={{ padding: "8px 7px", color: theme.textMuted }}>{r.paxAdicionales || "—"}</td>
                  <td style={{ padding: "8px 7px", color: theme.text }}>{r.origen || "—"}</td>
                  <td style={{ padding: "8px 7px", color: theme.text }}>{r.destino || "—"}</td>
                  {!isExt && <td style={{ padding: "8px 7px", color: theme.textMuted }}>${parseFloat(r.precioReal || 0).toFixed(2)}</td>}
                  {!isExt && <td style={{ padding: "8px 7px", color: theme.accent }}>${c.costoProveedor}</td>}
                  {isExt && <td style={{ padding: "8px 7px", color: theme.accent }}>${parseFloat(r.costoProveedor || 0).toFixed(2)}</td>}
                  <td style={{ padding: "8px 7px", color: theme.text, fontWeight: 600 }}>${parseFloat(r.precioVenta || 0).toFixed(2)}</td>
                  {!isExt && <td style={{ padding: "8px 7px", color: theme.accent }}>${c.separacionInversion}</td>}
                  <td style={{ padding: "8px 7px", color: "#FFAA00" }}>${c.reservaLey}</td>
                  <td style={{ padding: "8px 7px", color: gn >= 0 ? "#00FF88" : "#FF4455", fontWeight: 700, fontFamily: "'Orbitron', monospace", fontSize: 10 }}>${c.gananciaNeta}</td>
                  <td style={{ padding: "8px 7px" }}>
                    <button onClick={() => delRow(r.id)} style={{ background: "transparent", border: "none", color: "#FF4455", cursor: "pointer", fontSize: 16 }}>×</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
          {cur.length > 0 && (
            <tfoot>
              <tr style={{ borderTop: `2px solid ${theme.accent}40`, background: `${theme.accent}0C` }}>
                <td colSpan={isExt ? 7 : 8} style={{ padding: "10px 7px", color: theme.textMuted, fontWeight: 600, fontSize: 11 }}>
                  TOTALES — {cur.length} registro(s)
                </td>
                <td style={{ padding: "10px 7px", color: theme.text, fontWeight: 800, fontFamily: "'Orbitron', monospace", fontSize: 12 }}>
                  ${totVentas.toFixed(2)}
                </td>
                {!isExt && <td />}
                <td />
                <td style={{ padding: "10px 7px", color: "#00FF88", fontWeight: 800, fontFamily: "'Orbitron', monospace", fontSize: 12 }}>
                  ${totGanancias.toFixed(2)}
                </td>
                <td />
              </tr>
            </tfoot>
          )}
        </table>
      </Card>

      {/* Formula legend */}
      <div style={{ marginTop: 14, display: "flex", flexWrap: "wrap", gap: 12 }}>
        {!isExt ? [
          ["Costo Proveedor", "Precio Real × 40%"],
          ["Sep. Inversión",  "Precio Venta × 29.76%"],
          ["Reserva Ley",     "Precio Venta × 20%"],
          ["Ganancia Neta",   "Precio Venta − Sep − Reserva"],
        ] : [
          ["Reserva Ley",     "Precio Venta × 20%"],
          ["Ganancia Neta",   "Precio Venta − Costo − Reserva"],
        ].map(([l, f]) => (
          <div key={l} style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 8, padding: "5px 12px", fontSize: 11 }}>
            <span style={{ color: theme.textMuted }}>{l}: </span>
            <span style={{ color: theme.accent, fontFamily: "'Orbitron', monospace" }}>{f}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SETTINGS ────────────────────────────────────────────────────────────────
function Settings({ theme, darkMode, setDarkMode, accentColor, setAccentColor }) {
  return (
    <div style={{ animation: "slideIn 0.35s ease", maxWidth: 640 }}>
      <PageHeader title="APARIENCIA Y AJUSTES" theme={theme} />

      {/* Dark/Light toggle */}
      <Card theme={theme} style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: theme.text, marginBottom: 3 }}>Modo de Interfaz</div>
            <div style={{ fontSize: 12, color: theme.textMuted }}>Alterna entre modo oscuro y modo claro</div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {[{ l: "🌙 Oscuro", v: true }, { l: "☀️ Claro", v: false }].map(opt => (
              <button key={opt.l} onClick={() => setDarkMode(opt.v)} style={{
                padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontFamily: "inherit",
                background: darkMode === opt.v ? theme.accent : "transparent",
                color: darkMode === opt.v ? "#000" : theme.textMuted,
                border: `1px solid ${darkMode === opt.v ? theme.accent : theme.border}`,
                fontWeight: darkMode === opt.v ? 700 : 400, transition: "all 0.2s",
              }}>{opt.l}</button>
            ))}
          </div>
        </div>
      </Card>

      {/* Color picker */}
      <Card theme={theme}>
        <div style={{ fontSize: 15, fontWeight: 600, color: theme.text, marginBottom: 4 }}>Color Principal de Acento</div>
        <div style={{ fontSize: 12, color: theme.textMuted, marginBottom: 18 }}>Personaliza el color que define la identidad visual de Auralab</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 18 }}>
          {ACCENT_OPTIONS.map(c => (
            <button key={c.name} onClick={() => setAccentColor(c)} title={c.name} style={{
              width: 60, height: 60, borderRadius: 14, background: c.value, border: "none",
              cursor: "pointer", position: "relative",
              outline: accentColor.name === c.name ? `3px solid white` : "none",
              outlineOffset: 3,
              boxShadow: accentColor.name === c.name ? `0 0 24px ${c.value}80` : `0 4px 12px ${c.value}40`,
              transition: "all 0.2s",
              transform: accentColor.name === c.name ? "scale(1.1)" : "scale(1)",
            }}>
              {accentColor.name === c.name && (
                <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#000", fontWeight: 800, fontSize: 20 }}>✓</span>
              )}
            </button>
          ))}
        </div>
        <div style={{ fontSize: 13, color: theme.textMuted }}>
          Color activo: <strong style={{ color: accentColor.value, fontFamily: "'Orbitron', monospace" }}>{accentColor.name}</strong> — {accentColor.value}
        </div>
      </Card>

      {/* Preview */}
      <Card theme={theme} style={{ marginTop: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: theme.text, marginBottom: 14 }}>Vista Previa del Tema</div>
        <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
          <button className="btn-accent" style={{ pointerEvents: "none" }}>Botón Acento</button>
          <button className="btn-ghost" style={{ pointerEvents: "none" }}>Botón Ghost</button>
          <span style={{ background: `${theme.accent}20`, border: `1px solid ${theme.accent}50`, color: theme.accent, padding: "6px 14px", borderRadius: 20, fontSize: 12 }}>Badge de acento</span>
        </div>
        <div style={{ height: 8, background: theme.surface2, borderRadius: 4, overflow: "hidden" }}>
          <div style={{ width: "72%", height: "100%", background: theme.accent, borderRadius: 4 }} />
        </div>
        <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 6 }}>Barra de progreso al 72%</div>
        <CircleGauge value={72} color={theme.accent} bg={theme.border} size={80} theme={theme} style={{ marginTop: 10 }} />
      </Card>
    </div>
  );
}

// ─── SHARED HELPERS ───────────────────────────────────────────────────────────

function Card({ theme, children, title, accent, extra, style = {} }) {
  return (
    <div style={{
      background: theme.surface, border: `1px solid ${theme.border}`,
      borderLeft: accent ? `3px solid ${theme.accent}` : undefined,
      borderRadius: 12, padding: 18, ...style,
    }}>
      {(title || extra) && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          {title && <div style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, letterSpacing: 2 }}>{title}</div>}
          {extra && extra}
        </div>
      )}
      {children}
    </div>
  );
}

function Num({ theme, n, unit = "", mono = true }) {
  return (
    <div style={{ fontFamily: mono ? "'Orbitron', monospace" : "inherit", fontSize: 32, fontWeight: 800, color: theme.text, lineHeight: 1 }}>
      {n}<span style={{ fontSize: 16, color: theme.textMuted }}>{unit}</span>
    </div>
  );
}

function Muted({ theme, children }) {
  return <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 3 }}>{children}</div>;
}

function PageHeader({ title, theme, noMargin }) {
  return (
    <div style={{ marginBottom: noMargin ? 0 : 26 }}>
      <h1 style={{ fontFamily: "'Orbitron', monospace", fontSize: 26, fontWeight: 800, color: theme.text, letterSpacing: 2 }}>
        {title}
      </h1>
    </div>
  );
}

function CircleGauge({ value, color, bg, size, theme }) {
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={bg} strokeWidth={8} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={8}
          strokeDasharray={`${circ * value / 100} ${circ * (1 - value / 100)}`}
          strokeDashoffset={circ * 0.25} strokeLinecap="round" />
        <text x={size / 2} y={size / 2} textAnchor="middle" dominantBaseline="central"
          fill={theme.text} fontSize={size > 80 ? 16 : 13} fontWeight="700" fontFamily="inherit">
          {value}%
        </text>
      </svg>
    </div>
  );
}

function Fl({ l, children }) {
  return (
    <div>
      <label style={{ fontSize: 10, color: "#8080A0", display: "block", marginBottom: 4, letterSpacing: 1 }}>{l.toUpperCase()}</label>
      {children}
    </div>
  );
}

function PreviewStat({ l, v, c }) {
  return (
    <div>
      <div style={{ fontSize: 10, color: "#8080A0", marginBottom: 2 }}>{l}</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: c, fontFamily: "'Orbitron', monospace" }}>{v}</div>
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function AuralabApp() {
  const [view,       setView]      = useState("dashboard");
  const [darkMode,   setDarkMode]  = useState(true);
  const [accent,     setAccent]    = useState(ACCENT_OPTIONS[0]);
  const [xpTotal,    setXpTotal]   = useState(2450);
  const [confetti,   setConfetti]  = useState(false);
  const [xpGained,   setXpGained]  = useState(0);
  const [showXP,     setShowXP]    = useState(false);
  const [showCoin,   setShowCoin]  = useState(false);
  const [open,       setOpen]      = useState(true);

  const addXP = (amt) => {
    setXpTotal(p => p + amt);
    setXpGained(amt);
    setConfetti(true); setShowXP(true);
    setTimeout(() => { setConfetti(false); setShowXP(false); }, 3000);
  };

  const bg      = darkMode ? "#0A0A0F" : "#EEF0F5";
  const surface = darkMode ? "#13131A" : "#FFFFFF";
  const surface2= darkMode ? "#1B1B26" : "#F4F6FA";
  const text    = darkMode ? "#E4E4F0" : "#1A1A2E";
  const textMuted=darkMode ? "#6A6A90" : "#6B7280";
  const border  = darkMode ? "#252530" : "#E2E5EB";
  const theme   = { bg, surface, surface2, text, textMuted, border, dark: darkMode, accent: accent.value };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: bg, color: text, fontFamily: "'Exo 2', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@400;500;600;700;800&family=Orbitron:wght@400;600;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes slideIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
        @keyframes confettiFall{0%{transform:translateY(0) rotate(0deg);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}
        @keyframes xpPop{from{transform:scale(.5) translateY(10px);opacity:0}to{transform:scale(1) translateY(0);opacity:1}}
        @keyframes coinPop{from{transform:scale(.4) rotate(-180deg);opacity:0}to{transform:scale(1) rotate(0deg);opacity:1}}
        .btn-accent{background:${accent.value};color:#000;border:none;padding:8px 16px;border-radius:8px;cursor:pointer;font-weight:700;font-size:13px;font-family:inherit;transition:all .2s;white-space:nowrap}
        .btn-accent:hover{opacity:.82;transform:translateY(-1px);box-shadow:0 4px 16px ${accent.value}50}
        .btn-ghost{background:transparent;color:${text};border:1px solid ${border};padding:8px 16px;border-radius:8px;cursor:pointer;font-size:13px;font-family:inherit;transition:all .2s}
        .btn-ghost:hover{background:${surface2}}
        input,select,textarea{background:${surface2};border:1px solid ${border};color:${text};padding:8px 11px;border-radius:8px;font-size:13px;font-family:inherit;outline:none;transition:border-color .2s;width:100%}
        input:focus,select:focus,textarea:focus{border-color:${accent.value};box-shadow:0 0 0 2px ${accent.value}1E}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:${border};border-radius:2px}
      `}</style>

      {confetti && <ConfettiEffect accent={accent.value} />}

      {showXP && (
        <div style={{
          position:"fixed", top:24, right:24, zIndex:9998,
          background:accent.value, color:"#000",
          padding:"12px 22px", borderRadius:12,
          fontFamily:"'Orbitron',monospace", fontWeight:800, fontSize:18,
          boxShadow:`0 8px 30px ${accent.value}60`,
          animation:"xpPop .4s cubic-bezier(0.175,0.885,0.32,1.275)",
        }}>+{xpGained} XP ⚡</div>
      )}

      {showCoin && <StrengthCoinModal onClose={() => setShowCoin(false)} theme={theme} />}

      <Sidebar currentView={view} setCurrentView={setView} theme={theme} xpTotal={xpTotal} open={open} setOpen={setOpen} />

      <main style={{ flex:1, overflow:"auto", padding:"28px 30px", marginLeft:open?240:64, transition:"margin-left .3s ease", minHeight:"100vh" }}>
        {view==="dashboard" && <Dashboard  theme={theme} addXP={addXP} />}
        {view==="habits"    && <Habits     theme={theme} addXP={addXP} />}
        {view==="physical"  && <Physical   theme={theme} />}
        {view==="routines"  && <Routines   theme={theme} setShowStrengthCoin={setShowCoin} addXP={addXP} />}
        {view==="financial" && <Financial  theme={theme} />}
        {view==="brain"     && <SecondBrain theme={theme} />}
        {view==="goals"     && <Goals      theme={theme} addXP={addXP} />}
        {view==="agency"    && <Agency     theme={theme} />}
        {view==="settings"  && <Settings   theme={theme} darkMode={darkMode} setDarkMode={setDarkMode} accentColor={accent} setAccentColor={setAccent} />}
      </main>
    </div>
  );
}
