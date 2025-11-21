'use client';

import { useState } from 'react';
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
import { Priority } from '@/lib/types';
import { X } from 'lucide-react';

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateTicketModal({ isOpen, onClose }: CreateTicketModalProps) {
  const { columns, addTicket } = useStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState(columns[0]?.id || '');
  const [priority, setPriority] = useState<Priority>('medium');
  const [assignee, setAssignee] = useState('');
  const [labels, setLabels] = useState<string[]>([]);
  const [labelInput, setLabelInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('Title is required');
      return;
    }

    addTicket({
      title: title.trim(),
      description: description.trim(),
      status: status || columns[0]?.id || '',
      priority,
      assignee: assignee.trim(),
      labels,
    });

    // Reset form
    setTitle('');
    setDescription('');
    setStatus(columns[0]?.id || '');
    setPriority('medium');
    setAssignee('');
    setLabels([]);
    setLabelInput('');
    
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
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Ticket">
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
            autoFocus
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
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            style={{ backgroundColor: '#0E4259' }}
            className="text-white hover:opacity-90"
          >
            Create Ticket
          </Button>
        </div>
      </form>
    </Modal>
  );
}

