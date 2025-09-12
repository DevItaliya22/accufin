"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { EyeClosedIcon, EyeIcon } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const [showTerms, setShowTerms] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) {
      toast.error("Please agree to the Terms & Conditions to continue.");
      return;
    }
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      if (res?.error) {
        const msg = res.error.includes("inactive")
          ? "Your account is inactive. You can't login."
          : res.error;
        toast.error(msg);
      } else {
        setShowWelcome(true);
        router.push("/dashboard");
      }
    } catch (err) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const inactive = searchParams?.get("inactive");
    if (inactive === "1") {
      toast.error("Your account is inactive. You can't login.");
    }
  }, [searchParams]);

  useEffect(() => {
    if (session) {
      // Show welcome message for Google login
      if (session.user?.name) {
        toast.success(`Welcome back, ${session.user.name}!`);
      }
      router.push("/dashboard");
    }
  }, [session, router]);

  // Handle Google login specifically
  useEffect(() => {
    const handleGoogleLogin = () => {
      if (session?.user?.name && !showWelcome) {
        setShowWelcome(true);
        toast.success(`Welcome back, ${session.user.name}!`);
      }
    };

    // Check for Google login after a delay
    const timer = setTimeout(handleGoogleLogin, 1500);
    return () => clearTimeout(timer);
  }, [session, showWelcome]);

  const toggleTerms = () => {
    setShowTerms(!showTerms);
  };

  

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center items-center space-x-2">
          <img
            src="/image-000.png"
            alt="Accufin Logo"
            className="h-16 w-auto"
          />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6  " onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 pr-12 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                />
                
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 focus:outline-none"
                  tabIndex={0}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeIcon className="w-5 h-5 text-gray-500" />
                  ) : (
                    <EyeClosedIcon className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                
              </div>
              
            </div>

            <div className="flex items-center justify-end">
              <div className="text-sm">
                <Link
                  href="/forgot-password"
                  className="font-medium text-[#007399] hover:text-[#0082a3] focus:outline-none"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  id="agree-terms"
                  name="agree-terms"
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
                />
                <label htmlFor="agree-terms" className="block text-sm text-gray-900">
                  I agree to the
                </label>
                <button
                  type="button"
                  onClick={() => setShowTerms(true)}
                  className="text-[#007399] hover:underline focus:outline-none text-sm"
                >
                  Terms & Conditions
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#007399] hover:bg-[#0082a3] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={loading || !agreedToTerms}
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </div>
            <div className="mt-4">
              <button
                type="button"
                onClick={() => {
                  setGoogleLoading(true);
                  signIn("google");
                }}
                disabled={googleLoading}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {googleLoading ? (
                  "Signing in with Google..."
                ) : (
                  <>
                    <img src="/google.svg" alt="Google" className="w-5 h-5 mr-2" />
                    Sign in with Google
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Don't have an account?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/register"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-[#007399] bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
              >
                Create new account
              </Link>
            </div>
          </div>
        </div>
      </div>

      {showTerms && (
        <div className="fixed inset-0 bg-[#00000043] backdrop-blur-[3px] bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 pt-0 pb-0">
            <div className="flex justify-between items-center mb-4 sticky top-0 bg-white py-4">
              <h2 className="text-2xl font-bold">Privacy Policy</h2>
              <button
                onClick={toggleTerms}
                className="text-gray-500 hover:text-gray-700 focus:outline-none text-2xl"
                aria-label="Close"
              >
                &times;
              </button>
            </div>

            <div className="space-y-6">
              <div className="border-b pb-2">
                <p className="font-semibold">Effective Date: March 1, 2025</p>
                <p className="font-semibold">Last Updated: March 1, 2025</p>
              </div>

              <p className="text-lg">
                Accufin Services Inc. is committed to protecting the privacy and security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your data when you use our bookkeeping, accounting, and payroll services in Canada.
              </p>

              <div className="space-y-4">
                <h3 className="text-xl font-bold">1. Information We Collect</h3>
                <p>We collect only information necessary to deliver our services, including:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>Personal Identifiers:</strong> Name, address, phone, email, SIN (for payroll)</li>
                  <li><strong>Business Details:</strong> Business name, CRA business number, incorporation documents</li>
                  <li><strong>Financial Data:</strong> Bank statements, invoices, receipts, tax filings, expense reports, payroll records</li>
                  <li><strong>Technical Information:</strong> IP address, browser type, usage data (via website analytics)</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold">2. How We Use Your Information</h3>
                <p>Your data is used strictly for:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Providing bookkeeping, accounting, tax, or payroll services</li>
                  <li>Filing documents with the CRA (e.g., GST/HST, T4s, corporate taxes)</li>
                  <li>Communicating service updates or regulatory changes</li>
                  <li>Improving our services and website experience</li>
                  <li>Complying with legal obligations (e.g., audits, anti-fraud laws)</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold">3. How We Share Your Information</h3>
                <p>We do not sell your data. Disclosures are limited to:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>Regulatory Bodies:</strong> CRA, Revenu Québec, or other tax authorities as legally required</li>
                  <li><strong>Third-Party Service Providers:</strong> Secure cloud accounting platforms (e.g., QuickBooks, Xero), payroll software, or encrypted document storage tools—all bound by confidentiality agreements</li>
                  <li><strong>Legal Compliance:</strong> If compelled by court order, subpoena, or lawful request</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold">4. Data Security</h3>
                <p>We implement rigorous measures to protect your information:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>Encryption:</strong> Data transmitted/stored via SSL/TLS encryption</li>
                  <li><strong>Access Controls:</strong> Role-based access limited to authorized staff</li>
                  <li><strong>Secure Tools:</strong> Industry-standard platforms (e.g., QuickBooks Secure, Xero)</li>
                  <li><strong>Training:</strong> Staff trained in privacy best practices and PIPEDA compliance</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold">5. Data Retention</h3>
                <p>We retain your information only as long as necessary:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>Active Clients:</strong> For the duration of our service agreement</li>
                  <li><strong>Inactive Clients:</strong> 7 years (to comply with CRA record-keeping requirements)</li>
                </ul>
                <p>After this period, data is securely destroyed.</p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold">6. Your Rights</h3>
                <p>Under PIPEDA, you have the right to:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>Access:</strong> Request a copy of your personal data</li>
                  <li><strong>Correct:</strong> Update inaccurate or incomplete information</li>
                  <li><strong>Withdraw Consent:</strong> Opt out of non-essential communications (e.g., newsletters)</li>
                  <li><strong>Complain:</strong> Contact the Office of the Privacy Commissioner of Canada if concerned about our practices</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold">7. Cross-Border Data Transfers</h3>
                <p>Your data is stored in Canada whenever possible. If transferred internationally (e.g., via cloud servers in the U.S.), we ensure providers comply with PIPEDA-equivalent safeguards (e.g., GDPR for EU data).</p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold">8. Cookies & Tracking</h3>
                <p>Our website may use cookies to:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Enhance user experience (e.g., login sessions)</li>
                  <li>Collect anonymized analytics (via tools like Google Analytics)</li>
                </ul>
                <p>You can disable cookies via your browser settings.</p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold">9. Children's Privacy</h3>
                <p>Our services are not directed to individuals under 18. We do not knowingly collect their data.</p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold">10. Updates to This Policy</h3>
                <p>We may update this policy to reflect legal changes. The "Last Updated" date will be revised, and significant changes will be communicated via email or our website.</p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold">11. Contact Us</h3>
                <p>For privacy requests or questions:</p>
                <p>Email: <a href="mailto:info.accufin@gmail.com" className="text-[#007399] hover:underline">info.accufin@gmail.com</a></p>
              </div>
            </div>

            <div className="mt-8 flex justify-end sticky bottom-0 bg-white py-4">
              <button
                onClick={toggleTerms}
                className="bg-[#007399] hover:bg-[#005f7a] text-white font-semibold px-6 py-2 rounded transition-colors"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}
