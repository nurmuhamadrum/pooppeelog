import React, { useEffect, useState } from 'react';
import { getBadges, CONTENT_UPDATED_EVENT } from '../data/contentStore';
import { EditableBadge } from '../types/admin';
import { MrPlopSVG, LilDripSVG, SirFlushSVG } from './MascotSVGs';
import { Award, Compass, Flame, MapPin, Mountain } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';
import { fetchBadgesFromSupabase } from '../services/adminApi';
import { useLanguage } from '../i18n/LanguageContext';
import { useWebCopy } from '../i18n/translations';

export const BadgesSection: React.FC = () => {
  const { lang } = useLanguage();
  const t = useWebCopy(lang).badges;
  const [badges, setBadges] = useState<EditableBadge[]>(getBadges);

  useEffect(() => {
    if (isSupabaseConfigured) {
      fetchBadgesFromSupabase()
        .then((remote) => {
          if (remote.length > 0) setBadges(remote);
        })
        .catch(() => {});
    }

    const refresh = () => setBadges(getBadges());
    window.addEventListener(CONTENT_UPDATED_EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(CONTENT_UPDATED_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'award':
        return <Award className="w-5 h-5 text-pee-amber" />;
      case 'compass':
        return <Compass className="w-5 h-5 text-poop-brown" />;
      case 'flame':
        return <Flame className="w-5 h-5 text-emergency" />;
      case 'map-pin':
        return <MapPin className="w-5 h-5 text-drip-blue" />;
      case 'mountain':
        return <Mountain className="w-5 h-5 text-both-teal" />;
      default:
        return <Award className="w-5 h-5 text-pee-amber" />;
    }
  };

  const getMascotBgColor = (mascot: string) => {
    switch (mascot) {
      case 'MR_PLOP':
        return 'bg-poop-brown';
      case 'LIL_DRIP':
        return 'bg-pee-amber';
      case 'SIR_FLUSH':
        return 'bg-both-teal';
      default:
        return 'bg-pee-amber';
    }
  };

  const getMascotSVG = (mascot: string) => {
    switch (mascot) {
      case 'MR_PLOP':
        return <MrPlopSVG />;
      case 'LIL_DRIP':
        return <LilDripSVG />;
      case 'SIR_FLUSH':
        return <SirFlushSVG />;
      default:
        return <LilDripSVG />;
    }
  };

  return (
    <section id="lencana" className="py-14 sm:py-20 md:py-28 border-b border-dark-border">
      <div className="max-w-7xl mx-auto px-5 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-dark-surface border border-dark-border text-xs font-bold text-pee-amber mb-3">
            <Award className="w-3.5 h-3.5" /> {t.pill}
          </div>
          <h2 className="text-2xl sm:text-5xl font-black text-cream-bg tracking-tight">
            {t.title}
          </h2>
          <p className="text-peach-tint/80 text-xs sm:text-base mt-3 leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Badges Grid: compact horizontal rows on mobile, 2/5-col cards on tablet/desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-5">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className="group bg-dark-surface border border-dark-border rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-left sm:text-center hover:border-pee-amber/60 hover:shadow-xl hover:shadow-pee-amber/10 transition-all flex flex-row sm:flex-col items-center sm:items-stretch justify-between gap-4 sm:gap-0"
            >
              <div className="flex flex-row sm:flex-col items-center sm:items-stretch gap-3.5 sm:gap-0 flex-1 min-w-0">
                {/* Mascot Icon Container */}
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full ${getMascotBgColor(
                    badge.mascot
                  )} border-2 border-dark-bg p-2 sm:mx-auto sm:mb-4 shadow-lg group-hover:scale-110 transition-transform flex items-center justify-center flex-shrink-0`}
                >
                  {getMascotSVG(badge.mascot)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-dark-bg text-[9px] sm:text-[10px] font-bold text-peach-tint/70 mb-1 sm:mb-2 border border-dark-border">
                    {getBadgeIcon(badge.iconName)}
                    <span>{badge.category}</span>
                  </div>

                  <h3 className="font-black text-sm sm:text-base text-cream-bg mb-0.5 sm:mb-1.5 truncate sm:whitespace-normal">
                    {lang === 'en' && badge.titleEn ? badge.titleEn : badge.title}
                  </h3>
                  <p className="text-peach-tint/70 text-[11px] sm:text-xs leading-relaxed line-clamp-2 sm:line-clamp-none">
                    {lang === 'en' && badge.descriptionEn ? badge.descriptionEn : badge.description}
                  </p>

                  {/* Mobile requirement pill */}
                  <span className="sm:hidden inline-block mt-2 text-[10px] text-both-teal font-extrabold bg-both-teal/10 px-2 py-0.5 rounded-md">
                    🎯 {lang === 'en' && badge.requirementTextEn ? badge.requirementTextEn : badge.requirementText}
                  </span>
                </div>
              </div>

              {/* Desktop requirement footer */}
              <div className="hidden sm:block mt-5 pt-3 border-t border-dark-border/60">
                <span className="text-[10px] text-both-teal font-extrabold bg-both-teal/10 px-2 py-1 rounded-md block">
                  🎯 {lang === 'en' && badge.requirementTextEn ? badge.requirementTextEn : badge.requirementText}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
