'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/lib/store';
import { Ticket, Priority } from '@/lib/types';
import { X, Trash2 } from 'lucide-react';
import { ConfirmDialog } from './ConfirmDialog';

interface EditTicketModalProps {
  isOpen: boolean;
  ticket: Ticket;
  onClose: () => void;
}

export function EditTicketModal({ isOpen, ticket, onClose }: EditTicketModalProps) {
  const { columns, updateTicket, deleteTicket } = useStore();
  const [title, setTitle] = useState(ticket.title);
  const [description, setDescription] = useState(ticket.description);
  const [status, setStatus] = useState(ticket.status);
  const [priority, setPriority] = useState<Priority>(ticket.priority);
  const [assignee, setAssignee] = useState(ticket.assignee);
  const [labels, setLabels] = useState<string[]>(ticket.labels);
  const [labelInput, setLabelInput] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    setTitle(ticket.title);
    setDescription(ticket.description);
    setStatus(ticket.status);
    setPriority(ticket.priority);
    setAssignee(ticket.assignee);
    setLabels(ticket.labels);
  }, [ticket]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('Title is required');
      return;
    }

    updateTicket(ticket.id, {
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      assignee: assignee.trim(),
      labels,
    });

    onClose();
  };

  const handleDelete = () => {
    deleteTicket(ticket.id);
    setShowDeleteConfirm(false);
    onClose();
  };

  const handleAddLabel = () => {
    if (labelInput.trim() && !labels.includes(labelInput.trim())) {
      setLabels([...labels, labelInput.trim()]);
      setLabelInput('');
    }
  };

  const handleRemoveLabel = (label: string) => {
    setLabels(labels.filter((l) => l !== label));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddLabel();
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Edit Ticket">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter ticket title"
              className="mt-1"
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description..."
              className="mt-1 min-h-[100px]"
            />
          </div>

          {/* Status and Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {columns.map((column) => (
                    <SelectItem key={column.id} value={column.id}>
                      {column.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={(val) => setPriority(val as Priority)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Assignee */}
          <div>
            <Label htmlFor="assignee">Assignee</Label>
            <Input
              id="assignee"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              placeholder="Enter assignee name"
              className="mt-1"
            />
          </div>

          {/* Labels */}
          <div>
            <Label htmlFor="labels">Labels</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="labels"
                value={labelInput}
                onChange={(e) => setLabelInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add label and press Enter"
              />
              <Button type="button" onClick={handleAddLabel} variant="outline">
                Add
              </Button>
            </div>
            {labels.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {labels.map((label) => (
                  <Badge key={label} variant="secondary" className="gap-1">
                    {label}
                    <button
                      type="button"
                      onClick={() => handleRemoveLabel(label)}
                      className="hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="destructive"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                style={{ backgroundColor: '#0E4259' }}
                className="text-white hover:opacity-90"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Ticket"
        message="Are you sure you want to delete this ticket? This action cannot be undone."
      />
    </>
  );
}

