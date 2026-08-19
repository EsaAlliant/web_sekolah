import type { LegalSection } from "@/types/legal";
import type { WebsiteSettings } from "@/types/settings";

// Placeholder yang bisa dipakai admin di isi bagian, otomatis diganti data
// sekolah asli dari menu Pengaturan Situs pas ditampilkan ke pengunjung.
function interpolate(text: string, settings: WebsiteSettings) {
  return text
    .replace(/\{\{name\}\}/g, settings.name)
    .replace(/\{\{shortName\}\}/g, settings.shortName)
    .replace(/\{\{email\}\}/g, settings.email);
}

// Baris yang diawali "- " dianggap poin daftar dan dikelompokkan jadi <ul>,
// baris lain jadi paragraf biasa. Sederhana tapi cukup buat kebutuhan
// halaman legal (nggak perlu rich text editor penuh).
function SectionBody({ body }: { body: string }) {
  const lines = body.split("\n");
  const blocks: React.ReactNode[] = [];
  let listBuffer: string[] = [];

  const flushList = () => {
    if (listBuffer.length > 0) {
      blocks.push(
        <ul className="text-muted-strong" key={`list-${blocks.length}`}>
          {listBuffer.map((item, i) => <li key={i}>{item}</li>)}
        </ul>,
      );
      listBuffer = [];
    }
  };

  lines.forEach((rawLine, i) => {
    const trimmed = rawLine.trim();
    if (trimmed.startsWith("- ")) {
      listBuffer.push(trimmed.slice(2));
      return;
    }
    flushList();
    if (trimmed) blocks.push(<p className="text-muted-strong" key={`p-${i}`}>{trimmed}</p>);
  });
  flushList();

  return <>{blocks}</>;
}

export function LegalContent({ sections, settings }: { sections: LegalSection[]; settings: WebsiteSettings }) {
  if (sections.length === 0) {
    return <p className="text-muted-strong">Konten belum tersedia.</p>;
  }

  return (
    <>
      {sections.map((section, index) => (
        <div key={section.id ?? index}>
          <h2 className="h5 mt-4">{index + 1}. {interpolate(section.heading, settings)}</h2>
          <SectionBody body={interpolate(section.body, settings)} />
        </div>
      ))}
    </>
  );
}
