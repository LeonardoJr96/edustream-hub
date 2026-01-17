import { YouTubeVideo, YouTubeSearchResult, YouTubeLiveStatus } from '@/types/youtube';

// API Key should be configured in environment or as a constant
// For now, we'll use a placeholder that can be replaced
const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || '';
const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

// Helper to format duration from ISO 8601 to readable format
function formatDuration(isoDuration: string): string {
  if (!isoDuration) return '';
  
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return '';
  
  const hours = match[1] ? parseInt(match[1]) : 0;
  const minutes = match[2] ? parseInt(match[2]) : 0;
  const seconds = match[3] ? parseInt(match[3]) : 0;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Helper to format view count
function formatViewCount(count: string): string {
  const num = parseInt(count);
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return count;
}

// Fetch videos from a channel
export async function fetchChannelVideos(
  channelId: string,
  maxResults: number = 20,
  pageToken?: string
): Promise<YouTubeSearchResult> {
  if (!YOUTUBE_API_KEY) {
    console.warn('YouTube API key not configured');
    return { videos: [], totalResults: 0 };
  }

  try {
    // First, search for videos from the channel
    const searchUrl = new URL(`${YOUTUBE_API_BASE}/search`);
    searchUrl.searchParams.set('key', YOUTUBE_API_KEY);
    searchUrl.searchParams.set('channelId', channelId);
    searchUrl.searchParams.set('part', 'snippet');
    searchUrl.searchParams.set('type', 'video');
    searchUrl.searchParams.set('order', 'date');
    searchUrl.searchParams.set('maxResults', maxResults.toString());
    if (pageToken) {
      searchUrl.searchParams.set('pageToken', pageToken);
    }

    const searchResponse = await fetch(searchUrl.toString());
    const searchData = await searchResponse.json();

    if (!searchData.items || searchData.items.length === 0) {
      return { videos: [], totalResults: 0 };
    }

    // Get video IDs for detailed info
    const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');

    // Fetch detailed video info (duration, view count, etc.)
    const videosUrl = new URL(`${YOUTUBE_API_BASE}/videos`);
    videosUrl.searchParams.set('key', YOUTUBE_API_KEY);
    videosUrl.searchParams.set('id', videoIds);
    videosUrl.searchParams.set('part', 'snippet,contentDetails,statistics,liveStreamingDetails');

    const videosResponse = await fetch(videosUrl.toString());
    const videosData = await videosResponse.json();

    const videos: YouTubeVideo[] = videosData.items.map((item: any) => ({
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
      thumbnailHigh: item.snippet.thumbnails.maxres?.url || item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      duration: formatDuration(item.contentDetails?.duration || ''),
      viewCount: formatViewCount(item.statistics?.viewCount || '0'),
      isLive: item.snippet.liveBroadcastContent === 'live',
      liveBroadcastContent: item.snippet.liveBroadcastContent || 'none',
    }));

    return {
      videos,
      nextPageToken: searchData.nextPageToken,
      totalResults: searchData.pageInfo?.totalResults || videos.length,
    };
  } catch (error) {
    console.error('Error fetching channel videos:', error);
    return { videos: [], totalResults: 0 };
  }
}

// Check if channel is currently live
export async function checkLiveStatus(channelId: string): Promise<YouTubeLiveStatus> {
  if (!YOUTUBE_API_KEY) {
    return { isLive: false, liveVideo: null };
  }

  try {
    const searchUrl = new URL(`${YOUTUBE_API_BASE}/search`);
    searchUrl.searchParams.set('key', YOUTUBE_API_KEY);
    searchUrl.searchParams.set('channelId', channelId);
    searchUrl.searchParams.set('part', 'snippet');
    searchUrl.searchParams.set('type', 'video');
    searchUrl.searchParams.set('eventType', 'live');
    searchUrl.searchParams.set('maxResults', '1');

    const response = await fetch(searchUrl.toString());
    const data = await response.json();

    if (data.items && data.items.length > 0) {
      const liveItem = data.items[0];
      return {
        isLive: true,
        liveVideo: {
          id: liveItem.id.videoId,
          title: liveItem.snippet.title,
          description: liveItem.snippet.description,
          thumbnail: liveItem.snippet.thumbnails.medium?.url,
          thumbnailHigh: liveItem.snippet.thumbnails.high?.url,
          channelTitle: liveItem.snippet.channelTitle,
          publishedAt: liveItem.snippet.publishedAt,
          duration: 'AO VIVO',
          viewCount: '',
          isLive: true,
          liveBroadcastContent: 'live',
        },
      };
    }

    return { isLive: false, liveVideo: null };
  } catch (error) {
    console.error('Error checking live status:', error);
    return { isLive: false, liveVideo: null };
  }
}

// Search videos
export async function searchVideos(
  channelId: string,
  query: string,
  maxResults: number = 20
): Promise<YouTubeVideo[]> {
  if (!YOUTUBE_API_KEY || !query.trim()) {
    return [];
  }

  try {
    const searchUrl = new URL(`${YOUTUBE_API_BASE}/search`);
    searchUrl.searchParams.set('key', YOUTUBE_API_KEY);
    searchUrl.searchParams.set('channelId', channelId);
    searchUrl.searchParams.set('q', query);
    searchUrl.searchParams.set('part', 'snippet');
    searchUrl.searchParams.set('type', 'video');
    searchUrl.searchParams.set('maxResults', maxResults.toString());

    const searchResponse = await fetch(searchUrl.toString());
    const searchData = await searchResponse.json();

    if (!searchData.items || searchData.items.length === 0) {
      return [];
    }

    const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');

    const videosUrl = new URL(`${YOUTUBE_API_BASE}/videos`);
    videosUrl.searchParams.set('key', YOUTUBE_API_KEY);
    videosUrl.searchParams.set('id', videoIds);
    videosUrl.searchParams.set('part', 'snippet,contentDetails,statistics');

    const videosResponse = await fetch(videosUrl.toString());
    const videosData = await videosResponse.json();

    return videosData.items.map((item: any) => ({
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.medium?.url,
      thumbnailHigh: item.snippet.thumbnails.high?.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      duration: formatDuration(item.contentDetails?.duration || ''),
      viewCount: formatViewCount(item.statistics?.viewCount || '0'),
      isLive: item.snippet.liveBroadcastContent === 'live',
      liveBroadcastContent: item.snippet.liveBroadcastContent || 'none',
    }));
  } catch (error) {
    console.error('Error searching videos:', error);
    return [];
  }
}

// Fetch playlist videos
export async function fetchPlaylistVideos(
  playlistId: string,
  maxResults: number = 20
): Promise<YouTubeVideo[]> {
  if (!YOUTUBE_API_KEY) {
    return [];
  }

  try {
    const playlistUrl = new URL(`${YOUTUBE_API_BASE}/playlistItems`);
    playlistUrl.searchParams.set('key', YOUTUBE_API_KEY);
    playlistUrl.searchParams.set('playlistId', playlistId);
    playlistUrl.searchParams.set('part', 'snippet,contentDetails');
    playlistUrl.searchParams.set('maxResults', maxResults.toString());

    const playlistResponse = await fetch(playlistUrl.toString());
    const playlistData = await playlistResponse.json();

    if (!playlistData.items || playlistData.items.length === 0) {
      return [];
    }

    const videoIds = playlistData.items.map((item: any) => item.contentDetails.videoId).join(',');

    const videosUrl = new URL(`${YOUTUBE_API_BASE}/videos`);
    videosUrl.searchParams.set('key', YOUTUBE_API_KEY);
    videosUrl.searchParams.set('id', videoIds);
    videosUrl.searchParams.set('part', 'snippet,contentDetails,statistics');

    const videosResponse = await fetch(videosUrl.toString());
    const videosData = await videosResponse.json();

    return videosData.items.map((item: any) => ({
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.medium?.url,
      thumbnailHigh: item.snippet.thumbnails.high?.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      duration: formatDuration(item.contentDetails?.duration || ''),
      viewCount: formatViewCount(item.statistics?.viewCount || '0'),
      isLive: false,
      liveBroadcastContent: 'none',
    }));
  } catch (error) {
    console.error('Error fetching playlist videos:', error);
    return [];
  }
}
