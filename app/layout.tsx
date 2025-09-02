import type { Metadata } from 'next';
import AuthWrapper from '../components/AuthWrapper';

export const metadata: Metadata = {
  title: 'Snowflake',
  description: 'A tool for tracking engineering growth.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthWrapper>{children}</AuthWrapper>
      </body>
    </html>
  );
}
