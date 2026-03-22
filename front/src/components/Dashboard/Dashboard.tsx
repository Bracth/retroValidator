/* eslint-disable react-refresh/only-export-components */
import React from 'react';

export interface DashboardProps {
  children: React.ReactNode;
}

const DashboardRoot: React.FC<DashboardProps> = ({ children }) => {
  return (
    <main className="max-w-7xl mx-auto pt-16 px-6 md:px-12 pb-24 min-h-screen">
      {children}
    </main>
  );
};

export interface HeaderProps {
  title: string;
  subtitle: string;
  statusLabel: string;
  statusActive?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle, statusLabel, statusActive = true }) => (
  <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
    <div>
      <h1 className="text-5xl font-headline font-medium text-on-surface tracking-tight uppercase">{title}</h1>
      <p className="font-mono text-xs text-zinc-500 mt-2 uppercase tracking-[0.2em]">{subtitle}</p>
    </div>
    <div className="flex gap-2">
      <div className="bg-surface-container-low px-4 py-2 border border-outline-variant/20 flex items-center gap-3">
        <span className={`w-2 h-2 rounded-full ${statusActive ? 'bg-secondary animate-pulse' : 'bg-zinc-600'}`}></span>
        <span className={`font-mono text-[10px] ${statusActive ? 'text-secondary' : 'text-zinc-500'}`}>{statusLabel}</span>
      </div>
    </div>
  </div>
);

export interface ActionsProps {
  children: React.ReactNode;
}

const Actions: React.FC<ActionsProps> = ({ children }) => (
  <div className="flex flex-wrap gap-2 mb-6 border-b border-outline-variant/10 pb-6">
    {children}
  </div>
);

