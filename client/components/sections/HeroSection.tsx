"use client";
import { useEffect, useRef } from "react";

const BOOK_COLORS = [
  "#8B4513","#C4963A","#1A3A5C","#5C2A1A","#2A4A1A",
  "#4A3A1A","#1A5C3A","#7A3A1A","#1A2C52","#5C1A1A",
  "#2A3A1A","#8B2513",
];
const BOOK_HEIGHTS = [68,80,65,90,70,75,82,67,86,73,78,85,69];

function BookShelf({ count = 22 }: { count?: number }) {
  return (
    <div style={{ display:"flex", alignItems:"flex-end", padding:"0 12px", gap:3, width:"100%", height:"100%" }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            height: `${BOOK_HEIGHTS[i % BOOK_HEIGHTS.length]}%`,
            width: 10 + (i % 3) * 3,
            background: BOOK_COLORS[i % BOOK_COLORS.length],
            borderRadius: "2px 2px 0 0",
            flexShrink: 0,
          }}
        />
      ))}
    </div>
  );
}

export default function HeroSection() {
  const libraryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      if (libraryRef.current) {
        libraryRef.current.style.transform = `translateY(${window.scrollY * 0.055}px)`;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      id="hero"
      style={{
        minHeight: "100vh",
        background: "var(--cream)",
        display: "flex",
        alignItems: "center",
        padding: "100px 60px 60px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* BG radial */}
      <div style={{
        position:"absolute", inset:0, pointerEvents:"none",
        background: "radial-gradient(ellipse 65% 55% at 68% 50%, rgba(196,150,58,0.07) 0%, transparent 70%), radial-gradient(ellipse 35% 35% at 8% 78%, rgba(26,44,66,0.04) 0%, transparent 60%)",
      }} />
      {/* Rules */}
      <div className="hero-rule" style={{ top: 100 }} />
      <div className="hero-rule" style={{ bottom: 80 }} />

      {/* LEFT TEXT */}
      <div style={{ flex:1, maxWidth:540, position:"relative", zIndex:2 }}>
        {/* Badge */}
        <div className="hero-anim-1" style={{
          display:"inline-flex", alignItems:"center", gap:10,
          background:"rgba(139,105,20,0.08)", border:"1px solid rgba(139,105,20,0.25)",
          borderRadius:100, padding:"5px 14px",
          fontSize:11, letterSpacing:"2px", textTransform:"uppercase", color:"#A07820",
          marginBottom:28,
        }}>
          <span className="blink-dot" style={{ width:5, height:5, borderRadius:"50%", background:"#C4963A", display:"inline-block" }} />
          AI-Powered Legal Platform
        </div>

        {/* H1 */}
        <h1 className="hero-anim-2 font-playfair" style={{
          fontSize:"clamp(34px,4.2vw,58px)", fontWeight:700, lineHeight:1.15,
          color:"var(--navy)", marginBottom:20,
        }}>
          AI-Powered{" "}
          <em style={{ fontStyle:"italic", color:"var(--gold-mid)" }}>Legal Intelligence</em>
          {" "}for Everyone
        </h1>

        {/* Tagline */}
        <p className="hero-anim-3 font-cormorant" style={{
          fontSize:19, fontWeight:400, lineHeight:1.7,
          color:"var(--text-mid)", marginBottom:12,
        }}>
          Analyze cases, review contracts, and understand laws instantly using advanced AI and trusted legal data.
        </p>

        {/* Desc */}
        <p className="hero-anim-4" style={{
          fontSize:14, lineHeight:1.75,
          color:"var(--text-light)", marginBottom:40,
        }}>
          Our platform combines artificial intelligence with verified legal databases to help users analyze cases, detect risky contract clauses, and stay updated with the latest laws — no legal degree required.
        </p>

        {/* Buttons */}
        <div className="hero-anim-5" style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
          <a
            href="#features"
            style={{
              background:"linear-gradient(135deg,#8B6914,#C4963A)",
              color:"#fff", fontSize:14, fontWeight:500,
              padding:"13px 30px", borderRadius:6,
              textDecoration:"none", border:"none", cursor:"pointer",
              boxShadow:"0 4px 16px rgba(139,105,20,0.35)",
              transition:"all 0.3s", display:"inline-flex", alignItems:"center", gap:8,
            }}
            onMouseEnter={e=>{(e.currentTarget as HTMLAnchorElement).style.transform="translateY(-2px)";(e.currentTarget as HTMLAnchorElement).style.boxShadow="0 8px 24px rgba(139,105,20,0.45)";}}
            onMouseLeave={e=>{(e.currentTarget as HTMLAnchorElement).style.transform="";(e.currentTarget as HTMLAnchorElement).style.boxShadow="0 4px 16px rgba(139,105,20,0.35)";}}
          >
            Get Started →
          </a>
          <a
            href="#purpose"
            style={{
              background:"transparent", color:"var(--navy)",
              fontSize:14, fontWeight:500,
              padding:"13px 30px", borderRadius:6,
              border:"1.5px solid rgba(26,44,66,0.25)",
              textDecoration:"none", cursor:"pointer", transition:"all 0.3s",
            }}
            onMouseEnter={e=>{(e.currentTarget as HTMLAnchorElement).style.borderColor="#1A2C42";(e.currentTarget as HTMLAnchorElement).style.background="rgba(26,44,66,0.04)";(e.currentTarget as HTMLAnchorElement).style.transform="translateY(-2px)";}}
            onMouseLeave={e=>{(e.currentTarget as HTMLAnchorElement).style.borderColor="rgba(26,44,66,0.25)";(e.currentTarget as HTMLAnchorElement).style.background="";(e.currentTarget as HTMLAnchorElement).style.transform="";}}
          >
            Learn More
          </a>
        </div>
      </div>

      {/* RIGHT — Library Frame */}
      <div className="hero-anim-visual" style={{ flex:"0 0 460px", height:500, position:"relative", zIndex:2, marginLeft:60 }}>
        <div
          ref={libraryRef}
          style={{
            width:"100%", height:"100%",
            background:"linear-gradient(165deg,#1a2c42 0%,#0f1e33 60%,#1a2c42 100%)",
            borderRadius:12, position:"relative", overflow:"hidden",
            boxShadow:"0 24px 80px rgba(26,44,66,0.22), 0 0 0 1px rgba(139,105,20,0.2)",
          }}
        >
          {/* Grid overlay */}
          <div style={{ position:"absolute", inset:0, backgroundImage:"repeating-linear-gradient(90deg,transparent,transparent 60px,rgba(139,105,20,0.04) 60px,rgba(139,105,20,0.04) 61px),repeating-linear-gradient(0deg,transparent,transparent 60px,rgba(139,105,20,0.04) 60px,rgba(139,105,20,0.04) 61px)" }} />

          {/* Corner brackets */}
          {["corner-tl","corner-tr","corner-bl","corner-br"].map(c=>(
            <div key={c} className={c} style={{ position:"absolute", width:26, height:26, borderColor:"rgba(139,105,20,0.5)", borderStyle:"solid" }} />
          ))}

          {/* Shelves */}
          <div style={{ position:"absolute", left:0, right:0, top:"33%", height:2, background:"rgba(139,105,20,0.25)" }} />
          <div style={{ position:"absolute", left:0, right:0, top:"66%", height:2, background:"rgba(139,105,20,0.25)" }} />

          {/* Top books */}
          <div style={{ position:"absolute", top:"2%", left:0, right:0, height:"32%", display:"flex", alignItems:"flex-end" }}>
            <BookShelf count={20} />
          </div>
          {/* Bottom books */}
          <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"33%", display:"flex", alignItems:"flex-end" }}>
            <BookShelf count={22} />
          </div>

          {/* Center: glow + scales + badge */}
          <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", textAlign:"center", zIndex:3 }}>
            <div style={{ position:"relative", display:"inline-block" }}>
              <div className="glow-ring" />
              {/* Scales SVG */}
              <svg width="136" height="126" viewBox="0 0 136 126" fill="none" xmlns="http://www.w3.org/2000/svg"
                style={{ filter:"drop-shadow(0 0 14px rgba(77,217,224,0.45))", position:"relative", zIndex:1 }}>
                <defs>
                  <linearGradient id="gg" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#9B7E4B" />
                    <stop offset="100%" stopColor="#D4AF6B" />
                  </linearGradient>
                </defs>
                {/* Pole */}
                <rect x="64" y="26" width="6" height="76" rx="2" fill="url(#gg)" />
                <circle cx="67" cy="22" r="5" fill="url(#gg)" />
                <polygon points="67,9 71,22 63,22" fill="url(#gg)" />
                {/* Arm */}
                <rect x="16" y="48" width="102" height="4" rx="2" fill="url(#gg)">
                  <animateTransform attributeName="transform" type="rotate"
                    values="0 67 50;1.5 67 50;0 67 50;-1 67 50;0 67 50"
                    dur="4s" repeatCount="indefinite" />
                </rect>
                {/* Left pan */}
                <line x1="25" y1="52" x2="20" y2="84" stroke="#C4A35A" strokeWidth="1.5" />
                <line x1="25" y1="52" x2="30" y2="84" stroke="#C4A35A" strokeWidth="1.5" />
                <ellipse cx="25" cy="90" rx="20" ry="6" fill="url(#gg)" opacity="0.9" />
                <ellipse cx="25" cy="87" rx="20" ry="6" fill="url(#gg)" opacity="0.5" />
                {/* Right pan */}
                <line x1="109" y1="52" x2="104" y2="78" stroke="#C4A35A" strokeWidth="1.5" />
                <line x1="109" y1="52" x2="114" y2="78" stroke="#C4A35A" strokeWidth="1.5" />
                <ellipse cx="109" cy="84" rx="20" ry="6" fill="url(#gg)" opacity="0.9" />
                <ellipse cx="109" cy="81" rx="20" ry="6" fill="url(#gg)" opacity="0.5" />
                {/* Base */}
                <rect x="52" y="104" width="30" height="9" rx="2" fill="url(#gg)" />
                <rect x="44" y="113" width="46" height="5" rx="1" fill="url(#gg)" opacity="0.65" />
                {/* Scan line */}
                <line x1="8" y1="50" x2="126" y2="50" stroke="#4DD9E0" strokeWidth="0.7"
                  strokeDasharray="5,9" opacity="0.45">
                  <animate attributeName="strokeDashoffset" values="0;-56" dur="2s" repeatCount="indefinite" />
                </line>
              </svg>
            </div>

            {/* Brand text inside frame */}
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:700, letterSpacing:3, color:"#F7F3E8", marginTop:10 }}>
              E-Bench
            </div>
            <div style={{ fontSize:9, letterSpacing:"3px", textTransform:"uppercase", color:"#D4AF6B", marginTop:2 }}>
              Digital Justice
            </div>
          </div>

          {/* Particles */}
          {[
            { size:4, left:"14%", bottom:"22%", dur:4, delay:0 },
            { size:3, left:"76%", bottom:"33%", dur:5, delay:1 },
            { size:5, left:"42%", bottom:"12%", dur:3.5, delay:0.6 },
          ].map((p, i) => (
            <div key={i} className="particle-el" style={{
              width:p.size, height:p.size,
              left:p.left, bottom:p.bottom,
              animationDuration:`${p.dur}s`,
              animationDelay:`${p.delay}s`,
            }} />
          ))}
        </div>
      </div>
    </section>
  );
}
