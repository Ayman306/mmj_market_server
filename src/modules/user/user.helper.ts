import crypto, { randomBytes } from 'crypto'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import redis from 'redis'

class userHelperClass {
  // cache: { [key: string]: { data: any; expiry: number } } = {}
  public async generatePassword(password = ''): Promise<Object> {
    // return crypto.randomBytes(8).toString('hex')
    let plainPassword
    if (password?.length == 0) {
      const randomNumber = randomBytes(2).toString('hex')
      plainPassword = `mmj${randomNumber}`
    } else {
      plainPassword = password
    }

    // Hash the password
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds)
    const pas = { hashed: hashedPassword, plainPassword: plainPassword }
    return pas
  }

  public generateAccessToken(user: any): string {
    return jwt.sign({ user: user }, process.env.JWT_SECRET!, {
      expiresIn: '15m',
    })
  }

  public generateRefreshToken(user: any): string {
    return jwt.sign({ user: user }, process.env.JWT_REFRESH_SECRET!, {
      expiresIn: '7d',
    })
  }
}
export const userHelper = new userHelperClass()
