import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Navigate, Route, Routes } from 'react-router-dom'
import { fetchCurrentUser } from './store/slices/authSlice.js'
import AcceptInvite from './pages/AcceptInvite.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import Attendance from './pages/Attendance.jsx'
import EmployeeDashboard from './pages/EmployeeDashboard.jsx'
import Employees from './pages/Employees.jsx'
import LeaveManagement from './pages/LeaveManagement.jsx'
import Login from './pages/Login.jsx'
import Payroll from './pages/Payroll.jsx'
import Payslip from './pages/Payslip.jsx'
import Reports from './pages/Reports.jsx'
import RoleDashboardRedirect from './pages/RoleDashboardRedirect.jsx'
import Settings from './pages/Settings.jsx'
import Profile from './pages/Profile.jsx'
import Signup from './pages/Signup.jsx'
import Tasks from './pages/Tasks.jsx'

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    if (localStorage.getItem('user')) {
      dispatch(fetchCurrentUser())
    }
  }, [dispatch])

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/accept-invite" element={<AcceptInvite />} />
      <Route path="/dashboard" element={<RoleDashboardRedirect />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
      <Route path="/employees" element={<Employees />} />
      <Route path="/attendance" element={<Attendance />} />
      <Route path="/leave" element={<LeaveManagement />} />
      <Route path="/payroll" element={<Payroll />} />
      <Route path="/payroll/payslip/:id" element={<Payslip />} />
      <Route path="/tasks" element={<Tasks />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/notifications" element={<RoleDashboardRedirect />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
