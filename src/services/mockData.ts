import { YouTubeVideo } from '@/types/youtube';

// Mock data for development and demo purposes
export const mockVideos: YouTubeVideo[] = [
  
];

// Categories with mock videos
export const mockCategories = [
  {
    id: 'recent',
    title: 'Adicionados Recentemente',
    videos: mockVideos.slice(0, 6),
  },
  {
    id: 'popular',
    title: 'Mais Populares',
    videos: [...mockVideos].sort((a, b) => {
      const parseViews = (v: string) => {
        const num = parseFloat(v);
        if (v.includes('M')) return num * 1000000;
        if (v.includes('K')) return num * 1000;
        return num;
      };
      return parseViews(b.viewCount) - parseViews(a.viewCount);
    }).slice(0, 6),
  },
  {
    id: 'tutorials',
    title: 'Tutoriais Completos',
    videos: mockVideos.filter(v => v.title.toLowerCase().includes('tutorial') || v.title.toLowerCase().includes('completo')),
  },
  {
    id: 'react',
    title: 'React & Frontend',
    videos: mockVideos.filter(v => v.title.toLowerCase().includes('react') || v.title.toLowerCase().includes('tailwind')),
  },
];

// Get featured/hero video (most recent or live)
export function getFeaturedVideo(): YouTubeVideo {
  const liveVideo = mockVideos.find(v => v.isLive);
  if (liveVideo) return liveVideo;
  return mockVideos[0];
}

// Check if there's a live video
export function getMockLiveStatus() {
  const liveVideo = mockVideos.find(v => v.isLive);
  return {
    isLive: !!liveVideo,
    liveVideo: liveVideo || null,
  };
}

// Search mock videos
export function searchMockVideos(query: string): YouTubeVideo[] {
  const lowerQuery = query.toLowerCase();
  return mockVideos.filter(
    v => v.title.toLowerCase().includes(lowerQuery) || 
         v.description.toLowerCase().includes(lowerQuery)
  );
}
