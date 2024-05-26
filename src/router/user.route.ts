import { userController } from '../controller/user.controller';
import * as express from 'express';

export class userRouterClass{
  public router: express.Router = express.Router()
  constructor(){
    this.config()
  }
  private config():void{
    this.router.post('/',userController.getUserList)
    this.router.post('/add',userController.addnewUser)
    this.router.post('/update',userController.updateUser)
  }
}
export const userRouter = new userRouterClass().router