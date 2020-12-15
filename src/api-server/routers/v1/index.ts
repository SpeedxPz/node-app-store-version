import koaRouter = require('koa-router')
import * as appsRouter from './apps';
import * as updateRouter from './update';

export const router = new koaRouter();


router.use(
  '/update',
  updateRouter.router.routes(),
  updateRouter.router.allowedMethods()
);

router.use(
  '/apps',
  appsRouter.router.routes(),
  appsRouter.router.allowedMethods()
);