// Mengecilkan dimensi gambar (kalau lebih besar dari maxDimension) dan
// mengompres kualitasnya sebelum diunggah, supaya foto beresolusi besar
// tidak bikin halaman publik lambat. SVG dilewati (sudah vektor, kecil).
export async function compressImage(file: File, maxDimension = 1600, quality = 0.82): Promise<File> {
  if (file.type === "image/svg+xml") {
    return file;
  }

  const bitmap = await loadImage(file);
  const { width, height } = bitmap;
  const scale = Math.min(1, maxDimension / Math.max(width, height));

  // Sudah cukup kecil, tidak perlu diproses ulang
  if (scale === 1) {
    return file;
  }

  const targetWidth = Math.round(width * scale);
  const targetHeight = Math.round(height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return file;
  }
  ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight);

  const outputType = file.type === "image/png" ? "image/png" : "image/jpeg";
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, outputType, quality));

  if (!blob) {
    return file;
  }

  const newName = file.name.replace(/\.[^.]+$/, outputType === "image/png" ? ".png" : ".jpg");
  return new File([blob], newName, { type: outputType });
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Gagal membaca gambar"));
    };
    img.src = url;
  });
}
