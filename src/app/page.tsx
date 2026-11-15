import Hero from '@/components/Hero';
import AboutMe from '@/components/AboutMe';
import Experience from '@/components/Experience';
import Education from '@/components/Education';
import TechStack from '@/components/TechStack';
import ProjectsGrid from '@/components/ProjectsGrid';
import Courses from '@/components/Courses';
import CertBanner from '@/components/CertBanner';
import ContactForm from '@/components/ContactForm';

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutMe />
      <Experience />
      <Education />
      <TechStack />
      <ProjectsGrid />
      <Courses />
      <CertBanner />
      <ContactForm />
    </>
  );
}

