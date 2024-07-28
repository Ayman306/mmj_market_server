import { Request, Response, NextFunction } from 'express'
import { jobPostRepository } from '../jobs/jobPost.repository'
import { categoryRepository } from './category.repository'

class categoryControllerClass {
  public getCategory(req: Request, res: Response, next: NextFunction) {
    categoryRepository
      .getCategoryListRepository()
      .then((data: any) => {
        res.status(200).send(data)
      })
      .catch((err: any) => {
        res.status(500).send(err)
      })
  }
  public addNewCategory(req: Request, res: Response, next: NextFunction) {
    const data = req.body
    categoryRepository
      .addCategoryRepository(data)
      .then((data: any) => {
        res.status(200).send(data)
      })
      .catch((err: any) => {
        res.status(500).send(err)
      })
  }
  public updateCategory(req: Request, res: Response, next: NextFunction) {
    const data = req.body
    categoryRepository
      .updateCategoryRepository(data)
      .then((data: any) => {
        res.status(200).send(data)
      })
      .catch((err: any) => {
        res.status(500).send(err)
      })
  }
  public deleteCategory(req: Request, res: Response, next: NextFunction) {
    const data = req.body
    categoryRepository
      .deleteCategoryRepository(data)
      .then((data: any) => {
        res.status(200).send(data)
      })
      .catch((err: any) => {
        res.status(500).send(err)
      })
  }
}
export const categoryController = new categoryControllerClass()
