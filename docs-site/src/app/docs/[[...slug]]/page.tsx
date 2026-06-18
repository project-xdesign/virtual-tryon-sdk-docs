import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ENDPOINTS, QUICK_REFERENCE, MODEL_MATRIX, ERROR_CODES, STANDARD_ERROR_JSON } from "@/lib/docsData";
import SequenceDiagram from "@/components/SequenceDiagram";
import CreditCalculator from "@/components/CreditCalculator";
import ApiPlayground from "@/components/ApiPlayground";
import { ArrowRight, HelpCircle, CheckCircle2, ShieldAlert, Sparkles, BookOpen, Key, Activity, Coins, Copy } from "lucide-react";

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

// SEO Dynamic Metadata Generation
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug || [];

  let category = "api";
  let subSlug = slug;

  if (slug.length > 0) {
    if (["api", "flutter", "ios", "android"].includes(slug[0])) {
      category = slug[0];
      subSlug = slug.slice(1);
    }
  }

  let title = "Introduction | Snapmydesign VTON SDK & API Documentation";
  let description = "Welcome to the Snapmydesign Virtual Try-On SDK reference. Integrate AI-powered virtual try-on models into API, Flutter, iOS, and Android applications.";

  if (category === "api") {
    if (subSlug.length === 1) {
      const page = subSlug[0];
      if (page === "authentication") {
        title = "Authentication | Snapmydesign VTON API";
        description = "Learn how to authorize your API requests securely using your X-API-Key header.";
      } else if (page === "workflow") {
        title = "Integration Workflow | Snapmydesign VTON API";
        description = "Understand the 3-step cycle of uploading assets, generating try-ons, and auditing histories.";
      } else if (page === "credit-matrix") {
        title = "Model & Credit Matrix | Snapmydesign VTON API";
        description = "Compare speeds, quality, and credit costs for VTON models.";
      } else if (page === "errors") {
        title = "Error Handling & Exceptions | Snapmydesign VTON API";
        description = "Structured errors, HTTP response status codes, and exception resolutions.";
      } else if (page === "examples") {
        title = "Code Examples | Snapmydesign VTON API Integration";
        description = "Get started instantly with copy-pasteable script samples in cURL, Python, and NodeJS.";
      }
    } else if (subSlug.length === 2 && subSlug[0] === "endpoints") {
      const endpointId = subSlug[1];
      const endpoint = ENDPOINTS.find((e) => e.id === endpointId);
      if (endpoint) {
        title = `${endpoint.title} (${endpoint.method} ${endpoint.path}) | API Reference`;
        description = endpoint.description;
      }
    }
  } else if (category === "flutter") {
    title = "Flutter SDK Docs | Snapmydesign VTON";
    if (subSlug.length === 1) {
      title = `${subSlug[0].toUpperCase()} | Flutter SDK Docs`;
    } else if (subSlug.length === 2 && subSlug[0] === "widgets") {
      title = `Widget: ${subSlug[1]} | Flutter SDK Docs`;
    }
  } else if (category === "ios") {
    title = "iOS SDK Docs | Snapmydesign VTON";
    if (subSlug.length === 1) {
      title = `${subSlug[0].toUpperCase()} | iOS SDK Docs`;
    }
  } else if (category === "android") {
    title = "Android SDK Docs | Snapmydesign VTON";
    if (subSlug.length === 1) {
      title = `${subSlug[0].toUpperCase()} | Android SDK Docs`;
    }
  }

  return {
    title,
    description,
    keywords: ["VTON API", "Virtual Try-On", "Snapmydesign", "Flutter SDK", "iOS SDK", "Android SDK", "Fashion AI", "Try-on SDK"],
    authors: [{ name: "Snapmydesign Team" }],
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "Snapmydesign VTON SDK & API Reference"
    }
  };
}

