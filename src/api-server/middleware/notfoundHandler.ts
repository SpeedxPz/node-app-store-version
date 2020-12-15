import koaRouter from 'koa-router';


export default async (ctx: koaRouter.IRouterContext, next: Function) => {
  await next();

  const status = ctx.status || 404
  if (status == 404) {
    ctx.throw("This resource not found",404);
      ///ctx.body = "This resource not found";
      //ctx.status = 404;
  }
};