import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  FiEye,
  FiEyeOff,
  FiBriefcase,
  FiLock,
  FiLogIn,
  FiUser,
  FiArrowLeft,
} from "react-icons/fi";
import { loginUser, selectAuthLoading } from "../store/slices/authSlice";
import { getDashboardPath } from "../utils/roleRoutes";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector(selectAuthLoading);

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ identifier: "", password: "" });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
      navigate(getDashboardPath(result.payload.user?.role));
    } else {
      toast.error(result.payload || "Login Failed", { id: toastId });
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink-950 px-4 bg-[linear-gradient(rgba(30,41,59,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(30,41,59,0.1)_1px,transparent_1px)] bg-[size:40px_40px]">
      
      {/* Floating Back to Home Link */}
      <Link
        to="/"
        className="absolute top-6 left-6 z-10 flex items-center gap-2 rounded-xl border border-ink-800 bg-ink-900/60 px-4 py-2 text-xs font-semibold text-steel-400 transition-all hover:bg-ink-800 hover:text-white hover:shadow-glow"
      >
        <FiArrowLeft /> Back to Home
      </Link>

      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(74,140,255,0.15),transparent_40%)]" />

      <div className="relative w-full max-w-md">
        {/* Logo Section */}
        <Link to="/" className="mb-8 block text-center group">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-indigo-600 text-white shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform duration-200">
            <FiBriefcase size={28} />
          </div>
          <h1 className="mt-4 text-3xl font-bold text-white group-hover:text-brand-400 transition-colors">PeopleGrid</h1>
          <p className="mt-2 text-sm text-steel-400">Welcome back to your workspace</p>
        </Link>

        {/* Login Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-[2rem] border border-ink-800 bg-ink-900/90 p-8 shadow-2xl backdrop-blur-2xl"
        >
          <h2 className="text-xl font-bold text-white">Sign In</h2>
          <p className="mt-1 mb-6 text-sm text-steel-400">Enter your credentials to access PeopleGrid</p>

          {/* Identifier */}
          <div className="mt-6">
            <label className="mb-2 block text-sm text-steel-300">Email / Employee ID</label>
            <div className="flex items-center rounded-xl border border-ink-700 bg-ink-950 px-4 focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500 transition-all overflow-hidden">
              <FiUser className="text-steel-500" />
              <input
                type="text"
                name="identifier"
                placeholder="admin@grid.com"
                value={formData.identifier}
                onChange={handleChange}
                className="h-12 w-full flex-1 bg-transparent px-3 text-sm text-white outline-none focus:outline-none focus:ring-0 border-none"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mt-5">
            <div className="mb-2 flex justify-between">
              <label className="text-sm text-steel-300">Password</label>
              <Link to="/forgot-password" className="text-sm text-brand-400 hover:text-brand-300">Forgot?</Link>
            </div>
            <div className="flex items-center rounded-xl border border-ink-700 bg-ink-950 px-4 focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500 transition-all overflow-hidden">
              <FiLock className="text-steel-500" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="h-12 w-full flex-1 bg-transparent px-3 text-sm text-white outline-none focus:outline-none focus:ring-0 border-none"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="focus:outline-none p-1">
                {showPassword ? <FiEyeOff className="text-steel-500" /> : <FiEye className="text-steel-500" />}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-8 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-500 font-bold text-white transition hover:bg-brand-600 disabled:opacity-50 shadow-lg shadow-brand-500/20"
          >
            {loading ? "Signing In..." : <><FiLogIn /> Sign In</>}
          </button>

          {/* Signup Link */}
          <p className="mt-6 text-center text-sm text-steel-400">
            New to PeopleGrid?{" "}
            <Link to="/signup" className="font-semibold text-brand-400 hover:underline">Create Account</Link>
          </p>
        </form>

        <p className="mt-8 text-center text-xs text-steel-600">
          Secure HR Management System
        </p>
      </div>
    </main>
  );
}

export default Login;