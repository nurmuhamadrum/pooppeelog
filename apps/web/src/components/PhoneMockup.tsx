import React, { useState } from 'react';
import { MrPlopSVG, LilDripSVG, SirFlushSVG } from './MascotSVGs';
import {
  MapPin,
  Calendar,
  BarChart3,
  Lock,
  CheckCircle2,
  ChevronRight,
  X,
  Compass,
  Navigation,
  Plus,
  Minus,
} from 'lucide-react';

export type MockupScreen = 'map' | 'quick-log' | 'mood' | 'timeline' | 'stats' | 'lock';

interface PhoneMockupProps {
  currentScreen?: MockupScreen;
  onScreenChange?: (screen: MockupScreen) => void;
  className?: string;
}

interface MapPinItem {
  id: string;
  type: 'pee' | 'poop' | 'combo';
  title: string;
  location: string;
  time: string;
  mood: string;
  note: string;
  x: number; // percentage
  y: number; // percentage
  badge: string;
}

export const PhoneMockup: React.FC<PhoneMockupProps> = ({
  currentScreen,
  onScreenChange,
  className = '',
}) => {
  const [internalScreen, setInternalScreen] = useState<MockupScreen>('map');
  const [mapFilter, setMapFilter] = useState<'all' | 'pee' | 'poop'>('all');
  const [selectedPinId, setSelectedPinId] = useState<string | null>('pee-menteng');

  const activeScreen = currentScreen !== undefined ? currentScreen : internalScreen;

  const setScreen = (s: MockupScreen) => {
    if (onScreenChange) {
      onScreenChange(s);
    } else {
      setInternalScreen(s);
    }
  };

  const mapPins: MapPinItem[] = [
    {
      id: 'pee-menteng',
      type: 'pee',
      title: "Lil' Drip • Lega Banget",
      location: 'Kec. Menteng, Jakarta Pusat',
      time: '14:15',
      mood: 'Lega Banget 😌',
      note: '"Setelah meeting 3 jam akhirnya plong!"',
      x: 68,
      y: 24,
      badge: 'Menteng',
    },
    {
      id: 'poop-gi',
      type: 'poop',
      title: 'Mr. Plop • Masih Ganjel',
      location: 'Grand Indonesia Lt. 3A',
      time: '08:30',
      mood: 'Masih Ganjel ⏱️',
      note: '"Kloset otomatisnya dingin bgt"',
      x: 24,
      y: 42,
      badge: 'Grand Indonesia',
    },
    {
      id: 'combo-sudirman',
      type: 'combo',
      title: 'Sir Flush • Selesai Tuntas',
      location: 'SCBD Sudirman Kav. 52',
      time: '12:00',
      mood: 'Kombo Sukses 🚽',
      note: '"Paket kombo pee & poop sebelum jam makan siang"',
      x: 52,
      y: 54,
      badge: 'SCBD',
    },
    {
      id: 'pee-senayan',
      type: 'pee',
      title: "Lil' Drip • Nahan Lama",
      location: 'Gelora Bung Karno, Senayan',
      time: '17:40',
      mood: 'Nahan Lama 🏃',
      note: '"Jogging sore lalu kebelet"',
      x: 28,
      y: 74,
      badge: 'GBK Senayan',
    },
  ];

  const filteredPins = mapPins.filter((pin) => {
    if (mapFilter === 'all') return true;
    if (mapFilter === 'pee') return pin.type === 'pee' || pin.type === 'combo';
    if (mapFilter === 'poop') return pin.type === 'poop' || pin.type === 'combo';
    return true;
  });

  const selectedPin = mapPins.find((p) => p.id === selectedPinId);

  return (
    <div
      className={`w-[340px] sm:w-[380px] md:w-[390px] h-[780px] bg-dark-bg rounded-[50px] phone-shadow relative overflow-hidden flex flex-col border border-dark-border ${className}`}
    >
      {/* 1. TOP DYNAMIC ISLAND & STATUS BAR */}
      <div className="h-10 pt-3 px-7 flex items-center justify-between text-xs text-cream-bg select-none z-40 bg-dark-bg/85 backdrop-blur-sm">
        <span className="font-bold text-xs tracking-tight">11:30</span>
        {/* Dynamic Island Capsule */}
        <div className="w-26 h-5 bg-black rounded-full flex items-center justify-end px-2.5 gap-1.5">
          <span className="w-2 h-2 rounded-full bg-both-teal animate-ping" />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-peach-tint font-bold">5G</span>
          <div className="w-5 h-2.5 border border-cream-bg rounded-sm p-0.5 flex items-center">
            <div className="h-full w-full bg-both-teal rounded-2xs" />
          </div>
        </div>
      </div>

      {/* 2. MAIN SCREEN CONTENT AREA */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* ============================== */}
        {/* A. REALISTIC MAP SCREEN */}
        {/* ============================== */}
        {activeScreen === 'map' && (
          <div className="flex-1 flex flex-col relative overflow-hidden bg-[#1C1815]">
            {/* REALISTIC VECTOR SVG CITY MAP */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 380 620"
              preserveAspectRatio="none"
            >
              {/* Dark Map Base */}
              <rect width="380" height="620" fill="#1C1815" />

              {/* City Blocks / Urban Polygons */}
              <g fill="#241F1B" stroke="#2B2520" strokeWidth="1">
                <rect x="20" y="70" width="85" height="110" rx="6" />
                <rect x="120" y="70" width="110" height="90" rx="6" />
                <rect x="245" y="70" width="115" height="120" rx="6" />

                <rect x="20" y="200" width="95" height="120" rx="6" />
                <rect x="130" y="180" width="95" height="110" rx="6" />
                <rect x="240" y="210" width="120" height="95" rx="6" />

                <rect x="20" y="340" width="110" height="120" rx="6" />
                <rect x="145" y="310" width="90" height="140" rx="6" />
                <rect x="250" y="325" width="110" height="135" rx="6" />

                <rect x="20" y="480" width="120" height="110" rx="6" />
                <rect x="155" y="470" width="105" height="120" rx="6" />
                <rect x="275" y="480" width="85" height="110" rx="6" />
              </g>

              {/* Parks / Green Spaces (Taman Menteng & Suropati) */}
              <g fill="#19281C" stroke="#223826" strokeWidth="1">
                <path d="M 245,95 Q 285,85 320,110 Q 310,165 260,170 Z" />
                <path d="M 25,505 Q 60,490 100,510 Q 80,560 35,550 Z" />
              </g>

              {/* River Canal (Banjir Kanal Barat) */}
              <path
                d="M -10,140 Q 60,180 130,160 T 260,250 T 390,290"
                fill="none"
                stroke="#162838"
                strokeWidth="14"
                strokeLinecap="round"
              />
              <path
                d="M -10,140 Q 60,180 130,160 T 260,250 T 390,290"
                fill="none"
                stroke="#223E56"
                strokeWidth="4"
                strokeLinecap="round"
              />

              {/* Secondary Street Grid */}
              <g fill="none" stroke="#2D2620" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M 0,185 L 380,185" />
                <path d="M 0,315 L 380,315" />
                <path d="M 0,465 L 380,465" />
                <path d="M 125,0 L 125,620" />
                <path d="M 240,0 L 240,620" />
                <path d="M 0,270 L 380,370" />
              </g>

              {/* Primary Arterial Highway (Jl. M.H. Thamrin - Jl. Jend. Sudirman) */}
              <g fill="none">
                <path
                  d="M 175,0 L 195,200 L 210,400 L 180,620"
                  stroke="#3D342B"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M 175,0 L 195,200 L 210,400 L 180,620"
                  stroke="#54473B"
                  strokeWidth="1.5"
                  strokeDasharray="5 4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>

              {/* Gatot Subroto Crossing Avenue */}
              <path
                d="M -10,430 L 390,390"
                fill="none"
                stroke="#3D342B"
                strokeWidth="10"
                strokeLinecap="round"
              />
              <path
                d="M -10,430 L 390,390"
                fill="none"
                stroke="#54473B"
                strokeWidth="1.5"
                strokeDasharray="5 4"
              />

              {/* Street & Area Labels */}
              <g fontSize="7" fontWeight="bold" fill="#756555" letterSpacing="1">
                <text x="135" y="115" transform="rotate(84 135 115)">
                  JL. M.H. THAMRIN
                </text>
                <text x="175" y="320" transform="rotate(80 175 320)">
                  JL. JEND. SUDIRMAN
                </text>
                <text x="65" y="415" transform="rotate(-6 65 415)">
                  JL. GATOT SUBROTO
                </text>
                <text x="270" y="145" fill="#5E5042" fontSize="8" fontWeight="900">
                  MENTENG
                </text>
                <text x="275" y="365" fill="#5E5042" fontSize="8" fontWeight="900">
                  KUNINGAN
                </text>
                <text x="45" y="475" fill="#5E5042" fontSize="8" fontWeight="900">
                  SENAYAN
                </text>
              </g>

              {/* User Live GPS Pulse & 50m Blur Zone */}
              <g>
                <circle
                  cx="165"
                  cy="360"
                  r="34"
                  fill="#3BA3E8"
                  fillOpacity="0.08"
                  stroke="#3BA3E8"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                <circle
                  cx="165"
                  cy="360"
                  r="16"
                  fill="#3BA3E8"
                  fillOpacity="0.25"
                  className="animate-ping"
                />
                <circle cx="165" cy="360" r="5" fill="#3BA3E8" stroke="#FFFFFF" strokeWidth="2" />
              </g>
            </svg>

            {/* Top Floating Area Info & Layer Filter */}
            <div className="absolute top-3 inset-x-3 z-20 flex items-center justify-between">
              <div className="bg-dark-surface/95 backdrop-blur border border-dark-border px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-both-teal" />
                <span className="text-[11px] font-bold text-cream-bg">Jakarta Pusat</span>
                <span className="text-[9px] bg-dark-bg text-peach-tint/70 px-1.5 py-0.5 rounded font-bold">
                  Blur 50m
                </span>
              </div>

              <div className="flex bg-dark-surface/95 backdrop-blur border border-dark-border p-0.5 rounded-full text-[10px] font-bold shadow-lg">
                <button
                  onClick={() => setMapFilter('all')}
                  className={`px-2.5 py-1 rounded-full transition-all ${
                    mapFilter === 'all' ? 'bg-pee-amber text-ink' : 'text-peach-tint/80 hover:text-white'
                  }`}
                >
                  Semua
                </button>
                <button
                  onClick={() => setMapFilter('pee')}
                  className={`px-2.5 py-1 rounded-full transition-all ${
                    mapFilter === 'pee' ? 'bg-pee-amber text-ink' : 'text-peach-tint/80 hover:text-white'
                  }`}
                >
                  Pee
                </button>
                <button
                  onClick={() => setMapFilter('poop')}
                  className={`px-2.5 py-1 rounded-full transition-all ${
                    mapFilter === 'poop' ? 'bg-poop-brown text-white' : 'text-peach-tint/80 hover:text-white'
                  }`}
                >
                  Poop
                </button>
              </div>
            </div>

            {/* Right Side Map Controls (Compass, Zoom, My Location) */}
            <div className="absolute top-16 right-3 z-20 flex flex-col items-center gap-2">
              <button
                className="w-7 h-7 rounded-full bg-dark-surface/95 backdrop-blur border border-dark-border flex items-center justify-center text-peach-tint shadow-md hover:text-white"
                title="Arah Kompas"
              >
                <Compass className="w-4 h-4 text-emergency" />
              </button>
              <div className="bg-dark-surface/95 backdrop-blur border border-dark-border rounded-xl flex flex-col items-center shadow-md overflow-hidden">
                <button className="w-7 h-7 flex items-center justify-center text-peach-tint/80 hover:text-white border-b border-dark-border">
                  <Plus className="w-3.5 h-3.5" />
                </button>
                <button className="w-7 h-7 flex items-center justify-center text-peach-tint/80 hover:text-white">
                  <Minus className="w-3.5 h-3.5" />
                </button>
              </div>
              <button
                className="w-7 h-7 rounded-full bg-dark-surface/95 backdrop-blur border border-dark-border flex items-center justify-center text-drip-blue shadow-md hover:scale-105"
                title="Lokasi Saya"
              >
                <Navigation className="w-3.5 h-3.5 fill-current" />
              </button>
            </div>

            {/* COMPACT & MINIMALIST MAP PINPOINTS (Ukuran Presisi 22-24px Sesuai Standar Peta) */}
            <div className="relative w-full h-full">
              {/* Kuningan Cluster Pin (Kompak 20px) */}
              {(mapFilter === 'all' || mapFilter === 'poop') && (
                <div
                  style={{ top: '46%', left: '72%' }}
                  className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 active:scale-95 transition-all flex flex-col items-center z-10"
                  title="Kuningan (6 logs)"
                >
                  <div className="w-5 h-5 rounded-full bg-both-teal shadow-md shadow-both-teal/40 flex items-center justify-center border border-white">
                    <span className="text-[10px] font-black text-dark-bg leading-none">6</span>
                  </div>
                </div>
              )}

              {/* Render Filtered Pins */}
              {filteredPins.map((pin) => {
                const isSelected = selectedPinId === pin.id;
                const isPee = pin.type === 'pee';
                const isPoop = pin.type === 'poop';
                const bgColor = isPee ? 'bg-pee-amber' : isPoop ? 'bg-poop-brown' : 'bg-both-teal';
                const borderColor = isSelected ? 'border-white ring-2 ring-white/70 shadow-lg' : 'border-white/90 shadow-sm';

                return (
                  <div
                    key={pin.id}
                    onClick={() => setSelectedPinId(pin.id)}
                    style={{ top: `${pin.y}%`, left: `${pin.x}%` }}
                    className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all flex flex-col items-center z-10 ${
                      isSelected ? 'scale-115 z-20' : 'hover:scale-110 opacity-95 hover:opacity-100'
                    }`}
                  >
                    {/* Sleek Pin Marker (Ukuran 22x22 px) */}
                    <div
                      className={`w-[22px] h-[22px] rounded-full ${bgColor} border ${borderColor} p-0.5 flex items-center justify-center`}
                    >
                      <div className="w-3.5 h-3.5 flex items-center justify-center">
                        {isPee && <LilDripSVG />}
                        {isPoop && <MrPlopSVG />}
                        {!isPee && !isPoop && <SirFlushSVG />}
                      </div>
                    </div>
                    {/* Tiny needle anchor */}
                    <div className={`w-1.5 h-1.5 ${bgColor} rotate-45 -mt-1 border-r border-b ${borderColor}`} />

                    {/* Label HANYA muncul saat pin dipilih agar tidak menumpuk di peta */}
                    {isSelected && (
                      <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-dark-bg/95 text-cream-bg border border-dark-border shadow mt-0.5 whitespace-nowrap animate-fadeIn">
                        {pin.badge}
                      </span>
                    )}
                  </div>
                );
              })}

              {/* Selected Pin Pop-Up Detail Card */}
              {selectedPin && (
                <div className="absolute bottom-4 inset-x-3 bg-dark-surface/98 backdrop-blur border border-dark-border rounded-2xl p-3.5 shadow-2xl z-30 animate-fadeIn">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl p-1 border border-white/40 shadow flex items-center justify-center flex-shrink-0 ${
                          selectedPin.type === 'pee'
                            ? 'bg-pee-amber'
                            : selectedPin.type === 'poop'
                            ? 'bg-poop-brown'
                            : 'bg-both-teal'
                        }`}
                      >
                        {selectedPin.type === 'pee' && <LilDripSVG />}
                        {selectedPin.type === 'poop' && <MrPlopSVG />}
                        {selectedPin.type === 'combo' && <SirFlushSVG />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-xs text-cream-bg">
                            {selectedPin.title}
                          </span>
                          <span className="text-[10px] text-peach-tint/60">{selectedPin.time}</span>
                        </div>
                        <p className="text-[11px] text-peach-tint/90 mt-0.5 font-medium">
                          {selectedPin.location}
                        </p>
                        <p className="text-[11px] text-pee-amber italic mt-0.5 font-medium">
                          {selectedPin.note}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedPinId(null)}
                      className="text-peach-tint/60 hover:text-white p-1 rounded-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-dark-border/70 flex items-center justify-between text-[10px]">
                    <span className="text-both-teal font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-both-teal" /> Lokasi terenkripsi & blur 50m
                    </span>
                    <button
                      onClick={() => setScreen('timeline')}
                      className="text-pee-amber font-bold hover:underline"
                    >
                      Buka di Diary →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================== */}
        {/* B. QUICK LOG SCREEN (BESAR & TAKTIL) */}
        {/* ============================== */}
        {activeScreen === 'quick-log' && (
          <div className="flex-1 flex flex-col justify-end p-5 bg-dark-bg/85 backdrop-blur-md">
            <div className="bg-dark-surface border border-dark-border rounded-[36px] p-6 shadow-2xl text-center animate-fadeIn">
              <div className="w-14 h-1.5 bg-dark-border rounded-full mx-auto mb-4" />
              <h3 className="text-2xl font-black text-cream-bg">Catat Kelegaan</h3>
              <p className="text-xs text-peach-tint/70 mt-1 mb-5">
                Pilih aksi cepat di bawah. Waktu & GPS terisi otomatis!
              </p>

              {/* 2 LARGE ACTION BUTTONS (PEE & POOP) */}
              <div className="grid grid-cols-2 gap-3.5 mb-3.5">
                {/* LIL' DRIP (PEE) - EXTRA LARGE BUTTON */}
                <button
                  onClick={() => setScreen('mood')}
                  className="group p-5 rounded-3xl bg-pee-amber/15 border-2 border-pee-amber hover:bg-pee-amber/25 transition-all flex flex-col items-center gap-3 active:scale-95 shadow-xl shadow-pee-amber/15"
                >
                  <div className="w-20 h-20 rounded-3xl bg-pee-amber p-2 shadow-lg group-hover:scale-105 transition-transform flex items-center justify-center">
                    <LilDripSVG />
                  </div>
                  <div>
                    <div className="font-black text-base text-pee-amber tracking-wider">LIL' DRIP</div>
                    <div className="text-xs text-peach-tint/80 font-semibold mt-0.5">PEE (Kencing)</div>
                  </div>
                </button>

                {/* MR. PLOP (POOP) - EXTRA LARGE BUTTON */}
                <button
                  onClick={() => setScreen('mood')}
                  className="group p-5 rounded-3xl bg-poop-brown/20 border-2 border-poop-brown hover:bg-poop-brown/30 transition-all flex flex-col items-center gap-3 active:scale-95 shadow-xl shadow-poop-brown/20"
                >
                  <div className="w-20 h-20 rounded-3xl bg-poop-brown p-2 shadow-lg group-hover:scale-105 transition-transform flex items-center justify-center">
                    <MrPlopSVG />
                  </div>
                  <div>
                    <div className="font-black text-base text-peach-tint tracking-wider">MR. PLOP</div>
                    <div className="text-xs text-peach-tint/80 font-semibold mt-0.5">POOP (BAB)</div>
                  </div>
                </button>
              </div>

              {/* SIR FLUSH (COMBO KEDUANYA) - LARGE FULL-WIDTH BUTTON */}
              <button
                onClick={() => setScreen('mood')}
                className="w-full py-4 px-5 rounded-2xl bg-both-teal/15 border-2 border-both-teal hover:bg-both-teal/25 transition flex items-center justify-center gap-3.5 shadow-lg active:scale-98"
              >
                <div className="w-10 h-10 rounded-xl bg-both-teal p-1 flex-shrink-0 shadow">
                  <SirFlushSVG />
                </div>
                <div className="text-left">
                  <span className="font-black text-sm text-both-teal block leading-tight">
                    Sir Flush (Keduanya Sekaligus)
                  </span>
                  <span className="text-[11px] text-peach-tint/70 block mt-0.5">
                    Paket kombo kencing & BAB dalam satu waktu
                  </span>
                </div>
              </button>

              <button
                onClick={() => setScreen('map')}
                className="mt-4 text-xs font-bold text-peach-tint/60 hover:text-white py-1.5"
              >
                Batal
              </button>
            </div>
          </div>
        )}

        {/* ============================== */}
        {/* C. MOOD SHEET */}
        {/* ============================== */}
        {activeScreen === 'mood' && (
          <div className="flex-1 flex flex-col justify-end p-4 bg-dark-bg/80 backdrop-blur-sm">
            <div className="bg-dark-surface border border-dark-border rounded-[32px] p-5 shadow-2xl">
              <div className="w-12 h-1 bg-dark-border rounded-full mx-auto mb-3" />

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-both-teal p-1 shadow">
                    <SirFlushSVG />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-black text-both-teal tracking-wider">
                      Lega Tercatat!
                    </span>
                    <h4 className="text-sm font-bold text-cream-bg">Bagaimana Suasana Hatimu?</h4>
                  </div>
                </div>
                <button onClick={() => setScreen('map')} className="text-xs text-pee-amber font-bold">
                  Lewati
                </button>
              </div>

              {/* Mood Pills */}
              <label className="text-[11px] text-peach-tint/70 font-semibold block mb-2">Pilih Mood:</label>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <button className="px-3 py-2.5 rounded-xl bg-both-teal/20 border border-both-teal text-both-teal text-xs font-bold text-left flex items-center gap-2">
                  <span>😌</span> Lega Banget
                </button>
                <button className="px-3 py-2.5 rounded-xl bg-dark-bg border border-dark-border text-peach-tint text-xs font-medium text-left flex items-center gap-2 hover:border-pee-amber">
                  <span>⏱️</span> Nahan Lama
                </button>
                <button className="px-3 py-2.5 rounded-xl bg-emergency/20 border border-emergency text-emergency text-xs font-bold text-left flex items-center gap-2">
                  <span>🚨</span> Momen Darurat
                </button>
                <button className="px-3 py-2.5 rounded-xl bg-dark-bg border border-dark-border text-peach-tint text-xs font-medium text-left flex items-center gap-2 hover:border-poop-brown">
                  <span>💥</span> Tragedi Kloset
                </button>
              </div>

              {/* Note Input */}
              <label className="text-[11px] text-peach-tint/70 font-semibold flex items-center justify-between mb-1">
                <span>Catatan Bebas (Opsional):</span>
                <span className="text-[10px] text-peach-tint/50">34/100</span>
              </label>
              <input
                type="text"
                readOnly
                value="Kopi susu di rest area km 57 juara!"
                className="w-full bg-dark-bg border border-dark-border rounded-xl px-3 py-2.5 text-xs text-cream-bg placeholder-peach-tint/40 focus:outline-none focus:border-pee-amber mb-4"
              />

              <button
                onClick={() => setScreen('timeline')}
                className="w-full py-3.5 rounded-xl bg-pee-amber text-ink font-black text-xs shadow-lg shadow-pee-amber/20 active:scale-98 transition"
              >
                Simpan & Buka Buku Harian
              </button>
            </div>
          </div>
        )}

        {/* ============================== */}
        {/* D. TIMELINE SCREEN */}
        {/* ============================== */}
        {activeScreen === 'timeline' && (
          <div className="flex-1 flex flex-col bg-dark-bg p-4 overflow-y-auto">
            <div className="mb-4">
              <h3 className="text-lg font-black text-cream-bg">Buku Harian Lega</h3>
              <p className="text-xs text-peach-tint/70">Total 12 jejak lega tercatat</p>
            </div>

            <div className="space-y-3">
              <div className="text-[11px] font-bold text-pee-amber uppercase tracking-wider">
                Hari Ini • 9 Nov 2026
              </div>

              {/* Item 1 */}
              <div className="bg-dark-surface border border-dark-border rounded-2xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-pee-amber p-1 flex items-center justify-center shadow">
                    <LilDripSVG />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-cream-bg">Lil' Drip • Lega Banget</span>
                      <span className="text-[10px] text-peach-tint/50">14:15</span>
                    </div>
                    <p className="text-[11px] text-peach-tint/80">Kec. Menteng, Jakarta Pusat</p>
                    <p className="text-[11px] text-pee-amber italic mt-0.5">
                      "Setelah meeting 3 jam akhirnya plong!"
                    </p>
                  </div>
                </div>
              </div>

              {/* Item 2 */}
              <div className="bg-dark-surface border border-dark-border rounded-2xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-poop-brown p-1 flex items-center justify-center shadow">
                    <MrPlopSVG />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-cream-bg">Mr. Plop • Masih Ganjel</span>
                      <span className="text-[10px] text-peach-tint/50">08:30</span>
                    </div>
                    <p className="text-[11px] text-peach-tint/80">Grand Indonesia, Lt. 3A</p>
                    <p className="text-[11px] text-peach-tint/60 italic mt-0.5">
                      "Kloset otomatisnya dingin bgt"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================== */}
        {/* E. STATS SCREEN */}
        {/* ============================== */}
        {activeScreen === 'stats' && (
          <div className="flex-1 flex flex-col bg-dark-bg p-4 overflow-y-auto">
            <div className="mb-4">
              <h3 className="text-lg font-black text-cream-bg">Statistik & Lencana</h3>
              <p className="text-xs text-peach-tint/70">Pencapaian bersama Mr. Plop & Lil' Drip</p>
            </div>

            {/* Streak Card */}
            <div className="bg-gradient-to-r from-poop-brown/40 via-pee-amber/30 to-dark-surface border border-pee-amber/50 rounded-2xl p-4 mb-4 flex items-center justify-between shadow-xl">
              <div>
                <span className="text-[10px] font-black text-pee-amber uppercase tracking-wider">
                  Streak Aktif
                </span>
                <div className="text-2xl font-black text-cream-bg flex items-center gap-2">
                  5 Hari <span className="text-2xl">🔥</span>
                </div>
                <p className="text-[11px] text-peach-tint mt-0.5">2 hari lagi menuju badge "Lancar Jaya"!</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-both-teal/20 border border-both-teal flex items-center justify-center text-xs font-black text-both-teal">
                71%
              </div>
            </div>

            {/* 2x2 KPIs */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-dark-surface border border-dark-border rounded-2xl p-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-pee-amber p-0.5">
                    <LilDripSVG />
                  </div>
                  <span className="text-[10px] text-peach-tint/70 uppercase font-bold">Total Pee</span>
                </div>
                <div className="text-xl font-black text-pee-amber mt-1.5">28 Kali</div>
                <span className="text-[10px] text-both-teal font-medium">💧 Hidrasi prima</span>
              </div>
              <div className="bg-dark-surface border border-dark-border rounded-2xl p-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-poop-brown p-0.5">
                    <MrPlopSVG />
                  </div>
                  <span className="text-[10px] text-peach-tint/70 uppercase font-bold">Total Poop</span>
                </div>
                <div className="text-xl font-black text-peach-tint mt-1.5">9 Kali</div>
                <span className="text-[10px] text-pee-amber font-medium">💩 Teratur</span>
              </div>
            </div>

            {/* Badges preview */}
            <div className="text-xs font-bold text-cream-bg uppercase tracking-wider mb-2">Lencana Diraih</div>
            <div className="grid grid-cols-2 gap-2 pb-6">
              <div className="bg-dark-surface border border-pee-amber/50 rounded-xl p-3 text-center">
                <div className="w-10 h-10 rounded-xl bg-pee-amber p-1 mx-auto mb-1">
                  <LilDripSVG />
                </div>
                <div className="font-bold text-xs text-cream-bg">Pendatang Baru</div>
                <span className="inline-block mt-1 text-[9px] bg-both-teal/20 text-both-teal px-1.5 py-0.5 rounded font-bold">
                  DIRAIH
                </span>
              </div>
              <div className="bg-dark-surface border border-poop-brown/50 rounded-xl p-3 text-center">
                <div className="w-10 h-10 rounded-xl bg-poop-brown p-1 mx-auto mb-1">
                  <MrPlopSVG />
                </div>
                <div className="font-bold text-xs text-cream-bg">Penjelajah Kota</div>
                <span className="inline-block mt-1 text-[9px] bg-both-teal/20 text-both-teal px-1.5 py-0.5 rounded font-bold">
                  DIRAIH
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ============================== */}
        {/* F. APP LOCK SCREEN */}
        {/* ============================== */}
        {activeScreen === 'lock' && (
          <div className="flex-1 flex flex-col items-center justify-between bg-dark-bg p-6">
            <div className="pt-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-dark-surface border border-dark-border p-2 flex items-center justify-center mx-auto mb-3 shadow-xl">
                <SirFlushSVG />
              </div>
              <h3 className="text-lg font-black text-cream-bg">Buku Harian Terkunci</h3>
              <p className="text-xs text-peach-tint/70 mt-1">Masukkan 4-digit PIN atau gunakan FaceID</p>

              <div className="flex items-center justify-center gap-4 mt-6">
                <div className="w-3.5 h-3.5 rounded-full bg-pee-amber shadow-lg shadow-pee-amber/50" />
                <div className="w-3.5 h-3.5 rounded-full bg-pee-amber shadow-lg shadow-pee-amber/50" />
                <div className="w-3.5 h-3.5 rounded-full bg-dark-border" />
                <div className="w-3.5 h-3.5 rounded-full bg-dark-border" />
              </div>
            </div>

            <div className="w-full max-w-[280px] grid grid-cols-3 gap-3 mb-6">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                <button
                  key={num}
                  className="w-16 h-16 rounded-full bg-dark-surface border border-dark-border text-xl font-bold text-cream-bg mx-auto active:bg-pee-amber active:text-ink"
                >
                  {num}
                </button>
              ))}
              <button
                onClick={() => setScreen('map')}
                className="w-16 h-16 rounded-full flex items-center justify-center text-both-teal mx-auto"
                title="FaceID"
              >
                <CheckCircle2 className="w-7 h-7" />
              </button>
              <button className="w-16 h-16 rounded-full bg-dark-surface border border-dark-border text-xl font-bold text-cream-bg mx-auto">
                0
              </button>
              <button
                onClick={() => setScreen('map')}
                className="w-16 h-16 rounded-full flex items-center justify-center text-peach-tint/60 mx-auto"
              >
                <ChevronRight className="w-7 h-7" />
              </button>
            </div>

            <button
              onClick={() => setScreen('map')}
              className="text-xs text-pee-amber font-bold mb-2"
            >
              Buka Cepat (Demo Unlock)
            </button>
          </div>
        )}
      </div>

      {/* 3. PROMINENT BOTTOM BAR WITH EXTRA-LARGE CENTER FAB (+ LOG) */}
      <nav className="h-22 bg-dark-surface/98 backdrop-blur border-t border-dark-border px-4 flex items-center justify-between relative z-30 select-none">
        {/* Tab Map */}
        <button
          onClick={() => setScreen('map')}
          className={`flex flex-col items-center gap-1 ${
            activeScreen === 'map' ? 'text-pee-amber font-bold' : 'text-peach-tint/60 hover:text-white'
          }`}
        >
          <MapPin className="w-5 h-5" />
          <span className="text-[10px]">Peta</span>
        </button>

        {/* Tab Diary */}
        <button
          onClick={() => setScreen('timeline')}
          className={`flex flex-col items-center gap-1 ${
            activeScreen === 'timeline' ? 'text-pee-amber font-bold' : 'text-peach-tint/60 hover:text-white'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span className="text-[10px]">Diary</span>
        </button>

        {/* EXTRA-LARGE CENTER FAB BUTTON (+ LOG) */}
        <div className="-mt-10 flex flex-col items-center">
          <button
            onClick={() => setScreen(activeScreen === 'quick-log' ? 'map' : 'quick-log')}
            className="w-[68px] h-[68px] rounded-full bg-pee-amber text-ink p-3 shadow-2xl shadow-pee-amber/60 border-4 border-dark-bg hover:scale-105 active:scale-95 transition-all flex items-center justify-center relative group"
            aria-label="Catat Buang Air Cepat"
          >
            <div className="w-full h-full relative flex items-center justify-center">
              <SirFlushSVG />
              {/* Floating + sign badge */}
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-ink text-pee-amber flex items-center justify-center font-black text-xs border border-pee-amber shadow">
                +
              </span>
            </div>
          </button>
          <span className="text-[9px] font-black text-pee-amber tracking-wider uppercase mt-1">
            + LOG
          </span>
        </div>

        {/* Tab Stats */}
        <button
          onClick={() => setScreen('stats')}
          className={`flex flex-col items-center gap-1 ${
            activeScreen === 'stats' ? 'text-pee-amber font-bold' : 'text-peach-tint/60 hover:text-white'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span className="text-[10px]">Stats</span>
        </button>

        {/* Tab Lock */}
        <button
          onClick={() => setScreen('lock')}
          className={`flex flex-col items-center gap-1 ${
            activeScreen === 'lock' ? 'text-pee-amber font-bold' : 'text-peach-tint/60 hover:text-white'
          }`}
        >
          <Lock className="w-5 h-5" />
          <span className="text-[10px]">Kunci</span>
        </button>
      </nav>

      {/* 4. HOME BAR INDICATOR */}
      <div className="h-4 bg-dark-bg flex items-center justify-center pb-1">
        <div className="w-32 h-1 bg-dark-border rounded-full" />
      </div>
    </div>
  );
};
