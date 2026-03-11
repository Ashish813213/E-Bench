"use client";
import { useEffect, useRef } from "react";
import Image from 'next/image';

export default function HeroSection() {
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      if (imageRef.current) {
        imageRef.current.style.transform = `translateY(${window.scrollY * 0.05}px)`;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      id="hero"
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "var(--cream)",
        display: "flex",
        alignItems: "center",
        padding: "100px 60px 60px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background radial glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse 65% 55% at 70% 50%, rgba(196,150,58,0.07) 0%, transparent 70%), radial-gradient(ellipse 35% 35% at 10% 80%, rgba(26,44,66,0.04) 0%, transparent 60%)",
        }}
      />

      {/* Decorative horizontal rules */}
      <div className="hero-rule" style={{ top: 100 }} />
      <div className="hero-rule" style={{ bottom: 80 }} />

      {/* LEFT TEXT CONTENT */}
      <div style={{ flex: 1, maxWidth: 540, position: "relative", zIndex: 2 }}>
        
        {/* Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            background: "rgba(139,105,20,0.08)",
            border: "1px solid rgba(139,105,20,0.25)",
            borderRadius: 100,
            padding: "5px 14px",
            fontSize: 11,
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: "#A07820",
            marginBottom: 28,
          }}
        >
          <span
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "#C4963A",
              display: "inline-block",
            }}
          />
          AI-Powered Legal Platform
        </div>

        {/* Heading */}
        <h1
          className="font-playfair"
          style={{
            fontSize: "clamp(34px,4.2vw,58px)",
            fontWeight: 700,
            lineHeight: 1.15,
            color: "var(--navy)",
            marginBottom: 20,
          }}
        >
          AI-Powered{" "}
          <em style={{ fontStyle: "italic", color: "var(--gold-mid)" }}>
            Legal Intelligence
          </em>{" "}
          for Everyone
        </h1>

        {/* Tagline */}
        <p
          className="font-cormorant"
          style={{
            fontSize: 19,
            fontWeight: 400,
            lineHeight: 1.7,
            color: "var(--text-mid)",
            marginBottom: 12,
          }}
        >
          Analyze cases, review contracts, and understand laws instantly using
          advanced AI and trusted legal data.
        </p>

        {/* Description */}
        <p
          style={{
            fontSize: 14,
            lineHeight: 1.75,
            color: "var(--text-light)",
            marginBottom: 40,
          }}
        >
          Our platform combines artificial intelligence with verified legal
          databases to help users analyze cases, detect risky contract clauses,
          and stay updated with the latest laws — no legal degree required.
        </p>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          <a
            href="#features"
            style={{
              background: "linear-gradient(135deg,#8B6914,#C4963A)",
              color: "#fff",
              fontSize: 14,
              fontWeight: 500,
              padding: "13px 30px",
              borderRadius: 6,
              textDecoration: "none",
              boxShadow: "0 4px 16px rgba(139,105,20,0.35)",
              transition: "all 0.3s",
            }}
          >
            Get Started →
          </a>

          <a
            href="#purpose"
            style={{
              background: "transparent",
              color: "var(--navy)",
              fontSize: 14,
              fontWeight: 500,
              padding: "13px 30px",
              borderRadius: 6,
              border: "1.5px solid rgba(26,44,66,0.25)",
              textDecoration: "none",
            }}
          >
            Learn More
          </a>
        </div>
      </div>

      {/* RIGHT IMAGE SECTION */}
      <div
        ref={imageRef}
        style={{
          flex: "0 0 460px",
          height: 500,
          position: "relative",
          zIndex: 2,
          marginLeft: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* glow behind image */}
        <div
          style={{
            position: "absolute",
            width: 380,
            height: 380,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(196,150,58,0.25) 0%, rgba(196,150,58,0.08) 40%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />

<Image
  src="/legal-balance.png"
  alt="Legal Balance"
  width={500}
  height={500} // Provide the original aspect ratio height
  priority // Use this if the image is "above the fold" (visible on load)
  style={{
    height: "auto",
    objectFit: "contain",
    position: "absolute",
    right: "-50px",
    zIndex: 2,
    filter: "drop-shadow(0 25px 60px rgba(26,44,66,0.35))",
    animation: "floatBalance 6s ease-in-out infinite",
  }}
/>
      </div>
    </section>
  );
}