export interface Profile {
  id: string;
  firstName: string;
  lastName: string;
  title: string;
  bio: string;
  formations: string[];
  motivations: string[];
  imageUrl: string;
  socialLinks: {
    twitter: string;
    linkedin: string;
    email: string;
  };
}

export interface CategoryInfo {
  id: string;
  label: string;
  description: string;
  icon: string;
}

export interface Content {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'audio' | 'text';
  category: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  transcription?: string;
  textContent?: string;
  duration?: string;
  publishedAt: string;
  tags: string[];
}

export interface AppData {
  profile: Profile;
  categories: CategoryInfo[];
  contents: Content[];
}

export interface Stats {
  visitors: number;
  videos: number;
  audios: number;
  documents: number;
}