export default async function DocsPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug || [];

  // Determine category and sub-path
  let category = "api";
  let subSlug = slug;

  if (slug.length > 0) {
    if (["api", "flutter", "ios", "android"].includes(slug[0])) {
      category = slug[0];
      subSlug = slug.slice(1);
    }
  }

  // Handle empty sub-path introduction pages
  if (subSlug.length === 0) {
    if (category === "api") return renderIntro();
    if (category === "flutter") return renderFlutterIntro();
    if (category === "ios") return renderIosIntro();
    if (category === "android") return renderAndroidIntro();
  }

  // Handle sub-pages
  if (category === "api") {
    if (subSlug.length === 1) {
      const page = subSlug[0];
      if (page === "authentication") return renderAuthentication();
      if (page === "workflow") return renderWorkflow();
      if (page === "credit-matrix") return renderCreditMatrix();
      if (page === "errors") return renderErrors();
      if (page === "examples") return renderExamples();
      return notFound();
    }
    if (subSlug.length === 2 && subSlug[0] === "endpoints") {
      const endpointId = subSlug[1];
      const endpoint = ENDPOINTS.find((e) => e.id === endpointId);
      if (!endpoint) return notFound();
      return renderEndpoint(endpoint);
    }
  }

  if (category === "flutter") {
    if (subSlug.length === 1) {
      const page = subSlug[0];
      if (page === "installation") return renderFlutterInstallation();
      if (page === "configuration") return renderFlutterConfiguration();
      if (page === "examples") return renderFlutterExamples();
    }
    if (subSlug.length === 2 && subSlug[0] === "widgets") {
      const widgetId = subSlug[1];
      if (widgetId === "try-on-viewer") return renderFlutterTryOnViewer();
    }
    return notFound();
  }

  if (category === "ios") {
    if (subSlug.length === 1) {
      const page = subSlug[0];
      if (page === "installation") return renderIosInstallation();
      if (page === "controller") return renderIosController();
      if (page === "examples") return renderIosExamples();
    }
    return notFound();
  }

  if (category === "android") {
    if (subSlug.length === 1) {
      const page = subSlug[0];
      if (page === "installation") return renderAndroidInstallation();
      if (page === "activity") return renderAndroidActivity();
      if (page === "examples") return renderAndroidExamples();
    }
    return notFound();
  }

  return notFound();
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
                  <td><a href="https://sdk.snapmydesign.com" target="_blank" rel="noopener noreferrer" className="text-cyan">sdk.snapmydesign.com</a></td>
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
          <h1 className="doc-title">🔐 Authentication</h1>
          <p className="doc-subtitle">
            All request categories that process uploads or trigger generations must authenticate using a private API key.
          </p>

          <p className="doc-p">
            To authorize your request, include the following custom header in your HTTP payloads:
          </p>

          <p className="doc-p">
            You can generate, retrieve, and manage your API keys inside the <a href="https://sdk.snapmydesign.com" target="_blank" rel="noopener noreferrer" style={{ color: "hsl(var(--accent-cyan))", textDecoration: "underline" }}>SnapIt Developer Console (sdk.snapmydesign.com)</a>.
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
                <code>{`curl -X POST "https://apigcp.snapmydesign.com/api/v1/vton/generate" \\
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
          <h1 className="doc-title">🔄 Integration Workflow</h1>
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

          <p className="doc-p" style={{ marginTop: 24 }}>
            To explore our web catalogue tool or create a developer account, visit the <a href="https://sdk.snapmydesign.com" target="_blank" rel="noopener noreferrer" style={{ color: "hsl(var(--accent-cyan))", textDecoration: "underline" }}>Snapmydesign Main Website (snapmydesign.com)</a>.
          </p>
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
          <p className="doc-p" style={{ marginTop: 24 }}>
            To explore our web catalogue tool or create a developer account, visit the <a href="https://sdk.snapmydesign.com" target="_blank" rel="noopener noreferrer" style={{ color: "hsl(var(--accent-cyan))", textDecoration: "underline" }}>Snapmydesign Main Website (snapmydesign.com)</a>.
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
          <h1 className="doc-title">iOS SDK Installation</h1>
          <p className="doc-subtitle">Add SnapIt using CocoaPods or Swift Package Manager.</p>
          <h2 className="doc-h2">Swift Package Manager (SPM)</h2>
          <p className="doc-p">In Xcode, select <strong>File &gt; Add Packages...</strong> and insert the SDK repository URL:</p>
          <div className="code-panel">
            <pre className="code-block">
              <code>https://github.com/snapmydesign/virtual-tryon-sdk-ios.git</code>
            </pre>
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
          <h1 className="doc-title">iOS SwiftUI Example</h1>
          <p className="doc-subtitle">Integrating Swift VTON wrapper in SwiftUI declarations.</p>

          <div className="code-panel">
            <div className="code-tabs">
              <span className="code-tab active">ContentView.swift</span>
            </div>
            <div className="code-content-wrapper">
              <pre className="code-block">
                <code>{`import SwiftUI
import SnapItSDK

struct ContentView: View {
    @State private var showingTryOn = false
    
    var body: some View {
        Button("Try on Shirt") {
            showingTryOn = true
        }
        .sheet(isPresented: $showingTryOn) {
            SwiftUITryOnView(
                apiKey: "smd_live_your_key",
                garmentURL: "https://..."
            )
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
          <p className="doc-p" style={{ marginTop: 24 }}>
            To explore our web catalogue tool or create a developer account, visit the <a href="https://sdk.snapmydesign.com" target="_blank" rel="noopener noreferrer" style={{ color: "hsl(var(--accent-cyan))", textDecoration: "underline" }}>Snapmydesign Main Website (snapmydesign.com)</a>.
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
          <h1 className="doc-title">Android SDK Installation</h1>
          <p className="doc-subtitle">Add the Gradle dependency repository link.</p>
          <p className="doc-p">Add the library directly inside your app’s `build.gradle` file:</p>

          <div className="code-panel" style={{ margin: "24px 0" }}>
            <div className="code-tabs">
              <span className="code-tab active">build.gradle</span>
            </div>
            <div className="code-content-wrapper">
              <pre className="code-block">
                <code>{`dependencies {
    implementation 'com.github.snapmydesign:virtual-tryon-sdk-android:1.1.0'
}`}</code>
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
          <h1 className="doc-title">Android Jetpack Compose Example</h1>
          <p className="doc-subtitle">Setting up interactive layouts in composable functions.</p>

          <div className="code-panel">
            <div className="code-tabs">
              <span className="code-tab active">ComposeView.kt</span>
            </div>
            <div className="code-content-wrapper">
              <pre className="code-block">
                <code>{`import androidx.compose.runtime.*
import com.snapit.sdk.compose.TryOnWidget

@Composable
fun ProductDetailScreen() {
    TryOnWidget(
        apiKey = "smd_live_your_key",
        garmentUrl = "https://...",
        onSuccess = { resultUrl ->
            // render result in view
        }
    )
}`}</code>
              </pre>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
