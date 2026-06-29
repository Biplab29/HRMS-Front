import { FiFileText } from 'react-icons/fi'

function Brand({ compact = false }) {
  return (
    <div className="flex items-center gap-3">
      {compact && (
        <span className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-500 text-lg text-white">
          <FiFileText aria-hidden="true" />
        </span>
      )}
      <div>
        <h1 className="text-[28px] font-semibold leading-[0.95] tracking-normal text-brand-300">
          HRMS
          <span className="block text-steel-200 dark:text-white">Portal</span>
        </h1>
        <p className="mt-1 text-[11px] text-steel-400">Admin Console</p>
      </div>
    </div>
  )
}

export default Brand
