import { dbUtility } from '../../config/models/db'
import { userSql } from '../../config/models/queries/queries'
import { emailUtility } from '../../utils/email'
import { userHelper } from './user.helper'
import bcrypt from 'bcrypt'

export class userRepositoryClass {
  public async getAllUserRepository(request: any, body: any): Promise<any> {
    let dbPromise = new Promise(async (resolve, reject) => {
      try {
        let dbSql
        let result
        if (Object.keys(body)?.length) {
          dbSql = userSql.getUserByName
          result = await dbUtility.query(dbSql, body)
        } else {
          dbSql = userSql.getAllUsers
          result = await dbUtility.query(dbSql)
        }

        resolve(result)
      } catch (error) {
        console.log(error)
        reject(error)
      }
    })
    return dbPromise
  }

  public insertUserRepository(data: any): any {
    let dbPromise = new Promise(async (resolve, reject) => {
      try {
        // generate password
        const generatedPassword: any = await userHelper.generatePassword()
        data.password = generatedPassword.hashed
        data.status = true
        const emailBody = `<p>One time password: <strong>${generatedPassword.plainPassword}</strong>. Please change it after your first login.</p>`

        let configSql = { table: 'users' }
        let dbSql = dbUtility.insertSQL(data, configSql)
        const result = await dbUtility.query(dbSql)
        emailUtility
          .sendEmail(data.email, emailBody)
          .then(() => {
            resolve(result)
          })
          .catch((emailError: any) => {
            console.error('Failed to send email:', emailError)
            reject({ emailError, emailSent: false })
          })
        // resolve(result)
      } catch (error) {
        console.log(error)
        reject(error)
      }
    })
    return dbPromise
  }
  public updateUserRepository(data: any): any {
    let dbPromise = new Promise(async (resolve, reject) => {
      try {
        let configSql = { table: 'users' }
        let dbSql = dbUtility.updateSQL(data, configSql)
        const result = await dbUtility.query(dbSql)
        resolve(result)
      } catch (error) {
        console.log(error)
        reject(error)
      }
    })
    return dbPromise
  }

  public LoginUserRepository(body: any): any {
    let dbPromise = new Promise(async (resolve, reject) => {
      try {
        const { password } = body
        const dbSql = userSql.getUserByEmail
        const result = await dbUtility.query(dbSql, body)

        if (result.length === 0) {
          reject({ error: 'User not found' })
          return
        }

        const user = result[0]
        if (body?.platform != user.role) {
          reject({ error: 'Forbidden' })
          return
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
          reject({ error: 'Invalid password' })
          // throw new Error()
          return
        }

        const accessToken = userHelper.generateAccessToken(user)
        const refreshToken = userHelper.generateRefreshToken(user)
        const token = { accessToken, refreshToken }

        resolve({ user, token })
      } catch (error) {
        console.log(error)
        reject(error)
        // throw error
      }
    })
    return dbPromise
  }

  public resetPasswordRepository(body: any): any {
    let dbPromise = new Promise(async (resolve, reject) => {
      try {
        const { password } = body
        const dbSql = userSql.getUserByEmail
        const result = await dbUtility.query(dbSql, body)

        if (result.length === 0) {
          reject({ error: 'User not found' })
          return
        }
        body.id = result[0]?.id
        if (body?.platform != result[0].role) {
          reject({ error: 'Forbidden' })
          return
        }
        const generatedPassword: any =
          await userHelper.generatePassword(password)
        delete body?.email
        body.password = generatedPassword.hashed

        this.updateUserRepository(body)
          .then((res: any) => resolve(res))
          .catch((err: any) => reject(err))
      } catch (error) {
        reject(error)
      }
    })
    return dbPromise
  }
  // private generateAccessToken(user: any): string {
  //   return jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
  //     expiresIn: '15m',
  //   })
  // }

  // private generateRefreshToken(user: any): string {
  //   return jwt.sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET!, {
  //     expiresIn: '7d',
  //   })
  // }

  // private async storeRefreshToken(
  //   userId: number,
  //   refreshToken: string,
  // ): Promise<void> {
  //   await this.redisClient.set(`refresh_token:${userId}`, refreshToken, {
  //     EX: 7 * 24 * 60 * 60,
  //   }) // 7 days
  // }
}

export const userRepository = new userRepositoryClass()
