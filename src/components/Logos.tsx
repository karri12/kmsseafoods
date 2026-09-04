import React from 'react';

/**
 * Goddess Lakshmi Header Icon (matching traditional navy blue seal on paper bill)
 */
export const LakshmiLogo: React.FC<{ className?: string }> = ({ className = 'w-12 h-12' }) => (
  <svg viewBox="0 0 100 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Outer Lotus Halo */}
    <path d="M50 5 C30 5 15 25 15 45 C15 70 35 90 50 95 C65 90 85 70 85 45 C85 25 70 5 50 5 Z" stroke="#0d3b66" strokeWidth="2.5" fill="none" />
    <path d="M50 12 C35 12 22 28 22 45 C22 65 38 82 50 86 C62 82 78 65 78 45 C78 28 65 12 50 12 Z" stroke="#0d3b66" strokeWidth="1.5" />
    
    {/* Crown / Mukut */}
    <path d="M42 28 L50 16 L58 28 L50 25 Z" fill="#0d3b66" />
    <circle cx="50" cy="14" r="2.5" fill="#0d3b66" />
    
    {/* Face & Halo */}
    <circle cx="50" cy="34" r="7" stroke="#0d3b66" strokeWidth="2" fill="none" />
    
    {/* Lotus Petals Base */}
    <path d="M25 85 C35 75 45 80 50 85 C55 80 65 75 75 85 C65 100 35 100 25 85 Z" fill="#0d3b66" />
    <path d="M15 90 C30 105 70 105 85 90 C75 115 25 115 15 90 Z" fill="#0d3b66" />
    
    {/* Four Arms & Posture */}
    <path d="M38 45 Q28 42 22 52 Q28 58 35 52" stroke="#0d3b66" strokeWidth="2" fill="none" />
    <path d="M62 45 Q72 42 78 52 Q72 58 65 52" stroke="#0d3b66" strokeWidth="2" fill="none" />
    
    {/* Gold Coins / Kalash motifs */}
    <circle cx="20" cy="55" r="3" fill="#0d3b66" />
    <circle cx="80" cy="55" r="3" fill="#0d3b66" />
  </svg>
);

/**
 * Lord Ganesha Header Icon (matching traditional navy blue seal on paper bill)
 */
export const GaneshaLogo: React.FC<{ className?: string }> = ({ className = 'w-12 h-12' }) => (
  <svg viewBox="0 0 100 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Circular Mandala Frame */}
    <circle cx="50" cy="50" r="42" stroke="#0d3b66" strokeWidth="2.5" />
    <circle cx="50" cy="50" r="37" stroke="#0d3b66" strokeWidth="1" strokeDasharray="3 2" />
    
    {/* Crown (Mukut) */}
    <path d="M40 22 L50 8 L60 22 L50 18 Z" fill="#0d3b66" />
    
    {/* Ganesha Head & Large Ears */}
    <path d="M30 35 C20 30 18 50 30 55 C38 58 42 45 42 38" stroke="#0d3b66" strokeWidth="2.5" fill="none" />
    <path d="M70 35 C80 30 82 50 70 55 C62 58 58 45 58 38" stroke="#0d3b66" strokeWidth="2.5" fill="none" />
    
    {/* Trunk (Trunk curving left/right) */}
    <path d="M50 32 C50 48 62 48 62 58 C62 65 52 65 48 60" stroke="#0d3b66" strokeWidth="4" strokeLinecap="round" fill="none" />
    
    {/* Tilak on Forehead */}
    <path d="M46 25 H54 M48 28 H52 M50 30 V33" stroke="#0d3b66" strokeWidth="1.5" />
    
    {/* Modak in Hand / Base Lotus */}
    <path d="M30 75 Q50 68 70 75 Q50 92 30 75 Z" fill="#0d3b66" />
  </svg>
);
