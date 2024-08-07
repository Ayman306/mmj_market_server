import { dbUtility } from '../../config/models/db'
import { businessSql } from '../../config/models/queries/queries'

export class businessRepositoryClass {
  public async getAllbusinessRepository(body: any): Promise<any> {
    let dbPromise = new Promise(async (resolve, reject) => {
      try {
        let dbSql
        let result
        if (body?.length) {
          dbSql = businessSql.getBusinessById
        } else {
          dbSql = businessSql.getAllBusiness
        }
        result = await dbUtility.query(dbSql, body)
        resolve(result)
      } catch (error) {
        console.log(error)
        reject(error)
      }
    })
    return dbPromise
  }

  public insertbusinessRepository(data: any): any {
    let dbPromise = new Promise(async (resolve, reject) => {
      try {
        let configSql = { table: 'businesss' }
        let dbSql = dbUtility.insertSQL(data, configSql)
        const result = await dbUtility.query(dbSql)
        resolve(result)
      } catch (error) {
        console.log(error)
        reject(error)
      }
    })
    return dbPromise
  }
  public updatebusinessRepository(data: any): any {
    let dbPromise = new Promise(async (resolve, reject) => {
      try {
        let configSql = { table: 'businesss' }
        let dbSql = dbUtility.updateSQL(data, configSql)
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

export const businessRepository = new businessRepositoryClass()
