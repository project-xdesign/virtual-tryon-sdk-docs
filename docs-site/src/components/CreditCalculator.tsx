"use client";

import React, { useState } from "react";
import { MODEL_MATRIX } from "@/lib/docsData";
import { Calculator, HelpCircle, Check, Coins } from "lucide-react";

export default function CreditCalculator() {
  const [selectedVersion, setSelectedVersion] = useState("1.0 (Default)");
  const [selectedModel, setSelectedModel] = useState("medium");
  const [quantity, setQuantity] = useState(100);

  // Filter models based on selection
  const versions = Array.from(new Set(MODEL_MATRIX.map(m => m.version)));
  const currentModelData = MODEL_MATRIX.find(
    m => m.version === selectedVersion && m.modelName === selectedModel
  );

  const creditCost = currentModelData ? currentModelData.creditCost : 0;
  const totalCost = creditCost * quantity;

  return (
    <div className="calc-container">
      <div className="calc-header">
        <Calculator size={18} className="text-cyan" />
        <span className="calc-title">Interactive Credit Calculator</span>
      </div>

      <div className="calc-grid">
        {/* Settings Side */}
        <div className="calc-controls">
          {/* Version Select */}
          <div className="calc-field">
            <span className="calc-label">Select SDK Version</span>
            <div className="version-pill-group">
              {versions.map((ver, idx) => (
                <button
                  key={idx}
                  className={`version-pill-btn ${selectedVersion === ver ? "active" : ""}`}
                  onClick={() => {
                    setSelectedVersion(ver);
                    // Reset model name if not matching
                    const exists = MODEL_MATRIX.some(m => m.version === ver && m.modelName === selectedModel);
                    if (!exists) {
                      const firstVal = MODEL_MATRIX.find(m => m.version === ver);
                      if (firstVal) setSelectedModel(firstVal.modelName);
                    }
                  }}
                >
                  SDK {ver}
                </button>
              ))}
            </div>
          </div>

          {/* Model Name Select */}
          <div className="calc-field" style={{ marginTop: 20 }}>
            <span className="calc-label">Choose Model Speed & Quality</span>
            <div className="calc-options">
              {MODEL_MATRIX.filter(m => m.version === selectedVersion).map((model, idx) => {
                const isSelected = selectedModel === model.modelName;
                return (
                  <div
                    key={idx}
                    className={`calc-option ${isSelected ? "selected" : ""}`}
                    onClick={() => setSelectedModel(model.modelName)}
                  >
                    <div className="calc-option-left">
                      <div className="calc-option-title-row">
                        <span className="calc-option-title">{model.modelName}</span>
                        {isSelected && <Check size={14} className="text-indigo" />}
                      </div>
                      <span className="calc-option-sub">{model.description}</span>
                    </div>
                    <span className="calc-option-cost">
                      {model.creditCost.toFixed(2)} cr
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quantity Input */}
          <div className="calc-field" style={{ marginTop: 20 }}>
            <div className="quantity-label-row">
              <span className="calc-label">Number of Generations</span>
              <span className="quantity-value">{quantity.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="1"
              max="5000"
              step="50"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              className="quantity-slider"
            />
            <div className="quantity-inputs-row">
              <span className="slider-limit">1</span>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="quantity-num-input"
              />
              <span className="slider-limit">5,000</span>
            </div>
          </div>
        </div>

        {/* Results Side */}
        <div className="calc-results">
          <div className="calc-result-box">
            <Coins size={36} className="text-cyan" style={{ marginBottom: 12 }} />
            <span className="calc-result-val">{totalCost.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 })}</span>
            <span className="calc-result-lbl">Estimated Credits Billed</span>

            <div className="calc-divider" />

            <div className="calc-detail-rows">
              <div className="detail-row">
                <span className="detail-lbl">Cost per execution:</span>
                <span className="detail-val text-cyan">{creditCost} credits</span>
              </div>
              <div className="detail-row">
                <span className="detail-lbl">Model Tier:</span>
                <span className="detail-val" style={{ textTransform: "capitalize" }}>{selectedModel}</span>
              </div>
              <div className="detail-row">
                <span className="detail-lbl">SDK Version:</span>
                <span className="detail-val">{selectedVersion}</span>
              </div>
            </div>
          </div>

          {/* Info Card */}
          <div className="calc-info-card">
            <HelpCircle size={16} className="text-muted" style={{ flexShrink: 0, marginTop: 2 }} />
            <p className="calc-info-text">
              Accounts start with developer credits. Production-scale volumes can purchase credit top-ups in the developer dashboard starting from $10 for 100 credits.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .calc-container {
          background-color: hsl(var(--bg-card));
          border: 1px solid hsl(var(--border-color));
          border-radius: 12px;
          padding: 24px;
          margin: 32px 0;
          backdrop-filter: blur(8px);
        }

        .calc-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 24px;
          border-bottom: 1px solid hsl(var(--border-color));
          padding-bottom: 12px;
        }

        .calc-title {
          font-family: var(--font-sora);
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: hsl(var(--text-secondary));
        }

        .calc-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
        }

        @media (max-width: 768px) {
          .calc-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }

        .calc-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .calc-label {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: hsl(var(--text-muted));
        }

        .version-pill-group {
          display: flex;
          background-color: hsl(var(--bg-card-hover));
          border: 1px solid hsl(var(--border-color));
          border-radius: 8px;
          padding: 4px;
          gap: 4px;
        }

        .version-pill-btn {
          flex: 1;
          padding: 8px;
          border: none;
          background: none;
          border-radius: 6px;
          font-family: var(--font-sora);
          font-size: 0.75rem;
          font-weight: 600;
          color: hsl(var(--text-secondary));
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .version-pill-btn:hover {
          color: hsl(var(--text-primary));
        }

        .version-pill-btn.active {
          background-color: hsl(var(--bg-card));
          color: hsl(var(--accent-indigo));
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .calc-options {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .calc-option {
          padding: 12px 16px;
          background-color: hsl(var(--bg-card-hover));
          border: 1px solid hsl(var(--border-color));
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .calc-option:hover {
          border-color: hsl(var(--border-color-glow));
          background-color: rgba(0, 0, 0, 0.02);
        }

        :global(.dark) .calc-option:hover {
          background-color: rgba(255, 255, 255, 0.015);
        }

        .calc-option.selected {
          border-color: hsl(var(--accent-indigo));
          background-color: hsla(var(--accent-indigo), 0.05);
        }

        .calc-option-left {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .calc-option-title-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .calc-option-title {
          font-family: var(--font-sora);
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: capitalize;
        }

        .calc-option-sub {
          font-size: 0.75rem;
          color: hsl(var(--text-secondary));
          opacity: 0.8;
        }

        .calc-option-cost {
          font-family: var(--font-code);
          font-size: 0.85rem;
          font-weight: 700;
          color: hsl(var(--accent-cyan));
        }

        /* Quantity Slider */
        .quantity-label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .quantity-value {
          font-family: var(--font-sora);
          font-size: 0.95rem;
          font-weight: 800;
          color: hsl(var(--text-primary));
        }

        .quantity-slider {
          -webkit-appearance: none;
          width: 100%;
          height: 4px;
          border-radius: 2px;
          background: hsl(var(--border-color));
          outline: none;
          margin: 12px 0 8px;
        }

        .quantity-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: hsl(var(--accent-cyan));
          cursor: pointer;
          box-shadow: 0 0 8px hsla(var(--accent-cyan), 0.3);
          transition: transform 0.1s ease;
        }

        .quantity-slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }

        .quantity-inputs-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .slider-limit {
          font-size: 0.7rem;
          color: hsl(var(--text-muted));
        }

        .quantity-num-input {
          width: 70px;
          padding: 4px 8px;
          background-color: hsl(var(--bg-card));
          border: 1px solid hsl(var(--border-color));
          border-radius: 4px;
          color: hsl(var(--text-primary));
          font-family: var(--font-code);
          font-size: 0.75rem;
          text-align: center;
        }

        .quantity-num-input:focus {
          outline: none;
          border-color: hsl(var(--accent-cyan));
        }

        /* Result Panel */
        .calc-results {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .calc-result-box {
          background: linear-gradient(135deg, hsla(var(--accent-cyan), 0.05) 0%, hsla(var(--accent-indigo), 0.05) 100%);
          border: 1px solid hsla(var(--accent-indigo), 0.2);
          border-radius: 8px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .calc-result-val {
          font-family: var(--font-sora);
          font-size: 2.75rem;
          font-weight: 800;
          color: hsl(var(--accent-cyan));
          line-height: 1;
          margin-bottom: 4px;
          text-shadow: 0 0 10px hsla(var(--accent-cyan), 0.15);
        }

        .calc-result-lbl {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: hsl(var(--text-secondary));
          font-weight: 700;
          margin-bottom: 20px;
        }

        .calc-divider {
          width: 100%;
          height: 1px;
          background-color: hsl(var(--border-color));
          margin-bottom: 20px;
          opacity: 0.5;
        }

        .calc-detail-rows {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.8rem;
        }

        .detail-lbl {
          color: hsl(var(--text-muted));
        }

        .detail-val {
          font-weight: 500;
          color: hsl(var(--text-primary));
        }

        .detail-val.code-font {
          font-family: var(--font-code);
          font-size: 0.7rem;
          max-width: 150px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          background-color: rgba(0,0,0,0.05);
          padding: 2px 6px;
          border-radius: 4px;
          border: 1px solid hsl(var(--border-color));
        }

        :global(.dark) .detail-val.code-font {
          background-color: rgba(0,0,0,0.2);
        }

        .calc-info-card {
          background-color: hsl(var(--bg-card-hover));
          border: 1px solid hsl(var(--border-color));
          border-radius: 8px;
          padding: 12px 16px;
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }

        .calc-info-text {
          font-size: 0.75rem;
          color: hsl(var(--text-secondary));
          line-height: 1.45;
        }
      `}</style>
    </div>
  );
}
