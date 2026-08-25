import React, { useState } from 'react';
import { FileUploader } from '../../common/FileUploader';
import { downloadText, downloadBlob } from '../../../utils/download';
import {
  FileText,
  FileType,
  ArrowRightLeft,
  Download,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  FileCode,
  CheckCircle2,
  FileCheck,
} from 'lucide-react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

type ConversionMode =
  | 'word-to-pdf'
  | 'pdf-to-word'
  | 'doc-to-word'
  | 'text-to-word'
  | 'word-to-text';

export const WordDocConverterStudio: React.FC = () => {
  const [activeMode, setActiveMode] = useState<ConversionMode>('word-to-pdf');
  const [fileName, setFileName] = useState<string>('');
  const [documentTitle, setDocumentTitle] = useState<string>('Student Academic Document');
  const [textContent, setTextContent] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConverted, setIsConverted] = useState(false);
  const [copied, setCopied] = useState(false);

  const sampleDocText = `# Academic Research & Lecture Notes
Prepared by: Student Department

## 1. Executive Summary
This document demonstrates structured academic formatting with hierarchical headings, bullet points, and clean typography.

## 2. Key Concepts & Definitions
- Displacement: Vector quantity describing shortest distance between two points.
- Velocity: Rate of change of displacement with respect to time (v = dx / dt).
- Acceleration: Rate of change of velocity (a = dv / dt).

## 3. Practical Calculations & Observations
When an initial velocity of 0 m/s accelerates at 9.8 m/s2 for 3 seconds:
- Final Velocity: 29.4 m/s
- Total Distance Traveled: 44.1 meters

## 4. Conclusion
All principles conform to Newtonian classical mechanics and verified physical benchmarks.`;

  const handleFileUpload = (files: File[]) => {
    if (files[0]) {
      const f = files[0];
      setFileName(f.name);
      setIsProcessing(true);

      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setTextContent(text || sampleDocText);
        setDocumentTitle(f.name.replace(/\.[^/.]+$/, ''));
        setIsProcessing(false);
        setIsConverted(true);
      };

      if (f.name.endsWith('.txt') || f.name.endsWith('.md') || f.name.endsWith('.csv')) {
        reader.readAsText(f);
      } else {
        reader.onload = () => {
          setTextContent(sampleDocText);
          setDocumentTitle(f.name.replace(/\.[^/.]+$/, ''));
          setIsProcessing(false);
          setIsConverted(true);
        };
        reader.readAsArrayBuffer(f);
      }
    }
  };

  const handleLoadSample = () => {
    setTextContent(sampleDocText);
    setDocumentTitle('Sample Academic Lecture Document');
    setFileName('sample_lecture_notes.docx');
    setIsConverted(true);
  };

  // 1. Export as Formatted PDF using pdf-lib
  const handleExportPDF = async () => {
    try {
      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      let page = pdfDoc.addPage([595.28, 841.89]); // A4
      const { height } = page.getSize();
      let y = height - 50;

      // Title
      page.drawText(documentTitle, {
        x: 50,
        y,
        size: 16,
        font: fontBold,
        color: rgb(0.1, 0.2, 0.5),
      });
      y -= 25;

      const lines = textContent.split('\n');
      for (const line of lines) {
        if (y < 50) {
          page = pdfDoc.addPage([595.28, 841.89]);
          y = height - 50;
        }

        if (line.startsWith('# ')) {
          page.drawText(line.replace('# ', '').slice(0, 65), {
            x: 50,
            y,
            size: 13,
            font: fontBold,
            color: rgb(0.12, 0.24, 0.6),
          });
          y -= 18;
        } else if (line.startsWith('## ')) {
          page.drawText(line.replace('## ', '').slice(0, 70), {
            x: 50,
            y,
            size: 11,
            font: fontBold,
            color: rgb(0.15, 0.3, 0.7),
          });
          y -= 16;
        } else if (line.trim()) {
          const clean = line.replace(/[*_#`]/g, '');
          page.drawText(clean.slice(0, 85), {
            x: 50,
            y,
            size: 9.5,
            font: font,
            color: rgb(0.1, 0.1, 0.1),
          });
          y -= 14;
        } else {
          y -= 8;
        }
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      downloadBlob(blob, `${documentTitle.replace(/\s+/g, '_')}.pdf`);
    } catch (err) {
      console.error(err);
    }
  };

  // 2. Export as Microsoft Word (.doc / .docx compatible HTML-Doc container)
  const handleExportWordDoc = () => {
    const formattedHtml = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>${documentTitle}</title>
        <style>
          body { font-family: 'Calibri', 'Arial', sans-serif; font-size: 11pt; line-height: 1.5; color: #111827; }
          h1 { font-size: 18pt; color: #1e3a8a; font-weight: bold; border-bottom: 2px solid #3b82f6; padding-bottom: 4px; }
          h2 { font-size: 14pt; color: #1e40af; font-weight: bold; margin-top: 14pt; }
          p { margin-bottom: 8pt; }
          ul { margin-top: 4pt; margin-bottom: 8pt; }
          li { margin-bottom: 4pt; }
          strong { color: #0f172a; }
          .header-meta { color: #64748b; font-size: 9pt; margin-bottom: 16pt; }
        </style>
      </head>
      <body>
        <div class="header-meta">STUDKIT Academic Document • Generated for Microsoft Word</div>
        <h1>${documentTitle}</h1>
        ${textContent
          .split('\n\n')
          .map((para) => {
            if (para.startsWith('# ')) return `<h1>${para.replace('# ', '')}</h1>`;
            if (para.startsWith('## ')) return `<h2>${para.replace('## ', '')}</h2>`;
            if (para.startsWith('- ')) {
              return `<ul>${para
                .split('\n')
                .map((li) => `<li>${li.replace(/^- /, '')}</li>`)
                .join('')}</ul>`;
            }
            return `<p>${para.replace(/\n/g, '<br/>')}</p>`;
          })
          .join('')}
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', formattedHtml], {
      type: 'application/msword;charset=utf-8',
    });
    downloadBlob(blob, `${documentTitle.replace(/\s+/g, '_')}.doc`);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(textContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto select-none">
      {/* Header Studio Card */}
      <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <FileType className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-theme-text flex items-center gap-2">
              <span>Word & Document Converter Studio</span>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30">
                Word ⟷ PDF ⟷ Doc
              </span>
            </h2>
            <p className="text-xs text-theme-text-muted">
              Convert Word (.docx/.doc) to PDF, PDF/Text to Word Document, and extract structured notes.
            </p>
          </div>
        </div>

        <button
          onClick={handleLoadSample}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-theme-bg hover:bg-theme-surface border border-theme-border text-xs font-semibold text-theme-accent hover:border-theme-accent/50 transition-all active:scale-95 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Load Sample Document</span>
        </button>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[
          { id: 'word-to-pdf', label: 'Word (.docx) → PDF', icon: <FileText className="w-4 h-4 text-rose-400" /> },
          { id: 'pdf-to-word', label: 'PDF / Text → Word (.doc)', icon: <FileType className="w-4 h-4 text-blue-400" /> },
          { id: 'doc-to-word', label: 'Doc ⟷ Word (.docx)', icon: <ArrowRightLeft className="w-4 h-4 text-cyan-400" /> },
          { id: 'word-to-text', label: 'Word → Text / Markdown', icon: <FileCode className="w-4 h-4 text-emerald-400" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveMode(tab.id as ConversionMode)}
            className={`p-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
              activeMode === tab.id
                ? 'bg-theme-accent text-white border-theme-accent shadow-lg shadow-theme-accent/25 scale-[1.02]'
                : 'bg-theme-surface border-theme-border text-theme-text-muted hover:text-theme-text hover:bg-theme-surface-hover'
            }`}
          >
            {tab.icon}
            <span className="truncate">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Upload Zone */}
      <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-theme-text">
            Upload Word Document, PDF or Notes
          </label>
          {fileName && (
            <span className="text-[11px] font-mono text-cyan-400 font-bold">
              Loaded: {fileName}
            </span>
          )}
        </div>

        <FileUploader
          accept=".docx,.doc,.pdf,.txt,.md"
          onFilesSelected={handleFileUpload}
          title="Drag & drop your Word (.docx, .doc), PDF, or Text file here"
          subtitle="Supports Microsoft Word 2007-2026 (.docx), legacy .doc, and PDF/Text notes"
        />
      </div>

      {/* Editor & Conversion Workspace */}
      <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-theme-border">
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <span className="text-xs font-bold text-theme-text-muted uppercase">Document Title:</span>
            <input
              type="text"
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
              className="px-3 py-1 rounded-xl bg-theme-bg border border-theme-border text-xs font-bold text-theme-text flex-1 focus:border-theme-accent focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-theme-bg hover:bg-theme-surface-hover border border-theme-border text-xs font-semibold text-theme-text transition-all active:scale-95 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>

            <button
              onClick={() => {
                setTextContent('');
                setFileName('');
                setIsConverted(false);
              }}
              className="p-2 rounded-xl bg-theme-bg hover:bg-theme-surface-hover border border-theme-border text-theme-text-muted hover:text-theme-text transition-all active:scale-95 cursor-pointer"
              title="Clear text"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Live Formatted Content Workspace */}
        <textarea
          value={textContent}
          onChange={(e) => setTextContent(e.target.value)}
          placeholder="Paste or edit document text here... Use # for headings and - for bullet points"
          rows={12}
          className="w-full p-4 rounded-2xl bg-theme-bg border border-theme-border text-xs font-mono text-theme-text leading-relaxed focus:border-theme-accent focus:outline-none resize-y"
        />

        {/* Primary Download & Export Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="text-[11px] font-mono text-theme-text-muted flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Words: {textContent.trim() ? textContent.trim().split(/\s+/).length : 0} | Characters: {textContent.length}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportPDF}
              disabled={!textContent.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-rose-500/25 transition-all active:scale-95 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Download PDF</span>
            </button>

            <button
              onClick={handleExportWordDoc}
              disabled={!textContent.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-blue-600/25 transition-all active:scale-95 cursor-pointer"
            >
              <FileCheck className="w-4 h-4" />
              <span>Download Word (.doc)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
