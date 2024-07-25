
import mongoose from 'mongoose';
import AdminJSExpress from '@adminjs/express';
import AdminJS, { ComponentLoader } from 'adminjs';
import {User,Token, Book} from "./models/index.js"
import {Database,Resource} from '@adminjs/mongoose';
import app from './app.js';
import config from './config/config.js';
import logger from './config/logger.js';

let server;

const connectDB = async () => {
    try {
      await mongoose.connect(config.mongoose.url, config.mongoose.options)
      logger.info('Connected to database successfully ✨');
    } catch (error) {
      logger.error('Database connection failed due to ', error);
    }
}

const bootStrapAdminPanel = () => {
  AdminJS.registerAdapter({Database, Resource})

  const bookResourceOptions ={resource: Book};
  const userResourceOptions = {resource: User}
  const componentLoader = new ComponentLoader()
  // adminJs
  const adminJs = new AdminJS({
    resources:[
      bookResourceOptions,
      userResourceOptions
  ], // We don’t have any resources connected yet.
    rootPath: '/admin', // Path to the AdminJS dashboard.
    componentLoader
  });
  adminJs.watch()
  const router = AdminJSExpress.buildRouter(adminJs);
  app.use(adminJs.options.rootPath, router);

}

const start = async () => {
  await connectDB()
  bootStrapAdminPanel();
    // send back a 404 error for any unknown API request
    // declare all the routes before it
  app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
  });
  server = app.listen(config.port, () => {
    logger.info(`🚀 in ${config.env.toUpperCase()} mode at ${config.port}`);
  });
}

start()

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});

process.on('SIGINT', () => {
  mongoose.connection.close().then(() => {
    console.log('Database connection is killed due to application 😵');
    process.exit(0);
  });
});
