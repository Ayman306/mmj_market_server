// src/routes/index.ts

import express, { Router, Request, Response } from 'express'
import { userRouter } from '../modules/user/user.route'
import { jobPostRouter } from '../modules/jobs/jobPost.route'
import { categoryRouter } from '../modules/category/category.route'
import refreshToken from '../utils/refreshToken'
const app = express()
const router = Router()

// Define a simple route
router.get('/', (req: Request, res: Response) => {
  res.send('Define route')
})

// user router
app.use('/user', userRouter)

// jobs router
app.use('/job', jobPostRouter)

// category route
app.use('/category', categoryRouter)

app.use('/auth', refreshToken)

export default app
