// YouTube API Types
export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  thumbnailHigh: string;
  channelTitle: string;
  publishedAt: string;
  duration: string;
  viewCount: string;
  isLive: boolean;
  liveBroadcastContent: 'live' | 'upcoming' | 'none';
}

export interface YouTubeChannel {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  subscriberCount: string;
}

export interface YouTubePlaylist {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  itemCount: number;
}

export interface YouTubeSearchResult {
  videos: YouTubeVideo[];
  nextPageToken?: string;
  totalResults: number;
}

export interface YouTubeLiveStatus {
  isLive: boolean;
  liveVideo: YouTubeVideo | null;
}
