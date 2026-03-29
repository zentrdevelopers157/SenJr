import Link from 'next/link';
import React from 'react';
import { useFormStatus } from 'react-dom';

interface AuthLayoutProps {
  children: React.ReactNode;
  role: 'student' | 'mentor';
}

export function AuthLayout({ children, role }: AuthLayoutProps) {
  const isStudent = role === 'student';
  const accentGradient = isStudent
    ? 'from-blue-600/20 via-transparent to-transparent'
    : 'from-orange-500/20 via-transparent to-transparent';
  const glowColor = isStudent ? 'rgba(37, 99, 235, 0.15)' : 'rgba(249, 115, 22, 0.15)';

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-12"
         style={{ background: 'var(--bg-dark)' }}>
      {/* Background gradient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full opacity-40 blur-[120px]"
          style={{ background: isStudent ? 'var(--primary-blue)' : 'var(--primary-orange)' }}
        />
        <div
          className="absolute -bottom-32 -right-32 h-[400px] w-[400px] rounded-full opacity-20 blur-[100px]"
          style={{ background: isStudent ? 'var(--primary-orange)' : 'var(--primary-blue)' }}
        />
        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-[440px]">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block text-3xl font-bold tracking-tight transition-opacity hover:opacity-80">
            <span style={{ color: 'var(--text-primary)' }}>Sen</span>
            <span style={{ color: 'var(--primary-blue)' }}>jr</span>
          </Link>
        </div>

        {/* Auth card */}
        <div
          className="relative rounded-2xl border p-8 backdrop-blur-sm"
          style={{
            background: 'var(--bg-surface)',
            borderColor: 'var(--border-subtle)',
            boxShadow: `0 0 60px ${glowColor}, 0 25px 50px -12px rgba(0,0,0,0.5)`,
          }}
        >
          {/* Top accent line */}
          <div
            className="absolute left-8 right-8 top-0 h-px"
            style={{
              background: isStudent
                ? 'linear-gradient(90deg, transparent, var(--primary-blue), transparent)'
                : 'linear-gradient(90deg, transparent, var(--primary-orange), transparent)',
            }}
          />
          {children}

        {/* Social Login Separator */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/10"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-slate-950 px-4 text-slate-500 font-bold tracking-widest">Or continue with</span>
          </div>
        </div>

        <button 
          onClick={async () => {
            const { signInWithGoogle } = await import('@/app/(app)/auth');
            await signInWithGoogle();
          }}
          className="w-full h-14 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex items-center justify-center gap-3 font-bold group"
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Sign in with Google
        </button>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs" style={{ color: 'var(--text-muted)' }}>
          By continuing, you agree to Senjr&apos;s{' '}
          <span className="underline underline-offset-2 cursor-pointer" style={{ color: 'var(--text-muted)' }}>
            Terms
          </span>{' '}
          and{' '}
          <span className="underline underline-offset-2 cursor-pointer" style={{ color: 'var(--text-muted)' }}>
            Privacy Policy
          </span>
        </p>
      </div>
    </div>
  );
}

/* ─── Shared sub-components ─── */

export function AuthTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-6 text-center">
      <h1
        className="text-2xl font-bold tracking-tight"
        style={{ color: 'var(--text-primary)' }}
      >
        {title}
      </h1>
      <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
        {subtitle}
      </p>
    </div>
  );
}

export function AuthInput({
  label,
  id,
  type = 'text',
  name,
  placeholder,
  required = true,
}: {
  label: string;
  id: string;
  type?: string;
  name: string;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label
        className="block text-sm font-medium"
        htmlFor={id}
        style={{ color: 'var(--text-muted)' }}
      >
        {label}
      </label>
      <input
        type={type}
        name={name}
        id={id}
        required={required}
        placeholder={placeholder}
        className="auth-input"
      />
    </div>
  );
}

export function AuthSubmitButton({
  children,
  role,
  disabled,
}: {
  children: React.ReactNode;
  role: 'student' | 'mentor';
  disabled?: boolean;
}) {
  const { pending } = useFormStatus();
  const bg = role === 'student' ? 'var(--primary-blue)' : 'var(--primary-orange)';
  
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className={`auth-submit-btn flex items-center justify-center gap-2 ${pending ? 'opacity-70 cursor-not-allowed' : ''}`}
      style={{
        background: bg,
      }}
    >
      {pending ? (
        <>
          <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </>
      ) : children}
    </button>
  );
}

export function AuthError({ error }: { error?: string | null }) {
  if (!error) return null;
  return (
    <div
      className="mb-4 flex items-start gap-2 rounded-lg border px-4 py-3 text-sm"
      style={{
        background: 'rgba(239, 68, 68, 0.08)',
        borderColor: 'rgba(239, 68, 68, 0.2)',
        color: '#f87171',
      }}
    >
      <svg
        width="16" height="16" viewBox="0 0 16 16" fill="none" className="mt-0.5 shrink-0"
      >
        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 4.5v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="8" cy="11" r="0.75" fill="currentColor" />
      </svg>
      <span>{error}</span>
    </div>
  );
}

export function AuthDivider() {
  return (
    <div className="my-5 flex items-center gap-3">
      <div className="h-px flex-1" style={{ background: 'var(--border-subtle)' }} />
      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>or</span>
      <div className="h-px flex-1" style={{ background: 'var(--border-subtle)' }} />
    </div>
  );
}

export function AuthFooterLink({
  text,
  linkText,
  href,
}: {
  text: string;
  linkText: string;
  href: string;
}) {
  return (
    <p className="mt-6 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
      {text}{' '}
      <Link
        href={href}
        className="font-semibold transition-colors hover:underline underline-offset-2"
        style={{ color: 'var(--primary-blue)' }}
      >
        {linkText}
      </Link>
    </p>
  );
}

export function RoleBadge({ role }: { role: 'student' | 'mentor' }) {
  const isStudent = role === 'student';
  return (
    <div className="mb-4 flex justify-center">
      <span
        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
        style={{
          background: isStudent ? 'rgba(37, 99, 235, 0.12)' : 'rgba(249, 115, 22, 0.12)',
          color: isStudent ? '#60a5fa' : '#fb923c',
          border: `1px solid ${isStudent ? 'rgba(37, 99, 235, 0.2)' : 'rgba(249, 115, 22, 0.2)'}`,
        }}
      >
        <span className="h-1.5 w-1.5 rounded-full" style={{
          background: isStudent ? 'var(--primary-blue)' : 'var(--primary-orange)',
        }} />
        {isStudent ? 'Student' : 'Mentor'}
      </span>
    </div>
  );
}

export function RoleTabs({ currentRole, isLogin = false }: { currentRole: 'student' | 'mentor', isLogin?: boolean }) {
  const isStudent = currentRole === 'student';
  const actionPath = isLogin ? 'login' : 'signup';

  return (
    <div className="mb-6 flex w-full rounded-xl bg-black/20 p-1 border border-border-subtle/50">
      <Link href={`/student/${actionPath}`} className={`flex-1 text-center py-2 text-sm font-bold rounded-lg transition-all ${isStudent ? 'bg-bg-surface text-brand-blue shadow-md border border-brand-blue/20' : 'text-text-muted hover:text-text-primary'}`}>
        Student
      </Link>
      <Link href={`/mentor/${actionPath}`} className={`flex-1 text-center py-2 text-sm font-bold rounded-lg transition-all ${!isStudent ? 'bg-bg-surface text-brand-orange shadow-md border border-brand-orange/20' : 'text-text-muted hover:text-text-primary'}`}>
        Mentor
      </Link>
    </div>
  );
}
