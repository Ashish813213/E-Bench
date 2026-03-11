"use client";
import { useState } from "react";

const features = [
  {
    id: "case-intel",
    icon: "⚖️",
    tag: "Case Intelligence",
    title: "AI Case Analyzer",
    desc: "Upload or describe a case and instantly identify applicable legal sections and relevant past judgments from verified databases.",
    color: "#C9A84C",
    accent: "#F5D78E",
    stat: "12,400+ Cases Analyzed",
    cta: "Analyze Case",
  },
  {
    id: "risk",
    icon: "📋",
    tag: "Risk Detection",
    title: "Contract Risk Analyzer",
    desc: "Detect hidden risks, unfair clauses, and legal loopholes. Get a clear risk score and plain-English explanation for every clause — before you sign anything.",
    color: "#E05C5C",
    accent: "#FF9A9A",
    stat: "98.2% Clause Coverage",
    cta: "Scan Contract",
  },
  {
    id: "docs",
    icon: "📄",
    tag: "Document Processing",
    title: "Case File Summarizer",
    desc: "Convert long legal documents such as FIRs, chargesheets, and court orders into clear structured summaries. Understand complex filings in minutes, not hours.",
    color: "#4C8EC9",
    accent: "#8EC5F5",
    stat: "50+ Document Types",
    cta: "Summarize File",
  },
  {
    id: "daily",
    icon: "📰",
    tag: "Stay Updated",
    title: "Daily Law Awareness",
    desc: "Stay updated with the latest legal developments, rights, and government notifications — curated daily for legal professionals.",
    color: "#5CAF7B",
    accent: "#9FD4B4",
    stat: "240+ Updates Today",
    cta: "Read Today's Brief",
  },
  {
    id: "feed",
    icon: "🎯",
    tag: "Personalized",
    title: "Legal News Feed",
    desc: "Get legal news tailored to your interests — criminal law, cyber law, constitutional law, and more. Your practice, your feed.",
    color: "#9B6EC9",
    accent: "#CBA8F5",
    stat: "15 Active Topics",
    cta: "Customize Feed",
  },
];

const recentActivity = [
  { label: "IPC §420 Analysis", time: "2m ago", type: "case" },
  { label: "NDA Contract Reviewed", time: "1h ago", type: "risk" },
  { label: "Bombay HC Order Summary", time: "3h ago", type: "doc" },
  { label: "Cyber Law Update", time: "5h ago", type: "news" },
];

const typeColors = { case: "#C9A84C", risk: "#E05C5C", doc: "#4C8EC9", news: "#5CAF7B" };

