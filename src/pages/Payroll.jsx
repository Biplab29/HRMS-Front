import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { FiDownload, FiFilter, FiPlay, FiRefreshCw, FiShield, FiTrendingUp } from 'react-icons/fi'
import AppShell from '../components/layout/AppShell.jsx'
import PayrollTable from '../components/tables/PayrollTable.jsx'
import Panel from '../components/ui/Panel.jsx'
import StatCard from '../components/ui/StatCard.jsx'
import PayrollModal from '../components/ui/PayrollModal.jsx'
import {
  fetchPayrolls,
  markPaid,
  selectPayrollLoading,
  selectPayrolls,
} from '../store/slices/payrollSlice'
import { fetchAllEmployeeData, selectEmployees } from '../store/slices/employeeSlice'
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
  const employees = useSelector(selectEmployees)
  const userRole = session?.user?.role || currentUser?.role
  const canManagePayroll = userRole === 'admin' || userRole === 'hr'

  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    dispatch(fetchPayrolls())
    if (canManagePayroll) {
      dispatch(fetchAllEmployeeData())
    }
  }, [dispatch, canManagePayroll])

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

  const handleExportCSV = () => {
    if (payrolls.length === 0) return toast.error("No payroll records to export")
    const headers = ["Employee Name", "Employee ID", "Month", "Basic Salary", "Bonus", "Deductions", "Net Salary", "Status"]
    const rows = payrolls.map(p => [
      p.employee?.user?.name || "N/A",
      p.employee?.employeeId || "N/A",
      p.month,
      p.basicSalary,
      p.bonus || 0,
      p.deduction || 0,
      p.totalSalary,
      p.paymentStatus
    ])
    const csvContent = [
      headers.join(","),
      ...rows.map(r => r.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))
    ].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `payroll_export_${new Date().toISOString().slice(0,10)}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success("CSV exported successfully")
  }


  return (
    <AppShell
      title={canManagePayroll ? "Payroll" : "My Payslips"}
      search={canManagePayroll ? "Search payroll records..." : "Search payslips..."}
      action={
        canManagePayroll && (
          <button
            className="primary-button"
            type="button"
            onClick={reload}
          >
            <FiRefreshCw /> Refresh API
          </button>
        )
      }
    >
      <header className="mb-4 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="page-title">
            {canManagePayroll ? "Payroll Management" : "My Payslips"}
          </h1>
          <p className="mt-1 text-[12px] text-steel-400">
            {canManagePayroll 
              ? "Manage organization-wide disbursements and compliance records from backend payroll APIs." 
              : "View your monthly salary disbursements, tax deductions, and download payslips."}
          </p>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard
          label={canManagePayroll ? "Total Payroll Cost" : "Total Net Salary"}
          value={formatMoney(totalPayroll)}
          subtext={`${payrolls.length} record${payrolls.length !== 1 ? 's' : ''}`}
          icon={FiTrendingUp}
          tone="success"
        />
        <StatCard
          label={canManagePayroll ? "Pending Payments" : "Unpaid Periods"}
          value={String(pendingCount)}
          subtext={canManagePayroll ? "Action required" : "Awaiting disbursement"}
          tone={pendingCount > 0 ? "danger" : "success"}
        />
        <StatCard
          label={canManagePayroll ? "Tax Compliance Status" : "Processed Payslips"}
          value={canManagePayroll ? (paidCount ? 'Verified' : 'Pending') : `${paidCount} Paid`}
          subtext={canManagePayroll ? `${paidCount} paid records` : "Deposited to bank account"}
          icon={FiShield}
          tone={paidCount ? 'success' : 'warning'}
        />
      </section>

      <Panel
        className="mt-4"
        title={canManagePayroll ? "Employee Payroll Records" : "My Payslips History"}
        action={
          canManagePayroll ? (
            <div className="flex gap-2">
              <button className="soft-button" type="button"><FiFilter /> Filter</button>
              <button className="soft-button" type="button" onClick={handleExportCSV}><FiDownload /> Export CSV</button>
              <button className="soft-button" type="button" onClick={() => setIsModalOpen(true)}><FiPlay /> Generate Payroll</button>
            </div>
          ) : null
        }
      >
        <PayrollTable
          records={records}
          loading={loading}
          onMarkPaid={canManagePayroll ? handleMarkPaid : null}
          canManagePayroll={canManagePayroll}
        />
      </Panel>
      <PayrollModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        employees={employees}
      />
    </AppShell>
  )
}

export default Payroll
