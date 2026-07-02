import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FiArrowLeft, FiMail, FiCheckCircle } from "react-icons/fi";
import { forgotPassword } from "../services/hrms";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email) {
      return toast.error("Please enter your registered email address");
    }

    setLoading(true);
    const toastId = toast.loading("Sending request...");
    
    try {
      const response = await forgotPassword({ email });
      setLoading(false);
      if (response.success) {
        toast.success(response.message || "Request sent successfully", { id: toastId });
        setSubmitted(true);
      } else {
        toast.error(response.message || "Failed to send request", { id: toastId });
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || "Something went wrong", { id: toastId });
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink-950 px-4 bg-[linear-gradient(rgba(30,41,59,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(30,41,59,0.1)_1px,transparent_1px)] bg-[size:40px_40px]">
      
      {/* Back to Login */}
      <Link
        to="/login"
        className="absolute top-6 left-6 z-10 flex items-center gap-2 rounded-xl border border-ink-800 bg-ink-900/60 px-4 py-2 text-xs font-semibold text-steel-400 transition-all hover:bg-ink-800 hover:text-white hover:shadow-glow"
      >
        <FiArrowLeft /> Back to Login
      </Link>

      {/* Background radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(74,140,255,0.15),transparent_40%)]" />

      <div className="relative w-full max-w-md">
        
        {/* Card Form */}
        <div className="rounded-[2rem] border border-ink-800 bg-ink-900/90 p-8 shadow-2xl backdrop-blur-2xl">
          {!submitted ? (
            <form onSubmit={handleSubmit}>
              <h2 className="text-xl font-bold text-white">Reset Password</h2>
              <p className="mt-1 mb-6 text-sm text-steel-400">
                Enter your registered email address below, and we will send you a password reset link.
              </p>

              {/* Email Input */}
              <div className="mt-6">
                <label className="mb-2 block text-sm text-steel-300">Registered Email</label>
                <div className="flex items-center rounded-xl border border-ink-700 bg-ink-950 px-4 focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500 transition-all overflow-hidden">
                  <FiMail className="text-steel-500" />
                  <input
                    type="email"
                    name="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 w-full flex-1 bg-transparent px-3 text-sm text-white outline-none focus:outline-none focus:ring-0 border-none"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="mt-8 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-500 font-bold text-white transition hover:bg-brand-600 disabled:opacity-50 shadow-lg shadow-brand-500/20"
              >
                {loading ? "Sending link..." : "Send Reset Link"}
              </button>
            </form>
          ) : (
            <div className="text-center py-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-500/10 text-brand-400">
                <FiCheckCircle size={36} />
              </div>
              <h2 className="mt-4 text-xl font-bold text-white">Request Sent</h2>
              <p className="mt-2 text-sm text-steel-400">
                If the email address <strong>{email}</strong> is registered with an account, you will receive a password reset link shortly.
              </p>
              <p className="text-xs text-steel-500 mt-4">
                Please check your inbox and spam folder.
              </p>
              <Link
                to="/login"
                className="mt-8 inline-flex h-12 items-center justify-center rounded-xl bg-brand-500 px-6 font-bold text-white transition hover:bg-brand-600 shadow-lg shadow-brand-500/20"
              >
                Return to Login
              </Link>
            </div>
          )}
        </div>

        <p className="mt-8 text-center text-xs text-steel-600">
          Secure HR Management System
        </p>
      </div>
    </main>
  );
}

export default ForgotPassword;
