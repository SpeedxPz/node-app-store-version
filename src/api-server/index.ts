import * as koaCors from '@koa/cors';
import * as koa from 'koa';
import * as koaBodyParser from 'koa-bodyparser';
import * as koaCompress from 'koa-compress';
import * as koaRouter from 'koa-router';
import errorHandler from './middleware/errorHandler';
import notfoundHandler from './middleware/notfoundHandler';
import responseHandler from './middleware/responseHandler';
import * as v1Router from './routers/v1';



export class ApiServer{
    engine: koa;
    port: number;

    constructor(
        port: number = 8080,
    ){
        this.port = port;
        this.engine = new koa();

        //Configuration
        this.engine.use(koaCors());
        this.engine.use(koaBodyParser());
        this.engine.use(koaCompress());


        this.engine.use(notfoundHandler);
        this.engine.use(errorHandler);
        this.engine.use(responseHandler);



        const mainRouter = new koaRouter();

        mainRouter.use(
            '/v1',
            v1Router.router.routes(),
            v1Router.router.allowedMethods()
        );



        this.engine.use(mainRouter.routes());

        this.start();

    }

    start = () => {
        this.engine.listen(this.port, '0.0.0.0', () => {
            console.log(`Start listening at ${this.port}`)
        })
    }
}