export default function LegalDashboard() {
  const [active, setActive] = useState(null);
  const [searchVal, setSearchVal] = useState("");

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0D0F14",
      fontFamily: "'Georgia', 'Times New Roman', serif",
      color: "#E8E0D0",
      overflowX: "hidden",
    }}>
      {/* Noise texture overlay */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
      }} />

      {/* Sidebar */}
      <aside style={{
        position: "fixed", left: 0, top: 0, bottom: 0, width: 72,
        background: "#0A0C10", borderRight: "1px solid #1E2330",
        display: "flex", flexDirection: "column", alignItems: "center",
        paddingTop: 24, zIndex: 100, gap: 8,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: "linear-gradient(135deg, #C9A84C, #8B6914)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18, marginBottom: 24, boxShadow: "0 0 20px #C9A84C44",
        }}>⚖</div>
        {[
          { icon: "⊞", label: "Dashboard", active: true },
          { icon: "📁", label: "My Cases" },
          { icon: "🔍", label: "Search" },
          { icon: "📊", label: "Reports" },
          { icon: "⚙", label: "Settings" },
        ].map((item, i) => (
          <div key={i} title={item.label} style={{
            width: 44, height: 44, borderRadius: 10,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", fontSize: 16,
            background: item.active ? "#1E2330" : "transparent",
            border: item.active ? "1px solid #C9A84C44" : "1px solid transparent",
            transition: "all 0.2s",
            color: item.active ? "#C9A84C" : "#5A6070",
          }}>{item.icon}</div>
        ))}
        <div style={{ flex: 1 }} />
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          background: "linear-gradient(135deg, #2A3045, #1A2030)",
          border: "2px solid #C9A84C66",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14, marginBottom: 20, color: "#C9A84C", cursor: "pointer",
        }}>A</div>
      </aside>

      {/* Main */}
      <main style={{ marginLeft: 72, padding: "32px 36px", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <header style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 36 }}>
          <div>
            <p style={{ fontSize: 12, letterSpacing: "0.18em", color: "#C9A84C", textTransform: "uppercase", margin: 0, marginBottom: 4 }}>
              Good Morning, Advocate
            </p>
            <h1 style={{
              fontSize: 32, fontWeight: 400, margin: 0,
              letterSpacing: "-0.01em", lineHeight: 1.15,
              color: "#F0E8D8",
            }}>Aarav Sharma</h1>
            <p style={{ margin: "6px 0 0", color: "#6A7080", fontSize: 13, fontFamily: "'Georgia', serif", fontStyle: "italic" }}>
              Wednesday, 11 March 2026 · Supreme Court Bar Association
            </p>
          </div>

          {/* Search */}
          <div style={{
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <div style={{
              display: "flex", alignItems: "center",
              background: "#131620", border: "1px solid #1E2330",
              borderRadius: 10, padding: "10px 16px", gap: 10, width: 280,
            }}>
              <span style={{ color: "#4A5060", fontSize: 14 }}>🔍</span>
              <input
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                placeholder="Search cases, IPC sections, judgments…"
                style={{
                  background: "none", border: "none", outline: "none",
                  color: "#E8E0D0", fontSize: 13, fontFamily: "inherit", flex: 1,
                  "::placeholder": { color: "#4A5060" }
                }}
              />
            </div>
            <div style={{
              background: "#131620", border: "1px solid #1E2330",
              borderRadius: 10, padding: "10px 14px", cursor: "pointer",
              color: "#C9A84C", fontSize: 14, position: "relative",
            }}>
              🔔
              <span style={{
                position: "absolute", top: 8, right: 8,
                width: 7, height: 7, borderRadius: "50%",
                background: "#E05C5C", border: "2px solid #0D0F14",
              }} />
            </div>
          </div>
        </header>

        {/* Stats Bar */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 36,
        }}>
          {[
            { label: "Cases This Month", val: "24", delta: "+3", color: "#C9A84C" },
            { label: "Contracts Reviewed", val: "11", delta: "+2", color: "#E05C5C" },
            { label: "Docs Summarized", val: "38", delta: "+7", color: "#4C8EC9" },
            { label: "News Read Today", val: "6", delta: "of 12", color: "#5CAF7B" },
          ].map((s, i) => (
            <div key={i} style={{
              background: "#0F1118", border: "1px solid #1A1E28",
              borderRadius: 14, padding: "18px 22px",
              borderTop: `2px solid ${s.color}44`,
            }}>
              <p style={{ margin: 0, fontSize: 11, letterSpacing: "0.12em", color: "#50566A", textTransform: "uppercase" }}>{s.label}</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 8 }}>
                <span style={{ fontSize: 28, fontWeight: 400, color: "#F0E8D8", letterSpacing: "-0.02em" }}>{s.val}</span>
                <span style={{ fontSize: 12, color: s.color, fontFamily: "monospace" }}>{s.delta}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Title row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 14, letterSpacing: "0.14em", color: "#50566A", textTransform: "uppercase", fontWeight: 400 }}>
            Intelligence Tools
          </h2>
          <span style={{ fontSize: 12, color: "#50566A", cursor: "pointer", borderBottom: "1px solid #2A3040" }}>View All →</span>
        </div>

        {/* Feature Cards Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16, marginBottom: 32,
        }}>
          {features.map((f, i) => (
            <div
              key={f.id}
              onClick={() => setActive(active === f.id ? null : f.id)}
              style={{
                background: active === f.id
                  ? `linear-gradient(145deg, #131620, #0D1020)`
                  : "#0F1118",
                border: `1px solid ${active === f.id ? f.color + "66" : "#1A1E28"}`,
                borderRadius: 16, padding: "24px",
                cursor: "pointer", position: "relative", overflow: "hidden",
                transition: "all 0.25s ease",
                boxShadow: active === f.id ? `0 0 30px ${f.color}22` : "none",
                gridColumn: i === 4 ? "3 / 4" : "auto",
              }}
            >
              {/* Glow top border */}
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: 2,
                background: `linear-gradient(90deg, transparent, ${f.color}, transparent)`,
                opacity: active === f.id ? 1 : 0,
                transition: "opacity 0.25s",
              }} />

              {/* Corner decoration */}
              <div style={{
                position: "absolute", top: -20, right: -20,
                width: 80, height: 80, borderRadius: "50%",
                background: `radial-gradient(circle, ${f.color}18 0%, transparent 70%)`,
              }} />

              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
                <div>
                  <span style={{
                    display: "inline-block",
                    fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase",
                    color: f.color, background: f.color + "18",
                    padding: "3px 10px", borderRadius: 20, marginBottom: 10,
                  }}>{f.tag}</span>
                  <h3 style={{
                    margin: 0, fontSize: 17, fontWeight: 400,
                    color: "#F0E8D8", letterSpacing: "-0.01em", lineHeight: 1.3,
                  }}>{f.title}</h3>
                </div>
                <span style={{ fontSize: 24, opacity: 0.85 }}>{f.icon}</span>
              </div>

              <p style={{
                margin: "0 0 16px", fontSize: 13, lineHeight: 1.65,
                color: "#6A7280", fontStyle: "italic",
              }}>{f.desc}</p>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{
                  fontSize: 11, color: f.accent, fontFamily: "monospace",
                  letterSpacing: "0.05em",
                }}>✦ {f.stat}</span>
                <button style={{
                  background: active === f.id ? f.color : "transparent",
                  border: `1px solid ${f.color}55`,
                  color: active === f.id ? "#0D0F14" : f.color,
                  padding: "7px 16px", borderRadius: 8,
                  fontSize: 12, cursor: "pointer", fontFamily: "inherit",
                  transition: "all 0.2s", letterSpacing: "0.04em",
                  fontWeight: active === f.id ? 600 : 400,
                }}>{f.cta} →</button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom row: Recent Activity + Daily Digest */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

          {/* Recent Activity */}
          <div style={{
            background: "#0F1118", border: "1px solid #1A1E28",
            borderRadius: 16, padding: "22px 24px",
          }}>
            <h3 style={{ margin: "0 0 18px", fontSize: 13, letterSpacing: "0.12em", color: "#50566A", textTransform: "uppercase", fontWeight: 400 }}>
              Recent Activity
            </h3>
            {recentActivity.map((item, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "12px 0",
                borderBottom: i < recentActivity.length - 1 ? "1px solid #161A24" : "none",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: typeColors[item.type], flexShrink: 0,
                    boxShadow: `0 0 6px ${typeColors[item.type]}88`,
                  }} />
                  <span style={{ fontSize: 14, color: "#C8C0B0" }}>{item.label}</span>
                </div>
                <span style={{ fontSize: 12, color: "#3A4050", fontFamily: "monospace" }}>{item.time}</span>
              </div>
            ))}
          </div>

          {/* Today's Legal Digest */}
          <div style={{
            background: "linear-gradient(145deg, #0F1118, #0A0D14)",
            border: "1px solid #1A1E28", borderRadius: 16, padding: "22px 24px",
            borderTop: "2px solid #C9A84C44",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <h3 style={{ margin: 0, fontSize: 13, letterSpacing: "0.12em", color: "#50566A", textTransform: "uppercase", fontWeight: 400 }}>
                Today's Digest
              </h3>
              <span style={{ fontSize: 10, color: "#C9A84C", background: "#C9A84C18", padding: "2px 10px", borderRadius: 20, letterSpacing: "0.1em" }}>LIVE</span>
            </div>
            {[
              { headline: "SC Rules on Article 21 in Digital Privacy Case", cat: "Constitutional" },
              { headline: "New IT Amendment: Liability for AI-Generated Content", cat: "Cyber Law" },
              { headline: "Delhi HC Sets Precedent on Anticipatory Bail", cat: "Criminal" },
            ].map((n, i) => (
              <div key={i} style={{
                padding: "12px 0",
                borderBottom: i < 2 ? "1px solid #161A24" : "none",
                cursor: "pointer",
              }}>
                <p style={{ margin: "0 0 4px", fontSize: 13, color: "#C8C0B0", lineHeight: 1.4 }}>{n.headline}</p>
                <span style={{ fontSize: 10, color: "#5CAF7B", letterSpacing: "0.1em", textTransform: "uppercase" }}>{n.cat}</span>
              </div>
            ))}
            <button style={{
              marginTop: 16, width: "100%", padding: "10px",
              background: "transparent", border: "1px solid #C9A84C33",
              color: "#C9A84C", borderRadius: 8, cursor: "pointer",
              fontSize: 12, fontFamily: "inherit", letterSpacing: "0.08em",
            }}>Read Full Briefing →</button>
          </div>
        </div>

      </main>

      <style>{`
        * { box-sizing: border-box; }
        input::placeholder { color: #3A4050; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0A0C10; }
        ::-webkit-scrollbar-thumb { background: #1E2330; border-radius: 4px; }
      `}</style>
    </div>
  );
}