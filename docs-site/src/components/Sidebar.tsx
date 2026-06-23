"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, BookOpen, Key, Activity, BarChart2, ShieldAlert, Code2, CloudUpload, Play, Wallet, History, HeartPulse } from "lucide-react";

interface NavLink {
  title: string;
  href: string;
  icon: React.ReactNode;
  badge?: "get" | "post";
}

interface NavGroup {
  groupTitle: string;
  links: NavLink[];
}

export default function Sidebar() {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");

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

  // Navigation configurations for each category
  const apiNavigation: NavGroup[] = [
    {
      groupTitle: "Getting Started",
      links: [
        { title: "Introduction", href: "/docs/api", icon: <BookOpen size={16} /> },
        { title: "Authentication", href: "/docs/api/authentication", icon: <Key size={16} /> },
        { title: "Integration Workflow", href: "/docs/api/workflow", icon: <Activity size={16} /> }
      ]
    },
    {
      groupTitle: "API Endpoints",
      links: [
        { title: "Upload VTON Images", href: "/docs/api/endpoints/upload", icon: <CloudUpload size={16} />, badge: "post" },
        { title: "Generate Try-On", href: "/docs/api/endpoints/generate", icon: <Play size={16} />, badge: "post" },
        { title: "Check Credits", href: "/docs/api/endpoints/credits", icon: <Wallet size={16} />, badge: "post" },
        { title: "Get History", href: "/docs/api/endpoints/history", icon: <History size={16} />, badge: "get" },
        { title: "Service Health Check", href: "/docs/api/endpoints/health-check", icon: <HeartPulse size={16} />, badge: "get" }
      ]
    },
    {
      groupTitle: "Resources",
      links: [
        { title: "Model & Credit Matrix", href: "/docs/api/credit-matrix", icon: <BarChart2 size={16} /> },
        { title: "Error Handling", href: "/docs/api/errors", icon: <ShieldAlert size={16} /> },
        { title: "Code Examples", href: "/docs/api/examples", icon: <Code2 size={16} /> }
      ]
    }
  ];

  const npmNavigation: NavGroup[] = [
    {
      groupTitle: "Getting Started",
      links: [
        { title: "Introduction", href: "/docs/npm", icon: <BookOpen size={16} /> },
        { title: "Installation & Setup", href: "/docs/npm/installation", icon: <CloudUpload size={16} /> }
      ]
    },
    {
      groupTitle: "Usage Reference",
      links: [
        { title: "Client API Reference", href: "/docs/npm/client-reference", icon: <Play size={16} /> },
        { title: "Error Handling", href: "/docs/npm/errors", icon: <ShieldAlert size={16} /> }
      ]
    },
    {
      groupTitle: "Examples",
      links: [
        { title: "Full Integration Flow", href: "/docs/npm/examples", icon: <Code2 size={16} /> }
      ]
    }
  ];

  const flutterNavigation: NavGroup[] = [
    {
      groupTitle: "Getting Started",
      links: [
        { title: "Introduction", href: "/docs/flutter", icon: <BookOpen size={16} /> },
        { title: "Installation", href: "/docs/flutter/installation", icon: <CloudUpload size={16} /> },
        { title: "Configuration", href: "/docs/flutter/configuration", icon: <Key size={16} /> }
      ]
    },
    {
      groupTitle: "SDK Core Widgets",
      links: [
        { title: "Try-On Flow", href: "/docs/flutter/widgets/try-on-viewer", icon: <Play size={16} /> }
      ]
    },
    {
      groupTitle: "Examples",
      links: [
        { title: "Full App Example", href: "/docs/flutter/examples", icon: <Code2 size={16} /> }
      ]
    }
  ];

  const iosNavigation: NavGroup[] = [
    {
      groupTitle: "Getting Started",
      links: [
        { title: "Introduction", href: "/docs/ios", icon: <BookOpen size={16} /> },
        { title: "Installation", href: "/docs/ios/installation", icon: <CloudUpload size={16} /> }
      ]
    },
    {
      groupTitle: "Usage Reference",
      links: [
        { title: "VTONViewController", href: "/docs/ios/controller", icon: <Play size={16} /> }
      ]
    },
    {
      groupTitle: "Examples",
      links: [
        { title: "SwiftUI Integration", href: "/docs/ios/examples", icon: <Code2 size={16} /> }
      ]
    }
  ];

  const androidNavigation: NavGroup[] = [
    {
      groupTitle: "Getting Started",
      links: [
        { title: "Introduction", href: "/docs/android", icon: <BookOpen size={16} /> },
        { title: "Installation", href: "/docs/android/installation", icon: <CloudUpload size={16} /> }
      ]
    },
    {
      groupTitle: "Usage Reference",
      links: [
        { title: "VtonActivity", href: "/docs/android/activity", icon: <Play size={16} /> }
      ]
    },
    {
      groupTitle: "Examples",
      links: [
        { title: "Kotlin Integration", href: "/docs/android/examples", icon: <Code2 size={16} /> }
      ]
    }
  ];

  // Select active navigation array based on current category
  const activeNavigation = 
    currentCategory === "flutter" ? flutterNavigation :
    currentCategory === "ios" ? iosNavigation :
    currentCategory === "android" ? androidNavigation :
    currentCategory === "npm" ? npmNavigation :
    apiNavigation;

  // Filter links based on search query
  const filteredNavigation = activeNavigation
    .map((group) => {
      const matchingLinks = group.links.filter(
        (link) =>
          link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          link.href.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return { ...group, links: matchingLinks };
    })
    .filter((group) => group.links.length > 0);

  return (
    <aside className="sidebar">
      {/* Search */}
      <div className="sidebar-search" style={{ marginTop: 12 }}>
        <Search />
        <input
          type="text"
          placeholder="Search docs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              color: "hsl(var(--text-muted))",
              cursor: "pointer",
              fontSize: "0.8rem"
            }}
          >
            Clear
          </button>
        )}
      </div>

      {/* Navigation Groups */}
      <nav className="sidebar-nav">
        {filteredNavigation.map((group, groupIdx) => (
          <div key={groupIdx} className="sidebar-group">
            <div className="sidebar-group-title">{group.groupTitle}</div>
            <div className="sidebar-links">
              {group.links.map((link, linkIdx) => {
                // Robust active status matching (supporting backward compatible raw paths)
                const isActive = pathname === link.href || 
                                 (link.href === "/docs/api" && pathname === "/docs") ||
                                 (pathname === link.href.replace("/docs/api", "/docs"));
                return (
                  <Link
                    key={linkIdx}
                    href={link.href}
                    className={`sidebar-link ${isActive ? "active" : ""}`}
                  >
                    {link.icon}
                    <span style={{ flexGrow: 1 }}>{link.title}</span>
                    {link.badge && (
                      <span className={`sidebar-link-badge ${link.badge}`}>
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
        {filteredNavigation.length === 0 && (
          <div className="no-search-results">No documentation pages found.</div>
        )}
      </nav>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        <div>Base URL:</div>
        <code style={{ fontSize: "0.7rem", color: "hsl(var(--accent-cyan))" }}>
          https://apisdk.snapmydesign.com/api/v1
        </code>
        <div style={{ marginTop: 12 }}>
          Developer Console: <a href="https://sdk.snapmydesign.com" target="_blank" rel="noopener noreferrer" style={{ color: "hsl(var(--accent-cyan))" }}>sdk.snapmydesign.com</a>
        </div>
        <div style={{ marginTop: 8 }}>
          Support: <a href="mailto:contactus@snapmydesign.com">contactus@snapmydesign.com</a>
        </div>
      </div>
    </aside>
  );
}
