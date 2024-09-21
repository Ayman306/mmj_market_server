import { dbUtility } from '../../config/models/db'
import { jobPostSql } from '../../config/models/queries/queries'
import { jobPostHelper } from './jobPost.helper'

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
          result = await dbUtility.query(dbSql, body)
          resolve(result)
        } else {
          dbSql = jobPostSql.getAllJobPosts

          const jobPosts = await dbUtility.query(dbSql, body)

          const totalCount = parseInt(jobPosts[0]?.totalcount) || 0;
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
        const job_detail: any = jobPostHelper.job_detail
        job_detail['status'] = true
        job_detail['approval_date'] = null
        job_detail['expiry_date'] = null
        if (!data.expiry_date) {
          const currentDate = new Date();
          const expiryDate = new Date(currentDate.setDate(currentDate.getDate() + 15));
          data.expiry_date = expiryDate.toISOString().slice(0, 19).replace('T', ' '); // Format to 'YYYY-MM-DD HH:mm:ss'
          console.log(data.expiry_date);
        }
        const jobfields = ['title', 'company_name', 'description', 'responsibility', 'qualification', 'employment_type', 'salary_range', 'number_of_opening', 'apply_url', 'notes', 'status', 'approval_date', 'expiry_date'];
        jobfields?.forEach(field => job_detail[field] = data[field] || (field === 'status' ? false : null));

        const contact_detail: any = jobPostHelper.contact_detail
        const contactFields = ['primary_contact', 'alternative_contact', 'email', 'address', 'city', 'state', 'pincode', 'web_url', 'wa_number', 'contact_type'];
        contactFields.forEach(field => contact_detail[field] = data[field] || null);


        let dbSql = dbUtility.insertSQL(job_detail, configSql)
        const jobPostResult = await dbUtility.query(dbSql); // Await job post insertion

        // Check if job post insertion was successful
        if (!jobPostResult || jobPostResult.length === 0) {
          return reject(new Error('Job post insertion failed'));
        }

        // Insert contact details only if job post insertion is successful
        contact_detail['jobpost_id'] = jobPostResult[0].id

        const contactConfigSql = { table: 'contact' }
        let contactDbSql = dbUtility.insertSQL(contact_detail, contactConfigSql)

        try {
          const contactResult = await dbUtility.query(contactDbSql); // Await contact insertion

          // Check if contact insertion was successful
          if (!contactResult || contactResult.length === 0) {
            // Rollback job post insertion if contact insertion fails
            const emailConfig = {
              email: contact_detail.email,
              subject: 'Job Post on MMJ!',
              body: 'Approval request shared to admin!'
            }
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
        let dbSql
        if (data?.media?.files && data?.media?.files.length > 0) {
          data.job_detail.media = JSON.stringify(data?.media?.files)
        }
        const updateType = data?.updateType
        if (data?.updateType) {
          delete data?.updateType
        }
        if (updateType !== 'status_update') {

          const job_detail: any = jobPostHelper.job_detail
          job_detail['expiry_date'] = ''
          // Set job_detail properties from data
          const fields = ['id', 'title', 'company_name', 'description', 'responsibility', 'qualification', 'employment_type', 'salary_range', 'number_of_opening', 'apply_url', 'notes', 'expiry_date'];
          fields?.forEach(field => job_detail[field] = data[field] || null);

          dbSql = dbUtility.updateSQL(job_detail, configSql)
        } else {
          dbSql = dbUtility.updateSQL(data, configSql)
        }

        const jobUpdate = await dbUtility.query(dbSql)
        if (!jobUpdate) {
          return reject(new Error('Error updating'))
        }
        if (updateType !== 'status_update') {
          const contact_detail: any = jobPostHelper.contact_detail
          const contactFields = ['primary_contact', 'alternative_contact', 'email', 'address', 'city', 'state', 'pincode', 'web_url', 'wa_number'];
          contactFields.forEach(field => contact_detail[field] = data[field] || '');
          contact_detail['jobpost_id'] = jobUpdate[0].id;

          const configSql = { table: 'contact', uniqueKey: 'jobpost_id' }
          let dbSql = dbUtility.upsertSQL(contact_detail, configSql)
          await dbUtility.query(dbSql).then((res) => {
            resolve(res)
          })
        } else {
          resolve(jobUpdate)
        }
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

  public getAllJobApprovalList(body: any) {
    let dbPromise = new Promise(async (resolve, reject) => {
      try {
        body.page = body.page || 1
        body.itemsPerPage = body.itemsPerPage || 10
        body.offset = (body.page - 1) * body.itemsPerPage
        body.status = body.status ? body.status : 'any'
        body.search = body.search ? body.search : ''
        body.filter = body.filter ? body.filter : ''
        const dbSql = jobPostSql.getAllJobApproval;
        const result = await dbUtility.query(dbSql, body)

        const totalCount = parseInt(result[0]?.totalcount) || 0;
        const totalPages = Math.ceil(totalCount / body.itemsPerPage)

        resolve({
          result: result,
          total: totalCount,
          page: body.page,
          itemsPerPage: body.itemsPerPage,
          totalPages,
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