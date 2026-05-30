import prisma from '../config/prisma.js'
import { hashPassword, comparePassword } from '../utils/hash.utils.js'
import {
  generateRefreshToken,
  generateAccessToken,
  verifyRefreshToken
} from '../utils/jwt.util.js'

export const registerService = async ({ email, password, role }) => {
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) throw new Error('Email already exists')

  const passwordHash = await hashPassword(password)
  const user = await prisma.user.create({
    data: { email, passwordHash, role: role || 'USER' },
    select: { id: true, email: true, role: true, createdAt: true }
  })
  return user
}

export const loginService = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) throw Error('Invalid email or password')
  const isValid = await comparePassword(password, user.passwordHash)
  if (!isValid) throw Error('Invalid email or password')

  const payload = { userId: user.id, role: user.role }
  const accessToken = generateAccessToken(payload)
  const refreshToken = generateRefreshToken(payload)

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  await prisma.refreshToken.create({
    data: { token: refreshToken, userId: user.id, expiresAt }
  })

  return {
    accessToken,
    refreshToken,
    user: { id: user.id, email: user.email, role: user.role }
  }
}

export const refreshTokenService = async (refreshToken) => {
  let payload
  try {
    payload = verifyRefreshToken(refreshToken)
  } catch {
    throw Error('Invalid or expired refresh token')
  }
  const tokenInDb = await prisma.refreshToken.findUnique({
    where: { token: refreshToken }
  })
  if (!tokenInDb) throw Error('Token revoke or not found')
  const newAccessToken = generateAccessToken({
    userId: payload.userId,
    role: payload.role
  })
  return { accessToken: newAccessToken }
}

export const logoutService = async (refreshToken) => {
  await prisma.refreshToken.deleteMany({ where: { token: refreshToken } })
}
