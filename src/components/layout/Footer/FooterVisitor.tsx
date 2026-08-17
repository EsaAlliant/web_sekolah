import { LiveVisitorStats } from "@/components/common/LiveVisitorStats";
import type { VisitorStats } from "@/services/visitor.service";

export function FooterVisitor({ stats }: { stats: VisitorStats }) {
  return (
    <section>
      <h2 className="footer-heading">Statistik Pengunjung</h2>
      <LiveVisitorStats initialStats={stats} />
    </section>
  );
}
