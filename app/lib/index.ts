// Types for the podcast application

export type ContentType = 'video' | 'audio' | 'text';

export type Category = 
  | 'philosophie' 
  | 'droit' 
  | 'litterature' 
  | 'reflexions' 
  | 'autres';

export interface Profile {
  id: string;
  firstName: string;
  lastName: string;
  title: string;
  bio: string;
  formations: string[];
  motivations: string[];
  imageUrl: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    email?: string;
  };
}

export interface Content {
  id: string;
  title: string;
  description: string;
  type: ContentType;
  category: Category;
  mediaUrl?: string;
  thumbnailUrl?: string;
  transcription?: string;
  textContent?: string;
  duration?: string;
  publishedAt: string;
  tags: string[];
}

export interface CategoryInfo {
  id: string;
  label: string;
  description: string;
  icon: string;
}

export interface AppData {
  profile: Profile;
  categories: CategoryInfo[];
  contents: Content[];
}
