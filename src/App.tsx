import { useState, useEffect, FormEvent, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code,
  Cpu,
  Smartphone,
  Menu,
  X,
  Phone,
  Mail,
  Github,
  Linkedin,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import emailjs from "@emailjs/browser";
import mermaid from "mermaid";

// Google Fonts injection
const fontLink = document.createElement("link");
fontLink.href =
  "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

mermaid.initialize({ startOnLoad: true });

interface Project {
  id: number;
  title: string;
  description: string;
  longDescription: string;
  technologies: string[];
  github?: string;
  demo?: string;
  image: string;
  uml?: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: "Gestion de bibliothèque en ligne",
    description:
      "Plateforme développée en PHP procédural avec architecture MVC.",
    longDescription:
      "Gestion totale de bibliothèque en ligne qui permet de faire des achats de livres en ligne.",
    technologies: ["PHP", "Bootstrap", "MySQL", "Javascript"],
    github: "https://github.com/adekomen/book-shop.git",
    demo: "http://lesaint.alwaysdata.net",
    image: "/assets/bookly.png",
  },
  {
    id: 2,
    title: "Application de restauration",
    description:
      "Plateforme où on peut trouver les mets du restaurant et faire une commande.",
    longDescription: "Plateforme de restauration utilisant Angular.",
    technologies: ["Angular", "Html & CSS", "Javascript"],
    github: "https://github.com/adekomen/kenfood_app.git",
    demo: "https://warm-sable-eaf70d.netlify.app/",
    image: "/assets/foodapp.png",
  },
  {
    id: 3,
    title: "Suivi d'habitudes",
    description:
      "Une application Flutter pour suivre vos habitudes quotidiennes.",
    longDescription:
      "Une application Flutter pour suivre vos habitudes quotidiennes et bien planifier sa journée.",
    technologies: ["Flutter", "Dart"],
    github: "https://github.com/adekomen/habit-tracker-app.git",
    image: "/assets/flutterapp.jpg",
  },
  {
    id: 4,
    title: "Recherche d'hôtels",
    description:
      "Application React & Node.js pour chercher des hôtels, réalisée en équipe.",
    longDescription:
      "Application Fullstack avec React, Node.js et MySQL pour gérer la recherche d'hôtels en ligne.",
    technologies: ["React", "Nodejs", "MySQL"],
    github: "https://github.com/adekomen/hotel_booking.git",
    demo: "https://hotelbooking-psi.vercel.app/",
    image: "/assets/hotel.png",
  },
  {
    id: 5,
    title: "SIZER — Prise de mesures",
    description:
      "Solution digitale innovante pour simplifier la prise de mesures en couture.",
    longDescription:
      "Permet aux couturiers d'enregistrer, consulter, modifier et exporter les mensurations des clients, avec tailles standards et suggestions intelligentes.",
    technologies: ["Flutter", "Dart", "Firebase", "Supabase"],
    github: "https://github.com/adekomen/sizer_app.git",
    image: "/assets/couturier1.png",
  },
];

