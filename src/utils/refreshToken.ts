import express from 'express'
import jwt from 'jsonwebtoken'
import { createClient } from 'redis'
import { userHelper } from '../modules/user/user.helper'
import { authenticateToken, blacklistToken } from './authMiddleware'

const refreshToken = express.Router()

// const redisClient = createClient()
// redisClient.connect().catch(console.error)

refreshToken.post('/refresh-token', async (req, res) => {
  const { refreshToken } = req.body

  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token required' })
  }

  try {
    const user = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!,
    ) as any

    // const storedToken = (userHelper as any).cache[
    //   `refresh_token:${user.userId}`
    // ]?.data

    // const storedToken = await redisClient.get(`refresh_token:${user.userId}`)

    // if (storedToken !== refreshToken) {
    //   return res.status(403).json({ error: 'Invalid refresh token' })
    // }

    const accessToken = jwt.sign({ user: user }, process.env.JWT_SECRET!, {
      expiresIn: '15m',
    })
    res.json({ accessToken })
  } catch (error) {
    res.status(403).json({ error: 'Invalid refresh token' })
  }
})

refreshToken.post('/logout', (req, res) => {
  const { token } = req.body
  if (token) {
    blacklistToken(token)
  }
  res.sendStatus(200)
})

export default refreshToken
