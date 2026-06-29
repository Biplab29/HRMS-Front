import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  FiBell,
  FiChevronDown,
  FiLogOut,
  FiMail,
  FiMoon,
  FiSearch,
  FiSettings,
  FiShield,
  FiSun,
  FiUser,
} from 'react-icons/fi'
import { logoutUser, selectUser } from '../../store/slices/authSlice.js'
import {
  fetchNotifications,
  markAsRead,
  selectNotifications,
  selectUnreadCount,
} from '../../store/slices/notificationSlice.js'
import { getStoredUser } from '../../utils/roleRoutes.js'
import { useTheme } from '../../context/ThemeContext.jsx'

const roleMeta = {
  admin: { label: 'Administrator', color: 'bg-brand-500/15 text-brand-400 border-brand-500/20' },
  hr: { label: 'HR Manager', color: 'bg-brand-500/15 text-brand-400 border-brand-500/20' },
  employee: { label: 'Employee', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' },
}

function getInitials(name) {
  if (!name) return 'U'
  const parts = name.trim().split(' ')
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return parts[0][0].toUpperCase()
}

function Topbar({ title, search = 'Search...', action }) {
  const [profileOpen, setProfileOpen] = useState(false)
  const dropdownRef = useRef(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()

  const user = useSelector(selectUser) || getStoredUser()
  const role = user?.role || 'employee'
  const meta = roleMeta[role] || roleMeta.employee
  const displayName = user?.name || user?.username || 'User'
  const email = user?.email || ''
  const initials = getInitials(displayName)

  const [notifOpen, setNotifOpen] = useState(false)
  const notifRef = useRef(null)

  const notifications = useSelector(selectNotifications) || []
  const unreadCount = useSelector(selectUnreadCount) || 0

  useEffect(() => {
    if (user) {
      dispatch(fetchNotifications())
    }
  }, [dispatch, user])

  // Close dropdowns on outside click
  useEffect(() => {
    function handleOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false)
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [])

  const handleLogout = async () => {
    setProfileOpen(false)
    await dispatch(logoutUser())
    navigate('/')
  }

  const handleNotificationClick = (id) => {
    dispatch(markAsRead(id))
  }

  return (
    <header className="sticky top-0 z-40 flex min-h-[64px] flex-col gap-3 border-b border-white/5 bg-ink-900/40 backdrop-blur-2xl px-6 py-3 lg:flex-row lg:items-center lg:justify-between transition-all duration-300">
      {/* Left: title + search */}
      <div className="flex min-w-0 flex-1 items-center gap-6">
        {title && (
          <h2 className="hidden whitespace-nowrap font-display text-lg font-bold text-steel-200 dark:text-white xl:block">
            {title}
          </h2>
        )}
        <label className="flex h-10 w-full max-w-[340px] items-center gap-2 rounded-lg border border-white/5 bg-black/20 px-3 text-steel-400 transition-all focus-within:border-brand-500/50 focus-within:ring-2 focus-within:ring-brand-500/20">
          <FiSearch aria-hidden="true" size={16} />
          <span className="sr-only">Search</span>
          <input
            className="w-full bg-transparent text-sm text-steel-200 outline-none placeholder:text-steel-500"
            placeholder={search}
          />
        </label>
      </div>

      {/* Right: actions + icons + profile */}
      <div className="flex items-center justify-between gap-3 lg:justify-end">
        {action}

        {/* Dark / Light toggle */}
        <button
          className="icon-button"
          type="button"
          aria-label="Toggle theme"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <FiSun aria-hidden="true" size={18} /> : <FiMoon aria-hidden="true" size={18} />}
        </button>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            className="icon-button relative"
            type="button"
            aria-label="Notifications"
            onClick={() => setNotifOpen((o) => !o)}
          >
            <FiBell aria-hidden="true" size={18} />
            {unreadCount > 0 && (
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-danger ring-2 ring-ink-900" />
            )}
          </button>
          
          {notifOpen && (
            <div className="absolute right-0 top-[calc(100%+12px)] z-50 w-80 max-h-96 overflow-y-auto rounded-xl border border-white/10 bg-ink-850/90 backdrop-blur-2xl shadow-console animate-slide-up">
              <div className="flex items-center justify-between border-b border-white/5 px-4 py-3 sticky top-0 bg-ink-850/90 backdrop-blur-md z-10">
                <h3 className="font-bold text-sm text-steel-200 dark:text-white">Notifications</h3>
                {unreadCount > 0 && <span className="text-xs text-brand-400">{unreadCount} new</span>}
              </div>
              <div className="flex flex-col">
                {notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <div
                      key={notif._id}
                      onClick={() => handleNotificationClick(notif._id)}
                      className={`cursor-pointer border-b border-white/5 p-3 hover:bg-white/5 transition-colors ${!notif.isRead ? 'bg-brand-500/10' : ''}`}
                    >
                      <h4 className={`text-sm ${!notif.isRead ? 'font-bold text-white' : 'font-medium text-steel-300'}`}>{notif.title}</h4>
                      <p className="text-xs text-steel-400 mt-1">{notif.message}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-steel-500">No notifications yet</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div ref={dropdownRef} className="relative ml-2">
          <button
            id="profile-menu-btn"
            type="button"
            aria-haspopup="true"
            aria-expanded={profileOpen}
            onClick={() => setProfileOpen((o) => !o)}
            className="flex items-center gap-3 rounded-full border border-white/5 bg-ink-800/50 p-1 pr-3 transition-all hover:border-brand-500/30 hover:bg-ink-800 hover:shadow-glow"
          >
            {/* Avatar circle */}
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-xs font-bold text-steel-200 dark:text-white shadow-lg">
              {initials}
            </span>
            <span className="hidden text-sm font-semibold text-steel-200 dark:text-white lg:block">
              {displayName}
            </span>
            <FiChevronDown
              aria-hidden="true"
              className={`hidden text-steel-400 transition-transform lg:block ${profileOpen ? 'rotate-180' : ''}`}
              size={14}
            />
          </button>

          {/* ── Dropdown Panel ─────────────────────────────── */}
          {profileOpen && (
            <div
              role="menu"
              aria-label="Profile menu"
              className="absolute right-0 top-[calc(100%+12px)] z-50 w-72 rounded-xl border border-white/10 bg-ink-850/90 backdrop-blur-2xl shadow-console transition-all duration-200 animate-slide-up"
            >
              {/* Header */}
              <div className="flex items-center gap-4 border-b border-white/5 px-5 py-5">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-base font-bold text-steel-200 dark:text-white shadow-lg">
                  {initials}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-steel-200 dark:text-white">
                    {displayName}
                  </p>
                  {email && (
                    <p className="flex items-center gap-1.5 truncate text-xs text-steel-400 mt-0.5">
                      <FiMail size={12} />
                      {email}
                    </p>
                  )}
                  <span
                    className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wide border ${meta.color}`}
                  >
                    <FiShield size={10} />
                    {meta.label}
                  </span>
                </div>
              </div>

              {/* Menu items */}
              <div className="p-2.5 space-y-1">
                <button
                  role="menuitem"
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-steel-300 transition-all hover:bg-white/5 hover:text-steel-200 dark:text-white"
                  onClick={() => { setProfileOpen(false); navigate('/profile') }}
                >
                  <FiUser size={16} />
                  View Profile
                </button>
                <button
                  role="menuitem"
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-steel-300 transition-all hover:bg-white/5 hover:text-steel-200 dark:text-white"
                  onClick={() => { setProfileOpen(false); navigate('/settings') }}
                >
                  <FiSettings size={16} />
                  Account Settings
                </button>
                <button
                  role="menuitem"
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-steel-300 transition-all hover:bg-white/5 hover:text-steel-200 dark:text-white"
                  onClick={toggleTheme}
                >
                  {theme === 'dark' ? <FiSun size={16} /> : <FiMoon size={16} />}
                  {theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                </button>
              </div>

              {/* Footer: Logout */}
              <div className="border-t border-white/5 p-2.5">
                <button
                  role="menuitem"
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-danger transition-all hover:bg-danger/10"
                  onClick={handleLogout}
                >
                  <FiLogOut size={16} />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Topbar
