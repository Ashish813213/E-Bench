"use client"

import { useState, useEffect, useRef } from "react"
import {
  Bell, Search, Scale, FileText, AlertTriangle, Newspaper,
  BookOpen, Settings, User, ChevronRight, Clock, Shield,
  CheckCircle, Download, LayoutDashboard, ChevronLeft,
  ChevronRight as ChevronR, Sparkles, Sun, Moon, MessageSquare, Mail
} from "lucide-react"
import Image from "next/image"

/* ─── typewriter taglines ─── */
const TAGLINES = [
  "Ask me anything about your case...",
  "Search legal sections instantly...",
  "Summarize a document in seconds...",
  "Check contract risks before you sign...",
  "Know your rights. Ask E-Bench.",
]

function useTypewriter(lines, typingSpeed = 60, pauseMs = 1800, deleteSpeed = 35) {
  const [display, setDisplay] = useState("")
  const [cursor, setCursor] = useState(true)
  const lineRef = useRef(0)
  const charRef = useRef(0)
  const deleting = useRef(false)

  useEffect(() => {
    const blink = setInterval(() => setCursor(c => !c), 530)
    return () => clearInterval(blink)
  }, [])

  useEffect(() => {
    let timeout
    const tick = () => {
      const line = lines[lineRef.current]
      if (!deleting.current) {
        if (charRef.current < line.length) {
          charRef.current++
          setDisplay(line.slice(0, charRef.current))
          timeout = setTimeout(tick, typingSpeed)
        } else {
          timeout = setTimeout(() => { deleting.current = true; tick() }, pauseMs)
        }
      } else {
        if (charRef.current > 0) {
          charRef.current--
          setDisplay(line.slice(0, charRef.current))
          timeout = setTimeout(tick, deleteSpeed)
        } else {
          deleting.current = false
          lineRef.current = (lineRef.current + 1) % lines.length
          timeout = setTimeout(tick, 300)
        }
      }
    }
    timeout = setTimeout(tick, 600)
    return () => clearTimeout(timeout)
  }, [])

  return { display, cursor }
}

