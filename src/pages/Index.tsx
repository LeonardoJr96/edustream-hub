import { useState } from 'react';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { VideoCarousel } from '@/components/VideoCarousel';
import { VideoPlayer } from '@/components/VideoPlayer';
import { useYouTubeVideos, useYouTubeLiveStatus, useYouTubeSearch, useYouTubeCategories } from '@/hooks/useYouTube';
import { YouTubeVideo } from '@/types/youtube';
{/* import { getFeaturedVideo } from '@/services/mockData'; */}

const Index = () => {
  const { videos, loading, error } = useYouTubeVideos();
  const { liveStatus } = useYouTubeLiveStatus();
  const { results: searchResults, search, clearSearch, query } = useYouTubeSearch();
  const { categories } = useYouTubeCategories();
  
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  const handleVideoClick = (video: YouTubeVideo) => {
    setSelectedVideo(video);
    setIsPlayerOpen(true);
  };

  const handleClosePlayer = () => {
    setIsPlayerOpen(false);
    setSelectedVideo(null);
  };

  const featuredVideo =
  liveStatus.isLive && liveStatus.liveVideo
    ? liveStatus.liveVideo
    : videos.length > 0
    ? videos[0]
    : null;

  const isSearching = query.length > 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Carregando vídeos...</p>
      </div>
    );
  }


  if (error) {
    return <p>Erro ao carregar vídeos</p>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header
        liveStatus={liveStatus}
        onSearch={search}
        onClearSearch={clearSearch}
        onLiveClick={handleVideoClick}
      />

      {/* Main content */}
      <main>
        {isSearching ? (
          /* Search results */
          <div className="pt-24 px-4 md:px-12">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              Resultados para "{query}"
            </h2>
            {searchResults.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {searchResults.map((video) => (
                  <div
                    key={video.id}
                    className="cursor-pointer group"
                    onClick={() => handleVideoClick(video)}
                  >
                    <div className="relative aspect-video rounded-md overflow-hidden bg-card">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute bottom-2 right-2 px-1.5 py-0.5 text-xs font-medium rounded bg-background/80">
                        {video.duration}
                      </div>
                    </div>
                    <h3 className="mt-2 text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                      {video.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">{video.viewCount} visualizações</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Nenhum vídeo encontrado.</p>
            )}
          </div>
        ) : (
          <>
            {/* Hero section */}
            <HeroSection
              video={featuredVideo}
              onPlay={handleVideoClick}
              onMoreInfo={handleVideoClick}
            />

            {/* Video carousels by category */}
            <div className="-mt-32 relative z-10 pb-12">
              {categories.map((category) => (
                <VideoCarousel
                  key={category.id}
                  title={category.title}
                  videos={category.videos}
                  onVideoClick={handleVideoClick}
                />
              ))}
            </div>
          </>
        )}
      </main>

      {/* Video player modal */}
      <VideoPlayer
        video={selectedVideo}
        isOpen={isPlayerOpen}
        onClose={handleClosePlayer}
      />
    </div>
  );
};

export default Index;
