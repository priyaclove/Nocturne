import {
  Shirt,
  Footprints,
  Gem,
  Sparkles,
  Armchair,
  Coffee,
  type LucideIcon,
} from "lucide-react";
import type { DepartmentSlug } from "./types";

/** Department → icon. Presentational only; kept out of the data layer. */
export const departmentIcons: Record<DepartmentSlug, LucideIcon> = {
  apparel: Shirt,
  footwear: Footprints,
  accessories: Gem,
  beauty: Sparkles,
  home: Armchair,
  pantry: Coffee,
};
