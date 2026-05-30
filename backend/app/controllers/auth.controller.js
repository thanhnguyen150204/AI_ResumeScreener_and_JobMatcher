import {
  registerService,
  loginService,
  refreshTokenService,
  logoutService
} from '../services/auth.service.js'

export const register = async (req, res) => {
  try {
    if (!req.body) return res.status(400).json({ success: false, message: 'Request body is required' })
    const { email, password, role } = req.body
    const user = await registerService({ email, password, role })
    res.status(201).json({ success: true, data: user })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

export const login = async (req, res) => {
  try {
    if (!req.body) return res.status(400).json({ success: false, message: 'Request body is required' })
    const { email, password } = req.body
    const result = await loginService({ email, password })
    res.json({ success: true, data: result })
  } catch (error) {
    res.status(401).json({ success: false, message: error.message })
  }
}

export const refresh = async (req, res) => {
  try {
    if (!req.body) return res.status(400).json({ success: false, message: 'Request body is required' })
    const { refreshToken } = req.body
    const result = await refreshTokenService(refreshToken)
    res.json({ success: true, data: result })
  } catch (error) {
    res.status(401).json({ success: false, message: error.message })
  }
}

export const logout = async (req, res) => {
  try {
    if (!req.body) return res.status(400).json({ success: false, message: 'Request body is required' })
    const { refreshToken } = req.body
    await logoutService(refreshToken)
    res.json({ success: true, message: 'Logged out successfully' })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}
