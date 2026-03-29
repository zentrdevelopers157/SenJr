import { Navbar } from '@/components/ui/Navbar';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white pb-32">
      <Navbar />
      <main className="container mx-auto px-4 pt-32 max-w-3xl">
        <h1 className="text-5xl font-black mb-8">Terms of Service</h1>
        <p className="text-slate-400 mb-12 italic text-lg">Effective Date: March 27, 2026</p>
        
        <div className="space-y-12 text-slate-300 leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white uppercase tracking-widest text-brand-blue">1. Acceptance of Terms</h2>
            <p>
              By accessing or using Senjr, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, you should not access or use our platform.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white uppercase tracking-widest text-brand-orange">2. User Conduct</h2>
            <p>
              Users must provide accurate information and maintain professional conduct during sessions. Harassment, fraud, or misuse of the platform will result in immediate termination of account access.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white uppercase tracking-widest text-brand-blue">3. Bookings & Payments</h2>
            <p>
              Mentors set their own rates. Students are responsible for payment of scheduled sessions unless cancelled within the platform's grace period.
            </p>
          </section>

          <div className="pt-12 border-t border-white/10 text-center">
            <p className="text-slate-500">For legal inquiries: <span className="text-white">legal@senjr.com</span></p>
          </div>
        </div>
      </main>
    </div>
  );
}
