import { createClient } from "@/lib/supabase/server";
import { variantForCategory } from "@/lib/skill-categories";
import type { SkillRow } from "@/types/supabase";
import type { Skill, SkillGroup } from "@/types/skill";

function mapRowToSkill(row: SkillRow): Skill {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    order: row.sort_order,
  };
}

/**
 * Groups a sort_order-ordered flat list into category groups, in the
 * order each category is first encountered. This reconstructs both
 * "category display order" and "skill order within a category" from a
 * single sort_order column — no separate category-ordering column
 * needed. Skills belonging to the same category are grouped together
 * even if their sort_order values happen to interleave with another
 * category's.
 */
function groupByCategory(skills: Skill[]): SkillGroup[] {
  const groups: SkillGroup[] = [];
  const indexByCategory = new Map<string, number>();

  for (const skill of skills) {
    let index = indexByCategory.get(skill.category);
    if (index === undefined) {
      index = groups.length;
      indexByCategory.set(skill.category, index);
      groups.push({
        label: skill.category,
        variant: variantForCategory(skill.category),
        skills: [],
      });
    }
    groups[index].skills.push(skill.name);
  }

  return groups;
}

/** Admin-only raw list, ordered for the admin skills table. */
export async function getAllSkills(): Promise<Skill[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true });

  if (error) {
    console.error("[getAllSkills] Supabase query error:", error);
    return [];
  }
  return (data ?? []).map(mapRowToSkill);
}

/** Public homepage/terminal shape: skills grouped by category. */
export async function getSkillGroups(): Promise<SkillGroup[]> {
  return groupByCategory(await getAllSkills());
}

export async function getSkillById(id: string): Promise<Skill | undefined> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error(`[getSkillById] Supabase query error for "${id}":`, error);
    return undefined;
  }
  return data ? mapRowToSkill(data) : undefined;
}
