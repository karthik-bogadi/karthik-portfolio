import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, Rocket } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { ProjectsBackground } from "./SectionBackgrounds";
import { trackSectionView } from "../services/analytics";

type ProjectAnimationPreviewProps = {
  path: string;
  title: string;
};

const ProjectAnimationPreview: React.FC<ProjectAnimationPreviewProps> = ({
  path,
  title,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animation: {
      destroy: () => void;
      setSubframe: (useSubFrames: boolean) => void;
      setSpeed: (speed: number) => void;
      goToAndStop: (value: number, isFrame?: boolean) => void;
    } | null = null;
    let isDisposed = false;

    const loadAnimation = async () => {
      if (!containerRef.current) return;

      const reducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      try {
        const lottieModule = await import("lottie-web/build/player/lottie_light");
        if (isDisposed || !containerRef.current) return;

        animation = lottieModule.default.loadAnimation({
          container: containerRef.current,
          renderer: "svg",
          loop: !reducedMotion,
          autoplay: !reducedMotion,
          path,
          rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
            progressiveLoad: true,
          },
        });

        animation.setSubframe(true);
        animation.setSpeed(0.9);

        if (reducedMotion) {
          animation.goToAndStop(30, true);
        }
      } catch (error) {
        console.warn("Lottie preview unavailable:", error);
      }
    };

    void loadAnimation();

    return () => {
      isDisposed = true;
      animation?.destroy();
    };
  }, [path]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full [&>svg]:w-full [&>svg]:h-full"
      role="img"
      aria-label={`${title} animated preview`}
    />
  );
};

