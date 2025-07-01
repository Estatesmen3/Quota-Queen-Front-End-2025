import React, { useState } from 'react';
import { CreateCallData } from '@/types/calls';

interface CallControlProps {
  /**
   * Called when user clicks "Start Call"
   * @param data CreateCallData object containing call details
   */
  onStartCall: (data: CreateCallData) => Promise<void>;
  /** Whether the call creation/joining process is in progress */
  loading: boolean;
  /** An error to display, if any occurred during call creation */
  error: Error | null;
}

export default function CallControl({ onStartCall, loading, error }: CallControlProps) {
  const [title, setTitle] = useState<string>('Sales Call');
  const [description, setDescription] = useState<string>('');
  const [scheduledAt, setScheduledAt] = useState<string>('');
  const [participants, setParticipants] = useState<string>('');

  /**
   * Parse and transform form state into CreateCallData, then invoke onStartCall
   */
  const handleStart = async () => {
    // Convert comma-separated IDs into an array of numbers
    const participantIds = participants
      .split(',')
      .map(id => id.trim())
      .filter(Boolean)
      .map(id => Number(id));

    const data: CreateCallData = {
      title,
      description: description || undefined,
      scheduled_at: scheduledAt ? new Date(scheduledAt).toISOString() : undefined,
      call_type: 'live',
      participants: participantIds,
    };

    await onStartCall(data);
  };

  return (
    <div className="p-4 bg-white shadow rounded-lg space-y-4">
      <h3 className="text-xl font-semibold">AI Sales Call</h3>

      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Call title"
          className="w-full border rounded p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Call description (optional)"
          className="w-full border rounded p-2"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Scheduled At</label>
        <input
          type="datetime-local"
          value={scheduledAt}
          onChange={e => setScheduledAt(e.target.value)}
          className="w-full border rounded p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Participants (IDs comma-separated)</label>
        <input
          type="text"
          value={participants}
          onChange={e => setParticipants(e.target.value)}
          placeholder="e.g. 1,2,3"
          className="w-full border rounded p-2"
        />
      </div>

      <button
        onClick={handleStart}
        disabled={loading}
        className="w-full bg-blue-600 text-white rounded p-2 disabled:opacity-50"
      >
        {loading ? 'Starting…' : 'Start Call'}
      </button>

      {error && <p className="text-red-500 mt-2">{error.message}</p>}
    </div>
  );
}