/* ─── full CSS ─── */
const makeStyle = (dark) => `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Inter:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --gold: #C49A10;
    --gold-light: #e8c94a;
    --sb-bg:      ${dark ? "#1a1f2e" : "#C8B48A"};
    --sb-text:    ${dark ? "rgba(255,255,255,0.75)" : "#333"};
    --sb-active:  ${dark ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.45)"};
    --sb-hover-ul:${dark ? "rgba(200,180,138,0.8)" : "#1C2333"};
    --tip-bg:     ${dark ? "#C49A10" : "#1C2333"};
    --tip-clr:    #fff;
    --bg:         ${dark ? "#0f1319" : "#EDE8DF"};
    --surface:    ${dark ? "#1a1f2e" : "#FFFFFF"};
    --surface2:   ${dark ? "#222840" : "#F5F1EA"};
    --surface3:   ${dark ? "#2a3050" : "#EDE7D9"};
    --border:     ${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"};
    --navy:       ${dark ? "#a8c4f0" : "#1C2333"};
    --navy-icon:  ${dark ? "#1C2333" : "#1C2333"};
    --txt:        ${dark ? "#e8e8e8" : "#222"};
    --txt-mid:    ${dark ? "#aaa" : "#555"};
    --txt-light:  ${dark ? "#666" : "#888"};
    --card-icon-bg: ${dark ? "#0f1319" : "#1C2333"};
    --card-icon-clr:${dark ? "#C49A10" : "#D4A017"};
    --chip-bg:    ${dark ? "#222840" : "#F5F1EA"};
    --chip-bd:    ${dark ? "#333d60" : "#E2DAC8"};
  }

  .eb-root { display:flex; height:100vh; width:100%; font-family:'Inter',sans-serif; background:var(--bg); overflow:hidden; transition: background 0.3s; }

  /* ── SIDEBAR ── */
  .eb-sidebar {
    width: 185px; background: var(--sb-bg);
    display:flex; flex-direction:column;
    transition: width 0.32s cubic-bezier(.4,0,.2,1), background 0.3s;
    overflow: visible; position:relative; flex-shrink:0; z-index:20;
  }
  .eb-sidebar.collapsed { width: 62px; }
  .eb-sidebar-inner { display:flex; flex-direction:column; height:100%; overflow:hidden; padding:16px 10px 12px; gap:3px; }

  /* logo area */
  .eb-logo-wrap {
    display:flex; align-items:center; justify-content:center;
    padding-bottom:14px; border-bottom:1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.12)"};
    margin-bottom:8px; overflow:hidden; flex-shrink:0;
  }
  .eb-logo-img { object-fit:contain; display:block; }
  /* expanded: text name */
  .eb-logo-text { display:flex; flex-direction:column; align-items:center; gap:2px; white-space:nowrap; }
  .eb-logo-text-main { font-family:'Playfair Display',serif; font-size:20px; font-weight:700; color:${dark ? "#C49A10" : "#1C2333"}; letter-spacing:-0.01em; line-height:1; }
  .eb-logo-text-sub  { font-size:9px; font-weight:600; letter-spacing:0.18em; text-transform:uppercase; color:${dark ? "rgba(196,154,16,0.7)" : "rgba(28,35,51,0.5)"}; }
  .eb-logo-expanded { display:flex; align-items:center; justify-content:center; }
  .eb-logo-collapsed { display:none; align-items:center; justify-content:center; }
  .eb-sidebar.collapsed .eb-logo-expanded { display:none; }
  .eb-sidebar.collapsed .eb-logo-collapsed { display:flex; }

  /* toggle btn on boundary */
  .eb-toggle-btn {
    position:absolute; right:-13px; top:16px;
    width:26px; height:26px;
    background:var(--sb-bg); border:2px solid ${dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"};
    border-radius:50%; display:flex; align-items:center; justify-content:center;
    cursor:pointer; color:${dark ? "#C49A10" : "#1C2333"};
    transition:background 0.18s, box-shadow 0.18s, color 0.18s;
    z-index:30; box-shadow:0 2px 8px rgba(0,0,0,0.2);
  }
  .eb-toggle-btn:hover { background:var(--gold); color:#fff; box-shadow:0 3px 14px rgba(196,154,16,0.4); }

  /* nav items */
  .eb-navitem {
    position:relative; display:flex; align-items:center; gap:10px;
    padding:10px 10px; border:none; border-bottom:2px solid transparent; border-radius:0;
    background:transparent; color:var(--sb-text);
    font-family:'Inter',sans-serif; font-size:13px; font-weight:500;
    cursor:pointer; text-align:left; white-space:nowrap; width:100%;
    transition: border-color 0.18s, background 0.18s, color 0.18s, border-radius 0.18s;
    overflow:hidden;
  }
  .eb-navitem svg { flex-shrink:0; opacity:0.65; transition:opacity 0.18s; }
  .eb-navitem-label { opacity:1; transition:opacity 0.2s; overflow:hidden; }

  .eb-sidebar.collapsed .eb-navitem { justify-content:center; padding:10px 0; border-bottom-color:transparent !important; }
  .eb-sidebar.collapsed .eb-navitem-label { width:0; opacity:0; pointer-events:none; }

  /* expanded hover = underline */
  .eb-sidebar:not(.collapsed) .eb-navitem:hover { border-bottom-color:var(--sb-hover-ul); color:var(--sb-hover-ul); }
  .eb-sidebar:not(.collapsed) .eb-navitem:hover svg { opacity:1; }
  /* expanded active = light box */
  .eb-sidebar:not(.collapsed) .eb-navitem.active { background:var(--sb-active); border-radius:8px; border-bottom-color:transparent; color:${dark ? "#fff" : "#1C2333"}; font-weight:600; }
  .eb-sidebar:not(.collapsed) .eb-navitem.active svg { opacity:1; }
  /* collapsed hover = box */
  .eb-sidebar.collapsed .eb-navitem:hover { background:var(--sb-active); border-radius:10px; }
  .eb-sidebar.collapsed .eb-navitem:hover svg { opacity:1; }
  /* collapsed active = box */
  .eb-sidebar.collapsed .eb-navitem.active { background:var(--sb-active); border-radius:10px; }
  .eb-sidebar.collapsed .eb-navitem.active svg { opacity:1; }

  /* tooltip (collapsed only) */
  .eb-sidebar.collapsed .eb-navitem::after {
    content:attr(data-tip); position:fixed; left:74px;
    background:var(--tip-bg); color:var(--tip-clr);
    font-family:'Inter',sans-serif; font-size:11.5px; font-weight:500;
    padding:5px 12px; border-radius:7px; white-space:nowrap;
    opacity:0; pointer-events:none; transition:opacity 0.18s;
    z-index:9999; transform:translateY(-50%);
  }
  .eb-sidebar.collapsed .eb-navitem::before {
    content:''; position:fixed; left:68px;
    border:5px solid transparent; border-right-color:var(--tip-bg);
    opacity:0; pointer-events:none; transition:opacity 0.18s;
    z-index:9999; transform:translateY(-50%);
  }
  .eb-sidebar.collapsed .eb-navitem:hover::after,
  .eb-sidebar.collapsed .eb-navitem:hover::before { opacity:1; }

  .eb-sidebar-spacer { flex:1; min-height:10px; }
  .eb-sidebar-divider { height:1px; background:${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.12)"}; margin:4px 0 6px; flex-shrink:0; }

  /* ── MAIN ── */
  .eb-main { flex:1; display:flex; flex-direction:column; overflow:hidden; min-width:0; }

  /* navbar */
  .eb-navbar {
    background:var(--surface); border-bottom:1px solid var(--border);
    padding:0 24px; height:62px; display:flex; align-items:center; flex-shrink:0;
    transition:background 0.3s; position:relative;
  }
  .eb-search-box {
    display:flex; align-items:center; gap:9px;
    background:var(--surface2); border:1.5px solid var(--chip-bd);
    border-radius:30px; padding:0 16px; height:40px; width:400px;
    transition:background 0.3s, border-color 0.3s;
    position:absolute; left:50%; transform:translateX(-50%);
  }
  .eb-search-box svg { color:var(--txt-light); flex-shrink:0; }
  .eb-search-box input { flex:1; border:none; background:transparent; font-family:'Inter',sans-serif; font-size:13.5px; color:var(--txt); outline:none; }
  .eb-search-box input::placeholder { color:var(--txt-light); }
  .eb-navbar-right { margin-left:auto; display:flex; gap:10px; align-items:center; z-index:1; }

  /* contact us navbar button */
  .eb-navbar-contact {
    display:flex; align-items:center; gap:7px;
    padding:0 16px; height:38px;
    background:var(--gold); color:#fff;
    border:none; border-radius:9px;
    font-family:'Inter',sans-serif; font-size:12.5px; font-weight:500;
    cursor:pointer; transition:opacity 0.18s, transform 0.15s;
    box-shadow:0 2px 8px rgba(196,154,16,0.28); flex-shrink:0;
  }
  .eb-navbar-contact:hover { opacity:0.88; transform:translateY(-1px); }

  /* dark/light toggle */
  .eb-theme-btn {
    width:38px; height:38px; border-radius:9px; border:1.5px solid var(--chip-bd);
    background:var(--surface2); color:var(--txt); display:flex; align-items:center; justify-content:center;
    cursor:pointer; transition:all 0.18s; position:relative;
  }
  .eb-theme-btn:hover { background:var(--gold); color:#fff; border-color:var(--gold); }
  .eb-theme-btn::after {
    content:attr(data-tip); position:absolute; bottom:calc(100%+8px); left:50%; transform:translateX(-50%);
    background:var(--navy); color:#fff; font-size:11px; font-weight:500; padding:4px 9px;
    border-radius:6px; white-space:nowrap; opacity:0; pointer-events:none; transition:opacity 0.18s; z-index:100;
  }
  .eb-theme-btn:hover::after { opacity:1; }

  /* notification icon-only btn */
  .eb-notif-btn {
    position:relative; width:38px; height:38px; border-radius:9px;
    border:1.5px solid var(--chip-bd); background:var(--surface2); color:var(--txt);
    display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all 0.18s;
  }
  .eb-notif-btn:hover { background:var(--gold); color:#fff; border-color:var(--gold); }
  .eb-notif-btn::after {
    content:'Notifications'; position:absolute; bottom:calc(100%+8px); left:50%; transform:translateX(-50%);
    background:var(--navy); color:#fff; font-size:11px; font-weight:500; padding:4px 9px;
    border-radius:6px; white-space:nowrap; opacity:0; pointer-events:none; transition:opacity 0.18s; z-index:100;
  }
  .eb-notif-btn:hover::after { opacity:1; }
  .eb-notif-dot { position:absolute; top:6px; right:7px; width:7px; height:7px; background:#E74C3C; border-radius:50%; border:2px solid var(--surface2); }

  /* content */
  .eb-content { flex:1; overflow-y:auto; padding:20px 24px 18px; display:flex; flex-direction:column; gap:14px; }
  .eb-content::-webkit-scrollbar { width:5px; }
  .eb-content::-webkit-scrollbar-thumb { background:rgba(0,0,0,0.12); border-radius:3px; }

  /* tools row */
  .eb-tools-row { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; }
  .eb-tool-card {
    background:var(--surface); border-radius:16px; padding:20px 18px;
    border:1.5px solid var(--border); cursor:pointer;
    transition:box-shadow 0.22s,transform 0.22s,border-color 0.22s,background 0.3s;
    display:flex; flex-direction:column; gap:10px; min-height:165px;
  }
  .eb-tool-card:hover { box-shadow:0 6px 28px rgba(0,0,0,0.12); transform:translateY(-3px); border-color:rgba(196,154,16,0.35); }
  .eb-tool-top { display:flex; align-items:center; justify-content:space-between; }
  .eb-tool-icon { width:40px; height:40px; background:var(--card-icon-bg); border-radius:10px; display:flex; align-items:center; justify-content:center; color:var(--card-icon-clr); transition:background 0.2s; }
  .eb-tool-card:hover .eb-tool-icon { background:var(--gold); color:#fff; }
  .eb-tool-tag { font-size:9.5px; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; color:var(--gold); background:rgba(196,154,16,0.1); border-radius:20px; padding:3px 9px; }
  .eb-tool-name { font-family:'Playfair Display',serif; font-size:15.5px; font-weight:600; color:var(--navy); line-height:1.25; }
  .eb-tool-desc { font-size:11.5px; line-height:1.65; color:var(--txt-mid); flex:1; }
  .eb-tool-link { display:flex; align-items:center; gap:4px; font-size:11.5px; font-weight:500; color:var(--gold); margin-top:2px; transition:gap 0.18s; }
  .eb-tool-card:hover .eb-tool-link { gap:7px; }

  /* news row — fixed height with internal scroll */
  .eb-news-row { display:grid; grid-template-columns:1.1fr 0.9fr; gap:14px; height:220px; flex-shrink:0; }
  .eb-news-card {
    background:var(--surface); border-radius:16px; padding:18px;
    border:1.5px solid var(--border); cursor:pointer;
    transition:box-shadow 0.22s,transform 0.22s,background 0.3s;
    display:flex; flex-direction:column; gap:12px;
    min-height:0; overflow:hidden;
  }
  .eb-news-card:hover { box-shadow:0 6px 28px rgba(0,0,0,0.1); transform:translateY(-2px); }
  .eb-card-header { display:flex; align-items:center; gap:10px; border-bottom:1px solid var(--border); padding-bottom:11px; flex-shrink:0; }
  .eb-card-icon { width:34px; height:34px; background:var(--card-icon-bg); border-radius:9px; display:flex; align-items:center; justify-content:center; color:var(--card-icon-clr); flex-shrink:0; }
  .eb-card-title { font-family:'Playfair Display',serif; font-size:14.5px; font-weight:600; color:var(--navy); }
  .eb-card-sub { font-size:11px; color:var(--txt-light); margin-top:1px; }

  /* scrollable inner lists */
  .eb-news-scroll { flex:1; overflow-y:auto; display:flex; flex-direction:column; gap:7px; min-height:0; padding-right:4px; }
  .eb-news-scroll::-webkit-scrollbar { width:4px; }
  .eb-news-scroll::-webkit-scrollbar-track { background:var(--surface2); border-radius:2px; }
  .eb-news-scroll::-webkit-scrollbar-thumb { background:${dark ? "rgba(196,154,16,0.4)" : "rgba(0,0,0,0.18)"}; border-radius:2px; }

  .eb-news-item { display:flex; gap:9px; align-items:flex-start; padding:9px 10px; background:var(--surface2); border-radius:8px; transition:background 0.15s; flex-shrink:0; }
  .eb-news-item:hover { background:var(--surface3); }
  .eb-news-dot { width:6px; height:6px; border-radius:50%; background:var(--gold); margin-top:5px; flex-shrink:0; }
  .eb-news-text { font-size:12px; line-height:1.5; color:var(--txt); }
  .eb-news-time { font-size:10.5px; color:var(--txt-light); display:flex; align-items:center; gap:3px; margin-top:2px; }

  .eb-awareness-body { flex:1; overflow-y:auto; display:flex; flex-direction:column; gap:7px; min-height:0; padding-right:4px; }
  .eb-awareness-body::-webkit-scrollbar { width:4px; }
  .eb-awareness-body::-webkit-scrollbar-track { background:var(--surface2); border-radius:2px; }
  .eb-awareness-body::-webkit-scrollbar-thumb { background:${dark ? "rgba(196,154,16,0.4)" : "rgba(0,0,0,0.18)"}; border-radius:2px; }

  .eb-law-chips { display:flex; flex-wrap:wrap; gap:5px; flex-shrink:0; }
  .eb-chip { padding:4px 10px; border-radius:20px; font-size:11px; font-weight:500; background:var(--chip-bg); border:1.5px solid var(--chip-bd); color:var(--txt-mid); cursor:pointer; transition:all 0.18s; }
  .eb-chip:hover,.eb-chip.active { background:var(--navy); color:#fff; border-color:var(--navy); }
  .eb-awareness-item { display:flex; align-items:flex-start; gap:9px; padding:9px 10px; background:var(--surface2); border-radius:8px; transition:background 0.15s; flex-shrink:0; }
  .eb-awareness-item:hover { background:var(--surface3); }
  .eb-awareness-item svg { color:var(--gold); flex-shrink:0; margin-top:1px; }
  .eb-awareness-text { font-size:12px; line-height:1.5; color:var(--txt); flex:1; }
  .eb-awareness-badge { font-size:10px; font-weight:600; padding:2px 8px; border-radius:10px; white-space:nowrap; flex-shrink:0; }
  .eb-badge-new    { background:rgba(39,174,96,0.12); color:#1e8449; }
  .eb-badge-update { background:rgba(196,154,16,0.12); color:var(--gold); }

  /* ── BOTTOM BAR: chatbot (70%) + contact (30%) on one line ── */
  .eb-bottom-row {
    display:grid; grid-template-columns:7fr 3fr; gap:14px; flex-shrink:0;
  }

  /* chatbot card */
  .eb-chatbot-section {
    background:var(--surface); border-radius:16px;
    border:1.5px solid var(--border); padding:16px 18px;
    display:flex; flex-direction:column; gap:10px;
    transition:background 0.3s;
  }
  .eb-chatbot-header { display:flex; align-items:center; gap:10px; }
  .eb-chatbot-icon-wrap {
    width:36px; height:36px;
    background:linear-gradient(135deg,#1C2333,#2e3a55);
    border-radius:10px; display:flex; align-items:center; justify-content:center;
    box-shadow:0 2px 10px rgba(28,35,51,0.25); flex-shrink:0;
  }
  .eb-chatbot-title { font-family:'Playfair Display',serif; font-size:14px; font-weight:600; color:var(--navy); }
  .eb-chatbot-sub { font-size:10.5px; color:var(--txt-light); margin-top:1px; }
  .eb-chatbot-input-row {
    display:flex; align-items:center; gap:10px;
    background:var(--surface2); border:1.5px solid var(--chip-bd);
    border-radius:10px; padding:9px 12px;
    transition:border-color 0.2s, box-shadow 0.2s;
  }
  .eb-chatbot-input-row:focus-within { border-color:var(--gold); box-shadow:0 0 0 3px rgba(196,154,16,0.1); }
  .eb-chatbot-input-row svg { color:var(--gold); flex-shrink:0; }
  .eb-chat-input { flex:1; border:none; background:transparent; font-family:'Inter',sans-serif; font-size:13px; color:var(--txt); outline:none; min-width:0; }
  .eb-chat-cursor { display:inline-block; width:2px; height:13px; background:var(--gold); margin-left:1px; border-radius:1px; vertical-align:middle; animation:blink 1.05s steps(1) infinite; }
  @keyframes blink { 0%,49%{opacity:1} 50%,100%{opacity:0} }
  .eb-chat-send { display:flex; align-items:center; gap:5px; padding:0 14px; height:34px; background:var(--gold); color:#fff; border:none; border-radius:7px; font-family:'Inter',sans-serif; font-size:12px; font-weight:500; cursor:pointer; transition:opacity 0.18s,transform 0.15s; flex-shrink:0; }
  .eb-chat-send:hover { opacity:0.88; transform:translateY(-1px); }

  /* contact card */
  .eb-contact-section {
    background:var(--surface); border-radius:16px;
    border:1.5px solid var(--border); padding:16px 18px;
    display:flex; flex-direction:column; align-items:flex-start; justify-content:center; gap:12px;
    transition:background 0.3s;
  }
  .eb-contact-left { display:flex; align-items:center; gap:10px; }
  .eb-contact-icon { width:36px; height:36px; background:linear-gradient(135deg,var(--gold),#e8c94a); border-radius:9px; display:flex; align-items:center; justify-content:center; flex-shrink:0; box-shadow:0 2px 8px rgba(196,154,16,0.28); }
  .eb-contact-title { font-size:13px; font-weight:600; color:var(--navy); }
  .eb-contact-sub { font-size:10.5px; color:var(--txt-light); margin-top:1px; }
  .eb-contact-btn { width:100%; display:flex; align-items:center; justify-content:center; gap:7px; padding:0 16px; height:38px; background:var(--gold); color:#fff; border:none; border-radius:9px; font-family:'Inter',sans-serif; font-size:12.5px; font-weight:500; cursor:pointer; transition:opacity 0.18s,transform 0.15s; box-shadow:0 2px 8px rgba(196,154,16,0.25); }
  .eb-contact-btn:hover { opacity:0.88; transform:translateY(-1px); }
`

