export interface HistoryMilestone { year: string; title: string; description: string; }
export interface HistoryContent { intro: string; milestones: HistoryMilestone[]; }

export interface MissionValue { label: string; icon: string; }
export interface VisionMissionContent { vision: string; missions: string[]; values: MissionValue[]; }

export interface PrincipalContent { name: string; positionPrefix: string; quote: string; emailPrefix: string; messages: string[]; closing: string; photoUrl?: string; }
