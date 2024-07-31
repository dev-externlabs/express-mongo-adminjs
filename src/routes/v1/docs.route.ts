import express from 'express';
import swaggerJsdoc, {Options} from 'swagger-jsdoc';
import swaggerUi, { SwaggerUiOptions } from 'swagger-ui-express';
import swaggerDefinition from '@/docs/swaggerDef';

const router = express.Router();

const jsDocOptions:Options = {
  swaggerDefinition,
  apis: ['src/docs/*.yml', 'src/routes/v1/*.js'],
}
const specs = swaggerJsdoc(jsDocOptions);

router.use('/', swaggerUi.serve);
const uiOpts:SwaggerUiOptions = {
    explorer:true,
    customSiteTitle:'Delaney Bio-Crete API documentation',
    customCss: '.swagger-ui .topbar { display: none }'
  }
router.get(
  '/',
  swaggerUi.setup(specs, uiOpts,)
);

export default router;
