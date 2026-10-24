import { useState, useEffect, useRef, lazy, Suspense } from "react";
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import Navigation from "./components/Navigation";
import ThemeToggle from "./components/ThemeToggle";
import GlobalCustomCursor from "./components/GlobalCustomCursor";
import { WarpSpeedEffect } from "./components/LaunchSequence";
import CinematicFooter from "./components/CinematicFooter";
import React from "react";
// Lazy load heavy components
const ProjectsSection = lazy(() => import("./components/ProjectsSection"));
const AchievementsSection = lazy(() => import("./components/BlogSection"));
const ContactSection = lazy(() => import("./components/ContactSection"));
const HobbiesSection = lazy(() => import("./components/HobbiesSection"));

import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import { useDeviceDetection } from "./hooks/useDeviceDetection";

// Loading component for lazy-loaded sections
const SectionLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p className="text-white/60 font-mono text-sm">Loading...</p>
    </div>
  </div>
);

// Main content component that uses theme
const MainContent: React.FC = () => {
  const { isDarkMode } = useTheme();
  const deviceInfo = useDeviceDetection();
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showWarpIntro, setShowWarpIntro] = useState(true);

  // Initialize app once on mount
  useEffect(() => {
    return () => {
      // Cleanup
    };
  }, []); // Run only once on mount

  // Skip heavy intro animation on constrained devices
  useEffect(() => {
    if (
      deviceInfo.prefersReducedMotion ||
      deviceInfo.isLowEndDevice ||
      deviceInfo.isMobile
    ) {
      setShowWarpIntro(false);
    }
  }, [
    deviceInfo.prefersReducedMotion,
    deviceInfo.isLowEndDevice,
    deviceInfo.isMobile,
  ]);

  // Separate useEffect for keyboard events
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.code === "Space" || e.code === "Enter") && showWarpIntro) {
        e.preventDefault();
        skipToMain();
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [showWarpIntro]);

  useEffect(() => {
    const timer = setTimeout(() => setShowWarpIntro(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!showWarpIntro) {
      // Warp intro finished
    }
  }, [showWarpIntro]);

  const skipToMain = () => {
    setShowWarpIntro(false);

    // Scroll to hero section after a brief delay to ensure content is loaded
    if (scrollTimerRef.current) {
      clearTimeout(scrollTimerRef.current);
    }
    scrollTimerRef.current = setTimeout(() => {
      const heroSection = document.getElementById("hero");
      if (heroSection) {
        heroSection.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        // Fallback: scroll to top if hero section not found
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 500);
  };

  useEffect(
    () => () => {
      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current);
      }
    },
    []
  );

  return (
    <div className="relative">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[10000] focus:rounded-md focus:bg-orange-500 focus:px-4 focus:py-2 focus:font-semibold focus:text-white"
      >
        Skip to main content
      </a>

      {/* Global custom cursor - works everywhere */}
      <GlobalCustomCursor />

      <div
        key="main"
        className={`min-h-screen relative overflow-x-hidden transition-all duration-1000 bg-transparent ${
          isDarkMode ? "text-white" : "text-gray-900"
        }`}
      >
        {/* Navigation and Content */}
        <Navigation />
        <ThemeToggle />

        <main id="main-content" tabIndex={-1} className="outline-none">
          {showWarpIntro ? (
            <div className="fixed inset-0 z-[9999] bg-black">
              <WarpSpeedEffect />
            </div>
          ) : (
            <>
              <HeroSection />
              <AboutSection />
              <HobbiesSection />
              <Suspense fallback={<SectionLoader />}>
                <ProjectsSection />
              </Suspense>
              <Suspense fallback={<SectionLoader />}>
                <AchievementsSection />
              </Suspense>
              <Suspense fallback={<SectionLoader />}>
                <ContactSection />
              </Suspense>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <MainContent />
      <CinematicFooter />
    </ThemeProvider>
  );
}

export default App;
