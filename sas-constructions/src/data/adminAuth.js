const ADMIN_SESSION_KEY = 'sas-admin-session-v1'

export const DEMO_ADMIN_PASSWORD = 'sas-demo-admin'

export const isAdminAuthenticated = () => typeof window !== 'undefined' && window.localStorage?.getItem(ADMIN_SESSION_KEY) === 'authenticated'

export const loginAdmin = (password) => {
  if (password !== DEMO_ADMIN_PASSWORD) return false
  window.localStorage.setItem(ADMIN_SESSION_KEY, 'authenticated')
  return true
}

export const logoutAdmin = () => window.localStorage?.removeItem(ADMIN_SESSION_KEY)
