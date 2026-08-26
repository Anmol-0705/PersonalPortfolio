import type { Metadata } from "next";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { NeoCard } from "@/components/ui/neo-card";
import { neoButtonClasses } from "@/components/ui/neo-button";
import { AdminNav } from "@/components/admin/admin-nav";
import { DeleteSkillButton } from "@/components/admin/delete-skill-button";
import { getAllSkills } from "@/lib/skills";

export const metadata: Metadata = {
  title: "Manage Skills",
  robots: { index: false, follow: false },
};

export default async function AdminSkillsPage() {
  const skills = await getAllSkills();

  return (
    <div className="flex flex-col gap-6">
      <AdminNav current="skills" />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-sans text-3xl font-bold">Skills</h1>
        <Link href="/admin/skills/new" className={neoButtonClasses("primary")}>
          + Add Skill
        </Link>
      </div>

      {skills.length === 0 ? (
        <NeoCard>
          <p className="font-sans text-muted">
            No skills yet. Add your first one.
          </p>
        </NeoCard>
      ) : (
        <div className="flex flex-col gap-4">
          {skills.map((skill) => (
            <NeoCard
              key={skill.id}
              className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <h2 className="font-sans text-lg font-bold">{skill.name}</h2>
                <p className="mt-1 font-sans text-sm text-muted">
                  {skill.category} · order {skill.order}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={`/admin/skills/${skill.id}/edit`}
                  className={neoButtonClasses("secondary", "text-sm")}
                >
                  <Pencil className="h-4 w-4" aria-hidden="true" />
                  Edit
                </Link>
                <DeleteSkillButton id={skill.id} name={skill.name} />
              </div>
            </NeoCard>
          ))}
        </div>
      )}
    </div>
  );
}
