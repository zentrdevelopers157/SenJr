/**
 * Centralized Environment Variable Validation
 * Ensures required Supabase variables are present and correctly formatted.
 */

function validateEnv() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const errors: string[] = [];

  if (!supabaseUrl) {
    errors.push('NEXT_PUBLIC_SUPABASE_URL is missing.');
  } else if (!supabaseUrl.startsWith('https://')) {
    errors.push('NEXT_PUBLIC_SUPABASE_URL must start with "https://".');
  }

  if (!supabaseAnonKey) {
    errors.push('NEXT_PUBLIC_SUPABASE_ANON_KEY is missing.');
  } else if (supabaseAnonKey.length < 20) {
    errors.push('NEXT_PUBLIC_SUPABASE_ANON_KEY seems too short or invalid.');
  }

  if (errors.length > 0) {
    const errorMsg = `[Senjr] Environment Variable Validation Failed:\n${errors.map(err => ` - ${err}`).join('\n')}\n\nPlease check your .env.local file.`;
    
    // In production, we throw. In development, we console.error but also throw to stop the app.
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  return {
    NEXT_PUBLIC_SUPABASE_URL: supabaseUrl!,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseAnonKey!,
  };
}

export const env = validateEnv();
