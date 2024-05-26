import { Request, Response, NextFunction } from "express";
import { jobPostRepository } from "../repository/jobPost.repository";

class jobPostControllerClass{
  
    public getJobPostList(req: Request, res: Response, next: NextFunction) {
        const job_post = req.body?.name
        jobPostRepository.getAllJobPostRepository(req,job_post).then((data:any) =>{
            res.status(200).send(data)
        }).catch((err:any) =>{
            res.status(500).send(err)
        })
    }
    public addNewJobPost(req: Request, res: Response, next: NextFunction) {
        const data = req.body
        jobPostRepository.insertJobPostRepository(data).then((data:any) =>{
            res.status(200).send(data)
        }).catch((err:any) =>{
            res.status(500).send(err)
        })
    }
    public updateJobPost(req: Request, res: Response, next: NextFunction) {
        const data = req.body
        jobPostRepository.updateJobPostRepository(data).then((data:any) =>{
            res.status(200).send(data)
        }).catch((err:any) =>{
            res.status(500).send(err)
        })
    }


}
export const jobPostController = new jobPostControllerClass()