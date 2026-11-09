import React from 'react';

interface MascotProps {
  className?: string;
  size?: number | string;
  animate?: boolean;
}

export const MrPlopSVG: React.FC<MascotProps> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      {/* Warm chocolate caramel gradient for pop & contrast against dark backgrounds */}
      <linearGradient id="plopBodyGrad" x1="50" y1="12" x2="50" y2="90" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#C98A58" />
        <stop offset="50%" stopColor="#A86A3D" />
        <stop offset="100%" stopColor="#7A4824" />
      </linearGradient>
      {/* Glossy top-highlight */}
      <linearGradient id="plopGlossGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </linearGradient>
    </defs>

    {/* Drop shadow underneath */}
    <ellipse cx="50" cy="88" rx="36" ry="6" fill="#000000" opacity="0.25" />

    {/* Bottom Tier */}
    <path
      d="M16 68C14 78 26 88 50 88C74 88 86 78 84 68C82 58 70 54 50 54C30 54 18 58 16 68Z"
      fill="url(#plopBodyGrad)"
      stroke="#4A260F"
      strokeWidth="3.5"
      strokeLinejoin="round"
    />
    {/* Bottom Tier Shine */}
    <path
      d="M26 66C32 60 44 58 56 58C62 58 68 60 72 63"
      stroke="url(#plopGlossGrad)"
      strokeWidth="3.5"
      strokeLinecap="round"
    />

    {/* Middle Tier */}
    <path
      d="M24 45C22 53 32 60 50 60C68 60 78 53 76 45C74 37 66 32 50 32C34 32 26 37 24 45Z"
      fill="url(#plopBodyGrad)"
      stroke="#4A260F"
      strokeWidth="3.5"
      strokeLinejoin="round"
    />
    {/* Middle Tier Highlight */}
    <path
      d="M32 41C38 36 46 35 56 36C62 36.5 66 38 68 40"
      stroke="url(#plopGlossGrad)"
      strokeWidth="3"
      strokeLinecap="round"
    />

    {/* Top Swirl */}
    <path
      d="M50 10C46 16 38 21 36 26C34 31 39 34 50 34C61 34 66 31 64 26C62 21 54 16 50 10Z"
      fill="url(#plopBodyGrad)"
      stroke="#4A260F"
      strokeWidth="3.5"
      strokeLinejoin="round"
    />
    {/* Cute curl tip on top */}
    <path
      d="M50 11C49 8 52 6 54 7C55 8 54 10 51 12"
      stroke="#FFD199"
      strokeWidth="2.5"
      strokeLinecap="round"
    />

    {/* Big Anime Sparkle Eyes */}
    <g className="mascot-eyes">
      {/* Left Eye */}
      <circle cx="38" cy="50" r="7.5" fill="#FFFFFF" stroke="#4A260F" strokeWidth="2.5" />
      <circle cx="39" cy="50" r="5" fill="#2B1408" />
      <circle cx="41" cy="48" r="2.2" fill="#FFFFFF" />
      <circle cx="37" cy="52" r="1.1" fill="#FFFFFF" />

      {/* Right Eye */}
      <circle cx="62" cy="50" r="7.5" fill="#FFFFFF" stroke="#4A260F" strokeWidth="2.5" />
      <circle cx="61" cy="50" r="5" fill="#2B1408" />
      <circle cx="63" cy="48" r="2.2" fill="#FFFFFF" />
      <circle cx="59" cy="52" r="1.1" fill="#FFFFFF" />
    </g>

    {/* Flushed Rosy Cheeks */}
    <ellipse cx="27" cy="57" rx="5.5" ry="3.5" fill="#FF6B6B" opacity="0.75" />
    <ellipse cx="73" cy="57" rx="5.5" ry="3.5" fill="#FF6B6B" opacity="0.75" />

    {/* Kawaii Open Smile with Tongue */}
    <path
      d="M44 57C44 64 56 64 56 57"
      fill="#E74C3C"
      stroke="#4A260F"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    {/* Little tongue line */}
    <path
      d="M47 60C49 61.5 51 61.5 53 60"
      stroke="#FFA3A3"
      strokeWidth="2"
      strokeLinecap="round"
    />

    {/* Floating Kawaii Sparkle */}
    <path
      d="M75 22L76.5 26.5L81 28L76.5 29.5L75 34L73.5 29.5L69 28L73.5 26.5L75 22Z"
      fill="#FFD166"
    />
  </svg>
);

