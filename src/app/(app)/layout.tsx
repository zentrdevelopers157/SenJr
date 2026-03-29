import { Navbar } from '@/components/ui/Navbar';
import { OnboardingModal } from '@/components/ui/OnboardingModal';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-white">
      <Navbar />
      <main className="flex-1 pt-16">
        <div className="container mx-auto px-4 py-8">
          {children}
        </div>
      </main>
      <footer className="border-t border-white/5 bg-slate-950 py-12 text-center text-sm text-slate-500">
        <div className="container mx-auto px-4">
          <p>© {new Date().getFullYear()} Senjr — Senior to Junior. All rights reserved.</p>
        </div>
      </footer>
      <OnboardingModal />
    </div>
  );
}
