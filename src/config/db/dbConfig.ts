import pgPromise from 'pg-promise'
import dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config()

const pgp = pgPromise()
const dbConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: String(process.env.DB_PASSWORD), // Ensure password is a string
  port: Number(process.env.DB_PORT),
  max: 30,
}

const pool = pgp(dbConfig)
export default pool
