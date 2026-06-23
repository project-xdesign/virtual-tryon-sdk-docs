"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";

export default function Header() {
  const pathname = usePathname();

  // Determine current documentation category dynamically from url pathname
  let currentCategory: "api" | "flutter" | "ios" | "android" | "npm" = "api";
  if (pathname.includes("/docs/flutter")) {
    currentCategory = "flutter";
  } else if (pathname.includes("/docs/ios")) {
    currentCategory = "ios";
  } else if (pathname.includes("/docs/android")) {
    currentCategory = "android";
  } else if (pathname.includes("/docs/npm")) {
    currentCategory = "npm";
  }

  return (
    <header className="global-header">
      <div className="header-container">
        {/* Left: Brand logo */}
        <Link href="/docs/api" className="header-logo">
          <img
            src="https://sdk.snapmydesign.com/logo-1225.webp"
            alt="SnapIt Logo"
            className="logo-img"
          />
          <div className="logo-text-container">
            <span className="logo-text-title">SnapIt</span>
            <span className="logo-text-sub">SDK Docs</span>
          </div>
          <div className="sdk-version-badge">v1.1</div>
        </Link>

        {/* Center: Navigation category tabs */}
        <nav className="header-tabs">
          <Link
            href="/docs/api"
            className={`header-tab-pill ${currentCategory === "api" ? "active" : ""}`}
          >
            API Reference
          </Link>
          <Link
            href="/docs/npm"
            className={`header-tab-pill ${currentCategory === "npm" ? "active" : ""}`}
          >
            NPM SDK
          </Link>
          <Link
            href="/docs/flutter"
            className={`header-tab-pill ${currentCategory === "flutter" ? "active" : ""}`}
          >
            Flutter SDK
          </Link>
          <Link
            href="/docs/ios"
            className={`header-tab-pill ${currentCategory === "ios" ? "active" : ""}`}
          >
            iOS SDK
          </Link>
          <Link
            href="/docs/android"
            className={`header-tab-pill ${currentCategory === "android" ? "active" : ""}`}
          >
            Android SDK
          </Link>
        </nav>

        {/* Right: Theme toggle */}
        <div className="header-actions">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
