// src/routes/index.ts

import express, { Router, Request, Response } from 'express';
import { userRouter } from './user.route';
import { jobPostRouter } from './jobPost.route';
const app = express()
const router = Router();

// Define a simple route
router.get('/', (req: Request, res: Response) => {
  res.send('Define route');
});

// user router
app.use('/user', userRouter); 

// jobs router 
app.use('/job',jobPostRouter)

// Define another route


export default app;
