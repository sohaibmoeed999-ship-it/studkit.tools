import React, { useState } from 'react';
import { BlogPost, BLOG_POSTS } from '../../data/blogPosts';
import { BlogPostView } from './BlogPostView';
import { BookOpen, Clock, ArrowRight, Search, Sparkles, Tag } from 'lucide-react';

interface BlogStudioProps {
  onOpenTool: (toolId: string) => void;
  selectedPostSlug?: string | null;
  onClearPostSlug?: () => void;
}

export const BlogStudio: React.FC<BlogStudioProps> = ({
  onOpenTool,
  selectedPostSlug,
  onClearPostSlug,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePost, setActivePost] = useState<BlogPost | null>(() => {
    if (selectedPostSlug) {
      return BLOG_POSTS.find(p => p.slug === selectedPostSlug) || null;
    }
    return null;
  });

  const categories = ['All', 'Study Tips', 'Career & Resumes', 'How-To Guides', 'AI for Students', 'Student Productivity'];

  const filteredPosts = BLOG_POSTS.filter(p => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesQuery =
      !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  if (activePost) {
    return (
      <BlogPostView
        post={activePost}
        onBack={() => {
          setActivePost(null);
          if (onClearPostSlug) onClearPostSlug();
        }}
        onOpenTool={onOpenTool}
        onSelectPost={p => {
          setActivePost(p);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Blog Hub Hero */}
      <div className="text-center space-y-3 py-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-theme-accent/10 border border-theme-accent/30 text-theme-accent text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>STUDKIT Knowledge Hub & Practical Guides</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-theme-text tracking-tight">
          Master Academic Skills, Tools & Careers
        </h2>
        <p className="text-xs sm:text-sm text-theme-text-muted max-w-xl mx-auto leading-relaxed">
          Comprehensive, actionable guides on CGPA calculations, ATS resumes, PDF workflows, grounded AI study methods, and student productivity.
        </p>
      </div>

      {/* Search & Categories Bar */}
      <div className="space-y-4">
        <div className="relative max-w-md mx-auto">
          <Search className="w-4 h-4 text-theme-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search guides, formulas, or topics..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-theme-surface border border-theme-border text-xs text-theme-text placeholder:text-theme-text-muted outline-none focus:border-theme-accent transition-colors"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === c
                  ? 'bg-theme-accent text-white shadow-md shadow-theme-accent/25'
                  : 'bg-theme-surface border border-theme-border text-theme-text-muted hover:text-theme-text'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPosts.map(post => (
          <div
            key={post.slug}
            onClick={() => {
              setActivePost(post);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="p-6 rounded-3xl bg-theme-surface hover:bg-theme-surface-hover border border-theme-border cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-4 shadow-lg group hover:-translate-y-1"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full bg-theme-accent/15 text-theme-accent border border-theme-accent/30">
                  {post.category}
                </span>
                <span className="text-[10px] text-theme-text-muted font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {post.readTimeMinutes}m read
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-theme-text group-hover:text-theme-accent transition-colors leading-snug">
                  {post.title}
                </h3>
                <p className="text-xs text-theme-text-muted mt-2 leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-theme-border/60 flex items-center justify-between text-xs font-bold text-theme-accent">
              <span>Read Full Guide</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
