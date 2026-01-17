import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { YouTubeVideo } from '@/types/youtube';
import { VideoCard } from './VideoCard';

interface VideoCarouselProps {
  title: string;
  videos: YouTubeVideo[];
  onVideoClick?: (video: YouTubeVideo) => void;
}

export function VideoCarousel({ title, videos, onVideoClick }: VideoCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    
    const scrollAmount = scrollRef.current.clientWidth * 0.8;
    const newScrollLeft = scrollRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
    
    scrollRef.current.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth',
    });
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  if (videos.length === 0) return null;

  return (
    <div className="relative group/carousel py-4">
      {/* Title */}
      <h2 className="text-lg md:text-xl font-semibold text-foreground mb-3 px-4 md:px-12">
        {title}
      </h2>
      
      {/* Carousel container */}
      <div className="relative">
        {/* Left arrow */}
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-0 bottom-0 z-20 w-12 flex items-center justify-center bg-gradient-to-r from-background to-transparent opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-8 h-8 text-foreground" />
          </button>
        )}
        
        {/* Videos container */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-3 overflow-x-auto scrollbar-hide px-4 md:px-12 pb-2"
        >
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onClick={onVideoClick}
            />
          ))}
        </div>
        
        {/* Right arrow */}
        {showRightArrow && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-0 bottom-0 z-20 w-12 flex items-center justify-center bg-gradient-to-l from-background to-transparent opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-8 h-8 text-foreground" />
          </button>
        )}
      </div>
    </div>
  );
}
