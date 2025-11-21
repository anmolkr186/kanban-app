'use client';

import { useState, useEffect } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useStore } from '@/lib/store';
import { Column } from './Column';
import { TicketCard } from './TicketCard';
import { Ticket } from '@/lib/types';
import { CreateTicketModal } from '@/components/modals/CreateTicketModal';
import { EditTicketModal } from '@/components/modals/EditTicketModal';
import { ManageColumnsModal } from '@/components/modals/ManageColumnsModal';
import { Button } from '@/components/ui/button';
import { Plus, Settings } from 'lucide-react';

export function Board() {
  const { tickets, columns, moveTicket, initializeFromStorage } = useStore();
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [isManageColumnsOpen, setIsManageColumnsOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initializeFromStorage();
    setIsInitialized(true);
  }, [initializeFromStorage]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const ticket = tickets.find((t) => t.id === event.active.id);
    setActiveTicket(ticket || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTicket(null);

    if (!over) return;

    const ticketId = active.id as string;
    const newStatus = over.id as string;

    // Check if dropped on a column
    const isColumn = columns.some((col) => col.id === newStatus);
    if (isColumn) {
      moveTicket(ticketId, newStatus);
    }
  };

  const handleTicketClick = (ticket: Ticket) => {
    setEditingTicket(ticket);
  };

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <div className="h-screen flex flex-col bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Kanban Board</h1>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsManageColumnsOpen(true)}
              >
                <Settings className="w-4 h-4 mr-2" />
                Manage Columns
              </Button>
              <Button
                size="sm"
                onClick={() => setIsCreateModalOpen(true)}
                style={{ backgroundColor: '#0E4259' }}
                className="text-white hover:opacity-90"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Ticket
              </Button>
            </div>
          </div>
        </header>

        {/* Board */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden">
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="flex gap-4 p-6 h-full">
              {columns
                .sort((a, b) => a.order - b.order)
                .map((column) => {
                  const columnTickets = tickets.filter(
                    (ticket) => ticket.status === column.id
                  );
                  return (
                    <Column
                      key={column.id}
                      column={column}
                      tickets={columnTickets}
                      onTicketClick={handleTicketClick}
                    />
                  );
                })}
            </div>

            <DragOverlay>
              {activeTicket ? (
                <div className="rotate-3 opacity-80">
                  <TicketCard ticket={activeTicket} onClick={() => {}} />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      </div>

      {/* Modals */}
      <CreateTicketModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
      
      {editingTicket && (
        <EditTicketModal
          isOpen={!!editingTicket}
          ticket={editingTicket}
          onClose={() => setEditingTicket(null)}
        />
      )}

      <ManageColumnsModal
        isOpen={isManageColumnsOpen}
        onClose={() => setIsManageColumnsOpen(false)}
      />
    </>
  );
}

