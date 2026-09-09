import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Oratoria — Virtual Auditorium',
  description: 'An interactive virtual 2D auditorium and lecture space powered by Phaser & Next.js.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-auditorium-bg text-auditorium-cream antialiased overflow-hidden w-screen h-screen">
        {children}
      </body>
    </html>
  );
}
