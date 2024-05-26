import { Request, Response, NextFunction } from "express";
import { userRepository } from "../repository/user.repository";

class userControllerClass{
  
    public getUserList(req: Request, res: Response, next: NextFunction) {
        const user = req.body?.name
        userRepository.getAllUserRepository(req,user).then((data:any) =>{
            res.status(200).send(data)
        }).catch((err:any) =>{
            res.status(500).send(err)
        })
    }
    public addnewUser(req: Request, res: Response, next: NextFunction) {
        const data = req.body
        userRepository.insertUserRepository(data).then((data:any) =>{
            res.status(200).send(data)
        }).catch((err:any) =>{
            res.status(500).send(err)
        })
    }
    public updateUser(req: Request, res: Response, next: NextFunction) {
        const data = req.body
        userRepository.updateUserRepository(data).then((data:any) =>{
            res.status(200).send(data)
        }).catch((err:any) =>{
            res.status(500).send(err)
        })
    }


}
export const userController = new userControllerClass()