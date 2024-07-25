import pkg from '../../package.json'assert { type: 'json' };
import config from '../config/config.js';

const {version} = pkg
const swaggerDef = {
  openapi: '3.0.0',
  info: {
    title: 'Delaney Bio-Crete API documentation',
    version,
  },
  servers: [
    {
      url: `http://localhost:${config.port}/v1`,
    },
  ],
};

export default swaggerDef;
