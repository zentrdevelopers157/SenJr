/**
 * Auth Error Mapping Utility
 * Converts Supabase/Postgres error codes and messages into human-readable text.
 */

export function mapAuthError(error: any): string {
  if (!error) return 'Something went wrong. Please try again.';
  
  const message = error.message?.toLowerCase() || '';
  const code = error.code || '';

  // Specific Supabase error codes
  if (code === 'invalid_credentials' || message.includes('invalid login credentials')) {
    return 'Incorrect email or password.';
  }

  if (code === 'email_not_confirmed' || message.includes('email not confirmed')) {
    return 'Please verify your email before signing in.';
  }

  if (code === 'over_email_send_rate_limit' || message.includes('email rate limit exceeded')) {
    return 'Too many attempts. Please wait a few minutes.';
  }

  if (code === 'user_already_exists' || message.includes('user already registered')) {
    return 'An account with this email already exists.';
  }

  // Fallback
  return 'Something went wrong. Please try again.';
}
