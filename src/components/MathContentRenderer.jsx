import React, { useState } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import NumberLineVisual from './NumberLineVisual';
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Lightbulb,
  HelpCircle,
  Target,
  BookOpen,
  BookmarkCheck,
  Compass,
  Sparkles,
  Info
} from 'lucide-react';

// Safe LaTeX cleanup fallback in case KaTeX fails or for plain text
export function cleanMathFallback(str) {
  if (!str) return '';
  return str
    .replace(/\\mathbb\{Z\}/g, 'ℤ')
    .replace(/\\mathbb\{Q\}/g, 'ℚ')
    .replace(/\\mathbb\{R\}/g, 'ℝ')
    .replace(/\\mathbb\{N\}/g, 'ℕ')
    .replace(/\\times/g, ' × ')
    .replace(/\\div/g, ' ÷ ')
    .replace(/\\cdot/g, ' · ')
    .replace(/\\dots/g, '...')
    .replace(/\\ge/g, '≥')
    .replace(/\\le/g, '≤')
    .replace(/\\neq/g, '≠')
    .replace(/\\pm/g, '±')
    .replace(/\\circ/g, '°')
    .replace(/\\quad/g, '   ')
    .replace(/\\qquad/g, '      ')
    .replace(/\\enspace/g, ' ')
    .replace(/\\overline\{([^}]+)\}/g, '$1')
    .replace(/\\text\{([^}]+)\}/g, '$1')
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1 / $2)')
    .replace(/\\left\(/g, '(')
    .replace(/\\right\)/g, ')')
    .replace(/\\{/g, '{')
    .replace(/\\}/g, '}')
    .replace(/\\\\/g, '\n')
    .replace(/\\/g, ''); // strip any orphan backslashes
}

// Render KaTeX HTML safely
function renderKatexHtml(mathString, displayMode = false) {
  try {
    return katex.renderToString(mathString.trim(), {
      displayMode,
      throwOnError: false,
      strict: false,
      trust: true
    });
  } catch (err) {
    console.warn('KaTeX render error:', err);
    return null;
  }
}

