import express from 'express';
import mongoose from 'mongoose';
import config from '#/config';
import logger from '#/logger';
import {errorLogger,successLogger} from '#/morgan'
import router from './routes/v1';
import {errorConverter, errorHandler} from "./middlewares/error"

class App {
  public app: express.Application;

  constructor(){
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes()
    this.initializeErrorHandlers()
    App.connectToDatabase();
  }

  public async start(port = config.port): Promise<void> {
    this.app.listen(port, (): void => {
      logger.info(`App listening on the port ${port}`);
    });
  }

  private initializeMiddlewares(): void {
    // for parsing application/json
    this.app.use(express.json({ limit: '200mb' }));
    // for parsing application/xwww-
    this.app.use(express.urlencoded({ extended: true, limit: '200mb' }));

    if (config.env !== 'test') {
      this.app.use(successLogger);
      this.app.use(errorLogger);
    }

  }

  private initializeRoutes(): void {
    const route: express.Router = express.Router();
    this.app.use(route);
    route.use('/v1', router);
  }

  private initializeErrorHandlers(): void {
    this.app.use(errorConverter)
    this.app.use(errorHandler)
  }


  private static async connectToDatabase(): Promise<void> {
    try {
      await mongoose.connect(config.mongoose.url)
      logger.info('Connected to database successfully ✨');
    } catch (error) {
      logger.error('Database connection failed due to ', error);
    }
  }
}


export default App;
