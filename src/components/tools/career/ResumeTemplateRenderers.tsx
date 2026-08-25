import React from 'react';
import { ResumeData } from './ResumeBuilder';

interface TemplateProps {
  data: ResumeData;
  accentColor: string;
  fontFamily: 'sans' | 'serif' | 'mono';
}

// 1. Classic Single Column (Modern Clean)
export const TemplateModernClean: React.FC<TemplateProps> = ({ data, accentColor, fontFamily }) => (
  <div className="p-8 sm:p-10 space-y-6 text-gray-900">
    <div className="border-b-2 pb-4" style={{ borderColor: accentColor }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">{data.fullName || 'Alex Morgan'}</h1>
          {data.showFatherName && data.fatherName && <p className="text-[11px] text-gray-500 font-medium">S/O: {data.fatherName}</p>}
          <p className="text-xs font-bold uppercase tracking-wider mt-0.5" style={{ color: accentColor }}>{data.roleTitle || 'Software Engineer'}</p>
        </div>
        {data.photoUrl && (
          <img src={data.photoUrl} alt="Photo" className={`w-16 h-16 object-cover border-2 ${data.photoShape === 'circle' ? 'rounded-full' : data.photoShape === 'rounded' ? 'rounded-xl' : 'rounded-none'}`} />
        )}
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] sm:text-[11px] text-gray-600 font-medium pt-2">
        <span>{data.email}</span><span>•</span><span>{data.phonePrimary}</span><span>•</span><span>{data.city}, {data.country}</span>
        {data.github && <><span>•</span><span style={{ color: accentColor }}>{data.github}</span></>}
        {data.linkedin && <><span>•</span><span>{data.linkedin}</span></>}
      </div>
    </div>

    {data.summary && (
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: accentColor }}>Professional Summary</h2>
        <p className="text-xs text-gray-700 leading-relaxed">{data.summary}</p>
      </div>
    )}

    {data.experience?.length > 0 && (
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider border-b pb-0.5" style={{ color: accentColor }}>Work Experience</h2>
        {data.experience.map(exp => (
          <div key={exp.id} className="text-xs space-y-0.5">
            <div className="flex justify-between font-bold text-gray-900">
              <span>{exp.role} — <span className="font-semibold text-gray-700">{exp.company}</span></span>
              <span className="font-mono text-[10px] text-gray-500">{exp.startDate} – {exp.endDate}</span>
            </div>
            <pre className="text-xs text-gray-700 font-sans whitespace-pre-line leading-relaxed">{exp.bullets}</pre>
          </div>
        ))}
      </div>
    )}

    {data.education?.length > 0 && (
      <div className="space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider border-b pb-0.5" style={{ color: accentColor }}>Education & Qualifications</h2>
        {data.education.map(edu => (
          <div key={edu.id} className="flex justify-between text-xs">
            <div>
              <span className="font-bold text-gray-900">{edu.institution}</span>
              <p className="text-gray-700">{edu.degree} in {edu.field}</p>
            </div>
            <div className="text-right font-mono text-[10px] text-gray-600">
              <span>{edu.startDate} – {edu.endDate}</span>
              {edu.grade && <p className="font-bold text-gray-800">{edu.grade}</p>}
            </div>
          </div>
        ))}
      </div>
    )}

    {data.skills?.length > 0 && (
      <div className="space-y-1.5">
        <h2 className="text-xs font-bold uppercase tracking-wider border-b pb-0.5" style={{ color: accentColor }}>Skills & Competencies</h2>
        {data.skills.map(sk => (
          <div key={sk.id} className="text-xs flex gap-2">
            <span className="font-bold text-gray-900 w-1/3 flex-shrink-0">{sk.category}:</span>
            <span className="text-gray-700">{sk.items}</span>
          </div>
        ))}
      </div>
    )}
  </div>
);

