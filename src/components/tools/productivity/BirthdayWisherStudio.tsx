import React, { useState } from 'react';
import { ResultCard } from '../../common/ResultCard';
import {
  Gift,
  Heart,
  Send,
  Calendar,
  Clock,
  Sparkles,
  Copy,
  Check,
  Share2,
  Phone,
  MessageCircle,
  ShieldAlert,
  Volume2,
  VolumeX,
  X,
  Play,
  RotateCcw,
  Award,
} from 'lucide-react';
import { sounds } from '../../../utils/audio';

interface ScheduledWish {
  id: string;
  recipientName: string;
  contact: string;
  date: string;
  time: string;
  message: string;
  status: 'Scheduled' | 'Pending API Setup' | 'Sent';
}

export const BirthdayWisherStudio: React.FC = () => {
  const [recipientName, setRecipientName] = useState('Alex');
  const [relationship, setRelationship] = useState('Best Friend');
  const [tone, setTone] = useState<string>('Sweet & Heartfelt');
  const [birthdayDate, setBirthdayDate] = useState('2026-08-30');
  const [sendTime, setSendTime] = useState('00:00');
  const [customMessage, setCustomMessage] = useState('');
  const [contactNumber, setContactNumber] = useState('');

  // Generated message state
  const [generatedWish, setGeneratedWish] = useState('');
  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Digital Gift Modal state
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [giftBoxOpened, setGiftBoxOpened] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);

  // Scheduled tasks queue
  const [scheduledList, setScheduledList] = useState<ScheduledWish[]>([]);
  const [scheduleSuccess, setScheduleSuccess] = useState(false);

  const generateMessage = () => {
    const name = recipientName.trim() || 'my friend';
    let msg = '';

    switch (tone) {
      case 'Funny & Teasing':
        msg = `Happy Birthday ${name}! 🎂 Another year older, but definitely not any wiser! May your hair stay intact, your coffee stay strong, and your assignments do themselves. Have an epic blast today! 🎉🥳`;
        break;
      case 'Professional & Warm':
        msg = `Dear ${name}, wishing you a very Happy Birthday! 🌟 May this upcoming year bring you continued professional milestones, academic success, good health, and prosperous endeavors. Warm regards! 🎈`;
        break;
      case 'Emotional & Deep':
        msg = `Happy Birthday, ${name}. ❤️ I am genuinely grateful to have you in my life. Your kindness, loyalty, and strength inspire everyone around you. I pray this year surrounds you with boundless peace, joy, and fulfilled dreams. 🕊️✨`;
        break;
      case 'Short & Punchy':
        msg = `Happy Birthday ${name}! 🎉 Wishing you massive success, good health, and an unforgettable celebration today! 🚀🎂`;
        break;
      case 'Romantic':
        msg = `Happy Birthday to the most special person in my world, ${name}. 💖 Every moment with you is a blessing. Wishing you all the love, happiness, and magic you bring into my life every single day. 🌹🥂`;
        break;
      default: // Sweet & Heartfelt
        msg = `Happy Birthday, ${name}! 🎉🎂 Wishing you an extraordinary year filled with boundless happiness, outstanding achievements, and unforgettable memories. Thank you for being such a wonderful ${relationship.toLowerCase()}! ✨💛`;
        break;
    }

    setGeneratedWish(msg);
  };

  const handleOpenGiftBox = () => {
    setGiftBoxOpened(true);
    if (audioEnabled) {
      try {
        sounds.playSuccess();
      } catch (e) {}
    }
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(generatedWish || customMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyGiftLink = () => {
    const link = `${window.location.origin}/?birthdayWish=${encodeURIComponent(recipientName)}&from=StudKit`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleScheduleAutomation = () => {
    const newWish: ScheduledWish = {
      id: `wish-${Date.now()}`,
      recipientName: recipientName || 'Friend',
      contact: contactNumber || 'Direct Share',
      date: birthdayDate,
      time: sendTime,
      message: customMessage || generatedWish,
      status: 'Pending API Setup',
    };
    setScheduledList(prev => [newWish, ...prev]);
    setScheduleSuccess(true);
    setTimeout(() => setScheduleSuccess(false), 3500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto select-none">
      {/* Header */}
      <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-500 p-0.5 shadow-lg shadow-rose-500/25 flex-shrink-0">
            <div className="w-full h-full bg-theme-bg rounded-[14px] flex items-center justify-center text-rose-400">
              <Gift className="w-6 h-6 animate-pulse" />
            </div>
          </div>
          <div>
            <h2 className="text-lg font-black text-theme-text tracking-tight flex items-center gap-2">
              <span>Birthday Wisher & Digital Gift Studio</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30">
                Cinematic Greetings
              </span>
            </h2>
            <p className="text-xs text-theme-text-muted mt-0.5">
              Generate personalized birthday greetings, schedule message automations, and create interactive 3D gift cards.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (!generatedWish) generateMessage();
            setGiftBoxOpened(false);
            setShowGiftModal(true);
          }}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-rose-500/25 cursor-pointer transition-all active:scale-95"
        >
          <Sparkles className="w-4 h-4" />
          <span>Launch 3D Digital Gift Box</span>
        </button>
      </div>

      {/* Main Configuration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Input Form */}
        <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-theme-accent flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-rose-400" />
            <span>Recipient & Tone Parameters</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-theme-text">Recipient Name *</label>
              <input
                type="text"
                value={recipientName}
                onChange={e => setRecipientName(e.target.value)}
                placeholder="e.g. Sohaib or Sarah"
                className="w-full p-2.5 rounded-xl bg-theme-bg border border-theme-border text-xs text-theme-text outline-none focus:border-theme-accent"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-theme-text">Relationship</label>
              <select
                value={relationship}
                onChange={e => setRelationship(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-theme-bg border border-theme-border text-xs text-theme-text outline-none focus:border-theme-accent"
              >
                <option value="Best Friend">Best Friend</option>
                <option value="Sibling">Sibling / Family</option>
                <option value="Classmate">Classmate / Peer</option>
                <option value="Colleague">Colleague / Work</option>
                <option value="Mentor">Teacher / Mentor</option>
                <option value="Romantic Partner">Partner / Romantic</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-theme-text">Message Tone & Style</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {[
                'Sweet & Heartfelt',
                'Funny & Teasing',
                'Professional & Warm',
                'Emotional & Deep',
                'Short & Punchy',
                'Romantic',
              ].map(t => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={`p-2 rounded-xl text-[11px] font-bold border transition-all cursor-pointer text-left ${
                    tone === t
                      ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                      : 'bg-theme-bg border-theme-border text-theme-text-muted hover:text-theme-text'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={generateMessage}
            className="w-full py-3 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-theme-accent/20 transition-all active:scale-98"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Customized Birthday Message</span>
          </button>
        </div>

        {/* Right: Output & Action Studio */}
        <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-theme-accent flex items-center gap-1.5">
                <Send className="w-4 h-4 text-emerald-400" />
                <span>Generated Birthday Greeting</span>
              </h3>
              <span className="text-[10px] font-mono text-rose-400">Ready to Share</span>
            </div>

            <textarea
              rows={5}
              value={generatedWish || (recipientName ? `Happy Birthday, ${recipientName}! 🎉 Wishing you an extraordinary year filled with joy and success.` : '')}
              onChange={e => setGeneratedWish(e.target.value)}
              placeholder="Click 'Generate' or write your personalized message here..."
              className="w-full p-3.5 rounded-2xl bg-theme-bg border border-theme-border text-xs text-theme-text outline-none focus:border-theme-accent leading-relaxed resize-none"
            />
          </div>

          {/* Quick Actions */}
          <div className="space-y-2.5">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                onClick={handleCopyMessage}
                className={`py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  copied
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                    : 'bg-theme-bg border-theme-border text-theme-text hover:bg-theme-surface'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Text'}</span>
              </button>

              <a
                href={`https://wa.me/?text=${encodeURIComponent(generatedWish)}`}
                target="_blank"
                rel="noreferrer"
                className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/25 transition-all cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>

              <button
                onClick={handleCopyGiftLink}
                className={`py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer sm:col-span-1 col-span-2 ${
                  copiedLink
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                    : 'bg-theme-bg border-theme-border text-cyan-400 hover:bg-theme-surface'
                }`}
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Link Copied!' : 'Copy Gift Link'}</span>
              </button>
            </div>

            <button
              onClick={() => {
                setGiftBoxOpened(false);
                setShowGiftModal(true);
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white text-xs font-black shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2 cursor-pointer active:scale-98 transition-all"
            >
              <Gift className="w-4 h-4 animate-bounce" />
              <span>Preview Live 3D Birthday Gift Experience</span>
            </button>
          </div>
        </div>
      </div>

      {/* Schedule Automation Section */}
      <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-theme-accent flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>Scheduled Birthday Automation (SMS / WhatsApp Dispatch)</span>
          </h3>
          <span className="text-[10px] font-mono text-cyan-400">Time-Zone Synchronized</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-bold text-theme-text flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-theme-accent" /> Birthday Date
            </label>
            <input
              type="date"
              value={birthdayDate}
              onChange={e => setBirthdayDate(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-theme-bg border border-theme-border text-xs text-theme-text outline-none focus:border-theme-accent font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-theme-text flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-theme-accent" /> Send Time
            </label>
            <input
              type="time"
              value={sendTime}
              onChange={e => setSendTime(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-theme-bg border border-theme-border text-xs text-theme-text outline-none focus:border-theme-accent font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-theme-text flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-theme-accent" /> Recipient Phone / Contact
            </label>
            <input
              type="text"
              value={contactNumber}
              onChange={e => setContactNumber(e.target.value)}
              placeholder="e.g. +92 300 1234567"
              className="w-full p-2.5 rounded-xl bg-theme-bg border border-theme-border text-xs text-theme-text outline-none focus:border-theme-accent font-mono"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <button
            onClick={handleScheduleAutomation}
            className="px-5 py-2.5 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer active:scale-95 transition-all"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Schedule Automatic Wish</span>
          </button>

          {scheduleSuccess && (
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 animate-fade-in">
              <Check className="w-4 h-4" /> Wish registered in local schedule queue!
            </span>
          )}
        </div>

        {/* Honest API Integration Alert */}
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-300">
          <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>
            <strong>Automation Connectivity Note:</strong> Automated midnight SMS/WhatsApp background dispatch requires an active messaging provider integration (Twilio / WhatsApp Business Cloud API). Alternatively, use the 1-Click WhatsApp direct link anytime.
          </span>
        </div>
      </div>

      {/* Interactive 3D Digital Gift Box Modal */}
      {showGiftModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in select-none"
          onClick={() => setShowGiftModal(false)}
        >
          <div
            className="w-full max-w-lg bg-theme-surface border border-rose-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col items-center text-center space-y-6 animate-scale-in"
            onClick={e => e.stopPropagation()}
          >
            {/* Top Close & Audio Control */}
            <div className="w-full flex items-center justify-between">
              <button
                onClick={() => setAudioEnabled(!audioEnabled)}
                className="p-2 rounded-xl bg-theme-bg border border-theme-border text-theme-text-muted hover:text-theme-text cursor-pointer"
              >
                {audioEnabled ? <Volume2 className="w-4 h-4 text-rose-400" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setShowGiftModal(false)}
                className="p-2 rounded-xl bg-theme-bg border border-theme-border text-theme-text-muted hover:text-theme-text cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {!giftBoxOpened ? (
              /* Closed Floating Gift Box */
              <div className="space-y-6 py-4">
                <div
                  onClick={handleOpenGiftBox}
                  className="w-32 h-32 sm:w-40 sm:h-40 mx-auto rounded-3xl bg-gradient-to-tr from-rose-600 via-pink-500 to-amber-400 p-1 shadow-2xl shadow-rose-500/50 cursor-pointer transform hover:scale-105 active:scale-95 transition-all duration-300 animate-bounce relative group"
                >
                  <div className="w-full h-full bg-theme-bg rounded-[22px] flex flex-col items-center justify-center text-rose-400">
                    <Gift className="w-16 h-16 group-hover:rotate-12 transition-transform duration-300" />
                    <span className="text-[10px] font-mono font-bold uppercase text-amber-400 mt-2">
                      Tap To Open
                    </span>
                  </div>
                  {/* Glowing Aura */}
                  <div className="absolute inset-0 rounded-3xl bg-rose-500 blur-xl opacity-30 group-hover:opacity-60 transition-opacity -z-10" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-black text-theme-text">A Special Birthday Gift for {recipientName}! 🎁</h3>
                  <p className="text-xs text-theme-text-muted">Tap the gift box above to reveal your surprise celebration.</p>
                </div>
              </div>
            ) : (
              /* Opened Gift Box & Cinematic Reveal */
              <div className="space-y-5 animate-scale-in py-2">
                <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-rose-500 via-amber-400 to-emerald-400 p-0.5 shadow-xl shadow-amber-400/30 flex items-center justify-center animate-pulse">
                  <div className="w-full h-full bg-theme-bg rounded-[22px] flex items-center justify-center text-amber-400 text-3xl">
                    🎂
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300 tracking-tight">
                    Happy Birthday, {recipientName}! 🎉
                  </h2>
                  <p className="text-xs font-mono text-cyan-400 mt-1 font-bold">
                    May all your dreams and wishes come true! ✨
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-theme-bg border border-theme-border text-xs text-theme-text leading-relaxed text-left font-medium">
                  {generatedWish || customMessage || `Wishing you an unforgettable year filled with joy and success!`}
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  <button
                    onClick={handleCopyGiftLink}
                    className="px-5 py-2.5 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold flex items-center gap-2 shadow-lg cursor-pointer active:scale-95"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>{copiedLink ? 'Share Link Copied!' : 'Share This Gift'}</span>
                  </button>
                  <button
                    onClick={() => setGiftBoxOpened(false)}
                    className="px-4 py-2.5 rounded-xl bg-theme-bg hover:bg-theme-surface border border-theme-border text-theme-text text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Re-play Gift Box</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
