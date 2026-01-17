import { X } from 'lucide-react';
import { YouTubeVideo } from '@/types/youtube';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface VideoPlayerProps {
  video: YouTubeVideo | null;
  isOpen: boolean;
  onClose: () => void;
}

export function VideoPlayer({ video, isOpen, onClose }: VideoPlayerProps) {
  if (!video) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl w-[95vw] p-0 bg-background border-border overflow-hidden">
        <VisuallyHidden>
          <DialogTitle>{video.title}</DialogTitle>
        </VisuallyHidden>
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-background/80 flex items-center justify-center hover:bg-background transition-colors"
          aria-label="Fechar"
        >
          <X className="w-5 h-5 text-foreground" />
        </button>
        
        {/* Video embed */}
        <div className="aspect-video w-full bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0`}
            title={video.title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        
        {/* Video info */}
        <div className="p-6 space-y-4">
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
