import { dbUtility } from '../../config/models/db'
import { categorySql } from '../../config/models/queries/queries'

export class categoryRepositoryClass {
  public getCategoryListRepository(data: any): any {
    let dbPromise = new Promise(async (resolve, reject) => {
      try {
        let dbSql
        if (Object.keys(data)?.length) {
          dbSql = categorySql.getCategoryById
          // data = { id: data }
        } else {
          dbSql = categorySql.getAllCategory
        }
        let result = await dbUtility.query(dbSql, data)
        resolve(result)
      } catch (error) {
        console.log(error)
        reject(error)
      }
    })
    return dbPromise
  }

  public addCategoryRepository(data: any): any {
    let dbPromise = new Promise(async (resolve, reject) => {
      try {
        let configSql = { table: 'category' }
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

  public updateCategoryRepository(data: any): any {
    let dbPromise = new Promise(async (resolve, reject) => {
      try {
        let configSql = { table: 'category' }
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

  public deleteCategoryRepository(data: any): any {
    let dbPromise = new Promise(async (resolve, reject) => {
      try {
        let configSql = { table: 'category' }
        let dbSql = dbUtility.deleteRow(data.contact_detail, configSql)
        let result = await dbUtility.query(dbSql)
        resolve(result)
      } catch (error) {
        console.log(error)
        reject(error)
      }
    })
    return dbPromise
  }
}
export const categoryRepository = new categoryRepositoryClass()
