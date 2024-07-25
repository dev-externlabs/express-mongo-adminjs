import express from 'express';
import session from 'express-session';
import mongoSanitize from 'express-mongo-sanitize';
import cors from 'cors';
import passport from 'passport';
import httpStatus from 'http-status';
import config from './config/config.js';
import {errorLogger,successLogger} from './config/morgan.js';
import { jwtStrategy } from './config/passport.js';
import routes from './routes/v1/index.js';
import { errorConverter, errorHandler } from './middlewares/error.js';
import ApiError from './utils/ApiError.js';

const app = express();

if (config.env !== 'test') {
  app.use(successLogger);
  app.use(errorLogger);
}

// parse JSON request body
app.use(express.json());

// parse URL-encoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(mongoSanitize());

// enable CORS
app.use(cors());
app.options('*', cors());

// Session setup
app.use(session({
  secret: 'seeeddd',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));
app.use(passport.initialize());
app.use(passport.session());

// JWT Authentication
passport.use('jwt', jwtStrategy);

// v1 API routes
app.use('/v1', routes);

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

export default app;
