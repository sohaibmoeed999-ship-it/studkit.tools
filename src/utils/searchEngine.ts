import { TOOLS_REGISTRY } from '../data/toolsRegistry';

export interface SearchResultItem {
  id: string;
  title: string;
  category: 'Tools' | 'Subjects' | 'Quizzes' | 'Calculators' | 'Games' | 'Blog' | 'AI Tools';
  description: string;
  badge?: string;
  toolIdToOpen: string;
  relevanceScore: number;
}

// Levenshtein distance for fuzzy matching
function levenshtein(a: string, b: string): number {
  const an = a ? a.length : 0;
  const bn = b ? b.length : 0;
  if (an === 0) return bn;
  if (bn === 0) return an;
  const matrix = new Array<number[]>(bn + 1);
  for (let i = 0; i <= bn; ++i) {
    let row = (matrix[i] = new Array<number>(an + 1));
    row[0] = i;
  }
  const firstRow = matrix[0];
  for (let j = 1; j <= an; ++j) {
    firstRow[j] = j;
  }
  for (let i = 1; i <= bn; ++i) {
    for (let j = 1; j <= an; ++j) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1 // deletion
          )
        );
      }
    }
  }
  return matrix[bn][an];
}

export function performSemanticSearch(query: string, activeTab = 'All'): SearchResultItem[] {
  const q = query.toLowerCase().trim();
  if (!q) {
    // Default popular items
    return TOOLS_REGISTRY.slice(0, 10).map(t => ({
      id: t.id,
      title: t.name,
      category: t.category === 'games' ? 'Games' : t.category === 'calculators' ? 'Calculators' : 'Tools',
      description: t.description,
      badge: t.popular ? 'Popular' : undefined,
      toolIdToOpen: t.id,
      relevanceScore: 100,
    }));
  }

  const results: SearchResultItem[] = [];

  // 1. Natural Language Intent Mapping
  if (q.includes('bmi') || q.includes('weight') || q.includes('body mass') || q.includes('height weight') || q.includes('obesity') || q.includes('underweight')) {
    results.push({
      id: 'bmi-calculator',
      title: 'Scientific BMI & Body Health Calculator',
      category: 'Calculators',
      description: 'Compute exact Body Mass Index, health category, ideal weight target, and prime ratio.',
      badge: 'Intent Match',
      toolIdToOpen: 'bmi-calculator',
      relevanceScore: 200,
    });
  }

  if (q.includes('solve') || q.includes('x^') || q.includes('equation') || q.includes('quadratic') || q.includes('integral') || q.includes('calculus')) {
    results.push({
      id: 'math-solver-intent',
      title: 'Precision Scientific & Formula Calculator',
      category: 'Calculators',
      description: 'Step-by-step scientific calculations, trigonometry, logs, factorials, and powers.',
      badge: 'Scientific',
      toolIdToOpen: 'scientific-calculator',
      relevanceScore: 195,
    });
  }

  if (q.includes('schedule') || q.includes('timetable') || q.includes('study plan') || q.includes('routine')) {
    results.push({
      id: 'schedule-generator-intent',
      title: 'Study Schedule & Timetable Generator',
      category: 'Tools',
      description: 'Auto-generate structured daily study timetables weighted by subject difficulty, priority, and exam deadlines.',
      badge: 'Timetable',
      toolIdToOpen: 'study-schedule-generator',
      relevanceScore: 200,
    });
  }

  if (q.includes('budget') || q.includes('money') || q.includes('expense') || q.includes('allowance') || q.includes('pocket money')) {
    results.push({
      id: 'budget-planner-intent',
      title: 'Student Budget & Expense Planner',
      category: 'Calculators',
      description: 'Track monthly pocket money, categorize fixed vs variable expenses, and compute safe daily spending limits.',
      badge: 'Budget',
      toolIdToOpen: 'student-budget-planner',
      relevanceScore: 200,
    });
  }

  if (q.includes('data') || q.includes('internet') || q.includes('mb') || q.includes('gb') || q.includes('mobile data')) {
    results.push({
      id: 'data-calc-intent',
      title: 'Internet & Mobile Data Usage Calculator',
      category: 'Calculators',
      description: 'Calculate daily MB/GB allowance, cycle pace predictions, and avoid sudden data plan exhaustion.',
      badge: 'Data Calc',
      toolIdToOpen: 'data-usage-calculator',
      relevanceScore: 200,
    });
  }

  if (q.includes('battery') || q.includes('charge') || q.includes('charging') || q.includes('watt') || q.includes('charger')) {
    results.push({
      id: 'battery-estimator-intent',
      title: 'Battery & Charging Time Estimator',
      category: 'Calculators',
      description: 'Estimate device charging duration based on battery capacity, charger wattage, and CC/CV voltage curve.',
      badge: 'Battery',
      toolIdToOpen: 'battery-charging-estimator',
      relevanceScore: 200,
    });
  }

  if (q.includes('word count') || q.includes('page count') || q.includes('assignment planner') || q.includes('essay') || q.includes('words per day')) {
    results.push({
      id: 'assignment-planner-intent',
      title: 'Assignment Word & Page Planner',
      category: 'Tools',
      description: 'Divide essays and dissertations into daily writing quotas, page targets, and section budgets.',
      badge: 'Assignment',
      toolIdToOpen: 'assignment-word-page-planner',
      relevanceScore: 200,
    });
  }

  if (q.includes('presentation') || q.includes('slide') || q.includes('speech') || q.includes('talk timer') || q.includes('pacing')) {
    results.push({
      id: 'presentation-timer-intent',
      title: 'Presentation & Slide Pacing Timer',
      category: 'Tools',
      description: 'Calculate slide time limits deducting intro/Q&A with live interactive countdown alerts.',
      badge: 'Presentation',
      toolIdToOpen: 'presentation-timer',
      relevanceScore: 200,
    });
  }

  if (q.includes('viva') || q.includes('oral exam') || q.includes('interview') || q.includes('oral test')) {
    results.push({
      id: 'viva-timer-intent',
      title: 'Viva & Oral Exam Practice Timer',
      category: 'Tools',
      description: 'Practice custom oral exam questions with timed spontaneous recall and scoring analysis.',
      badge: 'Viva Practice',
      toolIdToOpen: 'viva-practice-timer',
      relevanceScore: 200,
    });
  }

  if (q.includes('contact') || q.includes('vcard') || q.includes('vcf') || q.includes('business card') || q.includes('address book')) {
    results.push({
      id: 'contact-card-intent',
      title: 'Contact Card Generator',
      category: 'Tools',
      description: 'Create and download a digital contact card in seconds with standard .VCF vCard and QR code export.',
      badge: 'vCard & QR',
      toolIdToOpen: 'contact-card-generator',
      relevanceScore: 200,
    });
  }

  if (q.includes('afford') || q.includes('can i afford') || q.includes('purchase impact') || q.includes('spend')) {
    results.push({
      id: 'afford-intent',
      title: 'Can I Afford This? — Budget Analyzer',
      category: 'Calculators',
      description: 'See how a purchase could affect your monthly budget and savings before you spend.',
      badge: 'Budget Impact',
      toolIdToOpen: 'can-i-afford-this',
      relevanceScore: 200,
    });
  }

  if (q.includes('salary') || q.includes('wage') || q.includes('hourly') || q.includes('net pay') || q.includes('take home')) {
    results.push({
      id: 'salary-calc-intent',
      title: 'Salary Breakdown Calculator',
      category: 'Calculators',
      description: 'Break down your salary into monthly, weekly, daily, and hourly gross & net earnings.',
      badge: 'Salary & Wage',
      toolIdToOpen: 'salary-breakdown-calculator',
      relevanceScore: 200,
    });
  }

  if (q.includes('message') || q.includes('text template') || q.includes('whatsapp message') || q.includes('template message') || q.includes('wish')) {
    results.push({
      id: 'message-generator-intent',
      title: 'Automatic Message Generator',
      category: 'Tools',
      description: 'Create ready-to-send messages for everyday, personal, and professional situations with WhatsApp direct export.',
      badge: 'Message Suite',
      toolIdToOpen: 'automatic-message-generator',
      relevanceScore: 200,
    });
  }

  if (q.includes('notes') || q.includes('summary') || q.includes('lecture') || q.includes('format')) {
    results.push({
      id: 'notes-intent',
      title: 'Academic Study Notes Formatter',
      category: 'Tools',
      description: 'Format raw unstructured notes into clean academic outlines, cheat-sheets, and active recall Q&A.',
      badge: 'Notes Formatter',
      toolIdToOpen: 'study-notes-formatter',
      relevanceScore: 190,
    });
  }

  if (q.includes('birthday') || q.includes('wish') || q.includes('greeting') || q.includes('gift')) {
    results.push({
      id: 'birthday-intent',
      title: 'Birthday Wisher & Digital Gift Studio',
      category: 'Tools',
      description: 'Personalized birthday wishes, dispatch automation, and interactive 3D gift box cards.',
      badge: 'Gift Studio',
      toolIdToOpen: 'birthday-wisher-studio',
      relevanceScore: 195,
    });
  }

  if (q.includes('username') || q.includes('email generator') || q.includes('handle') || q.includes('gmail')) {
    results.push({
      id: 'username-email-intent',
      title: 'Smart Email & Username Generator',
      category: 'Tools',
      description: 'Generate clean professional, developer, student, and creative handles and email variations.',
      badge: 'Identity',
      toolIdToOpen: 'smart-email-username-generator',
      relevanceScore: 190,
    });
  }

  if (q.includes('project name') || q.includes('startup name') || q.includes('brand name') || q.includes('naming')) {
    results.push({
      id: 'project-name-intent',
      title: 'Smart Project & Startup Name Generator',
      category: 'Tools',
      description: 'Transform project ideas into brandable startup names with etymologies and taglines.',
      badge: 'Branding',
      toolIdToOpen: 'smart-project-name-generator',
      relevanceScore: 190,
    });
  }

  if (q.includes('image to pdf') || q.includes('jpg to pdf') || q.includes('png to pdf') || q.includes('photo to pdf')) {
    results.push({
      id: 'image-to-pdf-intent',
      title: 'Image to PDF Converter',
      category: 'Tools',
      description: 'Convert JPG, PNG, and WebP photos into high-resolution A4 or custom-sized PDF documents.',
      badge: 'PDF Maker',
      toolIdToOpen: 'image-to-pdf',
      relevanceScore: 200,
    });
  }

  if (q.includes('word') || q.includes('docx') || q.includes('doc to') || q.includes('word to pdf') || q.includes('pdf to word')) {
    results.push({
      id: 'word-doc-converter-intent',
      title: 'Word (.docx / .doc) ⟷ PDF ⟷ Text Converter',
      category: 'Tools',
      description: 'Convert Microsoft Word documents to PDF, or convert PDF/notes into editable .doc files.',
      badge: 'Doc Converter',
      toolIdToOpen: 'word-to-pdf',
      relevanceScore: 200,
    });
  }

  // 2. Search Tools Registry with fuzzy matching
  TOOLS_REGISTRY.forEach(tool => {
    let score = 0;
    const nameLower = tool.name.toLowerCase();
    const descLower = tool.description.toLowerCase();

    if (nameLower === q) score += 150;
    else if (nameLower.startsWith(q)) score += 100;
    else if (nameLower.includes(q)) score += 70;
    else if (descLower.includes(q)) score += 40;
    else if (tool.tags.some(tag => tag.toLowerCase().includes(q))) score += 50;
    else {
      // Fuzzy check
      const words = q.split(/\s+/);
      for (const w of words) {
        if (w.length >= 4) {
          const dist = levenshtein(w, nameLower.slice(0, w.length));
          if (dist <= 2) score += 30;
        }
      }
    }

    if (score > 0) {
      let cat: SearchResultItem['category'] = 'Tools';
      if (tool.category === 'games') cat = 'Games';
      else if (tool.category === 'calculators' || tool.category === 'math') cat = 'Calculators';
      else if (tool.category === 'ai') cat = 'AI Tools';

      results.push({
        id: tool.id,
        title: tool.name,
        category: cat,
        description: tool.description,
        badge: tool.popular ? 'Popular' : undefined,
        toolIdToOpen: tool.id,
        relevanceScore: score,
      });
    }
  });

  // Deduplicate by toolIdToOpen and Sort by relevanceScore descending
  const seen = new Set<string>();
  const uniqueResults: SearchResultItem[] = [];

  for (const item of results.sort((a, b) => b.relevanceScore - a.relevanceScore)) {
    if (!seen.has(item.id)) {
      seen.add(item.id);
      if (activeTab === 'All' || item.category === activeTab) {
        uniqueResults.push(item);
      }
    }
  }

  return uniqueResults;
}
