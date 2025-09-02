'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import SnowflakeAppWrapper from '../components/SnowflakeApp';

export default function Home() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (session) {
    return (
      <main>
        <div style={{ padding: 10, display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          Signed in as {session.user?.name} <button onClick={() => signOut()}>Sign out</button>
        </div>
        <SnowflakeAppWrapper />
      </main>
    );
  }
  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <p>Not signed in</p>
      <button onClick={() => signIn()}>Sign in</button>
    </main>
  );
}
