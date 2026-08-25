import React from 'react';
import { CheckCircle2, Download, Copy, RefreshCw } from 'lucide-react';

interface ResultCardProps {
  title: string;
  description?: string;
  onDownload?: () => void;
  onCopy?: () => void;
  onReset?: () => void;
  downloadLabel?: string;
  children: React.ReactNode;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  title,
  description,
  onDownload,
  onCopy,
  onReset,
  downloadLabel = 'Download File',
  children,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    if (onCopy) {
      onCopy();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full bg-theme-surface border border-theme-border rounded-2xl p-6 shadow-xl space-y-5 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-theme-border">
        <div>
          <h3 className="text-lg font-bold text-theme-text flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>{title}</span>
          </h3>
          {description && <p className="text-xs text-theme-text-muted mt-0.5">{description}</p>}
        </div>

        <div className="flex items-center gap-2">
          {onCopy && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-theme-bg hover:bg-theme-surface-hover border border-theme-border text-xs font-medium text-theme-text transition-all"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          )}

          {onReset && (
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-theme-bg hover:bg-theme-surface-hover border border-theme-border text-xs font-medium text-theme-text-muted hover:text-theme-text transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

          {onDownload && (
            <button
              onClick={onDownload}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-semibold shadow-md shadow-theme-accent/20 transition-all transform hover:scale-105"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloadLabel}</span>
            </button>
          )}
        </div>
      </div>

      <div>{children}</div>
    </div>
  );
};