// ─── CSS VARIABLES & GLOBAL STYLES ───────────────────────────────────────────
const injectStyles = () => {
  const style = document.createElement("style");
  style.textContent = `
    :root {
      --bg: #0A0A0F;
      --surface: #12121C;
      --surface2: #1A1A2E;
      --accent: #0FF4C6;
      --accent2: #7B2FBE;
      --text: #E8E8F0;
      --text-sub: #9090A8;
      --border: rgba(255,255,255,0.07);
      --font-display: 'Space Grotesk', sans-serif;
      --font-body: 'Inter', sans-serif;
      --font-mono: 'JetBrains Mono', monospace;
    }
    .light-mode {
      --bg: #F4F4FA;
      --surface: #FFFFFF;
      --surface2: #EEEEF8;
      --accent: #0891B2;
      --accent2: #7B2FBE;
      --text: #0A0A1A;
      --text-sub: #60607A;
      --border: rgba(0,0,0,0.08);
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: var(--font-body);
      overflow-x: hidden;
    }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: var(--bg); }
    ::-webkit-scrollbar-thumb { background: var(--accent2); border-radius: 2px; }

    .section-label {
      font-family: var(--font-mono);
      font-size: 0.7rem;
      color: var(--accent);
      letter-spacing: 0.2em;
      text-transform: uppercase;
      margin-bottom: 0.5rem;
    }
    .section-big-number {
      font-family: var(--font-mono);
      font-size: clamp(5rem, 12vw, 9rem);
      color: var(--border);
      font-weight: 700;
      position: absolute;
      right: 2rem;
      top: 1.5rem;
      line-height: 1;
      pointer-events: none;
      user-select: none;
      letter-spacing: -0.05em;
    }

    /* ── SIDEBAR ─────────────────────────── */
    .sidebar {
      width: 240px;
      background: var(--surface);
      border-right: 1px solid var(--border);
      height: 100vh;
      position: fixed;
      top: 0; left: 0;
      display: flex;
      flex-direction: column;
      padding: 2rem 1.5rem;
      z-index: 40;
      transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
    }
    .sidebar-logo {
      font-family: var(--font-display);
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--text);
      letter-spacing: 0.05em;
      margin-bottom: 2.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .sidebar-logo span.dot {
      width: 8px; height: 8px;
      background: var(--accent);
      border-radius: 50%;
      display: inline-block;
      animation: pulse-dot 2s ease-in-out infinite;
    }
    @keyframes pulse-dot {
      0%,100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.7); }
    }
    .nav-link {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.6rem 0.75rem;
      border-radius: 8px;
      color: var(--text-sub);
      text-decoration: none;
      font-family: var(--font-body);
      font-size: 0.875rem;
      font-weight: 500;
      transition: all 0.2s;
      margin-bottom: 0.25rem;
      position: relative;
      overflow: hidden;
    }
    .nav-link::before {
      content: '';
      position: absolute;
      left: 0; top: 0; bottom: 0;
      width: 2px;
      background: var(--accent);
      transform: scaleY(0);
      transition: transform 0.2s;
    }
    .nav-link:hover {
      color: var(--text);
      background: var(--surface2);
    }
    .nav-link:hover::before { transform: scaleY(1); }
    .nav-link .nav-icon {
      font-size: 1rem;
      width: 18px;
      text-align: center;
    }
    .sidebar-socials {
      display: flex;
      gap: 0.75rem;
      margin-top: auto;
      padding-top: 1rem;
      border-top: 1px solid var(--border);
    }
    .social-btn {
      width: 36px; height: 36px;
      border-radius: 8px;
      background: var(--surface2);
      border: 1px solid var(--border);
      display: flex; align-items: center; justify-content: center;
      color: var(--text-sub);
      text-decoration: none;
      transition: all 0.2s;
    }
    .social-btn:hover {
      background: var(--accent);
      color: var(--bg);
      border-color: var(--accent);
    }

    /* ── TOPBAR ──────────────────────────── */
    .topbar {
      position: fixed;
      top: 0; right: 0;
      background: var(--surface);
      border-bottom: 1px solid var(--border);
      padding: 0 2rem;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      z-index: 30;
      backdrop-filter: blur(12px);
      transition: left 0.3s cubic-bezier(0.4,0,0.2,1);
    }
    .topbar-quote {
      font-family: var(--font-mono);
      font-size: 0.72rem;
      color: var(--accent);
      opacity: 0.8;
    }
    .theme-toggle {
      background: var(--surface2);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 0.3rem 0.7rem;
      cursor: pointer;
      color: var(--text-sub);
      font-size: 0.85rem;
      transition: all 0.2s;
      display: flex; align-items: center; gap: 0.4rem;
    }
    .theme-toggle:hover { border-color: var(--accent); color: var(--accent); }
    .hamburger {
      background: var(--surface2);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 0.4rem;
      cursor: pointer;
      color: var(--text);
      display: none;
      align-items: center;
      justify-content: center;
    }

    /* ── MAIN ────────────────────────────── */
    .main-content {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      transition: margin-left 0.3s cubic-bezier(0.4,0,0.2,1);
      padding-top: 56px;
    }

    /* ── HERO ────────────────────────────── */
    .hero {
      min-height: calc(100vh - 56px);
      display: flex;
      align-items: center;
      padding: 4rem 3rem;
      position: relative;
      overflow: hidden;
    }
    .hero-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: center;
      width: 100%;
      max-width: 1100px;
    }
    .hero-eyebrow {
      font-family: var(--font-mono);
      font-size: 0.8rem;
      color: var(--accent);
      letter-spacing: 0.15em;
      text-transform: uppercase;
      margin-bottom: 1rem;
    }
    .hero-name {
      font-family: var(--font-display);
      font-size: clamp(2.5rem, 5vw, 4rem);
      font-weight: 700;
      line-height: 1.05;
      color: var(--text);
      margin-bottom: 0.5rem;
    }
    .hero-role {
      font-family: var(--font-mono);
      font-size: clamp(1rem, 2vw, 1.3rem);
      color: var(--text-sub);
      margin-bottom: 1.5rem;
      min-height: 1.8em;
    }
    .hero-role .cursor {
      display: inline-block;
      width: 2px;
      height: 1.1em;
      background: var(--accent);
      vertical-align: middle;
      margin-left: 2px;
      animation: blink 1s step-end infinite;
    }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
    .hero-desc {
      font-size: 0.95rem;
      color: var(--text-sub);
      line-height: 1.7;
      margin-bottom: 2rem;
      max-width: 440px;
    }
    .hero-cta {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: var(--accent);
      color: var(--bg);
      font-family: var(--font-display);
      font-weight: 600;
      font-size: 0.875rem;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      text-decoration: none;
      transition: all 0.2s;
      letter-spacing: 0.02em;
    }
    .hero-cta:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(15,244,198,0.3);
    }
    .hero-cta-ghost {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: transparent;
      color: var(--text-sub);
      font-family: var(--font-display);
      font-weight: 500;
      font-size: 0.875rem;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      text-decoration: none;
      border: 1px solid var(--border);
      transition: all 0.2s;
      margin-left: 0.75rem;
    }
    .hero-cta-ghost:hover { border-color: var(--accent); color: var(--accent); }

    /* Hero image */
    .hero-image-wrap {
      position: relative;
      border-radius: 20px;
      overflow: hidden;
      aspect-ratio: 4/5;
      max-height: 520px;
    }
    .hero-image-wrap::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(15,244,198,0.12) 0%, rgba(123,47,190,0.12) 100%);
      z-index: 1;
      pointer-events: none;
    }
    .hero-image-wrap::after {
      content: '';
      position: absolute;
      inset: -1px;
      border-radius: 20px;
      border: 1px solid rgba(15,244,198,0.2);
      pointer-events: none;
      z-index: 2;
    }
    .hero-image-wrap img {
      width: 100%; height: 100%;
      object-fit: cover;
      object-position: center top;
      display: block;
    }
    /* Background glow */
    .hero-glow {
      position: absolute;
      width: 500px; height: 500px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(123,47,190,0.15) 0%, transparent 70%);
      top: -100px; right: -100px;
      pointer-events: none;
    }
    .hero-glow2 {
      position: absolute;
      width: 300px; height: 300px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(15,244,198,0.1) 0%, transparent 70%);
      bottom: 50px; left: 10%;
      pointer-events: none;
    }

    /* ── SECTION BASE ────────────────────── */
    .section {
      padding: 5rem 3rem;
      position: relative;
      overflow: hidden;
    }
    .section-header {
      margin-bottom: 3rem;
      position: relative;
    }
    .section-title {
      font-family: var(--font-display);
      font-size: clamp(1.8rem, 3.5vw, 2.5rem);
      font-weight: 700;
      color: var(--text);
      line-height: 1.1;
    }
    .section-line {
      width: 40px;
      height: 3px;
      background: linear-gradient(90deg, var(--accent), var(--accent2));
      border-radius: 2px;
      margin-top: 0.75rem;
    }

    /* ── PROJECTS ────────────────────────── */
    .filter-bar {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 2.5rem;
    }
    .filter-pill {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      padding: 0.35rem 0.9rem;
      border-radius: 20px;
      border: 1px solid var(--border);
      background: transparent;
      color: var(--text-sub);
      cursor: pointer;
      transition: all 0.2s;
      letter-spacing: 0.05em;
    }
    .filter-pill:hover, .filter-pill.active {
      background: var(--accent);
      color: var(--bg);
      border-color: var(--accent);
    }
    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }
    .project-card {
      background: var(--surface2);
      border: 1px solid var(--border);
      border-radius: 16px;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
      position: relative;
    }
    .project-card:hover {
      transform: translateY(-4px);
      border-color: rgba(15,244,198,0.3);
      box-shadow: 0 12px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(15,244,198,0.1);
    }
    .project-img {
      width: 100%;
      height: 180px;
      object-fit: cover;
      display: block;
      transition: transform 0.4s ease;
    }
    .project-card:hover .project-img { transform: scale(1.03); }
    .project-img-wrap { overflow: hidden; position: relative; }
    .project-img-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(10,10,15,0.8) 0%, transparent 50%);
      opacity: 0;
      transition: opacity 0.3s;
      display: flex;
      align-items: flex-end;
      padding: 1rem;
      gap: 0.5rem;
    }
    .project-card:hover .project-img-overlay { opacity: 1; }
    .project-link-chip {
      font-family: var(--font-mono);
      font-size: 0.7rem;
      padding: 0.3rem 0.6rem;
      border-radius: 6px;
      background: var(--accent);
      color: var(--bg);
      text-decoration: none;
      display: flex; align-items: center; gap: 0.3rem;
      transition: opacity 0.2s;
    }
    .project-link-chip:hover { opacity: 0.85; }
    .project-body {
      padding: 1.25rem 1.5rem 1.5rem;
    }
    .project-techs {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
      margin-bottom: 0.75rem;
    }
    .tech-badge {
      font-family: var(--font-mono);
      font-size: 0.67rem;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      background: var(--surface2);
      color: var(--accent);
      border: 1px solid rgba(15,244,198,0.2);
      letter-spacing: 0.04em;
    }
    .project-title {
      font-family: var(--font-display);
      font-size: 1rem;
      font-weight: 600;
      color: var(--text);
      margin-bottom: 0.4rem;
      line-height: 1.3;
    }
    .project-desc {
      font-size: 0.83rem;
      color: var(--text-sub);
      line-height: 1.6;
    }
    .pagination {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-top: 2.5rem;
      justify-content: center;
    }
    .page-btn {
      width: 36px; height: 36px;
      border-radius: 8px;
      background: var(--surface);
      border: 1px solid var(--border);
      color: var(--text-sub);
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.2s;
    }
    .page-btn:hover:not(:disabled) { border-color: var(--accent); color: var(--accent); }
    .page-btn:disabled { opacity: 0.3; cursor: not-allowed; }
    .page-info {
      font-family: var(--font-mono);
      font-size: 0.78rem;
      color: var(--text-sub);
    }

    /* ── MODAL ───────────────────────────── */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.7);
      backdrop-filter: blur(4px);
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
    }
    .modal-box {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 20px;
      max-width: 640px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      padding: 2rem;
      position: relative;
    }
    .modal-close {
      position: absolute;
      top: 1rem; right: 1rem;
      background: var(--surface2);
      border: 1px solid var(--border);
      border-radius: 8px;
      width: 32px; height: 32px;
      cursor: pointer;
      color: var(--text-sub);
      display: flex; align-items: center; justify-content: center;
      transition: all 0.2s;
    }
    .modal-close:hover { background: rgba(255,80,80,0.1); color: #ff5050; border-color: rgba(255,80,80,0.3); }

    /* ── SKILLS ──────────────────────────── */
    .skills-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
    }
    .skill-chip {
      font-family: var(--font-mono);
      font-size: 0.8rem;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      background: var(--surface);
      border: 1px solid var(--border);
      color: var(--text-sub);
      transition: all 0.2s;
      cursor: default;
    }
    .skill-chip:hover {
      background: var(--surface2);
      border-color: var(--accent);
      color: var(--accent);
      transform: translateY(-2px);
    }
    .journey-cards {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
      margin-top: 3rem;
    }
    .journey-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 1.75rem;
      transition: all 0.25s;
    }
    .journey-card:hover {
      transform: translateY(-4px);
      border-color: rgba(15,244,198,0.3);
    }
    .journey-icon {
      width: 44px; height: 44px;
      border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 1rem;
    }
    .journey-card h3 {
      font-family: var(--font-display);
      font-size: 1rem;
      font-weight: 600;
      color: var(--text);
      margin-bottom: 0.6rem;
    }
    .journey-card p {
      font-size: 0.84rem;
      color: var(--text-sub);
      line-height: 1.65;
    }

    /* ── ABOUT ───────────────────────────── */
    .about-grid {
      display: grid;
      grid-template-columns: 260px 1fr;
      gap: 3rem;
      align-items: start;
    }
    .about-photo {
      border-radius: 16px;
      overflow: hidden;
      aspect-ratio: 3/4;
      border: 1px solid var(--border);
      position: relative;
    }
    .about-photo::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(15,244,198,0.08) 0%, rgba(123,47,190,0.08) 100%);
    }
    .about-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .about-text p {
      font-size: 0.9rem;
      color: var(--text-sub);
      line-height: 1.8;
      margin-bottom: 1.2rem;
    }
    .about-text p strong { color: var(--text); }
    .vision-banner {
      background: linear-gradient(135deg, rgba(15,244,198,0.08) 0%, rgba(123,47,190,0.12) 100%);
      border: 1px solid rgba(15,244,198,0.15);
      border-radius: 12px;
      padding: 1.5rem 2rem;
      margin-top: 2rem;
    }
    .vision-banner h3 {
      font-family: var(--font-display);
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--accent);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 0.5rem;
    }
    .vision-banner p {
      font-size: 0.9rem;
      color: var(--text-sub);
      font-style: italic;
      line-height: 1.7;
    }

    /* ── CONTACT ─────────────────────────── */
    .contact-layout {
      display: grid;
      grid-template-columns: 1fr 1.4fr;
      gap: 4rem;
      align-items: start;
    }
    .contact-info h3 {
      font-family: var(--font-display);
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text);
      margin-bottom: 0.75rem;
    }
    .contact-info p {
      font-size: 0.88rem;
      color: var(--text-sub);
      line-height: 1.75;
      margin-bottom: 2rem;
    }
    .contact-links { display: flex; flex-direction: column; gap: 0.75rem; }
    .contact-link {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      border-radius: 10px;
      background: var(--surface);
      border: 1px solid var(--border);
      color: var(--text-sub);
      text-decoration: none;
      font-size: 0.85rem;
      transition: all 0.2s;
    }
    .contact-link:hover { border-color: var(--accent); color: var(--text); }
    .contact-link svg { color: var(--accent); flex-shrink: 0; }
    .form-group { margin-bottom: 1rem; }
    .form-label {
      display: block;
      font-family: var(--font-mono);
      font-size: 0.72rem;
      color: var(--text-sub);
      letter-spacing: 0.1em;
      text-transform: uppercase;
      margin-bottom: 0.4rem;
    }
    .form-input, .form-textarea {
      width: 100%;
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 0.75rem 1rem;
      color: var(--text);
      font-family: var(--font-body);
      font-size: 0.88rem;
      outline: none;
      transition: border-color 0.2s;
    }
    .form-input:focus, .form-textarea:focus { border-color: var(--accent); }
    .form-textarea { resize: vertical; min-height: 120px; }
    .form-submit {
      width: 100%;
      background: var(--accent);
      color: var(--bg);
      border: none;
      border-radius: 10px;
      padding: 0.85rem;
      font-family: var(--font-display);
      font-weight: 600;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.2s;
      display: flex; align-items: center; justify-content: center; gap: 0.5rem;
      margin-top: 1.25rem;
    }
    .form-submit:hover { box-shadow: 0 6px 20px rgba(15,244,198,0.25); transform: translateY(-1px); }
    .form-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

    /* ── CV ──────────────────────────────── */
    .cv-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
    }
    .cv-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 2.5rem 3rem;
      text-align: center;
      max-width: 480px;
    }
    .cv-card h3 {
      font-family: var(--font-display);
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--text);
      margin-bottom: 0.5rem;
    }
    .cv-card p { font-size: 0.85rem; color: var(--text-sub); margin-bottom: 1.5rem; }
    .cv-btns { display: flex; gap: 0.75rem; flex-wrap: wrap; justify-content: center; }
    .cv-btn {
      padding: 0.7rem 1.4rem;
      border-radius: 8px;
      font-family: var(--font-display);
      font-weight: 600;
      font-size: 0.85rem;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.2s;
      cursor: pointer;
      border: none;
    }
    .cv-btn-primary {
      background: var(--accent);
      color: var(--bg);
    }
    .cv-btn-primary:hover { box-shadow: 0 6px 20px rgba(15,244,198,0.25); transform: translateY(-1px); }
    .cv-btn-outline {
      background: transparent;
      color: var(--text-sub);
      border: 1px solid var(--border) !important;
    }
    .cv-btn-outline:hover { border-color: var(--accent) !important; color: var(--accent); }

    /* ── FOOTER ──────────────────────────── */
    .footer {
      background: var(--surface);
      border-top: 1px solid var(--border);
      padding: 3rem;
    }
    .footer-inner {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
      margin-bottom: 2.5rem;
    }
    .footer-brand h3 {
      font-family: var(--font-display);
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--text);
      margin-bottom: 0.5rem;
    }
    .footer-brand p { font-size: 0.82rem; color: var(--text-sub); line-height: 1.6; }
    .footer h4 {
      font-family: var(--font-display);
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--text);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 1rem;
    }
    .footer-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--text-sub);
      text-decoration: none;
      font-size: 0.83rem;
      margin-bottom: 0.6rem;
      transition: color 0.2s;
    }
    .footer-link:hover { color: var(--accent); }
    .footer-bottom {
      border-top: 1px solid var(--border);
      padding-top: 1.5rem;
      text-align: center;
      font-family: var(--font-mono);
      font-size: 0.72rem;
      color: var(--text-sub);
    }
    .footer-bottom span { color: var(--accent); }

    /* ── RESPONSIVE ──────────────────────── */
    @media (max-width: 1024px) {
      .journey-cards { grid-template-columns: 1fr 1fr; }
    }
    @media (max-width: 768px) {
      .hamburger { display: flex !important; }
      .hero { padding: 2rem 1.5rem; }
      .hero-grid { grid-template-columns: 1fr; gap: 2rem; }
      .hero-image-wrap { max-height: 320px; }
      .section { padding: 3.5rem 1.5rem; }
      .about-grid { grid-template-columns: 1fr; }
      .contact-layout { grid-template-columns: 1fr; }
      .journey-cards { grid-template-columns: 1fr; }
      .footer-inner { grid-template-columns: 1fr; }
      .footer { padding: 2rem 1.5rem; }
    }
    @media (max-width: 480px) {
      .hero-name { font-size: 2rem; }
      .projects-grid { grid-template-columns: 1fr; }
    }

    @media (prefers-reduced-motion: reduce) {
      * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
    }

    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  `;
  document.head.appendChild(style);
};
injectStyles();