const ProjectsSection: React.FC = () => {
  const { isDarkMode } = useTheme();

  const [clickedProject, setClickedProject] = useState<number | null>(null);
  const githubProfileUrl = "https://github.com/karthik-bogadi";

  const handleProjectClick = (
    projectId: number,
    liveUrl: string,
    githubUrl: string
  ) => {
    setClickedProject(projectId);

    // Show animation for 1 second, then redirect
    setTimeout(() => {
      // Prioritize live demo URL, fall back to GitHub if live is "#"
      const targetUrl = liveUrl !== "#" ? liveUrl : githubUrl;
      if (targetUrl !== "#") {
        window.open(targetUrl, "_blank", "noopener,noreferrer");
      }
      setClickedProject(null);
    }, 1000);
  };

  type Project = {
    id: number;
    title: string;
    description: string;
    metrics: Array<{ label: string; value: string }>;
    tech: string[];
    image: string;
    github: string;
    githubLabel: string;
    live: string;
    liveLabel: string;
    animationPath?: string;
    status: string;
  };

  // Optional: map a project name to a Lottie JSON in /public/animations
  // (the card shows the animation instead of the image).
  const projectAnimationOverrides: Record<string, string> = {};

  const fallbackImage = "/project-fallback.svg";

  // Every link below comes from the resume / existing portfolio README.
  const projectData = [
    {
      name: "HealthVault",
      repo: "karthik-bogadi/Health-Vault",
      live: "https://health-vault-ylmr.onrender.com/",
      image: "/projects/healthvault.jpg",
      status: "AI + Full Stack",
      description:
        "A healthcare web application where patients upload, store, access and share medical reports from anywhere. Groq LLaMA summarizes reports after PII is removed, a Random Forest model predicts likely diseases from symptoms with 91.37% accuracy, and sharing uses temporary access tokens and hashing.",
      metrics: [
        { label: "Accuracy", value: "91.37%" },
        { label: "Framework", value: "Flask" },
        { label: "Database", value: "SQLite" },
      ],
      tech: ["Python", "Flask", "SQLite", "Random Forest", "Groq LLaMA"],
    },
    {
      name: "PVPSIT College AI Assistant (RAG MVP)",
      repo: "karthik-bogadi/PVPSIT-CampusBot",
      live: "#",
      image: "/projects/pvpsit-campusbot.jpg",
      status: "RAG + AI",
      description:
        "A Retrieval-Augmented Generation chatbot that answers student questions from PVPSIT's own documents (regulations, syllabus, calendars, exams, notifications, admissions) instead of inventing answers, and says so when the answer isn't in its knowledge base. Embeddings run locally, so documents never leave the machine.",
      metrics: [
        { label: "Embeddings", value: "Local" },
        { label: "Vector Store", value: "FAISS" },
        { label: "LLM", value: "Groq" },
      ],
      tech: ["RAG", "FAISS", "LangChain", "Streamlit", "Groq"],
    },
    {
      name: "GiftBro AI",
      repo: "karthik-bogadi/AI_Gift_Recommendation_Engine",
      live: "#",
      image: "/projects/giftbro-ai.jpg",
      status: "AI + Security",
      description:
        "A personalized gift recommendation engine that uses AI (Gemini/OpenAI) to generate thoughtful, tailored ideas. Semantic deduplication with AI embeddings avoids conceptually identical suggestions while refining, thumbs-up/down feedback shapes future picks, and JWT secures the app.",
      metrics: [
        { label: "Dedup", value: "Semantic" },
        { label: "Feedback", value: "Thumbs Up/Down" },
        { label: "Security", value: "JWT" },
      ],
      tech: ["Gemini", "OpenAI", "AI Embeddings", "JWT"],
    },
    {
      name: "AI Agent for Automated Website Testing",
      repo: "karthik-bogadi/Automated-Website-Testing",
      live: "#",
      image: "/projects/ai-testing-agent.jpg",
      status: "AI Agent",
      description:
        "An AI-driven testing agent built during the Infosys Springboard internship. It converts natural-language instructions into structured automation steps, generates Playwright scripts dynamically, runs browser tests, and reports PASS/FAIL results end to end.",
      metrics: [
        { label: "Automation", value: "Playwright" },
        { label: "Input", value: "Natural Language" },
        { label: "Output", value: "PASS/FAIL" },
      ],
      tech: ["Playwright", "AI Agent", "Test Automation"],
    },
    {
      name: "LangGraph Recruitment Agent",
      repo: "karthik-bogadi/Langgraph-Recruitment-Agent",
      live: "#",
      image: "/projects/langgraph-recruitment-agent.jpg",
      status: "AI Agent",
      description:
        "A job-application screening workflow built with LangGraph and Groq. The LLM labels each candidate Entry, Mid or Senior and checks the application against a Python Developer role. Matches go to an HR interview, non-matching Senior candidates are escalated to a recruiter, and the rest are rejected.",
      metrics: [
        { label: "Workflow", value: "LangGraph" },
        { label: "LLM", value: "Groq" },
        { label: "Routing", value: "Conditional" },
      ],
      tech: ["Python", "LangGraph", "LangChain", "Groq"],
    },
    {
      name: "Student Management System",
      repo: "karthik-bogadi/Student-Management-System",
      live: "#",
      image: "/projects/student-management.jpg",
      status: "Backend",
      description:
        "A Spring Boot backend following MVC architecture for managing student records, with CRUD operations through Spring Data JPA on MySQL. REST APIs were tested with Postman.",
      metrics: [
        { label: "Framework", value: "Spring Boot" },
        { label: "Database", value: "MySQL" },
        { label: "Operations", value: "CRUD" },
      ],
      tech: ["Java", "Spring Boot", "Spring Data JPA", "MySQL", "REST APIs"],
    },
  ];

  const toLiveLabel = (url: string) => {
    try {
      return new URL(url).host;
    } catch {
      return url;
    }
  };

  const allProjects: Project[] = projectData.map((item, index) => {
    const githubUrl = item.repo
      ? `https://github.com/${item.repo}`
      : githubProfileUrl;
    return {
      id: index + 1,
      title: item.name,
      description: item.description,
      metrics: item.metrics,
      tech: item.tech,
      image: item.image,
      github: githubUrl,
      githubLabel: item.repo || "github.com/karthik-bogadi",
      live: item.live,
      liveLabel: item.live !== "#" ? toLiveLabel(item.live) : "",
      animationPath: projectAnimationOverrides[item.name],
      status: item.status,
    };
  });

  const projects = allProjects.slice(0, 6);

  const displayedProjects = projects;

  const refProjects = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          trackSectionView("Projects");
        }
      },
      { threshold: 0.5 }
    );
    if (refProjects.current) observer.observe(refProjects.current);
    return () => {
      if (refProjects.current) observer.unobserve(refProjects.current);
    };
  }, []);

  return (
    <section
      id="projects"
      data-section="projects"
      className={`min-h-screen py-20 relative overflow-hidden ${
        isDarkMode ? "bg-black text-white" : "bg-white text-gray-900"
      }`}
    >
      {/* Background */}
      <ProjectsBackground />

      {/* Enhanced constellation effect */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-orange-400/30 rounded-full"
            style={{
              left: `${15 + i * 10}%`,
              top: `${25 + Math.sin(i) * 20}%`,
            }}
            animate={{
              scale: [1, 2, 1],
              opacity: [0.3, 0.8, 0.3],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 6 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4">
        <div ref={refProjects} className="max-w-7xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2
              className={`text-4xl md:text-6xl font-display font-bold mb-4 text-shadow-soft ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Featured <span className="interstellar-text">Projects</span>
            </h2>
            <p
              className={`text-xl max-w-3xl mx-auto ${
                isDarkMode ? "text-white/70" : "text-gray-600"
              }`}
            >
              A selection of my work across Java backend development,
              AI-powered applications, and web development.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedProjects.map((project, index) => (
              <motion.div
                key={project.id}
                className={`group relative backdrop-blur-sm border rounded-xl overflow-hidden hover:border-orange-400/50 transition-all duration-500 cursor-pointer ${
                  isDarkMode
                    ? "bg-white/10 border-white/20 text-white"
                    : "bg-white/90 border-orange-100 text-gray-900 shadow-glow-md"
                }`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                whileHover={{ y: -10, scale: 1.02 }}
                onClick={() =>
                  handleProjectClick(project.id, project.live, project.github)
                }
              >
                {/* Click Animation Overlay */}
                <AnimatePresence>
                  {clickedProject === project.id && (
                    <motion.div
                      className="absolute inset-0 z-50 bg-orange-400/20 backdrop-blur-sm flex items-center justify-center"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.2 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div
                        className="text-orange-400 text-4xl"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <Rocket size={48} />
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
                {/* Project Image */}
                <div className="relative h-48 overflow-hidden">
                  {project.animationPath ? (
                    <ProjectAnimationPreview
                      path={project.animationPath}
                      title={project.title}
                    />
                  ) : (
                    <img
                      src={project.image}
                      alt={`${project.title} repository preview`}
                      loading="lazy"
                      onError={(event) => {
                        const img = event.currentTarget;
                        if (!img.src.endsWith(fallbackImage)) {
                          img.src = fallbackImage;
                        }
                      }}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-mono bg-orange-400/20 text-orange-400"
                    >
                      {project.status}
                    </span>
                  </div>
                </div>

                {/* Project Content */}
                <div className="p-6">
                  <h3
                    className={`text-xl font-mono font-bold ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    } mb-3 group-hover:text-orange-400 transition-colors`}
                  >
                    <span
                      className={isDarkMode ? "text-white" : "text-gray-900"}
                    >
                      {project.title}
                    </span>
                  </h3>

                  <p
                    className={`${
                      isDarkMode ? "text-white/70" : "text-gray-700"
                    } text-sm leading-relaxed mb-4`}
                  >
                    <span
                      className={isDarkMode ? "text-white" : "text-gray-900"}
                    >
                      {project.description}
                    </span>
                  </p>

                  {project.live !== "#" ? (
                    <div
                      className={`text-xs font-mono mb-4 ${
                        isDarkMode ? "text-orange-300/90" : "text-orange-700"
                      }`}
                    >
                      Deployment: {project.liveLabel}
                    </div>
                  ) : (
                    <div className="mb-4">
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(event) => event.stopPropagation()}
                        className={`inline-flex max-w-full items-center gap-1 text-xs font-mono underline decoration-orange-400/50 hover:decoration-orange-400 ${
                          isDarkMode ? "text-orange-300/90" : "text-orange-700"
                        }`}
                        title={project.github}
                      >
                        <span className="shrink-0">GitHub:</span>
                        <span className="truncate">{project.githubLabel}</span>
                      </a>
                    </div>
                  )}

                  {/* Performance Metrics */}
                  {project.metrics && (
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {project.metrics.map((metric, idx) => (
                          <div
                            key={idx}
                            className={`text-center p-2 rounded-lg ${
                              isDarkMode
                                ? "bg-orange-400/10 border border-orange-400/30"
                                : "bg-orange-50 border border-orange-200"
                            }`}
                          >
                            <div className="text-orange-400 font-bold text-xs mb-1">
                              {metric.value}
                            </div>
                            <div
                              className={`text-[10px] font-mono ${
                                isDarkMode ? "text-white/60" : "text-gray-600"
                              }`}
                            >
                              {metric.label}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className={`px-2 py-1 ${
                          isDarkMode
                            ? "bg-white/10 text-white/80"
                            : "bg-gray-200 text-gray-700"
                        } rounded text-xs font-mono`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Project Links */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <motion.a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(event) => {
                          event.stopPropagation();
                        }}
                        className="flex items-center gap-2 text-white/70 hover:text-orange-400 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Github size={16} />
                        <span className="text-sm font-mono">Code</span>
                      </motion.a>

                      <motion.a
                        href={project.live}
                        target={project.live !== "#" ? "_blank" : undefined}
                        rel={
                          project.live !== "#" ? "noopener noreferrer" : undefined
                        }
                        onClick={(event) => {
                          event.stopPropagation();
                          if (project.live === "#") {
                            event.preventDefault();
                            window.open(
                              project.github,
                              "_blank",
                              "noopener,noreferrer"
                            );
                          }
                        }}
                        className="flex items-center gap-2 text-white/70 hover:text-orange-400 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ExternalLink size={16} />
                        <span className="text-sm font-mono">Live</span>
                      </motion.a>
                    </div>

                    <motion.button
                      type="button"
                      onClick={(event) => event.stopPropagation()}
                      className="p-2 bg-orange-400/10 text-orange-400 rounded-full hover:bg-orange-400/20 transition-colors"
                      whileHover={{ scale: 1.1, rotate: 15 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Rocket size={16} />
                    </motion.button>
                  </div>
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-orange-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </motion.div>
            ))}
          </div>

          {/* More Projects Button */}
          {(
            <motion.div
              className="text-center mt-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <motion.a
                href={githubProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-3 border border-orange-400 text-orange-400 font-mono font-medium rounded-full hover:bg-orange-400/10 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Rocket size={20} />
                More Projects on GitHub
              </motion.a>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