// 2. ATS Single Column Linear
export const TemplateAtsStandard: React.FC<TemplateProps> = ({ data, accentColor }) => (
  <div className="p-8 sm:p-10 space-y-4 text-gray-900 font-sans">
    <div className="text-center pb-3 border-b">
      <h1 className="text-2xl font-bold uppercase tracking-wide text-gray-950">{data.fullName}</h1>
      <p className="text-xs font-semibold text-gray-700">{data.roleTitle}</p>
      <p className="text-[10px] text-gray-600 font-mono mt-1">
        {data.email} | {data.phonePrimary} | {data.city}, {data.country} {data.linkedin && `| ${data.linkedin}`} {data.github && `| ${data.github}`}
      </p>
    </div>

    {data.summary && (
      <div>
        <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-950 border-b border-gray-300 pb-0.5 mb-1">Summary</h2>
        <p className="text-xs text-gray-800 leading-normal">{data.summary}</p>
      </div>
    )}

    {data.education?.length > 0 && (
      <div>
        <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-950 border-b border-gray-300 pb-0.5 mb-1.5">Education</h2>
        {data.education.map(edu => (
          <div key={edu.id} className="mb-2 text-xs">
            <div className="flex justify-between font-bold text-gray-900">
              <span>{edu.institution}, {edu.city}</span>
              <span className="font-normal text-[10px]">{edu.startDate} – {edu.endDate}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>{edu.degree} — {edu.field}</span>
              {edu.grade && <span className="font-semibold">GPA: {edu.grade}</span>}
            </div>
          </div>
        ))}
      </div>
    )}

    {data.experience?.length > 0 && (
      <div>
        <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-950 border-b border-gray-300 pb-0.5 mb-1.5">Experience</h2>
        {data.experience.map(exp => (
          <div key={exp.id} className="mb-2.5 text-xs">
            <div className="flex justify-between font-bold text-gray-900">
              <span>{exp.role} | {exp.company}</span>
              <span className="font-normal text-[10px]">{exp.startDate} – {exp.endDate}</span>
            </div>
            <pre className="text-xs text-gray-800 font-sans whitespace-pre-line leading-relaxed mt-0.5">{exp.bullets}</pre>
          </div>
        ))}
      </div>
    )}

    {data.skills?.length > 0 && (
      <div>
        <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-950 border-b border-gray-300 pb-0.5 mb-1">Technical Skills</h2>
        <ul className="text-xs text-gray-800 space-y-1">
          {data.skills.map(sk => (
            <li key={sk.id}><strong>{sk.category}:</strong> {sk.items}</li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

// 3. Modern Left Sidebar (35/65 Split)
export const TemplateSidebarLeft: React.FC<TemplateProps> = ({ data, accentColor }) => (
  <div className="grid grid-cols-12 min-h-[850px] text-gray-900">
    <div className="col-span-4 p-6 text-white space-y-5" style={{ backgroundColor: accentColor }}>
      {data.photoUrl && (
        <div className="flex justify-center">
          <img src={data.photoUrl} alt="Photo" className="w-20 h-20 rounded-full object-cover border-2 border-white/40 shadow-md" />
        </div>
      )}
      <div>
        <h1 className="text-lg font-black uppercase text-white leading-tight">{data.fullName}</h1>
        <p className="text-[11px] text-white/80 font-medium mt-0.5">{data.roleTitle}</p>
      </div>
      <div className="space-y-2 text-[10px] text-white/90 font-mono border-t border-white/20 pt-3">
        <h3 className="font-bold uppercase tracking-wider text-[11px] text-white">Contact</h3>
        <p className="truncate">{data.email}</p>
        <p>{data.phonePrimary}</p>
        <p>{data.city}, {data.country}</p>
        {data.github && <p className="truncate">{data.github}</p>}
      </div>
      {data.skills?.length > 0 && (
        <div className="space-y-2 border-t border-white/20 pt-3">
          <h3 className="font-bold uppercase tracking-wider text-[11px] text-white">Skills</h3>
          {data.skills.map(sk => (
            <div key={sk.id} className="text-[10px]">
              <span className="font-bold block text-white">{sk.category}</span>
              <span className="text-white/80 leading-tight block">{sk.items}</span>
            </div>
          ))}
        </div>
      )}
    </div>

    <div className="col-span-8 p-6 sm:p-8 space-y-5 bg-white">
      {data.summary && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-950 border-b pb-1 mb-1.5" style={{ borderColor: accentColor }}>Profile</h2>
          <p className="text-xs text-gray-700 leading-relaxed">{data.summary}</p>
        </div>
      )}
      {data.experience?.length > 0 && (
        <div className="space-y-2.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-950 border-b pb-1" style={{ borderColor: accentColor }}>Experience</h2>
          {data.experience.map(exp => (
            <div key={exp.id} className="text-xs space-y-0.5">
              <div className="flex justify-between font-bold text-gray-900">
                <span>{exp.role}</span>
                <span className="font-mono text-[10px] text-gray-500">{exp.startDate} – {exp.endDate}</span>
              </div>
              <p className="text-[11px] text-gray-600 font-medium">{exp.company} — {exp.location}</p>
              <pre className="text-xs text-gray-700 font-sans whitespace-pre-line leading-relaxed">{exp.bullets}</pre>
            </div>
          ))}
        </div>
      )}
      {data.education?.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-950 border-b pb-1" style={{ borderColor: accentColor }}>Education</h2>
          {data.education.map(edu => (
            <div key={edu.id} className="text-xs">
              <div className="flex justify-between font-bold text-gray-900">
                <span>{edu.institution}</span>
                <span className="font-mono text-[10px] text-gray-500">{edu.startDate} – {edu.endDate}</span>
              </div>
              <p className="text-gray-700">{edu.degree} in {edu.field}</p>
              {edu.grade && <p className="text-[10px] font-mono text-gray-600">Grade: {edu.grade}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

// 4. Bold Top Accent Banner
export const TemplateBoldBanner: React.FC<TemplateProps> = ({ data, accentColor }) => (
  <div className="text-gray-900">
    <div className="p-8 text-white space-y-2" style={{ backgroundColor: accentColor }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">{data.fullName}</h1>
          <p className="text-xs uppercase tracking-wider font-semibold opacity-90 text-white">{data.roleTitle}</p>
        </div>
        {data.photoUrl && (
          <img src={data.photoUrl} alt="Photo" className="w-16 h-16 rounded-full object-cover border-2 border-white/40 shadow-md" />
        )}
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-white/85 font-mono pt-1">
        <span>{data.email}</span><span>•</span><span>{data.phonePrimary}</span><span>•</span><span>{data.city}, {data.country}</span>
        {data.github && <span>• {data.github}</span>}
      </div>
    </div>
    <div className="p-8 space-y-5 bg-white">
      {data.summary && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: accentColor }}>Summary</h2>
          <p className="text-xs text-gray-700 leading-relaxed">{data.summary}</p>
        </div>
      )}
      {data.experience?.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b pb-0.5" style={{ color: accentColor }}>Experience</h2>
          {data.experience.map(exp => (
            <div key={exp.id} className="text-xs space-y-0.5">
              <div className="flex justify-between font-bold text-gray-900">
                <span>{exp.role} — <span className="font-semibold text-gray-700">{exp.company}</span></span>
                <span className="font-mono text-[10px] text-gray-500">{exp.startDate} – {exp.endDate}</span>
              </div>
              <pre className="text-xs text-gray-700 font-sans whitespace-pre-line leading-relaxed">{exp.bullets}</pre>
            </div>
          ))}
        </div>
      )}
      {data.education?.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b pb-0.5" style={{ color: accentColor }}>Education</h2>
          {data.education.map(edu => (
            <div key={edu.id} className="flex justify-between text-xs">
              <div>
                <span className="font-bold text-gray-900">{edu.institution}</span>
                <p className="text-gray-700">{edu.degree} in {edu.field}</p>
              </div>
              <div className="text-right font-mono text-[10px] text-gray-600">
                <span>{edu.startDate} – {edu.endDate}</span>
                {edu.grade && <p className="font-bold text-gray-800">{edu.grade}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

// 5. Tech Terminal Monospace
export const TemplateTechTerminal: React.FC<TemplateProps> = ({ data, accentColor }) => (
  <div className="p-8 sm:p-10 space-y-5 text-gray-900 font-mono">
    <div className="p-4 rounded-xl bg-gray-950 text-white space-y-1.5 shadow-lg">
      <div className="flex items-center gap-1.5 pb-1 border-b border-gray-800 text-xs text-gray-400">
        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
        <span className="ml-2">terminal ~/resume --profile</span>
      </div>
      <h1 className="text-xl font-bold text-emerald-400">&gt; {data.fullName}</h1>
      <p className="text-xs text-gray-300">$ role: &quot;{data.roleTitle}&quot;</p>
      <p className="text-[10px] text-gray-400">$ contact: [{data.email}, {data.phonePrimary}, {data.city}]</p>
    </div>

    {data.skills?.length > 0 && (
      <div className="space-y-1.5">
        <h2 className="text-xs font-bold text-gray-950 border-b border-gray-300 pb-0.5">## TECHNICAL_STACK</h2>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {data.skills.map(sk => (
            <div key={sk.id} className="p-2 rounded bg-gray-100 border border-gray-200">
              <span className="text-[10px] font-bold text-gray-700 block">{sk.category}</span>
              <span className="text-[11px] text-gray-900">{sk.items}</span>
            </div>
          ))}
        </div>
      </div>
    )}

    {data.experience?.length > 0 && (
      <div className="space-y-2">
        <h2 className="text-xs font-bold text-gray-950 border-b border-gray-300 pb-0.5">## WORK_HISTORY</h2>
        {data.experience.map(exp => (
          <div key={exp.id} className="text-xs space-y-0.5">
            <div className="flex justify-between font-bold text-gray-900">
              <span>* {exp.role} @ {exp.company}</span>
              <span className="text-[10px] text-gray-500">[{exp.startDate} - {exp.endDate}]</span>
            </div>
            <pre className="text-xs text-gray-700 font-mono whitespace-pre-line leading-relaxed">{exp.bullets}</pre>
          </div>
        ))}
      </div>
    )}

    {data.education?.length > 0 && (
      <div className="space-y-1.5">
        <h2 className="text-xs font-bold text-gray-950 border-b border-gray-300 pb-0.5">## ACADEMIC_CREDENTIALS</h2>
        {data.education.map(edu => (
          <div key={edu.id} className="text-xs flex justify-between">
            <span>* {edu.degree} — {edu.institution}</span>
            <span className="text-gray-600">{edu.grade}</span>
          </div>
        ))}
      </div>
    )}
  </div>
);

// 6. Chronological Timeline Architecture
export const TemplateTimeline: React.FC<TemplateProps> = ({ data, accentColor }) => (
  <div className="p-8 sm:p-10 space-y-6 text-gray-900">
    <div className="flex items-center justify-between border-b pb-4">
      <div>
        <h1 className="text-2xl font-black uppercase tracking-tight text-gray-950">{data.fullName}</h1>
        <p className="text-xs font-bold" style={{ color: accentColor }}>{data.roleTitle}</p>
        <p className="text-[10px] text-gray-600 font-mono mt-1">{data.email} • {data.phonePrimary} • {data.city}, {data.country}</p>
      </div>
      {data.photoUrl && <img src={data.photoUrl} alt="Photo" className="w-14 h-14 rounded-full object-cover border" />}
    </div>

    {data.experience?.length > 0 && (
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: accentColor }}>Career Progression (Timeline)</h2>
        <div className="border-l-2 pl-4 space-y-4" style={{ borderColor: accentColor }}>
          {data.experience.map(exp => (
            <div key={exp.id} className="relative text-xs">
              <span className="w-2.5 h-2.5 rounded-full absolute -left-[21px] top-1 border-2 border-white" style={{ backgroundColor: accentColor }} />
              <div className="flex justify-between font-bold text-gray-900">
                <span>{exp.role}</span>
                <span className="font-mono text-[10px] text-gray-500">{exp.startDate} – {exp.endDate}</span>
              </div>
              <p className="text-[11px] text-gray-600">{exp.company} — {exp.location}</p>
              <pre className="text-xs text-gray-700 font-sans whitespace-pre-line leading-relaxed mt-1">{exp.bullets}</pre>
            </div>
          ))}
        </div>
      </div>
    )}

    {data.education?.length > 0 && (
      <div className="space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: accentColor }}>Education Milestones</h2>
        <div className="border-l-2 pl-4 space-y-3" style={{ borderColor: accentColor }}>
          {data.education.map(edu => (
            <div key={edu.id} className="relative text-xs">
              <span className="w-2.5 h-2.5 rounded-full absolute -left-[21px] top-1 border-2 border-white" style={{ backgroundColor: accentColor }} />
              <div className="flex justify-between font-bold text-gray-900">
                <span>{edu.institution}</span>
                <span className="font-mono text-[10px] text-gray-500">{edu.startDate} – {edu.endDate}</span>
              </div>
              <p className="text-gray-700">{edu.degree} in {edu.field} ({edu.grade})</p>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

// Dynamic Template Dispatcher
export const renderDynamicResumeTemplate = (
  templateId: string,
  data: ResumeData,
  accentColor: string,
  fontFamily: 'sans' | 'serif' | 'mono'
) => {
  const props: TemplateProps = { data, accentColor, fontFamily };

  switch (templateId) {
    case 'ats':
    case 'minimal':
    case 'ivy_league':
      return <TemplateAtsStandard {...props} />;

    case 'sidebar':
    case 'sidebar_right':
    case 'creative':
    case 'split_modern':
      return <TemplateSidebarLeft {...props} />;

    case 'bold_header':
    case 'executive_banner':
    case 'executive':
    case 'leadership_pro':
      return <TemplateBoldBanner {...props} />;

    case 'tech':
    case 'developer_pro':
    case 'monospace_clean':
      return <TemplateTechTerminal {...props} />;

    case 'timeline':
    case 'accent_stripe':
    case 'portfolio':
      return <TemplateTimeline {...props} />;

    case 'modern':
    default:
      return <TemplateModernClean {...props} />;
  }
};
