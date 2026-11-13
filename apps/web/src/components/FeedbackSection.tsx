import React, { useState } from 'react';
import { MessageSquarePlus, Send, Sparkles, CheckCircle2, AlertCircle, Heart, Bug, Lightbulb, MessageCircle } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useWebCopy } from '../i18n/translations';
import { submitFeedback } from '../services/adminApi';
import { FeedbackCategory } from '../types/admin';
import { MrPlopSVG, LilDripSVG, SirFlushSVG } from './MascotSVGs';

const CATEGORY_ICONS: Record<FeedbackCategory, React.ElementType> = {
  SUGGESTION: Lightbulb,
  BUG: Bug,
  PRAISE: Heart,
  OTHER: MessageCircle,
};

export const FeedbackSection: React.FC = () => {
  const { lang } = useLanguage();
  const copy = useWebCopy(lang).feedback;

  const [category, setCategory] = useState<FeedbackCategory>('SUGGESTION');
  const [rating, setRating] = useState<number>(5);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || submitting) return;

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await submitFeedback({
        category,
        rating,
        message,
        email: email.trim() || undefined,
        platform: 'WEB',
      });

      if (!res.ok) {
        setErrorMessage(res.error || copy.errorMsg);
      } else {
        setSubmitted(true);
        setMessage('');
        setEmail('');
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : copy.errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setMessage('');
    setEmail('');
    setCategory('SUGGESTION');
    setRating(5);
    setErrorMessage(null);
  };

  return (
    <section id="feedback" className="py-20 px-4 md:px-8 border-t border-dark-border relative overflow-hidden bg-gradient-to-b from-dark-bg via-dark-surface/40 to-dark-bg">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-pee-amber/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-both-teal/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-both-teal/10 border border-both-teal/20 text-both-teal text-xs font-bold tracking-wide uppercase mb-4">
            <MessageSquarePlus className="w-4 h-4" />
            {copy.pill}
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-cream-bg tracking-tight mb-3">
            {copy.title}
          </h2>
          <p className="text-sm md:text-base text-cream-bg/70 max-w-xl mx-auto font-medium">
            {copy.subtitle}
          </p>
        </div>

        {/* Content Box */}
        <div className="bg-dark-surface/90 border border-dark-border rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden backdrop-blur-sm">
          {submitted ? (
            <div className="text-center py-8 space-y-6 animate-fade-in">
              <div className="flex items-center justify-center gap-3">
                <div className="w-14 h-14 bg-poop-brown/20 border border-poop-brown/40 rounded-2xl flex items-center justify-center p-2.5">
                  <MrPlopSVG />
                </div>
                <div className="w-14 h-14 bg-both-teal/20 border border-both-teal/40 rounded-2xl flex items-center justify-center p-2.5">
                  <SirFlushSVG />
                </div>
                <div className="w-14 h-14 bg-pee-amber/20 border border-pee-amber/40 rounded-2xl flex items-center justify-center p-2.5">
                  <LilDripSVG />
                </div>
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 text-both-teal text-xs font-bold uppercase tracking-wider bg-both-teal/10 px-3 py-1 rounded-full">
                  <CheckCircle2 className="w-4 h-4" />
                  Sent Successfully
                </div>
                <h3 className="text-2xl font-black text-cream-bg">
                  {copy.successTitle}
                </h3>
                <p className="text-sm text-cream-bg/75 max-w-md mx-auto leading-relaxed">
                  {copy.successDesc}
                </p>
              </div>

              <div>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-2.5 rounded-xl bg-dark-bg border border-dark-border hover:border-both-teal text-cream-bg text-sm font-bold transition-all hover:scale-105 active:scale-95"
                >
                  {copy.sendAnother}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category selector */}
              <div>
                <label className="block text-xs font-bold text-cream-bg/80 uppercase tracking-wider mb-2.5">
                  {copy.categoryLabel}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['SUGGESTION', 'BUG', 'PRAISE', 'OTHER'] as FeedbackCategory[]).map((cat) => {
                    const isSelected = category === cat;
                    const Icon = CATEGORY_ICONS[cat];
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-both-teal text-ink border-both-teal shadow-md shadow-both-teal/20 scale-[1.02]'
                            : 'bg-dark-bg/60 border-dark-border text-cream-bg/80 hover:border-dark-border/80 hover:bg-dark-bg'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{copy.categories[cat]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-xs font-bold text-cream-bg/80 uppercase tracking-wider mb-2">
                  {copy.ratingLabel}
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`text-2xl transition-transform hover:scale-125 focus:outline-none ${
                        star <= rating ? 'opacity-100 scale-110' : 'opacity-30 grayscale hover:opacity-75'
                      }`}
                      title={`${star} star`}
                    >
                      ⭐
                    </button>
                  ))}
                  <span className="text-xs font-bold text-cream-bg/60 ml-2">
                    {rating === 5 ? '🤩 Luar Biasa / Awesome!' : rating >= 4 ? '😊 Puas / Great' : rating >= 3 ? '🙂 Cukup / Good' : '😐 Butuh Perbaikan'}
                  </span>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-bold text-cream-bg/80 uppercase tracking-wider mb-2">
                  {copy.messageLabel} <span className="text-emergency-red">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={copy.messagePlaceholder}
                  className="w-full bg-dark-bg/80 border border-dark-border focus:border-both-teal rounded-2xl p-4 text-sm text-cream-bg placeholder-cream-bg/40 focus:outline-none focus:ring-1 focus:ring-both-teal transition-all resize-y min-h-[100px]"
                />
              </div>

              {/* Email (Optional) */}
              <div>
                <label className="block text-xs font-bold text-cream-bg/80 uppercase tracking-wider mb-2">
                  {copy.emailLabel}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={copy.emailPlaceholder}
                  className="w-full bg-dark-bg/80 border border-dark-border focus:border-both-teal rounded-xl px-4 py-2.5 text-sm text-cream-bg placeholder-cream-bg/40 focus:outline-none focus:ring-1 focus:ring-both-teal transition-all"
                />
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-emergency-red/10 border border-emergency-red/30 text-emergency-red text-xs font-semibold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex items-center justify-between pt-2">
                <div className="text-[11px] text-cream-bg/50 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-pee-amber" />
                  <span>Kritik & saran langsung dibaca tim pengembang.</span>
                </div>

                <button
                  type="submit"
                  disabled={submitting || !message.trim()}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-pee-amber to-both-teal hover:opacity-95 text-ink text-sm font-black tracking-wide shadow-lg shadow-both-teal/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? copy.submitting : copy.submitBtn}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

