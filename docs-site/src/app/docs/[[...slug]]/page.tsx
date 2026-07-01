import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ENDPOINTS, QUICK_REFERENCE, MODEL_MATRIX, ERROR_CODES, STANDARD_ERROR_JSON } from "@/lib/docsData";
import SequenceDiagram from "@/components/SequenceDiagram";
import CreditCalculator from "@/components/CreditCalculator";
import ApiPlayground from "@/components/ApiPlayground";
import { ArrowRight, HelpCircle, CheckCircle2, ShieldAlert, Sparkles, BookOpen, Key, Activity, Coins, Copy, ChevronLeft, ChevronRight, Lock, GitCompare } from "lucide-react";

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

// Enable Static Pre-rendering for all documentation paths at build time (SSG)
export async function generateStaticParams() {
  return [
    // API Reference Paths
    { slug: [] },
    { slug: ["api"] },
    { slug: ["api", "authentication"] },
    { slug: ["api", "workflow"] },
    { slug: ["api", "credit-matrix"] },
    { slug: ["api", "endpoints", "upload"] },
    { slug: ["api", "endpoints", "generate"] },
    { slug: ["api", "endpoints", "credits"] },
    { slug: ["api", "endpoints", "history"] },
    { slug: ["api", "endpoints", "health-check"] },
    { slug: ["api", "errors"] },
    { slug: ["api", "examples"] },

    // Backward-compatible paths
    { slug: ["authentication"] },
    { slug: ["workflow"] },
    { slug: ["credit-matrix"] },
    { slug: ["endpoints", "upload"] },
    { slug: ["endpoints", "generate"] },
    { slug: ["endpoints", "credits"] },
    { slug: ["endpoints", "history"] },
    { slug: ["endpoints", "health-check"] },
    { slug: ["errors"] },
    { slug: ["examples"] },

    // NPM SDK Paths
    { slug: ["npm"] },
    { slug: ["npm", "installation"] },
    { slug: ["npm", "client-reference"] },
    { slug: ["npm", "errors"] },
    { slug: ["npm", "examples"] },

    // Flutter SDK Paths
    { slug: ["flutter"] },
    { slug: ["flutter", "installation"] },
    { slug: ["flutter", "configuration"] },
    { slug: ["flutter", "widgets", "try-on-viewer"] },
    { slug: ["flutter", "examples"] },

    // iOS SDK Paths
    { slug: ["ios"] },
    { slug: ["ios", "installation"] },
    { slug: ["ios", "controller"] },
    { slug: ["ios", "examples"] },

    // Android SDK Paths
    { slug: ["android"] },
    { slug: ["android", "installation"] },
    { slug: ["android", "activity"] },
    { slug: ["android", "examples"] }
  ];
}

// Helper to get structured SEO metadata dynamically based on slug configuration
function getSeoMetadata(slug: string[]): { title: string; description: string; canonical: string } {
  let category = "api";
  let subSlug = slug;

  if (slug.length > 0) {
    if (["api", "flutter", "ios", "android", "npm"].includes(slug[0])) {
      category = slug[0];
      subSlug = slug.slice(1);
    } else {
      // Backward-compatible raw path (e.g. ["authentication"] -> api category)
      category = "api";
      subSlug = slug;
    }
  }

  let title = "Virtual Try-On VTON API & SDK Documentation | Snapmydesign";
  let description = "Welcome to the official Snapmydesign VTON API reference. Integrate state-of-the-art AI-powered virtual try-on models into your e-commerce and mobile applications.";

  if (category === "api") {
    if (subSlug.length === 0) {
      title = "Virtual Try-On VTON API & SDK Documentation | Snapmydesign";
      description = "Welcome to the official Snapmydesign VTON API reference. Integrate state-of-the-art AI-powered virtual try-on models into your e-commerce and mobile applications.";
    } else if (subSlug.length === 1) {
      const page = subSlug[0];
      if (page === "authentication") {
        title = "API Authentication & X-API-Key Headers | Snapmydesign VTON Docs";
        description = "Securely authenticate your VTON API requests. Learn how to obtain and pass your X-API-Key headers for client/server communications.";
      } else if (page === "workflow") {
        title = "Virtual Try-On API Integration Workflow | Snapmydesign VTON Docs";
        description = "A step-by-step developer integration workflow for the virtual try-on API. Learn how to upload files, run rendering processes, and query outputs.";
      } else if (page === "credit-matrix") {
        title = "AI VTON Model Types & Credit Pricing Matrix | Snapmydesign VTON Docs";
        description = "Compare credit pricing and processing speeds across different virtual try-on rendering engine layers, from Fast to Premium Quality.";
      } else if (page === "errors") {
        title = "API Error Handling, Codes, & Exception Resolution | Snapmydesign VTON Docs";
        description = "Complete index of VTON API response status codes, exceptions, validation details, and recommended developer resolutions.";
      } else if (page === "examples") {
        title = "VTON Integration Code Examples & Scripts | Snapmydesign VTON Docs";
        description = "Kickstart your integration with ready-to-use virtual try-on code snippets in cURL, Python requests, and Axios/Node.js.";
      }
    } else if (subSlug.length === 2 && subSlug[0] === "endpoints") {
      const endpointId = subSlug[1];
      const endpoint = ENDPOINTS.find((e) => e.id === endpointId);
      if (endpoint) {
        title = `${endpoint.title} (${endpoint.method} ${endpoint.path}) | Snapmydesign API Reference`;
        description = endpoint.description;
      }
    }
  } else if (category === "npm") {
    if (subSlug.length === 0) {
      title = "NPM JavaScript/TypeScript SDK for Virtual Try-On | Snapmydesign Docs";
      description = "Official JavaScript/TypeScript SDK for the Snapmydesign Virtual Try-On API with Node.js and browser support.";
    } else if (subSlug.length === 1) {
      const page = subSlug[0];
      if (page === "installation") {
        title = "NPM SDK Installation & Client Setup | Snapmydesign VTON Docs";
        description = "Install the snapit_sdk package and configure the VTONClient with developer credentials or environment variables.";
      } else if (page === "client-reference") {
        title = "VTONClient SDK API Reference | Snapmydesign VTON Docs";
        description = "Detailed API reference for VTONClient methods including health check, image upload, try-on generation, and credit checks.";
      } else if (page === "errors") {
        title = "NPM SDK Custom Error Classes & Exceptions | Snapmydesign VTON Docs";
        description = "Understand custom exception classes, HTTP status mapping, and credit depletion errors in the snapit_sdk NPM package.";
      } else if (page === "examples") {
        title = "NPM SDK Full Integration Examples | Snapmydesign VTON Docs";
        description = "Step-by-step runnable example code showing end-to-end VTON generation in Node.js and TypeScript.";
      }
    }
  } else if (category === "flutter") {
    if (subSlug.length === 0) {
      title = "Flutter SDK Integration for Virtual Try-On | Snapmydesign Docs";
      description = "Learn how to embed native virtual try-on components inside cross-platform Flutter mobile applications.";
    } else if (subSlug.length === 1) {
      const page = subSlug[0];
      if (page === "installation") {
        title = "Flutter SDK Installation Guide (pub.dev) | Snapmydesign VTON Docs";
        description = "Install the snapit_sdk Flutter package into your app. Setup instructions for pubspec.yaml dependencies.";
      } else if (page === "configuration") {
        title = "Flutter SDK API Client & Custom Styling Setup | Snapmydesign VTON Docs";
        description = "Configure API client credentials and build custom app theme configurations using SnapITTheme properties.";
      } else if (page === "examples") {
        title = "Full Flutter App Try-On Flow Examples | Snapmydesign VTON Docs";
        description = "Explore clean stateful widget implementation examples for integrating low-level API client commands in Flutter.";
      }
    } else if (subSlug.length === 2 && subSlug[0] === "widgets") {
      const widgetId = subSlug[1];
      if (widgetId === "try-on-viewer") {
        title = "Launch Try-On Flow Widget & Customization | Flutter SDK Docs";
        description = "Incorporate the complete virtual try-on UI flow. Automatically handle gallery permission, uploads, and visual comparisons.";
      }
    }
  } else if (category === "ios") {
    if (subSlug.length === 0) {
      title = "Native iOS Swift SDK for Virtual Try-On | Snapmydesign Docs";
      description = "Integrate native iOS virtual try-on features. Setup Swift network clients and UI components optimized for SwiftUI and UIKit.";
    } else if (subSlug.length === 1) {
      const page = subSlug[0];
      if (page === "installation") {
        title = "iOS SDK Installation via CocoaPods & SPM | Snapmydesign VTON Docs";
        description = "Add the SnapIt SDK to your Apple projects using CocoaPods or Swift Package Manager (SPM).";
      } else if (page === "controller") {
        title = "VTONViewController UIKit Usage Reference | iOS SDK Docs";
        description = "Learn how to instantiate and present the native VTONViewController for seamless try-on integrations inside UIKit.";
      } else if (page === "examples") {
        title = "SwiftUI Virtual Try-On Page Integration Example | iOS SDK Docs";
        description = "Copy-pasteable SwiftUI View definitions showing sheet triggers, button events, and view states.";
      }
    }
  } else if (category === "android") {
    if (subSlug.length === 0) {
      title = "Native Android Kotlin SDK for Virtual Try-On | Snapmydesign Docs";
      description = "Integrate virtual try-on pipelines directly inside native Android applications using Kotlin and Jetpack Compose.";
    } else if (subSlug.length === 1) {
      const page = subSlug[0];
      if (page === "installation") {
        title = "Android SDK Gradle Installation Guide | Snapmydesign VTON Docs";
        description = "Step-by-step documentation on adding the SnapIt SDK dependency to build.gradle for Android Studio projects.";
      } else if (page === "activity") {
        title = "VtonActivity Native Intent Launch Guide | Android SDK Docs";
        description = "Configure and invoke VtonActivity using native Intents and Activity result listeners for JVM apps.";
      } else if (page === "examples") {
        title = "Android Jetpack Compose TryOnWidget Integration Example | Android SDK Docs";
        description = "Setup custom composable functions and handle success/failure callbacks dynamically inside Android layouts.";
      }
    }
  }

  // Canonical path calculation (ensuring correct trailing slashes)
  let canonical = "/docs/api/";
  if (category === "api") {
    if (subSlug.length === 0) {
      canonical = "/docs/api/";
    } else if (subSlug.length === 1) {
      canonical = `/docs/api/${subSlug[0]}/`;
    } else if (subSlug.length === 2 && subSlug[0] === "endpoints") {
      canonical = `/docs/api/endpoints/${subSlug[1]}/`;
    }
  } else {
    if (subSlug.length === 0) {
      canonical = `/docs/${category}/`;
    } else if (subSlug.length === 1) {
      canonical = `/docs/${category}/${subSlug[0]}/`;
    } else if (subSlug.length === 2) {
      canonical = `/docs/${category}/${subSlug[0]}/${subSlug[1]}/`;
    }
  }

  return { title, description, canonical };
}

