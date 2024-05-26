import pool from "../config/db/dbConfig"
import {dbUtility} from "../config/models/db"
import { jobPostSql } from "../config/models/queries/queries"

export class jobPostRepositoryClass{
  public  getAllJobPostRepository(request: any,body=''):any{
        let dbPromise = new Promise(async(resolve,reject)=>{
            try {
                let dbSql
                let result
                if(body.length){
                    dbSql = jobPostSql.getJobPostByName
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
                let dbSql = dbUtility.insertSQL(data.job_detail,configSql)
                 dbUtility.query(dbSql).then((res)=>{

//  insert of contact 
                if (data.contact_details.contact_available) {
                    delete data.contact_details.contact_available;
                    data.contact_details['jobpostid'] = res[0].id;
              
                    const configSql = { table: 'contact' };
                    let dbSql = dbUtility.insertSQL(data.contact_details,configSql)
                    tableSql.push(dbSql)
                  }
// insert of media            
                    if (data.media.files && data.media.files.length > 0) {
                    const configSql = { table: 'media', schema: 'public' };

                    for (const file of data.media.files) {
                    file['jobpostid']=res[0].id
                    const dbSql = dbUtility.insertSQL(file, configSql);
                    tableSql.push(dbSql)
                        }
                      }
                      if(tableSql.length){
                        pool.tx((t:any)=>{
                            let tableSqlBatch:any[] =[]
                            tableSql.forEach(sql=>{
                                console.log(sql)
                                tableSqlBatch.push(t.query(sql))
                            })
                            t.batch(tableSqlBatch).then((data:any)=>{
                                resolve(data)
                            }).catch((err:any)=>{
                                reject(err)
                            })
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
                let configSql = {table:'job_posts',uniqueKey:'jobpostid'}
                let dbSql = dbUtility.upsertSQL(data,configSql)
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
export const jobPostRepository = new jobPostRepositoryClass()
