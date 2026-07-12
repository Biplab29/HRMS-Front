import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FiBriefcase,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiShield,
  FiUser,
  FiUploadCloud,
  FiArrowLeft,
  FiKey
} from "react-icons/fi";
import { api } from "../services/api";

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      return toast.error("All fields are required");
    }
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    setLoading(true);
    const toastId = toast.loading("Creating account...");
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      if (profileImage) data.append("profileImage", profileImage);

      const response = await api.post("/auth/bootstrap-admin", data);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      toast.success("Account created successfully", { id: toastId });
      navigate("/admin/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink-950 px-4 py-8 bg-[linear-gradient(rgba(30,41,59,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(30,41,59,0.1)_1px,transparent_1px)] bg-[size:40px_40px]">
      <style>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus {
          -webkit-text-fill-color: white !important;
          -webkit-box-shadow: 0 0 0px 1000px #0c0a09 inset !important;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>

      {/* Floating Back to Home Link */}
      <Link
        to="/"
        className="absolute top-6 left-6 z-20 flex items-center gap-2 rounded-xl border border-ink-800 bg-ink-900/60 px-4 py-2 text-xs font-semibold text-steel-400 transition-all hover:bg-ink-800 hover:text-white hover:shadow-glow"
      >
        <FiArrowLeft /> Back to Home
      </Link>

      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(74,140,255,0.12),transparent_45%)]" />

      {/* Two-Column Layout Grid */}
      <section className="relative mx-auto grid min-h-[calc(100vh-6rem)] w-full max-w-6xl items-center gap-8 lg:grid-cols-[1fr_1.1fr] z-10 pt-10">
        
        {/* Left Column: Product Info & Core Guard Details */}
        <div className="hidden flex-col justify-center lg:flex text-left">
          <Link to="/" className="inline-flex w-max items-center gap-3 rounded-full border border-brand-500/20 bg-brand-500/10 px-5 py-2.5 text-brand-300 shadow-lg backdrop-blur-md mb-6">
            <FiShield size={16} />
            <span className="text-xs font-bold tracking-wide uppercase">PeopleGrid Security</span>
          </Link>

          <h1 className="max-w-md bg-gradient-to-br from-white via-steel-200 to-steel-500 bg-clip-text text-4xl lg:text-5xl font-extrabold leading-[1.15] tracking-tight text-transparent">
            Build the first secure HR workspace.
          </h1>

          <p className="mt-4 max-w-md text-sm leading-relaxed text-steel-400">
            Create the initial admin account once. After that, all new HR, manager, and employee accounts should be created through protected invite links to maintain absolute isolation.
          </p>

          <div className="mt-10 grid gap-4 max-w-md">
            {[
              { icon: FiShield, title: "Bootstrap Guard", body: "Account creation is restricted once the database has an admin." },
              { icon: FiMail, title: "Secure Invites Only", body: "HR and Admin roles invite staff via signed, time-locked links." },
              { icon: FiKey, title: "Role-Based Access", body: "Strict access control separates employee viewports from admin consoles." },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="group flex gap-4 rounded-xl border border-ink-800 bg-ink-900/40 p-4 transition-all duration-300 hover:bg-ink-800/60 hover:shadow-lg"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-500/10 text-brand-400 transition-colors group-hover:bg-brand-500 group-hover:text-white">
                  <feature.icon size={18} />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-white">{feature.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-steel-400">
                    {feature.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Refined Form Panel */}
        <div className="flex justify-center w-full">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-xl rounded-[2rem] border border-ink-800 bg-ink-900/90 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl"
          >
            {/* Logo display on smaller screens */}
            <div className="flex items-center gap-3.5 mb-6 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-indigo-600 text-white shadow-md">
                <FiBriefcase size={20} />
              </div>
              <h2 className="text-xl font-bold text-white font-display">PeopleGrid</h2>
            </div>

            <h2 className="text-xl font-bold text-white">Create Account</h2>
            <p className="mt-1 mb-6 text-sm text-steel-400">Get started with PeopleGrid initial workspace setup</p>

            <div className="space-y-4">
              
              {/* Row 1: Name and Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-xs text-steel-300 ml-1">Full Name</span>
                  <div className="flex items-center rounded-xl border border-ink-700 bg-ink-950 px-3 mt-1.5 focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500 transition-all overflow-hidden">
                    <FiUser className="text-steel-500 shrink-0" size={16} />
                    <input
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      autoComplete="off"
                      className="h-10 w-full flex-1 bg-transparent px-2.5 text-sm text-white outline-none border-none focus:ring-0"
                      placeholder="Sarah Connor"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="text-xs text-steel-300 ml-1">Work Email</span>
                  <div className="flex items-center rounded-xl border border-ink-700 bg-ink-950 px-3 mt-1.5 focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500 transition-all overflow-hidden">
                    <FiMail className="text-steel-500 shrink-0" size={16} />
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      autoComplete="off"
                      className="h-10 w-full flex-1 bg-transparent px-2.5 text-sm text-white outline-none border-none focus:ring-0"
                      placeholder="sarah@company.com"
                    />
                  </div>
                </label>
              </div>

              {/* Row 2: Password and Confirm Password */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-xs text-steel-300 ml-1">Password</span>
                  <div className="flex items-center rounded-xl border border-ink-700 bg-ink-950 px-3 mt-1.5 focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500 transition-all overflow-hidden">
                    <FiLock className="text-steel-500 shrink-0" size={16} />
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      className="h-10 w-full flex-1 bg-transparent px-2.5 text-sm text-white outline-none border-none focus:ring-0"
                      placeholder="••••••••"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="p-1 focus:outline-none text-steel-500 hover:text-steel-300">
                      {showPassword ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                    </button>
                  </div>
                </label>

                <label className="block">
                  <span className="text-xs text-steel-300 ml-1">Confirm Password</span>
                  <div className="flex items-center rounded-xl border border-ink-700 bg-ink-950 px-3 mt-1.5 focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500 transition-all overflow-hidden">
                    <FiLock className="text-steel-500 shrink-0" size={16} />
                    <input
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="h-10 w-full flex-1 bg-transparent px-2.5 text-sm text-white outline-none border-none focus:ring-0"
                      placeholder="••••••••"
                    />
                  </div>
                </label>
              </div>

              {/* Row 3: Profile Image */}
              <label className="block">
                <span className="text-xs text-steel-300 ml-1">Profile Image (Optional)</span>
                <div className="flex items-center gap-3.5 mt-1.5 p-2 rounded-xl border border-ink-700 bg-ink-950 transition-all focus-within:border-brand-500">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-10 w-10 shrink-0 rounded-full object-cover border-2 border-brand-500/30 shadow-lg"
                    />
                  ) : (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink-900 border border-ink-800 text-steel-500 shadow-inner">
                      <FiUploadCloud size={16} />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="block w-full text-[11px] text-steel-400 file:mr-2.5 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-[10px] file:font-semibold file:bg-brand-500/10 file:text-brand-400 hover:file:bg-brand-500/20 file:cursor-pointer cursor-pointer focus:outline-none"
                    />
                  </div>
                </div>
              </label>

            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-500 font-bold text-white transition hover:bg-brand-600 disabled:opacity-50 shadow-lg shadow-brand-500/20 active:scale-[0.98] text-sm"
            >
              {loading ? "Creating Account..." : <><FiShield /> Create Admin Account</>}
            </button>

            {/* Login Link */}
            <p className="mt-5 text-center text-xs text-steel-400">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-brand-400 hover:underline transition-colors hover:text-brand-300">
                Log in
              </Link>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}

export default Signup;