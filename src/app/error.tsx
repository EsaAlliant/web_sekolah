"use client";

import { ErrorState } from "@/components/common/EmptyState/ErrorState";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return <ErrorState onRetry={reset} />;
}
