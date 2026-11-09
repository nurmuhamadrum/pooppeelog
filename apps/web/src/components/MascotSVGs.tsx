import React from 'react';

interface MascotProps {
  className?: string;
  size?: number | string;
}

export const MrPlopSVG: React.FC<MascotProps> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Top Swirl */}
    <path d="M50 12C48 18 42 22 40 26C38 30 43 32 50 32C57 32 62 30 60 26C58 22 52 18 50 12Z" fill="#A27049" />
    <path d="M50 12C49 16 43 20 42 25C47 28 53 28 58 25C57 20 51 16 50 12Z" fill="#8B5E3C" />
    {/* Middle Tier */}
    <ellipse cx="50" cy="46" rx="28" ry="15" fill="#8B5E3C" />
    <path d="M24 46C24 38 36 34 50 34C64 34 76 38 76 46C76 53 64 57 50 57C36 57 24 53 24 46Z" fill="#8B5E3C" />
    {/* Bottom Tier */}
    <ellipse cx="50" cy="70" rx="38" ry="18" fill="#8B5E3C" />
    <ellipse cx="50" cy="65" rx="36" ry="16" fill="#996843" />
    <ellipse cx="50" cy="42" rx="24" ry="12" fill="#996843" />
    {/* Eyes */}
    <circle cx="39" cy="54" r="7" fill="#FFFFFF" />
    <circle cx="61" cy="54" r="7" fill="#FFFFFF" />
    <circle cx="40" cy="54" r="4.5" fill="#2B1A0E" />
    <circle cx="62" cy="54" r="4.5" fill="#2B1A0E" />
    <circle cx="42" cy="52" r="1.8" fill="#FFFFFF" />
    <circle cx="64" cy="52" r="1.8" fill="#FFFFFF" />
    {/* Rosy Cheeks */}
    <circle cx="30" cy="62" r="4.5" fill="#FF5A5F" opacity="0.65" />
    <circle cx="70" cy="62" r="4.5" fill="#FF5A5F" opacity="0.65" />
    {/* Happy Smile */}
    <path d="M43 62C47 66 53 66 57 62" stroke="#2B1A0E" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

export const LilDripSVG: React.FC<MascotProps> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Droplet Body */}
    <path d="M50 10C50 10 20 48 20 66C20 82.5 33.5 94 50 94C66.5 94 80 82.5 80 66C80 48 50 10 50 10Z" fill="#3BA3E8" />
    {/* Highlight shine */}
    <path d="M30 52C28 58 28 66 31 72C33 70 34 64 34 58C34 55 32 53 30 52Z" fill="#72C2F8" opacity="0.85" />
    {/* Eyes */}
    <circle cx="39" cy="64" r="7.5" fill="#FFFFFF" />
    <circle cx="61" cy="64" r="7.5" fill="#FFFFFF" />
    <circle cx="39.5" cy="64" r="4.8" fill="#2B1A0E" />
    <circle cx="61.5" cy="64" r="4.8" fill="#2B1A0E" />
    <circle cx="41.5" cy="62" r="2" fill="#FFFFFF" />
    <circle cx="63.5" cy="62" r="2" fill="#FFFFFF" />
    {/* Rosy Cheeks */}
    <circle cx="28" cy="73" r="5" fill="#FF5A5F" opacity="0.65" />
    <circle cx="72" cy="73" r="5" fill="#FF5A5F" opacity="0.65" />
    {/* Cute Smile */}
    <path d="M44 73C47 77 53 77 56 73" stroke="#2B1A0E" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

export const SirFlushSVG: React.FC<MascotProps> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Water Tank */}
    <rect x="30" y="16" width="40" height="26" rx="6" fill="#FFFFFF" stroke="#2B1A0E" strokeWidth="3" />
    <rect x="42" y="12" width="16" height="5" rx="2.5" fill="#FFFFFF" stroke="#2B1A0E" strokeWidth="2.5" />
    {/* Flush Lever */}
    <circle cx="35" cy="22" r="2.5" fill="#2B1A0E" />
    {/* Bowl */}
    <path d="M32 42H68C68 42 66 66 58 74H42C34 66 32 42 32 42Z" fill="#FFFFFF" stroke="#2B1A0E" strokeWidth="3" />
    <rect x="24" y="38" width="52" height="8" rx="4" fill="#FFFFFF" stroke="#2B1A0E" strokeWidth="3" />
    <path d="M40 74H60L63 86H37L40 74Z" fill="#FFFFFF" stroke="#2B1A0E" strokeWidth="3" />
    {/* Bowl Face */}
    <circle cx="42" cy="55" r="4" fill="#2B1A0E" />
    <circle cx="58" cy="55" r="4" fill="#2B1A0E" />
    <circle cx="43.5" cy="53.5" r="1.5" fill="#FFFFFF" />
    <circle cx="59.5" cy="53.5" r="1.5" fill="#FFFFFF" />
    <circle cx="34" cy="60" r="3.5" fill="#FF5A5F" opacity="0.65" />
    <circle cx="66" cy="60" r="3.5" fill="#FF5A5F" opacity="0.65" />
    <path d="M46 62C48 65 52 65 54 62" stroke="#2B1A0E" strokeWidth="2.5" strokeLinecap="round" />
    {/* Floating Mini Drip on Left */}
    <g transform="translate(4, 18) scale(0.24)">
      <path d="M50 10C50 10 20 48 20 66C20 82.5 33.5 94 50 94C66.5 94 80 82.5 80 66C80 48 50 10 50 10Z" fill="#3BA3E8" stroke="#2B1A0E" strokeWidth="6" />
    </g>
    {/* Floating Mini Poop on Right */}
    <g transform="translate(74, 20) scale(0.24)">
      <ellipse cx="50" cy="70" rx="38" ry="18" fill="#8B5E3C" stroke="#2B1A0E" strokeWidth="6" />
      <ellipse cx="50" cy="46" rx="28" ry="15" fill="#8B5E3C" stroke="#2B1A0E" strokeWidth="6" />
      <path d="M50 12C48 18 42 22 40 26C38 30 43 32 50 32C57 32 62 30 60 26C58 22 52 18 50 12Z" fill="#8B5E3C" stroke="#2B1A0E" strokeWidth="6" />
    </g>
  </svg>
);
