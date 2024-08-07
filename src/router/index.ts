// src/routes/index.ts

import express from 'express'
import { userRouter } from '../modules/user/user.route'
import { jobPostRouter } from '../modules/jobs/jobPost.route'
import { categoryRouter } from '../modules/category/category.route'
import refreshToken from '../utils/refreshToken'
export class baseRouterClass {
  public router: express.Router = express.Router()

  constructor() {
    this.config()
  }
  public config(): void {
    this.router.use('/user', userRouter)
    this.router.use('/job', jobPostRouter)
    this.router.use('/category', categoryRouter)
    this.router.use('/auth', refreshToken)
  }
}

export const baseRouter = new baseRouterClass().router
