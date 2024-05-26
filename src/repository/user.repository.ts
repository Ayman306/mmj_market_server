import {dbUtility} from "../config/models/db"
import { userSql } from "../config/models/queries/queries"

export class userRepositoryClass{
  public  getAllUserRepository(request: any,body=''):any{
        let dbPromise = new Promise(async(resolve,reject)=>{
            try {
                let dbSql
                let result
                if(body.length){
                    dbSql = userSql.getUserByName
                    result = await dbUtility.query(dbSql,[body])
                }else{
                    dbSql = userSql.getAllUsers
                    result = await dbUtility.query(dbSql)
                }
                resolve(result)
            } catch (error) {
                console.log(error)
                reject(error)
            }
        })
        return dbPromise
    }


  public  insertUserRepository(data: any):any{
        let dbPromise = new Promise(async(resolve,reject)=>{
            try {                
                let configSql = {table:'users'}
                let dbSql = dbUtility.insertSQL(data,configSql)
                const result = await dbUtility.query(dbSql)
                resolve(result)
            } catch (error) {
                console.log(error)
                reject(error)
            }
        })
        return dbPromise
    }
  public  updateUserRepository(data: any):any{
        let dbPromise = new Promise(async(resolve,reject)=>{
            try {                
                let configSql = {table:'users'}
                let dbSql = dbUtility.updateSQL(data,configSql)
                const result = await dbUtility.query(dbSql)
                resolve(result)
            } catch (error) {
                console.log(error)
                reject(error)
            }
        })
        return dbPromise
    }

    
}
export const userRepository = new userRepositoryClass()
