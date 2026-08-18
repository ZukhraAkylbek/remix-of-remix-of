import {
  Activity,
  Baby,
  Bug,
  Clock,
  ClipboardList,
  Droplets,
  Heart,
  Mars,
  Microscope,
  ShieldCheck,
  Stethoscope,
  Users,
  Venus,
  Wind,
  Zap,
} from "lucide-react";

const MAP = {
  heart: Heart,
  lungs: Wind,
  stomach: Droplets,
  weight: Activity,
  activity: Activity,
  thyroid: Stethoscope,
  clipboard: ClipboardList,
  energy: Zap,
  worm: Bug,
  diabetes: Microscope,
  female: Venus,
  male: Mars,
  kids: Baby,
  shield: ShieldCheck,
  users: Users,
  clock: Clock,
} as const;

/** Иконка по ключу из админки (поле «Иконка»). */
export function CheckupIcon({ name, className }: { name?: string | null; className?: string }) {
  const Icon = (name && MAP[name as keyof typeof MAP]) || Stethoscope;
  return <Icon className={className} strokeWidth={1.8} aria-hidden />;
}

export const CHECKUP_ICON_KEYS = Object.keys(MAP);
