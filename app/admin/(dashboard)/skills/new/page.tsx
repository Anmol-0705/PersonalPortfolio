import type { Metadata } from "next";
import { SkillForm } from "@/components/admin/skill-form";
import { AdminNav } from "@/components/admin/admin-nav";
import { getAllSkills } from "@/lib/skills";

export const metadata: Metadata = {
  title: "New Skill",
  robots: { index: false, follow: false },
};

export default async function NewSkillPage() {
  const skills = await getAllSkills();

  return (
    <div className="flex flex-col gap-6">
      <AdminNav current="skills" />
      <h1 className="font-sans text-3xl font-bold">New Skill</h1>
      <SkillForm mode="create" nextSortOrder={skills.length} />
    </div>
  );
}
