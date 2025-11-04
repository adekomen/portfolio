import { useState, useEffect, FormEvent, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code, Cpu, Smartphone, Menu, X, Phone, Mail, Github, Linkedin } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { Engine } from "@tsparticles/engine";
import Particles from "@tsparticles/react";
import { loadAll } from "@tsparticles/all";
import emailjs from "@emailjs/browser";
import mermaid from "mermaid";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

// Initialiser Mermaid pour les diagrammes UML
mermaid.initialize({ startOnLoad: true });

// Interface pour les projets
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

// Données des projets
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
      "Cette solution permet aux couturiers d’enregistrer, consulter, modifier et exporter facilement les mensurations des clients, tout en intégrant des tailles standards et un système de suggestion intelligent.",
    technologies: ["Flutter", "Dart", "Firebase", "Supabase"],
    github: "https://github.com/adekomen/sizer_app.git",
    image: "/assets/couturier1.png",
  },
];

// Composant Modal avec UML
const ProjectModal: React.FC<{
  project: Project | null;
  onClose: () => void;
}> = ({ project, onClose }) => {
  const mermaidRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (project?.uml && mermaidRef.current) {
      mermaid.render("mermaid-diagram", project.uml).then(({ svg }) => {
        if (mermaidRef.current) {
          mermaidRef.current.innerHTML = svg;
        }
      });
    }
  }, [project]);

  if (!project) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-8 rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-2xl font-bold mb-4">{project.title}</h3>
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-auto object-cover rounded mb-4"
          loading="lazy"
        />
        <p className="mb-4">{project.longDescription}</p>
        <p className="mb-4">
          <strong>Technologies :</strong> {project.technologies.join(", ")}
        </p>
        {project.uml && (
          <div className="mb-4">
            <h4 className="text-lg font-semibold mb-2">Diagramme UML</h4>
            <div ref={mermaidRef} className="mermaid"></div>
          </div>
        )}
        <div className="flex space-x-4">
          {project.github && (
            <a
              href={project.github}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              GitHub
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Démo
            </a>
          )}
        </div>
        <button
          onClick={onClose}
          className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 dark:bg-blue-800 dark:hover:bg-blue-900"
        >
          Fermer
        </button>
      </motion.div>
    </motion.div>
  );
};

