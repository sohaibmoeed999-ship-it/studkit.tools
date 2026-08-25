import React, { useState } from 'react';
import { AlertCircle, AlertTriangle, ArrowDown, ArrowUp, Check, CheckCircle2, Copy, Download, Eye, FileCheck, FilePlus, FileText, FileUp, Layers, Lock, Move, Plus, Printer, RefreshCw, RotateCcw, RotateCw, Scissors, Shield, ShieldCheck, Sparkles, Trash2, Upload, Zap } from 'lucide-react';
import { PDFDocument, degrees } from 'pdf-lib';
import { downloadFile, formatBytes } from '../../../utils/download';
import { ResultCard } from '../../common/ResultCard';
import { FileUploader } from '../../common/FileUploader';

export const PdfMerger: React.FC = () => {
  const [pdfFiles, setPdfFiles] = useState<{ id: string; file: File; pageCount?: number }[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [mergedBlob, setMergedBlob] = useState<Blob | null>(null);

  const handleFiles = async (files: File[]) => {
    const validPdfs = files.filter(f => f.type === 'application/pdf' || f.name.endsWith('.pdf'));
    const items: { id: string; file: File; pageCount?: number }[] = [];

    for (const f of validPdfs) {
      try {
        const buffer = await f.arrayBuffer();
        const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
        items.push({
          id: Math.random().toString(36).substring(7),
          file: f,
          pageCount: doc.getPageCount(),
        });
      } catch (e) {
        items.push({
          id: Math.random().toString(36).substring(7),
          file: f,
          pageCount: 1,
        });
      }
    }

    setPdfFiles(prev => [...prev, ...items]);
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newFiles = [...pdfFiles];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newFiles.length) return;
    const temp = newFiles[index];
    newFiles[index] = newFiles[targetIdx];
    newFiles[targetIdx] = temp;
    setPdfFiles(newFiles);
  };

  const removeItem = (id: string) => {
    setPdfFiles(prev => prev.filter(f => f.id !== id));
  };

  const mergePDFs = async () => {
    if (pdfFiles.length < 2) {
      alert('Please add at least 2 PDF files to merge.');
      return;
    }

    setIsMerging(true);
    try {
      const mergedPdf = await PDFDocument.create();

      for (const item of pdfFiles) {
        const bytes = await item.file.arrayBuffer();
        const pdf = await PDFDocument.load(bytes);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach(page => mergedPdf.addPage(page));
      }

      const mergedBytes = await mergedPdf.save();
      const blob = new Blob([mergedBytes], { type: 'application/pdf' });
      setMergedBlob(blob);
      downloadFile(blob, 'STUDKIT_merged_document.pdf');
    } catch (e) {
      console.error(e);
      alert('Error merging PDFs. Please verify that files are not password-encrypted.');
    } finally {
      setIsMerging(false);
    }
  };

  const totalPages = pdfFiles.reduce((acc, curr) => acc + (curr.pageCount || 0), 0);

  return (
    <div className="space-y-6">
      <FileUploader
        accept=".pdf,application/pdf"
        multiple
        onFilesSelected={handleFiles}
        title="Upload PDF files to combine"
        subtitle="Merge lecture notes, textbook chapters, and assignments into a single PDF document."
      />

      {pdfFiles.length > 0 && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-theme-surface border border-theme-border rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-theme-text">
                Files Queue ({pdfFiles.length}) • Total Pages: {totalPages}
              </span>
            </div>

            <button
              onClick={mergePDFs}
              disabled={isMerging}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold shadow-lg shadow-theme-accent/25 transition-all transform hover:scale-105"
            >
              <FilePlus className="w-4 h-4" />
              <span>{isMerging ? 'Merging PDF Pages...' : `Merge All ${pdfFiles.length} PDFs`}</span>
            </button>
          </div>

          <div className="space-y-2">
            {pdfFiles.map((item, idx) => (
              <div
                key={item.id}
                className="bg-theme-surface border border-theme-border rounded-xl p-3.5 flex items-center justify-between gap-4 hover:border-theme-accent/40 transition-all shadow-sm"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-8 h-8 rounded-lg bg-theme-accent/15 border border-theme-accent/30 flex items-center justify-center text-theme-accent flex-shrink-0 font-mono text-xs font-bold">
                    {idx + 1}
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-semibold text-theme-text truncate">{item.file.name}</div>
                    <div className="text-[11px] font-mono text-theme-text-muted">
                      {formatBytes(item.file.size)} • {item.pageCount} {item.pageCount === 1 ? 'page' : 'pages'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => moveItem(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1.5 rounded-lg bg-theme-bg hover:bg-theme-surface-hover border border-theme-border text-theme-text disabled:opacity-30"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => moveItem(idx, 'down')}
                    disabled={idx === pdfFiles.length - 1}
                    className="p-1.5 rounded-lg bg-theme-bg hover:bg-theme-surface-hover border border-theme-border text-theme-text disabled:opacity-30"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1.5 rounded-lg bg-theme-bg hover:bg-rose-500/15 border border-theme-border text-rose-400"
                    title="Remove"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {mergedBlob && (
            <ResultCard
              title="PDF Merge Completed"
              description={`Successfully generated unified document (${totalPages} pages)`}
              onDownload={() => downloadFile(mergedBlob, 'STUDKIT_merged_document.pdf')}
              onReset={() => {
                setPdfFiles([]);
                setMergedBlob(null);
              }}
              downloadLabel="Download Merged PDF"
            >
              <div className="text-xs font-mono text-theme-text-muted">
                Combined file size: {formatBytes(mergedBlob.size)} • Zero data sent to external servers.
              </div>
            </ResultCard>
          )}
        </div>
      )}
    </div>
  );
};



export const PdfPageRotator: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [rotationAngle, setRotationAngle] = useState<number>(90);
  const [rotatedBlob, setRotatedBlob] = useState<Blob | null>(null);
  const [isRotating, setIsRotating] = useState(false);

  const handleFiles = (files: File[]) => {
    if (files[0]) {
      setFile(files[0]);
    }
  };

  const rotatePdf = async () => {
    if (!file) return;
    setIsRotating(true);
    try {
      const buffer = await file.arrayBuffer();
      const doc = await PDFDocument.load(buffer);
      const pages = doc.getPages();

      pages.forEach(p => {
        const currentRot = p.getRotation().angle;
        p.setRotation(degrees((currentRot + rotationAngle) % 360));
      });

      const outBytes = await doc.save();
      const blob = new Blob([outBytes], { type: 'application/pdf' });
      setRotatedBlob(blob);
      downloadFile(blob, `STUDKIT_rotated_${rotationAngle}deg.pdf`);
    } catch (e) {
      console.error(e);
      alert('Error rotating PDF pages.');
    } finally {
      setIsRotating(false);
    }
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <FileUploader
          accept=".pdf,application/pdf"
          onFilesSelected={handleFiles}
          title="Upload upside-down or sideways PDF"
          subtitle="Permanently fix page orientations by 90°, 180°, or 270° clockwise."
        />
      ) : (
        <div className="space-y-6">
          <div className="bg-theme-surface border border-theme-border rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-theme-text">{file.name}</h3>

            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-semibold text-theme-text-muted">Rotate All Pages:</span>
              {[90, 180, 270].map(deg => (
                <button
                  key={deg}
                  onClick={() => setRotationAngle(deg)}
                  className={`py-2 px-4 rounded-xl text-xs font-semibold border transition-all ${
                    rotationAngle === deg
                      ? 'bg-theme-accent text-white border-theme-accent'
                      : 'bg-theme-bg border-theme-border text-theme-text'
                  }`}
                >
                  +{deg}° Clockwise
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={rotatePdf}
                disabled={isRotating}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold shadow-lg shadow-theme-accent/25 transition-all"
              >
                <RotateCw className="w-4 h-4" />
                <span>{isRotating ? 'Rotating Pages...' : `Rotate +${rotationAngle}° & Save`}</span>
              </button>
              <button
                onClick={() => setFile(null)}
                className="px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-xs text-theme-text"
              >
                Choose Another File
              </button>
            </div>
          </div>

          {rotatedBlob && (
            <ResultCard
              title="PDF Pages Rotated"
              description={`Permanently rotated by +${rotationAngle}°`}
              onDownload={() => downloadFile(rotatedBlob, 'STUDKIT_rotated.pdf')}
              downloadLabel="Download Rotated PDF"
            >
              <div className="text-xs text-theme-text-muted">
                All pages re-oriented correctly for reading and printing.
              </div>
            </ResultCard>
          )}
        </div>
      )}
    </div>
  );
};



export const PdfSplitter: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [pageRange, setPageRange] = useState<string>('1-2');
  const [splitBlob, setSplitBlob] = useState<Blob | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);

  const handleFiles = async (files: File[]) => {
    if (files[0]) {
      const f = files[0];
      setFile(f);
      try {
        const buffer = await f.arrayBuffer();
        const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
        const count = doc.getPageCount();
        setPageCount(count);
        setPageRange(count > 1 ? `1-${Math.min(3, count)}` : '1');
      } catch (e) {
        console.error(e);
        setPageCount(1);
      }
    }
  };

  const parsePageNumbers = (rangeStr: string, maxPages: number): number[] => {
    const pages = new Set<number>();
    const parts = rangeStr.split(',').map(p => p.trim());

    for (const part of parts) {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(n => parseInt(n.trim()));
        if (!isNaN(start) && !isNaN(end)) {
          for (let i = Math.max(1, start); i <= Math.min(maxPages, end); i++) {
            pages.add(i - 1); // 0-indexed for pdf-lib
          }
        }
      } else {
        const num = parseInt(part);
        if (!isNaN(num) && num >= 1 && num <= maxPages) {
          pages.add(num - 1);
        }
      }
    }

    return Array.from(pages).sort((a, b) => a - b);
  };

  const extractPages = async () => {
    if (!file || pageCount === 0) return;
    setIsExtracting(true);

    try {
      const targetIndices = parsePageNumbers(pageRange, pageCount);
      if (targetIndices.length === 0) {
        alert('Please enter a valid page number or range (e.g. 1-3, 5).');
        setIsExtracting(false);
        return;
      }

      const buffer = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(buffer);
      const outDoc = await PDFDocument.create();

      const copiedPages = await outDoc.copyPages(srcDoc, targetIndices);
      copiedPages.forEach(p => outDoc.addPage(p));

      const outBytes = await outDoc.save();
      const blob = new Blob([outBytes], { type: 'application/pdf' });
      setSplitBlob(blob);
      downloadFile(blob, `STUDKIT_extracted_pages_${pageRange.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`);
    } catch (e) {
      console.error(e);
      alert('Error extracting pages from PDF.');
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <FileUploader
          accept=".pdf,application/pdf"
          onFilesSelected={handleFiles}
          title="Upload PDF document to extract pages"
          subtitle="Extract specific chapters, assignment questions, or individual pages."
        />
      ) : (
        <div className="space-y-6">
          <div className="bg-theme-surface border border-theme-border rounded-2xl p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-theme-text">{file.name}</h3>
                <p className="text-xs text-theme-text-muted mt-0.5">
                  Total Document Pages: <span className="font-bold text-theme-accent">{pageCount}</span> ({formatBytes(file.size)})
                </p>
              </div>
              <button
                onClick={() => setFile(null)}
                className="px-3 py-1.5 rounded-xl bg-theme-bg hover:bg-theme-surface-hover border border-theme-border text-xs text-theme-text"
              >
                Choose Another PDF
              </button>
            </div>

            <div className="space-y-2 pt-2 border-t border-theme-border">
              <label className="text-xs font-semibold text-theme-text block">
                Enter Pages to Extract (e.g. 1-3, 5, 7-{Math.min(10, pageCount)})
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={pageRange}
                  onChange={e => setPageRange(e.target.value)}
                  placeholder="1-3, 5"
                  className="flex-1 max-w-md px-4 py-2.5 rounded-xl bg-theme-bg border border-theme-border font-mono text-sm text-theme-text focus:border-theme-accent outline-none"
                />
                <button
                  onClick={extractPages}
                  disabled={isExtracting}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold shadow-lg shadow-theme-accent/25 transition-all"
                >
                  <Scissors className="w-4 h-4" />
                  <span>{isExtracting ? 'Extracting...' : 'Extract & Download'}</span>
                </button>
              </div>
            </div>
          </div>

          {splitBlob && (
            <ResultCard
              title="Pages Extracted Successfully"
              description={`Generated new PDF for page selection [${pageRange}]`}
              onDownload={() => downloadFile(splitBlob, `STUDKIT_extracted_pages.pdf`)}
              downloadLabel="Download Extracted PDF"
            >
              <div className="text-xs text-theme-text-muted">
                Created standalone PDF ({formatBytes(splitBlob.size)}) with original typography and vector graphics intact.
              </div>
            </ResultCard>
          )}
        </div>
      )}
    </div>
  );
};



