export interface PpdbTimelineItem {
  label: string;
  date: string;
}

export interface PpdbInfo {
  period: string;
  status: "draft" | "open" | "closed";
  quota: string;
  fee: string;
  requirements: string[];
  timeline: PpdbTimelineItem[];
  steps: string[];
}
