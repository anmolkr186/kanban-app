export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: string; // column ID
  priority: Priority;
  assignee: string;
  labels: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Column {
  id: string;
  name: string;
  color: string;
  order: number;
}

export interface AppState {
  tickets: Ticket[];
  columns: Column[];
  addTicket: (ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTicket: (id: string, updates: Partial<Ticket>) => void;
  deleteTicket: (id: string) => void;
  addColumn: (column: Omit<Column, 'id' | 'order'>) => void;
  updateColumn: (id: string, updates: Partial<Column>) => void;
  deleteColumn: (id: string) => void;
  reorderColumns: (columns: Column[]) => void;
  moveTicket: (ticketId: string, newStatus: string) => void;
  initializeFromStorage: () => void;
}

export const DEFAULT_COLUMNS: Column[] = [
  { id: 'backlog', name: 'Backlog', color: '#E3E8FF', order: 0 },
  { id: 'todo', name: 'To Do', color: '#FFE8F5', order: 1 },
  { id: 'in-progress', name: 'In Progress', color: '#FFF4E3', order: 2 },
  { id: 'in-review', name: 'In Review', color: '#E8F5FF', order: 3 },
  { id: 'done', name: 'Done', color: '#E8FFE8', order: 4 },
];

export const PRIORITY_COLORS: Record<Priority, string> = {
  low: 'bg-gray-100 text-gray-700',
  medium: 'bg-blue-100 text-blue-700',
  high: 'bg-orange-100 text-orange-700',
  urgent: 'bg-red-100 text-red-700',
};

