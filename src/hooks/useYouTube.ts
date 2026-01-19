import { useState, useEffect, useCallback } from 'react';
import { YouTubeVideo, YouTubeLiveStatus } from '@/types/youtube';
import { fetchChannelVideos, checkLiveStatus, searchVideos } from '@/services/youtubeApi';
import { mockVideos, getMockLiveStatus, searchMockVideos, mockCategories } from '@/services/mockData';

// Configuration - Replace with your channel ID
const CHANNEL_ID = import.meta.env.VITE_YOUTUBE_CHANNEL_ID || '';
const USE_MOCK_DATA = !import.meta.env.VITE_YOUTUBE_API_KEY;

export function useYouTubeVideos() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadVideos() {
      setLoading(true);
      setError(null);
      console.log(USE_MOCK_DATA)
      if (USE_MOCK_DATA) {
        // Use mock data if no API key
        setVideos(mockVideos);
        setLoading(false);
        return;
      }

      try {
        const result = await fetchChannelVideos(CHANNEL_ID);
        setVideos(result.videos);
      } catch (err) {
        setError('Erro ao carregar vídeos');
        setVideos(mockVideos); // Fallback to mock
      } finally {
        setLoading(false);
      }
    }

    loadVideos();
  }, []);

  return { videos, loading, error };
}

export function useYouTubeLiveStatus() {
  const [liveStatus, setLiveStatus] = useState<YouTubeLiveStatus>({ isLive: false, liveVideo: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkLive() {
      if (USE_MOCK_DATA) {
        setLiveStatus(getMockLiveStatus());
        setLoading(false);
        return;
      }

      try {
        const status = await checkLiveStatus(CHANNEL_ID);
        setLiveStatus(status);
      } catch (err) {
        console.error('Error checking live status:', err);
      } finally {
        setLoading(false);
      }
    }

    checkLive();

    // Check live status every 30 seconds
    const interval = setInterval(checkLive, 30000);
    return () => clearInterval(interval);
  }, []);

  return { liveStatus, loading };
}

export function useYouTubeSearch() {
  const [results, setResults] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');

  const search = useCallback(async (searchQuery: string) => {
    setQuery(searchQuery);
    
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);

    if (USE_MOCK_DATA) {
      const mockResults = searchMockVideos(searchQuery);
      setResults(mockResults);
      setLoading(false);
      return;
    }

    try {
      const searchResults = await searchVideos(CHANNEL_ID, searchQuery);
      setResults(searchResults);
    } catch (err) {
      console.error('Search error:', err);
      setResults(searchMockVideos(searchQuery)); // Fallback
    } finally {
      setLoading(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
  }, []);

  return { results, loading, query, search, clearSearch };
}

export function useYouTubeCategories() {
  const [categories, setCategories] = useState(mockCategories);
  const [loading, setLoading] = useState(false);

  // For now, return mock categories
  // In the future, this can be expanded to fetch playlists from YouTube API
  
  return { categories, loading };
}
