export interface NewsItem {
  id: string;
  title: string;
  description: string;
  category: 'Announcement' | 'Update' | 'Event' | 'General';
  date: Date;
  author: {
    name: string;
    initials: string;
    color: string; 
  };
  isFeatured?: boolean;
  imageUrl?: string;
  action?: {
    type: 'link' | 'button';
    url?: string;
  };
}