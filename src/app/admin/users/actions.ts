"use server";

import { revalidatePath } from "next/cache";
import { requireSuperAdmin } from "@/lib/supabase/require-role";
import { createAdminClient } from "@/lib/supabase/admin";
import type { AdminRole } from "@/lib/permissions";

interface ActionResult {
  error?: string;
}

function isValidRole(role: string): role is AdminRole {
  return role === "super_admin" || role === "kejur" || role === "wakur";
}

export async function createAdminUser(input: {
  email: string;
  password: string;
  fullName: string;
  role: string;
}): Promise<ActionResult> {
  const guard = await requireSuperAdmin();
  if ("error" in guard) return { error: guard.error };

  const email = input.email.trim().toLowerCase();
  const fullName = input.fullName.trim();

  if (!email) return { error: "Email wajib diisi." };
  if (!fullName) return { error: "Nama wajib diisi." };
  if (input.password.length < 8) return { error: "Kata sandi minimal 8 karakter." };
  if (!isValidRole(input.role)) return { error: "Role tidak valid." };

  const adminClient = createAdminClient();

  const { data: created, error: createError } = await adminClient.auth.admin.createUser({
    email,
    password: input.password,
    email_confirm: true,
  });

  if (createError || !created.user) {
    return { error: createError?.message ?? "Gagal membuat akun." };
  }

  const { error: profileError } = await adminClient
    .from("admin_profiles")
    .insert({ id: created.user.id, full_name: fullName, role: input.role });

  if (profileError) {
    // Rollback biar nggak ada akun auth nyangkut tanpa baris admin_profiles.
    await adminClient.auth.admin.deleteUser(created.user.id);
    return { error: profileError.message };
  }

  revalidatePath("/admin/users");
  return {};
}

export async function updateAdminUser(input: {
  id: string;
  email: string;
  fullName: string;
  role: string;
}): Promise<ActionResult> {
  const guard = await requireSuperAdmin();
  if ("error" in guard) return { error: guard.error };

  if (input.id === guard.admin.id) {
    return { error: "Role akun sendiri nggak bisa diubah dari sini — minta bantuan Super Admin lain kalau perlu." };
  }

  const email = input.email.trim().toLowerCase();
  const fullName = input.fullName.trim();

  if (!email) return { error: "Email wajib diisi." };
  if (!fullName) return { error: "Nama wajib diisi." };
  if (!isValidRole(input.role)) return { error: "Role tidak valid." };

  const adminClient = createAdminClient();

  const { error: authUpdateError } = await adminClient.auth.admin.updateUserById(input.id, { email });
  if (authUpdateError) return { error: authUpdateError.message };

  const { error: profileError } = await adminClient
    .from("admin_profiles")
    .update({ full_name: fullName, role: input.role })
    .eq("id", input.id);

  if (profileError) return { error: profileError.message };

  revalidatePath("/admin/users");
  revalidatePath(`/admin/users/${input.id}/edit`);
  return {};
}

export async function resetAdminUserPassword(input: { id: string; newPassword: string }): Promise<ActionResult> {
  const guard = await requireSuperAdmin();
  if ("error" in guard) return { error: guard.error };

  if (input.newPassword.length < 8) return { error: "Kata sandi minimal 8 karakter." };

  const adminClient = createAdminClient();
  const { error } = await adminClient.auth.admin.updateUserById(input.id, { password: input.newPassword });

  if (error) return { error: error.message };
  return {};
}

export async function deleteAdminUser(input: { id: string }): Promise<ActionResult> {
  const guard = await requireSuperAdmin();
  if ("error" in guard) return { error: guard.error };

  if (input.id === guard.admin.id) {
    return { error: "Nggak bisa hapus akun sendiri." };
  }

  const adminClient = createAdminClient();

  const { data: targetProfile } = await adminClient
    .from("admin_profiles")
    .select("role")
    .eq("id", input.id)
    .single();

  // Jaga supaya nggak ada sekolah yang kehilangan akses karena Super
  // Admin terakhirnya kehapus.
  if (targetProfile?.role === "super_admin") {
    const { count } = await adminClient
      .from("admin_profiles")
      .select("id", { count: "exact", head: true })
      .eq("role", "super_admin");

    if ((count ?? 0) <= 1) {
      return { error: "Nggak bisa hapus Super Admin terakhir." };
    }
  }

  const { error } = await adminClient.auth.admin.deleteUser(input.id);
  if (error) return { error: error.message };

  // Jaga-jaga kalau belum ada ON DELETE CASCADE di skema DB.
  await adminClient.from("admin_profiles").delete().eq("id", input.id);

  revalidatePath("/admin/users");
  return {};
}
