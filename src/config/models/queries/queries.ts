import { readFileSync } from "fs";
import { join } from "path";

const loadQuery = (fileName: string,type:string): string => {
    const filePath = join(__dirname, `./sql/${type}/`, fileName);
    return readFileSync(filePath, { encoding: 'utf-8' });
  };
export const userSql={
    getAllUsers: loadQuery('get.all.user.sql','user'),
    getUserByName: loadQuery('get.user.by.name.sql','user')
}
export const jobPostSql={
  getAllJobPosts: loadQuery('get.all.job_post.sql','jobPost'),
  getJobPostByName: loadQuery('get.job_post.by.name.sql','jobPost')
}