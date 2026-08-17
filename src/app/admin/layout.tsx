import { redirect } from "next/navigation";
import { Header } from "@/components/layout/Header/Header";
import { IdleLogout } from "@/components/directory/IdleLogout";
import { RequireFreshLogin } from "@/components/directory/RequireFreshLogin";
import { Sidebar } from "@/components/layout/Sidebar/Sidebar";
import { createServerClient } from "@/lib/supabase/server";
import { ROLE_LABELS, type AdminRole } from "@/lib/permissions";

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Lapisan pengaman kedua di samping middleware — kalau entah bagaimana
  // lolos dari middleware, halaman admin tetap tidak akan pernah dirender
  // tanpa user yang valid.
  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase.from("admin_profiles").select("role").eq("id", user.id).single();
  const role = (profile?.role ?? "super_admin") as AdminRole;

  return (
    <div className="admin-shell">
      <RequireFreshLogin />
      <IdleLogout />
      <Sidebar role={role} />
      <div className="admin-content">
        <Header roleLabel={ROLE_LABELS[role]} userEmail={user.email} />
        <main className="container-fluid py-4">{children}</main>
      </div>
    </div>
  );
}
