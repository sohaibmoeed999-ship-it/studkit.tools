import React, { useState } from 'react';
import { ResultCard } from '../../common/ResultCard';
import { Target, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export const SkillsGapAnalyzer: React.FC = () => {
  const [resumeText, setResumeText] = useState(
    'Computer Science student experienced in Python, React, TypeScript, SQL, Git, REST APIs, and Linux.'
  );
  const [jobDescription, setJobDescription] = useState(
    'Seeking a Junior Full Stack Engineer with expertise in React, TypeScript, Node.js, Docker, Kubernetes, AWS, PostgreSQL, and CI/CD pipelines.'
  );
  const [analysis, setAnalysis] = useState<{
    matchRate: number;
    matched: string[];
    missing: string[];
  } | null>(null);

  const keywordsList = [
    'React',
    'TypeScript',
    'JavaScript',
    'Python',
    'Node.js',
    'Docker',
    'Kubernetes',
    'AWS',
    'PostgreSQL',
    'SQL',
    'Git',
    'REST APIs',
    'CI/CD',
    'Linux',
    'Java',
    'C++',
    'GraphQL',
    'Redis',
    'MongoDB',
    'Agile',
  ];

  const runAnalysis = () => {
    const rLower = resumeText.toLowerCase();
    const jLower = jobDescription.toLowerCase();

    const requiredInJob = keywordsList.filter(k => jLower.includes(k.toLowerCase()));
    const matched = requiredInJob.filter(k => rLower.includes(k.toLowerCase()));
    const missing = requiredInJob.filter(k => !rLower.includes(k.toLowerCase()));

    const matchRate = requiredInJob.length > 0 ? Math.round((matched.length / requiredInJob.length) * 100) : 100;

    setAnalysis({
      matchRate,
      matched,
      missing,
    });
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="bg-theme-surface border border-theme-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center gap-3 pb-4 border-b border-theme-border">
          <Target className="w-5 h-5 text-theme-accent" />
          <div>
            <h2 className="text-base sm:text-lg font-bold text-theme-text">Job Match & Skills Gap Analyzer</h2>
            <p className="text-xs text-theme-text-muted">Compare your resume against any internship or job posting.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-theme-text-muted">Your Resume / Skills Summary</label>
            <textarea
              value={resumeText}
              onChange={e => setResumeText(e.target.value)}
              className="w-full h-36 p-3 rounded-xl bg-theme-bg border border-theme-border text-xs text-theme-text resize-none focus:border-theme-accent outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-theme-text-muted">Job Description / Requirements</label>
            <textarea
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
              className="w-full h-36 p-3 rounded-xl bg-theme-bg border border-theme-border text-xs text-theme-text resize-none focus:border-theme-accent outline-none"
            />
          </div>
        </div>

        <button
          onClick={runAnalysis}
          className="w-full py-3 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold shadow-lg shadow-theme-accent/25 transition-all flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Analyze ATS Keyword Match</span>
        </button>

        {analysis && (
          <div className="space-y-4 pt-4 border-t border-theme-border animate-fade-in">
            <div className="p-6 rounded-2xl bg-theme-bg border border-theme-border text-center space-y-1">
              <span className="text-[10px] uppercase font-mono text-theme-text-muted">ATS Compatibility Score</span>
              <span
                className={`text-4xl font-black font-mono block ${
                  analysis.matchRate >= 75
                    ? 'text-emerald-400'
                    : analysis.matchRate >= 50
                    ? 'text-amber-400'
                    : 'text-rose-400'
                }`}
              >
                {analysis.matchRate}% Match
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Matching Keywords ({analysis.matched.length})</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.matched.map(m => (
                    <span key={m} className="px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 font-mono text-[11px]">
                      ✓ {m}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-2">
                <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" />
                  <span>Missing Skill Keywords ({analysis.missing.length})</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.missing.map(m => (
                    <span key={m} className="px-2 py-0.5 rounded-lg bg-rose-500/20 text-rose-300 font-mono text-[11px]">
                      + {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
