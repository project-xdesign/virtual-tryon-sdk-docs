"use client";

import React, { useState, useEffect } from "react";
import { EndpointData } from "@/lib/docsData";
import { Copy, Check, Terminal, PlayCircle, Loader2, RefreshCw } from "lucide-react";

interface ApiPlaygroundProps {
  endpoint: EndpointData;
}

export default function ApiPlayground({ endpoint }: ApiPlaygroundProps) {
  const [activeLang, setActiveLang] = useState<"curl" | "python" | "javascript">("curl");
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"code" | "console">("code");
  const [isLoading, setIsLoading] = useState(false);
  const [responseReady, setResponseReady] = useState(false);

  const [apiKey, setApiKey] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [responseStatus, setResponseStatus] = useState<string>("");
  const [responseBody, setResponseBody] = useState<string>("");
  const [isResponseSuccess, setIsResponseSuccess] = useState<boolean>(true);

  // Load API key from local storage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("smd_api_key");
      if (stored) setApiKey(stored);
    }
  }, []);

  const handleApiKeyChange = (val: string) => {
    setApiKey(val);
    if (typeof window !== "undefined") {
      localStorage.setItem("smd_api_key", val);
    }
  };

  // Dynamic console inputs state
  const [formState, setFormState] = useState<Record<string, string>>(() => {
    const initialState: Record<string, string> = {};
    endpoint.parameters.forEach((param) => {
      initialState[param.name] = param.default ? param.default.replace(/"/g, "") : "";
    });
    // Set some nice default mocks if empty
    if (endpoint.id === "upload") {
      initialState["userId"] = "user_abc123";
      initialState["resolution"] = "1000";
    } else if (endpoint.id === "generate") {
      initialState["model_name"] = "medium";
      initialState["inputClothesImageUrls"] = "https://firebasestorage.googleapis.com/v0/b/xdesign-d72cd.appspot.com/o/vton_uploaded_image%2Ftshirt.png";
      initialState["inputPersonImageUrls"] = "";
      initialState["prompt"] = "Put the shirt on the model";
      initialState["version"] = "1.0";
    } else if (endpoint.id === "credits") {
      initialState["userId"] = "user_abc123";
    } else if (endpoint.id === "history") {
      initialState["userId"] = "user_abc123";
      initialState["limit"] = "20";
    }
    return initialState;
  });

  const handleInputChange = (name: string, value: string) => {
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Actually hit the API to get the response
  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResponseReady(false);

    const baseUrl = "https://apisdk.snapmydesign.com/api/v1";
    let url = `${baseUrl}${endpoint.path}`;

    const headers: Record<string, string> = {};
    if (endpoint.authRequired || apiKey) {
      headers["X-API-Key"] = apiKey;
    }

    let options: RequestInit = {
      method: endpoint.method,
      headers
    };

    if (endpoint.method === "GET") {
      const queryParams = new URLSearchParams();
      Object.entries(formState).forEach(([key, val]) => {
        if (val) queryParams.append(key, val);
      });
      const queryString = queryParams.toString();
      if (queryString) {
        url = `${url}?${queryString}`;
      }
    } else {
      // POST requests
      if (endpoint.contentType === "multipart/form-data") {
        const formData = new FormData();
        if (selectedFiles.length > 0) {
          selectedFiles.forEach((file) => {
            formData.append("files", file);
          });
        }
        Object.entries(formState).forEach(([key, val]) => {
          if (key !== "files" && val) {
            formData.append(key, val);
          }
        });
        options.body = formData;
      } else {
        headers["Content-Type"] = "application/json";

        // Parse list params and format body
        let clothesUrls: string[] = [];
        const clothesVal = formState["inputClothesImageUrls"]?.trim();
        if (clothesVal) {
          if (clothesVal.startsWith("[")) {
            try { clothesUrls = JSON.parse(clothesVal); } catch(e) { clothesUrls = [clothesVal]; }
          } else {
            clothesUrls = clothesVal.split(",").map(url => url.trim()).filter(Boolean);
          }
        }

        let personUrls: string[] = [];
        const personVal = formState["inputPersonImageUrls"]?.trim();
        if (personVal) {
          if (personVal.startsWith("[")) {
            try { personUrls = JSON.parse(personVal); } catch(e) { personUrls = [personVal]; }
          } else {
            personUrls = personVal.split(",").map(url => url.trim()).filter(Boolean);
          }
        }

        let metadataObj = null;
        const metaVal = formState["metadata"]?.trim();
        if (metaVal) {
          try { metadataObj = JSON.parse(metaVal); } catch (e) { metadataObj = { info: metaVal }; }
        }

        const bodyObj: Record<string, any> = {};
        Object.entries(formState).forEach(([key, val]) => {
          if (val === "" || val === undefined) return;
          if (key === "inputClothesImageUrls") {
            bodyObj[key] = clothesUrls;
          } else if (key === "inputPersonImageUrls") {
            bodyObj[key] = personUrls;
          } else if (key === "version") {
            bodyObj[key] = parseFloat(val) || 1.0;
          } else if (key === "limit") {
            bodyObj[key] = parseInt(val) || 20;
          } else if (key === "resolution") {
            bodyObj[key] = parseInt(val) || 1000;
          } else if (key === "metadata") {
            bodyObj[key] = metadataObj;
          } else {
            bodyObj[key] = val;
          }
        });

        options.body = JSON.stringify(bodyObj);
      }
    }

    try {
      const response = await fetch(url, options);
      const statusCode = response.status;
      const statusText = response.statusText || (statusCode === 200 ? "OK" : statusCode === 401 ? "Unauthorized" : statusCode === 400 ? "Bad Request" : "Error");

      setResponseStatus(`${statusCode} ${statusText}`);
      setIsResponseSuccess(response.ok);

      let dataText = "";
      try {
        const dataJson = await response.json();
        dataText = JSON.stringify(dataJson, null, 2);
      } catch (err) {
        dataText = await response.text();
      }
      setResponseBody(dataText);
    } catch (error: any) {
      setResponseStatus("Network Error");
      setIsResponseSuccess(false);
      setResponseBody(error?.message || "Failed to establish database or server connection.");
    } finally {
      setIsLoading(false);
      setResponseReady(true);
    }
  };

  return (
    <div className="playground-panel">
      {/* Tab Switcher */}
      <div className="playground-tabs-bar">
        <button
          className={`playground-tab-btn ${activeTab === "code" ? "active" : ""}`}
          onClick={() => setActiveTab("code")}
        >
          <Terminal size={14} />
          Code Samples
        </button>
        <button
          className={`playground-tab-btn ${activeTab === "console" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("console");
            setResponseReady(false);
          }}
        >
          <PlayCircle size={14} />
          Interactive Console
        </button>
      </div>

      {activeTab === "code" ? (
        /* CODE SNIPPETS DISPLAY */
        <div className="playground-body">
          <div className="code-panel">
            <div className="code-tabs">
              {(["curl", "python", "javascript"] as const).map((lang) => (
                <button
                  key={lang}
                  className={`code-tab ${activeLang === lang ? "active" : ""}`}
                  onClick={() => setActiveLang(lang)}
                >
                  {lang === "curl" ? "cURL" : lang === "python" ? "Python" : "Node.js"}
                </button>
              ))}
            </div>

            <div className="code-content-wrapper">
              <button
                className="copy-btn"
                onClick={() => copyToClipboard(endpoint.codeSnippets[activeLang])}
                title="Copy to clipboard"
              >
                {copied ? <Check size={14} className="text-green" /> : <Copy size={14} />}
              </button>
              <pre className="code-block">
                <code>{endpoint.codeSnippets[activeLang]}</code>
              </pre>
            </div>
          </div>

          {/* Static Mock Response */}
          <div className="response-panel">
            <div className="response-header">
              <span className="response-title">Example Response</span>
              <span className="response-status text-green">200 OK</span>
            </div>
            <div className="response-content">
              <pre className="code-block">
                <code>{endpoint.responseJson}</code>
              </pre>
            </div>
          </div>
        </div>
      ) : (
        /* INTERACTIVE CONSOLE */
        <div className="playground-body">
          <form className="console-form" onSubmit={handleSendRequest}>
            <div className="console-section-title">Request Parameters</div>
            
            {endpoint.authRequired && (
              <div className="form-group">
                <label className="form-label">
                  <span>
                    <span className="param-label-name">X-API-Key</span>
                    <span className="req">*</span>
                  </span>
                  <span className="param-label-type">header (string)</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="smd_live_your_key_here"
                  value={apiKey}
                  onChange={(e) => handleApiKeyChange(e.target.value)}
                  required
                />
              </div>
            )}

            {endpoint.parameters.length === 0 ? (
              <div className="empty-params-info" style={{ marginTop: endpoint.authRequired ? 12 : 0 }}>
                This endpoint does not require any request body or parameters.
              </div>
            ) : (
              endpoint.parameters.map((param) => {
                const value = formState[param.name] || "";
                
                return (
                  <div key={param.name} className="form-group">
                    <label className="form-label">
                      <span>
                        <span className="param-label-name">{param.name}</span>
                        {param.required && <span className="req">*</span>}
                      </span>
                      <span className="param-label-type">{param.type}</span>
                    </label>

                    {/* Choose input type based on parameter name */}
                    {param.name === "model_name" ? (
                      <select
                        className="form-select"
                        value={value}
                        onChange={(e) => handleInputChange(param.name, e.target.value)}
                      >
                        <option value="fast">fast</option>
                        <option value="medium">medium</option>
                        <option value="quality">quality</option>
                      </select>
                    ) : param.name === "version" ? (
                      <select
                        className="form-select"
                        value={value}
                        onChange={(e) => handleInputChange(param.name, e.target.value)}
                      >
                        <option value="1.0">1.0</option>
                        <option value="1.1">1.1</option>
                      </select>
                    ) : param.name === "files" ? (
                      <input
                        type="file"
                        className="form-input"
                        multiple
                        onChange={(e) => {
                          const filesList = e.target.files;
                          if (filesList) {
                            setSelectedFiles(Array.from(filesList));
                          }
                        }}
                      />
                    ) : (
                      <input
                        type="text"
                        className="form-input"
                        placeholder={param.description}
                        value={value}
                        onChange={(e) => handleInputChange(param.name, e.target.value)}
                      />
                    )}
                  </div>
                );
              })
            )}

            <button type="submit" className="submit-btn glow-btn" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <PlayCircle size={16} />
                  Send Test Request
                </>
              )}
            </button>
          </form>

          {/* Interactive Console Response */}
          {(isLoading || responseReady) && (
            <div className="response-panel animate-fade-in">
              <div className="response-header">
                <span className="response-title">Console Output</span>
                {isLoading ? (
                  <span className="response-status text-orange">PENDING</span>
                ) : (
                  <span
                    className="response-status"
                    style={{ color: isResponseSuccess ? "hsl(var(--accent-green))" : "#ef4444" }}
                  >
                    {responseStatus}
                  </span>
                )}
              </div>
              <div className="response-content">
                {isLoading ? (
                  <div className="console-loader-wrapper">
                    <Loader2 size={24} className="animate-spin text-cyan" />
                    <span>Executing live API request on SMD backend...</span>
                  </div>
                ) : (
                  <pre className="code-block">
                    <code>{responseBody}</code>
                  </pre>
                )}
              </div>
              {responseReady && (
                <button
                  className="reset-console-btn"
                  onClick={() => setResponseReady(false)}
                >
                  <RefreshCw size={12} />
                  Clear Console Output
                </button>
              )}
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .playground-tabs-bar {
          display: flex;
          background-color: hsl(var(--bg-card-hover));
          border-bottom: 1px solid hsl(var(--border-color));
          padding: 6px 12px;
          gap: 8px;
        }

        .playground-tab-btn {
          padding: 8px 16px;
          font-family: var(--font-sora);
          font-size: 0.8rem;
          font-weight: 600;
          color: hsl(var(--text-secondary));
          border: 1px solid transparent;
          background: none;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border-radius: 6px;
        }

        .playground-tab-btn:hover {
          color: hsl(var(--text-primary));
        }

        .playground-tab-btn.active {
          color: hsl(var(--text-primary));
          background-color: hsl(var(--bg-card));
          border-color: hsl(var(--border-color));
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .console-section-title {
          font-family: var(--font-sora);
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: hsl(var(--text-secondary));
          margin-bottom: 8px;
          border-left: 2px solid hsl(var(--accent-cyan));
          padding-left: 8px;
        }

        .empty-params-info {
          font-size: 0.8rem;
          color: hsl(var(--text-muted));
          background-color: rgba(255, 255, 255, 0.02);
          border: 1px dashed hsl(var(--border-color));
          padding: 16px;
          border-radius: 6px;
          text-align: center;
        }

        .param-label-name {
          font-family: var(--font-code);
          color: hsl(var(--text-primary));
          font-weight: 600;
        }

        .param-label-type {
          font-family: var(--font-code);
          font-size: 0.7rem;
          color: hsl(var(--text-muted));
        }

        .mock-file-input-wrapper {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 12px;
          background-color: hsl(var(--bg-mock-file));
          border: 1px dashed hsl(var(--border-color));
          border-radius: 6px;
          font-size: 0.8rem;
        }

        .mock-file-name {
          color: hsl(var(--text-secondary));
        }

        .mock-file-badge {
          font-size: 0.65rem;
          font-weight: 700;
          background-color: hsl(var(--bg-code-panel));
          padding: 2px 6px;
          border-radius: 4px;
          color: hsl(var(--text-muted));
        }

        /* Response Panel */
        .response-panel {
          background-color: hsl(var(--bg-response-panel));
          border: 1px solid hsl(var(--border-color));
          border-radius: 8px;
          overflow: hidden;
          margin-top: 12px;
        }

        .response-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 16px;
          background-color: hsl(var(--bg-response-header));
          border-bottom: 1px solid hsl(var(--border-color));
        }

        .response-title {
          font-family: var(--font-sora);
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: hsl(var(--text-secondary));
        }

        .response-status {
          font-family: var(--font-code);
          font-size: 0.75rem;
          font-weight: 700;
        }

        .response-content {
          padding: 16px;
          max-height: 280px;
          overflow: auto;
          position: relative;
        }

        .console-loader-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 32px 0;
          font-size: 0.8rem;
          color: hsl(var(--text-secondary));
          text-align: center;
        }

        .reset-console-btn {
          margin: 8px 16px 12px;
          background: none;
          border: none;
          color: hsl(var(--text-muted));
          font-family: var(--font-jakarta);
          font-size: 0.75rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          align-self: flex-start;
          transition: color 0.2s ease;
        }

        .reset-console-btn:hover {
          color: hsl(var(--text-primary));
        }

        /* Animations */
        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
