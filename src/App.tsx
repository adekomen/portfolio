import { useState, useEffect, useCallback, FormEvent, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2,
  Layers,
  Smartphone,
  Menu,
  X,
  Phone,
  Mail,
  Github,
  Linkedin,
  ArrowUpRight,
  ArrowLeft,
  ArrowRight,
  Sun,
  Moon,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadAll } from "@tsparticles/all";
import emailjs from "@emailjs/browser";
import mermaid from "mermaid";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

mermaid.initialize({ startOnLoad: true });

/* ============================================================
   DESIGN TOKENS
   Palette  : encre profonde + cuivre signature (blueprint inversé)
   Display  : Fraunces (serif à fort contraste, personnalité)
   Body     : Inter
   Mono     : JetBrains Mono (labels techniques, coordonnées de section)
============================================================= */

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
      "Gestion totale de bibliothèque en ligne qui permet de faire des achat de livre en ligne",
    technologies: ["PHP", "Bootstrap", "MySQL", "Javascript"],
    github: "https://github.com/adekomen/book-shop.git",
    demo: "http://lesaint.alwaysdata.net",
    image: "/assets/bookly.png",
  },
  {
    id: 2,
    title: "Une application pour la restauration",
    description:
      "Plateforme de restauration où on peut trouver les mets du restaurant et faire une commande.",
    longDescription: "Plateforme utilisant Angular.",
    technologies: ["Angular", "Html & CSS", "Javascript"],
    github: "https://github.com/adekomen/kenfood_app.git",
    demo: "https://warm-sable-eaf70d.netlify.app/",
    image: "/assets/foodapp.png",
  },
  {
    id: 3,
    title: "Une application de suivis d'habitude",
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
    title: "Une application pour trouver les hotels",
    description:
      "Une application React et Nodejs pour chercher les hotels, fait avec mon equipe de dev.",
    longDescription:
      "Une application Fullstack fait avec React pour le Frontend, Nodejs pour le backend et MySQL pour la base de données pour gérer les recherche d'hotel en ligne.",
    technologies: ["React", "Nodejs", "MySQL"],
    github: "https://github.com/adekomen/hotel_booking.git",
    demo: "https://hotelbooking-psi.vercel.app/",
    image: "/assets/hotel.png",
  },
  {
    id: 5,
    title: "Une application de prise de mesure",
    description:
      "SIZER, Une solution digitale innovante pour simplifier la prise de mesures et optimiser le travail dans le domaine de la couture",
    longDescription:
      "Cette solution permet aux couturiers d'enregistrer, consulter, modifier et exporter facilement les mensurations des clients, tout en intégrant des tailles standards et un système de suggestion intelligent.",
    technologies: ["Flutter", "Dart", "Firebase", "Supabase"],
    github: "https://github.com/adekomen/sizer_app.git",
    image: "/assets/couturier1.png",
  },
];

const skills = [
  "JavaScript",
  "TypeScript",
  "PHP",
  "React",
  "Node.js",
  "Angular",
  "Flutter",
  "Laravel",
  "MongoDB",
  "MySQL",
  "Docker",
  "UML",
  "SQL",
  "Python",
];

