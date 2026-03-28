'use client';

import { Layout } from '@/components/dom/Layout';
import { Header } from '@/components/dom/Header';
import { AdBanner } from '@/components/dom/AdBanner';
import { SideMenu } from '@/components/dom/SideMenu';
import { Footer } from '@/components/dom/Footer';
import { GoldenDialMenu } from '@/components/dom/GoldenDialMenu';
import { ShowcaseCanvas } from '@/components/canvas/ShowcaseCanvas';

export default function Home() {
  return (
    <Layout>
      <Header />
      <SideMenu />
      <GoldenDialMenu />
      
      <div className="relative">
        <AdBanner />
        
        {/* Full-width/height 3D Showcase with Scroll-Jacking */}
        <ShowcaseCanvas />

        <Footer />
      </div>
    </Layout>
  );
}