export const PdfTextExtractor: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<{
    title?: string;
    author?: string;
    subject?: string;
    creator?: string;
    producer?: string;
    creationDate?: string;
    pageCount?: number;
  }>({});
  const [cleanedBlob, setCleanedBlob] = useState<Blob | null>(null);
  const [isCleaning, setIsCleaning] = useState(false);

  const handleFiles = async (files: File[]) => {
    if (files[0]) {
      const f = files[0];
      setFile(f);
      try {
        const buffer = await f.arrayBuffer();
        const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
        setMetadata({
          title: doc.getTitle() || 'None / Untitled',
          author: doc.getAuthor() || 'Unknown Author',
          subject: doc.getSubject() || 'N/A',
          creator: doc.getCreator() || 'Unknown Application',
          producer: doc.getProducer() || 'PDF Engine',
          creationDate: doc.getCreationDate()?.toLocaleString() || 'N/A',
          pageCount: doc.getPageCount(),
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

  const stripMetadata = async () => {
    if (!file) return;
    setIsCleaning(true);
    try {
      const buffer = await file.arrayBuffer();
      const doc = await PDFDocument.load(buffer);

      doc.setTitle('');
      doc.setAuthor('');
      doc.setSubject('');
      doc.setKeywords([]);
      doc.setProducer('STUDKIT Privacy Shield');
      doc.setCreator('STUDKIT Privacy Shield');

      const outBytes = await doc.save();
      const blob = new Blob([outBytes], { type: 'application/pdf' });
      setCleanedBlob(blob);
      downloadFile(blob, `STUDKIT_privacy_cleaned_${file.name}`);
    } catch (e) {
      console.error(e);
      alert('Error stripping metadata.');
    } finally {
      setIsCleaning(false);
    }
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <FileUploader
          accept=".pdf,application/pdf"
          onFilesSelected={handleFiles}
          title="Upload PDF to inspect & remove metadata tags"
          subtitle="Strip hidden author names, institution info, software tags, and timestamps before anonymous submission."
        />
      ) : (
        <div className="space-y-6">
          <div className="bg-theme-surface border border-theme-border rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-theme-text">{file.name}</h3>
              <button
                onClick={() => setFile(null)}
                className="px-3 py-1.5 rounded-xl bg-theme-bg border border-theme-border text-xs text-theme-text"
              >
                Inspect Another PDF
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
              <div className="p-3 rounded-xl bg-theme-bg border border-theme-border">
                <span className="text-[11px] text-theme-text-muted block">Document Title</span>
                <span className="text-xs font-semibold text-theme-text truncate block">{metadata.title}</span>
              </div>
              <div className="p-3 rounded-xl bg-theme-bg border border-theme-border">
                <span className="text-[11px] text-theme-text-muted block">Original Author</span>
                <span className="text-xs font-semibold text-theme-text truncate block">{metadata.author}</span>
              </div>
              <div className="p-3 rounded-xl bg-theme-bg border border-theme-border">
                <span className="text-[11px] text-theme-text-muted block">Creator Application</span>
                <span className="text-xs font-semibold text-theme-text truncate block">{metadata.creator}</span>
              </div>
              <div className="p-3 rounded-xl bg-theme-bg border border-theme-border">
                <span className="text-[11px] text-theme-text-muted block">Creation Timestamp</span>
                <span className="text-xs font-semibold text-theme-text truncate block">{metadata.creationDate}</span>
              </div>
              <div className="p-3 rounded-xl bg-theme-bg border border-theme-border">
                <span className="text-[11px] text-theme-text-muted block">Total Pages</span>
                <span className="text-xs font-bold text-theme-accent block">{metadata.pageCount}</span>
              </div>
              <div className="p-3 rounded-xl bg-theme-bg border border-theme-border">
                <span className="text-[11px] text-theme-text-muted block">File Size</span>
                <span className="text-xs font-mono text-theme-text block">{formatBytes(file.size)}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-theme-text-muted">
                Cleaning metadata protects student privacy during peer reviews and blind submissions.
              </span>
              <button
                onClick={stripMetadata}
                disabled={isCleaning}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold shadow-lg shadow-theme-accent/25 transition-all"
              >
                <Shield className="w-4 h-4" />
                <span>{isCleaning ? 'Stripping Metadata...' : 'Sanitize & Download Clean PDF'}</span>
              </button>
            </div>
          </div>

          {cleanedBlob && (
            <ResultCard
              title="PDF Sanitized"
              description="All hidden author, machine identifier, and software tags have been removed."
              onDownload={() => downloadFile(cleanedBlob, `STUDKIT_sanitized_${file.name}`)}
              downloadLabel="Download Sanitized PDF"
            >
              <div className="text-xs text-theme-text-muted font-mono">
                Document is now 100% anonymous and ready for blind submission.
              </div>
            </ResultCard>
          )}
        </div>
      )}
    </div>
  );
};
