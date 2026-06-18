"use client";

import React, { useState } from "react";
import { WORKFLOW_STEPS } from "@/lib/docsData";
import { ArrowRight, CheckCircle2, CloudLightning, FileJson, Server } from "lucide-react";

export default function SequenceDiagram() {
  const [activeStep, setActiveStep] = useState(0);

  const getStepIcon = (idx: number) => {
    switch (idx) {
      case 0:
        return <CloudLightning size={20} />;
      case 1:
        return <Server size={20} />;
      case 2:
        return <FileJson size={20} />;
      default:
        return <CheckCircle2 size={20} />;
    }
  };

  return (
    <div className="sequence-container">
      {/* Interaction Title */}
      <div className="sequence-interactive-header">
        <p className="sequence-label">Interactive Integration Flow</p>
        <span className="sequence-tip-badge">Click steps to inspect details</span>
      </div>

      {/* Vertical Interactive Flow */}
      <div className="sequence-flow">
        {WORKFLOW_STEPS.map((step, idx) => {
          const isActive = idx === activeStep;
          return (
            <div
              key={idx}
              className={`sequence-step ${isActive ? "active" : ""}`}
              onClick={() => setActiveStep(idx)}
            >
              <div className="sequence-node">
                {getStepIcon(idx)}
              </div>
              <div className="sequence-content">
                <div className="sequence-step-title">
                  <span>Step {step.step}: {step.title}</span>
                  <span className="sequence-badge">{step.endpoint}</span>
                </div>
                <p className="sequence-desc">{step.description}</p>
                
                {isActive && (
                  <div className="sequence-expanded-meta animate-slide-down">
                    <div className="expanded-meta-grid">
                      <div className="expanded-meta-item">
                        <span className="meta-label">Request Type</span>
                        <code className="meta-code">{step.payload}</code>
                      </div>
                      <div className="expanded-meta-item">
                        <span className="meta-label">Output Result</span>
                        <code className="meta-code text-cyan">{step.result}</code>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Horizontal workflow line animation visualizer */}
      <div className="visualizer-container">
        <div className="visualizer-actors">
          <div className="actor-box">
            <span className="actor-icon">💻</span>
            <span className="actor-name">Client App</span>
          </div>
          <div className="actor-bridge-line">
            <div className={`bridge-pulse step-${activeStep}`} />
          </div>
          <div className="actor-box">
            <span className="actor-icon">⚡</span>
            <span className="actor-name">SMD Gateway</span>
          </div>
          <div className="actor-bridge-line">
            <div className={`bridge-pulse second step-${activeStep}`} />
          </div>
          <div className="actor-box">
            <span className="actor-icon">🧠</span>
            <span className="actor-name">AI Platform</span>
          </div>
        </div>

        <div className="visualizer-detail">
          <div className="detail-step-badge">Visual Transaction</div>
          <p className="detail-step-text">
            {activeStep === 0 && "Client sends multipart binary files directly to the secure SMD Gateway. The gateway stores assets and returns permanent cloud URLs."}
            {activeStep === 1 && "Client passes the cloud URLs to the generate endpoint. The gateway deducts credits, spins up FLUX/Pruna AI workers, and streams back the high-resolution output URL."}
            {activeStep === 2 && "Client checks credit balances, logs product SKU catalogs, and audits histories for administrative dashboards."}
          </p>
        </div>
      </div>

      <style jsx>{`
        .sequence-container {
          margin: 32px 0;
        }

        .sequence-interactive-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          border-bottom: 1px solid hsl(var(--border-color));
          padding-bottom: 12px;
        }

        .sequence-label {
          font-family: var(--font-sora);
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: hsl(var(--text-secondary));
        }

        .sequence-tip-badge {
          font-size: 0.75rem;
          background-color: rgba(0, 242, 254, 0.08);
          border: 1px solid rgba(0, 242, 254, 0.2);
          color: hsl(var(--accent-cyan));
          padding: 2px 8px;
          border-radius: 4px;
          font-weight: 500;
        }

        .sequence-expanded-meta {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid hsl(var(--border-color));
        }

        .expanded-meta-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        @media (max-width: 600px) {
          .expanded-meta-grid {
            grid-template-columns: 1fr;
          }
        }

        .expanded-meta-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .meta-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: hsl(var(--text-muted));
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }

        .meta-code {
          font-family: var(--font-code);
          font-size: 0.75rem;
          background-color: rgba(0, 0, 0, 0.3);
          border: 1px solid hsl(var(--border-color));
          padding: 6px 10px;
          border-radius: 4px;
          line-height: 1.4;
          white-space: pre-wrap;
          word-break: break-all;
        }

        /* Web Transaction Visualizer */
        .visualizer-container {
          margin-top: 36px;
          background-color: rgba(15, 15, 18, 0.6);
          border: 1px solid hsl(var(--border-color));
          border-radius: 12px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .visualizer-actors {
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
        }

        .actor-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          z-index: 2;
          width: 90px;
        }

        .actor-icon {
          font-size: 1.5rem;
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background-color: hsl(var(--bg-card));
          border: 1px solid hsl(var(--border-color));
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        }

        .actor-name {
          font-family: var(--font-sora);
          font-size: 0.75rem;
          font-weight: 600;
          color: hsl(var(--text-secondary));
        }

        .actor-bridge-line {
          flex-grow: 1;
          height: 2px;
          background-color: hsl(var(--border-color));
          margin: 0 12px;
          position: relative;
          margin-top: -24px;
        }

        .bridge-pulse {
          position: absolute;
          top: -3px;
          left: 0;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: hsl(var(--accent-cyan));
          box-shadow: 0 0 10px hsl(var(--accent-cyan));
        }

        /* Keyframes for active step line pulses */
        .bridge-pulse.step-0 {
          animation: pulseLeftToRight 1.5s infinite linear;
        }

        .bridge-pulse.step-1 {
          animation: pulseLeftToRight 2s infinite linear;
          background-color: hsl(var(--accent-indigo));
          box-shadow: 0 0 10px hsl(var(--accent-indigo));
        }

        .bridge-pulse.second.step-1 {
          animation: pulseLeftToRight 2s infinite linear;
          animation-delay: 1s;
          background-color: hsl(var(--accent-cyan));
          box-shadow: 0 0 10px hsl(var(--accent-cyan));
        }

        .bridge-pulse.step-2 {
          animation: pulseRightToLeft 1.8s infinite linear;
          background-color: hsl(var(--accent-purple));
          box-shadow: 0 0 10px hsl(var(--accent-purple));
        }

        @keyframes pulseLeftToRight {
          0% { left: 0%; opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }

        @keyframes pulseRightToLeft {
          0% { left: 100%; opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { left: 0%; opacity: 0; }
        }

        .visualizer-detail {
          background-color: rgba(0, 0, 0, 0.2);
          border-radius: 8px;
          padding: 12px 16px;
          border-left: 3px solid hsl(var(--accent-cyan));
        }

        .detail-step-badge {
          font-family: var(--font-sora);
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          color: hsl(var(--accent-cyan));
          letter-spacing: 0.05em;
          margin-bottom: 4px;
        }

        .detail-step-text {
          font-size: 0.8rem;
          color: hsl(var(--text-secondary));
          line-height: 1.45;
        }

        .animate-slide-down {
          animation: slideDown 0.25s ease-out forwards;
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
