import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { canAccessPath, type AdminRole } from "@/lib/permissions";

const ABSOLUTE_SESSION_MS = 24 * 60 * 60 * 1000; // 1 hari

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
        },
      },
    },
  );

  // Penting: jangan hapus baris ini. auth.getUser() me-refresh token session
  // yang hampir kedaluwarsa, dan menuliskannya ulang ke cookie response.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname.startsWith("/auth/login");

  // Belum login tapi coba akses /admin -> lempar ke halaman login
  if (isAdminRoute && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/auth/login";
    return NextResponse.redirect(loginUrl);
  }

  // Batas sesi absolut: walau cookie Supabase masih valid (misal tab
  // ditutup lalu dibuka lagi berhari-hari kemudian), tetap paksa login
  // ulang setelah ABSOLUTE_SESSION_MS sejak login terakhir.
  if (isAdminRoute && user) {
    const loginAtCookie = request.cookies.get("admin_login_at")?.value;
    const loginAt = loginAtCookie ? Number(loginAtCookie) : null;
    const expired = !loginAt || Date.now() - loginAt > ABSOLUTE_SESSION_MS;

    if (expired) {
      await supabase.auth.signOut();
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/auth/login";
      loginUrl.searchParams.set("reason", "expired");
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete("admin_login_at");
      return response;
    }
  }

  // Batas akses per role (Super Admin, Kepala Jurusan, Wakil Kurikulum).
  // Kalau belum punya baris di admin_profiles, dianggap super_admin —
  // supaya akun admin lama yang belum di-assign role tetap bisa akses
  // semua seperti biasa (role terbatas harus di-assign eksplisit).
  if (isAdminRoute && user) {
    const { data: profile } = await supabase.from("admin_profiles").select("role").eq("id", user.id).single();
    const role = (profile?.role ?? "super_admin") as AdminRole;

    if (!canAccessPath(role, pathname)) {
      const dashboardUrl = request.nextUrl.clone();
      dashboardUrl.pathname = "/admin/dashboard";
      dashboardUrl.searchParams.set("denied", "1");
      return NextResponse.redirect(dashboardUrl);
    }
  }

  // Sudah login tapi buka halaman login -> lempar ke dashboard admin
  if (isLoginRoute && user) {
    const adminUrl = request.nextUrl.clone();
    adminUrl.pathname = "/admin";
    return NextResponse.redirect(adminUrl);
  }

  return supabaseResponse;
}
