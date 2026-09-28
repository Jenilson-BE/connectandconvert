import { AdminPageForm } from "@/components/admin/AdminPageForm";
import { requireAdminPage } from "@/lib/admin-guard";

export const metadata = {
  title: "Create New Landing Page | Admin",
};

// Admin-only screen; must never be prerendered or cached.
export const dynamic = "force-dynamic";

export default async function CreateLandingPage() {
  await requireAdminPage();

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <AdminPageForm isEditing={false} />
    </div>
  );
}
