import { YouTubeVideo } from '@/types/youtube';
import { Play, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  video: YouTubeVideo | null | undefined;
  onPlay: (video: YouTubeVideo) => void;
  onMoreInfo?: (video: YouTubeVideo) => void;
}

export function HeroSection({ video, onPlay, onMoreInfo }: HeroSectionProps) {
  if (!video) {
    return (
      <div className="relative h-[70vh] md:h-[80vh] w-full bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="relative h-[70vh] md:h-[80vh] w-full">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${video.thumbnailHigh || video.thumbnail})` }}
      >
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background" />
      </div>
      
      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="w-full max-w-2xl px-4 md:px-12 space-y-4 md:space-y-6">
          {/* Live badge */}
          {video.isLive && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary rounded-md animate-pulse-live">
              <span className="w-2.5 h-2.5 rounded-full bg-primary-foreground animate-pulse" />
              <span className="text-sm font-bold text-primary-foreground tracking-wide">AO VIVO AGORA</span>
            </div>
          )}
          
          {/* Title */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
            {video.title}
          </h1>
          
          {/* Description */}
          <p className="text-sm md:text-lg text-muted-foreground line-clamp-3 max-w-xl">
            {video.description || 'Assista agora no nosso canal.'}
          </p>
          
          {/* Meta info */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{video.channelTitle}</span>
            {video.viewCount && (
              <>
                <span>•</span>
                <span>{video.viewCount} visualizações</span>
              </>
            )}
            {!video.isLive && video.duration && (
              <>
                <span>•</span>
                <span>{video.duration}</span>
              </>
            )}
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              size="lg"
              className="bg-foreground text-background hover:bg-foreground/90 font-semibold gap-2"
              onClick={() => onPlay(video)}
            >
              <Play className="w-5 h-5 fill-current" />
              {video.isLive ? 'Assistir Ao Vivo' : 'Assistir'}
            </Button>
            
            {onMoreInfo && (
              <Button
                size="lg"
                variant="secondary"
                className="font-semibold gap-2"
                onClick={() => onMoreInfo(video)}
              >
                <Info className="w-5 h-5" />
                Mais Informações
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
