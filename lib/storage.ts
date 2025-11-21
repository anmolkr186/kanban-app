import { Ticket, Column } from './types';

const STORAGE_KEYS = {
  TICKETS: 'kanban-tickets',
  COLUMNS: 'kanban-columns',
} as const;

export const storage = {
  getTickets: (): Ticket[] => {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TICKETS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading tickets from storage:', error);
      return [];
    }
  },

  setTickets: (tickets: Ticket[]): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(tickets));
    } catch (error) {
      console.error('Error saving tickets to storage:', error);
    }
  },

  getColumns: (): Column[] | null => {
    if (typeof window === 'undefined') return null;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COLUMNS);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error loading columns from storage:', error);
      return null;
    }
  },

  setColumns: (columns: Column[]): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.COLUMNS, JSON.stringify(columns));
    } catch (error) {
      console.error('Error saving columns to storage:', error);
    }
  },

  exportData: () => {
    const tickets = storage.getTickets();
    const columns = storage.getColumns();
    return {
      tickets,
      columns,
      exportedAt: new Date().toISOString(),
    };
  },

  importData: (data: { tickets?: Ticket[]; columns?: Column[] }) => {
    if (data.tickets) {
      storage.setTickets(data.tickets);
    }
    if (data.columns) {
      storage.setColumns(data.columns);
    }
  },
};

