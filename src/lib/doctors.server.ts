import { publicClient } from "./specialties.server";

export type DoctorListItem = {
  slug: string;
  full_name: string;
  job_title: string | null;
  photo_url: string | null;
  bio: string | null;
  experience_years: number | null;
  education: string | null;
  specialty_name: string | null;
  specialty_slug: string | null;
};

export async function listAllDoctors(): Promise<DoctorListItem[]> {
  const supabase = publicClient();

  const { data, error } = await supabase
    .from("doctors")
    .select(
      "slug, full_name, job_title, photo_url, bio, experience_years, education, specialty_id, specialties(slug, name)",
    )
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) throw error;

  return (data ?? []).map((doctor) => ({
    slug: doctor.slug,
    full_name: doctor.full_name,
    job_title: doctor.job_title,
    photo_url: doctor.photo_url,
    bio: doctor.bio,
    experience_years: doctor.experience_years,
    education: doctor.education,
    specialty_name: doctor.specialties?.name ?? null,
    specialty_slug: doctor.specialties?.slug ?? null,
  }));
}