export const LilDripSVG: React.FC<MascotProps> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="dripBodyGrad" x1="50" y1="8" x2="50" y2="92" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#67D5FD" />
        <stop offset="60%" stopColor="#25A5F4" />
        <stop offset="100%" stopColor="#0E78C2" />
      </linearGradient>
      <linearGradient id="dripGlossGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.65" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </linearGradient>
    </defs>

    {/* Drop shadow underneath */}
    <ellipse cx="50" cy="90" rx="28" ry="5" fill="#000000" opacity="0.25" />

    {/* Droplet Body */}
    <path
      d="M50 8C50 8 18 46 18 66C18 83 32.5 94 50 94C67.5 94 82 83 82 66C82 46 50 8 50 8Z"
      fill="url(#dripBodyGrad)"
      stroke="#0B4B75"
      strokeWidth="3.5"
      strokeLinejoin="round"
    />

    {/* Big Glossy Highlight along curve */}
    <path
      d="M26 62C24 50 36 28 46 18C44 26 32 46 32 62C32 68 34 72 36 76C30 74 27 68 26 62Z"
      fill="url(#dripGlossGrad)"
    />

    {/* Big Kawaii Happy Eyes */}
    <g className="mascot-eyes">
      {/* Left Eye */}
      <circle cx="38" cy="62" r="7.5" fill="#FFFFFF" stroke="#0B4B75" strokeWidth="2.5" />
      <circle cx="39" cy="62" r="5" fill="#0A324E" />
      <circle cx="41" cy="60" r="2.2" fill="#FFFFFF" />
      <circle cx="37" cy="64" r="1.1" fill="#FFFFFF" />

      {/* Right Eye */}
      <circle cx="62" cy="62" r="7.5" fill="#FFFFFF" stroke="#0B4B75" strokeWidth="2.5" />
      <circle cx="61" cy="62" r="5" fill="#0A324E" />
      <circle cx="63" cy="60" r="2.2" fill="#FFFFFF" />
      <circle cx="59" cy="64" r="1.1" fill="#FFFFFF" />
    </g>

    {/* Rosy Cheeks */}
    <ellipse cx="27" cy="71" rx="5" ry="3.5" fill="#FF6B6B" opacity="0.75" />
    <ellipse cx="73" cy="71" rx="5" ry="3.5" fill="#FF6B6B" opacity="0.75" />

    {/* W-Shaped Kawaii Cat Mouth */}
    <path
      d="M43 71C46 73.5 48.5 73.5 50 71C51.5 73.5 54 73.5 57 71"
      stroke="#0B4B75"
      strokeWidth="2.8"
      strokeLinecap="round"
      fill="none"
    />

    {/* Little Splash Bubbles */}
    <circle cx="76" cy="30" r="3.5" fill="#A5E7FF" stroke="#0B4B75" strokeWidth="1.5" />
    <circle cx="82" cy="40" r="2" fill="#A5E7FF" />
  </svg>
);

export const SirFlushSVG: React.FC<MascotProps> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="flushCeramicGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#E2EEF5" />
      </linearGradient>
      <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#6EE7B7" />
        <stop offset="100%" stopColor="#2FB8AC" />
      </linearGradient>
    </defs>

    {/* Drop shadow */}
    <ellipse cx="50" cy="88" rx="26" ry="4" fill="#000000" opacity="0.25" />

    {/* Water Tank */}
    <rect
      x="28"
      y="16"
      width="44"
      height="26"
      rx="7"
      fill="url(#flushCeramicGrad)"
      stroke="#1E3E4F"
      strokeWidth="3.5"
    />
    <rect
      x="40"
      y="11"
      width="20"
      height="6"
      rx="3"
      fill="url(#flushCeramicGrad)"
      stroke="#1E3E4F"
      strokeWidth="3"
    />

    {/* Golden Royal Flush Handle */}
    <path d="M24 24L32 23" stroke="#F5B700" strokeWidth="4" strokeLinecap="round" />
    <circle cx="23" cy="24" r="3.5" fill="#F5B700" stroke="#1E3E4F" strokeWidth="1.5" />

    {/* Toilet Bowl */}
    <path
      d="M30 43H70C70 43 68 68 59 76H41C32 68 30 43 30 43Z"
      fill="url(#flushCeramicGrad)"
      stroke="#1E3E4F"
      strokeWidth="3.5"
      strokeLinejoin="round"
    />
    {/* Toilet Rim */}
    <rect
      x="22"
      y="38"
      width="56"
      height="9"
      rx="4.5"
      fill="url(#flushCeramicGrad)"
      stroke="#1E3E4F"
      strokeWidth="3.5"
    />
    {/* Base Stand */}
    <path
      d="M39 76H61L65 88H35L39 76Z"
      fill="url(#flushCeramicGrad)"
      stroke="#1E3E4F"
      strokeWidth="3.5"
      strokeLinejoin="round"
    />

    {/* Teal Water Swirl inside bowl */}
    <ellipse cx="50" cy="42" rx="18" ry="4" fill="url(#waterGrad)" opacity="0.75" />

    {/* Friendly Face on Tank */}
    <g className="mascot-eyes">
      {/* Left Eye */}
      <circle cx="41" cy="28" r="4.5" fill="#1E3E4F" />
      <circle cx="42.5" cy="26.5" r="1.8" fill="#FFFFFF" />

      {/* Right Eye */}
      <circle cx="59" cy="28" r="4.5" fill="#1E3E4F" />
      <circle cx="60.5" cy="26.5" r="1.8" fill="#FFFFFF" />
    </g>

    {/* Cute Smile on Tank */}
    <path d="M47 33C49 35.5 51 35.5 53 33" stroke="#1E3E4F" strokeWidth="2.5" strokeLinecap="round" />

    {/* Rosy Cheeks */}
    <circle cx="35" cy="32" r="3" fill="#FF6B6B" opacity="0.7" />
    <circle cx="65" cy="32" r="3" fill="#FF6B6B" opacity="0.7" />

    {/* Mini floating pals dancing around */}
    {/* Mini Drip on Top Left */}
    <g transform="translate(6, 12) scale(0.24)">
      <path
        d="M50 10C50 10 20 48 20 66C20 82.5 33.5 94 50 94C66.5 94 80 82.5 80 66C80 48 50 10 50 10Z"
        fill="#3BA3E8"
        stroke="#0B4B75"
        strokeWidth="6"
      />
    </g>
    {/* Mini Poop on Top Right */}
    <g transform="translate(74, 14) scale(0.24)">
      <ellipse cx="50" cy="70" rx="38" ry="18" fill="#C98A58" stroke="#4A260F" strokeWidth="6" />
      <ellipse cx="50" cy="46" rx="28" ry="15" fill="#C98A58" stroke="#4A260F" strokeWidth="6" />
      <path
        d="M50 12C48 18 42 22 40 26C38 30 43 32 50 32C57 32 62 30 60 26C58 22 52 18 50 12Z"
        fill="#C98A58"
        stroke="#4A260F"
        strokeWidth="6"
      />
    </g>
  </svg>
);
