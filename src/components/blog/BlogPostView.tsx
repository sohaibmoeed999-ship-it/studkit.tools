import React, { useState, useEffect } from 'react';
import { BlogPost, BLOG_POSTS } from '../../data/blogPosts';
import { TOOLS_REGISTRY } from '../../data/toolsRegistry';
import {
  BookOpen,
  Clock,
  Calendar,
  User,
  ArrowLeft,
  Share2,
  Check,
  Sparkles,
  ArrowRight,
  HelpCircle,
  ChevronDown,
  Tag,
} from 'lucide-react';

interface BlogPostViewProps {
  post: BlogPost;
  onBack: () => void;
  onOpenTool: (toolId: string) => void;
  onSelectPost: (post: BlogPost) => void;
}

export const BlogPostView: React.FC<BlogPostViewProps> = ({
  post,
  onBack,
  onOpenTool,
  onSelectPost,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const relatedTool = TOOLS_REGISTRY.find(t => t.id === post.relatedToolId);
  const relatedPosts = BLOG_POSTS.filter(p => p.slug !== post.slug).slice(0, 3);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto select-text">
      {/* Reading Progress Top Line */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-transparent">
        <div
          className="h-full bg-gradient-to-r from-theme-accent via-cyan-400 to-blue-500 transition-all duration-75"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Top Navigation & Breadcrumbs */}
      <div className="flex items-center justify-between pb-4 border-b border-theme-border text-xs">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-theme-text-muted hover:text-theme-accent font-bold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Blog Guides</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-theme-surface hover:bg-theme-surface-hover border border-theme-border text-theme-text font-semibold transition-all active:scale-95"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-theme-accent" />}
          <span>{copied ? 'Link Copied!' : 'Share Article'}</span>
        </button>
      </div>

      {/* Article Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="px-3 py-1 rounded-full bg-theme-accent/15 text-theme-accent font-bold font-mono border border-theme-accent/30">
            {post.category}
          </span>
          <span className="flex items-center gap-1 text-theme-text-muted font-mono">
            <Clock className="w-3.5 h-3.5" /> {post.readTimeMinutes} min read
          </span>
          <span className="flex items-center gap-1 text-theme-text-muted font-mono">
            <Calendar className="w-3.5 h-3.5" /> {post.publishedDate}
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-theme-text tracking-tight leading-tight">
          {post.title}
        </h1>

        <p className="text-sm sm:text-base text-theme-text-muted leading-relaxed font-serif">
          {post.excerpt}
        </p>

        <div className="flex items-center gap-2 pt-2 text-xs text-theme-text-muted font-mono">
          <User className="w-3.5 h-3.5 text-theme-accent" />
          <span>Written by {post.author}</span>
        </div>
      </div>

      {/* Embedded Live Tool Action Banner */}
      {relatedTool && (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-theme-accent/15 via-theme-surface to-cyan-500/10 border border-theme-accent/30 shadow-xl flex flex-wrap sm:flex-nowrap items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-wider text-theme-accent font-bold block">
              Official STUDKIT Live Tool
            </span>
            <h3 className="text-sm sm:text-base font-bold text-theme-text">{relatedTool.name}</h3>
            <p className="text-xs text-theme-text-muted line-clamp-1">{relatedTool.description}</p>
          </div>

          <button
            onClick={() => onOpenTool(relatedTool.id)}
            className="px-5 py-2.5 rounded-2xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold shadow-lg shadow-theme-accent/25 flex items-center gap-2 flex-shrink-0 transition-all active:scale-95"
          >
            <span>Launch Free Tool</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Article Sections */}
      <div className="space-y-8 pt-4">
        {post.content.map(sec => (
          <div key={sec.sectionId} className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-theme-text tracking-tight">
              {sec.heading}
            </h2>
            <div className="text-sm text-theme-text-muted font-serif leading-relaxed whitespace-pre-line space-y-2">
              {sec.body}
            </div>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      {post.faqs && post.faqs.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-theme-border">
          <h3 className="text-base sm:text-lg font-bold text-theme-text flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-theme-accent" />
            <span>Frequently Asked Student Questions</span>
          </h3>

          <div className="space-y-2.5">
            {post.faqs.map((faq, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-theme-surface border border-theme-border space-y-2 cursor-pointer transition-all"
                onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
              >
                <div className="flex items-center justify-between text-xs font-bold text-theme-text">
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-theme-accent transition-transform duration-200 ${
                      openFaqIndex === idx ? 'rotate-180' : ''
                    }`}
                  />
                </div>
                {openFaqIndex === idx && (
                  <p className="text-xs text-theme-text-muted leading-relaxed font-serif pt-1">
                    {faq.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-theme-border">
        <Tag className="w-3.5 h-3.5 text-theme-text-muted" />
        {post.tags.map(t => (
          <span
            key={t}
            className="text-[11px] font-mono px-2.5 py-0.5 rounded-lg bg-theme-surface border border-theme-border text-theme-text-muted"
          >
            #{t}
          </span>
        ))}
      </div>

      {/* Related Articles Carousel */}
      <div className="space-y-4 pt-8 border-t border-theme-border">
        <h3 className="text-sm font-bold uppercase tracking-wider text-theme-text-muted">
          Related Student Guides & Tutorials
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {relatedPosts.map(p => (
            <div
              key={p.slug}
              onClick={() => onSelectPost(p)}
              className="p-4 rounded-2xl bg-theme-surface hover:bg-theme-surface-hover border border-theme-border cursor-pointer transition-all flex flex-col justify-between space-y-3 group"
            >
              <div>
                <span className="text-[10px] font-mono uppercase text-theme-accent font-bold block mb-1">
                  {p.category}
                </span>
                <h4 className="text-xs font-bold text-theme-text group-hover:text-theme-accent transition-colors line-clamp-2">
                  {p.title}
                </h4>
              </div>

              <div className="flex items-center justify-between text-[10px] text-theme-text-muted font-mono pt-2 border-t border-theme-border/60">
                <span>{p.readTimeMinutes} min read</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform text-theme-accent" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
