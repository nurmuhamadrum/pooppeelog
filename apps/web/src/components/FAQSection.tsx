import React, { useEffect, useState } from 'react';
import { getFaqs, CONTENT_UPDATED_EVENT } from '../data/contentStore';
import { EditableFAQ } from '../types/admin';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';
import { fetchFaqsFromSupabase } from '../services/adminApi';
import { useLanguage } from '../i18n/LanguageContext';
import { useWebCopy } from '../i18n/translations';

export const FAQSection: React.FC = () => {
  const { lang } = useLanguage();
  const t = useWebCopy(lang).faq;
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [faqs, setFaqs] = useState<EditableFAQ[]>(getFaqs);

  useEffect(() => {
    if (isSupabaseConfigured) {
      fetchFaqsFromSupabase(true)
        .then((remote) => {
          if (remote.length > 0) setFaqs(remote);
        })
        .catch(() => {});
    }

    const refresh = () => setFaqs(getFaqs());
    window.addEventListener(CONTENT_UPDATED_EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(CONTENT_UPDATED_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  const FAQS = faqs.filter((f) => f.isActive).sort((a, b) => a.order - b.order);

  return (
    <section className="py-20 md:py-28 border-b border-dark-border">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-dark-surface border border-dark-border text-xs font-bold text-pee-amber mb-3">
            <HelpCircle className="w-3.5 h-3.5" /> {t.pill}
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-cream-bg tracking-tight">
            {t.title}
          </h2>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-dark-surface border border-dark-border rounded-2xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 font-bold text-cream-bg hover:text-pee-amber transition-colors"
                >
                  <span className="text-sm sm:text-base">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 flex-shrink-0 text-peach-tint/60 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-pee-amber' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-xs sm:text-sm text-peach-tint/80 leading-relaxed border-t border-dark-border/40 pt-4 animate-fadeIn">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
