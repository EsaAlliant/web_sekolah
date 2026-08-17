import { EmptyState } from "./EmptyState";
export function ErrorState({ onRetry }: { onRetry?: () => void }) { return <EmptyState title="Terjadi kesalahan" description="Silakan coba lagi beberapa saat lagi." action={onRetry ? <button className="btn btn-primary" onClick={onRetry}>Coba lagi</button> : undefined} />; }
