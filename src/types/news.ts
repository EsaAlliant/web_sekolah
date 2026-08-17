export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  author: string;
  date: string;
  excerpt: string;
  content: string[];
  icon: string;
  photoUrl?: string;
}
