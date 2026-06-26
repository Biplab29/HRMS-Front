export const getDashboardPath = (role) => {
  if (role === 'admin') return '/admin/dashboard'
  return '/employee/dashboard'
}

export const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user')) || null
  } catch {
    return null
  }
}
