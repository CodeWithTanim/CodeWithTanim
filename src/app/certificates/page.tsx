import type { Metadata } from 'next';
import CertificatesView from '@/components/CertificatesView';

export const metadata: Metadata = {
  title: 'MD SAMIUR RAHMAN TANIM — Verified Credentials & Certificates',
  description:
    'Verified certifications and credentials of MD SAMIUR RAHMAN TANIM across Google Cybersecurity, Meta, Coursera, Udemy, and software engineering internships.',
  alternates: {
    canonical: 'https://codewithtanim.github.io/certificates',
  },
};

export default function CertificatesPage() {
  return (
    <section>
      <CertificatesView />
    </section>
  );
}
