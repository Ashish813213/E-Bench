"use client";

import { useEffect, useState } from "react";

export default function Home() {

  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  useEffect(() => {

    const handleScroll = () => {

      setScrolled(window.scrollY > 40);

      const sections = ["hero","purpose","highlights","sources","faq","contact"];
      let current = "hero";

      sections.forEach((id) => {

        const el = document.getElementById(id);

        if(el && window.scrollY >= el.offsetTop - 200){
          current = id;
        }

      });

      setActiveSection(current);

    };

    window.addEventListener("scroll",handleScroll);

    return () => window.removeEventListener("scroll",handleScroll);

  },[]);

  const navLinks = [
    {id:"hero",label:"Home"},
    {id:"purpose",label:"Purpose"},
    {id:"highlights",label:"Highlights"},
    {id:"sources",label:"Sources"},
    {id:"faq",label:"FAQ"},
    {id:"contact",label:"Contact"}
  ];


  return (

  <>

  {/* ================= NAVBAR ================= */}

  <nav className={scrolled ? "scrolled" : ""}>

    <a href="#hero" className="nav-logo">

      <div className="nav-logo-circle">⚖️</div>

      <div>
        <span className="nav-logo-name">E-Bench</span>
        <span className="nav-logo-sub">Digital Justice</span>
      </div>

    </a>

    <ul className="nav-links">

      {navLinks.map((link)=>(
        <li key={link.id}>
          <a
            href={`#${link.id}`}
            className={activeSection===link.id ? "active" : ""}
          >
            {link.label}
          </a>
        </li>
      ))}

    </ul>

    <a href="#contact" className="nav-cta">
      Login / Get Started
    </a>

  </nav>


  {/* ================= HERO ================= */}

  <section id="hero">

    <div className="hero-left">

      <div className="hero-eyebrow">
        AI-Powered Legal Platform
      </div>

      <h1 className="hero-h1">
        AI-Powered <em>Legal Intelligence</em> for Everyone
      </h1>

      <p className="hero-tagline">
        Analyze cases, review contracts, and understand laws instantly
        using trusted legal databases and AI.
      </p>

      <p className="hero-desc">
        E-Bench helps citizens, lawyers, and students quickly analyze
        legal documents, detect risky clauses, and discover relevant
        judgments without reading hundreds of pages.
      </p>

      <div className="hero-btns">

        <a href="#highlights" className="btn-gold">
          Get Started →
        </a>

        <a href="#purpose" className="btn-outline">
          Learn More
        </a>

      </div>

    </div>


    {/* HERO RIGHT */}

    <div className="hero-right">

      <div className="legal-visual-perspective">

        <div className="legal-3d-card">

          <div className="glass-overlay"></div>

          <img
            src="/legal-balance.png"
            alt="Legal Balance"
            className="main-3d-img"
          />

          <div className="cyan-glow-orb"></div>

        </div>

      </div>

    </div>

  </section>


  {/* ================= PURPOSE ================= */}

  <section id="purpose">

    <h2 className="section-title">
      Why Use E-Bench?
    </h2>

    <p className="section-sub">
      Legal information is often difficult to understand.
      E-Bench simplifies legal knowledge using artificial
      intelligence so everyone can access justice easily.
    </p>

    <div className="purpose-grid">

      <div className="problem-item">
        ⚖️ Understand complex legal documents quickly
      </div>

      <div className="problem-item">
        📚 Find relevant judgments instantly
      </div>

      <div className="problem-item">
        📄 Detect risky clauses in contracts
      </div>

      <div className="problem-item">
        🔎 Stay updated with legal awareness
      </div>

    </div>

  </section>


  {/* ================= HIGHLIGHTS ================= */}

  <section id="highlights">

    <h2 className="section-title">
      Core Features
    </h2>

    <div className="features-grid">

      <div className="feature-card">
        ⚖️ AI Case Analyzer
        <p>Find relevant judgments and sections quickly.</p>
      </div>

      <div className="feature-card">
        📄 Contract Risk Detector
        <p>Detect unfair clauses in agreements.</p>
      </div>

      <div className="feature-card">
        📑 Legal Document Summarizer
        <p>Convert long legal text into short summaries.</p>
      </div>

      <div className="feature-card">
        📚 Legal Knowledge Base
        <p>Learn laws in simplified language.</p>
      </div>

      <div className="feature-card">
        📰 Legal Awareness Feed
        <p>Stay updated with latest legal updates.</p>
      </div>

    </div>

  </section>


  {/* ================= SOURCES ================= */}

  <section id="sources">

    <h2 className="section-title">
      Reference Sources
    </h2>

    <p className="section-sub">
      Our platform uses trusted legal references
      to ensure reliable and accurate information.
    </p>

    <div className="features-grid">

      <div className="feature-card">Indian Penal Code</div>
      <div className="feature-card">Supreme Court Judgments</div>
      <div className="feature-card">Constitution of India</div>
      <div className="feature-card">Legal Textbooks</div>
      <div className="feature-card">Government Legal Portals</div>

    </div>

  </section>


  {/* ================= FAQ ================= */}

  <section id="faq">

    <h2 className="section-title">
      Frequently Asked Questions
    </h2>

    {[

      {
        q:"Is this platform a replacement for a lawyer?",
        a:"No. E-Bench helps understand legal information but does not replace professional legal advice."
      },

      {
        q:"Is the data reliable?",
        a:"Yes. We use verified Indian legal databases and trusted sources."
      },

      {
        q:"Who can use this platform?",
        a:"Citizens, law students, researchers, and lawyers."
      }

    ].map((faq,i)=>(

      <div key={i} className="faq-item">

        <button
          className="faq-q"
          onClick={()=>setFaqOpen(faqOpen===i ? null : i)}
        >
          {faq.q}
        </button>

        {faqOpen===i && (
          <div className="faq-body">
            <div className="faq-body-inner">{faq.a}</div>
          </div>
        )}

      </div>

    ))}

  </section>


  {/* ================= CONTACT ================= */}

  <section id="contact">

    <h2 className="section-title">
      Contact Us
    </h2>

    <div className="contact-grid">

      <div>

        <p>Email: hello@ebench.ai</p>
        <p>Phone: +91 98765 43210</p>

      </div>

      <div className="contact-form">

        <input type="text" placeholder="Name"/>
        <input type="email" placeholder="Email"/>
        <textarea placeholder="Message"></textarea>

        <button className="form-submit">
          Send Message
        </button>

      </div>

    </div>

  </section>


  {/* ================= FOOTER ================= */}

  <footer>

    <div className="footer-inner">

      <div>
        <h3>E-Bench</h3>
        <p>AI powered legal intelligence platform.</p>
      </div>

      <div>
        © 2026 E-Bench. All rights reserved.
      </div>

    </div>

  </footer>

  </>

  );

}