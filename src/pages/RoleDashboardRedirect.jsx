import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { getDashboardPath, getStoredUser } from '../utils/roleRoutes'
import { selectUser } from '../store/slices/authSlice'

function RoleDashboardRedirect() {
  const user = useSelector(selectUser) || getStoredUser()

  return <Navigate to={getDashboardPath(user?.role)} replace />
}

export default RoleDashboardRedirect
