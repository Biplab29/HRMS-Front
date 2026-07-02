import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FiDownload, FiFileText, FiPrinter } from 'react-icons/fi'
import AppShell from '../components/layout/AppShell.jsx'
import { fetchPayrolls, selectPayrolls } from '../store/slices/payrollSlice'
import Info from '../components/ui/Info.jsx'
import Breakdown from '../components/ui/Breakdown.jsx'

const formatMoney = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0))

function Payslip() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const payrolls = useSelector(selectPayrolls)

  useEffect(() => {
    if (payrolls.length === 0) {
      dispatch(fetchPayrolls())
    }
  }, [dispatch, payrolls.length])

  const record = payrolls.find(p => p._id === id)

  if (!record) {
    return (
      <AppShell title="Payslip" search="Search payroll...">
        <div className="p-6 text-steel-400">Loading payslip...</div>
      </AppShell>
    )
  }

  const employee = record.employee || {}
  const employeeName = employee.user?.name || employee.employeeId || 'Employee'
  const employeeEmail = employee.user?.email || 'N/A'
  const designation = employee.designation?.title || 'Unassigned'
  const department = employee.department?.departmentName || 'Unassigned'
  
  const earnings = [
    ['Basic Salary', formatMoney(record.basicSalary)],
    ['Bonus', formatMoney(record.bonus || 0)]
  ]
  
  const deductions = [
    ['TDS / Tax', formatMoney(record.deduction || 0)]
  ]
  return (
    <AppShell title="Employee Payslip" search="Search payroll...">
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #print-area, #print-area * {
            visibility: visible !important;
          }
          #print-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            background: white !important;
            color: black !important;
            box-shadow: none !important;
          }
          #print-area * {
            color: #000000 !important;
          }
          .text-brand-300 {
            color: #1f9c5e !important;
          }
          .bg-brand-500 {
            background-color: #25c979 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
      <div className="mb-4 flex items-center justify-between gap-3">
        <Link className="text-[12px] text-steel-400 hover:text-brand-300" to="/payroll">← Back to Payroll</Link>
        <div className="flex gap-2">
          <button className="soft-button" type="button" onClick={() => window.print()}><FiPrinter /> Print</button>
          <button className="primary-button h-8 bg-brand-300 text-ink-950" type="button" onClick={() => window.print()}><FiDownload /> Download PDF</button>
        </div>
      </div>

      <article id="print-area" className="console-card mx-auto max-w-[780px] p-6">
        <header className="flex items-start justify-between border-b border-ink-650 pb-6">
          <div className="flex gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded bg-brand-500 text-xl text-white">
              <FiFileText />
            </span>
            <div>
              <h1 className="text-lg font-semibold text-steel-200 dark:text-white">HRMS Enterprise</h1>
              <p className="text-[12px] text-steel-400">452 Tech Corridor, Silicon Valley, CA</p>
              <p className="text-[12px] text-steel-400">contact@hrms-enterprise.io</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-semibold uppercase text-brand-300">Payslip</h2>
            <span className="mt-4 inline-flex rounded bg-ink-750 px-4 py-3 text-[12px] text-steel-300">Pay Period<br />{record.month}</span>
          </div>
        </header>

        <section className="grid gap-4 border-b border-ink-650 py-5 text-[12px] sm:grid-cols-4">
          <Info label="Employee Name" value={employeeName} />
          <Info label="Employee ID" value={employee.employeeId || 'N/A'} />
          <Info label="Designation" value={designation} />
          <Info label="Department" value={department} />
          <Info label="Email" value={employeeEmail} />
          <Info label="Date of Joining" value={employee.joiningDate ? new Date(employee.joiningDate).toLocaleDateString() : 'N/A'} />
          <Info label="Payment Method" value="Direct Deposit" />
          <Info label="Status" value={record.paymentStatus === 'paid' ? 'Paid' : 'Pending'} success={record.paymentStatus === 'paid'} />
        </section>

        <section className="grid gap-4 py-5 lg:grid-cols-2">
          <Breakdown title="Earnings Breakdown" rows={earnings} total="Total Gross Earnings" amount={formatMoney((record.basicSalary || 0) + (record.bonus || 0))} />
          <Breakdown title="Deductions & Taxes" rows={deductions} total="Total Deductions" amount={formatMoney(record.deduction || 0)} danger />
        </section>

        <section className="rounded bg-brand-500 p-5 text-ink-950">
          <p className="text-[11px] font-semibold uppercase">Take Home Pay</p>
          <div className="mt-2 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="text-3xl font-bold">NET SALARY: {formatMoney(record.totalSalary)}</h2>
              <p className="text-[12px]">Amount transferred to bank account</p>
            </div>
            <p className="max-w-[260px] text-[11px] font-semibold">Electronically Generated. This is a system generated document and does not require a physical signature.</p>
          </div>
        </section>

        <footer className="mt-5 border-t border-ink-650 pt-5 text-[12px] text-steel-400">
          <p>This payslip is generated from live HRMS API data.</p>
        </footer>
      </article>
    </AppShell>
  )
}

export default Payslip
