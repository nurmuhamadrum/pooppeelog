import React from 'react';
import Svg, {
  Path,
  Rect,
  Circle,
  Ellipse,
  Defs,
  LinearGradient,
  Stop,
  G,
} from 'react-native-svg';

interface MascotProps {
  size?: number;
}

export const MrPlopIcon: React.FC<MascotProps> = ({ size = 48 }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <Defs>
      <LinearGradient id="plopGrad" x1="50" y1="12" x2="50" y2="90" gradientUnits="userSpaceOnUse">
        <Stop offset="0" stopColor="#C98A58" />
        <Stop offset="0.5" stopColor="#A86A3D" />
        <Stop offset="1" stopColor="#7A4824" />
      </LinearGradient>
    </Defs>
    <Ellipse cx="50" cy="88" rx="36" ry="6" fill="#000000" opacity={0.25} />
    <Path
      d="M16 68C14 78 26 88 50 88C74 88 86 78 84 68C82 58 70 54 50 54C30 54 18 58 16 68Z"
      fill="url(#plopGrad)"
      stroke="#4A260F"
      strokeWidth={3.5}
      strokeLinejoin="round"
    />
    <Path
      d="M24 45C22 53 32 60 50 60C68 60 78 53 76 45C74 37 66 32 50 32C34 32 26 37 24 45Z"
      fill="url(#plopGrad)"
      stroke="#4A260F"
      strokeWidth={3.5}
      strokeLinejoin="round"
    />
    <Path
      d="M50 10C46 16 38 21 36 26C34 31 39 34 50 34C61 34 66 31 64 26C62 21 54 16 50 10Z"
      fill="url(#plopGrad)"
      stroke="#4A260F"
      strokeWidth={3.5}
      strokeLinejoin="round"
    />
    <Path d="M50 11C49 8 52 6 54 7C55 8 54 10 51 12" stroke="#FFD199" strokeWidth={2.5} strokeLinecap="round" />
    <Circle cx="38" cy="50" r="7.5" fill="#FFFFFF" stroke="#4A260F" strokeWidth={2.5} />
    <Circle cx="39" cy="50" r="5" fill="#2B1408" />
    <Circle cx="41" cy="48" r="2.2" fill="#FFFFFF" />
    <Circle cx="62" cy="50" r="7.5" fill="#FFFFFF" stroke="#4A260F" strokeWidth={2.5} />
    <Circle cx="61" cy="50" r="5" fill="#2B1408" />
    <Circle cx="63" cy="48" r="2.2" fill="#FFFFFF" />
    <Ellipse cx="27" cy="57" rx="5.5" ry="3.5" fill="#FF6B6B" opacity={0.75} />
    <Ellipse cx="73" cy="57" rx="5.5" ry="3.5" fill="#FF6B6B" opacity={0.75} />
    <Path d="M44 57C44 64 56 64 56 57" fill="#E74C3C" stroke="#4A260F" strokeWidth={2.5} strokeLinecap="round" />
  </Svg>
);

