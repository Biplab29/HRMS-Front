import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FiArrowRight,
  FiBriefcase,
  FiEye,
  FiEyeOff,
  FiFileText,
  FiLock,
  FiMail,
  FiShield,
  FiUser,
} from "react-icons/fi";
import { api } from "../services/api";

const initialForm = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      return toast.error("Name, email and password are required");
    }

    if (formData.password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    if (formData.password !== formData.confirmPassword) {
      return toast.error("Password confirmation does not match");
    }

    const toastId = toast.loading("Creating admin account...");

    try {
      setLoading(true);
      const { data } = await api.post("/auth/bootstrap-admin", formData);

      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success(data.message || "Admin account created", { id: toastId });
      navigate("/admin/dashboard");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Signup is only available before the first admin is created",
        { id: toastId }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-ink-950 px-4 py-8 text-steel-200">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(74,140,255,0.22),transparent_34%),radial-gradient(circle_at_80%_20%,rgba(37,201,121,0.12),transparent_28%)]" />
      <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-brand-500/10 to-transparent" />

      <section className="relative mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-5xl items-center gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="hidden rounded-3xl border border-ink-650 bg-ink-850/70 p-8 shadow-console backdrop-blur-xl lg:block">
          <div className="inline-flex items-center gap-3 rounded-2xl border border-brand-400/20 bg-brand-500/10 px-4 py-3 text-brand-300">
            <FiFileText aria-hidden="true" />
            <span className="text-sm font-semibold">HRMS Enterprise</span>
          </div>

          <h1 className="mt-10 max-w-md text-5xl font-semibold leading-tight tracking-[-0.04em] text-steel-200 dark:text-white">
            Build the first secure HR workspace.
          </h1>

          <p className="mt-5 max-w-lg text-sm leading-6 text-steel-400">
            Create the initial admin account once. After that, all new HR,
            manager, and employee accounts should be created through protected
            invite links.
          </p>

          <div className="mt-10 grid gap-4">
            {[
              ["Bootstrap Guard", "Only works while the user database is empty."],
              ["Invite Ready", "Admin and HR users can invite employees later."],
              ["Secure Cookies", "Login sessions are stored with HTTP-only cookies."],
            ].map(([title, body]) => (
              <div
                key={title}
                className="flex gap-4 rounded-2xl border border-ink-650 bg-ink-900/70 p-4"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500/15 text-brand-300">
                  <FiShield aria-hidden="true" />
                </span>
                <div>
                  <h2 className="text-sm font-semibold text-steel-200 dark:text-white">{title}</h2>
                  <p className="mt-1 text-xs leading-5 text-steel-400">
                    {body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-ink-650 bg-ink-850/85 p-6 shadow-console backdrop-blur-xl sm:p-8"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500 text-xl text-white shadow-lg shadow-brand-500/20">
              <FiBriefcase aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold text-brand-300">
                HRMS Enterprise
              </p>
              <h2 className="text-2xl font-semibold text-steel-200 dark:text-white">
                Create admin account
              </h2>
            </div>
          </div>

          <p className="mt-4 text-sm leading-6 text-steel-400">
            Use this only for first-time setup. If your company already has an
            admin, ask them to send you an invite link.
          </p>

          <div className="mt-8 space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm text-steel-300">
                Full name
              </span>
              <span className="flex items-center rounded-xl border border-ink-650 bg-ink-950 px-4 transition focus-within:border-brand-400">
                <FiUser className="text-steel-500" aria-hidden="true" />
                <input
                  className="h-12 w-full bg-transparent px-3 text-sm text-steel-200 dark:text-white outline-none placeholder:text-steel-500"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Jane Doe"
                  autoComplete="name"
                />
              </span>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm text-steel-300">
                Work email
              </span>
              <span className="flex items-center rounded-xl border border-ink-650 bg-ink-950 px-4 transition focus-within:border-brand-400">
                <FiMail className="text-steel-500" aria-hidden="true" />
                <input
                  className="h-12 w-full bg-transparent px-3 text-sm text-steel-200 dark:text-white outline-none placeholder:text-steel-500"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@company.com"
                  autoComplete="email"
                />
              </span>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm text-steel-300">
                Password
              </span>
              <span className="flex items-center rounded-xl border border-ink-650 bg-ink-950 px-4 transition focus-within:border-brand-400">
                <FiLock className="text-steel-500" aria-hidden="true" />
                <input
                  className="h-12 w-full bg-transparent px-3 text-sm text-steel-200 dark:text-white outline-none placeholder:text-steel-500"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="text-steel-500 transition hover:text-steel-200 dark:text-white"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </span>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm text-steel-300">
                Confirm password
              </span>
              <span className="flex items-center rounded-xl border border-ink-650 bg-ink-950 px-4 transition focus-within:border-brand-400">
                <FiLock className="text-steel-500" aria-hidden="true" />
                <input
                  className="h-12 w-full bg-transparent px-3 text-sm text-steel-200 dark:text-white outline-none placeholder:text-steel-500"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
              </span>
            </label>
          </div>

          <button
            className="mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-500 text-sm font-semibold text-white transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create Admin Account"}
            {!loading && <FiArrowRight aria-hidden="true" />}
          </button>

          <p className="mt-6 text-center text-sm text-steel-400">
            Already have an account?{" "}
            <Link className="font-semibold text-brand-300 hover:text-steel-200 dark:text-white" to="/">
              Log in
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}

export default Signup;