// Helper to generate dynamic JSON-LD structured schemas based on page category and type
function generateJsonLd(slug: string[], title: string, description: string, canonicalUrl: string) {
  let category = "api";
  let subSlug = slug;

  if (slug.length > 0) {
    if (["api", "flutter", "ios", "android", "npm"].includes(slug[0])) {
      category = slug[0];
      subSlug = slug.slice(1);
    } else {
      category = "api";
      subSlug = slug;
    }
  }

  // Base breadcrumbs (Home is always the API/Docs introduction page)
  const baseBreadcrumbs = [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Docs Home",
      "item": "https://docs.snapmydesign.com/docs/api/"
    }
  ];

  if (category !== "api") {
    const categoryName = category === "npm" ? "NPM SDK" : category.charAt(0).toUpperCase() + category.slice(1) + " SDK";
    baseBreadcrumbs.push({
      "@type": "ListItem",
      "position": 2,
      "name": categoryName,
      "item": `https://docs.snapmydesign.com/docs/${category}/`
    });
    if (subSlug.length > 0) {
      const subName = subSlug[0].charAt(0).toUpperCase() + subSlug[0].slice(1);
      baseBreadcrumbs.push({
        "@type": "ListItem",
        "position": 3,
        "name": subName,
        "item": `https://docs.snapmydesign.com/docs/${category}/${subSlug[0]}/`
      });
      if (subSlug.length > 1) {
        const leafName = subSlug[1].charAt(0).toUpperCase() + subSlug[1].slice(1);
        baseBreadcrumbs.push({
          "@type": "ListItem",
          "position": 4,
          "name": leafName,
          "item": `https://docs.snapmydesign.com/docs/${category}/${subSlug[0]}/${subSlug[1]}/`
        });
      }
    }
  } else {
    // API category breadcrumbs
    if (subSlug.length > 0) {
      if (subSlug[0] === "endpoints" && subSlug.length > 1) {
        baseBreadcrumbs.push({
          "@type": "ListItem",
          "position": 2,
          "name": "Endpoints",
          "item": "https://docs.snapmydesign.com/docs/api/endpoints/upload/"
        });
        const endpoint = ENDPOINTS.find((e) => e.id === subSlug[1]);
        const name = endpoint ? endpoint.title : subSlug[1];
        baseBreadcrumbs.push({
          "@type": "ListItem",
          "position": 3,
          "name": name,
          "item": `https://docs.snapmydesign.com/docs/api/endpoints/${subSlug[1]}/`
        });
      } else {
        const subName = subSlug[0].charAt(0).toUpperCase() + subSlug[0].slice(1);
        baseBreadcrumbs.push({
          "@type": "ListItem",
          "position": 2,
          "name": subName,
          "item": `https://docs.snapmydesign.com/docs/api/${subSlug[0]}/`
        });
      }
    }
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": baseBreadcrumbs
  };

  // Specific article/web API/source code schemas
  let mainSchema: any = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": title,
    "description": description,
    "url": canonicalUrl,
    "inLanguage": "en",
    "publisher": {
      "@type": "Organization",
      "name": "Snapmydesign",
      "logo": {
        "@type": "ImageObject",
        "url": "https://sdk.snapmydesign.com/logo-1225.webp"
      }
    },
    "author": {
      "@type": "Organization",
      "name": "Snapmydesign"
    },
    "mainEntityOfPage": canonicalUrl
  };

  if (category === "api" && subSlug.length === 2 && subSlug[0] === "endpoints") {
    const endpointId = subSlug[1];
    const endpoint = ENDPOINTS.find((e) => e.id === endpointId);
    if (endpoint) {
      mainSchema = {
        "@context": "https://schema.org",
        "@type": "WebApi",
        "name": endpoint.title,
        "description": endpoint.description,
        "url": canonicalUrl,
        "publisher": {
          "@type": "Organization",
          "name": "Snapmydesign"
        },
        "documentation": canonicalUrl
      };
    }
  } else if (["flutter", "ios", "android", "npm"].includes(category) && subSlug.includes("examples")) {
    mainSchema = {
      "@context": "https://schema.org",
      "@type": "SoftwareSourceCode",
      "name": title,
      "description": description,
      "codeSampleType": "full app integration snippet",
      "programmingLanguage": category === "npm" ? "JavaScript/TypeScript" : category === "flutter" ? "Dart" : category === "ios" ? "Swift" : "Kotlin",
      "runtimePlatform": category === "npm" ? "Node.js / Browser" : category === "flutter" ? "Flutter" : category === "ios" ? "iOS" : "Android",
      "author": {
        "@type": "Organization",
        "name": "Snapmydesign"
      }
    };
  }

  return [breadcrumbSchema, mainSchema];
}

// SEO Dynamic Metadata Generation
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug || [];
  const { title, description, canonical } = getSeoMetadata(slug);
  const canonicalUrl = `https://docs.snapmydesign.com${canonical}`;

  return {
    title,
    description,
    keywords: ["VTON API", "Virtual Try-On", "Snapmydesign", "Flutter SDK", "iOS SDK", "Android SDK", "Fashion AI", "Try-on SDK", "API Documentation"],
    authors: [{ name: "Snapmydesign Team" }],
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
      siteName: "Snapmydesign VTON SDK & API Reference"
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://sdk.snapmydesign.com/logo-1225.webp"],
    }
  };
}

const PAGINATION_MAP: Record<string, { title: string; href: string }[]> = {
  api: [
    { title: "Introduction", href: "/docs/api" },
    { title: "Authentication", href: "/docs/api/authentication" },
    { title: "Integration Workflow", href: "/docs/api/workflow" },
    { title: "Upload VTON Images", href: "/docs/api/endpoints/upload" },
    { title: "Generate Try-On", href: "/docs/api/endpoints/generate" },
    { title: "Check Credits", href: "/docs/api/endpoints/credits" },
    { title: "Get History", href: "/docs/api/endpoints/history" },
    { title: "Service Health Check", href: "/docs/api/endpoints/health-check" },
    { title: "Model & Credit Matrix", href: "/docs/api/credit-matrix" },
    { title: "Error Handling", href: "/docs/api/errors" },
    { title: "Code Examples", href: "/docs/api/examples" },
  ],
  npm: [
    { title: "Introduction", href: "/docs/npm" },
    { title: "Installation & Setup", href: "/docs/npm/installation" },
    { title: "Client API Reference", href: "/docs/npm/client-reference" },
    { title: "Error Handling", href: "/docs/npm/errors" },
    { title: "Full Integration Flow", href: "/docs/npm/examples" },
  ],
  flutter: [
    { title: "Introduction", href: "/docs/flutter" },
    { title: "Installation", href: "/docs/flutter/installation" },
    { title: "Configuration", href: "/docs/flutter/configuration" },
    { title: "Try-On Flow Widget", href: "/docs/flutter/widgets/try-on-viewer" },
    { title: "Full App Example", href: "/docs/flutter/examples" },
  ],
  ios: [
    { title: "Introduction", href: "/docs/ios" },
    { title: "Installation", href: "/docs/ios/installation" },
    { title: "SwiftUI Integration", href: "/docs/ios/examples" },
  ],
  android: [
    { title: "Introduction", href: "/docs/android" },
    { title: "Installation", href: "/docs/android/installation" },
    { title: "Kotlin Integration", href: "/docs/android/examples" },
  ],
};

function renderPagination(prevPage: { title: string; href: string } | null, nextPage: { title: string; href: string } | null) {
  if (!prevPage && !nextPage) return null;
  return (
    <div key="doc-pagination" className="doc-pagination-container">
      {prevPage ? (
        <Link href={prevPage.href} className="doc-pagination-link prev">
          <span className="pagination-label">← Previous</span>
          <span className="pagination-title">{prevPage.title}</span>
        </Link>
      ) : (
        <div className="doc-pagination-spacer" />
      )}
      {nextPage ? (
        <Link href={nextPage.href} className="doc-pagination-link next">
          <span className="pagination-label">Next →</span>
          <span className="pagination-title">{nextPage.title}</span>
        </Link>
      ) : (
        <div className="doc-pagination-spacer" />
      )}
    </div>
  );
}

function injectPagination(content: React.ReactNode, prevPage: any, nextPage: any): React.ReactNode {
  if (!React.isValidElement(content)) return content;

  const childrenArray = React.Children.toArray(content.props.children);
  const updatedChildren = childrenArray.map((child) => {
    if (React.isValidElement(child) && child.props.className === "content-wrapper") {
      return React.cloneElement(child, {
        ...child.props,
        children: [
          ...React.Children.toArray(child.props.children),
          renderPagination(prevPage, nextPage)
        ]
      } as any);
    }
    return child;
  });

  return React.cloneElement(content, {
    ...content.props,
    children: updatedChildren
  } as any);
}