/* ---------- Modal projet ---------- */
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(7,8,11,0.78)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 24, opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-sm"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--line)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-1 w-full" style={{ background: "var(--accent)" }} />
        <div className="p-8">
          <p
            className="mb-2 text-xs tracking-[0.2em] uppercase"
            style={{ fontFamily: "var(--font-mono)", color: "var(--accent)" }}
          >
            Dossier projet
          </p>
          <h3
            className="text-2xl md:text-3xl mb-4"
            style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
          >
            {project.title}
          </h3>
          <div
            className="w-full h-56 mb-6 overflow-hidden rounded-sm"
            style={{ border: "1px solid var(--line)" }}
          >
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <p
            className="mb-6 leading-relaxed"
            style={{ color: "var(--text-muted)" }}
          >
            {project.longDescription}
          </p>
          <div className="flex flex-wrap gap-2 mb-8">
            {project.technologies.map((t) => (
              <span
                key={t}
                className="px-3 py-1 text-xs rounded-sm"
                style={{
                  fontFamily: "var(--font-mono)",
                  border: "1px solid var(--line)",
                  color: "var(--text-muted)",
                }}
              >
                {t}
              </span>
            ))}
          </div>
          {project.uml && (
            <div className="mb-8">
              <h4
                className="text-xs tracking-[0.2em] uppercase mb-3"
                style={{
                  fontFamily: "var(--font-mono)",
                  color: "var(--accent)",
                }}
              >
                Diagramme UML
              </h4>
              <div ref={mermaidRef} className="mermaid" />
            </div>
          )}
          <div className="flex gap-6">
            {project.github && (
              <a
                href={project.github}
                className="inline-flex items-center gap-1 text-sm font-medium"
                style={{ color: "var(--text)" }}
              >
                GitHub <ArrowUpRight size={14} />
              </a>
            )}
            {project.demo && (
              <a
                href={project.demo}
                className="inline-flex items-center gap-1 text-sm font-medium"
                style={{ color: "var(--accent)" }}
              >
                Voir la démo <ArrowUpRight size={14} />
              </a>
            )}
          </div>
          <button
            onClick={onClose}
            className="mt-8 text-xs tracking-[0.15em] uppercase"
            style={{
              fontFamily: "var(--font-mono)",
              color: "var(--text-muted)",
            }}
          >
            Fermer ✕
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ---------- Étiquette de section façon coordonnée de plan ---------- */
const SectionTag: React.FC<{ index: string; label: string }> = ({
  index,
  label,
}) => (
  <div className="flex items-center gap-3 mb-4">
    <span
      style={{ fontFamily: "var(--font-mono)", color: "var(--accent)" }}
      className="text-sm"
    >
      §{index}
    </span>
    <span
      className="h-px flex-1 max-w-[40px]"
      style={{ background: "var(--line)" }}
    />
    <span
      style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}
      className="text-xs tracking-[0.25em] uppercase"
    >
      {label}
    </span>
  </div>
);

