import express from 'express';
import bodyParser from 'body-parser';
import cors from "cors";
import compression from 'compression';
const 
configureMiddleware = (app:express.Application) => {
  app.use(cors());
  app.options('*', cors());
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
  app.use(express.json());
  app.use(compression());
  // app.use(passport.initialize()); //using jwt 
};

export {configureMiddleware};