export default function MathContentRenderer({ content, practiceAnswers }) {
  const [revealedAnswers, setRevealedAnswers] = useState({});

  const toggleAnswer = (num) => {
    setRevealedAnswers(prev => ({
      ...prev,
      [num]: !prev[num]
    }));
  };

  if (!content) return null;

  // Render inline math and text formatting ($...$, **...**, *...*)
  const renderInlineSegment = (text) => {
    if (!text) return null;

    // Check for inline math segments delimited by $
    const parts = text.split('$');
    return parts.map((part, pIdx) => {
      if (pIdx % 2 === 1) {
        // Odd index = math expression
        const katexHtml = renderKatexHtml(part, false);
        if (katexHtml) {
          return (
            <span
              key={`math-${pIdx}`}
              className="katex-inline"
              dangerouslySetInnerHTML={{ __html: katexHtml }}
            />
          );
        }
        return (
          <span key={`math-fb-${pIdx}`} className="math-fallback">
            {cleanMathFallback(part)}
          </span>
        );
      }

      // Even index = regular text with markdown bold / italic / code
      // Sanitize any stray LaTeX commands that were written without $
      let cleanedPart = part;
      if (cleanedPart.includes('\\')) {
        cleanedPart = cleanMathFallback(cleanedPart);
      }

      const boldParts = cleanedPart.split('**');
      return boldParts.map((bPart, bIdx) => {
        if (bIdx % 2 === 1) {
          return <strong key={`b-${bIdx}`} className="text-strong">{bPart}</strong>;
        }

        const italicParts = bPart.split('*');
        return italicParts.map((iPart, iIdx) => {
          if (iIdx % 2 === 1) {
            return <em key={`i-${iIdx}`} className="text-italic">{iPart}</em>;
          }
          return iPart;
        });
      });
    });
  };

  // Render markdown tables with enhanced styling
  const renderTable = (rows, key) => {
    if (rows.length < 2) return null;
    const headerRow = rows[0].split('|').filter(c => c.trim() !== '').map(c => c.trim());
    const dataRows = rows.slice(2).map(r => r.split('|').filter(c => c.trim() !== '').map(c => c.trim()));

    return (
      <div key={key} className="table-responsive-wrapper">
        <table className="lesson-styled-table">
          <thead>
            <tr>
              {headerRow.map((h, i) => (
                <th key={i}>{renderInlineSegment(h)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataRows.map((row, rIdx) => (
              <tr key={rIdx}>
                {row.map((cell, cIdx) => (
                  <td key={cIdx}>{renderInlineSegment(cell)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Main line-by-line parser for digital learning module
  const renderFormattedText = (rawText) => {
    const lines = rawText.split('\n');
    const elements = [];
    let tableRows = [];
    let inTable = false;

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      // Table handling
      if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
        inTable = true;
        tableRows.push(trimmed);
        return;
      } else if (inTable) {
        elements.push(renderTable(tableRows, `table-${index}`));
        tableRows = [];
        inTable = false;
      }

      // Blank spacing line
      if (trimmed === '') {
        elements.push(<div key={`sp-${index}`} className="module-paragraph-spacer" />);
        return;
      }

      // 1. NUMBER LINE ILLUSTRATION INTERCEPTION
      if (
        trimmed === '[ILUSTRASI: GARIS_BILANGAN_BULAT]' ||
        trimmed.includes('[ILUSTRASI: GARIS_BILANGAN_BULAT]') ||
        (trimmed.includes('Garis Bilangan') && trimmed.includes('\\overline{-5'))
      ) {
        elements.push(<NumberLineVisual key={`numline-${index}`} />);
        return;
      }

      // Check for standalone LaTeX line that attempted a number line with \overline
      if (trimmed.includes('\\overline') && trimmed.includes('-5') && trimmed.includes('5')) {
        elements.push(<NumberLineVisual key={`numline-legacy-${index}`} />);
        return;
      }

      // 2. BLOCK EQUATIONS ($$...$$)
      if (trimmed.startsWith('$$') && trimmed.endsWith('$$')) {
        const mathExpr = trimmed.slice(2, -2).trim();
        const katexHtml = renderKatexHtml(mathExpr, true);

        if (katexHtml) {
          elements.push(
            <div
              key={`math-block-${index}`}
              className="katex-display-wrapper"
              dangerouslySetInnerHTML={{ __html: katexHtml }}
            />
          );
        } else {
          elements.push(
            <div key={`math-block-fb-${index}`} className="katex-display-fallback">
              {cleanMathFallback(mathExpr)}
            </div>
          );
        }
        return;
      }

      // 3. SECTION HEADINGS WITH PEDAGOGICAL STYLING
      // Heading level 2 (## ...)
      if (trimmed.startsWith('## ')) {
        const titleText = trimmed.replace('## ', '');
        elements.push(
          <h2 key={`h2-${index}`} className="module-heading-2">
            {renderInlineSegment(titleText)}
          </h2>
        );
        return;
      }

      // Heading level 3 (### ...)
      if (trimmed.startsWith('### ')) {
        const titleText = trimmed.replace('### ', '');

        // Distinct styling for Tujuan Pembelajaran
        if (titleText.toLowerCase().includes('tujuan pembelajaran')) {
          elements.push(
            <div key={`obj-h-${index}`} className="module-section-badge-bar objective">
              <Target size={20} className="section-badge-icon" />
              <h3 className="module-section-title">{titleText}</h3>
            </div>
          );
          return;
        }

        // Distinct styling for Pengantar
        if (titleText.toLowerCase().includes('pengantar') || titleText.toLowerCase().includes('apersepsi')) {
          elements.push(
            <div key={`intro-h-${index}`} className="module-section-badge-bar intro">
              <Compass size={20} className="section-badge-icon" />
              <h3 className="module-section-title">{titleText}</h3>
            </div>
          );
          return;
        }

        // Distinct styling for Contoh Soal
        if (titleText.toLowerCase().includes('contoh soal')) {
          elements.push(
            <div key={`ex-h-${index}`} className="module-section-badge-bar example">
              <Sparkles size={20} className="section-badge-icon" />
              <h3 className="module-section-title">{titleText}</h3>
            </div>
          );
          return;
        }

        // Distinct styling for Ringkasan / Rangkuman
        if (titleText.toLowerCase().includes('ringkasan') || titleText.toLowerCase().includes('rangkuman')) {
          elements.push(
            <div key={`sum-h-${index}`} className="module-section-badge-bar summary">
              <BookmarkCheck size={20} className="section-badge-icon" />
              <h3 className="module-section-title">{titleText}</h3>
            </div>
          );
          return;
        }

        // Default H3
        elements.push(
          <h3 key={`h3-${index}`} className="module-heading-3">
            {renderInlineSegment(titleText)}
          </h3>
        );
        return;
      }

      // Heading level 4 (#### ...)
      if (trimmed.startsWith('#### ')) {
        elements.push(
          <h4 key={`h4-${index}`} className="module-heading-4">
            {renderInlineSegment(trimmed.replace('#### ', ''))}
          </h4>
        );
        return;
      }

      // Horizontal separator
      if (trimmed === '---' || trimmed === '***') {
        elements.push(<hr key={`hr-${index}`} className="module-divider" />);
        return;
      }

      // 4. CALLOUT BOX / BLOCKQUOTE (> ...)
      if (trimmed.startsWith('> ')) {
        const quoteText = trimmed.replace('> ', '');
        elements.push(
          <div key={`quote-${index}`} className="module-callout-card">
            <div className="callout-icon-box">
              <Lightbulb size={20} />
            </div>
            <div className="callout-content">
              {renderInlineSegment(quoteText)}
            </div>
          </div>
        );
        return;
      }

      // 5. LIST ITEMS (UNORDERED: - or *)
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const itemText = trimmed.substring(2);
        elements.push(
          <div key={`li-${index}`} className="module-list-item">
            <span className="module-list-bullet">•</span>
            <div className="module-list-text">
              {renderInlineSegment(itemText)}
            </div>
          </div>
        );
        return;
      }

      // 6. ORDERED LIST ITEMS (1. 2. 3.)
      if (/^\d+\.\s/.test(trimmed)) {
        const match = trimmed.match(/^(\d+)\.\s(.*)$/);
        elements.push(
          <div key={`nli-${index}`} className="module-ordered-item">
            <span className="module-ordered-badge">{match[1]}</span>
            <div className="module-ordered-text">
              {renderInlineSegment(match[2])}
            </div>
          </div>
        );
        return;
      }

      // 7. REGULAR PARAGRAPH
      elements.push(
        <p key={`p-${index}`} className="module-paragraph">
          {renderInlineSegment(trimmed)}
        </p>
      );
    });

    if (inTable && tableRows.length > 0) {
      elements.push(renderTable(tableRows, 'table-end'));
    }

    return elements;
  };

  return (
    <div className="module-content-renderer">
      {/* Formatted Content */}
      <div className="module-body-content">
        {renderFormattedText(content)}
      </div>

      {/* Interactive Practice Answers Accordion */}
      {practiceAnswers && practiceAnswers.length > 0 && (
        <div className="module-practice-container">
          <div className="module-practice-header">
            <div className="practice-header-badge">
              <HelpCircle size={20} />
            </div>
            <div>
              <h3 className="practice-header-title">
                Latihan Mandiri &amp; Kunci Pembahasan
              </h3>
              <p className="practice-header-desc">
                Kerjakan latihan secara mandiri terlebih dahulu, lalu buka pembahasan langkah demi langkah untuk memeriksa jawabanmu.
              </p>
            </div>
          </div>

          <div className="module-practice-list">
            {practiceAnswers.map((item) => {
              const isOpen = !!revealedAnswers[item.number];
              return (
                <div key={item.number} className={`practice-accordion-item ${isOpen ? 'open' : ''}`}>
                  <button
                    onClick={() => toggleAnswer(item.number)}
                    className="practice-accordion-trigger"
                    aria-expanded={isOpen}
                  >
                    <div className="practice-trigger-left">
                      <span className="badge badge-sage">Soal #{item.number}</span>
                      <span className="practice-question-text">
                        {renderInlineSegment(item.question)}
                      </span>
                    </div>
                    <div className="practice-trigger-right">
                      <span className="practice-toggle-label">{isOpen ? 'Tutup' : 'Lihat Solusi'}</span>
                      {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="practice-accordion-body">
                      <div className="practice-answer-key">
                        <CheckCircle2 size={18} className="key-icon" />
                        <span className="key-label">Kunci Jawaban:</span>
                        <span className="key-value">{renderInlineSegment(item.answer)}</span>
                      </div>
                      <div className="practice-step-solution">
                        <div className="step-title">💡 Langkah Pembahasan Bertahap:</div>
                        <div className="step-detail">{renderInlineSegment(item.step)}</div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
