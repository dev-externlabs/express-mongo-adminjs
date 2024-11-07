import express from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import expressListRoutes from 'express-list-routes';
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
      // Since we are not implementing routes in app like => this.app('/auth', authRoute)
      // but only pushing it as complete router in app like => this.app('/v1', router)
      // we need to pass it differently router in expressListRoutes
      expressListRoutes({_router:router}, {prefix:'/v1'})
      logger.info(`App listening on the port ${port}`);
    });
  }

  private initializeMiddlewares(): void {
    // for parsing application/json
    this.app.use(express.json({ limit: '20mb' }));
    // for parsing application/xwww-
    this.app.use(express.urlencoded({ extended: true, limit: '20mb' }));
    // securing app response
    this.app.use(helmet())

    if (config.env !== 'test') {
      this.app.use(successLogger);
      this.app.use(errorLogger);
    }

  }

  private initializeRoutes(): void {
    this.app.use('/v1',router);
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
