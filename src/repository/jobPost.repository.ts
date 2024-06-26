import pool from "../config/db/dbConfig"
import {dbUtility} from "../config/models/db"
import { jobPostSql } from "../config/models/queries/queries"

export class jobPostRepositoryClass{
  public  getAllJobPostRepository(request: any,body=''):any{
        let dbPromise = new Promise(async(resolve,reject)=>{
            try {
                let dbSql
                let result
                if(body.length >0){
                    dbSql = jobPostSql.getJobPostById
                    result = await dbUtility.query(dbSql,[body])
                }else{
                    dbSql = jobPostSql.getAllJobPosts
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

  public  insertJobPostRepository(data: any):any{
        let dbPromise = new Promise(async(resolve,reject)=>{
            const client = await pool.connect();
            try {
                let tableSql:any[]=[]
                let configSql = {table:'jobpost'}
                if (data.media.files && data.media.files.length > 0) {
                data.job_detail.media = JSON.stringify(data.media.files)
                }
                let dbSql = dbUtility.insertSQL(data.job_detail,configSql)
                 dbUtility.query(dbSql).then((res)=>{

//  insert of contact 
                if (data.contact_details.contact_available) {
                    delete data.contact_details.contact_available;
                    data.contact_details['jobpost_id'] = res[0].id;
              
                    const configSql = { table: 'contact' };
                    let dbSql = dbUtility.insertSQL(data.contact_details,configSql)
                    dbUtility.query(dbSql).then((res)=>{
                        resolve(res)
                    })
                  }
                    })
            } catch (error) {
                console.log(error)
                reject(error)
            }
        })
        return dbPromise
    }


  public  updateJobPostRepository(data: any):any{
        let dbPromise = new Promise(async(resolve,reject)=>{
            try {
                let configSql = {table:'jobpost'}
                if (data?.media?.files && data?.media?.files.length > 0) {
                    data.job_detail.media = JSON.stringify(data?.media?.files)
                    }
                let dbSql = dbUtility.updateSQL(data.job_detail,configSql)
                 await dbUtility.query(dbSql).then(async (res)=>{

                    if (data?.contact_details?.contact_available) {
                        delete data.contact_details.contact_available;
                        // data.contact_details['jobpost_id'] = res[0].id;
                  
                        const configSql = { table: 'contact', uniqueKey:'jobpost_id'};
                        let dbSql = dbUtility.upsertSQL(data.contact_details,configSql)
                        await dbUtility.query(dbSql).then((res)=>{
                            resolve(res)
                        })
                      }

                 })
                resolve([])
            } catch (error) {
                console.log(error)
                reject(error)
            }
        })
        return dbPromise
    }
public deleteJobPostRepository(data:any):any {
    let dbPromise = new Promise(async(resolve,reject)=>{
        try {
            let configSql = {table:'contact'}
            let dbSql = dbUtility.deleteRow(data.contact_details,configSql)
            await dbUtility.query(dbSql).then((res)=>{
            let configSql = {table:'contact'}
            let dbSql = dbUtility.deleteRow(data.job_detail,configSql)
            dbUtility.query(dbSql).then((res)=>{
                resolve(res)
                })
            })
        } catch (error) {
            console.log(error)
            reject(error)
        }
    })
    return dbPromise

}
    
}
export const jobPostRepository = new jobPostRepositoryClass()
