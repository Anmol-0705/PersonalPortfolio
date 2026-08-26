import type { Metadata } from "next";
import { ProjectForm } from "@/components/admin/project-form";

export const metadata: Metadata = {
  title: "New Project",
  robots: { index: false, follow: false },
};

export default function NewProjectPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-sans text-3xl font-bold">New Project</h1>
      <ProjectForm mode="create" />
    </div>
  );
}
