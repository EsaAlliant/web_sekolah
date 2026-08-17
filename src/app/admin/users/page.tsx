import Link from "next/link";
import { redirect } from "next/navigation";
import { DeleteAdminUserButton } from "@/components/directory/DeleteAdminUserButton";
import { createServerClient } from "@/lib/supabase/server";
import { getAdminUsers } from "@/services/admin-user.service";
import { ROLE_LABELS, type AdminRole } from "@/lib/permissions";

export default async function AdminUsersPage() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase.from("admin_profiles").select("role").eq("id", user.id).single();
  const role = (profile?.role ?? "super_admin") as AdminRole;

  // Lapisan pengaman kedua di samping middleware — kalau entah bagaimana
  // lolos, halaman ini tetap nggak akan nampilin data akun admin ke role
  // selain Super Admin.
  if (role !== "super_admin") {
    redirect("/admin/dashboard?denied=1");
  }

  const admins = await getAdminUsers();

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h1 className="h4 mb-0">Pengguna Admin</h1>
        <Link className="btn btn-primary btn-sm" href="/admin/users/new">
          <i aria-hidden="true" className="bi bi-plus-lg" /> Tambah Admin
        </Link>
      </div>

      {admins.length === 0 ? (
        <p className="text-muted-strong">Belum ada data.</p>
      ) : (
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Nama</th>
                <th>Email</th>
                <th>Role</th>
                <th style={{ width: "14rem" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.id}>
                  <td>{admin.fullName || "-"}</td>
                  <td>{admin.email}</td>
                  <td><span className="staff-tag">{ROLE_LABELS[admin.role]}</span></td>
                  <td>
                    <div className="d-flex gap-2">
                      <Link className="btn btn-outline-primary btn-sm" href={`/admin/users/${admin.id}/edit`}>
                        <i aria-hidden="true" className="bi bi-pencil" /> Edit
                      </Link>
                      <DeleteAdminUserButton disabled={admin.id === user.id} id={admin.id} itemLabel={admin.fullName || admin.email} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
