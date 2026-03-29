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

export default function MentorSignup() {
  const [state, formAction] = useActionState(signUp.bind(null, 'mentor'), null);

  return (
    <AuthLayout role="mentor">
      <RoleBadge role="mentor" />
      <RoleTabs currentRole="mentor" isLogin={false} />
      <AuthTitle
        title="Become a Mentor"
        subtitle="Guide the next generation of students"
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
          placeholder="Arjun Sharma"
        />
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
          placeholder="Min. 6 characters"
        />
        <div className="pt-2">
          <AuthSubmitButton role="mentor">
            Become a Mentor ✦
          </AuthSubmitButton>
        </div>
      </form>

      <AuthFooterLink
        text="Already a mentor?"
        linkText="Log In"
        href="/mentor/login"
      />
    </AuthLayout>
  );
}
