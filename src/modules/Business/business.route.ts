import { businessController } from './business.controller'
import * as express from 'express'

export class businessRouterClass {
  public router: express.Router = express.Router()
  constructor() {
    this.config()
  }
  private config(): void {
    this.router.post('/', businessController.getbusinessList)
    this.router.post('/add', businessController.addnewbusiness)
    this.router.post('/update', businessController.updatebusiness)
  }
}
export const businessRouter = new businessRouterClass().router
