//require('app-module-path').addPath(__dirname);
import express, { Request, Response, NextFunction } from 'express'

// import 'app-module-path/register'
import * as dotenv from 'dotenv'

console.log(process.env.NODE_ENV)

dotenv.config({ path: './env/' + process.env.NODE_ENV + '.env' })

import app from './app'

let options = {}
let glob = require('glob')
glob('src/**/*.sql', options, function (er: any, files: any) {
  // files is an array of filenames.
  // If the `nonull` option is set, and nothing
  // was found, then files is ["**/*.js"]
  // er is an error object or null.
  //console.log(files);
})

app.listen(process.env.API_PORT, () => {
  console.log('Express server listening on port ' + process.env.API_PORT)
})

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} request for '${req.url}'`)
  next()
})