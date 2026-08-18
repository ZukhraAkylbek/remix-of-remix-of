import { publicClient } from "./specialties.server";

export type ServicePage = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  icon: string | null;
  image_url: string | null;
  meta_title: string | null;
  meta_description: string | null;
  sort_order: number;
};

export type ServiceBlock = {
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

export type ServiceDoctor = {
  slug: string;
  full_name: string;
  job_title: string | null;
  photo_url: string | null;
  bio: string | null;
  experience_years: number | null;
};

const PAGE_SELECT =
  "id, slug, title, summary, icon, image_url, meta_title, meta_description, sort_order";
const BLOCK_SELECT =
  "id, key, title, subtitle, body, image_url, primary_label, primary_url, secondary_label, secondary_url, sort_order";

export async function listServicePages(): Promise<ServicePage[]> {
  const { data, error } = await publicClient()
    .from("service_pages")
    .select(PAGE_SELECT)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getServicePage(
  slug: string,
): Promise<(ServicePage & { blocks: ServiceBlock[]; doctors: ServiceDoctor[] }) | null> {
  const supabase = publicClient();

  const { data: page, error } = await supabase
    .from("service_pages")
    .select(PAGE_SELECT)
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();
  if (error) throw error;
  if (!page) return null;

  const { data: blocks } = await supabase
    .from("service_blocks")
    .select(BLOCK_SELECT)
    .eq("service_id", page.id)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  const list = blocks ?? [];
  const doctorSlugs = (list.find((b) => b.key === "doctors")?.body ?? "")
    .split(/[\n,]/)
    .map((value) => value.split(/\s+—\s+/)[0]?.trim() ?? "")
    .filter(Boolean);

  let doctors: ServiceDoctor[] = [];
  if (doctorSlugs.length > 0) {
    const { data } = await supabase
      .from("doctors")
      .select("slug, full_name, job_title, photo_url, bio, experience_years")
      .in("slug", doctorSlugs)
      .eq("is_active", true);
    doctors = data ?? [];
  }

  return { ...page, blocks: list, doctors };
}
