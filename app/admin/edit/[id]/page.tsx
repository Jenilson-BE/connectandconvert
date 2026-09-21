import { notFound } from "next/navigation";
import { getLandingPageById } from "@/lib/landing-storage";
import { AdminPageForm } from "@/components/admin/AdminPageForm";

export const metadata = {
  title: "Edit Landing Page | Admin",
};

export default async function EditLandingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const page = await getLandingPageById(id);

  if (!page) {
    notFound();
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <AdminPageForm initialData={page} isEditing={true} />
    </div>
  );
}
