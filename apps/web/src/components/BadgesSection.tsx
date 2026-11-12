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
    <section id="lencana" className="py-20 md:py-28 border-b border-dark-border">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-dark-surface border border-dark-border text-xs font-bold text-pee-amber mb-3">
            <Award className="w-3.5 h-3.5" /> {t.pill}
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-cream-bg tracking-tight">
            {t.title}
          </h2>
          <p className="text-peach-tint/80 text-sm sm:text-base mt-3 leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className="group bg-dark-surface border border-dark-border rounded-3xl p-6 text-center hover:border-pee-amber/60 hover:shadow-xl hover:shadow-pee-amber/10 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Mascot Icon Container - circular with matching brand background & dark-bg border */}
                <div
                  className={`w-16 h-16 rounded-full ${getMascotBgColor(
                    badge.mascot
                  )} border-2 border-dark-bg p-2 mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform flex items-center justify-center`}
                >
                  {getMascotSVG(badge.mascot)}
                </div>

                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-dark-bg text-[10px] font-bold text-peach-tint/70 mb-2 border border-dark-border">
                  {getBadgeIcon(badge.iconName)}
                  <span>{badge.category}</span>
                </div>

                <h3 className="font-black text-base text-cream-bg mb-1.5">
                  {badge.title}
                </h3>
                <p className="text-peach-tint/70 text-xs leading-relaxed">
                  {badge.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-dark-border/60">
                <span className="text-[10px] text-both-teal font-extrabold bg-both-teal/10 px-2 py-1 rounded-md block">
                  🎯 {badge.requirementText}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
