import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  FiBarChart2,
  FiBell,
  FiBriefcase,
  FiCalendar,
  FiCheckSquare,
  FiCreditCard,
  FiGrid,
  FiLifeBuoy,
  FiLogOut,
  FiPlus,
  FiSettings,
  FiUsers,
  FiX,
} from 'react-icons/fi'
import Brand from '../ui/Brand.jsx'
import { navItems } from '../../data/navConfig.js'
import { logoutUser, selectUser } from '../../store/slices/authSlice.js'
import { getDashboardPath, getStoredUser } from '../../utils/roleRoutes.js'
import { openLeaveModal } from '../../store/slices/leaveSlice'

const iconMap = {
  FiGrid,
  FiUsers,
  FiCalendar,
  FiBriefcase,
  FiCheckSquare,
  FiCreditCard,
  FiBarChart2,
  FiBell,
  FiSettings,
}

function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector(selectUser) || getStoredUser()

  const handleLogout = async () => {
    await dispatch(logoutUser())
    navigate('/')
  }

  return (
    <aside className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-white/5 bg-ink-900/95 backdrop-blur-2xl px-4 py-5 transition-transform duration-300 ease-in-out md:sticky md:top-0 md:z-auto md:flex md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex items-center justify-between">
        <Brand />
        <button
          onClick={onClose}
          className="rounded-lg border border-white/5 bg-ink-950 p-2 text-steel-400 hover:text-white md:hidden"
          type="button"
          aria-label="Close sidebar"
        >
          <FiX size={18} />
        </button>
      </div>

      <button 
        className="primary-button mt-8 w-full" 
        type="button"
        onClick={() => dispatch(openLeaveModal())}
      >
        <FiPlus aria-hidden="true" />
        Leave Request
      </button>

      <nav className="mt-8 flex flex-1 flex-col gap-1.5" aria-label="Main navigation">
        {navItems
          .filter((item) => {
            if (user?.role === 'employee' && item.label === 'Employees') return false;
            return true;
          })
          .map((item) => {
          const Icon = iconMap[item.icon]
          const path =
            item.label === 'Dashboard' ? getDashboardPath(user?.role) : item.path

          const isManagerOrAdmin = user?.role === 'admin' || user?.role === 'hr'
          const label = item.label === 'Payroll' && !isManagerOrAdmin ? 'My Payslips' : item.label

          return (
            <NavLink
              key={item.label}
              className={({ isActive }) => `nav-item ${isActive ? 'nav-item-active' : ''}`}
              to={path}
            >
              <Icon aria-hidden="true" size={18} />
              <span>{label}</span>
            </NavLink>
          )
        })}
      </nav>

      <div className="mt-8 border-t border-white/5 pt-4">
        <a className="nav-item" href="#support">
          <FiLifeBuoy aria-hidden="true" size={18} />
          <span>Support</span>
        </a>
        <button className="nav-item w-full" type="button" onClick={handleLogout}>
          <FiLogOut aria-hidden="true" size={18} className="text-danger" />
          <span className="text-danger">Logout</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
