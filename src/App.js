import { useState } from "react";

const API_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-4-20250514";

async function callClaude(systemPrompt, userPrompt) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });
  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  return data.content[0].text;
}

function formatText(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#a09aff">$1</strong>')
    .replace(/`(.*?)`/g, '<em style="color:#43e97b;font-style:normal">$1</em>');
}

const COLORS = {
  bg: "#0a0a0f", surface: "#12121a", surface2: "#1a1a26",
  border: "#2a2a3d", accent: "#6c63ff", accent2: "#ff6584",
  accent3: "#43e97b", text: "#e8e8f0", textDim: "#8888aa", textMuted: "#4a4a6a",
};

const s = {
  app: { background: COLORS.bg, color: COLORS.text, minHeight: "100vh", fontFamily: "'DM Mono', 'Courier New', monospace", display: "flex", flexDirection: "column" },
  header: { padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${COLORS.border}`, background: "rgba(10,10,15,0.9)", position: "sticky", top: 0, zIndex: 100 },
  logo: { fontWeight: 800, fontSize: "1.2rem", display: "flex", alignItems: "center", gap: 10, letterSpacing: "-0.02em" },
  logoDot: { width: 8, height: 8, borderRadius: "50%", background: COLORS.accent, boxShadow: `0 0 12px ${COLORS.accent}` },
  statusBadge: { display: "flex", alignItems: "center", gap: 8, background: "rgba(67,233,123,0.08)", border: "1px solid rgba(67,233,123,0.2)", padding: "5px 12px", borderRadius: 100, fontSize: "0.7rem", color: COLORS.accent3 },
  statusDot: { width: 6, height: 6, borderRadius: "50%", background: COLORS.accent3 },
  main: { display: "grid", gridTemplateColumns: "240px 1fr", flex: 1 },
  sidebar: { borderRight: `1px solid ${COLORS.border}`, padding: "20px 14px", display: "flex", flexDirection: "column", gap: 4 },
  sidebarLabel: { fontSize: "0.62rem", color: COLORS.textMuted, letterSpacing: "0.12em", textTransform: "uppercase", padding: "10px 10px 6px" },
  center: { padding: "24px 28px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 20 },
  card: { background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "18px 20px", display: "flex", flexDirection: "column", gap: 14 },
  cardFocus: { background: COLORS.surface, border: `1px solid rgba(108,99,255,0.5)`, borderRadius: 12, padding: "18px 20px", display: "flex", flexDirection: "column", gap: 14, boxShadow: "0 0 30px rgba(108,99,255,0.1)" },
  row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  fieldGroup: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: "0.64rem", color: COLORS.textMuted, letterSpacing: "0.08em", textTransform: "uppercase" },
  input: { background: COLORS.surface2, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "9px 12px", color: COLORS.text, fontFamily: "inherit", fontSize: "0.8rem", outline: "none", width: "100%" },
  textarea: { background: COLORS.surface2, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "9px 12px", color: COLORS.text, fontFamily: "inherit", fontSize: "0.8rem", outline: "none", width: "100%", resize: "vertical", minHeight: 70 },
  select: { background: COLORS.surface2, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "9px 12px", color: COLORS.text, fontFamily: "inherit", fontSize: "0.8rem", outline: "none", width: "100%" },
  actions: { display: "flex", gap: 10, flexWrap: "wrap" },
  btnPrimary: { padding: "9px 18px", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: "0.76rem", background: COLORS.accent, color: "white", boxShadow: "0 4px 20px rgba(108,99,255,0.3)", display: "flex", alignItems: "center", gap: 8 },
  btnSecondary: { padding: "9px 18px", borderRadius: 8, border: `1px solid ${COLORS.border}`, cursor: "pointer", fontFamily: "inherit", fontSize: "0.76rem", background: COLORS.surface2, color: COLORS.textDim },
  outputCard: { background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, overflow: "hidden" },
  outputHeader: { padding: "12px 18px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", background: COLORS.surface2 },
  outputTitle: { fontSize: "0.7rem", color: COLORS.textDim, letterSpacing: "0.06em" },
  outputBody: { padding: "18px 20px", minHeight: 140, maxHeight: 360, overflowY: "auto", fontSize: "0.8rem", lineHeight: 1.8, color: COLORS.text, whiteSpace: "pre-wrap" },
  sectionTitle: { fontWeight: 700, fontSize: "1rem", marginBottom: 4 },
  chip: (sel) => ({ padding: "5px 12px", borderRadius: 100, fontSize: "0.68rem", cursor: "pointer", border: sel ? "1px solid rgba(108,99,255,0.5)" : `1px solid ${COLORS.border}`, background: sel ? "rgba(108,99,255,0.12)" : COLORS.surface, color: sel ? "#a09aff" : COLORS.textDim }),
  chips: { display: "flex", gap: 8, flexWrap: "wrap", marginTop: 4 },
  navItem: (active) => ({ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 10, cursor: "pointer", fontSize: "0.78rem", color: active ? "#a09aff" : COLORS.textDim, background: active ? "rgba(108,99,255,0.1)" : "transparent", border: active ? "1px solid rgba(108,99,255,0.3)" : "1px solid transparent" }),
  leadCard: { background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "14px 16px", display: "grid", gridTemplateColumns: "1fr auto", gap: 8, cursor: "pointer" },
  tag: (type) => ({ padding: "2px 9px", borderRadius: 100, fontSize: "0.62rem", letterSpacing: "0.05em", textTransform: "uppercase", ...(type === "industry" ? { background: "rgba(108,99,255,0.1)", color: "#a09aff", border: "1px solid rgba(108,99,255,0.2)" } : { background: "rgba(67,233,123,0.08)", color: "#43e97b", border: "1px solid rgba(67,233,123,0.15)" }) }),
  scoreBadge: { display: "flex", flexDirection: "column", alignItems: "center", gap: 2, background: COLORS.surface2, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "7px 10px", minWidth: 50 },
  copyBtn: { background: "none", border: `1px solid ${COLORS.border}`, color: COLORS.textMuted, padding: "3px 9px", borderRadius: 6, fontSize: "0.62rem", cursor: "pointer", fontFamily: "inherit" },
};

const TABS = ["ricerca", "qualifica", "outreach", "report"];
const TAB_ICONS = { ricerca: "🔍", qualifica: "⚡", outreach: "✉️", report: "📊" };
const TAB_LABELS = { ricerca: "Ricerca Lead", qualifica: "Qualifica", outreach: "Outreach", report: "Report" };

export default function SalesAgent() {
  const [tab, setTab] = useState("ricerca");
  const [loading, setLoading] = useState({});
  const [outputs, setOutputs] = useState({});
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState({ leads: 0, qual: 0, emails: 0 });
  const [copied, setCopied] = useState({});

  // Form states
  const [ricerca, setRicerca] = useState({ settore: "", area: "", size: "", budget: "", note: "" });
  const [qualifica, setQualifica] = useState({ company: "", url: "", contact: "" });
  const [qualCriteria, setQualCriteria] = useState(["budget", "authority", "need", "timing"]);
  const [outreach, setOutreach] = useState({ name: "", company: "", role: "", sector: "", value: "" });
  const [outreachTone, setOutreachTone] = useState("professional");
  const [report, setReport] = useState({ company: "" });
  const [reportType, setReportType] = useState("full");

  const toneLabels = { professional: "Professionale", friendly: "Amichevole", consultative: "Consultivo", direct: "Diretto" };
  const reportLabels = { full: "Analisi Completa", competitive: "Competitive Intel", pain: "Pain Point Map", strategy: "Strategia" };

  const setOut = (key, val) => setOutputs(o => ({ ...o, [key]: val }));
  const setLoad = (key, val) => setLoading(l => ({ ...l, [key]: val }));

  async function searchLeads() {
    setLoad("ricerca", true);
    setOut("ricerca", null);
    setLeads([]);
    const sys = `Sei un agente di sales intelligence B2B esperto. Generi profili di prospect realistici per team commerciali italiani. Rispondi in italiano. Usa **grassetto** per nomi aziende e sezioni chiave.`;
    const prompt = `Identifica 4 tipologie di aziende prospect con:
- Settore: ${ricerca.settore || "tecnologia B2B"}
- Area: ${ricerca.area || "Italia"}
- Dimensione: ${ricerca.size || "PMI"}
- Budget: ${ricerca.budget || "non specificato"}
- ICP: ${ricerca.note || "non specificato"}

Per ognuna: **Nome esempio**, settore, pain point principale, decision maker, score (1-10), tattica di approccio.
Poi una breve **strategia di penetrazione** del segmento.`;
    try {
      const res = await callClaude(sys, prompt);
      setOut("ricerca", res);
      const fakeLeads = [
        { name: "Nexus Solutions Srl", sector: ricerca.settore || "Tecnologia", loc: ricerca.area || "Milano", role: "CTO", score: 87 },
        { name: "Meridian Group SpA", sector: "Manifattura", loc: ricerca.area || "Torino", role: "CEO", score: 74 },
        { name: "Alphawave Digital", sector: ricerca.settore || "SaaS", loc: ricerca.area || "Roma", role: "VP Sales", score: 91 },
        { name: "Fortescue Italia", sector: "Logistica", loc: ricerca.area || "Bologna", role: "Dir. Operativo", score: 65 },
      ];
      setLeads(fakeLeads);
      setStats(s => ({ ...s, leads: 4 }));
    } catch (e) {
      setOut("ricerca", "⚠️ Errore: " + e.message);
    }
    setLoad("ricerca", false);
  }

  async function qualifyLead() {
    setLoad("qualifica", true);
    setOut("qualifica", null);
    const sys = `Sei un esperto di sales qualification B2B con metodologie BANT e MEDDIC. Analizza prospect con rigore. Rispondi in italiano. Usa **grassetto** per sezioni chiave.`;
    const prompt = `Qualifica questo prospect B2B:
**Azienda**: ${qualifica.company || "Azienda Target"}
**Web/LinkedIn**: ${qualifica.url || "non specificato"}
**Contatto**: ${qualifica.contact || "non specificato"}
**Criteri**: ${qualCriteria.join(", ")}

Fornisci: analisi per ogni criterio (Alta/Media/Bassa + motivazione), score 0-100, segnali di acquisto, red flag, raccomandazione (Pursue/Nurture/Drop), next best action entro 48h.`;
    try {
      const res = await callClaude(sys, prompt);
      setOut("qualifica", res);
      setStats(s => ({ ...s, qual: s.qual + 1 }));
    } catch (e) {
      setOut("qualifica", "⚠️ Errore: " + e.message);
    }
    setLoad("qualifica", false);
  }

  async function generateEmail() {
    setLoad("outreach", true);
    setOut("outreach", null);
    const toneMap = { professional: "professionale e autorevole", friendly: "amichevole e conversazionale", consultative: "consultivo e orientato al valore", direct: "diretto e focalizzato sui risultati" };
    const sys = `Sei un copywriter B2B specializzato in cold outreach ad alta conversione. Rispondi SOLO con l'email, nessun commento. Tono: ${toneMap[outreachTone]}.`;
    const prompt = `Scrivi una cold email B2B per:
- Destinatario: ${outreach.name || "[Nome]"}, ${outreach.role || "Manager"} di ${outreach.company || "Azienda"}
- Settore: ${outreach.sector || "B2B"}
- Proposta di valore: ${outreach.value || "ottimizzazione processi aziendali"}

Requisiti: oggetto max 8 parole, apertura personalizzata, pain point specifico, valore concreto con metrica, CTA a bassa frizione, firma professionale, max 150 parole nel corpo.

Formato:
OGGETTO: [...]

[Corpo email]

[Firma]`;
    try {
      const res = await callClaude(sys, prompt);
      setOut("outreach", res);
      setStats(s => ({ ...s, emails: s.emails + 1 }));
    } catch (e) {
      setOut("outreach", "⚠️ Errore: " + e.message);
    }
    setLoad("outreach", false);
  }

  async function generateReport() {
    setLoad("report", true);
    setOut("report", null);
    const typeMap = { full: "analisi commerciale completa", competitive: "intelligence competitiva", pain: "mappa dei pain point", strategy: "strategia di approccio in 5 fasi" };
    const sys = `Sei un analista di business intelligence specializzato in mercati B2B italiani. Produci report concisi e orientati all'azione. Rispondi in italiano. Usa **grassetto** per sezioni e insight chiave.`;
    const prompt = `Genera una ${typeMap[reportType]} per: **${report.company || "Azienda Target"}**

${reportType === "full" ? "Includi: profilo azienda, analisi mercato, decision maker e priorità, pain point principali (3-4), opportunità commerciale (score 1-10), strategia di approccio, KPI di monitoraggio." :
      reportType === "competitive" ? "Analizza: posizionamento di mercato, competitor diretti, vantaggi competitivi, gap che la nostra offerta può colmare, pricing stimato." :
      reportType === "pain" ? "Identifica i 5 pain point più critici. Per ognuno: descrizione, impatto business (€ stimati), urgenza (Alta/Media/Bassa), come la nostra soluzione risponde." :
      "Definisci strategia in 5 fasi: ricerca, primo contatto, discovery call, proposta, chiusura. Per ogni fase: obiettivo, tattiche, messaggi chiave, KPI di successo."}`;
    try {
      const res = await callClaude(sys, prompt);
      setOut("report", res);
    } catch (e) {
      setOut("report", "⚠️ Errore: " + e.message);
    }
    setLoad("report", false);
  }

  function copyOutput(key) {
    const text = outputs[key] || "";
    navigator.clipboard.writeText(text);
    setCopied(c => ({ ...c, [key]: true }));
    setTimeout(() => setCopied(c => ({ ...c, [key]: false })), 2000);
  }

  function toggleCriteria(c) {
    setQualCriteria(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  }

  function fillFromLead(lead) {
    setOutreach(o => ({ ...o, company: lead.name, role: lead.role, sector: lead.sector }));
    setQualifica(q => ({ ...q, company: lead.name }));
    setTab("outreach");
  }

  const scoreColor = (n) => n >= 80 ? COLORS.accent3 : n >= 65 ? "#ffd166" : COLORS.accent2;

  return (
    <div style={s.app}>
      {/* Header */}
      <div style={s.header}>
        <div style={s.logo}>
          <div style={s.logoDot} />
          ProspectAI
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <span style={{ fontSize: "0.7rem", color: COLORS.textMuted }}>Agente Commerciale B2B</span>
          <div style={s.statusBadge}>
            <div style={s.statusDot} />
            AGENTE ATTIVO
          </div>
        </div>
      </div>

      <div style={s.main}>
        {/* Sidebar */}
        <div style={s.sidebar}>
          <div style={s.sidebarLabel}>Navigazione</div>
          {TABS.map(t => (
            <div key={t} style={s.navItem(tab === t)} onClick={() => setTab(t)}>
              <span>{TAB_ICONS[t]}</span>
              <span>{TAB_LABELS[t]}</span>
              {t === "ricerca" && stats.leads > 0 && (
                <span style={{ marginLeft: "auto", background: COLORS.surface2, padding: "2px 7px", borderRadius: 100, fontSize: "0.62rem", color: "#a09aff" }}>{stats.leads}</span>
              )}
            </div>
          ))}

          <div style={{ ...s.sidebarLabel, marginTop: 16 }}>Sessione</div>
          <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 14, display: "flex", flexDirection: "column", gap: 6 }}>
            {[["Lead trovati", stats.leads, "#a09aff"], ["Qualificati", stats.qual, COLORS.accent3], ["Email generate", stats.emails, COLORS.textDim]].map(([label, val, color]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", padding: "3px 0" }}>
                <span style={{ color: COLORS.textMuted }}>{label}</span>
                <span style={{ color }}>{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Center */}
        <div style={s.center}>

          {/* RICERCA */}
          {tab === "ricerca" && (
            <>
              <div style={s.sectionTitle}>🔍 Ricerca Nuovi Lead</div>
              <div style={outputs.ricerca ? s.cardFocus : s.card}>
                <div style={s.row2}>
                  <div style={s.fieldGroup}>
                    <label style={s.label}>Settore Target</label>
                    <input style={s.input} value={ricerca.settore} onChange={e => setRicerca(r => ({ ...r, settore: e.target.value }))} placeholder="es. SaaS, Manifattura, Logistica..." />
                  </div>
                  <div style={s.fieldGroup}>
                    <label style={s.label}>Area Geografica</label>
                    <input style={s.input} value={ricerca.area} onChange={e => setRicerca(r => ({ ...r, area: e.target.value }))} placeholder="es. Nord Italia, Milano..." />
                  </div>
                </div>
                <div style={s.row2}>
                  <div style={s.fieldGroup}>
                    <label style={s.label}>Dimensione Azienda</label>
                    <select style={s.select} value={ricerca.size} onChange={e => setRicerca(r => ({ ...r, size: e.target.value }))}>
                      <option value="">Qualsiasi</option>
                      <option value="startup">Startup (1–20)</option>
                      <option value="sme">PMI (20–250)</option>
                      <option value="mid">Mid-market (250–1000)</option>
                      <option value="enterprise">Enterprise (1000+)</option>
                    </select>
                  </div>
                  <div style={s.fieldGroup}>
                    <label style={s.label}>Budget Stimato</label>
                    <select style={s.select} value={ricerca.budget} onChange={e => setRicerca(r => ({ ...r, budget: e.target.value }))}>
                      <option value="">Qualsiasi</option>
                      <option value="small">€10k–€50k / anno</option>
                      <option value="mid">€50k–€200k / anno</option>
                      <option value="large">€200k+ / anno</option>
                    </select>
                  </div>
                </div>
                <div style={s.fieldGroup}>
                  <label style={s.label}>Note ICP / Profilo Cliente Ideale</label>
                  <textarea style={s.textarea} value={ricerca.note} onChange={e => setRicerca(r => ({ ...r, note: e.target.value }))} placeholder="Pain point specifici, tecnologie usate, segnali di acquisto..." />
                </div>
                <div style={s.actions}>
                  <button style={s.btnPrimary} onClick={searchLeads} disabled={loading.ricerca}>
                    {loading.ricerca ? "⏳ Ricerca in corso..." : "⚡ Avvia Ricerca"}
                  </button>
                  <button style={s.btnSecondary} onClick={() => { setLeads([]); setOut("ricerca", null); }}>↺ Reset</button>
                </div>
              </div>

              {outputs.ricerca && (
                <div style={s.outputCard}>
                  <div style={s.outputHeader}>
                    <span style={s.outputTitle}>OUTPUT AGENTE — RICERCA LEAD</span>
                    <button style={s.copyBtn} onClick={() => copyOutput("ricerca")}>{copied.ricerca ? "✓ copiato" : "copia"}</button>
                  </div>
                  <div style={s.outputBody} dangerouslySetInnerHTML={{ __html: formatText(outputs.ricerca) }} />
                </div>
              )}

              {leads.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ fontSize: "0.7rem", color: COLORS.textMuted, letterSpacing: "0.1em", textTransform: "uppercase" }}>Lead Generati — clicca per azioni rapide</div>
                  {leads.map((lead, i) => (
                    <div key={i} style={s.leadCard} onClick={() => fillFromLead(lead)}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "0.88rem" }}>{lead.name}</div>
                        <div style={{ fontSize: "0.7rem", color: COLORS.textMuted, marginTop: 3 }}>{lead.sector} · {lead.loc} · {lead.role}</div>
                        <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                          <span style={s.tag("industry")}>{lead.sector}</span>
                          <span style={s.tag("size")}>{lead.loc}</span>
                        </div>
                      </div>
                      <div style={s.scoreBadge}>
                        <span style={{ fontWeight: 800, fontSize: "1.1rem", color: scoreColor(lead.score) }}>{lead.score}</span>
                        <span style={{ fontSize: "0.58rem", color: COLORS.textMuted }}>SCORE</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* QUALIFICA */}
          {tab === "qualifica" && (
            <>
              <div style={s.sectionTitle}>⚡ Qualificazione Prospect</div>
              <div style={s.card}>
                <div style={s.fieldGroup}>
                  <label style={s.label}>Nome Azienda</label>
                  <input style={s.input} value={qualifica.company} onChange={e => setQualifica(q => ({ ...q, company: e.target.value }))} placeholder="es. Acme Srl, TechCorp SpA..." />
                </div>
                <div style={s.row2}>
                  <div style={s.fieldGroup}>
                    <label style={s.label}>Sito Web / LinkedIn</label>
                    <input style={s.input} value={qualifica.url} onChange={e => setQualifica(q => ({ ...q, url: e.target.value }))} placeholder="https://..." />
                  </div>
                  <div style={s.fieldGroup}>
                    <label style={s.label}>Contatto</label>
                    <input style={s.input} value={qualifica.contact} onChange={e => setQualifica(q => ({ ...q, contact: e.target.value }))} placeholder="Nome, Ruolo..." />
                  </div>
                </div>
                <div style={s.fieldGroup}>
                  <label style={s.label}>Criteri (BANT / MEDDIC)</label>
                  <div style={s.chips}>
                    {["budget", "authority", "need", "timing", "metrics", "champion"].map(c => (
                      <div key={c} style={s.chip(qualCriteria.includes(c))} onClick={() => toggleCriteria(c)}>{c.charAt(0).toUpperCase() + c.slice(1)}</div>
                    ))}
                  </div>
                </div>
                <div style={s.actions}>
                  <button style={s.btnPrimary} onClick={qualifyLead} disabled={loading.qualifica}>
                    {loading.qualifica ? "⏳ Analisi..." : "🎯 Qualifica Prospect"}
                  </button>
                  <button style={s.btnSecondary} onClick={() => setOut("qualifica", null)}>↺ Reset</button>
                </div>
              </div>
              {outputs.qualifica && (
                <div style={s.outputCard}>
                  <div style={s.outputHeader}>
                    <span style={s.outputTitle}>ANALISI QUALIFICAZIONE</span>
                    <button style={s.copyBtn} onClick={() => copyOutput("qualifica")}>{copied.qualifica ? "✓ copiato" : "copia"}</button>
                  </div>
                  <div style={s.outputBody} dangerouslySetInnerHTML={{ __html: formatText(outputs.qualifica) }} />
                </div>
              )}
            </>
          )}

          {/* OUTREACH */}
          {tab === "outreach" && (
            <>
              <div style={s.sectionTitle}>✉️ Generatore Email Outreach</div>
              <div style={s.card}>
                <div style={s.row2}>
                  <div style={s.fieldGroup}>
                    <label style={s.label}>Nome Prospect</label>
                    <input style={s.input} value={outreach.name} onChange={e => setOutreach(o => ({ ...o, name: e.target.value }))} placeholder="Mario Rossi" />
                  </div>
                  <div style={s.fieldGroup}>
                    <label style={s.label}>Azienda</label>
                    <input style={s.input} value={outreach.company} onChange={e => setOutreach(o => ({ ...o, company: e.target.value }))} placeholder="Acme Srl" />
                  </div>
                </div>
                <div style={s.row2}>
                  <div style={s.fieldGroup}>
                    <label style={s.label}>Ruolo</label>
                    <input style={s.input} value={outreach.role} onChange={e => setOutreach(o => ({ ...o, role: e.target.value }))} placeholder="CEO, CTO, Dir. Commerciale..." />
                  </div>
                  <div style={s.fieldGroup}>
                    <label style={s.label}>Settore</label>
                    <input style={s.input} value={outreach.sector} onChange={e => setOutreach(o => ({ ...o, sector: e.target.value }))} placeholder="Manifattura, SaaS..." />
                  </div>
                </div>
                <div style={s.fieldGroup}>
                  <label style={s.label}>Tono</label>
                  <div style={s.chips}>
                    {Object.entries(toneLabels).map(([k, v]) => (
                      <div key={k} style={s.chip(outreachTone === k)} onClick={() => setOutreachTone(k)}>{v}</div>
                    ))}
                  </div>
                </div>
                <div style={s.fieldGroup}>
                  <label style={s.label}>Proposta di Valore / Pain Point</label>
                  <textarea style={s.textarea} value={outreach.value} onChange={e => setOutreach(o => ({ ...o, value: e.target.value }))} placeholder="Cosa offri? Quale problema risolvi?" />
                </div>
                <div style={s.actions}>
                  <button style={s.btnPrimary} onClick={generateEmail} disabled={loading.outreach}>
                    {loading.outreach ? "⏳ Scrittura..." : "✍️ Genera Email"}
                  </button>
                  <button style={s.btnSecondary} onClick={() => setOut("outreach", null)}>↺ Reset</button>
                </div>
              </div>
              {outputs.outreach && (
                <div style={s.outputCard}>
                  <div style={s.outputHeader}>
                    <span style={s.outputTitle}>EMAIL GENERATA</span>
                    <button style={s.copyBtn} onClick={() => copyOutput("outreach")}>{copied.outreach ? "✓ copiato" : "copia"}</button>
                  </div>
                  <div style={s.outputBody} dangerouslySetInnerHTML={{ __html: formatText(outputs.outreach) }} />
                </div>
              )}
            </>
          )}

          {/* REPORT */}
          {tab === "report" && (
            <>
              <div style={s.sectionTitle}>📊 Report Commerciale</div>
              <div style={s.card}>
                <div style={s.fieldGroup}>
                  <label style={s.label}>Azienda / Prospect da Analizzare</label>
                  <input style={s.input} value={report.company} onChange={e => setReport(r => ({ ...r, company: e.target.value }))} placeholder="Nome azienda..." />
                </div>
                <div style={s.fieldGroup}>
                  <label style={s.label}>Tipo di Report</label>
                  <div style={s.chips}>
                    {Object.entries(reportLabels).map(([k, v]) => (
                      <div key={k} style={s.chip(reportType === k)} onClick={() => setReportType(k)}>{v}</div>
                    ))}
                  </div>
                </div>
                <div style={s.actions}>
                  <button style={s.btnPrimary} onClick={generateReport} disabled={loading.report}>
                    {loading.report ? "⏳ Generazione..." : "📄 Genera Report"}
                  </button>
                  <button style={s.btnSecondary} onClick={() => setOut("report", null)}>↺ Reset</button>
                </div>
              </div>
              {outputs.report && (
                <div style={s.outputCard}>
                  <div style={s.outputHeader}>
                    <span style={s.outputTitle}>REPORT AGENTE</span>
                    <button style={s.copyBtn} onClick={() => copyOutput("report")}>{copied.report ? "✓ copiato" : "copia"}</button>
                  </div>
                  <div style={s.outputBody} dangerouslySetInnerHTML={{ __html: formatText(outputs.report) }} />
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
}

