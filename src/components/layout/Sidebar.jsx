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

function Sidebar() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector(selectUser) || getStoredUser()

  const handleLogout = async () => {
    await dispatch(logoutUser())
    navigate('/')
  }

  return (
    <aside className="flex min-h-screen flex-col border-r border-white/5 bg-ink-900/30 backdrop-blur-2xl px-4 py-5 md:sticky md:top-0 transition-all duration-300">
      <Brand />

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
