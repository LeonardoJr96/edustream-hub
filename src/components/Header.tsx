import { useState, useEffect } from 'react';
import { SearchBar } from './SearchBar';
import { LiveIndicator } from './LiveIndicator';
import { YouTubeLiveStatus, YouTubeVideo } from '@/types/youtube';

interface HeaderProps {
  liveStatus: YouTubeLiveStatus;
  onSearch: (query: string) => void;
  onClearSearch: () => void;
  onLiveClick: (video: YouTubeVideo) => void;
  logoText?: string;
}

export function Header({ liveStatus, onSearch, onClearSearch, onLiveClick, logoText = 'VIDEOFLIX' }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-background/95 backdrop-blur-md shadow-lg' 
          : 'bg-gradient-to-b from-background/80 to-transparent'
      }`}
    >
      <div className="flex items-center justify-between px-4 md:px-12 py-4">
        {/* Logo */}
        <div className="flex items-center gap-6">
          <h1 className="text-xl md:text-2xl font-black tracking-wider text-primary">
            {logoText}
          </h1>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-4">
          {/* Live indicator */}
          {liveStatus.isLive && liveStatus.liveVideo && (
            <LiveIndicator
              liveStatus={liveStatus}
              onClick={() => onLiveClick(liveStatus.liveVideo!)}
            />
          )}

          {/* Search */}
          <SearchBar onSearch={onSearch} onClear={onClearSearch} />
        </div>
      </div>
    </header>
  );
}
