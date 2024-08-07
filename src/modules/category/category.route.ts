import * as express from 'express'
import { categoryController } from './caregory.controller'

export class categoryRouterClass {
  public router: express.Router = express.Router()
  constructor() {
    this.config()
  }
  private config(): void {
    this.router.post('/', categoryController.getCategory)
    this.router.post('/add', categoryController.addNewCategory)
    this.router.post('/update', categoryController.updateCategory)
    this.router.delete('/delete', categoryController.deleteCategory)
  }
}
export const categoryRouter = new categoryRouterClass().router
