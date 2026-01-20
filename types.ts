
export enum View {
  WRITER = 'writer',
  IMAGE_LAB = 'image_lab',
  HISTORY = 'history'
}

export interface ContentItem {
  id: string;
  type: 'text' | 'image';
  title: string;
  content: string;
  timestamp: number;
}

export interface GeminiResponse {
  text?: string;
  imageUrl?: string;
  error?: string;
}
