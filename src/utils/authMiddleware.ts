import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

// Simple in-memory token blacklist
const tokenBlacklist: Set<string> = new Set()

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'No token provided' })
  }

  if (tokenBlacklist.has(token)) {
    return res.status(401).json({ error: 'Token has been blacklisted' })
  }

  try {
    console.log('Attempting to verify token:', token)
    console.log('Using JWT_SECRET:', process.env.JWT_SECRET!)

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    // console.log('Token verified successfully. Decoded:')

    ;(req as any).user = decoded
    next()
  } catch (error) {
    console.error('Error verifying token:', error)
    if (error instanceof jwt.JsonWebTokenError) {
      return res
        .status(403)
        .json({ error: 'Invalid token', details: error.message })
    } else if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: 'Token expired' })
    } else {
      return res.status(500).json({ error: 'Internal server error' })
    }
  }
}

export const blacklistToken = (token: string) => {
  tokenBlacklist.add(token)
}
