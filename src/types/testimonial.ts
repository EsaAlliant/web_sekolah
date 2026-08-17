export interface Testimonial {
  id: string;
  name: string;
  category: "Alumni" | "Siswa" | "Orang Tua";
  detail: string;
  quote: string;
  photoUrl?: string;
  videoUrl?: string;
}
