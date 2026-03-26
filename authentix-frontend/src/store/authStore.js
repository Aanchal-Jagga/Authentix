import { create } from 'zustand'

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('authentix_user') || 'null'),
  token: localStorage.getItem('authentix_token') || null,

  login: (userData, token) => {
    localStorage.setItem('authentix_user', JSON.stringify(userData))
    localStorage.setItem('authentix_token', token || '')
    set({ user: userData, token })
  },

  signup: (userData, token) => {
    localStorage.setItem('authentix_user', JSON.stringify(userData))
    localStorage.setItem('authentix_token', token || '')
    set({ user: userData, token })
  },

  logout: () => {
    localStorage.removeItem('authentix_user')
    localStorage.removeItem('authentix_token')
    set({ user: null, token: null })
  },
}))

export default useAuthStore
