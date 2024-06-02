// src/app.ts

import express, { Request, Response, NextFunction } from 'express';
import indexRouter from './router/index';
import dotenv from 'dotenv';
import { configureMiddleware } from './utils/configureMiddleWare';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// corse error 
configureMiddleware(app);

// Middleware to log requests
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} request for '${req.url}'`);
  next();
});

// Middleware to parse JSON bodies
app.use(express.json());

// Use the index router for all routes starting with '/'
app.use('/', indexRouter);
// Error-handling middleware
app.use((err: Error, req: Request, res: Response,  next: NextFunction): void => {
  console.error(err.stack);
  res.status(500);
});
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
