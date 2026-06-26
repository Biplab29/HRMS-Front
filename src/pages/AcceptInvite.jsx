import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FiArrowRight,
  FiCheckCircle,
  FiEye,
  FiEyeOff,
  FiFileText,
  FiLock,
  FiMail,
  FiShield,
} from "react-icons/fi";
import { api } from "../services/api";

const initialForm = {
  password: "",
  confirmPassword: "",
};

function AcceptInvite() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [formData, setFormData] = useState(initialForm);
  const [invite, setInvite] = useState(null);
  const [checkingInvite, setCheckingInvite] = useState(Boolean(token));
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const verifyInvite = async () => {
      if (!token) {
        setCheckingInvite(false);
        return;
      }

      try {
        const { data } = await api.get("/auth/invite/verify", {
          params: { token },
        });

        if (isMounted) {
          setInvite(data);
        }
      } catch (error) {
        if (isMounted) {
          toast.error(
            error.response?.data?.message || "Invalid or expired invite link"
          );
        }
      } finally {
        if (isMounted) {
          setCheckingInvite(false);
        }
      }
    };

    verifyInvite();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!token) {
      return toast.error("Invite token is missing");
    }

    if (formData.password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    if (formData.password !== formData.confirmPassword) {
      return toast.error("Password confirmation does not match");
    }

    const toastId = toast.loading("Activating your account...");

    try {
      setLoading(true);
      const { data } = await api.post("/auth/accept-invite", {
        token,
        ...formData,
      });

      toast.success(data.message || "Account activated", { id: toastId });
      navigate("/");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Could not accept this invite",
        { id: toastId }
      );
    } finally {
      setLoading(false);
    }
  };

  const inviteUser = invite?.user;
  const inviteDisabled = checkingInvite || !token || !inviteUser;

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink-950 px-4 py-8 text-steel-200">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(74,140,255,0.22),transparent_34%),linear-gradient(135deg,rgba(37,201,121,0.08),transparent_40%)]" />
      <div className="absolute -bottom-20 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-brand-500/10 blur-3xl" />

      <section className="relative w-full max-w-xl rounded-3xl border border-ink-650 bg-ink-850/85 p-6 shadow-console backdrop-blur-xl sm:p-8">
        <div className="text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500 text-2xl text-white shadow-lg shadow-brand-500/20">
            <FiFileText aria-hidden="true" />
          </span>
          <p className="mt-5 text-sm font-semibold text-brand-300">
            HRMS Enterprise
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-steel-200 dark:text-white">
            Accept your invite
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-steel-400">
            Set your password to activate your workspace account.
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-ink-650 bg-ink-950/70 p-4">
          {checkingInvite ? (
            <div className="animate-pulse space-y-3">
              <div className="h-4 w-1/2 rounded bg-ink-650" />
              <div className="h-3 w-3/4 rounded bg-ink-700" />
            </div>
          ) : inviteUser ? (
            <div className="flex items-center gap-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-success/10 text-success">
                <FiCheckCircle aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-sm font-semibold text-steel-200 dark:text-white">
                  Invite verified for {inviteUser.name}
                </h2>
                <p className="mt-1 flex items-center gap-2 text-xs text-steel-400">
                  <FiMail aria-hidden="true" />
                  {inviteUser.email}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-danger/10 text-danger">
                <FiShield aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-sm font-semibold text-steel-200 dark:text-white">
                  Invite link unavailable
                </h2>
                <p className="mt-1 text-xs leading-5 text-steel-400">
                  The token is missing, expired, or has already been used.
                </p>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm text-steel-300">
              New password
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
                disabled={inviteDisabled}
              />
              <button
                type="button"
                className="text-steel-500 transition hover:text-steel-200 dark:text-white disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => setShowPassword((value) => !value)}
                disabled={inviteDisabled}
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
                disabled={inviteDisabled}
              />
            </span>
          </label>

          <button
            type="submit"
            disabled={inviteDisabled || loading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-500 text-sm font-semibold text-white transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Activating..." : "Activate Account"}
            {!loading && <FiArrowRight aria-hidden="true" />}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-steel-400">
          Already activated?{" "}
          <Link className="font-semibold text-brand-300 hover:text-steel-200 dark:text-white" to="/">
            Log in
          </Link>
        </p>
      </section>
    </main>
  );
}

export default AcceptInvite;
