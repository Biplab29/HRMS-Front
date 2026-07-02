import { FiFileText } from 'react-icons/fi'
import { useSelector } from 'react-redux'
import { selectUser } from '../../store/slices/authSlice.js'
import { getStoredUser } from '../../utils/roleRoutes.js'

function Brand({ compact = false }) {
  const user = useSelector(selectUser) || getStoredUser()
  const role = user?.role || 'admin'

  const consoleLabels = {
    admin: 'Admin Console',
    hr: 'HR Console',
    manager: 'Manager Console',
    employee: 'Employee Portal',
  }

  const subtitle = consoleLabels[role] || 'Console'

  return (
    <div className="flex items-center gap-3">
      {compact && (
        <span className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-500 text-lg text-white">
          <FiFileText aria-hidden="true" />
        </span>
      )}
      <div>
        <h1 className="text-[28px] font-semibold leading-[0.95] tracking-normal text-brand-300">
          People
          <span className="block text-steel-200 dark:text-white">Grid</span>
        </h1>
        <p className="mt-1 text-[11px] text-steel-400">{subtitle}</p>
      </div>
    </div>
  )
}

export default Brand
