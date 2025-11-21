import { create } from 'zustand';
import { Ticket, Column, AppState, DEFAULT_COLUMNS } from './types';
import { storage } from './storage';

export const useStore = create<AppState>((set, get) => ({
  tickets: [],
  columns: DEFAULT_COLUMNS,

  initializeFromStorage: () => {
    const storedTickets = storage.getTickets();
    const storedColumns = storage.getColumns();
    
    set({
      tickets: storedTickets,
      columns: storedColumns || DEFAULT_COLUMNS,
    });
  },

  addTicket: (ticketData) => {
    const newTicket: Ticket = {
      ...ticketData,
      id: `ticket-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    set((state) => {
      const updatedTickets = [...state.tickets, newTicket];
      storage.setTickets(updatedTickets);
      return { tickets: updatedTickets };
    });
  },

  updateTicket: (id, updates) => {
    set((state) => {
      const updatedTickets = state.tickets.map((ticket) =>
        ticket.id === id
          ? { ...ticket, ...updates, updatedAt: new Date().toISOString() }
          : ticket
      );
      storage.setTickets(updatedTickets);
      return { tickets: updatedTickets };
    });
  },

  deleteTicket: (id) => {
    set((state) => {
      const updatedTickets = state.tickets.filter((ticket) => ticket.id !== id);
      storage.setTickets(updatedTickets);
      return { tickets: updatedTickets };
    });
  },

  addColumn: (columnData) => {
    const newColumn: Column = {
      ...columnData,
      id: `column-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      order: get().columns.length,
    };

    set((state) => {
      const updatedColumns = [...state.columns, newColumn];
      storage.setColumns(updatedColumns);
      return { columns: updatedColumns };
    });
  },

  updateColumn: (id, updates) => {
    set((state) => {
      const updatedColumns = state.columns.map((column) =>
        column.id === id ? { ...column, ...updates } : column
      );
      storage.setColumns(updatedColumns);
      return { columns: updatedColumns };
    });
  },

  deleteColumn: (id) => {
    set((state) => {
      const updatedColumns = state.columns.filter((column) => column.id !== id);
      const reorderedColumns = updatedColumns.map((col, index) => ({
        ...col,
        order: index,
      }));
      storage.setColumns(reorderedColumns);
      return { columns: reorderedColumns };
    });
  },

  reorderColumns: (columns) => {
    const reorderedColumns = columns.map((col, index) => ({
      ...col,
      order: index,
    }));
    set({ columns: reorderedColumns });
    storage.setColumns(reorderedColumns);
  },

  moveTicket: (ticketId, newStatus) => {
    get().updateTicket(ticketId, { status: newStatus });
  },
}));

