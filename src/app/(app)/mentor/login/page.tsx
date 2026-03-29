'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { signIn } from '@/app/(app)/auth';
import '@/components/auth/auth.css';
import {
  AuthLayout,
  AuthTitle,
  AuthInput,
  AuthSubmitButton,
  AuthError,
  AuthFooterLink,
  RoleBadge,
  RoleTabs,
} from '@/components/auth/AuthLayout';

export default function MentorLogin() {
  const [state, formAction] = useActionState(signIn.bind(null, 'mentor'), null);

  return (
    <AuthLayout role="mentor">
      <RoleBadge role="mentor" />
      <RoleTabs currentRole="mentor" isLogin={true} />
      <AuthTitle
        title="Welcome back, Mentor"
        subtitle="Sign in to your mentor dashboard"
      />
      <AuthError error={state?.error} />

      <form
        action={formAction}
        className="space-y-4"
      >
        <AuthInput
          label="Email"
          id="email"
          type="email"
          name="email"
          placeholder="you@university.edu"
        />
        <AuthInput
          label="Password"
          id="password"
          type="password"
          name="password"
          placeholder="••••••••"
        />
        <div className="flex justify-end pr-1">
          <Link 
            href="/auth/reset-password" 
            className="text-[11px] font-bold text-slate-500 hover:text-brand-orange transition-colors uppercase tracking-wider"
          >
            Forgot password?
          </Link>
        </div>
        <div className="pt-2">
          <AuthSubmitButton role="mentor">
            Sign In
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="ml-1">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </AuthSubmitButton>
        </div>
      </form>

      <AuthFooterLink
        text="Not a mentor yet?"
        linkText="Apply Now"
        href="/mentor/signup"
      />
    </AuthLayout>
  );
}
