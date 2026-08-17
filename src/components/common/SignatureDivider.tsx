// Elemen signature situs ini: garis pemisah antar-section yang dimulai
// sebagai jalur sirkuit bersudut siku (mewakili TKJT / jaringan) di kiri,
// lalu berangsur berubah jadi kurva detak jantung/pulse (mewakili
// Layanan Kesehatan) di kanan. Satu garis, dua jurusan, satu identitas.
export function SignatureDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`signature-divider ${className}`.trim()} aria-hidden="true">
      <svg fill="none" preserveAspectRatio="none" viewBox="0 0 1200 80">
        <path
          d="M0,40 L100,40 L100,20 L220,20 L220,60 L340,60 L340,40 L480,40
             C520,40 530,40 545,40 L560,40 L575,10 L590,70 L605,25 L620,40
             C700,40 700,25 780,25 C860,25 860,40 940,40
             C1020,40 1020,32 1100,32 C1150,32 1150,40 1200,40"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.5"
        />
        <circle cx="100" cy="20" r="4" fill="currentColor" />
        <circle cx="220" cy="60" r="4" fill="currentColor" />
        <circle cx="340" cy="40" r="4" fill="currentColor" />
      </svg>
    </div>
  );
}
