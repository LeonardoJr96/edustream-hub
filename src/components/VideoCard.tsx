import { YouTubeVideo } from '@/types/youtube';
import { Play } from 'lucide-react';

interface VideoCardProps {
  video: YouTubeVideo;
  onClick?: (video: YouTubeVideo) => void;
  size?: 'small' | 'medium' | 'large';
}

export function VideoCard({ video, onClick, size = 'medium' }: VideoCardProps) {
  const sizeClasses = {
    small: 'w-40 md:w-48',
    medium: 'w-56 md:w-64',
    large: 'w-72 md:w-80',
  };

  return (
    <div
      className={`${sizeClasses[size]} flex-shrink-0 group cursor-pointer transition-transform duration-300 hover:scale-105 hover:z-10`}
      onClick={() => onClick?.(video)}
    >
      <div className="relative aspect-video rounded-md overflow-hidden bg-card">
        {/* Thumbnail */}
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Play button on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-12 h-12 rounded-full bg-foreground/90 flex items-center justify-center">
            <Play className="w-6 h-6 text-background fill-current ml-1" />
          </div>
        </div>
        
        {/* Duration badge */}
        <div className={`absolute bottom-2 right-2 px-1.5 py-0.5 text-xs font-medium rounded ${
          video.isLive 
            ? 'bg-primary text-primary-foreground animate-pulse-live' 
            : 'bg-background/80 text-foreground'
        }`}>
          {video.duration}
        </div>
        
        {/* Live indicator */}
        {video.isLive && (
          <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1 bg-primary rounded text-xs font-bold text-primary-foreground">
            <span className="w-2 h-2 rounded-full bg-primary-foreground animate-pulse-live" />
            AO VIVO
          </div>
        )}
      </div>
      
      {/* Video info */}
      <div className="mt-2 space-y-1">
        <h3 className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {video.title}
        </h3>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{video.channelTitle}</span>
          {video.viewCount && (
            <>
              <span>•</span>
              <span>{video.viewCount} visualizações</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