const newsItems = [
  { text: "Supreme Court upholds right to digital privacy in landmark ruling", time: "2h ago" },
  { text: "New amendments to IPC Section 420 — fraud penalties tightened", time: "5h ago" },
  { text: "Cyber law tribunals established across 12 new states in India", time: "1d ago" },
  { text: "High Court stays implementation of new bail amendment provisions", time: "2d ago" },
  { text: "Ministry releases updated guidelines for digital evidence in courts", time: "3d ago" },
]
const awarenessItems = [
  { text: "RTI filing now fully digital — simplified process for all citizens", badge: "New", type: "new" },
  { text: "Consumer Protection Act 2019: updated complaint deadlines issued", badge: "Update", type: "update" },
  { text: "New POCSO guidelines issued by Ministry of Women & Child Dev.", badge: "New", type: "new" },
  { text: "Amended Motor Vehicles Act — penalty structures revised", badge: "Update", type: "update" },
  { text: "Domestic Violence Act amendments — broader protection scope", badge: "New", type: "new" },
]
const categories = ["All", "Criminal", "Cyber Law", "Constitutional", "Civil", "Corporate"]

const mainNav = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Cases", icon: Scale },
  { label: "Contracts", icon: FileText },
  { label: "Chats", icon: BookOpen },
  { label: "Summaries", icon: Shield },
]
const bottomNav = [
  { label: "Downloads", icon: Download },
  { label: "Settings", icon: Settings },
  { label: "User Profile", icon: User },
]

