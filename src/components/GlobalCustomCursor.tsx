import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";
import { useDeviceDetection } from "../hooks/useDeviceDetection";

const GlobalCustomCursor: React.FC = () => {
  const { isDarkMode } = useTheme();
  const deviceInfo = useDeviceDetection();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [cursorType, setCursorType] = useState<string>("default");
  const cursorTypeRef = useRef<string>("default");
  const visibilityRef = useRef<boolean>(false);
  const mouseRAFRef = useRef<number | null>(null);

  const shouldDisableCursor =
    deviceInfo.isMobile ||
    deviceInfo.isTouchDevice ||
    deviceInfo.prefersReducedMotion ||
    deviceInfo.isLowEndDevice;

  useEffect(() => {
    if (shouldDisableCursor) {
      visibilityRef.current = false;
      setIsVisible(false);
      return;
    }

    const updateCursorState = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInHeroSection = Boolean(target.closest("#hero"));
      const nextVisible = !isInHeroSection;

      if (visibilityRef.current !== nextVisible) {
        visibilityRef.current = nextVisible;
        setIsVisible(nextVisible);
      }

      if (!nextVisible) return;

      setMousePosition({ x: e.clientX, y: e.clientY });

      let nextCursorType = "default";
      if (
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.getAttribute("role") === "button" ||
        target.classList.contains("cursor-pointer")
      ) {
        nextCursorType = "pointer";
      } else if (target.closest("#about")) {
        nextCursorType = "about";
      } else if (target.closest("#projects")) {
        nextCursorType = "projects";
      } else if (target.closest("#contact")) {
        nextCursorType = "contact";
      }

      if (cursorTypeRef.current !== nextCursorType) {
        cursorTypeRef.current = nextCursorType;
        setCursorType(nextCursorType);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (mouseRAFRef.current !== null) {
        cancelAnimationFrame(mouseRAFRef.current);
      }
      mouseRAFRef.current = requestAnimationFrame(() => {
        updateCursorState(e);
        mouseRAFRef.current = null;
      });
    };

    const handleMouseEnter = () => {
      visibilityRef.current = true;
      setIsVisible(true);
    };
    const handleMouseLeave = () => {
      visibilityRef.current = false;
      setIsVisible(false);
    };

    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      if (mouseRAFRef.current !== null) {
        cancelAnimationFrame(mouseRAFRef.current);
      }
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [shouldDisableCursor]);

  const getCursorColors = () => {
    const baseColor = isDarkMode ? "#f97316" : "#4f46e5"; // Orange for dark, purple for light
    const glowColor = isDarkMode
      ? "rgba(249, 115, 22, 0.3)"
      : "rgba(79, 70, 229, 0.3)";
    const trailColor = isDarkMode
      ? "rgba(249, 115, 22, 0.1)"
      : "rgba(79, 70, 229, 0.1)";
    const borderColor = isDarkMode
      ? "rgba(249, 115, 22, 0.2)"
      : "rgba(79, 70, 229, 0.2)";

    return { baseColor, glowColor, trailColor, borderColor };
  };

  const { baseColor, glowColor, trailColor, borderColor } = getCursorColors();

  if (shouldDisableCursor || !isVisible) return null;

  return (
    <>
      {/* Primary Cursor */}
      <motion.div
        className="fixed pointer-events-none z-[9999]"
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
          transform: "translate(-50%, -50%)",
        }}
        animate={{
          scale: cursorType === "pointer" ? [1, 1.3, 1] : [1, 1.2, 1],
        }}
        transition={{
          duration: cursorType === "pointer" ? 1.5 : 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div
          className={`rounded-full border-2 ${
            cursorType === "pointer" ? "w-8 h-8" : "w-6 h-6"
          }`}
          style={{
            borderColor: baseColor,
            background: `radial-gradient(circle, ${glowColor}, transparent)`,
            boxShadow: `0 0 ${
              cursorType === "pointer" ? "25px" : "20px"
            } ${baseColor}`,
          }}
        />
      </motion.div>

      {/* Secondary Cursor - Trailing */}
      <motion.div
        className="fixed pointer-events-none z-[9998]"
        animate={{
          x: mousePosition.x,
          y: mousePosition.y,
        }}
        transition={{
          type: "spring",
          stiffness: cursorType === "pointer" ? 200 : 150,
          damping: cursorType === "pointer" ? 20 : 15,
          mass: 0.1,
        }}
        style={{
          transform: "translate(-50%, -50%)",
        }}
      >
        <div
          className={`rounded-full ${
            cursorType === "pointer" ? "w-16 h-16" : "w-12 h-12"
          }`}
          style={{
            background: `radial-gradient(circle, transparent 40%, ${trailColor} 70%, transparent)`,
            border: `1px solid ${borderColor}`,
          }}
        />
      </motion.div>

      {/* Section-specific accent cursor */}
      {(cursorType === "hero" ||
        cursorType === "about" ||
        cursorType === "projects" ||
        cursorType === "contact") && (
        <motion.div
          className="fixed pointer-events-none z-[9997]"
          animate={{
            x: mousePosition.x,
            y: mousePosition.y,
          }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 25,
            mass: 0.2,
          }}
          style={{
            transform: "translate(-50%, -50%)",
          }}
        >
          <div
            className="w-20 h-20 rounded-full"
            style={{
              background: `radial-gradient(circle, transparent 60%, ${trailColor} 80%, transparent)`,
              border: `1px solid ${borderColor}`,
              opacity: 0.5,
            }}
          />
        </motion.div>
      )}
    </>
  );
};

export default GlobalCustomCursor;
