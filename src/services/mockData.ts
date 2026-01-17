import { YouTubeVideo } from '@/types/youtube';

// Mock data for development and demo purposes
export const mockVideos: YouTubeVideo[] = [
  {
    id: 'dQw4w9WgXcQ',
    title: 'Como Criar um App Completo com React e TypeScript',
    description: 'Neste vídeo, vamos aprender a criar uma aplicação completa usando React e TypeScript.',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop',
    thumbnailHigh: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1280&h=720&fit=crop',
    channelTitle: 'Seu Canal',
    publishedAt: '2024-01-15T10:00:00Z',
    duration: '45:30',
    viewCount: '125K',
    isLive: false,
    liveBroadcastContent: 'none',
  },
  {
    id: 'abc123def',
    title: 'Live: Programando um Sistema de Autenticação',
    description: 'Acompanhe ao vivo a criação de um sistema completo de autenticação.',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=225&fit=crop',
    thumbnailHigh: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1280&h=720&fit=crop',
    channelTitle: 'Seu Canal',
    publishedAt: '2024-01-20T14:00:00Z',
    duration: 'AO VIVO',
    viewCount: '1.2K',
    isLive: true,
    liveBroadcastContent: 'live',
  },
  {
    id: 'xyz789ghi',
    title: 'Introdução ao Tailwind CSS - Do Zero ao Avançado',
    description: 'Aprenda Tailwind CSS do básico ao avançado neste tutorial completo.',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=225&fit=crop',
    thumbnailHigh: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1280&h=720&fit=crop',
    channelTitle: 'Seu Canal',
    publishedAt: '2024-01-10T08:00:00Z',
    duration: '1:23:45',
    viewCount: '89K',
    isLive: false,
    liveBroadcastContent: 'none',
  },
  {
    id: 'jkl456mno',
    title: 'Node.js: Criando APIs RESTful Profissionais',
    description: 'Tutorial completo sobre criação de APIs RESTful com Node.js e Express.',
    thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=225&fit=crop',
    thumbnailHigh: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=1280&h=720&fit=crop',
    channelTitle: 'Seu Canal',
    publishedAt: '2024-01-08T12:00:00Z',
    duration: '58:20',
    viewCount: '67K',
    isLive: false,
    liveBroadcastContent: 'none',
  },
  {
    id: 'pqr012stu',
    title: 'Deploy Completo: Do Localhost à Produção',
    description: 'Aprenda a fazer deploy de aplicações web do desenvolvimento à produção.',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=225&fit=crop',
    thumbnailHigh: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1280&h=720&fit=crop',
    channelTitle: 'Seu Canal',
    publishedAt: '2024-01-05T15:00:00Z',
    duration: '32:15',
    viewCount: '45K',
    isLive: false,
    liveBroadcastContent: 'none',
  },
  {
    id: 'vwx345yza',
    title: 'React Hooks: useState, useEffect e Muito Mais',
    description: 'Domine os principais hooks do React neste tutorial prático.',
    thumbnail: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=400&h=225&fit=crop',
    thumbnailHigh: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=1280&h=720&fit=crop',
    channelTitle: 'Seu Canal',
    publishedAt: '2024-01-03T09:00:00Z',
    duration: '41:50',
    viewCount: '112K',
    isLive: false,
    liveBroadcastContent: 'none',
  },
  {
    id: 'bcd678efg',
    title: 'Git e GitHub: Guia Completo para Iniciantes',
    description: 'Aprenda Git e GitHub do zero com exemplos práticos.',
    thumbnail: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=400&h=225&fit=crop',
    thumbnailHigh: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=1280&h=720&fit=crop',
    channelTitle: 'Seu Canal',
    publishedAt: '2024-01-01T10:00:00Z',
    duration: '55:30',
    viewCount: '203K',
    isLive: false,
    liveBroadcastContent: 'none',
  },
  {
    id: 'hij901klm',
    title: 'TypeScript na Prática: Tipagem que Funciona',
    description: 'Tutorial prático de TypeScript com casos reais de uso.',
    thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=225&fit=crop',
    thumbnailHigh: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=1280&h=720&fit=crop',
    channelTitle: 'Seu Canal',
    publishedAt: '2023-12-28T11:00:00Z',
    duration: '48:15',
    viewCount: '78K',
    isLive: false,
    liveBroadcastContent: 'none',
  },
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
