import { createServerClient } from "@/lib/supabase/server";
import type {
  AgendaEventRow,
  AnnouncementRow,
  DownloadRow,
  FacilityRow,
  FaqRow,
  GalleryItemRow,
  MajorRow,
  NewsRow,
  StaffRow,
  TeacherRow,
} from "@/types/database";
import type { SearchResultItem } from "@/types/search";

const RESULTS_PER_CATEGORY = 4;

// Karakter ini punya arti khusus di sintaks filter PostgREST (pemisah
// kondisi / wildcard), jadi dibuang dulu dari kata kunci sebelum dipakai
// supaya nggak merusak query-nya.
function sanitize(query: string) {
  return query.replace(/[,()%]/g, "").trim();
}

export async function getSearchResults(rawQuery: string): Promise<SearchResultItem[]> {
  const query = sanitize(rawQuery);
  if (query.length < 2) return [];

  const supabase = await createServerClient();
  const like = `%${query}%`;
  const results: SearchResultItem[] = [];

  const [
    news,
    announcements,
    teachers,
    staff,
    majors,
    facilities,
    faqs,
    downloads,
    agenda,
    gallery,
  ] = await Promise.all([
    supabase.from("news").select("title, slug, excerpt").or(`title.ilike.${like},excerpt.ilike.${like}`).limit(RESULTS_PER_CATEGORY),
    supabase.from("announcements").select("id, title, content").or(`title.ilike.${like},content.ilike.${like}`).limit(RESULTS_PER_CATEGORY),
    supabase.from("teachers").select("id, name, position, subject_group").or(`name.ilike.${like},position.ilike.${like},subject_group.ilike.${like}`).limit(RESULTS_PER_CATEGORY),
    supabase.from("staff").select("id, name, position, unit").or(`name.ilike.${like},position.ilike.${like},unit.ilike.${like}`).limit(RESULTS_PER_CATEGORY),
    supabase.from("majors").select("id, name, abbreviation, description").or(`name.ilike.${like},abbreviation.ilike.${like},description.ilike.${like}`).limit(RESULTS_PER_CATEGORY),
    supabase.from("facilities").select("id, name, category, description").or(`name.ilike.${like},category.ilike.${like},description.ilike.${like}`).limit(RESULTS_PER_CATEGORY),
    supabase.from("faqs").select("id, question, answer").or(`question.ilike.${like},answer.ilike.${like}`).limit(RESULTS_PER_CATEGORY),
    supabase.from("downloads").select("id, title, category, description, file_url").or(`title.ilike.${like},category.ilike.${like},description.ilike.${like}`).limit(RESULTS_PER_CATEGORY),
    supabase.from("agenda_events").select("id, title, location, description").or(`title.ilike.${like},location.ilike.${like},description.ilike.${like}`).limit(RESULTS_PER_CATEGORY),
    supabase.from("gallery_items").select("id, title, category, description").or(`title.ilike.${like},category.ilike.${like},description.ilike.${like}`).limit(RESULTS_PER_CATEGORY),
  ]);

  (news.data as Pick<NewsRow, "title" | "slug" | "excerpt">[] | null)?.forEach((row) => {
    results.push({ type: "news", typeLabel: "Berita", icon: "bi-newspaper", title: row.title, description: row.excerpt ?? "", href: `/news/${row.slug}` });
  });

  (announcements.data as Pick<AnnouncementRow, "id" | "title" | "content">[] | null)?.forEach((row) => {
    results.push({ type: "announcement", typeLabel: "Pengumuman", icon: "bi-megaphone", title: row.title, description: row.content, href: "/announcements" });
  });

  (teachers.data as Pick<TeacherRow, "id" | "name" | "position" | "subject_group">[] | null)?.forEach((row) => {
    results.push({ type: "teacher", typeLabel: "Guru", icon: "bi-person-badge", title: row.name, description: `${row.position} · ${row.subject_group}`, href: "/teachers" });
  });

  (staff.data as Pick<StaffRow, "id" | "name" | "position" | "unit">[] | null)?.forEach((row) => {
    results.push({ type: "staff", typeLabel: "Staff", icon: "bi-person-workspace", title: row.name, description: `${row.position} · ${row.unit}`, href: "/staff" });
  });

  (majors.data as Pick<MajorRow, "id" | "name" | "abbreviation" | "description">[] | null)?.forEach((row) => {
    results.push({ type: "major", typeLabel: "Jurusan", icon: "bi-mortarboard", title: `${row.name} (${row.abbreviation})`, description: row.description, href: "/academic/majors" });
  });

  (facilities.data as Pick<FacilityRow, "id" | "name" | "category" | "description">[] | null)?.forEach((row) => {
    results.push({ type: "facility", typeLabel: "Fasilitas", icon: "bi-building", title: row.name, description: row.description, href: "/facilities" });
  });

  (faqs.data as Pick<FaqRow, "id" | "question" | "answer">[] | null)?.forEach((row) => {
    results.push({ type: "faq", typeLabel: "FAQ", icon: "bi-question-circle", title: row.question, description: row.answer, href: "/faq" });
  });

  (downloads.data as Pick<DownloadRow, "id" | "title" | "category" | "description" | "file_url">[] | null)?.forEach((row) => {
    results.push({ type: "download", typeLabel: "Download", icon: "bi-file-earmark-arrow-down", title: row.title, description: row.description ?? row.category, href: row.file_url ?? "/downloads" });
  });

  (agenda.data as Pick<AgendaEventRow, "id" | "title" | "location" | "description">[] | null)?.forEach((row) => {
    results.push({ type: "agenda", typeLabel: "Agenda", icon: "bi-calendar-event", title: row.title, description: row.location, href: "/agenda" });
  });

  (gallery.data as Pick<GalleryItemRow, "id" | "title" | "category" | "description">[] | null)?.forEach((row) => {
    results.push({ type: "gallery", typeLabel: "Galeri", icon: "bi-image", title: row.title, description: row.category, href: "/gallery" });
  });

  return results;
}
