import { supabase } from "@/integrations/supabase/client";

export type Popup = {
  id: string;
  title: string;
  body: string | null;
  offer_note: string | null;
  image_url: string | null;
  button_text: string | null;
  button_url: string | null;
  success_text: string | null;
  show_form: boolean;
  delay_seconds: number;
  is_active: boolean;
  sort_order: number;
};

const COLUMNS =
  "id, title, body, offer_note, image_url, button_text, button_url, success_text, show_form, delay_seconds, is_active, sort_order";

export async function fetchActivePopup(): Promise<Popup | null> {
  const { data, error } = await supabase
    .from("popups")
    .select(COLUMNS)
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return (data as Popup | null) ?? null;
}

export async function fetchAllPopups(): Promise<Popup[]> {
  const { data, error } = await supabase
    .from("popups")
    .select(COLUMNS)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data ?? []) as Popup[];
}

export type Lead = {
  id: string;
  name: string;
  phone: string;
  comment: string | null;
  source: string | null;
  is_processed: boolean;
  created_at: string;
};

export async function fetchLeads(): Promise<Lead[]> {
  const { data, error } = await supabase
    .from("leads")
    .select("id, name, phone, comment, source, is_processed, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) throw error;
  return (data ?? []) as Lead[];
}

export async function submitLead(input: {
  name: string;
  phone: string;
  comment?: string;
  source?: string;
  popup_id?: string | null;
}) {
  const { error } = await supabase.from("leads").insert({
    name: input.name.trim().slice(0, 100),
    phone: input.phone.trim().slice(0, 40),
    comment: input.comment?.trim().slice(0, 1000) || null,
    source: input.source ?? null,
    popup_id: input.popup_id ?? null,
  });
  if (error) throw new Error(error.message);
}
