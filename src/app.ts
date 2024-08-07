import express, { Request, Response, NextFunction } from 'express'
import { baseRouter } from './router/index'
import * as bodyParser from 'body-parser'
import { securityUtility } from './utils/security'
import { scheduler } from './utils/scheduler'

class appClass {
  public app: express.Application
  constructor() {
    this.app = express()
    this.config()
  }
  private config(): void {
    //disable x-powered-by:express header
    this.app.disable('x-powered-by')
    //suppport application/json
    this.app.use(bodyParser.json({ limit: '50mb' }))
    //  this.app.use(json2xls.middleware);
    //support application/x-www-form-urlencoded post data
    this.app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))
    // enabled cors middleware
    this.app.use(securityUtility.cors)
    // Use the index router for all routes starting with '/'
    this.app.use('/', baseRouter)
    //enabled cron schedules
    scheduler.start()
    // Middleware to log requests
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      console.log(`${req.method} request for '${req.url}'`)
      next()
    })
    // Error-handling middleware
    this.app.use(
      (err: Error, req: Request, res: Response, next: NextFunction): void => {
        console.error(err.stack)
        res.status(500)
      },
    )
    //Not Found Routers
    this.app.use((req, res, next) => {
      res
        .status(404)
        .send({ message: 'The Requested URL was not found on this server.' })
    })
  }
}
export default new appClass().app
