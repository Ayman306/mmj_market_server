import * as express from 'express';
import { jobPostController } from '../controller/jobPost.controller';

export class job_postRouterClass{
  public router: express.Router = express.Router()
  constructor(){
    this.config()
  }
  private config():void{
    this.router.post('/',jobPostController.getJobPostList)
    this.router.post('/add',jobPostController.addNewJobPost)
    this.router.post('/update',jobPostController.updateJobPost)
  }
}
export const jobPostRouter = new job_postRouterClass().router