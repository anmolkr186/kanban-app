'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Ticket, PRIORITY_COLORS } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { GripVertical, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TicketCardProps {
  ticket: Ticket;
  onClick: () => void;
}

export function TicketCard({ ticket, onClick }: TicketCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: ticket.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card
        className={cn(
          'p-3 cursor-pointer hover:shadow-md transition-shadow group',
          isDragging && 'opacity-50 shadow-lg'
        )}
        onClick={onClick}
      >
        <div className="flex items-start gap-2">
          {/* Drag Handle */}
          <button
            {...listeners}
            className="mt-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical className="w-4 h-4" />
          </button>

          <div className="flex-1 min-w-0">
            {/* Title */}
            <h4 className="font-medium text-sm text-gray-900 mb-2 line-clamp-2">
              {ticket.title}
            </h4>

            {/* Description */}
            {ticket.description && (
              <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                {ticket.description}
              </p>
            )}

            {/* Labels */}
            {ticket.labels.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {ticket.labels.map((label, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs px-2 py-0"
                  >
                    {label}
                  </Badge>
                ))}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between mt-2">
              {/* Priority */}
              <Badge
                className={cn(
                  'text-xs capitalize',
                  PRIORITY_COLORS[ticket.priority]
                )}
              >
                {ticket.priority}
              </Badge>

              {/* Assignee */}
              {ticket.assignee && (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <User className="w-3 h-3" />
                  <span className="truncate max-w-[100px]">{ticket.assignee}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

