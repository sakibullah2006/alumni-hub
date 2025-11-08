import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getPayload } from '@/lib/payload'

/**
 * Email Verification Page
 * 
 * This page handles email verification for new user registrations.
 * 
 * Flow:
 * 1. User registers via /api/users endpoint
 * 2. Payload sends verification email with token (configured in Users collection)
 * 3. User clicks the link: /verify?token=[token]
 * 4. This page calls Payload's verifyEmail API
 * 5. User is verified and can now log in
 * 
 * The verification email template is configured in:
 * src/collections/user/Users.ts (auth.verify.generateEmailHTML)
 */

export const metadata: Metadata = {
  title: 'Verify Email | Alumni Hub',
  description: 'Verify your email address',
}

interface VerifyPageProps {
  searchParams: Promise<{ token?: string }>
}

export default async function VerifyPage({ searchParams }: VerifyPageProps) {
  const { token } = await searchParams

  if (!token) {
    return (
      <div className="verify-container">
        <div className="verify-card error">
          <div className="icon">❌</div>
          <h1>Verification Failed</h1>
          <p>No verification token provided. Please check your email for the verification link.</p>
          <a href="/" className="btn btn-primary">
            Go to Home
          </a>
        </div>
      </div>
    )
  }

  let verificationResult: {
    success: boolean
    message: string
    error?: string
  } = {
    success: false,
    message: '',
  }

  try {
    const payload = await getPayload()

    // Verify the user's email using Payload's built-in verification
    const result = await payload.verifyEmail({
      collection: 'users',
      token,
    })

    if (result) {
      verificationResult = {
        success: true,
        message: 'Your email has been successfully verified! You can now log in.',
      }
    } else {
      verificationResult = {
        success: false,
        message: 'Verification failed. The token may be invalid or expired.',
        error: 'Invalid or expired token',
      }
    }
  } catch (error: any) {
    console.error('Email verification error:', error)
    verificationResult = {
      success: false,
      message: 'An error occurred during verification. Please try again or contact support.',
      error: error?.message || 'Unknown error',
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-500 via-purple-500 to-purple-700 p-5">
      <div className="bg-white rounded-2xl p-12 max-w-lg w-full text-center shadow-2xl animate-slideIn">
        <div 
          className={`text-6xl mb-6 animate-scaleIn ${
            verificationResult.success ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {verificationResult.success ? '✓' : '❌'}
        </div>
        
        <h1 className="text-3xl font-bold mb-4 text-gray-800">
          {verificationResult.success ? 'Email Verified!' : 'Verification Failed'}
        </h1>
        
        <p className="text-base text-gray-600 mb-8 leading-relaxed">
          {verificationResult.message}
        </p>
        
        {verificationResult.error && (
          <p className="text-sm text-red-500 -mt-4 mb-8">
            <small>Error: {verificationResult.error}</small>
          </p>
        )}
        
        <div className="flex gap-3 justify-center flex-wrap">
          {verificationResult.success ? (
            <a 
              href="/admin" 
              className="px-6 py-3 rounded-lg font-semibold text-white bg-indigo-500 hover:bg-indigo-600 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/40"
            >
              Go to Login
            </a>
          ) : (
            <>
              <a 
                href="/" 
                className="px-6 py-3 rounded-lg font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-all duration-200 hover:-translate-y-0.5"
              >
                Go to Home
              </a>
              <a 
                href="/admin/forgot-password" 
                className="px-6 py-3 rounded-lg font-semibold text-white bg-indigo-500 hover:bg-indigo-600 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/40"
              >
                Resend Verification
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
