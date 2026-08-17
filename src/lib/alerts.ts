// Helper tipis di atas SweetAlert2, dipanggil dari komponen "use client".
// Import "sweetalert2"-nya sengaja dynamic (di dalam function) supaya
// nggak numpang kebawa ke bundle server / halaman yang nggak butuh.

function themeColor(varName: string, fallback: string) {
  if (typeof window === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  return value || fallback;
}

async function loadSwal() {
  const { default: Swal } = await import("sweetalert2");
  return Swal;
}

export async function confirmDelete(itemLabel: string, description = "Tindakan ini tidak bisa dibatalkan.") {
  const Swal = await loadSwal();
  const result = await Swal.fire({
    title: `Hapus "${itemLabel}"?`,
    text: description,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Ya, hapus",
    cancelButtonText: "Batal",
    confirmButtonColor: "#dc3545",
    cancelButtonColor: themeColor("--school-sidebar", "#142A42"),
    reverseButtons: true,
    focusCancel: true,
  });

  return result.isConfirmed;
}

export async function showSuccess(title: string, text?: string) {
  const Swal = await loadSwal();
  await Swal.fire({
    title,
    text,
    icon: "success",
    confirmButtonText: "OK",
    confirmButtonColor: themeColor("--school-primary", "#0E6B64"),
    timer: 2200,
    timerProgressBar: true,
  });
}

export async function showError(title: string, text?: string) {
  const Swal = await loadSwal();
  await Swal.fire({
    title,
    text,
    icon: "error",
    confirmButtonText: "OK",
    confirmButtonColor: themeColor("--school-primary", "#0E6B64"),
  });
}
