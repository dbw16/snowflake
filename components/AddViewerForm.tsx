'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';

// This would ideally be fetched from a user directory
const users = [
  { id: 'user1', name: 'Alice' },
  { id: 'user2', name: 'Bob' },
  { id: 'user3', name: 'Charlie' },
];

export default function AddViewerForm({ reportKey }: { reportKey: string }) {
  const { data: session } = useSession();
  const [selectedUser, setSelectedUser] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedUser) {
      setError('Please select a user');
      return;
    }

    if (!session) {
      setError('You must be logged in to add a viewer.');
      return;
    }

    try {
      const res = await fetch('/api/report-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reportKey, userId: selectedUser }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to add viewer');
      }

      setSuccess(`Successfully added viewer.`);
      setSelectedUser('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-lg">
      <h3 className="text-lg font-bold mb-2">Add Report Viewer</h3>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
      <div className="flex items-center">
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="border rounded-l-md p-2 flex-grow"
        >
          <option value="">Select a user</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded-r-md">
          Add Viewer
        </button>
      </div>
    </form>
  );
}
