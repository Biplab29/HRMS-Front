import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FiDownload, FiUsers } from 'react-icons/fi'
import AppShell from '../components/layout/AppShell.jsx'
import BarChart from '../components/charts/BarChart.jsx'
import DonutChart from '../components/charts/DonutChart.jsx'
import LineChart from '../components/charts/LineChart.jsx'
import Panel from '../components/ui/Panel.jsx'
import StatCard from '../components/ui/StatCard.jsx'
import StatusBadge from '../components/ui/StatusBadge.jsx'

import { fetchAllEmployeeData, selectEmployees, selectDepartments } from '../store/slices/employeeSlice'
import { fetchPayrolls, selectPayrolls } from '../store/slices/payrollSlice'

function Reports() {
  const dispatch = useDispatch()
  const employees = useSelector(selectEmployees)
  const departments = useSelector(selectDepartments)
  const payrolls = useSelector(selectPayrolls)

  useEffect(() => {
    dispatch(fetchAllEmployeeData())
    dispatch(fetchPayrolls())
  }, [dispatch])

  const totalHeadcount = employees.length
  
  const deptDist = useMemo(() => {
    const counts = {}
    employees.forEach(emp => {
      const deptName = emp.department?.departmentName || 'Unassigned'
      counts[deptName] = (counts[deptName] || 0) + 1
    })
    return Object.entries(counts).map(([name, count]) => ({
      name,
      percentage: totalHeadcount ? Math.round((count / totalHeadcount) * 100) : 0
    })).sort((a,b) => b.percentage - a.percentage).slice(0, 4)
  }, [employees, totalHeadcount])

  const availableReports = [
    { name: 'Full Employee Directory', type: 'CSV Export', generated: new Date().toLocaleDateString(), status: 'Available' },
    { name: 'Monthly Payroll Register', type: 'PDF / CSV', generated: new Date().toLocaleDateString(), status: 'Available' },
    { name: 'Leave Balances & History', type: 'Excel', generated: new Date().toLocaleDateString(), status: 'Available' },
    { name: 'Attendance & Exception Log', type: 'CSV Export', generated: new Date().toLocaleDateString(), status: 'Available' },
  ]
  return (
    <AppShell title="Reports & Analytics" search="Search analytics...">
      <header className="mb-4 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="page-title">Reports & Analytics</h1>
          <p className="mt-1 text-[12px] text-steel-400">Visualizing organizational health and resource allocation.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="soft-button" type="button">Last 30 Days</button>
          <button className="soft-button" type="button">All Departments</button>
          <button className="primary-button" type="button">Export</button>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-4">
        <StatCard label="Total Headcount" value={String(totalHeadcount)} subtext="Live Database Count" icon={FiUsers} tone="success" />
        <StatCard label="Registered Departments" value={String(departments.length)} subtext="Active Organization Units" tone="brand" />
        <StatCard label="Processed Payrolls" value={String(payrolls.length)} subtext="Historical Records" tone="success" />
        <StatCard label="Employee NPS" value="72" subtext="Pending Survey Integration" tone="warning" />
      </section>

      <section className="mt-4 grid gap-4 lg:grid-cols-[1fr_300px]">
        <Panel title="Employee Growth Over Time" action={<div className="flex gap-4 text-[11px] text-steel-300"><span>Projected</span><span>Actual</span></div>}>
          <LineChart compact />
        </Panel>
        <Panel title="Department Distribution">
          <DonutChart value={deptDist[0]?.percentage || 0} label={`${departments.length} Teams`} />
          <div className="mt-5 space-y-2 text-[12px]">
            {deptDist.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-steel-400">
                <span>{item.name}</span>
                <span>{item.percentage}%</span>
              </div>
            ))}
          </div>
        </Panel>
      </section>

      <Panel className="mt-4" title="Departmental Spend" eyebrow="Quarterly operational expenditure in INR" action={<div className="flex gap-2"><button className="soft-button h-7" type="button">Monthly</button><button className="soft-button h-7 border-brand-400" type="button">Quarterly</button></div>}>
        <BarChart />
      </Panel>

      <Panel className="mt-4" title="Available Data Exports" action={<a className="text-[11px] text-brand-300" href="#export">View Export Queue</a>}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-[12px]">
            <thead className="border-b border-ink-650 uppercase text-steel-300">
              <tr>
                {['Export Type', 'Format', 'Data Freshness', 'Status', 'Action'].map((head) => (
                  <th key={head} className="px-3 py-3 font-semibold">{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {availableReports.map((report) => (
                <tr key={report.name} className="border-b border-ink-650 last:border-0">
                  <td className="px-3 py-4 font-medium text-steel-200">{report.name}</td>
                  <td className="px-3 py-4 text-steel-400">{report.type}</td>
                  <td className="px-3 py-4">{report.generated}</td>
                  <td className="px-3 py-4"><StatusBadge tone="success">{report.status}</StatusBadge></td>
                  <td className="px-3 py-4">
                    <button className="icon-button" type="button" aria-label="Download export">
                      <FiDownload />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </AppShell>
  )
}

export default Reports
