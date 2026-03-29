'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { AuthLayout, AuthTitle, AuthInput, AuthSubmitButton, AuthError } from '@/components/auth/AuthLayout';
import '@/components/auth/auth.css';

/**
 * Update Password Page
 * Screen where users land after clicking the reset link in their email.
 */
export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({
      password: password,
    });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
    } else {
      // Success! Redirect to dashboard
      router.push('/dashboard');
    }
  };

  return (
    <AuthLayout role="student">
      <AuthTitle 
        title="Set New Password" 
        subtitle="Choose a strong password to secure your account."
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthError error={error} />
        <AuthInput 
          label="New Password" 
          id="password" 
          name="password" 
          type="password" 
          placeholder="Min. 6 characters"
          required
        />
        <div className="pt-2">
          <AuthSubmitButton role="student" disabled={loading}>
            {loading ? 'Updating...' : 'Update Password'}
          </AuthSubmitButton>
        </div>
      </form>
    </AuthLayout>
  );
}
