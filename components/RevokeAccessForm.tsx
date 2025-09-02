"use client";

import * as React from 'react';
import Select, { SelectOption } from './Select';

interface Props {
  allKeys: string[];
  action: (formData: FormData) => void | Promise<void>;
}

export default function RevokeAccessForm(props: Props) {
  const { allKeys, action } = props;
  const [reportKey, setReportKey] = React.useState('');
  const [users, setUsers] = React.useState<string[]>([]);
  const [username, setUsername] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    async function load() {
      if (!reportKey) {
        setUsers([]);
        return;
      }
      setLoading(true);
      setError('');
      try {
        const params = new URLSearchParams({ reportKey });
        try {
          const cookie = document.cookie || '';
          const match = cookie.split('; ').find((c) => c.startsWith('username='));
          const user = match ? decodeURIComponent(match.split('=')[1]) : '';
          if (user) params.set('username', user);
        } catch {}
        const res = await fetch(`/api/report-users?${params.toString()}`, { cache: 'no-store', credentials: 'same-origin' });
        if (res.ok) {
          const data = await res.json();
          setUsers(Array.isArray(data?.users) ? data.users : []);
        } else {
          setError(`Error: ${res.status}`);
          setUsers([]);
        }
      } catch {
        setError('Fetch failed');
        setUsers([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [reportKey]);

  const userPlaceholder = loading ? 'Loading...' : error ? error : `reviews name (${users.length})`;

  // Convert string arrays to SelectOption format
  const reportKeyOptions: SelectOption[] = allKeys.map(key => ({ value: key, label: key }));
  const userOptions: SelectOption[] = users.map(user => ({ value: user, label: user }));

  return (
    <form action={action} style={{ border: '1px solid #ddd', padding: 12, borderRadius: 6 }}>
      <h4 style={{ margin: 0, marginBottom: 8 }}>Revoke access</h4>
      <Select name="reportKey" options={reportKeyOptions} placeholder="Select User Report" onValueChange={(value) => setReportKey(value || '')} />
      <Select key={reportKey} name="username" options={userOptions} placeholder={userPlaceholder} onValueChange={(value) => setUsername(value || '')} />
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit" style={{ padding: '6px 10px', border: '1px solid #ccc', background: '#eee', borderRadius: 4, cursor: 'pointer' }}>Revoke</button>
        <button type="reset" style={{ padding: '6px 10px', border: '1px solid #ccc', background: '#fafafa', borderRadius: 4, cursor: 'pointer' }}>Clear</button>
      </div>
    </form>
  );
}


