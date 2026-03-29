'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { mapAuthError } from '@/utils/auth-utils'
import { authRateLimit } from '@/lib/ratelimit'

export type AuthState = {
  error?: string;
  success?: boolean;
}

/**
 * Sign In Action
 */
export async function signIn(
  role: 'student' | 'mentor',
  prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  try {
    const email = (formData.get('email') as string)?.trim().toLowerCase()
    const password = formData.get('password') as string

    if (!email || !password) {
      return { error: 'Email and password are required.' }
    }

    // Edge Rate Limiting
    if (process.env.UPSTASH_REDIS_REST_URL) {
      const { success } = await authRateLimit.limit(email);
      if (!success) {
        return { error: 'Too many attempts. Please wait 15 minutes.' };
      }
    }

    const supabase = await createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return { error: mapAuthError(error) }
    }

    revalidatePath('/', 'layout')
    redirect(`/dashboard/${role}`)
  } catch (error: any) {
    if (error.digest?.startsWith('NEXT_REDIRECT')) throw error;
    return { error: mapAuthError(error) }
  }
}

/**
 * Sign Up Action
 */
export async function signUp(
  role: 'student' | 'mentor',
  prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  try {
    const email = (formData.get('email') as string)?.trim().toLowerCase()
    const password = formData.get('password') as string
    const fullName = (formData.get('full_name') as string)?.trim()

    if (!email || !password || !fullName) {
      return { error: 'Full name, email, and password are required.' }
    }

    if (password.length < 6) {
      return { error: 'Password must be at least 6 characters.' }
    }

    // Edge Rate Limiting
    if (process.env.UPSTASH_REDIS_REST_URL) {
      const { success } = await authRateLimit.limit(email);
      if (!success) {
        return { error: 'Too many attempts. Please wait 15 minutes.' };
      }
    }

    const supabase = await createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role,
        }
      }
    })

    if (error) {
      return { error: mapAuthError(error) }
    }

    // Note: Database trigger handle_new_user() automatically creates 
    // the profile and specialized profile (mentor/student).

    revalidatePath('/', 'layout')
    redirect(`/onboarding`)
  } catch (error: any) {
    if (error.digest?.startsWith('NEXT_REDIRECT')) throw error;
    return { error: mapAuthError(error) }
  }
}

/**
 * Google Sign In Action
 */
export async function signInWithGoogle() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
    },
  })

  if (error) {
    console.error('Google Sign-In Error:', error.message)
    return { error: error.message }
  }

  if (data.url) {
    redirect(data.url)
  }
}

/**
 * Sign Out Action
 */
export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}
