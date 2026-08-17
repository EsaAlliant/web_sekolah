import { notFound, redirect } from "next/navigation";
import { AdminUserForm } from "@/components/directory/AdminUserForm";
import { ResetAdminPasswordForm } from "@/components/directory/ResetAdminPasswordForm";
import { createServerClient } from "@/lib/supabase/server";
import { getAdminUserById } from "@/services/admin-user.service";
import type { AdminRole } from "@/lib/permissions";

export default async function EditAdminUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase.from("admin_profiles").select("role").eq("id", user.id).single();
  const role = (profile?.role ?? "super_admin") as AdminRole;
  if (role !== "super_admin") redirect("/admin/dashboard?denied=1");

  const adminUser = await getAdminUserById(id);
  if (!adminUser) notFound();

  const isSelf = adminUser.id === user.id;

  return (
    <div>
      <h1 className="h4 mb-4">Edit Admin</h1>

      <div className="row g-4">
        <div className="col-lg-7">
          <div className="admin-stat-card text-start">
            {isSelf ? (
              <p className="text-muted-strong small mb-0">
                Role &amp; email akun sendiri nggak bisa diubah dari sini. Buka <strong>Akun Saya</strong> untuk ganti kata sandi.
              </p>
            ) : (
              <AdminUserForm initialData={adminUser} />
            )}
          </div>
        </div>

        {!isSelf && (
          <div className="col-lg-5">
            <div className="admin-stat-card text-start">
              <h2 className="h6 mb-3">Reset Kata Sandi</h2>
              <ResetAdminPasswordForm userId={adminUser.id} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
