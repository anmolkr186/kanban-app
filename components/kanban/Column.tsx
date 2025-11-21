'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Column as ColumnType, Ticket } from '@/lib/types';
import { TicketCard } from './TicketCard';
import { cn } from '@/lib/utils';

interface ColumnProps {
  column: ColumnType;
  tickets: Ticket[];
  onTicketClick: (ticket: Ticket) => void;
}

export function Column({ column, tickets, onTicketClick }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  const ticketIds = tickets.map((t) => t.id);

  return (
    <div className="flex flex-col w-80 flex-shrink-0">
      {/* Column Header - Figma inspired design */}
      <div
        className="rounded-t-lg px-4 py-3 border-b"
        style={{ backgroundColor: column.color }}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm text-gray-700">{column.name}</h3>
          <span className="text-xs font-medium text-gray-500 bg-white/60 px-2 py-1 rounded">
            {tickets.length}
          </span>
        </div>
      </div>

      {/* Column Content */}
      <div
        ref={setNodeRef}
        className={cn(
          'flex-1 p-3 space-y-2 min-h-[200px] rounded-b-lg transition-colors',
          'bg-white border border-t-0 border-gray-200',
          isOver && 'bg-gray-50 ring-2 ring-blue-300'
        )}
      >
        <SortableContext items={ticketIds} strategy={verticalListSortingStrategy}>
          {tickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              onClick={() => onTicketClick(ticket)}
            />
          ))}
        </SortableContext>
        
        {tickets.length === 0 && (
          <div className="flex items-center justify-center h-32 text-sm text-gray-400">
            No tickets
          </div>
        )}
      </div>
    </div>
  );
}

