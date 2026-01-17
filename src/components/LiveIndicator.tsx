import { YouTubeLiveStatus } from '@/types/youtube';

interface LiveIndicatorProps {
  liveStatus: YouTubeLiveStatus;
  onClick?: () => void;
}

export function LiveIndicator({ liveStatus, onClick }: LiveIndicatorProps) {
  if (!liveStatus.isLive) return null;

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-full transition-all duration-300 group"
      aria-label="Assistir transmissão ao vivo"
    >
      {/* Pulsing dot */}
      <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
      </span>
      
      {/* Text */}
      <span className="text-sm font-bold text-primary animate-glow tracking-wider">
        AO VIVO
      </span>
    </button>
  );
}
