import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { selectUser } from '../store/slices/authSlice.js'
import { getStoredUser, getDashboardPath } from '../utils/roleRoutes.js'
import { fetchAttendance, selectAttendanceRecords } from '../store/slices/attendanceSlice.js'
import { fetchLeaves, selectLeaves } from '../store/slices/leaveSlice.js'
import { useTheme } from '../context/ThemeContext.jsx'
import {
  FiBriefcase,
  FiClock,
  FiCheckCircle,
  FiCalendar,
  FiUsers,
  FiTrendingUp,
  FiArrowRight,
  FiMenu,
  FiX,
  FiLock,
  FiLayout,
  FiFileText,
  FiUserCheck,
  FiShield,
  FiActivity,
  FiPlay,
  FiSun,
  FiMoon
} from 'react-icons/fi'

function Home() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const reduxUser = useSelector(selectUser)
  const storedUser = getStoredUser()
  const user = reduxUser || storedUser
  const isLoggedIn = !!user

  const attendance = useSelector(selectAttendanceRecords)
  const leaves = useSelector(selectLeaves)
  const { theme, toggleTheme } = useTheme()

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mockClockedIn, setMockClockedIn] = useState(false)
  const [mockTime, setMockTime] = useState('09:00 AM')
  const [activeTab, setActiveTab] = useState('compliance')

  // Handle scroll detection for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Dynamic time simulation for the mock dashboard
  useEffect(() => {
    const interval = setInterval(() => {
      const date = new Date()
      let hours = date.getHours()
      const minutes = date.getMinutes()
      const ampm = hours >= 12 ? 'PM' : 'AM'
      hours = hours % 12
      hours = hours ? hours : 12 // the hour '0' should be '12'
      const strMinutes = minutes < 10 ? '0' + minutes : minutes
      setMockTime(`${hours}:${strMinutes} ${ampm}`)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Fetch data if logged in
  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchAttendance())
      dispatch(fetchLeaves())
    }
  }, [dispatch, isLoggedIn])

  const handleCtaClick = () => {
    if (isLoggedIn) {
      navigate(getDashboardPath(user.role))
    } else {
      navigate('/login')
    }
  }

  const toggleMockClock = () => {
    setMockClockedIn(!mockClockedIn)
  }

  const realOnTimeRate = isLoggedIn && attendance.length
    ? Math.round((attendance.filter(item => item.status === 'present').length / attendance.length) * 100)
    : 98.5

  const realLeaveLeft = isLoggedIn
    ? Math.max(12 - leaves.filter(l => l.status === 'approved').length, 0)
    : 12

  return (
    <div className="min-h-screen bg-ink-950 text-steel-200 overflow-x-hidden font-sans selection:bg-brand-500/30 selection:text-white transition-colors duration-300">
      {/* ─── Glowing Background Blobs ─────────────────── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-15%] w-[50%] h-[50%] rounded-full bg-blue-400/10 dark:bg-brand-600/10 mix-blend-multiply dark:mix-blend-screen filter blur-[120px] animate-blob"></div>
        <div className="absolute top-[25%] right-[-15%] w-[45%] h-[45%] rounded-full bg-indigo-300/10 dark:bg-brand-400/10 mix-blend-multiply dark:mix-blend-screen filter blur-[130px] animate-blob" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-[-10%] left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-100/10 dark:bg-indigo-500/5 mix-blend-multiply dark:mix-blend-screen filter blur-[150px] animate-blob" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* ─── Header / Navigation ─────────────────────── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
          scrolled
            ? 'bg-white/80 dark:bg-ink-900/80 backdrop-blur-md border-slate-100 dark:border-ink-800 shadow-lg'
            : 'bg-transparent border-transparent'
        }`}
      >
        <div className="mx-auto max-w-7xl px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-indigo-600 text-white shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform duration-200">
              <FiBriefcase size={20} />
            </div>
            <span className="font-display text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              People<span className="text-brand-500 dark:text-brand-400">Grid</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-slate-600 dark:text-steel-400 hover:text-slate-900 dark:hover:text-white transition-colors">Features</a>
            <a href="#dashboard-preview" className="text-sm font-medium text-slate-600 dark:text-steel-400 hover:text-slate-900 dark:hover:text-white transition-colors">Dashboard</a>
            <a href="#metrics" className="text-sm font-medium text-slate-600 dark:text-steel-400 hover:text-slate-900 dark:hover:text-white transition-colors">Performance</a>
            <a href="#testimonials" className="text-sm font-medium text-slate-600 dark:text-steel-400 hover:text-slate-900 dark:hover:text-white transition-colors">Reviews</a>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-ink-800 bg-white/50 dark:bg-ink-900/40 text-slate-600 dark:text-steel-400 hover:border-slate-300 dark:hover:border-ink-750 hover:bg-slate-50 dark:hover:bg-ink-800 hover:text-slate-900 dark:hover:text-white active:scale-95 transition-all"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>

            {isLoggedIn ? (
              <Link
                to={getDashboardPath(user.role)}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-brand-500 px-5 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 hover:bg-brand-600 hover:shadow-brand-500/35 transition-all duration-200 active:scale-95"
              >
                Go to Dashboard <FiArrowRight size={14} />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-600 dark:text-steel-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-brand-gradient px-5 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 hover:scale-[1.02] hover:shadow-brand-500/40 transition-all duration-200 active:scale-95"
                >
                  Create Admin
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg border border-slate-200 dark:border-ink-800 bg-white/60 dark:bg-ink-900/60 text-slate-600 dark:text-steel-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 right-0 border-b border-slate-200 dark:border-ink-800 bg-white/95 dark:bg-ink-900/95 backdrop-blur-lg p-6 flex flex-col gap-6 shadow-2xl animate-fade-in text-slate-700 dark:text-steel-300">
            <nav className="flex flex-col gap-4">
              <a
                href="#features"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-base font-semibold text-slate-600 dark:text-steel-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Features
              </a>
              <a
                href="#dashboard-preview"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-base font-semibold text-slate-600 dark:text-steel-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Dashboard Preview
              </a>
              <a
                href="#metrics"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-base font-semibold text-slate-600 dark:text-steel-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Performance
              </a>
              <a
                href="#testimonials"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-base font-semibold text-slate-600 dark:text-steel-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Reviews
              </a>
            </nav>
            <hr className="border-slate-200 dark:border-ink-800" />
            <div className="flex flex-col gap-3">
              {/* Theme Toggle inside mobile drawer */}
              <button
                onClick={() => { toggleTheme(); setIsMobileMenuOpen(false); }}
                className="flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-ink-700 bg-slate-50 dark:bg-ink-950 font-bold"
              >
                {theme === 'dark' ? <><FiSun /> Switch to Light Mode</> : <><FiMoon /> Switch to Dark Mode</>}
              </button>

              {isLoggedIn ? (
                <Link
                  to={getDashboardPath(user.role)}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-500 font-bold text-white shadow-lg"
                >
                  Go to Dashboard <FiArrowRight />
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex h-12 items-center justify-center rounded-xl border border-slate-200 dark:border-ink-700 bg-slate-50 dark:bg-ink-950 font-bold hover:bg-slate-100 dark:hover:bg-ink-900 transition"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex h-12 items-center justify-center rounded-xl bg-brand-500 font-bold text-white shadow-lg hover:bg-brand-600 transition"
                  >
                    Bootstrap Admin Account
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ─── Hero Section ────────────────────────────── */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 max-w-7xl mx-auto px-6 z-10">
        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-12 items-center">
          {/* Left Side Hero Details */}
          <div className="text-left flex flex-col justify-center">
            {/* Small badge */}
            <div className="inline-flex w-max items-center gap-2 rounded-full border border-blue-200 dark:border-brand-500/20 bg-blue-50 dark:bg-brand-500/10 px-3 py-1.5 text-blue-600 dark:text-brand-300 shadow-sm mb-6">
              <span className="text-[10px] font-bold tracking-wider uppercase flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                New AI Payroll Assistant
              </span>
            </div>

            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-[3.25rem] text-slate-900 dark:text-white leading-[1.1] tracking-tight">
              Master Your Workforce <br />
              with <span className="bg-gradient-to-r from-brand-600 to-indigo-600 dark:from-brand-400 dark:to-indigo-300 bg-clip-text text-transparent">PeopleGrid</span>
            </h1>

            <p className="mt-6 max-w-lg text-base md:text-lg leading-relaxed text-slate-600 dark:text-steel-400">
              Streamline payroll, benefits, and employee engagement in one powerful, unified platform built for modern teams.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <button
                onClick={handleCtaClick}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-slate-900 dark:bg-brand-gradient hover:bg-slate-800 dark:hover:scale-[1.02] text-white px-7 font-semibold shadow-lg shadow-slate-900/15 dark:shadow-brand-500/30 transition-all duration-200 active:scale-95"
              >
                {isLoggedIn ? 'Access Workspace' : 'Get Started'}
                <FiArrowRight size={16} />
              </button>
              <a
                href="#features"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-ink-800 bg-white dark:bg-ink-900/40 px-7 font-semibold text-slate-700 dark:text-steel-200 hover:bg-slate-50 dark:hover:bg-ink-800 hover:text-slate-900 dark:hover:text-white transition-all duration-200 active:scale-95"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 dark:bg-ink-800 text-slate-600 dark:text-steel-300">
                  <FiPlay size={10} className="fill-current ml-0.5" />
                </span>
                Watch Demo
              </a>
            </div>

            <div className="mt-12 flex items-center gap-6">
              <div className="flex -space-x-3">
                {[
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80',
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80',
                  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80'
                ].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="User avatar"
                    className="h-9 w-9 rounded-full border-2 border-white dark:border-ink-950 object-cover"
                  />
                ))}
              </div>
              <p className="text-sm text-slate-500 dark:text-steel-400 font-medium">
                Trusted by 500+ employees and administrators worldwide.
              </p>
            </div>
          </div>

          {/* Right Side: Interactive Mock Product Dashboard Widget */}
          <div className="relative group">
            <div className="absolute inset-0 bg-brand-500/10 rounded-[2.5rem] filter blur-2xl group-hover:bg-brand-500/15 transition-all duration-300"></div>
            
            {/* The Outer Frame */}
            <div className="relative rounded-[2.5rem] border border-slate-200 dark:border-ink-800 bg-white dark:bg-ink-900/80 p-5 shadow-2xl backdrop-blur-2xl transition-all duration-300 group-hover:border-slate-300 dark:group-hover:border-ink-750">
              {/* Window Header Dots */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-ink-800/60 mb-4">
                <div className="flex gap-2">
                  <span className="h-3 w-3 rounded-full bg-danger/70"></span>
                  <span className="h-3 w-3 rounded-full bg-warning/70"></span>
                  <span className="h-3 w-3 rounded-full bg-success/70"></span>
                </div>
                <div className="rounded-lg bg-slate-50 dark:bg-ink-950/80 border border-slate-100 dark:border-ink-800/40 px-3 py-1 text-[11px] text-slate-500 dark:text-steel-500 flex items-center gap-1.5 font-mono">
                  <FiLock size={10} /> secure.peoplegrid.net
                </div>
              </div>

              {/* Layout Content */}
              <div className="grid grid-cols-[80px_1fr] sm:grid-cols-[140px_1fr] gap-4 min-h-[300px]">
                {/* Left Sidebar Mock */}
                <div className="border-r border-slate-100 dark:border-ink-800/40 pr-3 flex flex-col gap-2.5">
                  <div className="h-6 w-full rounded-md bg-brand-500/10 flex items-center gap-2 px-2 text-[10px] text-brand-500 dark:text-brand-400 font-bold border border-brand-500/15">
                    <FiLayout size={12} /> Dashboard
                  </div>
                  <div className="h-6 w-full rounded-md hover:bg-slate-50 dark:hover:bg-ink-800/40 flex items-center gap-2 px-2 text-[10px] text-slate-400 dark:text-steel-500 transition-colors">
                    <FiUsers size={12} /> Employees
                  </div>
                  <div className="h-6 w-full rounded-md hover:bg-slate-50 dark:hover:bg-ink-800/40 flex items-center gap-2 px-2 text-[10px] text-slate-400 dark:text-steel-500 transition-colors">
                    <FiCalendar size={12} /> Leaves
                  </div>
                  <div className="h-6 w-full rounded-md hover:bg-slate-50 dark:hover:bg-ink-800/40 flex items-center gap-2 px-2 text-[10px] text-slate-400 dark:text-steel-500 transition-colors">
                    <FiFileText size={12} /> Payroll
                  </div>
                </div>

                {/* Main Panel Mock */}
                <div className="flex flex-col gap-4">
                  {/* Top Welcome Widget */}
                  <div className="rounded-2xl bg-slate-50 dark:bg-ink-950/80 border border-slate-100 dark:border-ink-800/50 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                        Welcome Back, {isLoggedIn ? user.name : 'Sarah'}
                      </h3>
                      <p className="text-[11px] text-slate-400 dark:text-steel-500 mt-0.5">Today is {new Date().toLocaleDateString('default', { weekday: 'long' })} • {mockTime}</p>
                    </div>
                    
                    {/* Clock In / Out Toggle Button */}
                    <button
                      onClick={toggleMockClock}
                      className={`h-8 px-4 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md ${
                        mockClockedIn
                          ? 'bg-emerald-500 text-white shadow-emerald-500/10'
                          : 'bg-brand-500 text-white shadow-brand-500/20 hover:bg-brand-600'
                      }`}
                    >
                      <FiClock size={12} />
                      {mockClockedIn ? 'Clocked In' : 'Clock In'}
                    </button>
                  </div>

                  {/* Stat Cards Grid Mock */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-slate-100 dark:border-ink-800/60 bg-slate-50/50 dark:bg-ink-850/50 p-3">
                      <div className="flex justify-between items-center text-slate-400 dark:text-steel-500">
                        <span className="text-[10px] font-bold uppercase tracking-wider">Attendance</span>
                        <FiUserCheck size={12} className="text-brand-500 dark:text-brand-400" />
                      </div>
                      <p className="text-base font-bold text-slate-900 dark:text-white mt-1">{realOnTimeRate}%</p>
                      <div className="w-full bg-slate-200 dark:bg-ink-950 rounded-full h-1 mt-2 overflow-hidden">
                        <div className="bg-brand-500 h-1 rounded-full" style={{ width: `${realOnTimeRate}%` }}></div>
                      </div>
                    </div>
                    
                    <div className="rounded-xl border border-slate-100 dark:border-ink-800/60 bg-slate-50/50 dark:bg-ink-850/50 p-3">
                      <div className="flex justify-between items-center text-slate-400 dark:text-steel-500">
                        <span className="text-[10px] font-bold uppercase tracking-wider">Leave Quota</span>
                        <FiCalendar size={12} className="text-emerald-500 dark:text-emerald-400" />
                      </div>
                      <p className="text-base font-bold text-slate-900 dark:text-white mt-1">{realLeaveLeft} Days</p>
                      <div className="w-full bg-slate-200 dark:bg-ink-950 rounded-full h-1 mt-2 overflow-hidden">
                        <div className="bg-emerald-500 h-1 rounded-full" style={{ width: `${(realLeaveLeft / 12) * 100}%` }}></div>
                      </div>
                    </div>
                  </div>

                  {/* Mini-table recent clock-in activity */}
                  <div className="rounded-xl border border-slate-100 dark:border-ink-800/60 bg-slate-50/50 dark:bg-ink-850/50 p-3 flex-1 flex flex-col">
                    <h4 className="text-[10px] font-bold text-slate-400 dark:text-steel-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <FiActivity size={10} /> Live Activity Log
                    </h4>
                    <div className="space-y-2 flex-1">
                      {isLoggedIn && attendance.length > 0 ? (
                        attendance.slice(0, 3).map((item, idx) => {
                          const name = item.employee?.user?.name || item.employee?.employeeId || 'Employee'
                          const checkInTime = item.checkIn ? new Date(item.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--'
                          return (
                            <div key={idx} className="flex items-center justify-between text-[11px] py-1 border-b border-slate-100 dark:border-ink-800/30 last:border-none">
                              <span className="text-slate-700 dark:text-steel-300 font-medium flex items-center gap-1.5 truncate max-w-[150px]">
                                <span className={`h-1.5 w-1.5 rounded-full ${item.status === 'present' ? 'bg-success' : 'bg-warning'}`}></span> {name}
                              </span>
                              <span className="text-slate-400 dark:text-steel-500 font-mono">{checkInTime} (In)</span>
                            </div>
                          )
                        })
                      ) : (
                        <>
                          <div className="flex items-center justify-between text-[11px] py-1 border-b border-slate-100 dark:border-ink-800/30">
                            <span className="text-slate-700 dark:text-steel-300 font-medium flex items-center gap-1.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-success"></span> John Doe
                            </span>
                            <span className="text-slate-400 dark:text-steel-500 font-mono">08:58 AM (In)</span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] py-1 border-b border-slate-100 dark:border-ink-800/30">
                            <span className="text-slate-700 dark:text-steel-300 font-medium flex items-center gap-1.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-success"></span> Emma Watson
                            </span>
                            <span className="text-slate-400 dark:text-steel-500 font-mono">08:45 AM (In)</span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] py-1">
                            <span className="text-slate-700 dark:text-steel-300 font-medium flex items-center gap-1.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-success"></span> Alex Mercer
                            </span>
                            <span className="text-slate-400 dark:text-steel-500 font-mono">08:15 AM (In)</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* SOC2 Floating Card */}
              <div className="absolute -bottom-4 -left-6 z-20 rounded-2xl border border-slate-100 dark:border-ink-850 bg-white/95 dark:bg-ink-900/95 p-4 shadow-xl backdrop-blur-md flex items-center gap-3 hover:scale-105 transition-transform duration-300">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-transparent">
                  <FiShield size={20} />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">SOC2 Compliant</p>
                  <p className="text-[10px] text-slate-500 dark:text-steel-400 font-semibold">Enterprise security</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Trusted Section ─────────────────────────── */}
      <section className="py-12 border-t border-slate-100 dark:border-ink-900 bg-slate-50/50 dark:bg-ink-950/20 max-w-7xl mx-auto px-6 relative z-10 text-center">
        <p className="text-xs font-bold tracking-widest text-slate-400 dark:text-steel-500 uppercase">
          Trusted by 500+ innovative companies worldwide
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-12 md:gap-20 opacity-50 dark:opacity-30">
          <span className="font-display text-xl font-extrabold tracking-wider text-slate-600 dark:text-white">ACME</span>
          <span className="font-display text-xl font-extrabold tracking-wider text-slate-600 dark:text-white">BOLT</span>
          <span className="font-display text-xl font-extrabold tracking-wider text-slate-600 dark:text-white">KREO</span>
          <span className="font-display text-xl font-extrabold tracking-wider text-slate-600 dark:text-white">VERTEX</span>
          <span className="font-display text-xl font-extrabold tracking-wider text-slate-600 dark:text-white">APEX</span>
        </div>
      </section>

      {/* ─── Features Grid Section ───────────────────── */}
      <section id="features" className="py-20 md:py-28 border-t border-slate-100 dark:border-ink-900 bg-white dark:bg-ink-950/10 max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-display font-extrabold text-3xl md:text-4xl text-slate-900 dark:text-white tracking-tight">
            Everything you need to manage your team
          </h2>
          <p className="text-slate-500 dark:text-steel-400 text-sm md:text-base mt-4 leading-relaxed">
            Powerful tools that scale with your business, from your first hire to global expansion.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: FiFileText,
              title: 'Automated Payroll',
              desc: 'Eliminate manual errors and save hours every month with our fully automated tax filing and direct deposit engine.',
              color: 'text-blue-500 bg-blue-50 dark:bg-blue-500/10 dark:text-blue-400'
            },
            {
              icon: FiUsers,
              title: 'Talent Management',
              desc: 'From onboarding to performance reviews, manage the entire employee lifecycle in one cohesive ecosystem.',
              color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 dark:text-indigo-400'
            },
            {
              icon: FiTrendingUp,
              title: 'Smart Analytics',
              desc: 'Gain deep visibility into turnover, diversity, and costs with data-driven insights to make better decisions.',
              color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400'
            }
          ].map((feat, idx) => (
            <div
              key={idx}
              className="group rounded-2xl border border-slate-100 dark:border-ink-800 bg-slate-50/50 dark:bg-ink-900/40 p-8 transition-all duration-300 hover:-translate-y-1.5 hover:bg-white dark:hover:bg-ink-850 hover:border-brand-500/30 hover:shadow-lg dark:hover:shadow-glow"
            >
              <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${feat.color} shadow-inner mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feat.icon size={22} />
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-brand-500 dark:group-hover:text-brand-300 transition-colors duration-200">
                {feat.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-steel-400">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Dashboard Preview Feature Section ───────── */}
      <section id="dashboard-preview" className="py-20 md:py-28 border-t border-slate-100 dark:border-ink-900 max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="absolute inset-0 bg-indigo-500/10 rounded-[2.5rem] filter blur-2xl"></div>
            {/* Visual preview representation */}
            <div className="relative rounded-[2.5rem] border border-slate-100 dark:border-ink-800 bg-white dark:bg-ink-900/50 p-6 shadow-2xl backdrop-blur-2xl">
              
              {/* Tab 1: Compliance */}
              {activeTab === 'compliance' && (
                <div className="animate-fade-in">
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-left">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Employee Directory</h4>
                      <p className="text-[11px] text-slate-500 dark:text-steel-500">Live compliance & onboarding roster</p>
                    </div>
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-100 dark:border-emerald-500/10">Active Compliance</span>
                  </div>

                  <div className="space-y-3">
                    {[
                      { name: 'Jane Doe', role: 'Product Design', status: 'ACTIVE', salary: '$124,000', statusColor: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/10' },
                      { name: 'Marcus Blue', role: 'Lead Engineer', status: 'ACTIVE', salary: '$186,000', statusColor: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/10' },
                      { name: 'Sarah Kong', role: 'Recruitment', status: 'ON LEAVE', salary: '$92,000', statusColor: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-500/10' }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between gap-3 p-3 rounded-xl border border-slate-100 dark:border-ink-800 bg-slate-50/50 dark:bg-ink-950/60 hover:bg-slate-50 dark:hover:bg-ink-950 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-brand-500 to-indigo-600 text-xs font-bold text-white flex items-center justify-center">
                            {item.name.split(' ').map(n=>n[0]).join('')}
                          </div>
                          <div className="text-left">
                            <p className="text-xs font-bold text-slate-900 dark:text-white">{item.name}</p>
                            <p className="text-[10px] text-slate-400 dark:text-steel-500 mt-0.5">{item.role}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.statusColor}`}>
                            {item.status}
                          </span>
                          <span className="text-xs font-bold text-slate-900 dark:text-white">{item.salary}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 2: Portal */}
              {activeTab === 'portal' && (
                <div className="animate-fade-in text-left">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Employee Portal</h4>
                      <p className="text-[11px] text-slate-500 dark:text-steel-500">Emma Watson • Employee Dashboard</p>
                    </div>
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-brand-50 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 font-bold border border-brand-100 dark:border-brand-500/10">Self Service</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-xl border border-slate-100 dark:border-ink-800 bg-slate-50/50 dark:bg-ink-950/60 p-4">
                      <p className="text-[10px] font-bold text-slate-400 dark:text-steel-500 uppercase">Available Time Off</p>
                      <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">12 Days</p>
                      <button className="mt-3 w-full inline-flex h-8 items-center justify-center rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-[11px] font-bold transition-all">
                        Request Leave
                      </button>
                    </div>

                    <div className="rounded-xl border border-slate-100 dark:border-ink-800 bg-slate-50/50 dark:bg-ink-950/60 p-4 flex flex-col justify-between">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 dark:text-steel-500 uppercase">Latest Payslip</p>
                        <p className="text-xs font-bold text-slate-900 dark:text-white mt-1">June 2026</p>
                      </div>
                      <button className="mt-3 w-full inline-flex h-8 items-center justify-center rounded-lg border border-slate-200 dark:border-ink-800 hover:bg-slate-50 dark:hover:bg-ink-800 text-slate-700 dark:text-steel-200 text-[11px] font-bold transition-all">
                        Download PDF
                      </button>
                    </div>

                    <div className="col-span-2 rounded-xl border border-slate-100 dark:border-ink-800 bg-slate-50/50 dark:bg-ink-950/60 p-3.5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-505 bg-emerald-500 animate-pulse"></span>
                        <span className="text-xs text-slate-600 dark:text-steel-300 font-medium">Clocked In today at 09:02 AM</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 dark:text-steel-500">IP: 192.168.1.45</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Integrations */}
              {activeTab === 'integrations' && (
                <div className="animate-fade-in text-left">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Connected Ecosystem</h4>
                      <p className="text-[11px] text-slate-500 dark:text-steel-500">Available app integrations</p>
                    </div>
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-100 dark:border-indigo-500/10">Integrations</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { name: 'Slack', desc: 'Sync check-ins', status: 'Connected', badge: 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/15' },
                      { name: 'Google Calendar', desc: 'Sync approvals', status: 'Connected', badge: 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/15' },
                      { name: 'Jira', desc: 'Link metrics', status: 'Configure', badge: 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-ink-800 dark:text-steel-300 dark:border-ink-750' },
                      { name: 'Stripe', desc: 'Direct payouts', status: 'Configure', badge: 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-ink-800 dark:text-steel-300 dark:border-ink-750' }
                    ].map((app, idx) => (
                      <div key={idx} className="rounded-xl border border-slate-100 dark:border-ink-800 bg-slate-50/50 dark:bg-ink-950/60 p-3 flex flex-col justify-between">
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">{app.name}</p>
                          <p className="text-[10px] text-slate-400 dark:text-steel-500 mt-0.5">{app.desc}</p>
                        </div>
                        <button className={`mt-3 h-7 rounded-lg border text-[10px] font-bold transition-all ${app.status === 'Connected' ? app.badge : 'bg-brand-500 hover:bg-brand-600 text-white border-transparent'}`}>
                          {app.status}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Tab Selection Lists */}
          <div className="text-left flex flex-col justify-center order-1 lg:order-2">
            <p className="text-xs font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest text-left">Ultimate Control</p>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl text-slate-900 dark:text-white mt-3 leading-tight text-left">
              Powerful tools that feel effortless
            </h2>
            <p className="mt-4 text-sm md:text-base leading-relaxed text-slate-500 dark:text-steel-400 text-left">
              Manage requests, log attendance, and compute salaries in a single, high-fidelity dashboard. Click below to explore key tools:
            </p>
            <div className="mt-8 space-y-3">
              {[
                { id: 'compliance', title: 'One-Click Compliance', desc: 'Stay compliant across all 50 states automatically.', icon: FiShield },
                { id: 'portal', title: 'Self-Service Portal', desc: 'Empower employees to manage their own time off & payslips.', icon: FiUserCheck },
                { id: 'integrations', title: 'Deep Integrations', desc: 'Connect seamlessly with Slack, Calendar, Jira, and Stripe.', icon: FiTrendingUp }
              ].map((tab, idx) => {
                const isActive = activeTab === tab.id
                const TabIcon = tab.icon
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-start gap-4 ${
                      isActive
                        ? 'bg-blue-50/80 border-blue-200 text-slate-900 dark:bg-brand-500/10 dark:border-brand-500/20 dark:text-white shadow-sm'
                        : 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-ink-800/40 text-slate-600 dark:text-steel-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <TabIcon className={`shrink-0 mt-0.5 ${isActive ? 'text-brand-500 dark:text-brand-400' : 'text-slate-400 dark:text-steel-600'}`} size={18} />
                    <div className="text-left">
                      <h4 className="text-sm font-bold">{tab.title}</h4>
                      <p className="text-xs text-slate-500 dark:text-steel-500 mt-1">{tab.desc}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Metrics Section ─────────────────────────── */}
      <section id="metrics" className="py-20 md:py-24 border-t border-slate-100 dark:border-ink-900 bg-slate-50/50 dark:bg-ink-900/10 max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { metric: '99.9%', label: 'Platform Uptime Guaranteed' },
            { metric: '10K+', label: 'Monthly Operations Executed' },
            { metric: '35%', label: 'Increased HR Workflow Efficiency' },
            { metric: '4.9/5', label: 'Average Client Satisfaction Rating' }
          ].map((stat, idx) => (
            <div key={idx} className="text-center p-4">
              <h3 className="font-display font-extrabold text-4xl md:text-5xl text-slate-900 dark:text-white tracking-tight">
                {stat.metric}
              </h3>
              <p className="text-xs md:text-sm font-semibold uppercase tracking-widest text-slate-400 dark:text-steel-500 mt-2.5">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Testimonials Section ────────────────────── */}
      <section id="testimonials" className="py-20 md:py-28 border-t border-slate-100 dark:border-ink-900 max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-bold text-brand-500 dark:text-emerald-400 uppercase tracking-widest">Client Testimonials</p>
          <h2 className="font-display font-extrabold text-3xl md:text-4xl text-slate-900 dark:text-white mt-3">
            What founders and managers are saying
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              quote: "PeopleGrid saved our operations department over 15 hours a week. The attendance check-ins are smooth and foolproof.",
              author: "Marcus Aurelius",
              role: "Head of Operations, Novus Corp",
              avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&h=80"
            },
            {
              quote: "The interface is gorgeous and extremely intuitive. Employees picked it up instantly without any training guides.",
              author: "Elena Rostova",
              role: "HR Lead, Vertex Logistics",
              avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=80&h=80"
            },
            {
              quote: "Securing payroll logs was our top priority. PeopleGrid’s role-based isolation provides us complete peace of mind.",
              author: "Devon Lane",
              role: "Founder & CEO, PixelCraft",
              avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=80&h=80"
            }
          ].map((t, i) => (
            <div key={i} className="rounded-2xl border border-slate-100 dark:border-ink-800 bg-slate-50/50 dark:bg-ink-900/60 p-6 flex flex-col justify-between shadow-lg text-left">
              <p className="text-sm leading-relaxed text-slate-600 dark:text-steel-300 italic">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-4 mt-8 border-t border-slate-100 dark:border-ink-800/50 pt-4">
                <img
                  src={t.avatar}
                  alt={t.author}
                  className="h-10 w-10 rounded-full object-cover border border-slate-200 dark:border-brand-500/20"
                />
                <div className="text-left">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{t.author}</h4>
                  <p className="text-[10px] text-slate-400 dark:text-steel-500 mt-0.5">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Bottom Call to Action Section ───────────── */}
      <section className="py-20 border-t border-slate-100 dark:border-ink-900 relative overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] rounded-full bg-brand-500 filter blur-[120px]"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center px-6 relative z-10">
          <h2 className="font-display font-extrabold text-3xl md:text-5xl text-white tracking-tight">
            Ready to Transform Your HR?
          </h2>
          <p className="mt-4 text-slate-300 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Join thousands of forward-thinking companies that use PeopleGrid to build better workplaces. No credit card required.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <button
              onClick={handleCtaClick}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-gradient px-8 font-bold text-white shadow-xl shadow-brand-500/30 hover:scale-[1.02] hover:shadow-brand-500/45 transition-all duration-200 active:scale-95"
            >
              {isLoggedIn ? 'Launch Workspace' : 'Start Your Free Trial'}
              <FiArrowRight size={16} />
            </button>
            <button
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-700 hover:border-white bg-slate-800/40 px-8 font-semibold text-slate-300 hover:text-white transition-all duration-200 active:scale-95"
            >
              Schedule a Consultation
            </button>
          </div>
          <p className="mt-6 text-[11px] font-bold tracking-widest text-slate-400 uppercase">
            Free for 14 days • Cancel anytime • 24/7 Support
          </p>
        </div>
      </section>

      {/* ─── Footer ──────────────────────────────────── */}
      <footer className="py-16 border-t border-slate-100 dark:border-ink-900 bg-slate-50 dark:bg-ink-950 z-10 relative text-slate-600 dark:text-steel-400">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Column 1: Info */}
          <div className="col-span-2 text-left">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-indigo-600 text-white shadow-lg">
                <FiBriefcase size={18} />
              </div>
              <span className="font-display text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                People<span className="text-brand-500 dark:text-brand-400">Grid</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-500 dark:text-steel-400">
              The modern platform for resource management, growth, and team success. Manage attendance, leaves, payroll, and tasks in one place.
            </p>
          </div>

          {/* Column 2: Product */}
          <div className="text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">Product</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#" className="hover:text-slate-950 dark:hover:text-white transition-colors">Payroll</a></li>
              <li><a href="#" className="hover:text-slate-950 dark:hover:text-white transition-colors">Benefits</a></li>
              <li><a href="#" className="hover:text-slate-950 dark:hover:text-white transition-colors">Onboarding</a></li>
              <li><a href="#" className="hover:text-slate-950 dark:hover:text-white transition-colors">Analytics</a></li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">Resources</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#" className="hover:text-slate-950 dark:hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-slate-950 dark:hover:text-white transition-colors">Contact Support</a></li>
              <li><a href="#" className="hover:text-slate-950 dark:hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-slate-950 dark:hover:text-white transition-colors">Cookie Settings</a></li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div className="text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">Legal</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#" className="hover:text-slate-950 dark:hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-slate-950 dark:hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 border-t border-slate-200 dark:border-ink-900 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400 dark:text-steel-500">
          <p>© {new Date().getFullYear()} PeopleGrid Operations Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-700 dark:hover:text-steel-300">Privacy Policy</a>
            <a href="#" className="hover:text-slate-700 dark:hover:text-steel-300">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
