import React, { useState, useEffect, useMemo, useRef } from 'react';
import QRCode from 'qrcode';
import {
  Contact,
  User,
  Briefcase,
  Building,
  Phone,
  Mail,
  Globe,
  MapPin,
  MessageCircle,
  Linkedin,
  Github,
  Twitter,
  Download,
  Copy,
  Check,
  QrCode,
  Sparkles,
  Camera,
  Trash2,
  Share2,
  RotateCcw,
} from 'lucide-react';
import { downloadText, downloadBlob } from '../../../utils/download';

type CardStyle = 'modern-glass' | 'executive-navy' | 'emerald-minimal' | 'royal-purple';

export const ContactCardGenerator: React.FC = () => {
  // Contact details
  const [fullName, setFullName] = useState<string>('Alex Johnson');
  const [jobTitle, setJobTitle] = useState<string>('Computer Science Student & Researcher');
  const [company, setCompany] = useState<string>('Stanford University / AI Lab');
  const [phone, setPhone] = useState<string>('+1 (555) 234-5678');
  const [email, setEmail] = useState<string>('alex.johnson@university.edu');
  const [website, setWebsite] = useState<string>('https://alexjohnson.dev');
  const [address, setAddress] = useState<string>('Silicon Valley, CA, USA');
  const [whatsapp, setWhatsapp] = useState<string>('+1 (555) 234-5678');

  // Socials
  const [linkedin, setLinkedin] = useState<string>('linkedin.com/in/alexjohnson');
  const [github, setGithub] = useState<string>('github.com/alexjohnson');
  const [twitter, setTwitter] = useState<string>('twitter.com/alexjohnson');

  // Photo
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState<CardStyle>('modern-glass');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // vCard 3.0 string generation
  const vCardString = useMemo(() => {
    const names = fullName.trim().split(' ');
    const firstName = names[0] || '';
    const lastName = names.slice(1).join(' ') || '';

    let vcf = 'BEGIN:VCARD\nVERSION:3.0\n';
    vcf += `N:${lastName};${firstName};;;\n`;
    vcf += `FN:${fullName.trim()}\n`;
    if (company.trim()) vcf += `ORG:${company.trim()}\n`;
    if (jobTitle.trim()) vcf += `TITLE:${jobTitle.trim()}\n`;
    if (phone.trim()) vcf += `TEL;TYPE=CELL,VOICE:${phone.trim()}\n`;
    if (email.trim()) vcf += `EMAIL;TYPE=INTERNET,PREF:${email.trim()}\n`;
    if (website.trim()) vcf += `URL:${website.trim()}\n`;
    if (address.trim()) vcf += `ADR;TYPE=WORK:;;${address.trim()};;;;\n`;
    if (whatsapp.trim()) vcf += `NOTE:WhatsApp: ${whatsapp.trim()}\n`;
    vcf += 'END:VCARD';
    return vcf;
  }, [fullName, jobTitle, company, phone, email, website, address, whatsapp]);

  // Generate QR Code dynamically
  useEffect(() => {
    QRCode.toDataURL(vCardString, {
      width: 256,
      margin: 1.5,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error('QR generation error:', err));
  }, [vCardString]);

  // Image Upload Handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = event => {
        setAvatarUrl((event.target?.result as string) || '');
      };
      reader.readAsDataURL(file);
    }
  };

  // Download .VCF
  const handleDownloadVCF = () => {
    const cleanName = fullName.trim().replace(/[^a-zA-Z0-9_-]/g, '_') || 'contact';
    downloadText(vCardString, `${cleanName}.vcf`);
  };

  // Download QR Code PNG
  const handleDownloadQR = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `${fullName.trim().replace(/\s+/g, '_')}_contact_qr.png`;
    link.click();
  };

  // Copy Summary
  const handleCopyInfo = () => {
    const summary = `Contact Information:
Name: ${fullName}
Role: ${jobTitle}
Company: ${company}
Phone: ${phone}
Email: ${email}
Website: ${website}
Address: ${address}
WhatsApp: ${whatsapp}`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto select-none">
      {/* Header */}
      <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Contact className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-theme-text flex items-center gap-2">
              <span>Contact Card Generator</span>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                .VCF & QR Code
              </span>
            </h2>
            <p className="text-xs text-theme-text-muted">
              Create and download a digital contact card in seconds.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyInfo}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-theme-bg hover:bg-theme-surface-hover border border-theme-border text-xs font-semibold text-theme-text transition-all active:scale-95 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Text'}</span>
          </button>
          <button
            onClick={handleDownloadVCF}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold shadow-lg shadow-theme-accent/25 transition-all active:scale-95 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Contact (.vcf)</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Form Inputs (Left) & Live Interactive Card Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Form */}
        <div className="lg:col-span-7 space-y-5">
          {/* Card Style Selector */}
          <div className="bg-theme-surface border border-theme-border rounded-3xl p-5 shadow-xl space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-theme-text block">
              Choose Card Style Theme
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'modern-glass', label: 'Modern Glass', color: 'from-cyan-500/20 to-blue-600/20 border-cyan-500/40 text-cyan-300' },
                { id: 'executive-navy', label: 'Executive Navy', color: 'from-blue-900/40 to-slate-900/40 border-blue-400/40 text-blue-300' },
                { id: 'emerald-minimal', label: 'Emerald Slate', color: 'from-emerald-500/20 to-teal-600/20 border-emerald-500/40 text-emerald-300' },
                { id: 'royal-purple', label: 'Royal Purple', color: 'from-purple-500/20 to-indigo-600/20 border-purple-500/40 text-purple-300' },
              ].map(st => (
                <button
                  key={st.id}
                  onClick={() => setSelectedStyle(st.id as CardStyle)}
                  className={`p-2.5 rounded-2xl text-xs font-bold border transition-all text-center cursor-pointer ${
                    selectedStyle === st.id
                      ? `bg-gradient-to-br ${st.color} shadow-lg scale-[1.02]`
                      : 'bg-theme-bg border-theme-border text-theme-text-muted hover:text-theme-text'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-theme-surface border border-theme-border rounded-3xl p-5 shadow-xl space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-theme-text flex items-center gap-2">
              <User className="w-4 h-4 text-cyan-400" />
              <span>Identity & Organization</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-theme-text-muted mb-1 font-semibold">Full Name *</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="e.g. Alex Johnson"
                  className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-theme-text focus:border-theme-accent focus:outline-none font-semibold"
                />
              </div>

              <div>
                <label className="block text-theme-text-muted mb-1 font-semibold">Job Title / Designation</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={e => setJobTitle(e.target.value)}
                  placeholder="e.g. Computer Science Student"
                  className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-theme-text focus:border-theme-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-theme-text-muted mb-1 font-semibold">Company / University</label>
                <input
                  type="text"
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                  placeholder="e.g. Stanford University"
                  className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-theme-text focus:border-theme-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-theme-text-muted mb-1 font-semibold">Profile Photo (Optional)</label>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-theme-bg hover:bg-theme-surface border border-theme-border text-theme-text-muted hover:text-theme-text transition-all cursor-pointer truncate flex-1">
                    <Camera className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                    <span className="truncate">{avatarUrl ? 'Change Photo' : 'Upload Avatar'}</span>
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </label>
                  {avatarUrl && (
                    <button
                      onClick={() => setAvatarUrl('')}
                      className="p-2 rounded-xl bg-theme-bg hover:text-rose-400 border border-theme-border text-theme-text-muted transition-colors cursor-pointer"
                      title="Remove Photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="bg-theme-surface border border-theme-border rounded-3xl p-5 shadow-xl space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-theme-text flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>Contact Channels</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-theme-text-muted mb-1 font-semibold">Phone Number *</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-theme-text font-mono focus:border-theme-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-theme-text-muted mb-1 font-semibold">Email Address *</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-theme-text focus:border-theme-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-theme-text-muted mb-1 font-semibold">WhatsApp Number</label>
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={e => setWhatsapp(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-theme-text font-mono focus:border-theme-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-theme-text-muted mb-1 font-semibold">Website / Portfolio</label>
                <input
                  type="url"
                  value={website}
                  onChange={e => setWebsite(e.target.value)}
                  placeholder="https://yourportfolio.com"
                  className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-theme-text focus:border-theme-accent focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-theme-text-muted mb-1 font-semibold">Location / Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="City, State, Country"
                  className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-theme-text focus:border-theme-accent focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Live Interactive Digital Card Preview */}
        <div className="lg:col-span-5 space-y-5">
          <div className="sticky top-20 space-y-5">
            {/* The Live Digital Contact Card */}
            <div
              className={`p-6 rounded-3xl border shadow-2xl transition-all duration-300 space-y-5 relative overflow-hidden backdrop-blur-xl ${
                selectedStyle === 'modern-glass'
                  ? 'bg-gradient-to-b from-[#0f172a]/95 via-[#090d16]/95 to-[#020617]/95 border-cyan-500/40 shadow-cyan-500/10'
                  : selectedStyle === 'executive-navy'
                  ? 'bg-gradient-to-b from-[#0c1e3d]/95 via-[#071326]/95 to-[#030914]/95 border-blue-400/40 shadow-blue-500/10'
                  : selectedStyle === 'emerald-minimal'
                  ? 'bg-gradient-to-b from-[#062c24]/95 via-[#041a15]/95 to-[#020d0b]/95 border-emerald-500/40 shadow-emerald-500/10'
                  : 'bg-gradient-to-b from-[#1e1035]/95 via-[#120824]/95 to-[#070310]/95 border-purple-500/40 shadow-purple-500/10'
              }`}
            >
              {/* Background ambient lighting */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/10 rounded-full blur-2xl pointer-events-none" />

              {/* Card Profile Top */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-900 border-2 border-white/20 shadow-lg flex-shrink-0 flex items-center justify-center text-white">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt={fullName} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl font-black font-mono">
                        {fullName.trim().charAt(0) || 'U'}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-black text-white leading-tight">
                      {fullName || 'Your Full Name'}
                    </h3>
                    <p className="text-xs text-cyan-300/90 font-medium mt-0.5">
                      {jobTitle || 'Your Profession'}
                    </p>
                    <p className="text-[11px] text-white/60">
                      {company || 'Company / University'}
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/10 text-white/80 border border-white/15 uppercase">
                  vCard 3.0
                </span>
              </div>

              {/* Contact Rows */}
              <div className="space-y-2 pt-2 border-t border-white/10 text-xs">
                {phone && (
                  <div className="flex items-center gap-2.5 text-white/90">
                    <Phone className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                    <span className="font-mono text-[11px]">{phone}</span>
                  </div>
                )}
                {email && (
                  <div className="flex items-center gap-2.5 text-white/90 truncate">
                    <Mail className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                    <span className="truncate">{email}</span>
                  </div>
                )}
                {whatsapp && (
                  <div className="flex items-center gap-2.5 text-white/90">
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span className="font-mono text-[11px]">{whatsapp}</span>
                  </div>
                )}
                {website && (
                  <div className="flex items-center gap-2.5 text-white/90 truncate">
                    <Globe className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                    <span className="truncate">{website}</span>
                  </div>
                )}
                {address && (
                  <div className="flex items-center gap-2.5 text-white/90 truncate">
                    <MapPin className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                    <span className="truncate text-[11px]">{address}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons on Card */}
              <div className="pt-3 border-t border-white/10 grid grid-cols-2 gap-2">
                <button
                  onClick={handleDownloadVCF}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold backdrop-blur-md transition-all active:scale-95 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Save Contact</span>
                </button>

                <button
                  onClick={handleCopyInfo}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md transition-all active:scale-95 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Share Info'}</span>
                </button>
              </div>
            </div>

            {/* QR Code Card */}
            <div className="p-5 rounded-3xl bg-theme-surface border border-theme-border shadow-xl flex items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-theme-text flex items-center gap-1.5">
                  <QrCode className="w-4 h-4 text-cyan-400" />
                  <span>Scan to Add Contact</span>
                </h4>
                <p className="text-[11px] text-theme-text-muted max-w-[180px]">
                  Point phone camera at this QR code to instantly import contact to phone address book.
                </p>
                <button
                  onClick={handleDownloadQR}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-400 hover:underline pt-1 cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  <span>Download QR Image</span>
                </button>
              </div>

              {qrDataUrl && (
                <div className="p-2 rounded-2xl bg-white border border-slate-200 shadow-md flex-shrink-0">
                  <img src={qrDataUrl} alt="Contact QR Code" className="w-24 h-24 object-contain" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
