import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Lightbulb, Check } from 'lucide-react';

export default function NumberLineVisual() {
  const [selectedNum, setSelectedNum] = useState(null);

  const numbers = [
    { val: -5, label: '−5', type: 'negative' },
    { val: -4, label: '−4', type: 'negative' },
    { val: -3, label: '−3', type: 'negative' },
    { val: -2, label: '−2', type: 'negative' },
    { val: -1, label: '−1', type: 'negative' },
    { val: 0, label: '0', type: 'zero' },
    { val: 1, label: '1', type: 'positive' },
    { val: 2, label: '2', type: 'positive' },
    { val: 3, label: '3', type: 'positive' },
    { val: 4, label: '4', type: 'positive' },
    { val: 5, label: '5', type: 'positive' },
  ];

  const centerX = 380;
  const step = 56;
  const lineY = 85;

  const getX = (val) => centerX + val * step;

  return (
    <div className="number-line-container">
      {/* Visual Header */}
      <div className="number-line-header">
        <span className="badge badge-sage">Ilustrasi Visual Interaktif</span>
        <h4 className="number-line-title">Garis Bilangan Bulat</h4>
        <p className="number-line-subtitle">
          Klik pada titik angka di bawah ini untuk melihat posisi dan nilainya pada garis bilangan.
        </p>
      </div>

      {/* SVG Number Line Canvas */}
      <div className="number-line-svg-wrapper">
        <svg
          viewBox="0 0 760 170"
          className="number-line-svg"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Arrow markers */}
            <marker
              id="arrow-left"
              viewBox="0 0 10 10"
              refX="3"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto"
            >
              <path d="M 10 0 L 0 5 L 10 10 z" fill="#334155" />
            </marker>
            <marker
              id="arrow-right"
              viewBox="0 0 10 10"
              refX="7"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#334155" />
            </marker>

            {/* Gradients */}
            <linearGradient id="neg-zone" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#EF4444" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#EF4444" stopOpacity="0.02" />
            </linearGradient>
            <linearGradient id="pos-zone" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.02" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.12" />
            </linearGradient>
          </defs>

          {/* Zone shading */}
          <rect x="70" y="25" width="290" height="95" rx="8" fill="url(#neg-zone)" />
          <rect x="400" y="25" width="290" height="95" rx="8" fill="url(#pos-zone)" />

          {/* Top Zone Headers */}
          <text x="215" y="44" textAnchor="middle" className="zone-label neg">
            ← Bilangan Bulat Negatif
          </text>
          <text x="380" y="22" textAnchor="middle" className="zone-label zero">
            Titik Acuan (0)
          </text>
          <text x="545" y="44" textAnchor="middle" className="zone-label pos">
            Bilangan Bulat Positif →
          </text>

          {/* Value Direction Indicators */}
          <g className="direction-indicator left">
            <path d="M 170 54 L 90 54" stroke="#DC2626" strokeWidth="1.5" markerEnd="url(#arrow-left)" />
            <text x="130" y="65" textAnchor="middle" fill="#DC2626" fontSize="11" fontWeight="600">
              Nilai semakin kecil
            </text>
          </g>

          <g className="direction-indicator right">
            <path d="M 590 54 L 670 54" stroke="#16A34A" strokeWidth="1.5" markerEnd="url(#arrow-right)" />
            <text x="630" y="65" textAnchor="middle" fill="#16A34A" fontSize="11" fontWeight="600">
              Nilai semakin besar
            </text>
          </g>

          {/* The Main Horizontal Axis */}
          <line
            x1="55"
            y1={lineY}
            x2="705"
            y2={lineY}
            stroke="#334155"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Arrowheads */}
          <path d="M 58 80 L 44 85 L 58 90 Z" fill="#334155" />
          <path d="M 702 80 L 716 85 L 702 90 Z" fill="#334155" />

          {/* Ticks and Number Markers */}
          {numbers.map((item) => {
            const x = getX(item.val);
            const isZero = item.val === 0;
            const isSelected = selectedNum === item.val;

            let color = '#475569';
            let dotColor = '#475569';
            if (item.type === 'negative') {
              color = '#DC2626';
              dotColor = '#EF4444';
            } else if (item.type === 'positive') {
              color = '#15803D';
              dotColor = '#10B981';
            } else {
              color = '#0F172A';
              dotColor = '#3B82F6';
            }

            return (
              <g
                key={item.val}
                className="number-tick-group"
                onClick={() => setSelectedNum(item.val)}
                style={{ cursor: 'pointer' }}
              >
                {/* Vertical tick line */}
                <line
                  x1={x}
                  y1={isZero ? lineY - 14 : lineY - 9}
                  x2={x}
                  y2={isZero ? lineY + 14 : lineY + 9}
                  stroke={isZero ? '#0F172A' : '#64748B'}
                  strokeWidth={isZero ? 3 : 2}
                />

                {/* Node circle on the line */}
                <circle
                  cx={x}
                  cy={lineY}
                  r={isSelected ? 7 : isZero ? 5 : 4}
                  fill={isSelected ? '#F59E0B' : dotColor}
                  stroke="#FFFFFF"
                  strokeWidth={2}
                />

                {/* Selection halo if active */}
                {isSelected && (
                  <circle
                    cx={x}
                    cy={lineY}
                    r="12"
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                )}

                {/* Number label below the tick */}
                <text
                  x={x}
                  y={lineY + 30}
                  textAnchor="middle"
                  fill={color}
                  fontSize={isZero ? '17' : '15'}
                  fontWeight={isZero || isSelected ? '800' : '700'}
                  fontFamily="'Plus Jakarta Sans', sans-serif"
                >
                  {item.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected Number Detail Callout */}
      {selectedNum !== null && (
        <div className="number-line-selected-info">
          <span className="selected-tag">
            {selectedNum < 0
              ? `Bilangan Negatif (${selectedNum})`
              : selectedNum > 0
              ? `Bilangan Positif (+${selectedNum})`
              : 'Bilangan Nol (Titik Acuan)'}
          </span>
          <p className="selected-explanation">
            {selectedNum < 0
              ? `Bilangan ${selectedNum} terletak ${Math.abs(selectedNum)} satuan di sebelah KIRI angka 0. Nilainya lebih kecil daripada 0.`
              : selectedNum > 0
              ? `Bilangan +${selectedNum} terletak ${selectedNum} satuan di sebelah KANAN angka 0. Nilainya lebih besar daripada 0.`
              : 'Angka 0 adalah titik pusat acuan pada garis bilangan. Bukan positif dan bukan negatif.'}
          </p>
        </div>
      )}

      {/* Mandatory Pedagogical Explanation Box */}
      <div className="number-line-explanation-card">
        <div className="explanation-icon-wrapper">
          <Lightbulb size={20} />
        </div>
        <div className="explanation-text-content">
          <h5 className="explanation-heading">Prinsip Pokok Garis Bilangan Bulat</h5>
          <p className="explanation-core-rule">
            "Semakin ke <strong>kanan</strong> posisi bilangan pada garis bilangan, semakin <strong>besar</strong> nilainya.
            Semakin ke <strong>kiri</strong>, semakin <strong>kecil</strong> nilainya."
          </p>

          <div className="comparison-chips-row">
            <div className="comp-chip">
              <span className="chip-expr">3 &gt; −8</span>
              <span className="chip-reason">(3 berada di kanan −8)</span>
            </div>
            <div className="comp-chip">
              <span className="chip-expr">−2 &gt; −5</span>
              <span className="chip-reason">(−2 berada di kanan −5)</span>
            </div>
            <div className="comp-chip">
              <span className="chip-expr">−7 &lt; −3</span>
              <span className="chip-reason">(−7 berada di kiri −3)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
