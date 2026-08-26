import type { Metadata } from "next";
import Link from "next/link";
import { SkillForm } from "@/components/admin/skill-form";
import { AdminNav } from "@/components/admin/admin-nav";
import { NeoCard } from "@/components/ui/neo-card";
import { neoButtonClasses } from "@/components/ui/neo-button";
import { getSkillById } from "@/lib/skills";

export const metadata: Metadata = {
  title: "Edit Skill",
  robots: { index: false, follow: false },
};

export default async function EditSkillPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const skill = await getSkillById(id);

  if (!skill) {
    // See app/admin/(dashboard)/projects/[id]/edit/page.tsx for why this
    // stays inside the admin layout instead of calling notFound().
    return (
      <div className="flex flex-col gap-6">
        <AdminNav current="skills" />
        <h1 className="font-sans text-3xl font-bold">Skill Not Found</h1>
        <NeoCard>
          <p className="font-sans text-muted">
            No skill exists for id <code>{id}</code>. It may have been
            deleted, or the link may be stale.
          </p>
          <Link href="/admin/skills" className={neoButtonClasses("primary", "mt-4")}>
            Back to Skills
          </Link>
        </NeoCard>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <AdminNav current="skills" />
      <h1 className="font-sans text-3xl font-bold">Edit Skill</h1>
      <SkillForm mode="edit" skill={skill} />
    </div>
  );
}