const App: React.FC = () => {
  const [theme, setTheme] = useState<"light" | "dark">(
    (localStorage.getItem("theme") as "light" | "dark") || "dark",
  );
  const [filter, setFilter] = useState<string>("Tous");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(
    typeof window !== "undefined" ? window.innerWidth >= 768 : true,
  );
  const [showPDF, setShowPDF] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [particlesReady, setParticlesReady] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadAll(engine);
    }).then(() => setParticlesReady(true));
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    const handleResize = () => setIsSidebarOpen(window.innerWidth >= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const uniqueTechnologies = Array.from(
    new Set(projects.flatMap((p) => p.technologies)),
  );
  const filteredProjects =
    filter === "Tous"
      ? projects
      : projects.filter((p) => p.technologies.includes(filter));

  const projectsPerPage = 6;
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(
    indexOfFirstProject,
    indexOfLastProject,
  );
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

  const handlePreviousPage = () =>
    currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNextPage = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.message.trim()
    ) {
      setFormStatus("Veuillez remplir tous les champs correctement.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setFormStatus("Veuillez entrer un email valide.");
      return;
    }
    setIsSubmitting(true);
    setFormStatus("Envoi en cours...");
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
      .catch((error) => {
        setFormStatus(
          `Erreur lors de l'envoi : ${error.text || "Vérifiez votre connexion ou les clés EmailJS."}`,
        );
      })
      .finally(() => setIsSubmitting(false));
  };

  const particlesLoaded = useCallback(async () => {}, []);

  const isLight = theme === "light";

  const navItems = [
    { href: "#home", label: "Accueil", num: "00" },
    { href: "#about", label: "À propos", num: "01" },
    { href: "#projects", label: "Projets", num: "02" },
    { href: "#skills", label: "Compétences", num: "03" },
    { href: "#contact", label: "Contact", num: "04" },
    { href: "#cv", label: "CV", num: "05" },
  ];

  return (
    <div
      style={
        {
          "--bg": isLight ? "#F5F3EE" : "#0B0D12",
          "--surface": isLight ? "#FFFFFF" : "#13161D",
          "--surface-alt": isLight ? "#ECE8DF" : "#171B24",
          "--text": isLight ? "#191815" : "#E7E5E0",
          "--text-muted": isLight ? "#5C5A53" : "#8B8F99",
          "--line": isLight ? "#DBD6CA" : "#252932",
          "--accent": "#E8A23D",
          "--accent-soft": isLight
            ? "rgba(232,162,61,0.12)"
            : "rgba(232,162,61,0.14)",
          "--font-display": "'Fraunces', Georgia, serif",
          "--font-body": "'Inter', system-ui, sans-serif",
          "--font-mono": "'JetBrains Mono', monospace",
          background: "var(--bg)",
          color: "var(--text)",
          fontFamily: "var(--font-body)",
        } as React.CSSProperties
      }
      className="min-h-screen flex relative transition-colors duration-300"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        ::selection { background: var(--accent); color: #0B0D12; }
        a { color: inherit; }
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
      `}</style>

      {/* Bouton menu mobile */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleSidebar}
          className="p-2.5 rounded-sm"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--line)",
          }}
          aria-label="Basculer le menu"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: isSidebarOpen ? 0 : -280 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="w-64 h-screen fixed top-0 left-0 flex flex-col p-7 z-40"
        style={{
          background: "var(--surface)",
          borderRight: "1px solid var(--line)",
        }}
      >
        <div className="flex items-center gap-3 mb-10">
          <div
            className="w-11 h-11 rounded-sm overflow-hidden flex-shrink-0"
            style={{ border: "1px solid var(--line)" }}
          >
            <img
              src="/assets/fls2.jpg"
              alt="ADESU-FLS"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div>
            <p
              style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
              className="text-lg leading-none flex items-center"
            >
              ADESU-FLS
              <motion.span
                className="inline-block w-[2px] h-4 ml-1"
                style={{ background: "var(--accent)" }}
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </p>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                color: "var(--text-muted)",
              }}
              className="text-[11px] tracking-wide mt-1"
            >
              Architecte logiciel
            </p>
          </div>
        </div>

        <nav className="flex-grow">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() =>
                    window.innerWidth < 768 && setIsSidebarOpen(false)
                  }
                  className="group flex items-center gap-3 px-3 py-2.5 rounded-sm transition-colors duration-200"
                  style={{ color: "var(--text-muted)" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "var(--text)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "var(--text-muted)")
                  }
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      color: "var(--accent)",
                    }}
                    className="text-[11px]"
                  >
                    {item.num}
                  </span>
                  <span className="text-sm font-medium">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div
          className="flex items-center gap-4 pt-6"
          style={{ borderTop: "1px solid var(--line)" }}
        >
          <a
            href="https://www.linkedin.com/in/kokouvi-fran%C3%A7ois-adesu-179347290/"
            aria-label="LinkedIn"
            style={{ color: "var(--text-muted)" }}
          >
            <Linkedin size={18} />
          </a>
          <a
            href="https://github.com/adekomen"
            aria-label="GitHub"
            style={{ color: "var(--text-muted)" }}
          >
            <Github size={18} />
          </a>
          <a
            href="mailto:k.francoisadesu@gmail.com"
            aria-label="Email"
            style={{ color: "var(--text-muted)" }}
          >
            <Mail size={18} />
          </a>
          <button
            onClick={toggleTheme}
            aria-label="Basculer le thème"
            className="ml-auto"
            style={{ color: "var(--accent)" }}
          >
            {isLight ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>
      </motion.aside>

      {isSidebarOpen &&
        typeof window !== "undefined" &&
        window.innerWidth < 768 && (
          <div
            className="fixed inset-0 z-30 md:hidden"
            style={{ background: "rgba(0,0,0,0.5)" }}
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

      {/* Contenu principal */}
      <div
        className={`flex-1 relative flex flex-col ${isSidebarOpen ? "md:ml-64" : "ml-0"}`}
      >
        {particlesReady && (
          <Particles
            id="tsparticles"
            particlesLoaded={particlesLoaded}
            options={{
              fullScreen: { enable: false },
              background: { color: { value: "transparent" } },
              particles: {
                number: {
                  value: 30,
                  density: { enable: true, width: 800, height: 800 },
                },
                color: { value: "#E8A23D" },
                shape: { type: "circle" },
                opacity: { value: 0.18 },
                size: { value: { min: 1, max: 2 } },
                move: {
                  enable: true,
                  speed: 0.4,
                  direction: "none",
                  outModes: { default: "out" },
                },
              },
            }}
            className="absolute inset-0 z-0 pointer-events-none"
          />
        )}

        {/* ===== HERO ===== */}
        <section
          id="home"
          className="min-h-screen flex items-center relative z-10 px-6 md:px-16 py-24"
        >
          <div className="w-full max-w-5xl mx-auto grid md:grid-cols-[1.3fr_1fr] gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  color: "var(--accent)",
                }}
                className="text-xs tracking-[0.25em] uppercase mb-6"
              >
                Portfolio — Build v2026
              </p>
              <h1
                style={{ fontFamily: "var(--font-display)", lineHeight: 1.05 }}
                className="text-5xl md:text-7xl font-semibold mb-6"
              >
                Kokouvi François{" "}
                <span style={{ color: "var(--accent)" }}>Adesu</span>
              </h1>
              <p
                className="text-lg md:text-xl mb-2"
                style={{ color: "var(--text-muted)" }}
              >
                Architecte logiciel. Je conçois des systèmes web et mobile
                pensés pour durer — du diagramme UML au déploiement.
              </p>
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  color: "var(--text-muted)",
                }}
                className="text-sm mb-10"
              >
                React · Node.js · Flutter · Laravel · PHP
              </p>
              <div className="flex flex-wrap gap-4">
                <motion.a
                  href="#projects"
                  whileHover={{ x: 4 }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-sm font-medium text-sm"
                  style={{ background: "var(--accent)", color: "#0B0D12" }}
                >
                  Découvrir mes projets <ArrowUpRight size={16} />
                </motion.a>
                <motion.a
                  href="#contact"
                  whileHover={{ x: 4 }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-sm font-medium text-sm"
                  style={{ border: "1px solid var(--line)" }}
                >
                  Me contacter
                </motion.a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="relative"
            >
              <div
                className="aspect-[4/5] rounded-sm overflow-hidden relative"
                style={{ border: "1px solid var(--line)" }}
              >
                <img
                  src="/assets/lesaint2.jpg"
                  alt="ADESU-FLS"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div
                  className="absolute bottom-0 left-0 right-0 px-4 py-3"
                  style={{ background: "var(--accent)" }}
                >
                  <p
                    style={{ fontFamily: "var(--font-mono)", color: "#0B0D12" }}
                    className="text-xs tracking-wide"
                  >
                    Lomé, Togo — Disponible pour collaborer
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ===== ABOUT ===== */}
        <section
          id="about"
          className="relative z-10 px-6 md:px-16 py-24"
          style={{ background: "var(--surface)" }}
        >
          <div className="max-w-5xl mx-auto">
            <SectionTag index="01" label="À propos" />
            <div className="grid md:grid-cols-[280px_1fr] gap-10 mb-20">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="rounded-sm overflow-hidden h-[340px]"
                style={{ border: "1px solid var(--line)" }}
              >
                <img
                  src="/assets/lesaint4.jpg"
                  alt="Kokouvi François Adesu"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2
                  style={{ fontFamily: "var(--font-display)" }}
                  className="text-3xl font-semibold mb-5"
                >
                  Le code comme architecture, pas comme rustine.
                </h2>
                <div
                  className="space-y-4"
                  style={{ color: "var(--text-muted)" }}
                >
                  <p>
                    Salut, moi c'est{" "}
                    <strong style={{ color: "var(--text)" }}>
                      Kokouvi François ADESU
                    </strong>
                    , mais tu peux m'appeler François. Développeur passionné,
                    j'ai un faible pour l'architecture logicielle et les
                    interfaces qui en jettent vraiment. J'ai déjà plusieurs
                    projets à mon actif : une plateforme de bibliothèque en
                    ligne, une app de restauration sous Angular, une app mobile
                    de suivi d'habitudes avec Flutter...
                  </p>
                  <p>
                    Ce qui me fait vibrer : créer des solutions techniques qui
                    allient robustesse et simplicité d'usage. J'adore explorer
                    de nouvelles technos et trouver des moyens innovants de
                    résoudre des problèmes — notamment en mobile avec Flutter,
                    où je peux laisser libre cours à ma créativité.
                  </p>
                  <p>
                    Mon approche : comprendre le besoin, concevoir une
                    architecture modulaire avec UML, puis coder — proprement, de
                    façon scalable et maintenable. En dehors du dev, je suis sur
                    un terrain de foot ou en train de rêver à mon prochain
                    voyage au Qatar.
                  </p>
                </div>
              </motion.div>
            </div>

            <h3
              style={{ fontFamily: "var(--font-display)" }}
              className="text-2xl font-semibold mb-8"
            >
              Mon parcours en développement
            </h3>
            <div
              className="grid md:grid-cols-3 gap-px"
              style={{ background: "var(--line)" }}
            >
              {[
                {
                  icon: Code2,
                  step: "01",
                  title: "Débuts en programmation",
                  text: "Initiation aux algorithmes et POO avec Java. Premiers projets web (HTML/CSS/JS) et découverte des bases de données relationnelles.",
                },
                {
                  icon: Layers,
                  step: "02",
                  title: "Architecture logicielle",
                  text: "Conception de systèmes modulaires avec microservices. Expérience avec Docker, API REST. Développement d'applications fullstack.",
                },
                {
                  icon: Smartphone,
                  step: "03",
                  title: "Passion web & mobile",
                  text: "Interfaces dynamiques avec React et Flutter. Intérêt marqué pour les PWA et l'optimisation des performances.",
                },
              ].map(({ icon: Icon, step, title, text }) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="p-6"
                  style={{ background: "var(--surface)" }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <Icon size={22} style={{ color: "var(--accent)" }} />
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        color: "var(--text-muted)",
                      }}
                      className="text-xs"
                    >
                      {step}
                    </span>
                  </div>
                  <h4 className="font-semibold mb-2">{title}</h4>
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                    {text}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-10 p-7 rounded-sm relative overflow-hidden"
              style={{
                background: "var(--accent-soft)",
                border: "1px solid var(--line)",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  color: "var(--accent)",
                }}
                className="text-xs tracking-[0.2em] uppercase mb-3"
              >
                Vision
              </p>
              <p
                style={{ fontFamily: "var(--font-display)" }}
                className="text-xl md:text-2xl leading-snug"
              >
                « Concevoir des solutions techniques élégantes qui marient
                qualité architecturale et expérience utilisateur exceptionnelle.
                »
              </p>
            </motion.div>
          </div>
        </section>

        {/* ===== PROJECTS ===== */}
        <section id="projects" className="relative z-10 px-6 md:px-16 py-24">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
              <SectionTag index="02" label="Projets" />
              <select
                value={filter}
                onChange={(e) => {
                  setFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 rounded-sm text-sm"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--line)",
                  color: "var(--text)",
                }}
                aria-label="Filtrer par technologie"
              >
                <option>Tous</option>
                {uniqueTechnologies.map((tech) => (
                  <option key={tech} value={tech}>
                    {tech}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {currentProjects.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  whileHover={{ y: -4 }}
                  onClick={() => setSelectedProject(project)}
                  className="rounded-sm overflow-hidden cursor-pointer group"
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--line)",
                  }}
                >
                  <div className="h-40 overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold mb-2">{project.title}</h3>
                    <p
                      className="text-sm mb-3 line-clamp-2"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {project.technologies.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          style={{
                            fontFamily: "var(--font-mono)",
                            color: "var(--text-muted)",
                          }}
                          className="text-[10px]"
                        >
                          {t}
                          {project.technologies.indexOf(t) < 2 &&
                          project.technologies.length > 1
                            ? " ·"
                            : ""}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-6 mt-10">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="p-2 rounded-sm disabled:opacity-30"
                  style={{ border: "1px solid var(--line)" }}
                  aria-label="Page précédente"
                >
                  <ArrowLeft size={16} />
                </button>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: "var(--text-muted)",
                  }}
                  className="text-sm"
                >
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-sm disabled:opacity-30"
                  style={{ border: "1px solid var(--line)" }}
                  aria-label="Page suivante"
                >
                  <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>

          <AnimatePresence>
            {selectedProject && (
              <ProjectModal
                project={selectedProject}
                onClose={() => setSelectedProject(null)}
              />
            )}
          </AnimatePresence>
        </section>

        {/* ===== SKILLS ===== */}
        <section
          id="skills"
          className="relative z-10 px-6 md:px-16 py-24"
          style={{ background: "var(--surface)" }}
        >
          <div className="max-w-5xl mx-auto">
            <SectionTag index="03" label="Compétences" />
            <p
              className="max-w-xl mb-10"
              style={{ color: "var(--text-muted)" }}
            >
              À travers mon parcours, j'ai exploré et maîtrisé diverses
              technologies, toujours avec la même curiosité et l'envie de créer
              des solutions qui ont du sens.
            </p>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill, i) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.03 }}
                  whileHover={{
                    borderColor: "var(--accent)",
                    color: "var(--accent)",
                  }}
                  className="px-4 py-2 rounded-sm text-sm transition-colors duration-200"
                  style={{
                    fontFamily: "var(--font-mono)",
                    border: "1px solid var(--line)",
                    color: "var(--text-muted)",
                  }}
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CONTACT ===== */}
        <section id="contact" className="relative z-10 px-6 md:px-16 py-24">
          <div className="max-w-2xl mx-auto">
            <SectionTag index="04" label="Contact" />
            <h2
              style={{ fontFamily: "var(--font-display)" }}
              className="text-3xl font-semibold mb-3"
            >
              Envie de collaborer ?
            </h2>
            <p className="mb-8" style={{ color: "var(--text-muted)" }}>
              Discutons de votre projet, d'une idée, ou simplement de tech.
            </p>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Votre nom"
                value={formData.name}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, name: e.target.value }))
                }
                className="w-full p-3 rounded-sm text-sm focus:outline-none"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--line)",
                  color: "var(--text)",
                }}
                aria-label="Nom"
              />
              <input
                type="email"
                placeholder="Votre email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, email: e.target.value }))
                }
                className="w-full p-3 rounded-sm text-sm focus:outline-none"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--line)",
                  color: "var(--text)",
                }}
                aria-label="Email"
              />
              <textarea
                placeholder="Votre message"
                value={formData.message}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, message: e.target.value }))
                }
                rows={4}
                className="w-full p-3 rounded-sm text-sm focus:outline-none resize-none"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--line)",
                  color: "var(--text)",
                }}
                aria-label="Message"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-sm font-medium text-sm flex items-center justify-center gap-2"
                style={{ background: "var(--accent)", color: "#0B0D12" }}
              >
                {isSubmitting && (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                )}
                {isSubmitting ? "Envoi..." : "Envoyer le message"}
              </button>
              {formStatus && (
                <p
                  className="text-sm text-center"
                  style={{ color: "var(--text-muted)" }}
                >
                  {formStatus}
                </p>
              )}
            </form>
          </div>
        </section>

        {/* ===== CV ===== */}
        <section
          id="cv"
          className="relative z-10 px-6 md:px-16 py-24"
          style={{ background: "var(--surface)" }}
        >
          <div className="max-w-2xl mx-auto text-center">
            <SectionTag index="05" label="CV" />
            <h2
              style={{ fontFamily: "var(--font-display)" }}
              className="text-3xl font-semibold mb-3"
            >
              Mon parcours, en détail
            </h2>
            <p className="mb-8" style={{ color: "var(--text-muted)" }}>
              Consultez ou téléchargez mon CV pour découvrir mon parcours et mes
              compétences.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => {
                  setShowPDF(true);
                  const newWindow = window.open(
                    "/assets/ADESU_CV.pdf",
                    "_blank",
                    "noopener,noreferrer",
                  );
                  if (!newWindow) {
                    alert(
                      "L'ouverture du CV a été bloquée. Autorisez les pop-ups pour ce site ou utilisez le lien de téléchargement.",
                    );
                  }
                }}
                className="px-6 py-3 rounded-sm font-medium text-sm"
                style={{ border: "1px solid var(--line)" }}
              >
                Afficher le CV
              </button>
              <a
                href="/assets/ADESU_CV.pdf"
                download
                className="px-6 py-3 rounded-sm font-medium text-sm inline-flex items-center gap-2"
                style={{ background: "var(--accent)", color: "#0B0D12" }}
              >
                Télécharger mon CV <ArrowUpRight size={14} />
              </a>
            </div>
            {showPDF && (
              <p
                className="text-sm mt-5"
                style={{ color: "var(--text-muted)" }}
              >
                Le CV a été ouvert dans un nouvel onglet.
              </p>
            )}
          </div>
        </section>

        {/* ===== FOOTER ===== */}
        <footer
          className="relative z-10 px-6 md:px-16 py-14"
          style={{
            borderTop: "1px solid var(--line)",
            background: "var(--bg)",
          }}
        >
          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-10 text-sm">
            <div>
              <p
                style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
                className="text-lg mb-2"
              >
                ADESU-FLS
              </p>
              <p style={{ color: "var(--text-muted)" }}>
                Développeur passionné, spécialisé en architecture logicielle et
                UX moderne.
              </p>
            </div>
            <div>
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  color: "var(--accent)",
                }}
                className="text-xs tracking-[0.2em] uppercase mb-3"
              >
                Contact
              </p>
              <div
                className="flex flex-col gap-2"
                style={{ color: "var(--text-muted)" }}
              >
                <a
                  href="tel:+22899553976"
                  className="flex items-center gap-2 hover:opacity-80"
                >
                  <Phone size={14} /> (+228) 99 55 39 76
                </a>
                <a
                  href="https://wa.me/+22946620072?text=Salut%20François,%20je%20viens%20de%20voir%20ton%20portfolio%20et%20j'aimerais%20discuter%20d'un%20projet%20!"
                  className="flex items-center gap-2 hover:opacity-80"
                >
                  <FaWhatsapp size={14} /> Chat sur WhatsApp
                </a>
                <a
                  href="mailto:k.francoisadesu@gmail.com"
                  className="flex items-center gap-2 hover:opacity-80"
                >
                  <Mail size={14} /> k.francoisadesu@gmail.com
                </a>
              </div>
            </div>
            <div>
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  color: "var(--accent)",
                }}
                className="text-xs tracking-[0.2em] uppercase mb-3"
              >
                Liens
              </p>
              <div
                className="flex flex-col gap-2"
                style={{ color: "var(--text-muted)" }}
              >
                <a
                  href="https://github.com/adekomen/portfolio.git"
                  className="flex items-center gap-2 hover:opacity-80"
                >
                  <Github size={14} /> Code source
                </a>
                <a
                  href="https://www.linkedin.com/in/kokouvi-fran%C3%A7ois-adesu-179347290/"
                  className="flex items-center gap-2 hover:opacity-80"
                >
                  <Linkedin size={14} /> LinkedIn
                </a>
              </div>
            </div>
          </div>
          <div
            className="max-w-5xl mx-auto mt-10 pt-6 text-center"
            style={{ borderTop: "1px solid var(--line)" }}
          >
            <p
              style={{
                fontFamily: "var(--font-mono)",
                color: "var(--text-muted)",
              }}
              className="text-xs"
            >
              © {new Date().getFullYear()} ADESU-FLS — Tous droits réservés.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
