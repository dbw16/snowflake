import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../lib/auth';
import { redirect } from 'next/navigation';
import { addAdmin, isAdmin, listAdmins, getAllReportKeys, getAllUsernames, revokeAdmin, grantReportAccess, revokeReportAccess } from '../../lib/access';
import { revalidatePath } from 'next/cache';
import Select, { SelectOption } from '../../components/Select';
import RevokeAccessForm from '../../components/RevokeAccessForm';

// Access management (grant/revoke) removed: each user implicitly owns their username report.
import Tabs, { Tab } from './AdminTabs';

export const dynamic = 'force-dynamic';

async function addAdminAction(formData: FormData) {
  'use server';
  const session = await getServerSession(authOptions);
  const current = session?.user?.name;
  if (!current || !(await isAdmin(current))) {
    redirect('/');
  }
  const newAdmin = (formData.get('username') as string | null)?.trim() || '';
  if (newAdmin) {
    await addAdmin(newAdmin);
    revalidatePath('/admin');
  }
}

async function revokeAdminAction(formData: FormData) {
  'use server';
  const session = await getServerSession(authOptions);
  const current = session?.user?.name;
  if (!current || !(await isAdmin(current))) {
    redirect('/');
  }
  const adminToRevoke = (formData.get('username') as string | null)?.trim() || '';
  if (adminToRevoke) {
    await revokeAdmin(adminToRevoke);
    revalidatePath('/admin');
  }
}

function AddAdminSection({ admins, allUsers }: { admins: string[]; allUsers: string[] }) {
  const allUserOptions: SelectOption[] = allUsers.map(user => ({ value: user, label: user }));
  const adminOptions: SelectOption[] = admins.map(admin => ({ value: admin, label: admin }));

  return (
    <>
      <section style={{ marginTop: 24 }}>
        <h3 style={{ marginBottom: 8 }}>Current Admins</h3>
        <ul>
          {admins.map((a) => (
            <li key={a} style={{ lineHeight: '28px' }}>
              {a}
            </li>
          ))}
        </ul>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 8 }}>
        <form action={addAdminAction} style={{ border: '1px solid #ddd', padding: 12, borderRadius: 6 }}>
          <h4 style={{ margin: 0, marginBottom: 8 }}>Add admin</h4>
          <Select name="username" options={allUserOptions} placeholder="Select a user to make admin" />
          <button
            type="submit"
            style={{
              padding: '8px 12px',
              border: '1px solid #ccc',
              background: '#eee',
              borderRadius: 4,
              cursor: 'pointer',
            }}
          >
            Add admin
          </button>
        </form>
        <form action={revokeAdminAction} style={{ border: '1px solid #ddd', padding: 12, borderRadius: 6 }}>
          <h4 style={{ margin: 0, marginBottom: 8 }}>Revoke admin</h4>
          <Select name="username" options={adminOptions} placeholder="Select an admin to revoke" />
          <button
            type="submit"
            style={{
              padding: '8px 12px',
              border: '1px solid #ccc',
              background: '#eee',
              borderRadius: 4,
              cursor: 'pointer',
            }}
          >
            Revoke admin
          </button>
        </form>
      </div>
    </>
  );
}

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  const current = session?.user?.name;
  if (!current || !(await isAdmin(current))) {
    redirect('/');
  }
  const admins = await listAdmins();
  const allKeys = await getAllReportKeys();
  const allUsers = await getAllUsernames();
  return (
    <main style={{ maxWidth: 560, margin: '60px auto', fontFamily: 'Helvetica' }}>
      <h1 style={{ marginBottom: 8 }}>Admin</h1>
      <p style={{ color: '#666', marginTop: 0 }}>Manage administrator users.</p>

      <Tabs>
        <Tab title="Report Access">
          <AccessManager allKeys={allKeys} allUsers={allUsers} />
        </Tab>
        <Tab title="Add Admin">
          <AddAdminSection admins={admins} allUsers={allUsers} />
        </Tab>
      </Tabs>
    </main>
  );
}

async function grantAccessAction(formData: FormData) {
  'use server';
  const session = await getServerSession(authOptions);
  const current = session?.user?.name;
  if (!current || !(await isAdmin(current))) {
    redirect('/');
  }
  const reportKey = (formData.get('reportKey') as string | null)?.trim() || '';
  const username = (formData.get('username') as string | null)?.trim() || '';
  if (reportKey && username) {
    await grantReportAccess(reportKey, username);
    revalidatePath('/admin');
  }
}

async function revokeAccessAction(formData: FormData) {
  'use server';
  const session = await getServerSession(authOptions);
  const current = session?.user?.name;
  if (!current || !(await isAdmin(current))) {
    redirect('/');
  }
  const reportKey = (formData.get('reportKey') as string | null)?.trim() || '';
  const username = (formData.get('username') as string | null)?.trim() || '';
  if (reportKey && username) {
    await revokeReportAccess(reportKey, username);
    revalidatePath('/admin');
  }
}

function AccessManager({ allKeys, allUsers }: { allKeys: string[]; allUsers: string[] }) {
  const keyOptions: SelectOption[] = allKeys.map(k => ({ value: k, label: k }));
  const userOptions: SelectOption[] = allUsers.map(u => ({ value: u, label: u }));
  return (
    <section style={{ marginTop: 16 }}>
      <p style={{ color: '#666', marginTop: 0 }}>Grant or revoke access to user reports.</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <form action={grantAccessAction} style={{ border: '1px solid #ddd', padding: 12, borderRadius: 6 }}>
          <h4 style={{ margin: 0, marginBottom: 8 }}>Grant access</h4>
            <Select name="reportKey" options={keyOptions} placeholder="Select User Report" />
            <Select name="username" options={userOptions} placeholder="User to grant" />
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="submit" style={{ padding: '6px 10px', border: '1px solid #ccc', background: '#eee', borderRadius: 4, cursor: 'pointer' }}>Grant</button>
              <button type="reset" style={{ padding: '6px 10px', border: '1px solid #ccc', background: '#fafafa', borderRadius: 4, cursor: 'pointer' }}>Clear</button>
            </div>
        </form>
        <RevokeAccessForm allKeys={allKeys} action={revokeAccessAction} />
      </div>
    </section>
  );
}


