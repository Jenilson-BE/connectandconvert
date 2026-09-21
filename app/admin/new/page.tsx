import { AdminPageForm } from "@/components/admin/AdminPageForm";

export const metadata = {
  title: "Create New Landing Page | Admin",
};

export default function CreateLandingPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <AdminPageForm isEditing={false} />
    </div>
  );
}
