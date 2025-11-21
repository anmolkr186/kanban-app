'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useStore } from '@/lib/store';
import { Column } from '@/lib/types';
import { GripVertical, Trash2, Plus } from 'lucide-react';
import { ConfirmDialog } from './ConfirmDialog';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ManageColumnsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SortableColumnItemProps {
  column: Column;
  onUpdate: (id: string, name: string, color: string) => void;
  onDelete: (id: string) => void;
  hasTickets: boolean;
}

function SortableColumnItem({ column, onUpdate, onDelete, hasTickets }: SortableColumnItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column.id });

  const [name, setName] = useState(column.name);
  const [color, setColor] = useState(column.color);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleBlur = () => {
    if (name !== column.name || color !== column.color) {
      onUpdate(column.id, name, color);
    }
  };

  const handleDeleteClick = () => {
    if (hasTickets) {
      setShowDeleteConfirm(true);
    } else {
      onDelete(column.id);
    }
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className="flex items-center gap-3 p-3 bg-white border rounded-lg"
      >
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
        >
          <GripVertical className="w-5 h-5" />
        </button>

        <div className="flex-1 grid grid-cols-2 gap-3">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={handleBlur}
            placeholder="Column name"
          />
          <div className="flex gap-2">
            <Input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              onBlur={handleBlur}
              className="w-16 h-10 cursor-pointer"
            />
            <Input
              value={color}
              onChange={(e) => setColor(e.target.value)}
              onBlur={handleBlur}
              placeholder="#FFFFFF"
              className="flex-1"
            />
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleDeleteClick}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          onDelete(column.id);
          setShowDeleteConfirm(false);
        }}
        title="Delete Column"
        message={`This column contains ${hasTickets ? 'tickets' : 'no tickets'}. Deleting it will remove all tickets in this column. This action cannot be undone.`}
      />
    </>
  );
}

export function ManageColumnsModal({ isOpen, onClose }: ManageColumnsModalProps) {
  const { columns, tickets, addColumn, updateColumn, deleteColumn, reorderColumns } = useStore();
  const [localColumns, setLocalColumns] = useState<Column[]>([]);
  const [newColumnName, setNewColumnName] = useState('');
  const [newColumnColor, setNewColumnColor] = useState('#E3E8FF');

  useEffect(() => {
    setLocalColumns([...columns].sort((a, b) => a.order - b.order));
  }, [columns]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = localColumns.findIndex((col) => col.id === active.id);
      const newIndex = localColumns.findIndex((col) => col.id === over.id);

      const reordered = arrayMove(localColumns, oldIndex, newIndex);
      setLocalColumns(reordered);
      reorderColumns(reordered);
    }
  };

  const handleAddColumn = () => {
    if (!newColumnName.trim()) {
      alert('Column name is required');
      return;
    }

    addColumn({
      name: newColumnName.trim(),
      color: newColumnColor,
    });

    setNewColumnName('');
    setNewColumnColor('#E3E8FF');
  };

  const handleUpdateColumn = (id: string, name: string, color: string) => {
    updateColumn(id, { name, color });
  };

  const handleDeleteColumn = (id: string) => {
    deleteColumn(id);
  };

  const getTicketCount = (columnId: string) => {
    return tickets.filter((t) => t.status === columnId).length;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manage Columns" className="max-w-2xl">
      <div className="space-y-6">
        {/* Existing Columns */}
        <div>
          <Label className="mb-3 block">Columns (Drag to reorder)</Label>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={localColumns.map((c) => c.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {localColumns.map((column) => (
                  <SortableColumnItem
                    key={column.id}
                    column={column}
                    onUpdate={handleUpdateColumn}
                    onDelete={handleDeleteColumn}
                    hasTickets={getTicketCount(column.id) > 0}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        {/* Add New Column */}
        <div className="border-t pt-6">
          <Label className="mb-3 block">Add New Column</Label>
          <div className="flex gap-3">
            <Input
              value={newColumnName}
              onChange={(e) => setNewColumnName(e.target.value)}
              placeholder="Column name"
              className="flex-1"
            />
            <div className="flex gap-2">
              <Input
                type="color"
                value={newColumnColor}
                onChange={(e) => setNewColumnColor(e.target.value)}
                className="w-16 h-10 cursor-pointer"
              />
              <Input
                value={newColumnColor}
                onChange={(e) => setNewColumnColor(e.target.value)}
                placeholder="#FFFFFF"
                className="w-32"
              />
            </div>
            <Button
              onClick={handleAddColumn}
              style={{ backgroundColor: '#0E4259' }}
              className="text-white hover:opacity-90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end pt-4 border-t">
          <Button onClick={onClose}>Done</Button>
        </div>
      </div>
    </Modal>
  );
}

