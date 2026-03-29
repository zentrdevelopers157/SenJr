'use client';

import { useActionState } from 'react';
import { signUp } from '@/app/(app)/auth';
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

export default function StudentSignup() {
  const [state, formAction] = useActionState(signUp.bind(null, 'student'), null);

  return (
    <AuthLayout role="student">
      <RoleBadge role="student" />
      <RoleTabs currentRole="student" isLogin={false} />
      <AuthTitle
        title="Create your account"
        subtitle="Start your journey with a mentor today"
      />
      <AuthError error={state?.error} />

      <form
        action={formAction}
        className="space-y-4"
      >
        <AuthInput
          label="Full name"
          id="full_name"
          type="text"
          name="full_name"
          placeholder="John Doe"
        />
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
          placeholder="Min. 6 characters"
        />
        <div className="pt-2">
          <AuthSubmitButton role="student">
            Create Account
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="ml-1">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </AuthSubmitButton>
        </div>
      </form>

      <AuthFooterLink
        text="Already have an account?"
        linkText="Log In"
        href="/student/login"
      />
    </AuthLayout>
  );
}
