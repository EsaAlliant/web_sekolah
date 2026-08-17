export interface AgendaEvent {
  id: string;
  title: string;
  startDate: string;
  endDate?: string;
  time?: string;
  location: string;
  category: string;
  description: string;
}
