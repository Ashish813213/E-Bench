"use client";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { label: "Home", href: "#hero" },
  { label: "Purpose", href: "#purpose" },
  { label: "Features", href: "#features" },
  { label: "Sources", href: "#sources" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
      const sections = NAV_LINKS.map((l) => l.href.replace("#", ""));
      let current = "hero";
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 200) current = id;
      });
      setActive(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 1000,
        background: "rgba(253,250,243,0.94)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(139,105,20,0.2)",
        padding: "0 60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 64,
        transition: "box-shadow 0.4s",
        boxShadow: scrolled ? "0 4px 24px rgba(26,44,66,0.08)" : "none",
      }}
    >
      {/* Logo */}
      <a href="#hero" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          background: "linear-gradient(135deg,#1A2C42,#243552)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 16,
        }}>⚖️</div>
        <div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 17, fontWeight: 700, color: "#1A2C42", letterSpacing: 1 }}>
            E-Bench
          </div>
          <div style={{ fontSize: 9, letterSpacing: "2.5px", textTransform: "uppercase", color: "#A07820" }}>
            Digital Justice
          </div>
        </div>
      </a>

      {/* Links */}
      <ul style={{ display: "flex", gap: 34, listStyle: "none" }}>
        {NAV_LINKS.map(({ label, href }) => {
          const id = href.replace("#", "");
          const isActive = active === id;
          return (
            <li key={href}>
              <a
                href={href}
                style={{
                  fontSize: 14,
                  fontWeight: isActive ? 500 : 400,
                  color: isActive ? "#1A2C42" : "#4A5568",
                  textDecoration: "none",
                  position: "relative",
                  paddingBottom: 2,
                  transition: "color 0.3s",
                }}
              >
                {label}
                <span style={{
                  position: "absolute", bottom: 0, left: 0, right: 0,
                  height: 2, background: "#C4963A",
                  transform: isActive ? "scaleX(1)" : "scaleX(0)",
                  transformOrigin: "left",
                  transition: "transform 0.3s",
                  display: "block",
                }} />
              </a>
            </li>
          );
        })}
      </ul>

      {/* CTA */}
      <a
        href="#contact"
        style={{
          background: "linear-gradient(135deg,#8B6914,#C4963A)",
          color: "#fff",
          fontSize: 13, fontWeight: 500,
          padding: "9px 22px", borderRadius: 6,
          textDecoration: "none", letterSpacing: "0.3px",
          boxShadow: "0 2px 12px rgba(139,105,20,0.3)",
          transition: "all 0.3s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-1px)";
          (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 6px 20px rgba(139,105,20,0.4)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.transform = "";
          (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 2px 12px rgba(139,105,20,0.3)";
        }}
      >
        Login / Get Started
      </a>
    </nav>
  );
}
