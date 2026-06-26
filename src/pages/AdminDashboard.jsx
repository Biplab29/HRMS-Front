import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  FiActivity,
  FiBriefcase,
  FiCreditCard,
  FiRefreshCw,
  FiShield,
  FiUsers,
} from 'react-icons/fi'
import AppShell from '../components/layout/AppShell.jsx'
import BarChart from '../components/charts/BarChart.jsx'
import Panel from '../components/ui/Panel.jsx'
import StatCard from '../components/ui/StatCard.jsx'
import StatusBadge from '../components/ui/StatusBadge.jsx'
import { getApiErrorMessage } from '../services/api'
import { getAttendance, getEmployees, getLeaves, getPayrolls } from '../services/hrms'

const formatMoney = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0))

function AdminDashboard() {
  const [stats, setStats] = useState({
    employees: [],
    attendance: [],
    leaves: [],
    payrolls: [],
  })
  const [loading, setLoading] = useState(true)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let isMounted = true

    const loadAdminData = async () => {
      try {
        setLoading(true)
        const [employeeData, attendanceData, leaveData, payrollData] =
          await Promise.all([getEmployees(), getAttendance(), getLeaves(), getPayrolls()])

        if (!isMounted) return

        setStats({
          employees: employeeData.employees || [],
          attendance: attendanceData.attendance || [],
          leaves: leaveData.leaves || [],
          payrolls: payrollData.payrolls || [],
        })
      } catch (error) {
        if (isMounted) {
          toast.error(getApiErrorMessage(error, 'Could not load admin dashboard'))
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadAdminData()

    return () => {
      isMounted = false
    }
  }, [reloadKey])

  const activeEmployees = stats.employees.filter(
    (employee) => employee.user?.isActive !== false,
  ).length
  const pendingLeaves = stats.leaves.filter((leave) => leave.status === 'pending').length
  const totalPayroll = stats.payrolls.reduce(
    (total, payroll) => total + Number(payroll.totalSalary || 0),
    0,
  )
  const pendingPayrolls = stats.payrolls.filter(
    (payroll) => payroll.paymentStatus !== 'paid',
  ).length

  return (
    <AppShell
      title="Admin Dashboard"
      search="Search organization..."
      action={
        <button
          className="primary-button"
          type="button"
          onClick={() => setReloadKey((value) => value + 1)}
        >
          <FiRefreshCw /> Refresh
        </button>
      }
    >
      <section className="rounded-lg border border-ink-650 bg-gradient-to-br from-ink-750 via-ink-800 to-ink-900 p-6 shadow-insetLine">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <StatusBadge tone="brand">Admin Control Center</StatusBadge>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-steel-200 dark:text-white">
              Organization command dashboard
            </h1>
            <p className="mt-2 max-w-2xl text-[12px] leading-5 text-steel-400">
              Monitor workforce, attendance, leave risk, and payroll exposure from live backend APIs.
            </p>
          </div>
          <div className="rounded border border-ink-650 bg-ink-950 px-4 py-3 text-[12px] text-steel-300">
            {loading ? 'Syncing backend...' : 'Backend synced'}
          </div>
        </div>
      </section>

      <section className="mt-4 grid gap-4 md:grid-cols-4">
        <StatCard label="Total Employees" value={String(stats.employees.length)} subtext={`${activeEmployees} active`} icon={FiUsers} />
        <StatCard label="Attendance Records" value={String(stats.attendance.length)} subtext="Live records" icon={FiActivity} tone="success" />
        <StatCard label="Pending Leaves" value={String(pendingLeaves)} subtext="Needs approval" icon={FiBriefcase} tone="warning" />
        <StatCard label="Payroll Cost" value={formatMoney(totalPayroll)} subtext={`${pendingPayrolls} pending`} icon={FiCreditCard} tone="danger" />
      </section>

      <section className="mt-4 grid gap-4 lg:grid-cols-[1fr_360px]">
        <Panel title="Department Load" action={<span className="muted-label text-brand-300">Live employees</span>}>
          <BarChart values={[82, 64, 48, 72, 56]} />
        </Panel>

        <Panel title="Admin Actions" action={<FiShield className="text-brand-300" />}>
          {[
            ['Invite employees', '/employees', 'Create users, assign department/designation, and send invite links.'],
            ['Review payroll', '/payroll', 'Track pending salary records and mark payments as paid.'],
            ['Audit attendance', '/attendance', 'See organization-wide attendance health.'],
            ['Approve leave', '/leave', 'Resolve pending leave approvals quickly.'],
          ].map(([title, path, text]) => (
            <Link
              key={title}
              className="mb-3 block rounded border border-ink-650 bg-ink-800 p-4 transition hover:border-brand-400 hover:bg-ink-750"
              to={path}
            >
              <h2 className="text-sm font-semibold text-steel-200 dark:text-white">{title}</h2>
              <p className="mt-1 text-[12px] leading-5 text-steel-400">{text}</p>
            </Link>
          ))}
        </Panel>
      </section>
    </AppShell>
  )
}

export default AdminDashboard
