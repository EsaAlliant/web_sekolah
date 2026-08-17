// Bentuk row mentah dari Supabase (snake_case, sesuai kolom di schema.sql).
// File ini terpisah dari types/*.ts (camelCase, dipakai komponen) supaya
// konversi antara keduanya jelas dan terpusat di services/*.service.ts

export interface WebsiteSettingsRow {
  id: number;
  name: string;
  short_name: string;
  description: string | null;
  motto: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  whatsapp_url: string | null;
  office_hours: string | null;
  logo_text: string | null;
  map_url: string | null;
  theme: "light" | "dark" | "system";
  accreditation: string | null;
  founded_year: string | null;
  logo_url: string | null;
}

export interface NavigationItemRow {
  id: string;
  parent_id: string | null;
  label: string;
  href: string;
  sort_order: number;
}

export interface SocialLinkRow {
  id: string;
  label: string;
  href: string;
  icon: string;
  sort_order: number;
}

export interface VisitorStatsRow {
  id: number;
  today: string | null;
  month: string | null;
  year: string | null;
  total: string | null;
}

export interface AnnouncementTickerRow {
  id: string;
  message: string;
  sort_order: number;
}

export interface TeacherRow {
  id: string;
  name: string;
  nip: string | null;
  position: string;
  subject_group: string;
  education: string;
  email: string | null;
  photo_url: string | null;
  created_at: string;
}

export interface StaffRow {
  id: string;
  name: string;
  position: string;
  unit: string;
  email: string | null;
  photo_url: string | null;
  created_at: string;
}

export interface PrincipalProfileRow {
  id: number;
  name: string;
  position_prefix: string;
  quote: string | null;
  email_prefix: string | null;
  messages: string[];
  closing: string | null;
  photo_url: string | null;
}

export interface HistoryProfileRow {
  id: number;
  intro: string;
}

export interface HistoryMilestoneRow {
  id: string;
  year: string;
  title: string;
  description: string;
  sort_order: number;
}

export interface VisionMissionRow {
  id: number;
  vision: string;
  missions: string[];
  core_values: { label: string; icon: string }[];
}

export interface MajorRow {
  id: string;
  name: string;
  abbreviation: string;
  description: string;
  duration: string;
  icon: string | null;
  competencies: string[];
  career_paths: string[];
  sort_order: number;
}

export interface CurriculumProfileRow {
  id: number;
  framework: string;
  intro: string | null;
  curriculum_name: string | null;
  schedule: string | null;
  data_semester: string | null;
  internet_access: string | null;
  electricity_source: string | null;
  electricity_power: string | null;
  land_area: string | null;
  components: { title: string; portion: string; description: string; icon: string }[];
  structure: { grade: string; title: string; description: string }[];
}

export interface AgendaEventRow {
  id: string;
  title: string;
  start_date: string;
  end_date: string | null;
  time: string | null;
  location: string;
  category: string;
  description: string | null;
  created_at: string;
}

export interface GalleryItemRow {
  id: string;
  title: string;
  category: string;
  date: string;
  description: string | null;
  icon: string | null;
  photo_url: string | null;
  created_at: string;
}

export interface DownloadRow {
  id: string;
  title: string;
  category: string;
  file_type: "pdf" | "docx" | "xlsx";
  file_size: string | null;
  updated_date: string | null;
  description: string | null;
  file_url: string | null;
}

export interface FaqRow {
  id: string;
  question: string;
  answer: string;
  category: string;
  sort_order: number;
}

export interface NewsRow {
  id: string;
  slug: string;
  title: string;
  category: string;
  author: string | null;
  date: string;
  excerpt: string | null;
  content: string[];
  icon: string | null;
  photo_url: string | null;
  created_at: string;
}

export interface AnnouncementRow {
  id: string;
  title: string;
  category: string;
  date: string;
  is_pinned: boolean;
  content: string;
}

export interface TestimonialRow {
  id: string;
  name: string;
  category: "Alumni" | "Siswa" | "Orang Tua";
  detail: string | null;
  quote: string | null;
  photo_url: string | null;
  video_url: string | null;
  created_at: string;
}

export interface PpdbInfoRow {
  id: number;
  period: string;
  status: "draft" | "open" | "closed";
  quota: string | null;
  fee: string | null;
  requirements: string[];
  timeline: { label: string; date: string }[];
  steps: string[];
}

export interface PpdbSubmissionRow {
  id: string;
  full_name: string;
  gender: string;
  birth_place: string | null;
  birth_date: string | null;
  previous_school: string | null;
  address: string | null;
  parent_name: string | null;
  parent_phone: string | null;
  major_id: string | null;
  notes: string | null;
  status: "baru" | "diverifikasi" | "diterima" | "ditolak";
  created_at: string;
}

export interface PageVisitRow {
  id: string;
  path: string | null;
  visited_at: string;
}

export interface FacilityRow {
  id: string;
  name: string;
  description: string;
  icon: string | null;
  photo_url: string | null;
  sort_order: number;
}

export interface FacilityRow {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string | null;
  photo_url: string | null;
  sort_order: number;
}

export interface HeroSlideRow {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  action_label: string;
  action_href: string;
  theme: "primary" | "gold" | "green";
  sort_order: number;
}

export interface HomepageFeatureRow {
  id: string;
  title: string;
  description: string;
  icon: string;
  sort_order: number;
}
