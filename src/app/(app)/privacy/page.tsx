import { Navbar } from '@/components/ui/Navbar';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white pb-32">
      <Navbar />
      <main className="container mx-auto px-4 pt-32 max-w-3xl">
        <h1 className="text-5xl font-black mb-8">Privacy Policy</h1>
        <p className="text-slate-400 mb-12 italic text-lg">Last Updated: March 27, 2026</p>
        
        <div className="space-y-12 text-slate-300 leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white uppercase tracking-widest text-brand-blue">1. Information We Collect</h2>
            <p>
              Senjr collects information to provide better services to all our users. We collect data provided by you (e.g., name, email, profile details) and data collected automatically (e.g., usage patterns, IP address for security).
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white uppercase tracking-widest text-brand-orange">2. How We Use Information</h2>
            <p>
              We use the information we collect to maintain, protect, and improve our services, to develop new ones, and to protect Senjr and our users. This includes session matching, payment processing, and security monitoring.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white uppercase tracking-widest text-brand-blue">3. Data Security</h2>
            <p>
              We work hard to protect Senjr and our users from unauthorized access to or unauthorized alteration, disclosure, or destruction of information we hold. We use industry-standard encryption and RLS security policies.
            </p>
          </section>

          <div className="pt-12 border-t border-white/10 text-center">
            <p className="text-slate-500">Questions about our privacy policy? Contact us at <span className="text-white">support@senjr.com</span></p>
          </div>
        </div>
      </main>
    </div>
  );
}