// ─── TYPING EFFECT HOOK ───────────────────────────────────────────────────────
const useTyping = (phrases: string[], speed = 60, pause = 2000) => {
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<"typing" | "pausing" | "deleting">(
    "typing",
  );
  const [idx, setIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const current = phrases[idx];
    if (phase === "typing") {
      if (charIdx < current.length) {
        timeout = setTimeout(() => {
          setText(current.slice(0, charIdx + 1));
          setCharIdx((c) => c + 1);
        }, speed);
      } else {
        timeout = setTimeout(() => setPhase("pausing"), pause);
      }
    } else if (phase === "pausing") {
      timeout = setTimeout(() => setPhase("deleting"), 300);
    } else {
      if (charIdx > 0) {
        timeout = setTimeout(() => {
          setText(current.slice(0, charIdx - 1));
          setCharIdx((c) => c - 1);
        }, speed / 2);
      } else {
        setIdx((i) => (i + 1) % phrases.length);
        setPhase("typing");
      }
    }
    return () => clearTimeout(timeout);
  }, [text, phase, idx, charIdx, phrases, speed, pause]);

  return text;
};

// ─── PROJECT MODAL ────────────────────────────────────────────────────────────
const ProjectModal: React.FC<{
  project: Project | null;
  onClose: () => void;
}> = ({ project, onClose }) => {
  const mermaidRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (project?.uml && mermaidRef.current) {
      mermaid.render("mermaid-diagram", project.uml).then(({ svg }) => {
        if (mermaidRef.current) mermaidRef.current.innerHTML = svg;
      });
    }
  }, [project]);
  if (!project) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="modal-box"
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="modal-close" onClick={onClose}>
            <X size={14} />
          </button>
          <div className="section-label" style={{ marginBottom: "0.5rem" }}>
            Projet #{project.id.toString().padStart(2, "0")}
          </div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.3rem",
              fontWeight: 700,
              color: "var(--text)",
              marginBottom: "1.25rem",
              paddingRight: "2rem",
            }}
          >
            {project.title}
          </h2>
          <div
            style={{
              borderRadius: "12px",
              overflow: "hidden",
              marginBottom: "1.5rem",
              aspectRatio: "16/7",
            }}
          >
            <img
              src={project.image}
              alt={project.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>
          <p
            style={{
              fontSize: "0.87rem",
              color: "var(--text-sub)",
              lineHeight: 1.75,
              marginBottom: "1.25rem",
            }}
          >
            {project.longDescription}
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.4rem",
              marginBottom: "1.5rem",
            }}
          >
            {project.technologies.map((t) => (
              <span key={t} className="tech-badge">
                {t}
              </span>
            ))}
          </div>
          {project.uml && (
            <div
              ref={mermaidRef}
              className="mermaid"
              style={{ marginBottom: "1.5rem" }}
            />
          )}
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="project-link-chip"
              >
                <Github size={12} /> GitHub
              </a>
            )}
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="project-link-chip"
                style={{ background: "var(--accent2)" }}
              >
                <ExternalLink size={12} /> Démo live
              </a>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ─── APP ──────────────────────────────────────────────────────────────────────