export default async function DocsPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug || [];

  // Determine category and sub-path
  let category = "api";
  let subSlug = slug;

  if (slug.length > 0) {
    if (["api", "flutter", "ios", "android", "npm"].includes(slug[0])) {
      category = slug[0];
      subSlug = slug.slice(1);
    }
  }

  let content: React.ReactNode = null;

  // Handle empty sub-path introduction pages
  if (subSlug.length === 0) {
    if (category === "api") content = renderIntro();
    else if (category === "npm") content = renderNpmIntro();
    else if (category === "flutter") content = renderFlutterIntro();
    else if (category === "ios") content = renderIosIntro();
    else if (category === "android") content = renderAndroidIntro();
  } else if (category === "npm") {
    if (subSlug.length === 1) {
      const page = subSlug[0];
      if (page === "installation") content = renderNpmInstallation();
      else if (page === "client-reference") content = renderNpmClientReference();
      else if (page === "errors") content = renderNpmErrors();
      else if (page === "examples") content = renderNpmExamples();
    }
  } else if (category === "api") {
    // Handle sub-pages
    if (subSlug.length === 1) {
      const page = subSlug[0];
      if (page === "authentication") content = renderAuthentication();
      else if (page === "workflow") content = renderWorkflow();
      else if (page === "credit-matrix") content = renderCreditMatrix();
      else if (page === "errors") content = renderErrors();
      else if (page === "examples") content = renderExamples();
    } else if (subSlug.length === 2 && subSlug[0] === "endpoints") {
      const endpointId = subSlug[1];
      const endpoint = ENDPOINTS.find((e) => e.id === endpointId);
      if (endpoint) {
        content = renderEndpoint(endpoint);
      }
    }
  } else if (category === "flutter") {
    if (subSlug.length === 1) {
      const page = subSlug[0];
      if (page === "installation") content = renderFlutterInstallation();
      else if (page === "configuration") content = renderFlutterConfiguration();
      else if (page === "examples") content = renderFlutterExamples();
    } else if (subSlug.length === 2 && subSlug[0] === "widgets") {
      const widgetId = subSlug[1];
      if (widgetId === "try-on-viewer") content = renderFlutterTryOnViewer();
    }
  } else if (category === "ios") {
    if (subSlug.length === 1) {
      const page = subSlug[0];
      if (page === "installation") content = renderIosInstallation();
      else if (page === "controller") content = renderIosController();
      else if (page === "examples") content = renderIosExamples();
    }
  } else if (category === "android") {
    if (subSlug.length === 1) {
      const page = subSlug[0];
      if (page === "installation") content = renderAndroidInstallation();
      else if (page === "activity") content = renderAndroidActivity();
      else if (page === "examples") content = renderAndroidExamples();
    }
  }

  if (!content) {
    return notFound();
  }

  // Generate metadata details and schemas
  const { title, description, canonical } = getSeoMetadata(slug);
  const canonicalUrl = `https://docs.snapmydesign.com${canonical}`;
  const schemas = generateJsonLd(slug, title, description, canonicalUrl);

  // Find previous and next pages based on sidebar order
  const currentPath = slug.length > 0 ? "/docs/" + slug.join("/") : "/docs/" + category;
  const pages = PAGINATION_MAP[category] || [];
  const currentIndex = pages.findIndex((p) => p.href === currentPath);
  const prevPage = currentIndex > 0 ? pages[currentIndex - 1] : null;
  const nextPage = currentIndex < pages.length - 1 ? pages[currentIndex + 1] : null;

  return (
    <>
      {schemas.map((schema, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      {injectPagination(content, prevPage, nextPage)}
    </>
  );
}

// 1. Render Introduction
function renderIntro() {
  return (
    <div className="main-layout" style={{ gridTemplateColumns: "1fr" }}>
      <div className="content-wrapper">
        <section className="doc-section">
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "4px 10px", borderRadius: 20, backgroundColor: "rgba(0, 242, 254, 0.08)", border: "1px solid rgba(0, 242, 254, 0.2)", fontSize: "0.75rem", color: "hsl(var(--accent-cyan))", fontWeight: 700, marginBottom: 16 }}>
            <Sparkles size={12} />
            AI-POWERED VIRTUAL TRY-ON
          </div>

          <h1 className="doc-title">Snapmydesign (SMD) VTON API Documentation</h1>

          <p className="doc-subtitle">
            Welcome to the <strong>Snapmydesign (SMD) Virtual Try-On (VTON) API Reference</strong>.
            This documentation is designed to guide developers and enterprise partners through
            integrating our virtual try-on services into their own applications, e-commerce storefronts,
            and pipelines.
          </p>

          <p className="doc-p">
            Our VTON API allows you to upload photos of models/customers and garments, and generate
            highly realistic try-on results powered by cutting-edge AI models (including FLUX and Pruna AI)
            running on premium distributed clusters. To learn more about our visual catalogue platforms and visual AI services, visit our main website at <a href="https://sdk.snapmydesign.com" target="_blank" rel="noopener noreferrer" style={{ color: "hsl(var(--accent-cyan))", textDecoration: "underline" }}>sdk.snapmydesign.com</a>.
          </p>

          <h2 className="doc-h2"><BookOpen size={20} className="text-cyan" /> Quick Reference</h2>
          <p className="doc-p">
            Below are the core service parameters required to integrate with the VTON engine.
          </p>

          <div className="table-container">
            <table className="doc-table">
              <thead>
                <tr>
                  <th>Detail</th>
                  <th>Value</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="doc-strong">Developer Console</td>
                  <td><a href="https://console.snapmydesign.com" target="_blank" rel="noopener noreferrer" className="text-cyan">console.snapmydesign.com</a></td>
                  <td>Generate API keys and manage subscriptions.</td>
                </tr>
                <tr>
                  <td className="doc-strong">API Base URL</td>
                  <td><code className="path-text">{QUICK_REFERENCE.baseUrl}</code></td>
                  <td>All endpoints prefix with this root url.</td>
                </tr>
                <tr>
                  <td className="doc-strong">Authentication</td>
                  <td><code>{QUICK_REFERENCE.authHeader}</code></td>
                  <td>Required custom header for request validation.</td>
                </tr>
                <tr>
                  <td className="doc-strong">Support Email</td>
                  <td><a href={`mailto:${QUICK_REFERENCE.supportEmail}`} className="text-cyan">{QUICK_REFERENCE.supportEmail}</a></td>
                  <td>Available for account inquiries & technical help.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="doc-h2"><Sparkles size={20} className="text-indigo" /> Key Core Features</h2>
          <ul className="doc-list">
            <li><strong>Flexible Model Speeds:</strong> Choose between fast (FAL Klein 4B), medium (FAL Klein 9B), and quality (Pruna AI) layers depending on budget and latency needs.</li>
            <li><strong>Asynchronous Speed:</strong> Under-the-hood worker scheduling wrapped in a synchronous request structure that returns completed graphics in 3-5 seconds.</li>
            <li><strong>Intelligent Auto-Prompts:</strong> Leave prompts empty and the backend automatically describes the layout context.</li>
            <li><strong>Skus & Metrics:</strong> Track product catalog performance and conversion rates with internal tracking parameters.</li>
          </ul>

          <div className="alert-box tip">
            <CheckCircle2 />
            <div>
              <div className="alert-title">Ready to Start?</div>
              Browse through the sidebar. We recommend starting with <a href="/docs/authentication" className="text-cyan doc-strong">Authentication</a> and setting up your developer keys.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

// 2. Render Authentication
function renderAuthentication() {
  return (
    <div className="main-layout" style={{ gridTemplateColumns: "1fr" }}>
      <div className="content-wrapper">
        <section className="doc-section">
          <h1 className="doc-title" style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>
            <Lock className="text-cyan" size={32} /> Authentication
          </h1>
          <p className="doc-subtitle">
            All request categories that process uploads or trigger generations must authenticate using a private API key.
          </p>

          <p className="doc-p">
            To authorize your request, include the following custom header in your HTTP payloads:
          </p>

          <p className="doc-p">
            You can generate, retrieve, and manage your API keys inside the <a href="https://console.snapmydesign.com" target="_blank" rel="noopener noreferrer" style={{ color: "hsl(var(--accent-cyan))", textDecoration: "underline" }}>SnapIt Developer Console (console.snapmydesign.com)</a>.
          </p>

          <div className="code-panel" style={{ margin: "24px 0" }}>
            <div className="code-tabs">
              <span className="code-tab active">Required Header</span>
            </div>
            <div className="code-content-wrapper">
              <pre className="code-block">
                <code>X-API-Key: smd_live_your_api_key_here</code>
              </pre>
            </div>
          </div>

          <div className="alert-box important">
            <ShieldAlert />
            <div>
              <div className="alert-title">Security Notice</div>
              Keep your API key secure. Do not share it publicly or expose it in client-side code (browsers/mobile apps). Always route API calls through your backend service to keep the API key safe.
            </div>
          </div>

          <h2 className="doc-h2"><Key size={20} className="text-purple" /> Authenticated Request Example</h2>
          <p className="doc-p">
            Here is a typical cURL request demonstrating where to insert the header token:
          </p>

          <div className="code-panel">
            <div className="code-tabs">
              <span className="code-tab active">cURL Header Template</span>
            </div>
            <div className="code-content-wrapper">
              <pre className="code-block">
                <code>{`curl -X POST "https://apisdk.snapmydesign.com/api/v1/vton/generate" \\
  -H "X-API-Key: smd_live_your_api_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model_name": "medium",
    "inputClothesImageUrls": ["https://assets.url/..."]
  }'`}</code>
              </pre>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

// 3. Render Workflow
function renderWorkflow() {
  return (
    <div className="main-layout" style={{ gridTemplateColumns: "1fr" }}>
      <div className="content-wrapper">
        <section className="doc-section">
          <h1 className="doc-title" style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>
            <GitCompare className="text-cyan" size={32} /> Integration Workflow
          </h1>
          <p className="doc-subtitle">
            The typical API integration follows a three-step cycle: Upload assets, Trigger AI generation, and Audit results.
          </p>

          <p className="doc-p">
            Interact with our workflow visualizer below to see what payloads are exchanged between your servers and our cloud nodes.
          </p>

          <SequenceDiagram />
        </section>
      </div>
    </div>
  );
}

// 4. Render Credit Matrix
function renderCreditMatrix() {
  return (
    <div className="main-layout" style={{ gridTemplateColumns: "1fr" }}>
      <div className="content-wrapper">
        <section className="doc-section">
          <h1 className="doc-title">📊 VTON Model & Credit Matrix</h1>
          <p className="doc-subtitle">
            Billed usage is based on Credits. Each virtual try-on execution deducts credits depending on the version and model type chosen in the request.
          </p>

          <p className="doc-p">
            Review the breakdown table below, or input variables in our interactive calculator to forecast monthly billing.
          </p>

          <div className="table-container">
            <table className="doc-table">
              <thead>
                <tr>
                  <th>Version</th>
                  <th>Model Name</th>
                  <th>Credit Cost</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {MODEL_MATRIX.map((m, idx) => (
                  <tr key={idx}>
                    <td><strong className="text-indigo">{m.version}</strong></td>
                    <td><code className="path-text">{m.modelName}</code></td>
                    <td><strong className="text-cyan">{m.creditCost.toFixed(2)}</strong></td>
                    <td>{m.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <CreditCalculator />
        </section>
      </div>
    </div>
  );
}

// 5. Render Endpoint Reference
function renderEndpoint(endpoint: {
  id: string;
  title: string;
  method: "GET" | "POST";
  path: string;
  contentType?: string;
  authRequired: boolean;
  description: string;
  parameters: any[];
  tip?: string;
  responseJson: string;
  codeSnippets: any;
}) {
  return (
    <div className="main-layout">
      {/* Middle Column (Docs) */}
      <div className="content-wrapper" style={{ padding: "40px 48px" }}>
        <section className="doc-section">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <span className={`method-badge ${endpoint.method.toLowerCase()}`}>{endpoint.method}</span>
            <span className="path-text" style={{ fontSize: "1.1rem" }}>{endpoint.path}</span>
          </div>

          <h1 className="doc-title" style={{ fontSize: "2rem" }}>{endpoint.title}</h1>
          <p className="doc-subtitle" style={{ fontSize: "1rem", marginBottom: 24 }}>{endpoint.description}</p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, fontSize: "0.8rem", color: "hsl(var(--text-muted))", borderBottom: "1px solid hsl(var(--border-color))", paddingBottom: 16, marginBottom: 24 }}>
            <div>Authentication: <span className="doc-strong">{endpoint.authRequired ? "Required (X-API-Key)" : "None"}</span></div>
            {endpoint.contentType && (
              <div>Content-Type: <code className="doc-strong">{endpoint.contentType}</code></div>
            )}
          </div>

          <h3 className="doc-h3">Request Parameters</h3>
          {endpoint.parameters.length === 0 ? (
            <p className="doc-p" style={{ fontStyle: "italic" }}>No request parameters required.</p>
          ) : (
            <div className="table-container">
              <table className="doc-table">
                <thead>
                  <tr>
                    <th>Field</th>
                    <th>Type</th>
                    <th>Required</th>
                    <th>Default</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {endpoint.parameters.map((param, idx) => (
                    <tr key={idx}>
                      <td className="param-name">{param.name}</td>
                      <td className="param-type">{param.type}</td>
                      <td>
                        <span className={`param-req ${param.required ? "yes" : "no"}`}>
                          {param.required ? "Yes" : "No"}
                        </span>
                      </td>
                      <td>
                        <code style={{ fontSize: "0.75rem", opacity: param.default ? 1 : 0.4 }}>
                          {param.default || "—"}
                        </code>
                      </td>
                      <td>{param.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {endpoint.tip && (
            <div className="alert-box tip">
              <Sparkles />
              <div>
                <div className="alert-title">Pro Tip</div>
                {endpoint.tip}
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Right Column (Playground) */}
      <ApiPlayground endpoint={endpoint} />
    </div>
  );
}

// 6. Render Errors
function renderErrors() {
  return (
    <div className="main-layout" style={{ gridTemplateColumns: "1fr" }}>
      <div className="content-wrapper">
        <section className="doc-section">
          <h1 className="doc-title">⚠️ Error Handling & Exceptions</h1>
          <p className="doc-subtitle">
            Our API returns structured errors whenever validation fails, credits are depleted, or credentials are invalid.
          </p>

          <h2 className="doc-h2"><ShieldAlert size={20} className="text-orange" /> Standard Error Response</h2>
          <p className="doc-p">
            Errors are returned in JSON format. The response body includes a status boolean, the HTTP status code, a descriptive message, and detail information to aid troubleshooting.
          </p>

          <div className="code-panel" style={{ margin: "24px 0" }}>
            <div className="code-tabs">
              <span className="code-tab active">Standard Error JSON Schema</span>
            </div>
            <div className="code-content-wrapper">
              <pre className="code-block">
                <code>{STANDARD_ERROR_JSON}</code>
              </pre>
            </div>
          </div>

          <h2 className="doc-h2"><Activity size={20} className="text-cyan" /> Response Status Codes</h2>
          <p className="doc-p">
            The VTON service maps execution failures to semantic HTTP status codes.
          </p>

          <div className="table-container">
            <table className="doc-table">
              <thead>
                <tr>
                  <th>HTTP Status</th>
                  <th>Exception Class</th>
                  <th>Description</th>
                  <th>Recommended Resolution</th>
                </tr>
              </thead>
              <tbody>
                {ERROR_CODES.map((err, idx) => (
                  <tr key={idx}>
                    <td><strong className="text-orange">{err.status}</strong></td>
                    <td className="doc-strong">{err.className}</td>
                    <td>{err.description}</td>
                    <td><span className="text-cyan">{err.resolution}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

// 7. Render Examples
function renderExamples() {
  return (
    <div className="main-layout" style={{ gridTemplateColumns: "1fr" }}>
      <div className="content-wrapper">
        <section className="doc-section">
          <h1 className="doc-title">💻 Integration Code Examples</h1>
          <p className="doc-subtitle">
            Below are fully functioning examples to help you integrate SMD VTON into your software environment.
          </p>

          <p className="doc-p">
            Ensure your files (e.g. <code>tshirt.png</code>) are present in the same local directory where you run the scripts.
          </p>

          <h2 className="doc-h2"><Copy size={20} className="text-cyan" /> Integration Scripts</h2>

          <div className="code-tabs" style={{ marginTop: 24, display: "inline-flex", borderRadius: "8px 8px 0 0", overflow: "hidden", border: "1px solid hsl(var(--border-color))", borderBottom: "none" }}>
            <span className="code-tab active">Full Flow Guides</span>
          </div>

          <div className="calc-container" style={{ marginTop: 0, borderRadius: "0 0 12px 12px" }}>
            <p className="doc-p">
              The examples demonstrate how to:
            </p>
            <ul className="doc-list" style={{ marginBottom: 0 }}>
              <li>Authenticate headers using your private developer credentials.</li>
              <li>Perform a multipart file upload to obtain permanent Google Storage assets.</li>
              <li>Dispatch the assets as inputs to the try-on generation renderer.</li>
              <li>Handle synchronous request-response JSON data and extract output URLs.</li>
            </ul>
          </div>

          <p className="doc-p" style={{ marginTop: 28 }}>
            Browse individual endpoint sections in the left sidebar to access specific copy-paste code snippets for cURL, Python, and Node.js.
          </p>
        </section>
      </div>
    </div>
  );
}

/* ==========================================================================
   FLUTTER SDK DOC RENDERS
   ========================================================================== */

function renderFlutterIntro() {
  return (
    <div className="main-layout" style={{ gridTemplateColumns: "1fr" }}>
      <div className="content-wrapper">
        <section className="doc-section">
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "4px 10px", borderRadius: 20, backgroundColor: "rgba(0, 242, 254, 0.08)", border: "1px solid rgba(0, 242, 254, 0.2)", fontSize: "0.75rem", color: "hsl(var(--accent-cyan))", fontWeight: 700, marginBottom: 16 }}>
            <Sparkles size={12} />
            CROSS-PLATFORM MOBILE VTON
          </div>
          <h1 className="doc-title">Flutter VTON SDK</h1>
          <p className="doc-subtitle">
            The SnapIt Flutter SDK allows developers to easily embed native AI virtual try-on widgets into Android and iOS mobile apps.
          </p>
          <p className="doc-p">
            Our Flutter package wraps the underlying Snapmydesign VTON endpoints into direct, reactive widget interfaces and services. Key features include:
          </p>
          <ul className="doc-list">
            <li><strong>Optimized Uploads:</strong> Automatic EXIF orientation correction and pre-upload image compression.</li>
            <li><strong>Built-in UI Widgets:</strong> Interactive Before-After comparison slider and customizable try-on selectors.</li>
            <li><strong>State & Credit Management:</strong> Easily track credit utilization and query history with robust error boundary handling.</li>
          </ul>

          <h2 className="doc-h2"><BookOpen size={20} className="text-cyan" /> Official Resources</h2>
          <div className="table-container">
            <table className="doc-table">
              <thead>
                <tr>
                  <th>Resource</th>
                  <th>Link</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="doc-strong">Pub.dev Registry</td>
                  <td><a href="https://pub.dev/packages/snapit_sdk" target="_blank" rel="noopener noreferrer" className="text-cyan">pub.dev/packages/snapit_sdk</a></td>
                  <td>Official SDK package on pub.dev.</td>
                </tr>
                <tr>
                  <td className="doc-strong">Official Website</td>
                  <td><a href="https://sdk.snapmydesign.com" target="_blank" rel="noopener noreferrer" className="text-cyan">sdk.snapmydesign.com</a></td>
                  <td>Explore SMD visual AI features and capabilities.</td>
                </tr>
                <tr>
                  <td className="doc-strong">Developer Console</td>
                  <td><a href="https://console.snapmydesign.com" target="_blank" rel="noopener noreferrer" className="text-cyan">console.snapmydesign.com</a></td>
                  <td>Generate API keys and manage subscriptions.</td>
                </tr>
                <tr>
                  <td className="doc-strong">Documentation Portal</td>
                  <td><a href="https://docs.snapmydesign.com" target="_blank" rel="noopener noreferrer" className="text-cyan">docs.snapmydesign.com</a></td>
                  <td>Complete guide to API features and parameters.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="alert-box tip">
            <CheckCircle2 />
            <div>
              <div className="alert-title">Get Started</div>
              Install the Flutter package and start building! Check out the <a href="/docs/flutter/installation" className="text-cyan doc-strong">Installation Guide</a>.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function renderFlutterInstallation() {
  return (
    <div className="main-layout" style={{ gridTemplateColumns: "1fr" }}>
      <div className="content-wrapper">
        <section className="doc-section">
          <h1 className="doc-title">Flutter SDK Installation</h1>
          <p className="doc-subtitle">Include the SnapIt SDK dependency inside your mobile projects from pub.dev.</p>

          <p className="doc-p">
            You can install the official package directly from{" "}
            <a href="https://pub.dev/packages/snapit_sdk" target="_blank" rel="noopener noreferrer" className="text-cyan doc-strong">
              pub.dev/packages/snapit_sdk
            </a>.
          </p>

          <h2 className="doc-h2">Method 1: Using Flutter CLI (Recommended)</h2>
          <p className="doc-p">Run the following command in your Flutter project root:</p>
          <div className="code-panel" style={{ margin: "16px 0 24px" }}>
            <pre className="code-block">
              <code>flutter pub add snapit_sdk</code>
            </pre>
          </div>

          <h2 className="doc-h2">Method 2: Manual Installation</h2>
          <p className="doc-p">Add the library to your project’s <code>pubspec.yaml</code> file under dependencies:</p>

          <div className="code-panel" style={{ margin: "16px 0 24px" }}>
            <div className="code-tabs">
              <span className="code-tab active">pubspec.yaml</span>
            </div>
            <div className="code-content-wrapper">
              <pre className="code-block">
                <code>{`dependencies:
  flutter:
    sdk: flutter
  snapit_sdk: ^1.0.0`}</code>
              </pre>
            </div>
          </div>

          <p className="doc-p">Then fetch the dependencies in your terminal:</p>
          <div className="code-panel">
            <pre className="code-block">
              <code>flutter pub get</code>
            </pre>
          </div>
        </section>
      </div>
    </div>
  );
}

function renderFlutterConfiguration() {
  return (
    <div className="main-layout" style={{ gridTemplateColumns: "1fr" }}>
      <div className="content-wrapper">
        <section className="doc-section">
          <h1 className="doc-title">Flutter SDK Configuration</h1>
          <p className="doc-subtitle">Understand how to configure keys, clients, and theme branding.</p>
          <p className="doc-p">
            The SnapIt SDK is stateless and does not require global static initialization. You simply pass your credentials (<code>apiKey</code> and <code>userId</code>) directly when launching the try-on UI flow or when executing direct API calls using <code>SnapITClient</code>.
          </p>

          <h2 className="doc-h2">1. Custom UI Theme Configuration (SnapITTheme)</h2>
          <p className="doc-p">
            You can customize the SDK's visual components to match your application's brand using <code>SnapITTheme</code>:
          </p>

          <div className="code-panel" style={{ margin: "24px 0" }}>
            <div className="code-tabs">
              <span className="code-tab active">theme_example.dart</span>
            </div>
            <div className="code-content-wrapper">
              <pre className="code-block">
                <code>{`import 'package:flutter/material.dart';
import 'package:snapit_sdk/snapit_sdk.dart';

final customTheme = SnapITTheme(
  primaryColor: const Color(0xFFFF3F6C), // Your brand highlight color
  backgroundColor: const Color(0xFF09090B), // SDK background color
  cardColor: const Color(0xFF18181B), // SDK card surface color
  textColor: Colors.white, // Text color
  borderRadius: 16.0, // Rounded corners radius
  fontFamily: 'Outfit', // Custom typeface
);`}</code>
              </pre>
            </div>
          </div>

          <h2 className="doc-h2">2. Direct API Client Configuration (SnapITClient)</h2>
          <p className="doc-p">
            If you want to invoke VTON rendering or upload assets programmatically without displaying the default user interface flow, instantiate a <code>SnapITClient</code>:
          </p>

          <div className="code-panel" style={{ margin: "24px 0" }}>
            <div className="code-tabs">
              <span className="code-tab active">client_example.dart</span>
            </div>
            <div className="code-content-wrapper">
              <pre className="code-block">
                <code>{`import 'package:snapit_sdk/snapit_sdk.dart';

final client = SnapITClient(
  apiKey: "smd_live_your_key_here",
  userId: "user_abc123",
);`}</code>
              </pre>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function renderFlutterTryOnViewer() {
  return (
    <div className="main-layout" style={{ gridTemplateColumns: "1fr" }}>
      <div className="content-wrapper">
        <section className="doc-section">
          <h1 className="doc-title">Launch Try-On Flow</h1>
          <p className="doc-subtitle">Embed a complete, pre-configured try-on UI experience with a single function call.</p>
          <p className="doc-p">Use <code>SnapIT.launchTryOnFlow</code> to trigger the try-on bottom sheet experience. The SDK handles asset selection, camera/gallery permissions, uploads, progress indications, rendering, and result visualization automatically.</p>

          <div className="code-panel" style={{ margin: "24px 0" }}>
            <div className="code-tabs">
              <span className="code-tab active">Usage Example</span>
            </div>
            <div className="code-content-wrapper">
              <pre className="code-block">
                <code>{`import 'package:snapit_sdk/snapit_sdk.dart';

SnapIT.launchTryOnFlow(
  context: context,
  apiKey: "smd_live_your_key_here",
  userId: "user_abc123",
  garmentImageUrl: "https://apisdk.snapmydesign.com/sample/tshirt.png",
  productId: "sku_shirt_123", // Optional SKU/product ID tracking
  externalUserId: "consumer_user_771", // Optional customer tracking
  onSuccess: (resultImageUrl, generationId) {
    print("Try-On Completed! Output URL: $resultImageUrl");
  },
  onFailure: (errorMessage) {
    print("Try-On Failed: $errorMessage");
  },
);`}</code>
              </pre>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function renderFlutterExamples() {
  return (
    <div className="main-layout" style={{ gridTemplateColumns: "1fr" }}>
      <div className="content-wrapper">
        <section className="doc-section">
          <h1 className="doc-title">Full Flutter App Sample</h1>
          <p className="doc-subtitle">A fully operational widget tree for virtual try-on using the low-level client API.</p>

          <div className="code-panel">
            <div className="code-tabs">
              <span className="code-tab active">example.dart</span>
            </div>
            <div className="code-content-wrapper">
              <pre className="code-block">
                <code>{`import 'package:flutter/material.dart';
import 'package:snapit_sdk/snapit_sdk.dart';

class VtonScreen extends StatefulWidget {
  const VtonScreen({Key? key}) : super(key: key);

  @override
  State<VtonScreen> createState() => _VtonScreenState();
}

class _VtonScreenState extends State<VtonScreen> {
  String? _outputUrl;
  bool _isLoading = false;
  
  late final SnapITClient _client;

  @override
  void initState() {
    super.initState();
    _client = SnapITClient(
      apiKey: "smd_live_your_key_here",
      userId: "user_abc123",
    );
  }

  void _runGeneration() async {
    setState(() => _isLoading = true);
    try {
      final resultUrl = await _client.generateTryOn(
        garmentImageUrl: "https://apisdk.snapmydesign.com/sample/tshirt.png",
        personImageUrl: "https://apisdk.snapmydesign.com/sample/model.png",
        modelName: "medium",
      );
      setState(() => _outputUrl = resultUrl);
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Try-On failed: \$e")),
      );
    } finally {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("SnapIt VTON")),
      body: Center(
        child: _isLoading 
          ? const CircularProgressIndicator()
          : _outputUrl != null 
            ? Image.network(
                _outputUrl!,
                fit: BoxFit.contain,
              )
            : ElevatedButton(
                onPressed: _runGeneration,
                child: const Text("Generate Try-On"),
              ),
      ),
    );
  }
}`}</code>
              </pre>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

/* ==========================================================================
   iOS SDK DOC RENDERS
   ========================================================================== */

function renderIosIntro() {
  return (
    <div className="main-layout" style={{ gridTemplateColumns: "1fr" }}>
      <div className="content-wrapper">
        <section className="doc-section">
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "4px 10px", borderRadius: 20, backgroundColor: "rgba(0, 242, 254, 0.08)", border: "1px solid rgba(0, 242, 254, 0.2)", fontSize: "0.75rem", color: "hsl(var(--accent-cyan))", fontWeight: 700, marginBottom: 16 }}>
            <Sparkles size={12} />
            SWIFT NATIVE SDK
          </div>
          <h1 className="doc-title">iOS VTON SDK</h1>
          <p className="doc-subtitle">Native Swift library designed for Apple iOS platforms.</p>
          <p className="doc-p">
            The SnapIt iOS SDK provides clean Swift extensions, custom controllers, and network models optimized for Swift concurrency.
          </p>

          <div className="alert-box tip" style={{ marginTop: 24 }}>
            <HelpCircle />
            <div>
              <div className="alert-title">Prefer Direct API Integration?</div>
              If you prefer not to use our Swift SDK and want to implement raw HTTP requests in Swift instead, you can directly integrate our endpoints. Refer to our <a href="/docs/api" className="text-cyan doc-strong">API Reference Guide</a>.
            </div>
          </div>

          <p className="doc-p" style={{ marginTop: 24 }}>
            To explore our web catalogue tool or create a developer account, visit the <a href="https://console.snapmydesign.com" target="_blank" rel="noopener noreferrer" style={{ color: "hsl(var(--accent-cyan))", textDecoration: "underline" }}>Snapmydesign Developer Console (console.snapmydesign.com)</a>.
          </p>
        </section>
      </div>
    </div>
  );
}

function renderIosInstallation() {
  return (
    <div className="main-layout" style={{ gridTemplateColumns: "1fr" }}>
      <div className="content-wrapper">
        <section className="doc-section">
          <h1 className="doc-title">iOS Integration Setup</h1>
          <p className="doc-subtitle">Integrating Virtual Try-On directly using standard system network frameworks.</p>

          <div className="alert-box tip" style={{ margin: "24px 0" }}>
            <HelpCircle />
            <div>
              <div className="alert-title">No SDK Package Required</div>
              Since integrations route directly to the REST API, you do not need to install any external Swift packages, binary frameworks, or CocoaPods dependencies. This keeps your iOS app bundle size lightweight and clean.
            </div>
          </div>

          <h2 className="doc-h2">Required Setup & Permissions</h2>
          <p className="doc-p">
            Ensure your app has standard Internet access. Because our REST API operates securely over HTTPS, no custom App Transport Security (ATS) exceptions or plist overrides are required.
          </p>

          <h2 className="doc-h2">Base Configuration</h2>
          <p className="doc-p">
            Define the VTON API base URL and your private API key in your configuration registry or plist file:
          </p>
          <div className="code-panel">
            <div className="code-tabs">
              <span className="code-tab active">API Endpoint</span>
            </div>
            <div className="code-content-wrapper">
              <pre className="code-block">
                <code>https://apisdk.snapmydesign.com/api/v1/vton/generate</code>
              </pre>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function renderIosController() {
  return (
    <div className="main-layout" style={{ gridTemplateColumns: "1fr" }}>
      <div className="content-wrapper">
        <section className="doc-section">
          <h1 className="doc-title">VTONViewController</h1>
          <p className="doc-subtitle">Native view controller wrapper for iOS.</p>
          <p className="doc-p">Instantiate and present `VTONViewController` directly from UIKit views or UIHostingController.</p>

          <div className="code-panel" style={{ margin: "24px 0" }}>
            <div className="code-tabs">
              <span className="code-tab active">Swift UIKit</span>
            </div>
            <div className="code-content-wrapper">
              <pre className="code-block">
                <code>{`import UIKit
import SnapItSDK

class CatalogController: UIViewController {
    func openTryOn() {
        let vtonVC = VTONViewController(
            apiKey: "smd_live_your_key_here",
            garmentImageURL: URL(string: "https://...")!
        )
        self.present(vtonVC, animated: true)
    }
}`}</code>
              </pre>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function renderIosExamples() {
  return (
    <div className="main-layout" style={{ gridTemplateColumns: "1fr" }}>
      <div className="content-wrapper">
        <section className="doc-section">
          <h1 className="doc-title">SwiftUI API Integration</h1>
          <p className="doc-subtitle">Calling the SnapIt REST API directly inside SwiftUI using native URLSession and Swift Concurrency.</p>

          <p className="doc-p">
            If you prefer not to include the binary size of the native SDK, you can issue direct API POST requests to our servers from SwiftUI views:
          </p>

          <div className="code-panel">
            <div className="code-tabs">
              <span className="code-tab active">ContentView.swift</span>
            </div>
            <div className="code-content-wrapper">
              <pre className="code-block">
                <code>{`import SwiftUI

// 1. Define JSON Model Schemas
struct VTONRequest: Codable {
    let model_name: String
    let inputClothesImageUrls: [String]
}

struct VTONResponse: Codable {
    let status: String
    let outputImageUrl: String?
    let message: String?
}

// 2. Direct API Service Layer
class VTONService {
    static let shared = VTONService()
    
    func generateTryOn(garmentURL: String) async throws -> String {
        guard let url = URL(string: "https://apisdk.snapmydesign.com/api/v1/vton/generate") else {
            throw URLError(.badURL)
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("smd_live_your_api_key_here", forHTTPHeaderField: "X-API-Key")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        let payload = VTONRequest(
            model_name: "medium",
            inputClothesImageUrls: [garmentURL]
        )
        request.httpBody = try JSONEncoder().encode(payload)
        
        let (data, response) = try await URLSession.shared.data(for: request)
        
        guard let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 200 else {
            throw URLError(.badServerResponse)
        }
        
        let result = try JSONDecoder().decode(VTONResponse::self, from: data)
        guard let outputURL = result.outputImageUrl else {
            throw NSError(domain: "VTON", code: 0, userInfo: [
                NSLocalizedDescriptionKey: result.message ?? "Generation failed"
            ])
        }
        return outputURL
    }
}

// 3. SwiftUI Component View
struct ContentView: View {
    @State private var resultURL: String?
    @State private var isLoading = false
    @State private var errorText: String?
    
    let garmentImageURL = "https://assets.url/dress.jpg"
    
    var body: some View {
        VStack(spacing: 24) {
            Text("SnapIt Direct API Try-On")
                .font(.headline)
            
            if isLoading {
                ProgressView("Running AI workers...")
            } else if let output = resultURL, let url = URL(string: output) {
                AsyncImage(url: url) { phase in
                    switch phase {
                    case .success(let image):
                        image.resizable().scaledToFit()
                    case .failure:
                        Text("Failed to render output image")
                    default:
                        ProgressView()
                    }
                }
                .frame(maxHeight: 350)
                .cornerRadius(12)
            } else {
                Text("Ready to generate try-on model")
                    .foregroundColor(.secondary)
            }
            
            if let error = errorText {
                Text(error).foregroundColor(.red).font(.caption)
            }
            
            Button(action: triggerTryOn) {
                Text("Generate Try-On")
                    .bold()
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.blue)
                    .foregroundColor(.white)
                    .cornerRadius(10)
            }
            .disabled(isLoading)
        }
        .padding()
    }
    
    private func triggerTryOn() {
        isLoading = true
        errorText = nil
        
        Task {
            do {
                let url = try await VTONService.shared.generateTryOn(garmentURL: garmentImageURL)
                await MainActor.run {
                    self.resultURL = url
                    self.isLoading = false
                }
            } catch {
                await MainActor.run {
                    self.errorText = error.localizedDescription
                    self.isLoading = false
                }
            }
        }
    }
}`}</code>
              </pre>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

/* ==========================================================================
   ANDROID SDK DOC RENDERS
   ========================================================================== */

function renderAndroidIntro() {
  return (
    <div className="main-layout" style={{ gridTemplateColumns: "1fr" }}>
      <div className="content-wrapper">
        <section className="doc-section">
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "4px 10px", borderRadius: 20, backgroundColor: "rgba(0, 242, 254, 0.08)", border: "1px solid rgba(0, 242, 254, 0.2)", fontSize: "0.75rem", color: "hsl(var(--accent-cyan))", fontWeight: 700, marginBottom: 16 }}>
            <Sparkles size={12} />
            ANDROID KOTLIN SDK
          </div>
          <h1 className="doc-title">Android VTON SDK</h1>
          <p className="doc-subtitle">Kotlin-optimized SDK for native Android integrations.</p>
          <p className="doc-p">
            Integrate virtual try-on engines directly into layouts, fragments, or modern Jetpack Compose flows.
          </p>

          <div className="alert-box tip" style={{ marginTop: 24 }}>
            <HelpCircle />
            <div>
              <div className="alert-title">Prefer Direct API Integration?</div>
              If you prefer not to use our Kotlin SDK and want to implement raw HTTP requests using Retrofit, Ktor, or OkHttp instead, you can directly integrate our endpoints. Refer to our <a href="/docs/api" className="text-cyan doc-strong">API Reference Guide</a>.
            </div>
          </div>

          <p className="doc-p" style={{ marginTop: 24 }}>
            To explore our web catalogue tool or create a developer account, visit the <a href="https://console.snapmydesign.com" target="_blank" rel="noopener noreferrer" style={{ color: "hsl(var(--accent-cyan))", textDecoration: "underline" }}>Snapmydesign Developer Console (console.snapmydesign.com)</a>.
          </p>
        </section>
      </div>
    </div>
  );
}

function renderAndroidInstallation() {
  return (
    <div className="main-layout" style={{ gridTemplateColumns: "1fr" }}>
      <div className="content-wrapper">
        <section className="doc-section">
          <h1 className="doc-title">Android Integration Setup</h1>
          <p className="doc-subtitle">Integrating Virtual Try-On directly using standard system network libraries.</p>

          <div className="alert-box tip" style={{ margin: "24px 0" }}>
            <HelpCircle />
            <div>
              <div className="alert-title">No Gradle Package Required</div>
              Since integrations route directly to the REST API, you do not need to install any external AAR binaries or Gradle dependencies. This prevents method count bloat and keeps your Android APK lightweight.
            </div>
          </div>

          <h2 className="doc-h2">Required Setup & Permissions</h2>
          <p className="doc-p">
            Ensure your application has internet access permission declared inside your <code>AndroidManifest.xml</code>:
          </p>
          <div className="code-panel" style={{ margin: "24px 0" }}>
            <div className="code-tabs">
              <span className="code-tab active">AndroidManifest.xml</span>
            </div>
            <div className="code-content-wrapper">
              <pre className="code-block">
                <code>{`<uses-permission android:name="android.permission.INTERNET" />`}</code>
              </pre>
            </div>
          </div>

          <h2 className="doc-h2">Base Configuration</h2>
          <p className="doc-p">
            Define the VTON API base URL and your private API key in your resource variables:
          </p>
          <div className="code-panel">
            <div className="code-tabs">
              <span className="code-tab active">API Endpoint</span>
            </div>
            <div className="code-content-wrapper">
              <pre className="code-block">
                <code>https://apisdk.snapmydesign.com/api/v1/vton/generate</code>
              </pre>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function renderAndroidActivity() {
  return (
    <div className="main-layout" style={{ gridTemplateColumns: "1fr" }}>
      <div className="content-wrapper">
        <section className="doc-section">
          <h1 className="doc-title">VtonActivity Integration</h1>
          <p className="doc-subtitle">Launching virtual try-on activities in native JVM platforms.</p>

          <div className="code-panel" style={{ margin: "24px 0" }}>
            <div className="code-tabs">
              <span className="code-tab active">Kotlin Fragment</span>
            </div>
            <div className="code-content-wrapper">
              <pre className="code-block">
                <code>{`import com.snapit.sdk.VtonActivity
import com.snapit.sdk.SnapItClient

class MainFragment : Fragment() {
    fun launchTryOn() {
        val intent = Intent(context, VtonActivity::class.java).apply {
            putExtra("API_KEY", "smd_live_your_key_here")
            putExtra("GARMENT_URL", "https://...")
        }
        startActivity(intent)
    }
}`}</code>
              </pre>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function renderAndroidExamples() {
  return (
    <div className="main-layout" style={{ gridTemplateColumns: "1fr" }}>
      <div className="content-wrapper">
        <section className="doc-section">
          <h1 className="doc-title">Kotlin API Integration</h1>
          <p className="doc-subtitle">Calling the SnapIt REST API directly in Jetpack Compose using native Coroutines and OkHttp.</p>

          <p className="doc-p">
            If you prefer not to include the binary size of the native SDK, you can issue direct API POST requests to our servers from Compose views:
          </p>

          <div className="code-panel">
            <div className="code-tabs">
              <span className="code-tab active">ComposeView.kt</span>
            </div>
            <div className="code-content-wrapper">
              <pre className="code-block">
                <code>{`package com.example.vton

import android.os.Bundle
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import coil.compose.AsyncImage
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONArray
import org.json.JSONObject

// 1. Direct API Service Layer
class VTONService {
    private val client = OkHttpClient()
    private val mediaType = "application/json; charset=utf-8".toMediaType()

    suspend fun generateTryOn(garmentUrl: String): String = withContext(Dispatchers.IO) {
        val url = "https://apisdk.snapmydesign.com/api/v1/vton/generate"
        
        // Prepare JSON payload
        val jsonPayload = JSONObject().apply {
            put("model_name", "medium")
            put("inputClothesImageUrls", JSONArray().apply { put(garmentUrl) })
        }

        val body = jsonPayload.toString().toRequestBody(mediaType)
        val request = Request.Builder()
            .url(url)
            .post(body)
            .addHeader("X-API-Key", "smd_live_your_api_key_here")
            .addHeader("Content-Type", "application/json")
            .build()

        client.newCall(request).execute().use { response ->
            if (!response.isSuccessful) throw Exception("HTTP Error: \${response.code}")
            
            val responseBody = response.body?.string() ?: throw Exception("Empty response body")
            val jsonResponse = JSONObject(responseBody)
            
            if (jsonResponse.optString("status") == "success" || jsonResponse.has("outputImageUrl")) {
                jsonResponse.getString("outputImageUrl")
            } else {
                throw Exception(jsonResponse.optString("message", "Generation failed"))
            }
        }
    }
}

// 2. Jetpack Compose Screen View
@Composable
fun ProductDetailScreen(service: VTONService = VTONService()) {
    var resultUrl by remember { mutableStateOf<String?>(null) }
    var isLoading by remember { mutableStateOf(false) }
    var errorMessage by remember { mutableStateOf<String?>(null) }
    
    val coroutineScope = rememberCoroutineScope()
    val garmentUrl = "https://assets.url/dress.jpg"

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text("SnapIt Direct API Integration", style = MaterialTheme.typography.titleMedium)
        
        Spacer(modifier = Modifier.height(24.dp))

        if (isLoading) {
            CircularProgressIndicator()
            Spacer(modifier = Modifier.height(8.dp))
            Text("AI workers processing image...")
        } else if (resultUrl != null) {
            // Coil's AsyncImage for rendering try-on result
            AsyncImage(
                model = resultUrl,
                contentDescription = "Try-On Result",
                modifier = Modifier
                    .fillMaxWidth()
                    .height(350.dp)
            )
        } else {
            Text("Ready to run virtual try-on.", color = MaterialTheme.colorScheme.outline)
        }

        errorMessage?.let {
            Spacer(modifier = Modifier.height(8.dp))
            Text("Error: \$it", color = MaterialTheme.colorScheme.error)
        }

        Spacer(modifier = Modifier.height(24.dp))

        Button(
            onClick = {
                isLoading = true
                errorMessage = null
                coroutineScope.launch {
                    try {
                        val output = service.generateTryOn(garmentUrl)
                        resultUrl = output
                    } catch (e: Exception) {
                        errorMessage = e.message ?: "Unknown error"
                    } finally {
                        isLoading = false
                    }
                }
            },
            enabled = !isLoading,
            modifier = Modifier.fillMaxWidth()
        ) {
            Text("Generate Try-On")
        }
    }
}`}</code>
              </pre>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

/* ==========================================================================
   NPM SDK DOC RENDERS
   ========================================================================== */

function renderNpmIntro() {
  return (
    <div className="main-layout" style={{ gridTemplateColumns: "1fr" }}>
      <div className="content-wrapper">
        <section className="doc-section">
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "4px 10px", borderRadius: 20, backgroundColor: "rgba(0, 242, 254, 0.08)", border: "1px solid rgba(0, 242, 254, 0.2)", fontSize: "0.75rem", color: "hsl(var(--accent-cyan))", fontWeight: 700, marginBottom: 16 }}>
            <Sparkles size={12} />
            JAVASCRIPT & TYPESCRIPT SDK
          </div>
          <h1 className="doc-title">SnapIt NPM VTON SDK</h1>
          <p className="doc-subtitle">
            The official JavaScript/TypeScript SDK for the <strong>Snapmydesign (SMD) Virtual Try-On (VTON) API</strong>.
          </p>
          <p className="doc-p">
            This SDK simplifies integrating Snapmydesign's virtual try-on pipelines into browser-based applications and Node.js environments (v18+). It provides:
          </p>
          <ul className="doc-list">
            <li><strong>Zero Dependencies:</strong> Built with native fetch compatibility to keep your bundle size minimal.</li>
            <li><strong>Full TypeScript Support:</strong> Rich interface typings out of the box.</li>
            <li><strong>Universal Environment Compatibility:</strong> Works seamlessly in server environments, Serverless functions, React/Next.js applications, and browser runtimes.</li>
          </ul>

          <h2 className="doc-h2"><BookOpen size={20} className="text-cyan" /> Official Resources</h2>
          <div className="table-container">
            <table className="doc-table">
              <thead>
                <tr>
                  <th>Resource</th>
                  <th>Link</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="doc-strong">NPM Registry</td>
                  <td><a href="https://www.npmjs.com/package/snapit_sdk" target="_blank" rel="noopener noreferrer" className="text-cyan">npmjs.com/package/snapit_sdk</a></td>
                  <td>Official SDK package on npmjs.com.</td>
                </tr>
                <tr>
                  <td className="doc-strong">Official Website</td>
                  <td><a href="https://sdk.snapmydesign.com" target="_blank" rel="noopener noreferrer" className="text-cyan">sdk.snapmydesign.com</a></td>
                  <td>Explore SMD visual AI features and capabilities.</td>
                </tr>
                <tr>
                  <td className="doc-strong">Developer Console</td>
                  <td><a href="https://console.snapmydesign.com" target="_blank" rel="noopener noreferrer" className="text-cyan">console.snapmydesign.com</a></td>
                  <td>Generate API keys and track usage.</td>
                </tr>
                <tr>
                  <td className="doc-strong">Documentation Portal</td>
                  <td><a href="https://docs.snapmydesign.com" target="_blank" rel="noopener noreferrer" className="text-cyan">docs.snapmydesign.com</a></td>
                  <td>Complete guide to API features and parameters.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="alert-box tip">
            <CheckCircle2 />
            <div>
              <div className="alert-title">Get Started</div>
              Install the npm package and start testing right away! Head over to the <a href="/docs/npm/installation" className="text-cyan doc-strong">Installation & Setup</a> page.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function renderNpmInstallation() {
  return (
    <div className="main-layout" style={{ gridTemplateColumns: "1fr" }}>
      <div className="content-wrapper">
        <section className="doc-section">
          <h1 className="doc-title">Installation & Client Setup</h1>
          <p className="doc-subtitle">Add the SDK package to your project and initialize the VTONClient.</p>

          <h2 className="doc-h2">1. Installation</h2>
          <p className="doc-p">
            Install the official <a href="https://www.npmjs.com/package/snapit_sdk" target="_blank" rel="noopener noreferrer" className="text-cyan doc-strong">snapit_sdk</a> package from the NPM registry:
          </p>
          <div className="code-panel" style={{ margin: "16px 0 24px" }}>
            <pre className="code-block">
              <code>npm install snapit_sdk</code>
            </pre>
          </div>

          <h2 className="doc-h2">2. Environment Configuration</h2>
          <p className="doc-p">
            To use the SDK, you need an API key (`smd_live_...`) and your developer User ID, which you can obtain from the <a href="https://console.snapmydesign.com" target="_blank" rel="noopener noreferrer" className="text-cyan">Developer Console</a>.
          </p>
          <p className="doc-p">
            Define the following environment variables in your project root `.env` file:
          </p>
          <div className="code-panel" style={{ margin: "16px 0 24px" }}>
            <div className="code-tabs">
              <span className="code-tab active">.env</span>
            </div>
            <div className="code-content-wrapper">
              <pre className="code-block">
                <code>{`SMD_API_KEY=smd_live_your_key_here
SMD_USER_ID=your_developer_user_id`}</code>
              </pre>
            </div>
          </div>

          <h2 className="doc-h2">3. Initialize VTONClient</h2>
          <p className="doc-p">
            Initialize the client either by explicitly passing the API key, or let the SDK automatically load it from your environment variables.
          </p>
          <div className="code-panel" style={{ margin: "16px 0 24px" }}>
            <div className="code-tabs">
              <span className="code-tab active">TypeScript / JavaScript</span>
            </div>
            <div className="code-content-wrapper">
              <pre className="code-block">
                <code>{`import { VTONClient } from 'snapit_sdk';

// Option A: Explicit Configuration
const client = new VTONClient({
  apiKey: 'smd_live_your_api_key_here',
  // baseUrl: 'https://apisdk.snapmydesign.com/api/v1' // Optional base override
});

// Option B: Auto-load from Environment variables (process.env.SMD_API_KEY)
const clientFromEnv = new VTONClient();`}</code>
              </pre>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function renderNpmClientReference() {
  return (
    <div className="main-layout" style={{ gridTemplateColumns: "1fr" }}>
      <div className="content-wrapper">
        <section className="doc-section">
          <h1 className="doc-title">Client API Reference</h1>
          <p className="doc-subtitle">Detailed documentation for VTONClient methods and schemas.</p>

          <h2 className="doc-h2"><Sparkles size={20} className="text-cyan" /> VTON Services</h2>

          <h3 className="doc-h3"><code>client.healthCheck()</code></h3>
          <p className="doc-p">Verifies the status and availability of the SMD VTON services.</p>
          <div className="code-panel" style={{ margin: "12px 0 24px" }}>
            <div className="code-content-wrapper">
              <pre className="code-block">
                <code>{`const response = await client.healthCheck();
// Returns Promise<HealthCheckResponse>`}</code>
              </pre>
            </div>
          </div>

          <h3 className="doc-h3"><code>client.uploadImages(userId, files, resolution)</code></h3>
          <p className="doc-p">Uploads local or binary image files (person/model profiles, garment photos) to obtain secure public cloud storage URLs required for try-on rendering.</p>
          <ul className="doc-list" style={{ marginLeft: 20 }}>
            <li><strong>userId</strong> <code>string</code>: Must match the account identifier of the API key owner.</li>
            <li><strong>files</strong> <code>UploadFile[]</code>: Array containing file paths (Node.js only), Browser Files, Blobs, Buffers, or custom structured objects: <code>{`{ data: Buffer | Blob | ArrayBuffer, name: string, type?: string }`}</code>.</li>
            <li><strong>resolution</strong> <code>number</code> (Optional): Target resolution limit. Default is <code>1000</code>.</li>
          </ul>
          <div className="code-panel" style={{ margin: "12px 0 24px" }}>
            <div className="code-content-wrapper">
              <pre className="code-block">
                <code>{`const uploadRes = await client.uploadImages('user_abc123', [
  './person.jpg',
  './tshirt.png'
]);`}</code>
              </pre>
            </div>
          </div>

          <h3 className="doc-h3"><code>client.generateTryOn(request)</code></h3>
          <p className="doc-p">Triggers the virtual try-on engine pipeline (asynchronous process returned synchronously when rendering finishes).</p>
          <ul className="doc-list" style={{ marginLeft: 20 }}>
            <li><strong>request</strong> <code>VTONRequest</code>:
              <ul style={{ marginLeft: 20, marginTop: 4 }}>
                <li><code>model_name</code> (Required): <code>"fast" | "medium" | "quality"</code>.</li>
                <li><code>inputClothesImageUrls</code> (Required): Array of garment image URLs.</li>
                <li><code>inputPersonImageUrls</code> (Optional): Array of reference model/person URLs.</li>
                <li><code>prompt</code> (Optional): Custom VTON prompt description.</li>
                <li><code>version</code> (Optional): Engine model version (default <code>1.0</code>).</li>
                <li><code>productId</code> (Optional): Tracking SKU.</li>
                <li><code>externalUserId</code> (Optional): Unique user ID of your client base.</li>
                <li><code>metadata</code> (Optional): Key-value pairs dictionary.</li>
              </ul>
            </li>
          </ul>
          <div className="code-panel" style={{ margin: "12px 0 24px" }}>
            <div className="code-content-wrapper">
              <pre className="code-block">
                <code>{`const result = await client.generateTryOn({
  model_name: 'quality',
  inputClothesImageUrls: ['https://assets.../garment.png'],
  inputPersonImageUrls: ['https://assets.../person.jpg']
});`}</code>
              </pre>
            </div>
          </div>

          <h3 className="doc-h3"><code>client.getHistory(params)</code></h3>
          <p className="doc-p">Queries historical executions logs for audit and analytics.</p>
          <div className="code-panel" style={{ margin: "12px 0 24px" }}>
            <div className="code-content-wrapper">
              <pre className="code-block">
                <code>{`const history = await client.getHistory({ userId: 'user_123', limit: 10 });`}</code>
              </pre>
            </div>
          </div>

          <h2 className="doc-h2"><Key size={20} className="text-purple" /> User & API Key Management</h2>
          <p className="doc-p">The SDK also features administrative endpoints to manage users, profile details, check credits, list/revoke API keys, and track subscriptions:</p>
          <ul className="doc-list">
            <li><code>client.getUserCredits(userId)</code> - Fetch remaining credit balance.</li>
            <li><code>client.registerUser(user)</code> - Create new developer profiles.</li>
            <li><code>client.getProfileDetails(userId)</code> - Retrieve account details and tier info.</li>
            <li><code>client.updateProfile(userId, profile)</code> - Update developer profile contact info.</li>
            <li><code>client.deleteAccount(userId)</code> - Wipe all account assets and history.</li>
            <li><code>client.getSubscriptionStatus(userId)</code> - Inspect subscription plan status.</li>
            <li><code>client.generateApiKey(userId, label)</code> - Generate a new authentication token.</li>
            <li><code>client.listApiKeys(userId)</code> - Enumerate active API keys.</li>
            <li><code>client.revokeApiKey(userId, keyId)</code> - Revoke and disable an API key.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

function renderNpmErrors() {
  return (
    <div className="main-layout" style={{ gridTemplateColumns: "1fr" }}>
      <div className="content-wrapper">
        <section className="doc-section">
          <h1 className="doc-title">⚠️ Error Handling</h1>
          <p className="doc-subtitle">Understand VTON SDK exceptions, error structures, and HTTP mappings.</p>

          <h2 className="doc-h2">Exception Mapping</h2>
          <p className="doc-p">
            The SDK exposes custom error classes corresponding to the different API response statuses. When an API call fails, the client throws the matching custom exception class so you can handle specific error codes cleanly in try-catch statements.
          </p>

          <div className="table-container">
            <table className="doc-table">
              <thead>
                <tr>
                  <th>SDK Error Class</th>
                  <th>HTTP Code</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="doc-strong"><code>InvalidAPIKeyError</code></td>
                  <td><code className="text-orange">401</code></td>
                  <td>API Key is missing, incorrectly formatted, or has been revoked.</td>
                </tr>
                <tr>
                  <td className="doc-strong"><code>UnauthorizedError</code></td>
                  <td><code className="text-orange">403</code></td>
                  <td>Request payload user ID does not match the API Key's developer account owner.</td>
                </tr>
                <tr>
                  <td className="doc-strong"><code>UserNotFoundError</code></td>
                  <td><code className="text-orange">404</code></td>
                  <td>Specified developer user ID doesn't exist.</td>
                </tr>
                <tr>
                  <td className="doc-strong"><code>APIKeyNotFoundError</code></td>
                  <td><code className="text-orange">404</code></td>
                  <td>The system failed to match the API Key verification query.</td>
                </tr>
                <tr>
                  <td className="doc-strong"><code>InsufficientCreditsError</code></td>
                  <td><code className="text-orange">501</code></td>
                  <td>Account credit balance is lower than the model credit cost.</td>
                </tr>
                <tr>
                  <td className="doc-strong"><code>VTONServerError</code></td>
                  <td><code className="text-orange">5xx</code></td>
                  <td>Backend processing or rendering servers failed or timed out.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="doc-h2">Handling Errors</h2>
          <p className="doc-p">Use instance checks in catch blocks to handle specific edge conditions like credit depletion:</p>
          <div className="code-panel">
            <div className="code-tabs">
              <span className="code-tab active">exception_handling.ts</span>
            </div>
            <div className="code-content-wrapper">
              <pre className="code-block">
                <code>{`import { VTONClient, InsufficientCreditsError, InvalidAPIKeyError } from 'snapit_sdk';

const client = new VTONClient();

try {
  const result = await client.generateTryOn({
    model_name: 'quality',
    inputClothesImageUrls: ['https://assets.../garment.png']
  });
} catch (error) {
  if (error instanceof InsufficientCreditsError) {
    console.error('Operation failed: Please buy more credit top-ups.');
  } else if (error instanceof InvalidAPIKeyError) {
    console.error('Unauthorized: Check your environment SMD_API_KEY value.');
  } else {
    console.error('SDK request failed:', error.message);
  }
}`}</code>
              </pre>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function renderNpmExamples() {
  return (
    <div className="main-layout" style={{ gridTemplateColumns: "1fr" }}>
      <div className="content-wrapper">
        <section className="doc-section">
          <h1 className="doc-title">Full Integration Example</h1>
          <p className="doc-subtitle">Runnable end-to-end VTON integration flow in Node.js.</p>
          <p className="doc-p">
            This script covers checking service health, checking remaining credits, uploading reference image files, triggering a try-on generation, and logging the output image.
          </p>

          <div className="code-panel">
            <div className="code-tabs">
              <span className="code-tab active">run_vton.ts</span>
            </div>
            <div className="code-content-wrapper">
              <pre className="code-block">
                <code>{`import { VTONClient, InsufficientCreditsError } from 'snapit_sdk';

const client = new VTONClient({ apiKey: 'smd_live_your_key_here' });

async function runTryOnWorkflow() {
  try {
    const developerUserId = 'user_abc123';

    // 1. Verify VTON health status
    console.log('Checking service health...');
    const health = await client.healthCheck();
    if (!health.success) {
      console.warn('VTON service is currently degraded.');
      return;
    }

    // 2. Audit credits
    const balance = await client.getUserCredits(developerUserId);
    console.log('Current credit balance:', balance.credits.credits);

    // 3. Upload model and clothes images
    // Note: Local paths are supported in Node.js environments.
    // In browser/serverless, pass File/Blob binary objects instead.
    console.log('Uploading reference garments and model photos...');
    const uploadRes = await client.uploadImages(developerUserId, [
      './person.jpg',
      './tshirt.png'
    ], 1000);

    const urls = uploadRes.uploaded.map(item => item.url);
    console.log('Uploaded assets URLs:', urls);

    // 4. Trigger try-on generation
    console.log('Generating Try-On rendering...');
    const generation = await client.generateTryOn({
      model_name: 'quality', // 'fast' (0.25 credits), 'medium' (0.50 credits), or 'quality' (1.00 credits)
      inputClothesImageUrls: [urls[1]],
      inputPersonImageUrls: [urls[0]],
      prompt: 'Put the tshirt on the model',
      version: 1.1,
      productId: 'sku_9921_blue',
      metadata: {
        campaign: 'summer_sale_2026'
      }
    });

    if (generation.success) {
      console.log('Virtual try-on completed successfully!');
      console.log('Output Image URL:', generation.outputImageUrls[0]);
      console.log('Transaction Charge:', generation.creditCost, 'credits');
      console.log('Generation UUID:', generation.generationId);
    }
  } catch (error) {
    if (error instanceof InsufficientCreditsError) {
      console.error('VTON error: Developer credits are insufficient.');
    } else {
      console.error('VTON error:', error.message);
    }
  }
}

runTryOnWorkflow();`}</code>
              </pre>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
