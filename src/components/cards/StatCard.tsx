import { Card } from "@/components/ui/Card";
export function StatCard({ label, value }: { label: string; value: string }) { return <Card><p className="mb-1 text-muted-strong">{label}</p><strong>{value}</strong></Card>; }
