import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// PERINGATAN: client ini pakai Supabase Service Role Key dan BYPASS RLS
// sepenuhnya (termasuk bisa create/update/delete akun di auth.users).
// JANGAN PERNAH panggil createAdminClient() dari komponen "use client"
// atau file yang diimport ke komponen client — hanya boleh dipakai di
// Server Action / Route Handler / Server Component, dan HARUS selalu
// didahului pengecekan role lewat requireSuperAdmin() di
// lib/supabase/require-role.ts.
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY belum diset. Tambahkan di .env.local " +
        "(ambil dari Supabase Dashboard > Project Settings > API > service_role). " +
        "JANGAN pakai prefix NEXT_PUBLIC_ untuk key ini supaya nggak ikut ter-bundle ke browser.",
    );
  }

  return createSupabaseClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
