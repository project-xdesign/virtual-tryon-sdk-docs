"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="theme-toggle-placeholder" />
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="theme-toggle-btn"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun size={16} className="text-orange" />
      ) : (
        <Moon size={16} className="text-indigo" />
      )}
      <span className="theme-text">
        {theme === "dark" ? "Light Mode" : "Dark Mode"}
      </span>
      
      <style jsx>{`
        .theme-toggle-placeholder {
          width: 100%;
          height: 38px;
          border-radius: 8px;
          background-color: rgba(0,0,0,0.05);
        }
        .theme-toggle-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 16px;
          background-color: rgba(0, 0, 0, 0.03);
          border: 1px solid hsl(var(--border-color));
          border-radius: 8px;
          cursor: pointer;
          font-family: var(--font-sora);
          font-size: 0.8rem;
          font-weight: 600;
          color: hsl(var(--text-secondary));
          transition: all 0.2s ease;
        }
        :global(.dark) .theme-toggle-btn {
          background-color: rgba(255, 255, 255, 0.02);
        }
        .theme-toggle-btn:hover {
          border-color: hsl(var(--border-color-glow));
          color: hsl(var(--text-primary));
          background-color: rgba(0, 0, 0, 0.06);
        }
        :global(.dark) .theme-toggle-btn:hover {
          background-color: rgba(255, 255, 255, 0.04);
        }
        .theme-text {
          flex-grow: 1;
          text-align: left;
        }
      `}</style>
    </button>
  );
}
