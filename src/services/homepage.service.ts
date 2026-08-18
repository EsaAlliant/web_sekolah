import { createServerClient } from "@/lib/supabase/server";
import type { HeroSlideRow, HomepageFeatureRow } from "@/types/database";
import type { HeroSlideContent } from "@/components/layout/Hero/HeroSlide";
import type { HomepageFeature } from "@/types/homepage";

export async function getHeroSlides(): Promise<HeroSlideContent[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase.from("hero_slides").select("*").order("sort_order");

  if (error) {
    console.error("getHeroSlides error:", error.message);
    return [];
  }

  return (data as HeroSlideRow[]).map((row) => ({
    id: row.id,
    sortOrder: row.sort_order,
    imageUrl: row.image_url,
  }));
}

export async function getHeroSlideById(id: string) {
  const supabase = await createServerClient();
  const { data, error } = await supabase.from("hero_slides").select("*").eq("id", id).single();
  if (error || !data) return undefined;
  return data as HeroSlideRow;
}

export async function getHomepageFeatures(): Promise<HomepageFeature[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase.from("homepage_features").select("*").order("sort_order");

  if (error) {
    console.error("getHomepageFeatures error:", error.message);
    return [];
  }

  return (data as HomepageFeatureRow[]).map((row) => ({ id: row.id, title: row.title, description: row.description, icon: row.icon }));
}