const App: React.FC = () => {
  const [theme, setTheme] = useState<"dark" | "light">(
    (localStorage.getItem("theme") as "dark" | "light") || "dark",
  );
  const [filter, setFilter] = useState("Tous");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 6;

  const typedRole = useTyping([
    "Développeur Full-Stack",
    "Architecte Logiciel",
    "Dev Mobile Flutter",
    "Passionné d'UX",
  ]);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.className = theme === "light" ? "light-mode" : "";
  }, [theme]);

  useEffect(() => {
    const onResize = () => setIsSidebarOpen(window.innerWidth >= 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const uniqueTechs = [
    "Tous",
    ...Array.from(new Set(projects.flatMap((p) => p.technologies))),
  ];
  const filtered =
    filter === "Tous"
      ? projects
      : projects.filter((p) => p.technologies.includes(filter));
  const totalPages = Math.ceil(filtered.length / projectsPerPage);
  const currentProjects = filtered.slice(
    (currentPage - 1) * projectsPerPage,
    currentPage * projectsPerPage,
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.message.trim()
    ) {
      setFormStatus("Veuillez remplir tous les champs.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setFormStatus("Email invalide.");
      return;
    }
    setIsSubmitting(true);
    setFormStatus("Envoi en cours…");
    emailjs
      .send(
        "service_petyfkl",
        "template_vjwqkum",
        formData,
        "e6L6MGEksEKA9FB_w",
      )
      .then(() => {
        setFormStatus("Message envoyé avec succès !");
        setFormData({ name: "", email: "", message: "" });
      })
      .catch(() => setFormStatus("Erreur lors de l'envoi. Réessayez."))
      .finally(() => setIsSubmitting(false));
  };

  const sidebarX = isSidebarOpen ? 0 : -240;
  const mainML = isSidebarOpen ? 240 : 0;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        color: "var(--text)",
      }}
    >
      {/* ── SIDEBAR ── */}
      <motion.aside
        className="sidebar"
        animate={{ x: sidebarX }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="sidebar-logo">
          <span className="dot" />
          ADESU-FLS
        </div>

        <nav style={{ flex: 1 }}>
          {[
            { href: "#home", icon: "⌂", label: "Home" },
            { href: "#about", icon: "◎", label: "About" },
            { href: "#projects", icon: "⬡", label: "Projects" },
            { href: "#skills", icon: "⚡", label: "Skills" },
            { href: "#contact", icon: "✉", label: "Contact" },
            { href: "#cv", icon: "↓", label: "CV" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="nav-link"
              onClick={() => window.innerWidth < 768 && setIsSidebarOpen(false)}
            >
              <span
                className="nav-icon"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.85rem",
                  color: "var(--accent)",
                }}
              >
                {item.icon}
              </span>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="sidebar-socials">
          <a
            href="https://www.linkedin.com/in/kokouvi-fran%C3%A7ois-adesu-179347290/"
            className="social-btn"
            aria-label="LinkedIn"
          >
            <Linkedin size={14} />
          </a>
          <a
            href="https://github.com/adekomen"
            className="social-btn"
            aria-label="GitHub"
          >
            <Github size={14} />
          </a>
          <a
            href="mailto:k.francoisadesu@gmail.com"
            className="social-btn"
            aria-label="Email"
          >
            <Mail size={14} />
          </a>
        </div>
      </motion.aside>

      {/* Mobile overlay */}
      {isSidebarOpen && window.innerWidth < 768 && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 35,
          }}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ── TOPBAR ── */}
      <motion.nav
        className="topbar"
        animate={{ left: mainML }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      >
        <button
          className="hamburger"
          style={{ display: "flex" }}
          onClick={() => setIsSidebarOpen((v) => !v)}
          aria-label="Menu"
        >
          {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
        <span className="topbar-quote">
          // Codez vos rêves, construisez l'avenir
        </span>
        <button
          className="theme-toggle"
          onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
        >
          {theme === "dark" ? "☀️" : "🌙"}{" "}
          <span style={{ fontSize: "0.75rem" }}>
            {theme === "dark" ? "Light" : "Dark"}
          </span>
        </button>
      </motion.nav>

      {/* ── MAIN CONTENT ── */}
      <motion.div
        className="main-content"
        animate={{ marginLeft: mainML }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* ── HERO ── */}
        <section id="home" className="hero">
          <div className="hero-glow" />
          <div className="hero-glow2" />
          <div className="hero-grid">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <p className="hero-eyebrow">👋 Bienvenue sur mon portfolio</p>
              <h1 className="hero-name">
                Kokouvi François
                <br />
                ADESU
              </h1>
              <p className="hero-role">
                <span style={{ color: "var(--accent)" }}>$ </span>
                {typedRole}
                <span className="cursor" />
              </p>
              <p className="hero-desc">
                Architecte logiciel basé à Lomé, Togo. Je construis des
                expériences web et mobile élégantes, du backend robuste aux
                interfaces modernes.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                <a href="#projects" className="hero-cta">
                  Voir mes projets <ExternalLink size={14} />
                </a>
                <a href="#contact" className="hero-cta-ghost">
                  Me contacter →
                </a>
              </div>
            </motion.div>

            <motion.div
              className="hero-image-wrap"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <img
                src="/assets/lesaint2.jpg"
                alt="François ADESU"
                loading="lazy"
              />
            </motion.div>
          </div>
        </section>

        {/* ── PROJECTS ── */}
        <section
          id="projects"
          className="section"
          style={{ background: "var(--surface)" }}
        >
          <span className="section-big-number">02</span>
          <div className="section-header">
            <p className="section-label">// mes réalisations</p>
            <h2 className="section-title">Projets récents</h2>
            <div className="section-line" />
          </div>

          <div className="filter-bar">
            {uniqueTechs.map((tech) => (
              <button
                key={tech}
                className={`filter-pill ${filter === tech ? "active" : ""}`}
                onClick={() => {
                  setFilter(tech);
                  setCurrentPage(1);
                }}
              >
                {tech}
              </button>
            ))}
          </div>

          <div className="projects-grid">
            {currentProjects.map((project, i) => (
              <motion.div
                key={project.id}
                className="project-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                onClick={() => setSelectedProject(project)}
              >
                <div className="project-img-wrap">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="project-img"
                    loading="lazy"
                  />
                  <div className="project-img-overlay">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-link-chip"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Github size={11} /> GitHub
                      </a>
                    )}
                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-link-chip"
                        style={{ background: "var(--accent2)" }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink size={11} /> Demo
                      </a>
                    )}
                  </div>
                </div>
                <div className="project-body">
                  <div className="project-techs">
                    {project.technologies.slice(0, 3).map((t) => (
                      <span key={t} className="tech-badge">
                        {t}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="tech-badge">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-desc">{project.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="page-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                <ChevronLeft size={16} />
              </button>
              <span className="page-info">
                Page {currentPage} / {totalPages}
              </span>
              <button
                className="page-btn"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}

          <AnimatePresence>
            {selectedProject && (
              <ProjectModal
                project={selectedProject}
                onClose={() => setSelectedProject(null)}
              />
            )}
          </AnimatePresence>
        </section>

        {/* ── SKILLS ── */}
        <section id="skills" className="section">
          <span className="section-big-number">03</span>
          <div className="section-header">
            <p className="section-label">// mon arsenal</p>
            <h2 className="section-title">Compétences</h2>
            <div className="section-line" />
          </div>

          <p
            style={{
              fontSize: "0.9rem",
              color: "var(--text-sub)",
              maxWidth: "520px",
              lineHeight: 1.75,
              marginBottom: "2rem",
            }}
          >
            À travers mon parcours, j'ai exploré et maîtrisé diverses
            technologies, toujours avec la même curiosité et l'envie de créer
            des solutions qui ont du sens.
          </p>

          <div className="skills-grid">
            {[
              "JavaScript",
              "TypeScript",
              "PHP",
              "Python",
              "React",
              "Angular",
              "Node.js",
              "Laravel",
              "Flutter",
              "Dart",
              "MySQL",
              "MongoDB",
              "SQL",
              "Docker",
              "UML",
            ].map((skill) => (
              <motion.span
                key={skill}
                className="skill-chip"
                whileHover={{ y: -3 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {skill}
              </motion.span>
            ))}
          </div>

          <div className="journey-cards">
            {[
              {
                icon: <Code size={20} />,
                color: "#3B82F6",
                title: "Débuts en Programmation",
                desc: "Initiation aux algorithmes et POO avec Java. Premiers projets web (HTML/CSS/JS) et découverte des bases de données relationnelles.",
              },
              {
                icon: <Cpu size={20} />,
                color: "#7B2FBE",
                title: "Architecture Logicielle",
                desc: "Conception de systèmes modulaires avec microservices. Expérience avec Docker, API REST. Développement d'applications fullstack.",
              },
              {
                icon: <Smartphone size={20} />,
                color: "#0FF4C6",
                title: "Passion Web/Mobile",
                desc: "Création d'interfaces dynamiques avec React et Flutter. Intérêt pour les PWA et l'optimisation des performances mobiles.",
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                className="journey-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 + 0.2 }}
              >
                <div
                  className="journey-icon"
                  style={{ background: `${card.color}18` }}
                >
                  <span style={{ color: card.color }}>{card.icon}</span>
                </div>
                <h3>{card.title}</h3>
                <p>{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── ABOUT ── */}
        <section
          id="about"
          className="section"
          style={{ background: "var(--surface)" }}
        >
          <span className="section-big-number">04</span>
          <div className="section-header">
            <p className="section-label">// qui suis-je ?</p>
            <h2 className="section-title">À propos de moi</h2>
            <div className="section-line" />
          </div>

          <div className="about-grid">
            <motion.div
              className="about-photo"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <img
                src="/assets/lesaint4.jpg"
                alt="François ADESU"
                loading="lazy"
              />
            </motion.div>

            <motion.div
              className="about-text"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <p>
                Salut, moi c'est <strong>Kokouvi François ADESU</strong>, mais
                tu peux m'appeler François ! Je suis un développeur passionné
                avec un faible pour l'architecture logicielle et les interfaces
                utilisateur qui en jettent.
              </p>
              <p>
                Ce qui me fait vibrer, c'est de créer des solutions techniques
                qui allient robustesse et simplicité d'utilisation. J'adore
                explorer de nouvelles technos et trouver des moyens innovants
                pour résoudre des problèmes — et je prends un vrai plaisir à
                développer des apps mobiles avec Flutter.
              </p>
              <p>
                Mon approche ? Je commence toujours par comprendre les besoins,
                puis je conçois une architecture modulaire avant de plonger dans
                le code. En dehors du dev, tu me trouveras probablement en train
                de suivre des séries, sur un terrain de foot ou de rêver à mon
                prochain voyage.
              </p>

              <div className="vision-banner">
                <h3>Vision</h3>
                <p>
                  "Concevoir des solutions techniques élégantes qui marient
                  qualité architecturale et expérience utilisateur
                  exceptionnelle, particulièrement dans les domaines web et
                  mobile."
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── CONTACT ── */}
        <section id="contact" className="section">
          <span className="section-big-number">05</span>
          <div className="section-header">
            <p className="section-label">// travaillons ensemble</p>
            <h2 className="section-title">Me contacter</h2>
            <div className="section-line" />
          </div>

          <div className="contact-layout">
            <div className="contact-info">
              <h3>Discutons de votre projet</h3>
              <p>
                Envie de collaborer, de discuter tech ou d'explorer une
                opportunité ? Je suis disponible et toujours enthousiaste à
                l'idée de nouveaux défis.
              </p>
              <div className="contact-links">
                <a href="tel:+22899553976" className="contact-link">
                  <Phone size={16} /> (+228) 99 55 39 76
                </a>
                <a
                  href="https://wa.me/+22946620072"
                  className="contact-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaWhatsapp size={16} style={{ color: "var(--accent)" }} />{" "}
                  Chat sur WhatsApp
                </a>
                <a
                  href="mailto:k.francoisadesu@gmail.com"
                  className="contact-link"
                >
                  <Mail size={16} /> k.francoisadesu@gmail.com
                </a>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "16px",
                padding: "2rem",
              }}
            >
              <div className="form-group">
                <label className="form-label">Nom</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="Votre nom"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, name: e.target.value }))
                  }
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  className="form-input"
                  type="email"
                  placeholder="vous@exemple.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, email: e.target.value }))
                  }
                />
              </div>
              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea
                  className="form-textarea"
                  placeholder="Décrivez votre projet ou votre demande…"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, message: e.target.value }))
                  }
                  rows={5}
                />
              </div>
              <button
                type="submit"
                className="form-submit"
                disabled={isSubmitting}
              >
                {isSubmitting && (
                  <svg
                    style={{
                      animation: "spin 1s linear infinite",
                      width: 16,
                      height: 16,
                    }}
                    viewBox="0 0 24 24"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      style={{ opacity: 0.25 }}
                      fill="none"
                    />
                    <path
                      fill="currentColor"
                      style={{ opacity: 0.75 }}
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                )}
                {isSubmitting ? "Envoi…" : "Envoyer le message →"}
              </button>
              {formStatus && (
                <p
                  style={{
                    marginTop: "1rem",
                    fontSize: "0.83rem",
                    color: formStatus.includes("succès")
                      ? "var(--accent)"
                      : "#ff6b6b",
                    textAlign: "center",
                  }}
                >
                  {formStatus}
                </p>
              )}
            </form>
          </div>
        </section>

        {/* ── CV ── */}
        <section
          id="cv"
          className="section"
          style={{ background: "var(--surface)" }}
        >
          <span className="section-big-number">06</span>
          <div className="section-header">
            <p className="section-label">// mon parcours</p>
            <h2 className="section-title">Curriculum Vitæ</h2>
            <div className="section-line" />
          </div>

          <div className="cv-section">
            <motion.div
              className="cv-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>📄</div>
              <h3>ADESU François — CV</h3>
              <p>Développeur Full-Stack & Mobile · Architecte logiciel</p>
              <div className="cv-btns">
                <button
                  className="cv-btn cv-btn-primary"
                  onClick={() =>
                    window.open(
                      "/assets/ADESU_CV.pdf",
                      "_blank",
                      "noopener,noreferrer",
                    )
                  }
                >
                  <ExternalLink size={14} /> Ouvrir le CV
                </button>
                <a
                  href="/assets/ADESU_CV.pdf"
                  download
                  className="cv-btn cv-btn-outline"
                >
                  ↓ Télécharger
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="footer">
          <div className="footer-inner">
            <div className="footer-brand">
              <h3>ADESU-FLS</h3>
              <p>
                Développeur passionné, spécialisé en architecture logicielle et
                UX moderne. Basé à Lomé, Togo.
              </p>
            </div>
            <div>
              <h4>Me contacter</h4>
              <a href="tel:+22899553976" className="footer-link">
                <Phone size={13} /> (+228) 99 55 39 76
              </a>
              <a
                href="https://wa.me/+22946620072"
                className="footer-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaWhatsapp size={13} /> WhatsApp
              </a>
              <a
                href="mailto:k.francoisadesu@gmail.com"
                className="footer-link"
              >
                <Mail size={13} /> k.francoisadesu@gmail.com
              </a>
            </div>
            <div>
              <h4>Liens</h4>
              <a
                href="https://github.com/adekomen"
                className="footer-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github size={13} /> GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/kokouvi-fran%C3%A7ois-adesu-179347290/"
                className="footer-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin size={13} /> LinkedIn
              </a>
              <a
                href="https://github.com/adekomen/portfolio.git"
                className="footer-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Code size={13} /> Code source
              </a>
            </div>
          </div>
          <div className="footer-bottom">
            © {new Date().getFullYear()} <span>ADESU-FLS</span> · Tous droits
            réservés · Fait avec ♥ à Lomé
          </div>
        </footer>
      </motion.div>
    </div>
  );
};

export default App;
