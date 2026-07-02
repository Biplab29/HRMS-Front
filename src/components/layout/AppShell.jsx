import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectSession } from '../../store/slices/authSlice.js'
import Sidebar from './Sidebar.jsx'
import Topbar from './Topbar.jsx'
import OnboardingModal from '../ui/OnboardingModal.jsx'
import Footer from './Footer.jsx'
import LeaveApplicationModal from '../ui/LeaveApplicationModal.jsx'
import { closeLeaveModal, selectIsLeaveModalOpen } from '../../store/slices/leaveSlice'

function AppShell({ children, title, search, action }) {
  const dispatch = useDispatch()
  const session = useSelector(selectSession)
  const isLeaveModalOpen = useSelector(selectIsLeaveModalOpen)
  
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  // Show modal if user is an employee/manager and onboarding is NOT completed
  const showOnboarding = session?.user?.role !== 'admin' && 
                         session?.user?.role !== 'hr' && 
                         session?.employee && 
                         session.employee.onboardingCompleted === false

  return (
    <div className="relative min-h-screen bg-ink-950 text-steel-200 overflow-hidden font-sans">
      {showOnboarding && <OnboardingModal />}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-600/10 mix-blend-screen filter blur-[100px] animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[35%] h-[35%] rounded-full bg-brand-400/10 mix-blend-screen filter blur-[120px] animate-blob" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[50%] rounded-full bg-brand-500/10 mix-blend-screen filter blur-[150px] animate-blob" style={{ animationDelay: '4s' }}></div>
      </div>
      {isMobileSidebarOpen && (
        <div 
          onClick={() => setIsMobileSidebarOpen(false)} 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden" 
        />
      )}

      <div className="relative z-10 grid min-h-screen lg:grid-cols-[260px_minmax(0,1fr)]">
        <Sidebar isOpen={isMobileSidebarOpen} onClose={() => setIsMobileSidebarOpen(false)} />
        <div className="min-w-0 flex flex-col h-screen overflow-y-auto">
          <Topbar title={title} search={search} action={action} onToggleSidebar={() => setIsMobileSidebarOpen(true)} />
          <main className="mx-auto w-full flex-1 max-w-[1200px] px-6 py-8 animate-fade-in">
            {children}
          </main>
          <Footer />
        </div>
      </div>
      <LeaveApplicationModal isOpen={isLeaveModalOpen} onClose={() => dispatch(closeLeaveModal())} />
    </div>
  )
}

export default AppShell
