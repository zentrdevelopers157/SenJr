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

export default function StudentLogin() {
  const [state, formAction] = useActionState(signIn.bind(null, 'student'), null);

  return (
    <AuthLayout role="student">
      <RoleBadge role="student" />
      <RoleTabs currentRole="student" isLogin={true} />
      <AuthTitle
        title="Welcome back"
        subtitle="Sign in to continue your learning journey"
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
          placeholder="you@example.com"
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
            className="text-[11px] font-bold text-slate-500 hover:text-brand-blue transition-colors uppercase tracking-wider"
          >
            Forgot password?
          </Link>
        </div>
        <div className="pt-2">
          <AuthSubmitButton role="student">
            Sign In
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="ml-1">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </AuthSubmitButton>
        </div>
      </form>

      <AuthFooterLink
        text="Don't have an account?"
        linkText="Sign Up"
        href="/student/signup"
      />
    </AuthLayout>
  );
}
