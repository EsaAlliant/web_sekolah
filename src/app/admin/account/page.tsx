import { redirect } from "next/navigation";
import { ChangePasswordForm } from "@/components/directory/ChangePasswordForm";
import { createServerClient } from "@/lib/supabase/server";
import { ROLE_LABELS, type AdminRole } from "@/lib/permissions";

export default async function AdminAccountPage() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase.from("admin_profiles").select("role, full_name").eq("id", user.id).single();
  const role = (profile?.role ?? "super_admin") as AdminRole;

  return (
    <div>
      <h1 className="h4 mb-4">Akun Saya</h1>

      <div className="row g-4">
        <div className="col-lg-5">
          <div className="admin-stat-card text-start">
            <h2 className="h6 mb-3">Info Akun</h2>
            <dl className="mb-0">
              <dt className="small text-muted-strong">Nama</dt>
              <dd>{profile?.full_name || "-"}</dd>
              <dt className="small text-muted-strong">Email</dt>
              <dd>{user.email}</dd>
              <dt className="small text-muted-strong mb-1">Role</dt>
              <dd className="mb-0"><span className="staff-tag">{ROLE_LABELS[role]}</span></dd>
            </dl>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="admin-stat-card text-start">
            <h2 className="h6 mb-3">Ganti Kata Sandi</h2>
            <ChangePasswordForm email={user.email ?? ""} />
          </div>
        </div>
      </div>
    </div>
  );
}