export interface ActionButtonProps {
  label: string;
  onClick?: () => void;
  active?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({ label, onClick, active = false }) => (
  <button
    onClick={onClick}
    className={`px-6 py-2 text-[11px] font-bold uppercase tracking-widest font-label transition-all border ${
      active
        ? 'bg-primary/10 border-primary/30 text-primary hover:bg-primary/20'
        : 'bg-surface-container-low border-outline-variant/20 text-zinc-400 hover:border-primary/50 hover:text-zinc-200'
    }`}
  >
    {label}
  </button>
);

export interface GridProps {
  children: React.ReactNode;
  className?: string;
}

const Grid: React.FC<GridProps> = ({ children, className = '' }) => (
  <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[400px] ${className}`}>
    {children}
  </div>
);

export interface SlotProps {
  label: string;
  icon?: string;
  isScanning?: boolean;
  onClick?: () => void;
  image?: string;
}

const Slot: React.FC<SlotProps> = ({ label, icon = 'photo_camera', isScanning = false, onClick, image }) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      className="relative group cursor-pointer border border-dashed border-outline-variant/40 bg-surface-container-low hover:border-primary transition-all duration-300 flex flex-col items-center justify-center min-h-[300px] overflow-hidden"
    >
      {image ? (
        <img src={image} alt={label} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
      ) : (
        <span className="material-symbols-outlined text-zinc-600 group-hover:text-primary mb-4 text-5xl transition-colors">{icon}</span>
      )}
      <span className="relative z-10 font-mono text-[10px] text-zinc-500 uppercase tracking-widest group-hover:text-primary transition-colors">{label}</span>
      {isScanning && <div className="h-[2px] bg-primary shadow-[0_0_15px_#8aebff] absolute w-full top-0 animate-scan"></div>}
    </div>
  );
};

export interface StatusBarProps {
  status: string;
  metadata: string;
  isScanning?: boolean;
}

const StatusBar: React.FC<StatusBarProps> = ({ status, metadata, isScanning = false }) => (
  <div className="mt-6 bg-surface-container-lowest p-5 border-l-4 border-primary flex flex-wrap items-center justify-between gap-4">
    <div className="flex items-center gap-4">
      <span
        className={`material-symbols-outlined text-primary ${isScanning ? 'animate-spin' : ''}`}
        style={isScanning ? { animationDuration: '3s' } : {}}
      >
        {isScanning ? 'search_check' : 'check_circle'}
      </span>
      <span className="font-mono text-xs text-primary tracking-widest uppercase">{status}</span>
    </div>
    <div className="font-mono text-[10px] text-zinc-500 tracking-tighter">{metadata}</div>
  </div>
);

export interface VerdictProps {
  verdict: string;
  description: string;
  confidence: number;
  metadata: Array<{ label: string; value: string }>;
  analystComment?: string;
  isAuthentic: boolean;
}

const Verdict: React.FC<VerdictProps> = ({ verdict, description, confidence, metadata, analystComment, isAuthentic }) => {
  const colorClass = isAuthentic ? 'text-secondary' : 'text-error';
  const bgColorClass = isAuthentic ? 'bg-secondary/5' : 'bg-error/5';
  const icon = isAuthentic ? 'verified' : 'warning';
  const iconColorClass = isAuthentic ? 'text-secondary/10' : 'text-error/10';

  return (
    <div className="lg:col-span-7 space-y-8">
      <div className="bg-surface-container-low p-10 relative overflow-hidden group border border-outline-variant/10">
        <div className="absolute top-0 right-0 p-6">
          <span className={`material-symbols-outlined ${iconColorClass} text-9xl`} style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
        </div>
        <div className="relative z-10">
          <div className={`font-mono text-[10px] ${colorClass} tracking-[0.4em] mb-4`}>VERDICT_FINAL_SUMMARY</div>
          <h2 className={`text-6xl md:text-7xl font-headline font-bold ${colorClass} tracking-tighter mb-6 leading-tight`}>
            {verdict}
          </h2>
          <p className="max-w-xl text-zinc-400 text-sm leading-relaxed font-light">{description}</p>
        </div>
        <div className={`absolute inset-0 ${bgColorClass} opacity-0 group-hover:opacity-100 transition-opacity`}></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-surface-container-low p-8 border border-outline-variant/10">
          <div className="font-mono text-[10px] text-zinc-500 mb-6 uppercase tracking-widest">Confidence_Index</div>
          <div className="flex items-end gap-3">
            <span className="text-6xl font-headline font-bold text-primary">{confidence}</span>
            <span className="text-2xl font-headline text-primary-container mb-1">%</span>
          </div>
          <div className="w-full bg-surface-container-high h-1.5 mt-6 overflow-hidden">
            <div
              className="bg-primary h-full shadow-[0_0_10px_#8aebff] transition-all duration-1000"
              style={{ width: `${confidence}%` }}
            ></div>
          </div>
        </div>
        <div className="bg-surface-container-low p-8 border border-outline-variant/10">
          <div className="font-mono text-[10px] text-zinc-500 mb-6 uppercase tracking-widest">Artifact_Meta</div>
          <div className="space-y-3">
            {metadata.map((item, i) => (
              <div key={i} className={`flex justify-between font-mono text-[11px] ${i === metadata.length - 1 ? 'pt-2 border-t border-outline-variant/10' : ''}`}>
                <span className="text-zinc-500">{item.label}</span>
                <span className="text-on-surface">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {analystComment && (
        <div className="bg-surface-container-low p-10 border-l-2 border-primary/40 italic relative">
          <div className="flex gap-4 items-start">
            <span className="material-symbols-outlined text-primary/30 text-3xl">format_quote</span>
            <p className="text-xl text-zinc-300 font-body leading-relaxed">
              "{analystComment}"
            </p>
          </div>
          <div className="mt-6 pl-12">
            <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-[0.2em]">
              — SENIOR FORENSIC ANALYST // UNIT_04
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export interface LogEntry {
  timestamp: string;
  message: string;
  type: 'success' | 'info' | 'error' | 'primary' | 'warning';
}

export interface LogProps {
  entries: LogEntry[];
  onViewJson?: () => void;
}

const Log: React.FC<LogProps> = ({ entries, onViewJson }) => {
  const getTypeClass = (type: string) => {
    switch (type) {
      case 'success': return 'text-secondary';
      case 'error': return 'text-error';
      case 'warning': return 'text-amber-400';
      case 'primary': return 'text-primary';
      default: return 'text-zinc-400';
    }
  };

  return (
    <div className="lg:col-span-5">
      <div className="bg-surface-container-lowest h-full border border-outline-variant/10 flex flex-col">
        <div className="p-4 border-b border-outline-variant/10 bg-surface-container-low flex justify-between items-center">
          <span className="font-mono text-[10px] text-zinc-400 tracking-widest uppercase">ANALYSIS_LOGS_STREAM</span>
          <div className="flex gap-1.5">
            <span className="w-2 h-2 rounded-full bg-zinc-700"></span>
            <span className="w-2 h-2 rounded-full bg-zinc-700"></span>
            <span className="w-2 h-2 rounded-full bg-zinc-700"></span>
          </div>
        </div>
        <div className="p-6 font-mono text-[11px] space-y-4 overflow-y-auto max-h-[700px]">
          {entries.map((entry, i) => (
            <div key={i} className={`flex gap-3 ${getTypeClass(entry.type)}`}>
              <span className="shrink-0 opacity-40">[{entry.timestamp}]</span>
              <span>{entry.message}</span>
            </div>
          ))}
          <div className="flex gap-3">
            <span className="shrink-0 opacity-40">[{new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
            <span className="w-2 h-4 bg-primary animate-pulse"></span>
          </div>
        </div>
        {onViewJson && (
          <div className="p-4 mt-auto border-t border-outline-variant/10 bg-surface-container-low">
            <button
              onClick={onViewJson}
              className="w-full py-2 bg-surface-container-high hover:bg-surface-variant transition-colors text-[10px] font-mono tracking-tighter text-cyan-400 border border-outline-variant/30 uppercase"
            >
              {'{ }'} Ver JSON Original
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export interface SectionProps {
  children: React.ReactNode;
  className?: string;
}

const Section: React.FC<SectionProps> = ({ children, className = '' }) => (
  <section className={`mb-12 ${className}`}>
    {children}
  </section>
);

export interface NavbarProps {
  items: Array<{ label: string; icon: string; active?: boolean; onClick?: () => void }>;
}

const Navbar: React.FC<NavbarProps> = ({ items }) => (
  <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#1c1b1d] border-t border-outline-variant/10 flex justify-around items-center h-16 z-50">
    {items.map((item, i) => (
      <button
        key={i}
        onClick={item.onClick}
        className={`flex flex-col items-center ${item.active ? 'text-primary' : 'text-zinc-500'}`}
      >
        <span
          className="material-symbols-outlined"
          style={item.active ? { fontVariationSettings: "'FILL' 1" } : {}}
        >
          {item.icon}
        </span>
        <span className="text-[9px] uppercase font-bold tracking-tighter mt-1">{item.label}</span>
      </button>
    ))}
  </nav>
);

export const Dashboard = Object.assign(DashboardRoot, {
  Header,
  Actions,
  ActionButton,
  Grid,
  Slot,
  StatusBar,
  Verdict,
  Log,
  Section,
  Navbar,
});
