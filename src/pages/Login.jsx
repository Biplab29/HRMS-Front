import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  FiEye,
  FiEyeOff,
  FiFileText,
  FiLock,
  FiLogIn,
  FiUser,
} from "react-icons/fi";
import { loginUser, selectAuthLoading } from "../store/slices/authSlice";
import { getDashboardPath } from "../utils/roleRoutes";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector(selectAuthLoading);

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.identifier || !formData.password) {
      return toast.error("Email/Employee ID and password are required");
    }

    const toastId = toast.loading("Signing in...");

    const result = await dispatch(loginUser(formData));

    if (loginUser.fulfilled.match(result)) {
      toast.success(result.payload.message || "Login Successful", { id: toastId });
      const role = result.payload.user?.role;
      navigate(getDashboardPath(role));
    } else {
      toast.error(result.payload || "Login Failed", { id: toastId });
    }
  };


  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.25),transparent_40%)]" />
      <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg">
            <FiFileText size={28} />
          </div>

          <h1 className="mt-4 text-3xl font-bold text-steel-200 dark:text-white">
            HRMS Enterprise
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Sign in to access your workspace
          </p>
        </div>

        {/* Login Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-2xl backdrop-blur-xl"
        >
          <h2 className="text-xl font-semibold text-steel-200 dark:text-white">
            Welcome Back 👋
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Login using Email or Employee ID
          </p>

          {/* Identifier */}
          <div className="mt-6">
            <label className="mb-2 block text-sm text-slate-300">
              Email / Employee ID
            </label>

            <div className="flex items-center rounded-xl border border-slate-700 bg-slate-950 px-4">
              <FiUser className="text-slate-400" />

              <input
                type="text"
                name="identifier"
                placeholder="admin@gmail.com or EMP001"
                value={formData.identifier}
                onChange={handleChange}
                className="h-12 w-full bg-transparent px-3 text-steel-200 dark:text-white outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mt-5">
            <div className="mb-2 flex justify-between">
              <label className="text-sm text-slate-300">
                Password
              </label>

              <Link
                to="/forgot-password"
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                Forgot Password?
              </Link>
            </div>

            <div className="flex items-center rounded-xl border border-slate-700 bg-slate-950 px-4">
              <FiLock className="text-slate-400" />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="h-12 w-full bg-transparent px-3 text-steel-200 dark:text-white outline-none"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FiEyeOff className="text-slate-400" />
                ) : (
                  <FiEye className="text-slate-400" />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <label className="mt-5 flex items-center gap-2 text-sm text-slate-400">
            <input type="checkbox" />
            Remember me
          </label>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              "Signing In..."
            ) : (
              <>
                <FiLogIn />
                Sign In
              </>
            )}
          </button>

          {/* Signup Link */}
          <p className="mt-6 text-center text-sm text-slate-400">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-medium text-blue-400 hover:text-blue-300"
            >
              Create Account
            </Link>
          </p>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          Secure HR Management Platform
        </p>
      </div>
    </main>
  );
}

export default Login;
