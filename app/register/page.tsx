'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { registerUser, sendOtp, verifyOtp, ApiError } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

type Step = 'phone' | 'otp' | 'details';

export default function Register() {
  const router = useRouter();
  const { refresh } = useAuth();

  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [otpAttempts, setOtpAttempts] = useState(0);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const validatePhone = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    return /^(09\d{9}|639\d{9})$/.test(cleaned);
  };

  const handleSendOtp = async () => {
    setError('');
    if (!validatePhone(phone)) {
      setError('Please enter a valid Philippine phone number (e.g. 09171234567).');
      return;
    }
    setLoading(true);
    try {
      const cleaned = phone.replace(/\D/g, '');
      await sendOtp(cleaned);
      setError('');
      setStep('otp');
      setResendCooldown(60);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otpCode];
    newOtp[index] = value;
    setOtpCode(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const newOtp = [...otpCode];
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setOtpCode(newOtp);
    const nextEmpty = Math.min(pasted.length, 5);
    otpRefs.current[nextEmpty]?.focus();
  };

  const handleVerifyOtp = async () => {
    setError('');
    if (otpAttempts >= 5) {
      setError('Too many attempts. Please request a new code.');
      return;
    }
    const code = otpCode.join('');
    if (code.length !== 6) {
      setError('Please enter the full 6-digit code.');
      return;
    }
    setLoading(true);
    try {
      await verifyOtp(phone, code);
      setError('');
      setOtpAttempts(0);
      setStep('details');
    } catch (err) {
      setOtpAttempts((prev) => prev + 1);
      setError(err instanceof ApiError ? err.message : 'Invalid OTP code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setError('');
    setLoading(true);
    try {
      await sendOtp(phone);
      setOtpCode(['', '', '', '', '', '']);
      setOtpAttempts(0);
      setResendCooldown(60);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to resend OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) { setError('Passwords do not match.'); return; }
    if (formData.password.length < 8) { setError('Password must be at least 8 characters.'); return; }

    setLoading(true);
    try {
      await registerUser({
        name: formData.fullName,
        phone,
        email: formData.email || undefined,
        password: formData.password,
      });
      await refresh();
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const maskedPhone = phone.replace(/(\d{4})\d{3}(\d{4})/, '$1***$2');

  return (
    <>
      {/* Terms of Service Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-20" onClick={() => setShowTermsModal(false)}>
          <div
            className="bg-white rounded-t-3xl w-full max-w-2xl max-h-[85vh] overflow-y-auto animate-slide-up shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Terms of Service</h2>
                <button
                  onClick={() => setShowTermsModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="px-6 py-6 space-y-4 text-sm text-gray-700">
              <p className="text-gray-500 italic">Last updated: February 12, 2026</p>

              <h3 className="text-lg font-semibold text-gray-900 mt-6">1. Acceptance of Terms</h3>
              <p>By accessing and using Trabz, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.</p>

              <h3 className="text-lg font-semibold text-gray-900 mt-6">2. Use of Service</h3>
              <p>Trabz provides a platform connecting Filipino workers with jobs and gigs. You agree to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account</li>
                <li>Not use the platform for illegal activities</li>
                <li>Not misrepresent your qualifications or experience</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mt-6">3. User Accounts</h3>
              <p>You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.</p>

              <h3 className="text-lg font-semibold text-gray-900 mt-6">4. Platform Fees</h3>
              <p>Trabz is 100% free for Filipino workers. We do not charge any fees for job applications, skill-building courses, or standard platform features.</p>

              <h3 className="text-lg font-semibold text-gray-900 mt-6">5. Payments</h3>
              <p>All payments for completed work are processed securely through our platform. Workers are responsible for accurate reporting of income for tax purposes.</p>

              <h3 className="text-lg font-semibold text-gray-900 mt-6">6. Termination</h3>
              <p>We reserve the right to terminate or suspend your account at our sole discretion for violations of these Terms of Service or fraudulent activity.</p>

              <h3 className="text-lg font-semibold text-gray-900 mt-6">7. Changes to Terms</h3>
              <p>We may modify these terms at any time. Continued use of the platform constitutes acceptance of modified terms.</p>

              <h3 className="text-lg font-semibold text-gray-900 mt-6">8. Contact</h3>
              <p>For questions about these Terms of Service, contact us at support@trabz.ph</p>
            </div>
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-4">
              <button
                onClick={() => setShowTermsModal(false)}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-20" onClick={() => setShowPrivacyModal(false)}>
          <div
            className="bg-white rounded-t-3xl w-full max-w-2xl max-h-[85vh] overflow-y-auto animate-slide-up shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Privacy Policy</h2>
                <button
                  onClick={() => setShowPrivacyModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="px-6 py-6 space-y-4 text-sm text-gray-700">
              <p className="text-gray-500 italic">Last updated: February 12, 2026</p>

              <h3 className="text-lg font-semibold text-gray-900 mt-6">1. Information We Collect</h3>
              <p>We collect information you provide directly to us, including:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Name, phone number, and email address</li>
                <li>Profile information and resume data</li>
                <li>Work history and skills</li>
                <li>Payment information</li>
                <li>Communications with us</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mt-6">2. How We Use Your Information</h3>
              <p>We use your information to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide, maintain, and improve our services</li>
                <li>Connect you with job opportunities</li>
                <li>Process payments and transactions</li>
                <li>Send you updates and notifications</li>
                <li>Prevent fraud and enhance security</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mt-6">3. Information Sharing</h3>
              <p>We do not sell your personal information. We may share your information with:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Employers when you apply for jobs</li>
                <li>Service providers who assist our operations</li>
                <li>Law enforcement when required by law</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mt-6">4. Data Security</h3>
              <p>We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.</p>

              <h3 className="text-lg font-semibold text-gray-900 mt-6">5. Your Rights</h3>
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mt-6">6. Cookies</h3>
              <p>We use cookies and similar technologies to enhance your experience and analyze platform usage.</p>

              <h3 className="text-lg font-semibold text-gray-900 mt-6">7. Changes to Privacy Policy</h3>
              <p>We may update this Privacy Policy. We will notify you of significant changes via email or platform notification.</p>

              <h3 className="text-lg font-semibold text-gray-900 mt-6">8. Contact</h3>
              <p>For privacy-related questions, contact us at privacy@trabz.ph</p>
            </div>
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-4">
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 flex flex-col">
      <div className="p-6">
        {step === 'phone' ? (
          <Link href="/" className="inline-block">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
        ) : (
          <button onClick={() => { setError(''); setStep(step === 'details' ? 'otp' : 'phone' as Step); }} className="inline-block">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
      </div>

      <div className="flex-1 px-6 pb-20">
        <div className="text-center mb-6">
          <Image src="/logo.svg" alt="Trabz" width={48} height={48} className="h-10 mx-auto mb-2" />
          <p className="text-gray-600 mt-2">
            {step === 'phone' && 'Create your free account'}
            {step === 'otp' && 'Verify your phone number'}
            {step === 'details' && 'Complete your profile'}
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center space-x-2 mb-6">
          {(['phone', 'otp', 'details'] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step === s ? 'bg-blue-600 text-white' :
                (['phone', 'otp', 'details'].indexOf(step) > i) ? 'bg-green-500 text-white' :
                'bg-gray-200 text-gray-500'
              }`}>
                {(['phone', 'otp', 'details'].indexOf(step) > i) ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : i + 1}
              </div>
              {i < 2 && <div className={`w-8 h-0.5 mx-1 ${(['phone', 'otp', 'details'].indexOf(step) > i) ? 'bg-green-500' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>
        )}

        {/* Step 1: Phone Number */}
        {step === 'phone' && (
          <div className="space-y-4">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="09171234567"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg tracking-wider"
                required
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-2">We&apos;ll send a verification code via SMS</p>
            </div>

            <button
              onClick={handleSendOtp}
              disabled={loading || !phone}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending Code...' : 'Send Verification Code'}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
              <div className="relative flex justify-center text-sm"><span className="bg-gradient-to-br from-blue-50 via-white to-yellow-50 px-4 text-gray-500">or</span></div>
            </div>

            <Link
              href="/dashboard"
              className="w-full flex items-center justify-center py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Continue as Guest
            </Link>

            <p className="text-center text-sm text-gray-600 mt-4">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-600 font-medium hover:text-blue-700">Log in</Link>
            </p>
          </div>
        )}

        {/* Step 2: OTP Verification */}
        {step === 'otp' && (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Enter the 6-digit code sent to <span className="font-semibold text-gray-900">{maskedPhone}</span>
              </p>
            </div>

            <div className="flex justify-center space-x-3" onPaste={handleOtpPaste}>
              {otpCode.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { otpRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  className="w-12 h-14 text-center text-2xl font-bold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  autoFocus={i === 0}
                />
              ))}
            </div>

            <button
              onClick={handleVerifyOtp}
              disabled={loading || otpCode.join('').length !== 6 || otpAttempts >= 5}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : otpAttempts >= 5 ? 'Too many attempts. Please request a new code.' : 'Verify Code'}
            </button>

            <div className="text-center">
              {resendCooldown > 0 ? (
                <p className="text-sm text-gray-500">Resend code in <span className="font-semibold">{resendCooldown}s</span></p>
              ) : (
                <button
                  onClick={handleResendOtp}
                  disabled={loading}
                  className="text-sm text-blue-600 font-medium hover:text-blue-700"
                >
                  Resend Code
                </button>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Account Details */}
        {step === 'details' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center space-x-2">
              <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-green-700">Phone verified: <span className="font-semibold">{maskedPhone}</span></p>
            </div>

            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input id="fullName" name="fullName" type="text" value={formData.fullName} onChange={handleChange} placeholder="Juan Dela Cruz" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required autoFocus />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="juan@example.com" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input id="password" name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} placeholder="Create a strong password" className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {showPassword ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    ) : (
                      <>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </>
                    )}
                  </svg>
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <input id="confirmPassword" name="confirmPassword" type={showPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={handleChange} placeholder="Re-enter your password" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>

            <div className="flex items-start">
              <input id="terms" type="checkbox" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500" required />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                I agree to Trabz&apos;s <button type="button" onClick={() => setShowTermsModal(true)} className="text-blue-600 hover:text-blue-700 underline">Terms of Service</button> and <button type="button" onClick={() => setShowPrivacyModal(true)} className="text-blue-600 hover:text-blue-700 underline">Privacy Policy</button>
              </label>
            </div>

            <button type="submit" disabled={!agreedToTerms || loading} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed">
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        )}
      </div>
    </div>
    </>
  );
}
