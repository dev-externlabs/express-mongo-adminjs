import { OAS3Definition } from 'swagger-jsdoc';
import pkg from '../../package.json' ;
import config from '#/config';

const {version} = pkg
const swaggerDef: OAS3Definition = {
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
