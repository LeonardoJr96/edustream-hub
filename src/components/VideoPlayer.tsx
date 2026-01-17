import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Volume2, VolumeX, Play, Pause, Settings, Subtitles, Maximize, Minimize } from 'lucide-react';
import { YouTubeVideo } from '@/types/youtube';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Slider } from '@/components/ui/slider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';

interface VideoPlayerProps {
  video: YouTubeVideo | null;
  isOpen: boolean;
  onClose: () => void;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const PLAYBACK_SPEEDS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

const QUALITY_LABELS: Record<string, string> = {
  'hd2160': '4K',
  'hd1440': '1440p',
  'hd1080': '1080p',
  'hd720': '720p',
  'large': '480p',
  'medium': '360p',
  'small': '240p',
  'tiny': '144p',
  'auto': 'Auto',
};

export function VideoPlayer({ video, isOpen, onClose }: VideoPlayerProps) {
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [quality, setQuality] = useState('auto');
  const [availableQualities, setAvailableQualities] = useState<string[]>([]);
  const [captionsEnabled, setCaptionsEnabled] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isApiReady, setIsApiReady] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Load YouTube IFrame API
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      setIsApiReady(true);
      return;
    }

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      setIsApiReady(true);
    };
  }, []);

  // Initialize player when video changes
  useEffect(() => {
    if (!isOpen || !video || !isApiReady) return;

    const initPlayer = () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }

      playerRef.current = new window.YT.Player('youtube-player', {
        videoId: video.id,
        playerVars: {
          autoplay: 1,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
          cc_load_policy: 0,
          disablekb: 1,
          fs: 0,
          playsinline: 1,
        },
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
        },
      });
    };

    // Small delay to ensure DOM is ready
    const timeout = setTimeout(initPlayer, 100);
    return () => clearTimeout(timeout);
  }, [video, isOpen, isApiReady]);

  // Cleanup on close
  useEffect(() => {
    if (!isOpen && playerRef.current) {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      playerRef.current.destroy();
      playerRef.current = null;
      setCurrentTime(0);
      setDuration(0);
      setIsPlaying(false);
    }
  }, [isOpen]);

  const onPlayerReady = (event: any) => {
    const player = event.target;
    setDuration(player.getDuration());
    setVolume(player.getVolume());
    setIsMuted(player.isMuted());
    
    const qualities = player.getAvailableQualityLevels();
    setAvailableQualities(qualities);
    
    // Start progress tracking
    progressIntervalRef.current = setInterval(() => {
      if (playerRef.current && playerRef.current.getCurrentTime) {
        setCurrentTime(playerRef.current.getCurrentTime());
      }
    }, 500);
  };

  const onPlayerStateChange = (event: any) => {
    setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
  };

  const togglePlay = useCallback(() => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  }, [isPlaying]);

  const handleSeek = useCallback((value: number[]) => {
    if (!playerRef.current) return;
    playerRef.current.seekTo(value[0], true);
    setCurrentTime(value[0]);
  }, []);

  const handleVolumeChange = useCallback((value: number[]) => {
    if (!playerRef.current) return;
    const newVolume = value[0];
    playerRef.current.setVolume(newVolume);
    setVolume(newVolume);
    if (newVolume > 0 && isMuted) {
      playerRef.current.unMute();
      setIsMuted(false);
    }
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    if (!playerRef.current) return;
    if (isMuted) {
      playerRef.current.unMute();
      setIsMuted(false);
    } else {
      playerRef.current.mute();
      setIsMuted(true);
    }
  }, [isMuted]);

  const handleSpeedChange = useCallback((speed: string) => {
    if (!playerRef.current) return;
    const speedNum = parseFloat(speed);
    playerRef.current.setPlaybackRate(speedNum);
    setPlaybackSpeed(speedNum);
  }, []);

  const handleQualityChange = useCallback((newQuality: string) => {
    if (!playerRef.current) return;
    playerRef.current.setPlaybackQuality(newQuality);
    setQuality(newQuality);
  }, []);

  const toggleCaptions = useCallback(() => {
    if (!playerRef.current) return;
    
    if (captionsEnabled) {
      playerRef.current.unloadModule('captions');
      playerRef.current.unloadModule('cc');
    } else {
      playerRef.current.loadModule('captions');
      playerRef.current.loadModule('cc');
    }
    setCaptionsEnabled(!captionsEnabled);
  }, [captionsEnabled]);

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch((err) => {
        console.error('Fullscreen error:', err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  }, []);

  // Listen for fullscreen changes (e.g., when user presses Escape)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleClose = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    onClose();
  };

  if (!video) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-5xl w-[95vw] p-0 bg-black border-none overflow-hidden">
        <VisuallyHidden>
          <DialogTitle>{video.title}</DialogTitle>
        </VisuallyHidden>
        
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 transition-colors"
          aria-label="Fechar"
        >
          <X className="w-5 h-5 text-white" />
        </button>
        
        {/* Video container */}
        <div 
          ref={containerRef}
          className="relative aspect-video w-full bg-black group"
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
        >
          <div id="youtube-player" className="w-full h-full" />
          
          {/* Click to play/pause overlay */}
          <div 
            className="absolute inset-0 cursor-pointer z-10"
            onClick={togglePlay}
          />
          
          {/* Custom controls */}
          <div 
            className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 transition-opacity duration-300 z-20 ${
              showControls ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Progress bar */}
            <div className="mb-4">
              <Slider
                value={[currentTime]}
                max={duration || 100}
                step={1}
                onValueChange={handleSeek}
                className="cursor-pointer [&_[role=slider]]:h-3 [&_[role=slider]]:w-3 [&_[role=slider]]:bg-primary [&_.bg-primary]:bg-primary [&_.bg-secondary]:bg-white/30"
              />
            </div>
            
            {/* Controls row */}
            <div className="flex items-center justify-between gap-4">
              {/* Left controls */}
              <div className="flex items-center gap-3">
                {/* Play/Pause */}
                <button
                  onClick={togglePlay}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 text-white fill-white" />
                  ) : (
                    <Play className="w-5 h-5 text-white fill-white" />
                  )}
                </button>
                
                {/* Volume */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleMute}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-5 h-5 text-white" />
                    ) : (
                      <Volume2 className="w-5 h-5 text-white" />
                    )}
                  </button>
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    max={100}
                    step={1}
                    onValueChange={handleVolumeChange}
                    className="w-20 cursor-pointer [&_[role=slider]]:h-3 [&_[role=slider]]:w-3 [&_[role=slider]]:bg-white [&_.bg-primary]:bg-white [&_.bg-secondary]:bg-white/30"
                  />
                </div>
                
                {/* Time */}
                <span className="text-sm text-white font-medium">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>
              
              {/* Right controls */}
              <div className="flex items-center gap-2">
                {/* Captions */}
                <button
                  onClick={toggleCaptions}
                  className={`w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors ${
                    captionsEnabled ? 'bg-white/30' : ''
                  }`}
                  title="Legendas"
                >
                  <Subtitles className="w-5 h-5 text-white" />
                </button>
                
                {/* Settings (Speed & Quality) */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
                      title="Configurações"
                    >
                      <Settings className="w-5 h-5 text-white" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    className="bg-zinc-900 border-zinc-700 text-white min-w-[180px]"
                    align="end"
                  >
                    {/* Speed submenu */}
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className="focus:bg-zinc-800 data-[state=open]:bg-zinc-800">
                        <span>Velocidade</span>
                        <span className="ml-auto text-xs text-zinc-400">{playbackSpeed}x</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent className="bg-zinc-900 border-zinc-700 text-white">
                        <DropdownMenuRadioGroup value={playbackSpeed.toString()} onValueChange={handleSpeedChange}>
                          {PLAYBACK_SPEEDS.map((speed) => (
                            <DropdownMenuRadioItem 
                              key={speed} 
                              value={speed.toString()}
                              className="focus:bg-zinc-800"
                            >
                              {speed === 1 ? 'Normal' : `${speed}x`}
                            </DropdownMenuRadioItem>
                          ))}
                        </DropdownMenuRadioGroup>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                    
                    {/* Quality submenu */}
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className="focus:bg-zinc-800 data-[state=open]:bg-zinc-800">
                        <span>Resolução</span>
                        <span className="ml-auto text-xs text-zinc-400">
                          {QUALITY_LABELS[quality] || quality}
                        </span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent className="bg-zinc-900 border-zinc-700 text-white">
                        <DropdownMenuRadioGroup value={quality} onValueChange={handleQualityChange}>
                          <DropdownMenuRadioItem value="auto" className="focus:bg-zinc-800">
                            Auto
                          </DropdownMenuRadioItem>
                          {availableQualities.map((q) => (
                            <DropdownMenuRadioItem 
                              key={q} 
                              value={q}
                              className="focus:bg-zinc-800"
                            >
                              {QUALITY_LABELS[q] || q}
                            </DropdownMenuRadioItem>
                          ))}
                        </DropdownMenuRadioGroup>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Fullscreen */}
                <button
                  onClick={toggleFullscreen}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
                  title={isFullscreen ? "Sair da tela cheia" : "Tela cheia"}
                >
                  {isFullscreen ? (
                    <Minimize className="w-5 h-5 text-white" />
                  ) : (
                    <Maximize className="w-5 h-5 text-white" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Video info */}
        <div className="p-6 space-y-4 bg-background">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <h2 className="text-xl md:text-2xl font-bold text-foreground">
                {video.title}
              </h2>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span>{video.channelTitle}</span>
                {video.viewCount && (
                  <>
                    <span>•</span>
                    <span>{video.viewCount} visualizações</span>
                  </>
                )}
                {video.isLive ? (
                  <span className="flex items-center gap-1.5 text-primary font-semibold">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse-live" />
                    AO VIVO
                  </span>
                ) : (
                  video.duration && (
                    <>
                      <span>•</span>
                      <span>{video.duration}</span>
                    </>
                  )
                )}
              </div>
            </div>
          </div>
          
          {video.description && (
            <p className="text-sm text-muted-foreground line-clamp-4">
              {video.description}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
