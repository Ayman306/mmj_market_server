import { userController } from './user.controller'
import * as express from 'express'

export class userRouterClass {
  public router: express.Router = express.Router()
  constructor() {
    this.config()
  }
  private config(): void {
    this.router.post('/', userController.getUserList)
    this.router.post('/add', userController.addnewUser)
    this.router.post('/update', userController.updateUser)
    this.router.post('/login', userController.loginUser)
    this.router.post('/reset-password', userController.resetPassword)

    // this.router.post('/refresh-token', userController.refreshToken)
  }
}
export const userRouter = new userRouterClass().router
