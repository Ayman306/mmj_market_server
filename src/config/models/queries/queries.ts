import { readFileSync } from 'fs'
import { join } from 'path'

const loadQuery = (fileName: string, type: string): string => {
  const filePath = join(__dirname, `./sql/${type}/`, fileName)
  return readFileSync(filePath, { encoding: 'utf-8' })
}
export const userSql = {
  getAllUsers: loadQuery('get.all.user.sql', 'user'),
  getUserByName: loadQuery('get.user.by.name.sql', 'user'),
  getUserByEmail: loadQuery('get.user.by.email.sql', 'user'),
  getUser: loadQuery('get.auth.user.sql', 'user'),
}
export const jobPostSql = {
  getAllJobPosts: loadQuery('get.all.job_post.sql', 'jobPost'),
  getJobPostById: loadQuery('get.job.detail.by.id.sql', 'jobPost'),
  getAllJobApproval: loadQuery('get.all.job.approval.sql', 'jobPost'),
}
export const categorySql = {
  getAllCategory: loadQuery('get.all.category.sql', 'category'),
  getCategoryById: loadQuery('get.category.by.id.sql', 'category'),
}
export const businessSql = {
  getAllBusiness: loadQuery('get.all.business.sql', 'business'),
  getBusinessById: loadQuery('get.business.by.id.sql', 'business'),
}
