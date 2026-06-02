import Hero from '@/components/home/Hero';
import { SectionDivider } from '@/components/SectionDivider';
import { SectionEntrance } from '@/components/ui/SectionEntrance';
import { FloatingParticles } from '@/components/FloatingParticles';

import dynamic from 'next/dynamic';

const Sponsors = dynamic(() => import('@/components/home/Sponsors'));
const Mission = dynamic(() => import('@/components/home/Mission'));
const CodingNews = dynamic(() => import('@/components/home/CodingNews'));
const PastCollaborations = dynamic(() => import('@/components/home/PastCollaborations'));

import BackToTop from '@/components/BackToTop';

import ErrorBoundary from '@/components/ErrorBoundary';

export default function Home() {
  return (
    <>
      <main className="min-h-screen bg-background">
        <FloatingParticles />

        <ErrorBoundary>
          <Hero />
        </ErrorBoundary>

        <SectionEntrance delay={0.1}>
          <ErrorBoundary>
            <CodingNews />
          </ErrorBoundary>
        </SectionEntrance>

        <SectionEntrance>
          <SectionDivider />
        </SectionEntrance>

        <div id="sponsors-section">
          <SectionEntrance delay={0.2}>
            <ErrorBoundary>
              <Sponsors />
            </ErrorBoundary>
          </SectionEntrance>
        </div>

        <SectionEntrance delay={0.2}>
          <ErrorBoundary>
            <PastCollaborations />
          </ErrorBoundary>
        </SectionEntrance>

        <SectionEntrance delay={0.2}>
          <ErrorBoundary>
            <Mission />
          </ErrorBoundary>
        </SectionEntrance>
      </main>

      <BackToTop />
    </>
  );
}