import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'MD SAMIUR RAHMAN TANIM — Software Engineer & Computer Science Scholar',
  description:
    'Official Portfolio of MD SAMIUR RAHMAN TANIM – Computer Science student, Full-Stack Software Developer, Python Engineer & Cyber Security Researcher.',
  keywords: [
    'MD SAMIUR RAHMAN TANIM',
    'CodeWithTanim',
    'Software Engineer',
    'Web Developer',
    'Python',
    'JavaScript',
    'TypeScript',
    'React',
    'Next.js',
    'Cybersecurity',
    'Portfolio'
  ],
  authors: [{ name: 'MD SAMIUR RAHMAN TANIM', url: 'https://codewithtanim.github.io' }],
  metadataBase: new URL('https://codewithtanim.github.io'),
  openGraph: {
    title: 'MD SAMIUR RAHMAN TANIM — Software Engineer Portfolio',
    description: 'Computer Science student & Developer showcasing software engineering projects, research, and interactive tools.',
    url: 'https://codewithtanim.github.io',
    siteName: 'CodeWithTanim Portfolio',
    images: [
      {
        url: 'https://i.ibb.co/1GsW1n6m/tanim.jpg',
        width: 1200,
        height: 630,
        alt: 'MD SAMIUR RAHMAN TANIM'
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  icons: {
    icon: [
      { url: '/Images/Personal/favicon.png', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    shortcut: '/Images/Personal/favicon.png',
    apple: '/Images/Personal/favicon.png'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light">
      <head>
        <link rel="icon" type="image/png" href="/Images/Personal/favicon.png" />
        <link rel="shortcut icon" href="/Images/Personal/favicon.png" />
        <link rel="apple-touch-icon" href="/Images/Personal/favicon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Archivo:wght@400;500;600;700;800&family=Roboto+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Navbar />
        <main className="container">{children}</main>
        {/* Professional Multi-Column Footer */}
        <Footer />
      </body>
    </html>
  );
}
