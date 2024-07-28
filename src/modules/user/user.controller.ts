import { Request, Response, NextFunction } from 'express'
import { userRepository } from './user.repository'
import { emailUtility } from '../../utils/email'
import { userHelper } from './user.helper'

class userControllerClass {
  public getUserList(req: Request, res: Response, next: NextFunction) {
    const user = req.body
    userRepository
      .getAllUserRepository(req, user)
      .then((data: any) => {
        res.status(200).send(data)
      })
      .catch((err: any) => {
        res.status(500).send(err)
      })
  }
  public addnewUser(req: Request, res: Response, next: NextFunction) {
    const data = req.body

    userRepository
      .insertUserRepository(data)
      .then((k: any) => {
        res.status(200).send(k)
      })
      .catch((err: any) => {
        res.status(500).send(err)
      })
  }
  public updateUser(req: Request, res: Response, next: NextFunction) {
    const data = req.body
    userRepository
      .updateUserRepository(data)
      .then((data: any) => {
        res.status(200).send(data)
      })
      .catch((err: any) => {
        res.status(500).send(err)
      })
  }
  public loginUser(req: Request, res: Response, next: NextFunction) {
    const user = req.body
    userRepository
      .LoginUserRepository(user)
      .then((data: any) => {
        res.status(200).send(data)
      })
      .catch((err: any) => {
        res.status(500).send(err)
      })
  }
  public resetPassword(req: Request, res: Response, next: NextFunction) {
    const user = req.body
    userRepository
      .LoginUserRepository(user)
      .then((data: any) => {
        res.status(200).send(data)
      })
      .catch((err: any) => {
        res.status(500).send(err)
      })
  }
  // public refreshToken(req: Request, res: Response, next: NextFunction) {
  //   const { refreshToken } = req.body

  // if (!refreshToken) {
  //   return res.status(401).json({ error: 'Refresh token required' })
  // }
  //   userRepository
  //     .refreshTokenRepository(refreshToken)
  //     .then((data: any) => {
  //       res.status(200).send(data)
  //     })
  //     .catch((err: any) => {
  //       res.status(403).json({ error: 'Invalid refresh token' })
  //     })
  // }
}
export const userController = new userControllerClass()
