'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { AuthLayout, AuthTitle, AuthInput, AuthSubmitButton, AuthError, AuthFooterLink } from '@/components/auth/AuthLayout';
import '@/components/auth/auth.css';

/**
 * Reset Password Page
 * Allows users to request a password reset email.
 */
export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    });

    if (resetError) {
      setError(resetError.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  return (
    <AuthLayout role="student">
      <AuthTitle 
        title="Forgot Password?" 
        subtitle="No worries, it happens. Enter your email and we'll send you a link to reset it."
      />

      {success ? (
        <div className="text-center py-6 animate-in fade-in zoom-in duration-500">
          <div className="w-16 h-16 rounded-full bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center mx-auto mb-4 text-2xl">
            📧
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Check your inbox!</h3>
          <p className="text-sm text-slate-400">
            We've sent a password reset link to <span className="text-white font-medium">{email}</span>.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <AuthError error={error} />
          <AuthInput 
            label="Email Address" 
            id="email" 
            name="email" 
            type="email" 
            placeholder="name@example.com"
            required
            // Note: Since this is a manual form for now (not using useActionState yet for simplicity of the Supabase direct call),
            // I'm using standard React state.
          />
          <div className="pt-2">
            <AuthSubmitButton role="student" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </AuthSubmitButton>
          </div>
        </form>
      )}

      <AuthFooterLink 
        text="Remembered your password?" 
        linkText="Back to Login" 
        href="/student/login" 
      />
    </AuthLayout>
  );
}
