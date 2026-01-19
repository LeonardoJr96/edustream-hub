import { useState, useEffect, useCallback, useRef } from 'react';
import { YouTubeVideo, YouTubeLiveStatus } from '@/types/youtube';
import { fetchChannelVideos, checkLiveStatus, searchVideos } from '@/services/youtubeApi';
import { mockVideos, getMockLiveStatus, searchMockVideos, mockCategories } from '@/services/mockData';

// Configuration - Replace with your channel ID
const CHANNEL_ID = import.meta.env.VITE_YOUTUBE_CHANNEL_ID || '';
const USE_MOCK_DATA = !import.meta.env.VITE_YOUTUBE_API_KEY;

// Debounce utility
function createDebounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  
  return function (...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

export function useYouTubeVideos() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadVideos() {
      setLoading(true);
      setError(null);

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
  const checkCountRef = useRef(0);

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

    // Progressive interval: starts at 30s, increases every 5 minutes
    // Max interval is 5 minutes after first check
    const calculateInterval = () => {
      const checkCount = checkCountRef.current;
      // First check: 30 seconds
      if (checkCount === 0) return 30000;
      // After 5 minutes, increase to 5 minutes
      return 5 * 60 * 1000;
    };

    const interval = setInterval(() => {
      checkCountRef.current += 1;
      checkLive();
    }, calculateInterval());

    return () => clearInterval(interval);
  }, []);

  return { liveStatus, loading };
}

export function useYouTubeSearch() {
  const [results, setResults] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  // Create debounced search function
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);

    if (USE_MOCK_DATA) {
      const mockResults = searchMockVideos(searchQuery);
      setResults(mockResults);
      setLoading(false);
      setHasSearched(true);
      return;
    }

    try {
      const searchResults = await searchVideos(CHANNEL_ID, searchQuery);
      setResults(searchResults);
      setHasSearched(true);
    } catch (err) {
      console.error('Search error:', err);
      setResults(searchMockVideos(searchQuery)); // Fallback
      setHasSearched(true);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce the search - only search after 500ms of no typing
  const debouncedSearch = useRef(createDebounce(performSearch, 500)).current;

  const search = useCallback((searchQuery: string) => {
    setQuery(searchQuery);
    debouncedSearch(searchQuery);
  }, [debouncedSearch]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setHasSearched(false);
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
