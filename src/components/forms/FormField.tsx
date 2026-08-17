import { Input } from "@/components/ui/Input";
export function FormField({ label, name }: { label: string; name: string }) { return <label className="form-label d-block">{label}<Input name={name} /></label>; }
