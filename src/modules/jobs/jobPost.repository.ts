import { dbUtility } from '../../config/models/db'
import { jobPostSql } from '../../config/models/queries/queries'

export class jobPostRepositoryClass {
  public getAllJobPostRepository(body: any): any {
    let dbPromise = new Promise(async (resolve, reject) => {
      try {
        let dbSql: string
        let result: any
        body.page = body.page || 1
        body.itemsPerPage = body.itemsPerPage || 10
        body.offset = (body.page - 1) * body.itemsPerPage
        body.status = body.status ? body.status : 'any'
        body.search = body.search ? body.search : ''
        body.filter = body.filter ? body.filter : ''

        if (body?.id?.length) {
          dbSql = jobPostSql.getJobPostById
          result = await dbUtility.query(dbSql, [body.id])
          resolve(result)
        } else {
          dbSql = jobPostSql.getAllJobPosts

          const jobPosts = await dbUtility.query(dbSql, body)

          const totalCount = parseInt(jobPosts?.length)
          const totalPages = Math.ceil(totalCount / body.itemsPerPage)

          resolve({
            result: jobPosts,
            total: totalCount,
            page: body.page,
            itemsPerPage: body.itemsPerPage,
            totalPages,
          })
        }
      } catch (error) {
        console.log(error)
        reject(error)
      }
    })
    return dbPromise
  }

  public insertJobPostRepository(data: any): any {
    let dbPromise = new Promise(async (resolve, reject) => {
      try {
        let configSql = { table: 'jobpost' }
        if (data?.media?.files && data?.media?.files.length > 0) {
          data.job_detail.media = JSON.stringify(data?.media?.files)
        }
        let dbSql = dbUtility.insertSQL(data.job_detail, configSql)
        const jobPostResult = await dbUtility.query(dbSql); // Await job post insertion

        // Check if job post insertion was successful
        if (!jobPostResult || jobPostResult.length === 0) {
          return reject(new Error('Job post insertion failed'));
        }

        // Insert contact details only if job post insertion is successful
        if (data.contact_detail.contact_available) {
          delete data.contact_detail.contact_available
          data.contact_detail['jobpost_id'] = jobPostResult[0].id

          const contactConfigSql = { table: 'contact' }
          let contactDbSql = dbUtility.insertSQL(data.contact_detail, contactConfigSql)

          try {
            const contactResult = await dbUtility.query(contactDbSql); // Await contact insertion

            // Check if contact insertion was successful
            if (!contactResult || contactResult.length === 0) {
              // Rollback job post insertion if contact insertion fails
              const del = dbUtility.deleteRow({ id: jobPostResult[0].id }, configSql);
              await dbUtility.query(del)
              return reject(new Error('Contact insertion failed'));
            }
          } catch (contactError: any) {
            // Rollback job post insertion if contact insertion fails
            const del = dbUtility.deleteRow({ id: jobPostResult[0].id }, configSql);
            await dbUtility.query(del)
            return reject(new Error('Contact insertion failed: ' + contactError.message));
          }
        }
        resolve(jobPostResult);
      } catch (error) {
        console.log(error)
        reject(error)
      }
    })
    return dbPromise
  }

  public updateJobPostRepository(data: any): any {
    let dbPromise = new Promise(async (resolve, reject) => {
      try {
        let configSql = { table: 'jobpost' }
        if (data?.media?.files && data?.media?.files.length > 0) {
          data.job_detail.media = JSON.stringify(data?.media?.files)
        }
        let dbSql = dbUtility.updateSQL(data.job_detail, configSql)
        await dbUtility.query(dbSql).then(async (val) => {
          if (data?.contact_detail?.contact_available) {
            delete data.contact_detail.contact_available
          // data.contact_detail['jobpost_id'] = res[0].id;

            const configSql = { table: 'contact', uniqueKey: 'jobpost_id' }
            let dbSql = dbUtility.upsertSQL(data.contact_detail, configSql)
            await dbUtility.query(dbSql).then((res) => {
              resolve(res)
            })
          } else {
            resolve(val)
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
  public deleteJobPostRepository(data: any): any {
    let dbPromise = new Promise(async (resolve, reject) => {
      try {
        let configSql = { table: 'contact' }
        let dbSql = dbUtility.deleteRow(data.contact_detail, configSql)
        await dbUtility.query(dbSql).then((res) => {
          let configSql = { table: 'jobpost' }
          let dbSql = dbUtility.deleteRow(data.job_detail, configSql)
          dbUtility.query(dbSql).then((res) => {
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