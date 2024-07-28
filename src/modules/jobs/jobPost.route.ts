import * as express from 'express'
import { jobPostController } from './jobPost.controller'
import { authenticateToken } from '../../utils/authMiddleware'

export class job_postRouterClass {
  public router: express.Router = express.Router()
  constructor() {
    this.config()
  }
  private config(): void {
    this.router.post('/', jobPostController.getJobPostList)
    this.router.post('/add', jobPostController.addNewJobPost)
    this.router.post('/update', jobPostController.updateJobPost)
    this.router.delete(
      '/delete',
      authenticateToken,
      jobPostController.deleteJobPost,
    )
  }
}
export const jobPostRouter = new job_postRouterClass().router
