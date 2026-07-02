import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { selectUser } from '../store/slices/authSlice.js'
import { getStoredUser, getDashboardPath } from '../utils/roleRoutes.js'
import { fetchAttendance, selectAttendanceRecords } from '../store/slices/attendanceSlice.js'
import { fetchLeaves, selectLeaves } from '../store/slices/leaveSlice.js'
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
  FiActivity
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

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mockClockedIn, setMockClockedIn] = useState(false)
  const [mockTime, setMockTime] = useState('09:00 AM')

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
    <div className="min-h-screen bg-ink-950 text-steel-200 overflow-x-hidden font-sans selection:bg-brand-500/30 selection:text-white">
      {/* ─── Glowing Background Blobs ─────────────────── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-15%] w-[50%] h-[50%] rounded-full bg-brand-600/10 mix-blend-screen filter blur-[120px] animate-blob"></div>
        <div className="absolute top-[25%] right-[-15%] w-[45%] h-[45%] rounded-full bg-brand-400/10 mix-blend-screen filter blur-[130px] animate-blob" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-[-10%] left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-500/5 mix-blend-screen filter blur-[150px] animate-blob" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* ─── Header / Navigation ─────────────────────── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
          scrolled
            ? 'bg-ink-900/80 backdrop-blur-md border-ink-800 shadow-lg'
            : 'bg-transparent border-transparent'
        }`}
      >
        <div className="mx-auto max-w-7xl px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-indigo-600 text-white shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform duration-200">
              <FiBriefcase size={20} />
            </div>
            <span className="font-display text-xl font-bold text-white tracking-tight">
              People<span className="text-brand-400">Grid</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-steel-400 hover:text-white transition-colors">Features</a>
            <a href="#dashboard-preview" className="text-sm font-medium text-steel-400 hover:text-white transition-colors">Dashboard</a>
            <a href="#metrics" className="text-sm font-medium text-steel-400 hover:text-white transition-colors">Performance</a>
            <a href="#testimonials" className="text-sm font-medium text-steel-400 hover:text-white transition-colors">Reviews</a>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
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
                  className="text-sm font-semibold text-steel-300 hover:text-white transition-colors"
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
            className="md:hidden p-2 rounded-lg border border-ink-800 bg-ink-900/60 text-steel-300 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 right-0 border-b border-ink-800 bg-ink-900/95 backdrop-blur-lg p-6 flex flex-col gap-6 shadow-2xl animate-fade-in">
            <nav className="flex flex-col gap-4">
              <a
                href="#features"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-base font-semibold text-steel-400 hover:text-white transition-colors"
              >
                Features
              </a>
              <a
                href="#dashboard-preview"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-base font-semibold text-steel-400 hover:text-white transition-colors"
              >
                Dashboard Preview
              </a>
              <a
                href="#metrics"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-base font-semibold text-steel-400 hover:text-white transition-colors"
              >
                Performance
              </a>
              <a
                href="#testimonials"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-base font-semibold text-steel-400 hover:text-white transition-colors"
              >
                Reviews
              </a>
            </nav>
            <hr className="border-ink-800" />
            <div className="flex flex-col gap-3">
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
                    className="flex h-12 items-center justify-center rounded-xl border border-ink-700 bg-ink-950 font-bold text-steel-200 hover:bg-ink-900 transition"
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
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
          {/* Left Side Hero Details */}
          <div className="text-left flex flex-col justify-center">
            <div className="inline-flex w-max items-center gap-2.5 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-2 text-brand-300 shadow-inner mb-6">
              <FiShield size={14} />
              <span className="text-xs font-bold tracking-wider uppercase">Next-Gen HR Operations</span>
            </div>

            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.1] tracking-tight">
              Transform Your <br />
              <span className="bg-gradient-to-r from-brand-400 via-indigo-300 to-white bg-clip-text text-transparent">
                Workforce Management
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-base md:text-lg leading-relaxed text-steel-400">
              PeopleGrid unites attendance tracking, leave requests, task assignments, and payroll in a secure, high-performance workspace. Experience modern administration designed for fast-scaling organizations.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <button
                onClick={handleCtaClick}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-gradient px-7 font-bold text-white shadow-xl shadow-brand-500/30 hover:scale-[1.02] hover:shadow-brand-500/45 transition-all duration-200 active:scale-95"
              >
                {isLoggedIn ? 'Access Workspace' : 'Get Started Now'}
                <FiArrowRight size={16} />
              </button>
              <a
                href="#features"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-ink-800 bg-ink-900/40 px-7 font-semibold text-steel-200 hover:bg-ink-800 hover:text-white transition-all duration-200 active:scale-95"
              >
                Learn More
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
                    className="h-9 w-9 rounded-full border-2 border-ink-950 object-cover"
                  />
                ))}
              </div>
              <p className="text-sm text-steel-400 font-medium">
                Trusted by 500+ employees and administrators worldwide.
              </p>
            </div>
          </div>

          {/* Right Side: Interactive Mock Product Dashboard Widget */}
          <div className="relative group">
            <div className="absolute inset-0 bg-brand-500/10 rounded-[2.5rem] filter blur-2xl group-hover:bg-brand-500/15 transition-all duration-300"></div>
            
            {/* The Outer Frame */}
            <div className="relative rounded-[2.5rem] border border-ink-800 bg-ink-900/80 p-5 shadow-2xl backdrop-blur-2xl transition-all duration-300 group-hover:border-ink-750">
              {/* Window Header Dots */}
              <div className="flex items-center justify-between pb-4 border-b border-ink-800/60 mb-4">
                <div className="flex gap-2">
                  <span className="h-3 w-3 rounded-full bg-danger/70"></span>
                  <span className="h-3 w-3 rounded-full bg-warning/70"></span>
                  <span className="h-3 w-3 rounded-full bg-success/70"></span>
                </div>
                <div className="rounded-lg bg-ink-950/80 border border-ink-800/40 px-3 py-1 text-[11px] text-steel-500 flex items-center gap-1.5 font-mono">
                  <FiLock size={10} /> secure.peoplegrid.net
                </div>
              </div>

              {/* Layout Content */}
              <div className="grid grid-cols-[80px_1fr] sm:grid-cols-[140px_1fr] gap-4 min-h-[300px]">
                {/* Left Sidebar Mock */}
                <div className="border-r border-ink-800/40 pr-3 flex flex-col gap-2.5">
                  <div className="h-6 w-full rounded-md bg-brand-500/10 flex items-center gap-2 px-2 text-[10px] text-brand-400 font-bold border border-brand-500/15">
                    <FiLayout size={12} /> Dashboard
                  </div>
                  <div className="h-6 w-full rounded-md hover:bg-ink-800/40 flex items-center gap-2 px-2 text-[10px] text-steel-500 transition-colors">
                    <FiUsers size={12} /> Employees
                  </div>
                  <div className="h-6 w-full rounded-md hover:bg-ink-800/40 flex items-center gap-2 px-2 text-[10px] text-steel-500 transition-colors">
                    <FiCalendar size={12} /> Leaves
                  </div>
                  <div className="h-6 w-full rounded-md hover:bg-ink-800/40 flex items-center gap-2 px-2 text-[10px] text-steel-500 transition-colors">
                    <FiFileText size={12} /> Payroll
                  </div>
                </div>

                {/* Main Panel Mock */}
                <div className="flex flex-col gap-4">
                  {/* Top Welcome Widget */}
                  <div className="rounded-2xl bg-ink-950/80 border border-ink-800/50 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                        Welcome Back, {isLoggedIn ? user.name : 'Sarah'}
                      </h3>
                      <p className="text-[11px] text-steel-500 mt-0.5">Today is {new Date().toLocaleDateString('default', { weekday: 'long' })} • {mockTime}</p>
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
                    <div className="rounded-xl border border-ink-800/60 bg-ink-850/50 p-3">
                      <div className="flex justify-between items-center text-steel-500">
                        <span className="text-[10px] font-bold uppercase tracking-wider">Attendance</span>
                        <FiUserCheck size={12} className="text-brand-400" />
                      </div>
                      <p className="text-base font-bold text-white mt-1">{realOnTimeRate}%</p>
                      <div className="w-full bg-ink-950 rounded-full h-1 mt-2 overflow-hidden">
                        <div className="bg-brand-500 h-1 rounded-full" style={{ width: `${realOnTimeRate}%` }}></div>
                      </div>
                    </div>
                    
                    <div className="rounded-xl border border-ink-800/60 bg-ink-850/50 p-3">
                      <div className="flex justify-between items-center text-steel-500">
                        <span className="text-[10px] font-bold uppercase tracking-wider">Leave Quota</span>
                        <FiCalendar size={12} className="text-emerald-400" />
                      </div>
                      <p className="text-base font-bold text-white mt-1">{realLeaveLeft} Days Left</p>
                      <div className="w-full bg-ink-950 rounded-full h-1 mt-2 overflow-hidden">
                        <div className="bg-emerald-500 h-1 rounded-full" style={{ width: `${(realLeaveLeft / 12) * 100}%` }}></div>
                      </div>
                    </div>
                  </div>

                  {/* Mini-table recent clock-in activity */}
                  <div className="rounded-xl border border-ink-800/60 bg-ink-850/50 p-3 flex-1 flex flex-col">
                    <h4 className="text-[10px] font-bold text-steel-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <FiActivity size={10} /> Live Activity Log
                    </h4>
                    <div className="space-y-2 flex-1">
                      {isLoggedIn && attendance.length > 0 ? (
                        attendance.slice(0, 3).map((item, idx) => {
                          const name = item.employee?.user?.name || item.employee?.employeeId || 'Employee'
                          const checkInTime = item.checkIn ? new Date(item.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--'
                          return (
                            <div key={idx} className="flex items-center justify-between text-[11px] py-1 border-b border-ink-800/30 last:border-none">
                              <span className="text-steel-300 font-medium flex items-center gap-1.5 truncate max-w-[150px]">
                                <span className={`h-1.5 w-1.5 rounded-full ${item.status === 'present' ? 'bg-success' : 'bg-warning'}`}></span> {name}
                              </span>
                              <span className="text-steel-500 font-mono">{checkInTime} (In)</span>
                            </div>
                          )
                        })
                      ) : (
                        <>
                          <div className="flex items-center justify-between text-[11px] py-1 border-b border-ink-800/30">
                            <span className="text-steel-300 font-medium flex items-center gap-1.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-success"></span> John Doe
                            </span>
                            <span className="text-steel-500 font-mono">08:58 AM (In)</span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] py-1 border-b border-ink-800/30">
                            <span className="text-steel-300 font-medium flex items-center gap-1.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-success"></span> Emma Watson
                            </span>
                            <span className="text-steel-500 font-mono">08:45 AM (In)</span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] py-1">
                            <span className="text-steel-300 font-medium flex items-center gap-1.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-success"></span> Alex Mercer
                            </span>
                            <span className="text-steel-500 font-mono">08:15 AM (In)</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features Grid Section ───────────────────── */}
      <section id="features" className="py-20 md:py-28 border-t border-ink-900 bg-ink-900/10 max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-bold text-brand-400 uppercase tracking-widest">Enterprise Core Modules</p>
          <h2 className="font-display font-extrabold text-3xl md:text-4xl text-white mt-3">
            Streamline your workforce operations in minutes.
          </h2>
          <p className="text-steel-400 text-sm md:text-base mt-4 leading-relaxed">
            Stop juggling multiple legacy platforms. PeopleGrid consolidates your business operations into a unified interface.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: FiClock,
              title: 'Smart Attendance',
              desc: 'Seamless real-time check-in and check-out logs with automated work hours tally.',
              color: 'text-brand-400'
            },
            {
              icon: FiCalendar,
              title: 'Leave Workflows',
              desc: 'Apply for leaves, track remaining quotas, and view automated approval states instantly.',
              color: 'text-indigo-400'
            },
            {
              icon: FiFileText,
              title: 'Interactive Payroll',
              desc: 'Calculate wages, manage payouts, and review downloadable PDF payslips securely.',
              color: 'text-cyan-400'
            },
            {
              icon: FiUsers,
              title: 'Team Directories',
              desc: 'Organize employee profiles, handle secure onboarding, and manage user roles with permissions.',
              color: 'text-emerald-400'
            }
          ].map((feat, idx) => (
            <div
              key={idx}
              className="group rounded-2xl border border-ink-800 bg-ink-900/40 p-6 transition-all duration-300 hover:-translate-y-1.5 hover:bg-ink-850 hover:border-brand-500/30 hover:shadow-glow"
            >
              <span className={`flex h-12 w-12 items-center justify-center rounded-xl bg-ink-950 border border-ink-800 ${feat.color} shadow-inner mb-5 group-hover:bg-brand-500 group-hover:text-white transition-colors duration-300`}>
                <feat.icon size={22} />
              </span>
              <h3 className="text-lg font-bold text-white group-hover:text-brand-300 transition-colors duration-200">{feat.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-steel-400">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Dashboard Preview Feature Section ───────── */}
      <section id="dashboard-preview" className="py-20 md:py-28 border-t border-ink-900 max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="absolute inset-0 bg-indigo-500/10 rounded-[2.5rem] filter blur-2xl"></div>
            {/* Visual preview representation */}
            <div className="relative rounded-[2.5rem] border border-ink-800 bg-ink-900/50 p-6 shadow-2xl backdrop-blur-2xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Leave Applications</h4>
                  <p className="text-[11px] text-steel-500">Approvals pending action</p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-brand-500/25 text-brand-300 font-bold border border-brand-500/10">Admin Dashboard</span>
              </div>

              {/* Table mock */}
              <div className="space-y-4">
                {isLoggedIn && leaves.length > 0 ? (
                  leaves.slice(0, 3).map((item, idx) => {
                    const name = item.employee?.user?.name || item.employee?.employeeId || 'Employee'
                    const durationDays = item.daysRequested ? `${item.daysRequested} Day${item.daysRequested !== 1 ? 's' : ''}` : 'N/A'
                    const statusText = item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : 'Pending'
                    const statusColor = item.status === 'approved' 
                      ? 'bg-success text-success border-success/10' 
                      : item.status === 'rejected'
                        ? 'bg-danger text-danger border-danger/10'
                        : 'bg-warning text-warning border-warning/10'
                    return (
                      <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-ink-800 bg-ink-950/60 hover:bg-ink-950 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-brand-gradient text-xs font-bold text-white flex items-center justify-center">
                            {name.split(' ').map(n=>n[0]).join('')}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white truncate max-w-[120px]">{name}</p>
                            <p className="text-[10px] text-steel-500 mt-0.5">{item.type} • {durationDays}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 justify-between sm:justify-end">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-opacity-10 border ${statusColor}`}>
                            {statusText}
                          </span>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  [
                    { name: 'Sarah Connor', type: 'Sick Leave', duration: '2 Days', status: 'Pending', statusColor: 'bg-warning text-warning border-warning/10' },
                    { name: 'Robert Vance', type: 'Annual Leave', duration: '5 Days', status: 'Approved', statusColor: 'bg-success text-success border-success/10' },
                    { name: 'Chloe Fraser', type: 'Casual Leave', duration: '1 Day', status: 'Rejected', statusColor: 'bg-danger text-danger border-danger/10' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-ink-800 bg-ink-950/60 hover:bg-ink-950 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-brand-gradient text-xs font-bold text-white flex items-center justify-center">
                          {item.name.split(' ').map(n=>n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">{item.name}</p>
                          <p className="text-[10px] text-steel-500 mt-0.5">{item.type} • {item.duration}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 justify-between sm:justify-end">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-opacity-10 border ${item.statusColor}`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="text-left flex flex-col justify-center order-1 lg:order-2">
            <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Ultimate Control</p>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl text-white mt-3 leading-tight">
              Manage requests in a single, high-fidelity dashboard.
            </h2>
            <p className="mt-6 text-sm md:text-base leading-relaxed text-steel-400">
              Administrators and HR managers receive detailed overviews of employee status logsheets, pending leave tickets, and payroll periods. Resolve items in a few clicks with real-time audit logs.
            </p>
            <div className="mt-8 space-y-3.5">
              {[
                'Instant push notifications on leave submissions.',
                'Interactive charts highlighting team attendance trends.',
                'Individual worker dashboards displaying specific duties.'
              ].map((bullet, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <FiCheckCircle className="text-brand-400 shrink-0" size={18} />
                  <span className="text-sm font-medium text-steel-300">{bullet}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Metrics Section ─────────────────────────── */}
      <section id="metrics" className="py-20 md:py-24 border-t border-ink-900 bg-ink-900/10 max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { metric: '99.9%', label: 'Platform Uptime Guaranteed' },
            { metric: '10K+', label: 'Monthly Operations Executed' },
            { metric: '35%', label: 'Increased HR Workflow Efficiency' },
            { metric: '4.9/5', label: 'Average Client Satisfaction Rating' }
          ].map((stat, idx) => (
            <div key={idx} className="text-center p-4">
              <h3 className="font-display font-extrabold text-4xl md:text-5xl text-white tracking-tight bg-gradient-to-b from-white to-steel-400 bg-clip-text text-transparent">
                {stat.metric}
              </h3>
              <p className="text-xs md:text-sm font-semibold uppercase tracking-widest text-steel-500 mt-2.5">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Testimonials Section ────────────────────── */}
      <section id="testimonials" className="py-20 md:py-28 border-t border-ink-900 max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Client Testimonials</p>
          <h2 className="font-display font-extrabold text-3xl md:text-4xl text-white mt-3">
            What founders and managers are saying.
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
            <div key={i} className="rounded-2xl border border-ink-800 bg-ink-900/60 p-6 flex flex-col justify-between shadow-xl">
              <p className="text-sm leading-relaxed text-steel-300 italic">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-4.5 mt-8 border-t border-ink-800/50 pt-4">
                <img
                  src={t.avatar}
                  alt={t.author}
                  className="h-10 w-10 rounded-full object-cover border border-brand-500/20"
                />
                <div>
                  <h4 className="text-xs font-bold text-white">{t.author}</h4>
                  <p className="text-[10px] text-steel-500 mt-0.5">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Bottom Call to Action Section ───────────── */}
      <section className="py-20 border-t border-ink-900 relative z-10 bg-gradient-to-b from-transparent to-brand-950/10">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="font-display font-extrabold text-3xl md:text-5xl text-white">
            Ready to upgrade your workspace?
          </h2>
          <p className="mt-4 text-steel-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Join hundreds of forward-thinking businesses and optimize your HR administration today. No complex integration processes required.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={handleCtaClick}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-gradient px-8 font-bold text-white shadow-xl shadow-brand-500/30 hover:scale-[1.02] hover:shadow-brand-500/45 transition-all duration-200 active:scale-95"
            >
              {isLoggedIn ? 'Launch Workspace' : 'Get Started Now'}
              <FiArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ─── Footer ──────────────────────────────────── */}
      <footer className="py-12 border-t border-ink-900 bg-ink-950 z-10 relative">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gradient text-white">
              <FiBriefcase size={16} />
            </div>
            <span className="font-display text-base font-bold text-white tracking-tight">
              People<span className="text-brand-400">Grid</span>
            </span>
          </div>
          <p className="text-xs text-steel-500">
            © {new Date().getFullYear()} PeopleGrid Inc. All rights reserved. Secure Cloud HRMS.
          </p>
          <div className="flex gap-6 text-xs text-steel-500">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Security Guard</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
