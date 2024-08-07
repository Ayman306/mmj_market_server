import { Request, Response, NextFunction } from 'express'
import { businessRepository } from './business.repository'

class businessControllerClass {
  public getbusinessList(req: Request, res: Response, next: NextFunction) {
    const business = req.body
    businessRepository
      .getAllbusinessRepository(business)
      .then((data: any) => {
        res.status(200).send(data)
      })
      .catch((err: any) => {
        res.status(500).send(err)
      })
  }
  public addnewbusiness(req: Request, res: Response, next: NextFunction) {
    const data = req.body

    businessRepository
      .insertbusinessRepository(data)
      .then((k: any) => {
        res.status(200).send(k)
      })
      .catch((err: any) => {
        res.status(500).send(err)
      })
  }
  public updatebusiness(req: Request, res: Response, next: NextFunction) {
    const data = req.body
    businessRepository
      .updatebusinessRepository(data)
      .then((data: any) => {
        res.status(200).send(data)
      })
      .catch((err: any) => {
        res.status(500).send(err)
      })
  }
}
export const businessController = new businessControllerClass()
