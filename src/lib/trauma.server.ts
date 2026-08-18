import { publicClient } from "./specialties.server";

export type TraumaSection = {
  id: string;
  key: string;
  title: string;
  subtitle: string | null;
  body: string | null;
  image_url: string | null;
  primary_label: string | null;
  primary_url: string | null;
  secondary_label: string | null;
  secondary_url: string | null;
  sort_order: number;
};

const SECTION_SELECT =
  "id, key, title, subtitle, body, image_url, primary_label, primary_url, secondary_label, secondary_url, sort_order";

export async function listTraumaSections(): Promise<TraumaSection[]> {
  const { data, error } = await publicClient()
    .from("trauma_sections")
    .select(SECTION_SELECT)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function listTraumaDoctors() {
  const supabase = publicClient();

  const { data: specialties } = await supabase
    .from("specialties")
    .select("id, slug")
    .eq("is_active", true);

  const ids = (specialties ?? []).filter((s) => /travm/i.test(s.slug)).map((s) => s.id);
  if (ids.length === 0) return [];

  const { data, error } = await supabase
    .from("doctors")
    .select("slug, full_name, job_title, photo_url, bio, experience_years")
    .in("specialty_id", ids)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}
