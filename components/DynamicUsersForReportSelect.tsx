"use client";

import * as React from 'react';
import Select from './Select';

interface Props {
  reportInputId: string;
  name: string;
  placeholder?: string;
}

export default function DynamicUsersForReportSelect(props: Props) {
  const { reportInputId, name, placeholder = 'reviews name' } = props;
  const [reportKey, setReportKey] = React.useState('');
  const [options, setOptions] = React.useState<string[]>([]);

  React.useEffect(() => {
    const input = document.querySelector<HTMLInputElement>(`#${CSS.escape(reportInputId)}`);
    if (!input) return;
    const handler = () => setReportKey((input.value || '').trim());
    input.addEventListener('input', handler);
    handler();
    return () => input.removeEventListener('input', handler);
  }, [reportInputId]);

  React.useEffect(() => {
    let abort = false;
    async function load() {
      if (!reportKey) {
        setOptions([]);
        return;
      }
      try {
        const params = new URLSearchParams({ reportKey });
        try {
          const cookie = document.cookie || '';
          const match = cookie.split('; ').find((c) => c.startsWith('username='));
          const user = match ? decodeURIComponent(match.split('=')[1]) : '';
          if (user) params.set('username', user);
        } catch {}
        const res = await fetch(`/api/report-users?${params.toString()}`, {
          cache: 'no-store',
          credentials: 'same-origin',
        });
        if (abort) return;
        if (res.ok) {
          const data = await res.json();
          setOptions(Array.isArray(data?.users) ? data.users : []);
        } else {
          setOptions([]);
        }
      } catch {
        if (!abort) setOptions([]);
      }
    }
    load();
    return () => {
      abort = true;
    };
  }, [reportKey]);

  return (
    <Select
      name={name}
      options={options.map((o) => ({ label: o, value: o }))}
      placeholder={placeholder}
    />
  );
}


