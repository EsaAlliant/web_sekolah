import Link from "next/link";
import { EmptyState } from "@/components/common/EmptyState/EmptyState";

export default function NotFound() {
  return <EmptyState title="Halaman tidak ditemukan" description="Alamat yang Anda tuju tidak tersedia." action={<Link className="btn btn-primary" href="/">Kembali ke beranda</Link>} />;
}