// Composant principal
const App: React.FC = () => {
  const [theme, setTheme] = useState<"light" | "dark">(
    localStorage.getItem("theme") === "dark" ? "dark" : "light"
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
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [showPDF, setShowPDF] = useState(false);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // Effet pour détecter la taille de l'écran et ajuster la sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    // Exécuter au chargement
    handleResize();

    // Ajouter l'écouteur d'événement
    window.addEventListener("resize", handleResize);

    // Nettoyage
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Déclaration des données pour la section Projets
  const uniqueTechnologies = Array.from(
    new Set(projects.flatMap((p) => p.technologies))
  );

  // Déclaration de filteredProjects AVANT son utilisation
  const filteredProjects =
    filter === "Tous"
      ? projects
      : projects.filter((p) => p.technologies.includes(filter));

  // Logique de pagination
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 6; // 2 colonnes x 2 lignes = 4 projets par page

  // Calcule les projets à afficher sur la page actuelle
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(
    indexOfFirstProject,
    indexOfLastProject
  );

  // Calcule le nombre total de pages
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

  // Fonctions pour naviguer entre les pages
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Form submitted with data:", formData);

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.message.trim()
    ) {
      setFormStatus("Veuillez remplir tous les champs correctement.");
      console.log("Validation failed: Empty fields detected.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setFormStatus("Veuillez entrer un email valide.");
      console.log("Validation failed: Invalid email format.");
      return;
    }

    setIsSubmitting(true);
    setFormStatus("Envoi en cours...");

    // EmailJS
    emailjs
      .send(
        "service_petyfkl",
        "template_vjwqkum",
        formData,
        "e6L6MGEksEKA9FB_w"
      )
      .then((response) => {
        console.log("EmailJS success:", response.status, response.text);
        setFormStatus("Message envoyé avec succès !");
        setFormData({ name: "", email: "", message: "" });
      })
      .catch((error) => {
        console.error("EmailJS error:", error);
        setFormStatus(
          `Erreur lors de l'envoi : ${
            error.text || "Vérifiez votre connexion ou les clés EmailJS."
          }`
        );
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const particlesInit = async (engine: Engine) => {
    await loadAll(engine);
  };

  return (
    <div
      className={`min-h-screen ${
        theme === "light"
          ? "bg-gray-100 text-gray-900"
          : "bg-gray-900 text-white"
      } transition-colors duration-300 flex relative`}
    >
      {/* Menu Hamburger pour mobile */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleSidebar}
          className="bg-gray-800 text-white p-2 rounded-full shadow-lg"
          aria-label="Toggle Menu"
        >
          {isSidebarOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -250 }}
        animate={{ x: isSidebarOpen ? 0 : -250 }}
        transition={{ duration: 0.3 }}
        className={`w-64 bg-gray-900 text-white flex-shrink-0 h-screen fixed top-0 left-0 flex flex-col p-6 z-30`}
      >
        <motion.div
          className="flex items-center justify-center mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className={`relative w-24 h-24 rounded-full border-4 transition-all duration-300 ${
              theme === "light"
                ? "border-cyan-500 shadow-cyan-500/50"
                : "border-cyan-400 shadow-cyan-400/50"
            }`}
            initial={{ opacity: 0, rotate: -180 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ duration: 1, type: "spring", stiffness: 100 }}
            whileHover={{
              scale: 1.1, // Zoom léger au survol
              rotate: 10, // Rotation subtile
              boxShadow:
                theme === "light"
                  ? "0 0 20px rgba(34, 211, 238, 0.8)"
                  : "0 0 20px rgba(103, 232, 249, 0.8)", // Glow intensifié
              transition: { duration: 0.3 },
            }}
          >
            <img
              src="/assets/fls2.jpg"
              alt="ADESU-FLS"
              className="w-full h-full rounded-full object-cover object-center"
              loading="lazy"
            />
          </motion.div>
        </motion.div>

        <motion.h1
          className={`flex items-center justify-center text-3xl font-bold mb-8 relative transition-colors duration-300 ${
            theme === "light"
              ? "text-gray-400 hover:text-cyan-600"
              : "text-gray-100 hover:text-cyan-400"
          }`}
          initial={{ width: 0 }}
          animate={{ width: "auto" }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          whileHover={{
            scale: 1.05, // Zoom léger au survol
            transition: { duration: 0.3 },
          }}
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            ADESU-FLS
          </motion.span>
          {/* Curseur clignotant pour l'effet de typing */}
          <motion.span
            className={`h-8 w-1 ml-2 ${
              theme === "light" ? "bg-cyan-600" : "bg-cyan-400"
            }`}
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.5, repeat: Infinity, delay: 1 }}
          />
        </motion.h1>
        <nav className="flex-grow">
          <ul className="space-y-2">
            <motion.li
              whileHover={{
                scale: 1.05, // Léger agrandissement de l'élément au survol
                transition: { duration: 0.3 },
              }}
              className={`group rounded-lg p-3 transition-all duration-300 ${
                theme === "light"
                  ? "hover:bg-blue-100 hover:shadow-lg hover:shadow-blue-200/50"
                  : "hover:bg-gray-700 hover:shadow-lg hover:shadow-blue-500/30"
              }`} // Fond et ombre au survol
            >
              <a
                href="#home"
                className="flex items-center space-x-2"
                onClick={() =>
                  window.innerWidth < 768 && setIsSidebarOpen(false)
                }
              >
                <motion.span
                  whileHover={{
                    scale: 1.3, // Grossissement de l'emoji
                    rotate: 15, // Petite rotation
                    y: -5, // Saut vers le haut
                    transition: {
                      duration: 0.3,
                      type: "spring",
                      stiffness: 200,
                    },
                  }}
                  className="text-xl"
                >
                  🏠
                </motion.span>
                <motion.span
                  className={`relative text-lg font-medium transition-colors duration-300 ${
                    theme === "light"
                      ? "text-gray-400 group-hover:text-cyan-600"
                      : "text-gray-200 group-hover:text-cyan-400"
                  }`}
                  whileHover={{
                    x: 5, // Petit décalage à droite pour un effet de glissement
                    transition: { duration: 0.3 },
                  }}
                >
                  Home
                  {/* Soulignement animé au survol */}
                  <motion.span
                    className={`absolute left-0 bottom-0 h-0.5 ${
                      theme === "light" ? "bg-cyan-600" : "bg-cyan-400"
                    }`}
                    initial={{ width: 0 }}
                    whileHover={{
                      width: "100%",
                      transition: { duration: 0.3 },
                    }}
                  />
                </motion.span>
              </a>
            </motion.li>

            <motion.li
              whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
              className={`group rounded-lg p-3 transition-all duration-300 ${
                theme === "light"
                  ? "hover:bg-blue-100 hover:shadow-lg hover:shadow-blue-200/50"
                  : "hover:bg-gray-700 hover:shadow-lg hover:shadow-blue-500/30"
              }`}
            >
              <a
                href="#about"
                className="flex items-center space-x-2"
                onClick={() =>
                  window.innerWidth < 768 && setIsSidebarOpen(false)
                }
              >
                <motion.span
                  whileHover={{
                    scale: 1.3,
                    rotate: 15,
                    y: -5,
                    transition: {
                      duration: 0.3,
                      type: "spring",
                      stiffness: 200,
                    },
                  }}
                  className="text-xl"
                >
                  👤
                </motion.span>
                <motion.span
                  className={`relative text-lg font-medium transition-colors duration-300 ${
                    theme === "light"
                      ? "text-gray-400 group-hover:text-cyan-600"
                      : "text-gray-200 group-hover:text-cyan-400"
                  }`}
                  whileHover={{ x: 5, transition: { duration: 0.3 } }}
                >
                  About
                  <motion.span
                    className={`absolute left-0 bottom-0 h-0.5 ${
                      theme === "light" ? "bg-cyan-600" : "bg-cyan-400"
                    }`}
                    initial={{ width: 0 }}
                    whileHover={{
                      width: "100%",
                      transition: { duration: 0.3 },
                    }}
                  />
                </motion.span>
              </a>
            </motion.li>

            <motion.li
              whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
              className={`group rounded-lg p-3 transition-all duration-300 ${
                theme === "light"
                  ? "hover:bg-blue-100 hover:shadow-lg hover:shadow-blue-200/50"
                  : "hover:bg-gray-700 hover:shadow-lg hover:shadow-blue-500/30"
              }`}
            >
              <a
                href="#projects"
                className="flex items-center space-x-2"
                onClick={() =>
                  window.innerWidth < 768 && setIsSidebarOpen(false)
                }
              >
                <motion.span
                  whileHover={{
                    scale: 1.3,
                    rotate: 15,
                    y: -5,
                    transition: {
                      duration: 0.3,
                      type: "spring",
                      stiffness: 200,
                    },
                  }}
                  className="text-xl"
                >
                  📂
                </motion.span>
                <motion.span
                  className={`relative text-lg font-medium transition-colors duration-300 ${
                    theme === "light"
                      ? "text-gray-400 group-hover:text-cyan-600"
                      : "text-gray-200 group-hover:text-cyan-400"
                  }`}
                  whileHover={{ x: 5, transition: { duration: 0.3 } }}
                >
                  Projects
                  <motion.span
                    className={`absolute left-0 bottom-0 h-0.5 ${
                      theme === "light" ? "bg-cyan-600" : "bg-cyan-400"
                    }`}
                    initial={{ width: 0 }}
                    whileHover={{
                      width: "100%",
                      transition: { duration: 0.3 },
                    }}
                  />
                </motion.span>
              </a>
            </motion.li>

            <motion.li
              whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
              className={`group rounded-lg p-3 transition-all duration-300 ${
                theme === "light"
                  ? "hover:bg-blue-100 hover:shadow-lg hover:shadow-blue-200/50"
                  : "hover:bg-gray-700 hover:shadow-lg hover:shadow-blue-500/30"
              }`}
            >
              <a
                href="#skills"
                className="flex items-center space-x-2"
                onClick={() =>
                  window.innerWidth < 768 && setIsSidebarOpen(false)
                }
              >
                <motion.span
                  whileHover={{
                    scale: 1.3,
                    rotate: 15,
                    y: -5,
                    transition: {
                      duration: 0.3,
                      type: "spring",
                      stiffness: 200,
                    },
                  }}
                  className="text-xl"
                >
                  🛠️
                </motion.span>
                <motion.span
                  className={`relative text-lg font-medium transition-colors duration-300 ${
                    theme === "light"
                      ? "text-gray-400 group-hover:text-cyan-600"
                      : "text-gray-200 group-hover:text-cyan-400"
                  }`}
                  whileHover={{ x: 5, transition: { duration: 0.3 } }}
                >
                  Skills
                  <motion.span
                    className={`absolute left-0 bottom-0 h-0.5 ${
                      theme === "light" ? "bg-cyan-600" : "bg-cyan-400"
                    }`}
                    initial={{ width: 0 }}
                    whileHover={{
                      width: "100%",
                      transition: { duration: 0.3 },
                    }}
                  />
                </motion.span>
              </a>
            </motion.li>

            <motion.li
              whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
              className={`group rounded-lg p-3 transition-all duration-300 ${
                theme === "light"
                  ? "hover:bg-blue-100 hover:shadow-lg hover:shadow-blue-200/50"
                  : "hover:bg-gray-700 hover:shadow-lg hover:shadow-blue-500/30"
              }`}
            >
              <a
                href="#contact"
                className="flex items-center space-x-2"
                onClick={() =>
                  window.innerWidth < 768 && setIsSidebarOpen(false)
                }
              >
                <motion.span
                  whileHover={{
                    scale: 1.3,
                    rotate: 15,
                    y: -5,
                    transition: {
                      duration: 0.3,
                      type: "spring",
                      stiffness: 200,
                    },
                  }}
                  className="text-xl"
                >
                  ✉️
                </motion.span>
                <motion.span
                  className={`relative text-lg font-medium transition-colors duration-300 ${
                    theme === "light"
                      ? "text-gray-400 group-hover:text-cyan-600"
                      : "text-gray-200 group-hover:text-cyan-400"
                  }`}
                  whileHover={{ x: 5, transition: { duration: 0.3 } }}
                >
                  Contact
                  <motion.span
                    className={`absolute left-0 bottom-0 h-0.5 ${
                      theme === "light" ? "bg-cyan-600" : "bg-cyan-400"
                    }`}
                    initial={{ width: 0 }}
                    whileHover={{
                      width: "100%",
                      transition: { duration: 0.3 },
                    }}
                  />
                </motion.span>
              </a>
            </motion.li>

            <motion.li
              whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
              className={`group rounded-lg p-3 transition-all duration-300 ${
                theme === "light"
                  ? "hover:bg-blue-100 hover:shadow-lg hover:shadow-blue-200/50"
                  : "hover:bg-gray-700 hover:shadow-lg hover:shadow-blue-500/30"
              }`}
            >
              <a
                href="#cv"
                className="flex items-center space-x-2"
                onClick={() =>
                  window.innerWidth < 768 && setIsSidebarOpen(false)
                }
              >
                <motion.span
                  whileHover={{
                    scale: 1.3,
                    rotate: 15,
                    y: -5,
                    transition: {
                      duration: 0.3,
                      type: "spring",
                      stiffness: 200,
                    },
                  }}
                  className="text-xl"
                >
                  📄
                </motion.span>
                <motion.span
                  className={`relative text-lg font-medium transition-colors duration-300 ${
                    theme === "light"
                      ? "text-gray-400 group-hover:text-cyan-600"
                      : "text-gray-200 group-hover:text-cyan-400"
                  }`}
                  whileHover={{ x: 5, transition: { duration: 0.3 } }}
                >
                  CV
                  <motion.span
                    className={`absolute left-0 bottom-0 h-0.5 ${
                      theme === "light" ? "bg-cyan-600" : "bg-cyan-400"
                    }`}
                    initial={{ width: 0 }}
                    whileHover={{
                      width: "100%",
                      transition: { duration: 0.3 },
                    }}
                  />
                </motion.span>
              </a>
            </motion.li>
          </ul>
        </nav>
        {/* Icônes de réseaux sociaux */}
        <div className="flex justify-around mt-auto mb-4">
          <motion.a
            href="https://www.linkedin.com/in/kokouvi-fran%C3%A7ois-adesu-179347290/"
            whileHover={{ scale: 1.2, rotate: 360 }}
            transition={{ duration: 0.3 }}
            className="text-white hover:text-cyan-200"
            aria-label="LinkedIn"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-1.337-.029-3.058-1.867-3.058-1.867 0-2.152 1.459-2.152 2.968v5.694h-3v-11h2.878v1.496h.041c.399-.757 1.377-1.557 2.833-1.557 3.027 0 3.587 1.991 3.587 4.579v6.482z" />
            </svg>
          </motion.a>
          <motion.a
            href="https://github.com/adekomen"
            whileHover={{ scale: 1.2, rotate: 360 }}
            transition={{ duration: 0.3 }}
            className="text-white hover:text-cyan-200"
            aria-label="GitHub"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </motion.a>
          <motion.a
            href="mailto:k.francoisadesu@gmail.com"
            whileHover={{ scale: 1.2, rotate: 360 }}
            transition={{ duration: 0.3 }}
            className="text-white hover:text-cyan-200"
            aria-label="Email"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
          </motion.a>
        </div>
      </motion.aside>

      {/* Overlay pour cliquer à l'extérieur et fermer la sidebar sur mobile */}
      {isSidebarOpen && window.innerWidth < 768 && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Navbar */}
      <motion.nav
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 right-0 bg-gray-900 text-white p-4 flex justify-between items-center z-20 shadow-lg ${
          isSidebarOpen ? "md:left-64" : "left-0"
        }`}
      >
        <div className="flex items-center">
          <h1 className="text-lg font-bold">🌟🌟🌟🌟🌟</h1>
        </div>
        <div className="flex items-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-sm italic text-cyan-300 hidden sm:inline"
          >
            Codez vos rêves, construisez l'avenir 🌟
          </motion.span>
        </div>
        <div className="flex items-center">
          <button
            onClick={toggleTheme}
            aria-label="Basculer le thème"
            className="focus:outline-none"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </div>
      </motion.nav>

      {/* Contenu principal */}
      <div
        className={`flex-1 relative flex flex-col ${
          isSidebarOpen ? "md:ml-64" : "ml-0"
        } pt-16`} // Ajout de pt-16 pour éviter que le contenu ne soit masqué par la navbar
      >
        {/* Particules en fond */}
        <Particles
          id="tsparticles"
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          init={particlesInit}
          options={{
            background: {
              color: { value: theme === "light" ? "#f3f4f6" : "#111827" },
            },
            particles: {
              number: {
                value: 50,
                density: {
                  enable: true,
                  width: 800,
                  height: 800,
                },
              },
              color: {
                value: theme === "light" ? "#3b82f6" : "#60a5fa",
              },
              shape: {
                type: "circle",
              },
              opacity: {
                value: 0.5,
              },
              size: {
                value: { min: 1, max: 3 },
              },
              move: {
                enable: true,
                speed: 1,
                direction: "none",
                outModes: {
                  default: "out",
                },
              },
            },
          }}
          className="absolute inset-0 z-[-1]"
        />

        {/* Accueil */}
        <motion.section
          id="home"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className={`min-h-screen flex items-center justify-center relative z-10 ${
            theme === "light" ? "bg-gray-100" : "bg-gray-800"
          }`}
        >
          <div className="container mx-auto px-16">
            <div className="flex flex-col md:flex-row items-center justify-between">
              {/* Texte à gauche */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="md:w-1/2 text-center md:text-left mb-8 md:mb-0"
              >
                {/* Titre avec effet de "typing" */}
                <motion.h2
                  className={`text-5xl md:text-6xl font-bold mb-4 leading-tight relative transition-colors duration-300 ${
                    theme === "light"
                      ? "text-gray-900 hover:text-cyan-600"
                      : "text-gray-100 hover:text-cyan-400"
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: "auto" }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  whileHover={{
                    scale: 1.05, // Léger zoom au survol
                    transition: { duration: 0.3 },
                  }}
                >
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1 }}
                  >
                    ADESU-FLS
                  </motion.span>
                  {/* Curseur clignotant pour l'effet de typing */}
                  <motion.span
                    className={`absolute h-12 w-1 ml-2 ${
                      theme === "light" ? "bg-cyan-600" : "bg-cyan-400"
                    }`}
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: 1 }}
                  />
                </motion.h2>

                {/* Paragraphe avec zoom au survol */}
                <motion.p
                  className={`text-lg md:text-xl mb-6 transition-colors duration-300 ${
                    theme === "light"
                      ? "text-gray-600 hover:text-gray-800"
                      : "text-gray-300 hover:text-gray-100"
                  }`}
                  whileHover={{
                    scale: 1.05, // Léger zoom
                    transition: { duration: 0.3 },
                  }}
                >
                  Architecte logiciel.{" "}
                  <span className="block text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Création d'applications modernes et scalables avec{" "}
                    <motion.a
                      href="https://github.com/adekomen"
                      className={`relative transition-colors duration-300 ${
                        theme === "light"
                          ? "text-blue-500 hover:text-blue-700"
                          : "text-blue-400 hover:text-blue-300"
                      } hover:underline`}
                      whileHover={{ scale: 1.1, transition: { duration: 0.3 } }}
                    >
                      @adekomen
                      <motion.span
                        className={`absolute left-0 bottom-0 h-0.5 ${
                          theme === "light" ? "bg-blue-700" : "bg-blue-300"
                        }`}
                        initial={{ width: 0 }}
                        whileHover={{
                          width: "100%",
                          transition: { duration: 0.3 },
                        }}
                      />
                    </motion.a>
                  </span>
                </motion.p>

                {/* Bouton avec pulsation et glow */}
                <motion.a
                  href="#projects"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: [1, 1.05, 1], // Pulsation répétée à l'entrée
                  }}
                  transition={{
                    duration: 0.8,
                    delay: 0.4,
                    scale: { duration: 1, repeat: Infinity, repeatDelay: 1 },
                  }}
                  whileHover={{
                    scale: 1.1, // Zoom au survol
                    boxShadow:
                      theme === "light"
                        ? "0 0 15px rgba(0, 0, 0, 0.3)"
                        : "0 0 15px rgba(34, 211, 238, 0.5)", // Glow au survol
                    transition: { duration: 0.3 },
                  }}
                  className={`inline-block border-2 ${
                    theme === "light"
                      ? "border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white"
                      : "border-gray-200 text-gray-200 hover:bg-gray-200 hover:text-gray-900"
                  } px-6 py-3 rounded-lg font-semibold transition-colors duration-300`}
                >
                  Découvrir mes projets
                </motion.a>
              </motion.div>

              {/* Image à droite */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow:
                    theme === "light"
                      ? "0 15px 30px rgba(0, 0, 0, 0.3)"
                      : "0 15px 30px rgba(0, 0, 0, 0.7)",
                  borderColor:
                    theme === "light"
                      ? "rgb(34, 211, 238)"
                      : "rgb(103, 232, 249)", // Bordure cyan
                  transition: { duration: 0.3 },
                }}
                className="md:w-1/2 border-2 border-transparent rounded-lg w-full h-full overflow-hidden"
              >
                <img
                  src="/assets/lesaint2.jpg"
                  alt="ADESU-FLS"
                  className="w-full h-full max-h-[600px] object-cover rounded-lg shadow-lg transition-all duration-300"
                  loading="lazy"
                />
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Projets */}
        <motion.section
          id="projects"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className={`py-20 ${theme === "light" ? "bg-white" : "bg-gray-800"}`}
        >
          <div className="container mx-auto px-4">
            {/* Titre avec effet de "typing" */}
            <motion.h2
              className={`text-3xl font-bold text-center mb-10 relative transition-all duration-300 ${
                theme === "light" ? "text-gray-900" : "text-gray-100"
              }`} // Retiré hover:text-cyan-*
              initial={{ width: 0 }}
              animate={{ width: "auto" }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.3 },
              }}
            >
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1 }}
              >
                Mes Projets
              </motion.span>
            </motion.h2>

            {/* Filtre avec zoom et glow */}
            <div className="flex justify-center mb-8">
              <motion.select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className={`p-2 rounded border-2 transition-all duration-300 ${
                  theme === "light"
                    ? "bg-gray-200 text-gray-900 border-gray-300"
                    : "bg-gray-700 text-white border-gray-600"
                }`} // Retiré hover:bg-*
                whileHover={{
                  scale: 1.1,
                  boxShadow:
                    theme === "light"
                      ? "0 0 10px rgba(0, 0, 0, 0.2)"
                      : "0 0 10px rgba(34, 211, 238, 0.5)",
                  transition: { duration: 0.3 },
                }}
                aria-label="Filtrer par technologie"
              >
                <option>Tous</option>
                {uniqueTechnologies.map((tech) => (
                  <option key={tech} value={tech}>
                    {tech}
                  </option>
                ))}
              </motion.select>
            </div>

            {/* Grille de projets */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {currentProjects.map((project) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{
                    scale: 1.05,
                    rotateX: 5,
                    rotateY: 5,
                    boxShadow:
                      theme === "light"
                        ? "0 10px 20px rgba(0, 0, 0, 0.2)"
                        : "0 10px 20px rgba(0, 0, 0, 0.5)",
                    transition: { duration: 0.3 },
                  }}
                  className={`p-6 rounded-lg shadow-lg transition-all duration-300 ${
                    theme === "light" ? "bg-gray-100" : "bg-gray-700"
                  } cursor-pointer`}
                  onClick={() => setSelectedProject(project)}
                >
                  <motion.div
                    whileHover={{
                      scale: 1.05,
                      transition: { duration: 0.3 },
                    }}
                    className="relative w-full h-48 rounded transition-all duration-300"
                  >
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover rounded"
                      loading="lazy"
                    />
                  </motion.div>
                  <motion.h3
                    className={`text-xl font-semibold mb-2 transition-all duration-300 ${
                      theme === "light" ? "text-gray-900" : "text-gray-100"
                    }`} // Retiré hover:text-cyan-*
                    whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                  >
                    {project.title}
                  </motion.h3>
                  <motion.p
                    className={`mb-4 transition-all duration-300 ${
                      theme === "light" ? "text-gray-600" : "text-gray-300"
                    }`} // Retiré hover:text-*
                    whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                  >
                    {project.description}
                  </motion.p>
                  {project.demo && (
                    <motion.p
                      className={`mb-4 transition-all duration-300 ${
                        theme === "light" ? "text-gray-600" : "text-gray-300"
                      }`} // Retiré hover:text-*
                      whileHover={{
                        scale: 1.05,
                        transition: { duration: 0.3 },
                      }}
                    >
                      <strong>Demo :</strong> {project.demo}
                    </motion.p>
                  )}
                  <motion.p
                    className={`mb-4 transition-all duration-300 ${
                      theme === "light" ? "text-gray-600" : "text-gray-300"
                    }`} // Retiré hover:text-*
                    whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                  >
                    <strong>Technologies :</strong>{" "}
                    {project.technologies.join(", ")}
                  </motion.p>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 space-x-4">
                <motion.button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-full transition-all duration-300 ${
                    theme === "light"
                      ? "bg-gray-200 text-gray-900"
                      : "bg-gray-700 text-white"
                  } ${
                    currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  whileHover={{
                    scale: currentPage === 1 ? 1 : 1.1,
                    boxShadow:
                      currentPage === 1
                        ? "none"
                        : theme === "light"
                        ? "0 0 10px rgba(0, 0, 0, 0.2)"
                        : "0 0 10px rgba(34, 211, 238, 0.5)",
                    transition: { duration: 0.3 },
                  }}
                >
                  Précédent
                </motion.button>
                <span
                  className={`self-center ${
                    theme === "light" ? "text-gray-900" : "text-gray-100"
                  }`}
                >
                  Page {currentPage} sur {totalPages}
                </span>
                <motion.button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-full transition-all duration-300 ${
                    theme === "light"
                      ? "bg-gray-200 text-gray-900"
                      : "bg-gray-700 text-white"
                  } ${
                    currentPage === totalPages
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  whileHover={{
                    scale: currentPage === totalPages ? 1 : 1.1,
                    boxShadow:
                      currentPage === totalPages
                        ? "none"
                        : theme === "light"
                        ? "0 0 10px rgba(0, 0, 0, 0.2)"
                        : "0 0 10px rgba(34, 211, 238, 0.5)",
                    transition: { duration: 0.3 },
                  }}
                >
                  Suivant
                </motion.button>
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
        </motion.section>

        {/* Compétences */}
        <motion.section
          id="skills"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className={`py-20 ${
            theme === "light" ? "bg-gray-100" : "bg-gray-800"
          }`}
        >
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-6">
              Mes Compétences
            </h2>
            {/* Phrase d'introduction */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className={`text-center text-lg max-w-2xl mx-auto mb-10 ${
                theme === "light" ? "text-gray-600" : "text-gray-300"
              }`}
            >
              À travers mon parcours, j’ai eu la chance d’explorer et de
              maîtriser diverses technologies, toujours avec la même curiosité
              et l’envie de créer des solutions qui ont du sens et qui apportent
              de la valeur aux utilisateurs.
            </motion.p>
            {/* Liste des compétences */}
            <div className="flex flex-wrap justify-center gap-4">
              {[
                "JavaScript",
                "PHP",
                "TypeScript",
                "React",
                "Node.js",
                "MongoDB",
                "MySQL",
                "Docker",
                "UML",
                "SQL",
                "Flutter",
                "Laravel",
                "Angular",
                "Python",
              ].map((skill) => (
                <motion.span
                  key={skill}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`px-4 py-2 rounded-full ${
                    theme === "light"
                      ? "bg-cyan-600 text-white"
                      : "bg-cyan-800 text-white"
                  }`}
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.section>

        {/* À propos */}
        <motion.section
          id="about"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={`py-20 ${theme === "light" ? "bg-white" : "bg-gray-800"}`}
        >
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">
              A Propos de moi
            </h2>

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col md:flex-row justify-center items-center gap-8 mb-12"
            >
              {/* Photo */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow:
                    theme === "light"
                      ? "0 15px 30px rgba(0, 0, 0, 0.3)"
                      : "0 15px 30px rgba(0, 0, 0, 0.7)",
                  borderColor:
                    theme === "light"
                      ? "rgb(34, 211, 238)"
                      : "rgb(103, 232, 249)", // Bordure cyan
                  transition: { duration: 0.3 },
                }}
                className="w-[280px] h-[360px] border-2 border-transparent rounded-lg overflow-hidden"
              >
                <img
                  src="/assets/lesaint4.jpg"
                  alt="Kokouvi François Adesu"
                  className="w-full h-full object-cover rounded-lg"
                  loading="lazy"
                />
              </motion.div>

              {/* Texte de présentation */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex-1"
              >
                <p
                  className={`text-lg ${
                    theme === "light" ? "text-gray-600" : "text-gray-300"
                  } mb-4`}
                >
                  Salut, moi c’est <strong>Kokouvi François ADESU</strong>, mais
                  tu peux m’appeler François ! Je suis un développeur passionné
                  avec un faible pour l’architecture logicielle et les
                  interfaces utilisateur qui en jettent. Mon parcours m’a permis
                  de construire des bases solides en programmation, et j’ai déjà
                  plusieurs projets sympas à mon actif, comme une plateforme de
                  gestion de bibliothèque en ligne, une app de restauration avec
                  Angular, une app mobile de gestion d'habitude avec flutter...
                </p>
                <p
                  className={`text-lg ${
                    theme === "light" ? "text-gray-600" : "text-gray-300"
                  } mb-4`}
                >
                  Ce qui me fait vibrer, c’est de créer des solutions techniques
                  qui allient robustesse et simplicité d’utilisation. J’adore
                  explorer de nouvelles technos et trouver des moyens innovants
                  pour résoudre des problèmes – et je prends un vrai plaisir à
                  développer des apps mobiles avec Flutter, où je peux laisser
                  libre cours à ma créativité pour offrir des expériences
                  fluides et modernes. Pour moi, un bon projet, c’est un savant
                  mélange de code propre, d’architecture bien pensée et d’une
                  expérience utilisateur fluide.
                </p>
                <p
                  className={`text-lg ${
                    theme === "light" ? "text-gray-600" : "text-gray-300"
                  } mb-4`}
                >
                  Mon approche ? Je commence toujours par comprendre les
                  besoins, puis je conçois une architecture modulaire avant de
                  plonger dans le code. J’aime bien utiliser des outils comme
                  UML pour visualiser mes idées, et je m’assure que tout reste
                  scalable et maintenable. En dehors du dev, tu me trouveras
                  probablement en train de suivre des séries ou d'être sur un
                  terrain de foot ou de rêver à mon prochain voyage au Qatar –
                  un pays qui m’inspire énormément !
                </p>
                <p
                  className={`text-lg ${
                    theme === "light" ? "text-gray-600" : "text-gray-300"
                  }`}
                >
                  Si tu veux échanger sur un projet, une idée ou juste papoter
                  tech, n’hésite pas à me contacter via la section Contact. Je
                  suis toujours partant pour collaborer ou discuter
                  d’opportunités excitantes !
                </p>
              </motion.div>
            </motion.div>

            <h2 className="text-3xl font-bold mb-12 text-center">
              Mon Parcours en Développement
            </h2>

            <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-4">
              {/* Colonne 1 : Fondations */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                whileHover={{
                  y: -10,
                  boxShadow:
                    "0 10px 20px rgba(0, 0, 0, 0.2), 0 0 15px rgba(59, 130, 246, 0.5)",
                  borderColor:
                    theme === "light"
                      ? "rgb(96, 165, 250)"
                      : "rgb(147, 197, 253)",
                  transition: { duration: 0.3 },
                }}
                className={`p-6 rounded-xl shadow-lg transition-all duration-300 max-h-90 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-blue-100 dark:scrollbar-thumb-blue-300 dark:scrollbar-track-gray-700 border-2 border-transparent ${
                  theme === "light"
                    ? "bg-gradient-to-br from-blue-50 to-purple-50 hover:bg-blue-100"
                    : "bg-gradient-to-br from-gray-700 to-gray-800 hover:bg-gray-600"
                }`}
              >
                <div className="flex items-center mb-4">
                  <motion.div
                    className={`p-2 rounded-full mr-3 transition-all duration-300 ${
                      theme === "light" ? "bg-blue-100" : "bg-blue-900"
                    }`}
                    whileHover={{
                      scale: [1, 1.2, 1, 1.2],
                      rotate: 10,
                      transition: { duration: 0.6, repeat: Infinity },
                    }}
                  >
                    <Code
                      className={`h-6 w-6 transition-colors duration-300 ${
                        theme === "light"
                          ? "text-blue-600 hover:text-blue-800"
                          : "text-blue-300 hover:text-blue-500"
                      }`}
                    />
                  </motion.div>
                  <motion.h3
                    className="text-xl font-semibold dark:text-white"
                    whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                  >
                    Débuts en Programmation
                  </motion.h3>
                </div>
                <motion.p
                  className={`${
                    theme === "light" ? "text-gray-600" : "text-gray-300"
                  }`}
                  whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                >
                  Initiation aux algorithmes et POO avec Java. Premiers projets
                  web (HTML/CSS/JS) et découverte des bases de données
                  relationnelles.
                </motion.p>
              </motion.div>

              {/* Colonne 2 : Spécialisation */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{
                  y: -10,
                  boxShadow:
                    "0 10px 20px rgba(0, 0, 0, 0.2), 0 0 15px rgba(139, 92, 246, 0.5)",
                  borderColor:
                    theme === "light"
                      ? "rgb(139, 92, 246)"
                      : "rgb(196, 181, 253)",
                  transition: { duration: 0.3 },
                }}
                className={`p-6 rounded-xl shadow-lg transition-all duration-300 max-h-90 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-purple-100 dark:scrollbar-thumb-purple-300 dark:scrollbar-track-gray-700 border-2 border-transparent ${
                  theme === "light"
                    ? "bg-gradient-to-br from-purple-50 to-pink-50 hover:bg-purple-100"
                    : "bg-gradient-to-br from-gray-700 to-gray-800 hover:bg-gray-600"
                }`}
              >
                <div className="flex items-center mb-4">
                  <motion.div
                    className={`p-2 rounded-full mr-3 transition-all duration-300 ${
                      theme === "light" ? "bg-purple-100" : "bg-purple-900"
                    }`}
                    whileHover={{
                      scale: [1, 1.2, 1, 1.2],
                      rotate: 10,
                      transition: { duration: 0.6, repeat: Infinity },
                    }}
                  >
                    <Cpu
                      className={`h-6 w-6 transition-colors duration-300 ${
                        theme === "light"
                          ? "text-purple-600 hover:text-purple-800"
                          : "text-purple-300 hover:text-purple-500"
                      }`}
                    />
                  </motion.div>
                  <motion.h3
                    className="text-xl font-semibold dark:text-white"
                    whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                  >
                    Architecture Logicielle
                  </motion.h3>
                </div>
                <motion.p
                  className={`${
                    theme === "light" ? "text-gray-600" : "text-gray-300"
                  }`}
                  whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                >
                  Conception de systèmes modulaires avec microservices.
                  Expérience avec Docker, API REST. Développement d'applications
                  fullstack.
                </motion.p>
              </motion.div>

              {/* Colonne 3 : Aspirations */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{
                  y: -10,
                  boxShadow:
                    "0 10px 20px rgba(0, 0, 0, 0.2), 0 0 15px rgba(244, 114, 182, 0.5)",
                  borderColor:
                    theme === "light"
                      ? "rgb(244, 114, 182)"
                      : "rgb(251, 182, 206)",
                  transition: { duration: 0.3 },
                }}
                className={`p-6 rounded-xl shadow-lg transition-all duration-300 max-h-90 overflow-y-auto scrollbar-thin scrollbar-thumb-pink-500 scrollbar-track-pink-100 dark:scrollbar-thumb-pink-300 dark:scrollbar-track-gray-700 border-2 border-transparent ${
                  theme === "light"
                    ? "bg-gradient-to-br from-pink-50 to-orange-50 hover:bg-pink-100"
                    : "bg-gradient-to-br from-gray-700 to-gray-800 hover:bg-gray-600"
                }`}
              >
                <div className="flex items-center mb-4">
                  <motion.div
                    className={`p-2 rounded-full mr-3 transition-all duration-300 ${
                      theme === "light" ? "bg-pink-100" : "bg-pink-900"
                    }`}
                    whileHover={{
                      scale: [1, 1.2, 1, 1.2],
                      rotate: 10,
                      transition: { duration: 0.6, repeat: Infinity },
                    }}
                  >
                    <Smartphone
                      className={`h-6 w-6 transition-colors duration-300 ${
                        theme === "light"
                          ? "text-pink-600 hover:text-pink-800"
                          : "text-pink-300 hover:text-pink-500"
                      }`}
                    />
                  </motion.div>
                  <motion.h3
                    className="text-xl font-semibold dark:text-white"
                    whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                  >
                    Passion Web/Mobile
                  </motion.h3>
                </div>
                <motion.p
                  className={`${
                    theme === "light" ? "text-gray-600" : "text-gray-300"
                  }`}
                  whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                >
                  Création d'interfaces dynamiques avec React pour le Web et
                  Flutter pour le Mobile. Particulièrement intéressé par les
                  PWA(Progressive Web Apps) et l'optimisation des performances.
                  À la recherche d'opportunités pour concilier une architecture
                  robuste et UX moderne.
                </motion.p>
              </motion.div>
            </div>

            {/* Bannière complémentaire */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-12 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-800 text-white p-6 rounded-lg"
            >
              <h3 className="text-xl font-bold mb-2">Vision</h3>
              <p>
                "Concevoir des solutions techniques élégantes qui marient
                qualité architecturale et expérience utilisateur exceptionnelle,
                particulièrement dans les domaines web et mobile."
              </p>
            </motion.div>
          </div>
        </motion.section>

        {/* Contact */}
        <motion.section
          id="contact"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={`py-20 relative z-10 ${
            theme === "light" ? "bg-gray-100" : "bg-gray-800"
          }`}
        >
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-10">Me contacter</h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              Envie de collaborer ou de discuter tech ? Envoyez-moi un message !
            </motion.p>
            <form onSubmit={handleFormSubmit} className="max-w-md mx-auto">
              <input
                type="text"
                placeholder="Votre nom"
                value={formData.name}
                onChange={(e) => {
                  console.log("Name input changed to:", e.target.value);
                  setFormData((prev) => ({ ...prev, name: e.target.value }));
                }}
                className={`w-full p-2 mb-4 rounded ${
                  theme === "light"
                    ? "bg-gray-200 text-gray-900"
                    : "bg-gray-700 text-white"
                }`}
                aria-label="Nom"
              />
              <input
                type="email"
                placeholder="Votre email"
                value={formData.email}
                onChange={(e) => {
                  console.log("Email input changed to:", e.target.value);
                  setFormData((prev) => ({ ...prev, email: e.target.value }));
                }}
                className={`w-full p-2 mb-4 rounded ${
                  theme === "light"
                    ? "bg-gray-200 text-gray-900"
                    : "bg-gray-700 text-white"
                }`}
                aria-label="Email"
              />
              <textarea
                placeholder="Votre message"
                value={formData.message}
                onChange={(e) => {
                  console.log("Message input changed to:", e.target.value);
                  setFormData((prev) => ({ ...prev, message: e.target.value }));
                }}
                className={`w-full p-2 mb-4 rounded ${
                  theme === "light"
                    ? "bg-gray-200 text-gray-900"
                    : "bg-gray-700 text-white"
                }`}
                rows={4}
                aria-label="Message"
              ></textarea>
              <button
                type="submit"
                className={`w-full ${
                  theme === "light"
                    ? "bg-cyan-600 hover:bg-cyan-700"
                    : "bg-cyan-800 hover:bg-cyan-900"
                } text-white px-4 py-2 rounded flex items-center justify-center`}
              >
                {isSubmitting && (
                  <svg
                    className="animate-spin h-5 w-5 mr-2"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                )}
                {isSubmitting ? "Envoi..." : "Envoyer"}
              </button>
              {formStatus && <p className="mt-4 text-center">{formStatus}</p>}
            </form>
          </div>
        </motion.section>

        {/* CV */}
        <motion.section
          id="cv"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={`py-20 ${theme === "light" ? "bg-white" : "bg-gray-800"}`}
        >
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-10">Mon CV</h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              Consultez ou téléchargez mon CV pour découvrir mon parcours et mes
              compétences.
            </motion.p>
            <div className="max-w-3xl mx-auto mb-6">
              {!showPDF ? (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  onClick={() => {
                    setShowPDF(true);
                    const newWindow = window.open(
                      "/assets/ADESU_CV.pdf",
                      "_blank",
                      "noopener,noreferrer"
                    );
                    if (!newWindow) {
                      console.error(
                        "Failed to open new window. A popup blocker might be preventing this."
                      );
                      alert(
                        "L’ouverture du CV dans un nouvel onglet a été bloquée. Veuillez autoriser les pop-ups pour ce site ou utiliser le lien ci-dessous pour ouvrir le CV manuellement."
                      );
                    }
                  }}
                  className={`inline-block ${
                    theme === "light"
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-blue-800 hover:bg-blue-900"
                  } text-white px-6 py-3 rounded-lg font-semibold mb-4`}
                >
                  Afficher le CV
                </motion.button>
              ) : (
                <p className="text-green-500 mb-4">
                  Le CV a été ouvert dans un nouvel onglet.
                </p>
              )}
              {showPDF && (
                <div className="mt-4">
                  <p className="mb-2">
                    Si le CV ne s’est pas ouvert (par exemple, à cause d’un
                    bloqueur de pop-ups), vous pouvez l’ouvrir manuellement :
                  </p>
                  <a
                    href="/assets/SIZER.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-block ${
                      theme === "light"
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-blue-800 hover:bg-blue-900"
                    } text-white px-6 py-3 rounded-lg font-semibold mr-4 mb-4`}
                  >
                    Ouvrir le CV dans un nouvel onglet
                  </a>
                </div>
              )}
            </div>

            <motion.a
              href="/assets/ADESU_CV.pdf"
              download
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className={`inline-block ${
                theme === "light"
                  ? "bg-cyan-600 hover:bg-cyan-700"
                  : "bg-cyan-800 hover:bg-cyan-900"
              } text-white px-6 py-3 rounded-lg font-semibold mr-4 mb-4`}
              onClick={(e) => {
                console.log(
                  "Attempting to download PDF from /assets/SIZER.pdf"
                );
                fetch("/assets/ADESU_CV.pdf")
                  .then((response) => {
                    if (!response.ok) {
                      console.error("Download failed:", response.statusText);
                      e.preventDefault();
                      alert(
                        "Erreur : Le fichier CV n’a pas pu être téléchargé. Vérifiez son emplacement dans public/assets/SIZER.pdf, ou utilisez le lien alternatif ci-dessous."
                      );
                    }
                  })
                  .catch((error) => {
                    console.error("Download error:", error);
                    e.preventDefault();
                    alert(
                      "Erreur : Le fichier CV n’a pas pu être téléchargé. Vérifiez son emplacement dans public/assets/SIZER.pdf, ou utilisez le lien alternatif ci-dessous."
                    );
                  });
              }}
            >
              Télécharger mon CV
            </motion.a>
          </div>
        </motion.section>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={`mt-auto py-12 ${
            theme === "light"
              ? "bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500"
              : "bg-gradient-to-r from-cyan-800 via-blue-800 to-purple-800"
          } text-white relative overflow-hidden`} // Ajout de via-blue pour un dégradé plus riche
        >
          {/* Effet de particules légères (optionnel, réutilise tsparticles si déjà configuré) */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <Particles
              id="footer-particles"
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-expect-error
              init={particlesInit}
              options={{
                particles: {
                  number: { value: 20 },
                  color: { value: "#ffffff" },
                  shape: { type: "circle" },
                  opacity: { value: 0.3 },
                  size: { value: { min: 1, max: 3 } },
                  move: {
                    enable: true,
                    speed: 0.5,
                    direction: "none",
                    outModes: { default: "out" },
                  },
                },
              }}
            />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            {/* Section principale */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
              {/* Colonne 1 : Branding */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <motion.h3
                  whileHover={{ scale: 1.05 }}
                  className="text-2xl font-bold mb-4"
                >
                  ADESU-FLS
                </motion.h3>
                <p className="text-sm opacity-80">
                  Développeur passionné, spécialisé en architecture logicielle
                  et UX moderne.
                </p>
              </motion.div>

              {/* Colonne 2 : Contact */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <h4 className="text-lg font-semibold mb-4">Me contacter</h4>
                <div className="flex flex-col gap-3 items-center md:items-start">
                  <motion.a
                    href="tel:+22899553976"
                    className="flex items-center gap-2 hover:text-cyan-200"
                    whileHover={{ scale: 1.05, x: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Phone className="w-5 h-5" />
                    <span>(+228) 99553976 (Appel)</span>
                  </motion.a>
                  <motion.a
                    href="https://wa.me/+22946620072?text=Salut%20François,%20je%20viens%20de%20voir%20ton%20portfolio%20et%20j'aimerais%20discuter%20d'un%20projet%20!"
                    className="flex items-center gap-2 hover:text-cyan-200"
                    whileHover={{ scale: 1.05, x: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FaWhatsapp className="w-5 h-5" />
                    <span>Chat sur WhatsApp</span>
                  </motion.a>
                  <motion.a
                    href="mailto:k.francoisadesu@gmail.com"
                    className="flex items-center gap-2 hover:text-cyan-200"
                    whileHover={{ scale: 1.05, x: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Mail className="w-5 h-5" />
                    <span>k.francoisadesu@gmail.com</span>
                  </motion.a>
                </div>
              </motion.div>

              {/* Colonne 3 : Liens utiles */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <h4 className="text-lg font-semibold mb-4">Liens utiles</h4>
                <div className="flex flex-col gap-3 items-center md:items-start">
                  <motion.a
                    href="https://github.com/adekomen/portfolio.git"
                    className="flex items-center gap-2 hover:text-cyan-200"
                    whileHover={{ scale: 1.05, x: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Github className="w-5 h-5" />
                    <span>GitHub - Code source</span>
                  </motion.a>
                  <motion.a
                    href="https://www.linkedin.com/in/kokouvi-fran%C3%A7ois-adesu-179347290/"
                    className="flex items-center gap-2 hover:text-cyan-200"
                    whileHover={{ scale: 1.05, x: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Linkedin className="w-5 h-5" />
                    <span>LinkedIn</span>
                  </motion.a>
                </div>
              </motion.div>
            </div>

            {/* Ligne de copyright */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mt-8 pt-6 border-t border-white/20 text-center"
            >
              <p className="text-sm opacity-80">
                © {new Date().getFullYear()} ADESU-FLS. Tous droits réservés.
              </p>
            </motion.div>
          </div>
        </motion.footer>
      </div>
    </div>
  );
};

export default App;
