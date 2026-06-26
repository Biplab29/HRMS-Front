import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { FiDownload, FiFilter, FiPlay, FiRefreshCw, FiShield, FiTrendingUp } from 'react-icons/fi'
import AppShell from '../components/layout/AppShell.jsx'
import PayrollTable from '../components/tables/PayrollTable.jsx'
import Panel from '../components/ui/Panel.jsx'
import StatCard from '../components/ui/StatCard.jsx'
import {
  fetchPayrolls,
  markPaid,
  selectPayrollLoading,
  selectPayrolls,
} from '../store/slices/payrollSlice'
import { selectSession, selectUser } from '../store/slices/authSlice'

const formatMoney = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0))

const formatTitle = (value) =>
  String(value || '')
    .replace('-', ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())

const getInitials = (name = 'Employee') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

const mapPayrollRecord = (record) => {
  const employeeName = record.employee?.user?.name || record.employee?.employeeId || 'Employee'

  return {
    _id: record._id,
    employee: {
      name: employeeName,
      avatar: getInitials(employeeName),
      role: record.employee?.user?.role
        ? formatTitle(record.employee.user.role)
        : record.employee?.employeeId || 'Employee',
    },
    basic: formatMoney(record.basicSalary),
    deductions: `-${formatMoney(record.deduction)}`,
    net: formatMoney(record.totalSalary),
    status: record.paymentStatus === 'paid' ? 'Paid' : 'Pending',
  }
}

function Payroll() {
  const dispatch = useDispatch()
  const payrolls = useSelector(selectPayrolls)
  const loading = useSelector(selectPayrollLoading)
  const session = useSelector(selectSession)
  const currentUser = useSelector(selectUser)
  const userRole = session?.user?.role || currentUser?.role
  const canManagePayroll = userRole === 'admin' || userRole === 'hr'

  useEffect(() => {
    dispatch(fetchPayrolls())
  }, [dispatch])

  const reload = () => dispatch(fetchPayrolls())

  const records = payrolls.map(mapPayrollRecord)
  const totalPayroll = payrolls.reduce(
    (total, payroll) => total + Number(payroll.totalSalary || 0),
    0,
  )
  const pendingCount = payrolls.filter(
    (payroll) => payroll.paymentStatus !== 'paid',
  ).length
  const paidCount = payrolls.length - pendingCount

  const handleMarkPaid = async (payrollId) => {
    const toastId = toast.loading('Marking payroll paid...')
    const result = await dispatch(markPaid(payrollId))
    if (markPaid.fulfilled.match(result)) {
      toast.success('Payroll marked as paid', { id: toastId })
    } else {
      toast.error(result.payload || 'Payment update failed', { id: toastId })
    }
  }


  return (
    <AppShell
      title="Payroll"
      search="Search payroll records..."
      action={
        <button
          className="primary-button"
          type="button"
          onClick={reload}
        >
          <FiRefreshCw /> Refresh API
        </button>
      }
    >
      <header className="mb-4 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="page-title">Payroll Management</h1>
          <p className="mt-1 text-[12px] text-steel-400">
            Manage organization-wide disbursements and compliance records from backend payroll APIs.
          </p>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Total Payroll Cost"
          value={formatMoney(totalPayroll)}
          subtext={`${payrolls.length} records`}
          icon={FiTrendingUp}
          tone="success"
        />
        <StatCard
          label="Pending Payments"
          value={String(pendingCount)}
          subtext="Action required"
          tone="danger"
        />
        <StatCard
          label="Tax Compliance Status"
          value={paidCount ? 'Verified' : 'Pending'}
          subtext={`${paidCount} paid records`}
          icon={FiShield}
          tone={paidCount ? 'success' : 'warning'}
        />
      </section>

      <Panel
        className="mt-4"
        title="Employee Payroll Records"
        action={
          <div className="flex gap-2">
            <button className="soft-button" type="button"><FiFilter /> Filter</button>
            <button className="soft-button" type="button"><FiDownload /> Export CSV</button>
            {canManagePayroll && (
              <button className="soft-button" type="button"><FiPlay /> Run</button>
            )}
          </div>
        }
      >
        <PayrollTable
          records={records}
          loading={loading}
          onMarkPaid={canManagePayroll ? handleMarkPaid : null}
        />
      </Panel>
    </AppShell>
  )
}

export default Payroll