export default function Dashboard() {
  const [open, setOpen] = useState(true)
  const [dark, setDark] = useState(false)
  const [activeNav, setActive] = useState("Dashboard")
  const [activeCat, setActiveCat] = useState("All")
  const { display, cursor } = useTypewriter(TAGLINES)

  const css = makeStyle(dark)

  return (
    <>
      <style>{css}</style>
      <div className="eb-root">

        {/* ── SIDEBAR ── */}
        <div className={`eb-sidebar ${open ? "" : "collapsed"}`}>

          <button className="eb-toggle-btn" onClick={() => setOpen(!open)}>
            {open ? <ChevronLeft size={13} strokeWidth={2.5} /> : <ChevronR size={13} strokeWidth={2.5} />}
          </button>

          <div className="eb-sidebar-inner">

            {/* LOGO — name text when open, logo image when closed */}
            <div className="eb-logo-wrap">
              <div className="eb-logo-expanded">
                <div className="eb-logo-text">
                  <span className="eb-logo-text-main">E-Bench</span>
                  <span className="eb-logo-text-sub">Digital Justice</span>
                </div>
              </div>
              <div className="eb-logo-collapsed">
                <img src="/logo.png" alt="E-Bench" className="eb-logo-img" style={{ width: 36, height: 36 }} />
              </div>
            </div>

            {mainNav.map(({ label, icon: Icon }) => (
              <button
                key={label} data-tip={label}
                className={`eb-navitem ${activeNav === label ? "active" : ""}`}
                onClick={() => setActive(label)}
              >
                <Icon size={16} /><span className="eb-navitem-label">{label}</span>
              </button>
            ))}

            <div className="eb-sidebar-spacer" />
            <div className="eb-sidebar-divider" />

            {bottomNav.map(({ label, icon: Icon }) => (
              <button
                key={label} data-tip={label}
                className={`eb-navitem ${activeNav === label ? "active" : ""}`}
                onClick={() => setActive(label)}
              >
                <Icon size={16} /><span className="eb-navitem-label">{label}</span>
              </button>
            ))}

          </div>
        </div>

        {/* ── MAIN ── */}
        <div className="eb-main">

          {/* NAVBAR */}
          <div className="eb-navbar">
            <div className="eb-search-box">
              <Search size={15} />
              <input placeholder="Search cases, contracts, documents…" />
            </div>
            <div className="eb-navbar-right">
              <button className="eb-navbar-contact">
                <Mail size={14} /> Contact Us
              </button>
              <button
                className="eb-theme-btn"
                data-tip={dark ? "Light Mode" : "Dark Mode"}
                onClick={() => setDark(!dark)}
              >
                {dark ? <Sun size={16} /> : <Moon size={16} />}
              </button>
              <button className="eb-notif-btn">
                <Bell size={16} />
                <span className="eb-notif-dot" />
              </button>
            </div>
          </div>

          {/* CONTENT */}
          <div className="eb-content">

            {/* TOOLS */}
            <div className="eb-tools-row">
              <div className="eb-tool-card">
                <div className="eb-tool-top">
                  <div className="eb-tool-icon"><Scale size={19} /></div>
                  <span className="eb-tool-tag">Case Intelligence</span>
                </div>
                <div className="eb-tool-name">AI Case Analyzer</div>
                <div className="eb-tool-desc">Upload or describe a case and instantly identify applicable legal sections and relevant past judgments from verified databases.</div>
                <div className="eb-tool-link">Analyze a Case <ChevronRight size={13} /></div>
              </div>
              <div className="eb-tool-card">
                <div className="eb-tool-top">
                  <div className="eb-tool-icon"><AlertTriangle size={19} /></div>
                  <span className="eb-tool-tag">Risk Detection</span>
                </div>
                <div className="eb-tool-name">Contract Risk Analyzer</div>
                <div className="eb-tool-desc">Detect hidden risks, unfair clauses, and legal loopholes. Get a plain-English risk score for every clause — before you sign.</div>
                <div className="eb-tool-link">Review a Contract <ChevronRight size={13} /></div>
              </div>
              <div className="eb-tool-card">
                <div className="eb-tool-top">
                  <div className="eb-tool-icon"><FileText size={19} /></div>
                  <span className="eb-tool-tag">Document Processing</span>
                </div>
                <div className="eb-tool-name">Case File Summarizer</div>
                <div className="eb-tool-desc">Convert FIRs, chargesheets, and court orders into clear structured summaries. Understand complex filings in minutes, not hours.</div>
                <div className="eb-tool-link">Summarize a Document <ChevronRight size={13} /></div>
              </div>
            </div>

            {/* NEWS ROW */}
            <div className="eb-news-row">
              <div className="eb-news-card">
                <div className="eb-card-header">
                  <div className="eb-card-icon"><Newspaper size={16} /></div>
                  <div>
                    <div className="eb-card-title">Legal News Feed</div>
                    <div className="eb-card-sub">Curated legal developments · updated hourly</div>
                  </div>
                </div>
                <div className="eb-news-scroll">
                  {newsItems.map((item, i) => (
                    <div className="eb-news-item" key={i}>
                      <div className="eb-news-dot" />
                      <div>
                        <div className="eb-news-text">{item.text}</div>
                        <div className="eb-news-time"><Clock size={9} /> {item.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="eb-news-card">
                <div className="eb-card-header">
                  <div className="eb-card-icon"><BookOpen size={16} /></div>
                  <div>
                    <div className="eb-card-title">Daily Law Awareness</div>
                    <div className="eb-card-sub">Know your rights · stay informed</div>
                  </div>
                </div>
                <div className="eb-law-chips">
                  {categories.map(c => (
                    <div key={c} className={`eb-chip ${activeCat === c ? "active" : ""}`} onClick={() => setActiveCat(c)}>{c}</div>
                  ))}
                </div>
                <div className="eb-awareness-body">
                  {awarenessItems.map((item, i) => (
                    <div className="eb-awareness-item" key={i}>
                      <CheckCircle size={13} />
                      <div className="eb-awareness-text">{item.text}</div>
                      <span className={`eb-awareness-badge ${item.type === "new" ? "eb-badge-new" : "eb-badge-update"}`}>{item.badge}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CHATBOT — full width */}
            <div className="eb-chatbot-section">
              <div className="eb-chatbot-header">
                <div className="eb-chatbot-icon-wrap">
                  <Sparkles size={17} color="#C49A10" />
                </div>
                <div>
                  <div className="eb-chatbot-title">E-Bench AI Assistant</div>
                  <div className="eb-chatbot-sub">Powered by verified legal intelligence</div>
                </div>
              </div>
              <div className="eb-chatbot-input-row">
                <MessageSquare size={14} />
                <input className="eb-chat-input" placeholder="" style={{ caretColor: "transparent" }} />
                <span style={{ fontSize: 13, color: "var(--txt-light)", pointerEvents: "none", whiteSpace: "nowrap", overflow: "hidden", flex: 1, display: "flex", alignItems: "center" }}>
                  {display}
                  <span className="eb-chat-cursor" style={{ opacity: cursor ? 1 : 0 }} />
                </span>
                <button className="eb-chat-send">
                  <Sparkles size={12} /> Ask
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </>
  )
}