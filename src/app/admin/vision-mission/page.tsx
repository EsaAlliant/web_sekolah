import { VisionMissionForm } from "@/components/directory/VisionMissionForm";
import { getVisionMission } from "@/services/about.service";

export default async function AdminVisionMissionPage() {
  const visionMission = await getVisionMission();
  return (
    <div>
      <h1 className="h4 mb-1">Visi dan Misi</h1>
      <p className="text-muted-strong mb-4">Konten ini tampil di halaman /about/vision-mission.</p>
      <VisionMissionForm initialData={visionMission} />
    </div>
  );
}