export const LilDripIcon: React.FC<MascotProps> = ({ size = 48 }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <Defs>
      <LinearGradient id="dripGrad" x1="50" y1="8" x2="50" y2="92" gradientUnits="userSpaceOnUse">
        <Stop offset="0" stopColor="#67D5FD" />
        <Stop offset="0.6" stopColor="#25A5F4" />
        <Stop offset="1" stopColor="#0E78C2" />
      </LinearGradient>
    </Defs>
    <Ellipse cx="50" cy="90" rx="28" ry="5" fill="#000000" opacity={0.25} />
    <Path
      d="M50 8C50 8 18 46 18 66C18 83 32.5 94 50 94C67.5 94 82 83 82 66C82 46 50 8 50 8Z"
      fill="url(#dripGrad)"
      stroke="#0B4B75"
      strokeWidth={3.5}
      strokeLinejoin="round"
    />
    <Path
      d="M26 62C24 50 36 28 46 18C44 26 32 46 32 62C32 68 34 72 36 76C30 74 27 68 26 62Z"
      fill="#FFFFFF"
      opacity={0.45}
    />
    <Circle cx="38" cy="62" r="7.5" fill="#FFFFFF" stroke="#0B4B75" strokeWidth={2.5} />
    <Circle cx="39" cy="62" r="5" fill="#0A324E" />
    <Circle cx="41" cy="60" r="2.2" fill="#FFFFFF" />
    <Circle cx="62" cy="62" r="7.5" fill="#FFFFFF" stroke="#0B4B75" strokeWidth={2.5} />
    <Circle cx="61" cy="62" r="5" fill="#0A324E" />
    <Circle cx="63" cy="60" r="2.2" fill="#FFFFFF" />
    <Ellipse cx="27" cy="71" rx="5" ry="3.5" fill="#FF6B6B" opacity={0.75} />
    <Ellipse cx="73" cy="71" rx="5" ry="3.5" fill="#FF6B6B" opacity={0.75} />
    <Path
      d="M43 71C46 73.5 48.5 73.5 50 71C51.5 73.5 54 73.5 57 71"
      stroke="#0B4B75"
      strokeWidth={2.8}
      strokeLinecap="round"
      fill="none"
    />
  </Svg>
);

export const SirFlushIcon: React.FC<MascotProps> = ({ size = 48 }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <Defs>
      <LinearGradient id="flushGrad" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#FFFFFF" />
        <Stop offset="1" stopColor="#E2EEF5" />
      </LinearGradient>
      <LinearGradient id="flushWaterGrad" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#6EE7B7" />
        <Stop offset="1" stopColor="#2FB8AC" />
      </LinearGradient>
    </Defs>
    <Ellipse cx="50" cy="88" rx="26" ry="4" fill="#000000" opacity={0.25} />
    <Rect x="28" y="16" width="44" height="26" rx="7" fill="url(#flushGrad)" stroke="#1E3E4F" strokeWidth={3.5} />
    <Rect x="40" y="11" width="20" height="6" rx="3" fill="url(#flushGrad)" stroke="#1E3E4F" strokeWidth={3} />
    <Path d="M24 24L32 23" stroke="#F5B700" strokeWidth={4} strokeLinecap="round" />
    <Circle cx="23" cy="24" r="3.5" fill="#F5B700" stroke="#1E3E4F" strokeWidth={1.5} />
    <Path d="M30 43H70C70 43 68 68 59 76H41C32 68 30 43 30 43Z" fill="url(#flushGrad)" stroke="#1E3E4F" strokeWidth={3.5} strokeLinejoin="round" />
    <Rect x="22" y="38" width="56" height="9" rx="4.5" fill="url(#flushGrad)" stroke="#1E3E4F" strokeWidth={3.5} />
    <Path d="M39 76H61L65 88H35L39 76Z" fill="url(#flushGrad)" stroke="#1E3E4F" strokeWidth={3.5} strokeLinejoin="round" />
    <Ellipse cx="50" cy="42" rx="18" ry="4" fill="url(#flushWaterGrad)" opacity={0.75} />
    <Circle cx="41" cy="28" r="4.5" fill="#1E3E4F" />
    <Circle cx="42.5" cy="26.5" r="1.8" fill="#FFFFFF" />
    <Circle cx="59" cy="28" r="4.5" fill="#1E3E4F" />
    <Circle cx="60.5" cy="26.5" r="1.8" fill="#FFFFFF" />
    <Path d="M47 33C49 35.5 51 35.5 53 33" stroke="#1E3E4F" strokeWidth={2.5} strokeLinecap="round" />
    <Circle cx="35" cy="32" r="3" fill="#FF6B6B" opacity={0.7} />
    <Circle cx="65" cy="32" r="3" fill="#FF6B6B" opacity={0.7} />
  </Svg>
);

