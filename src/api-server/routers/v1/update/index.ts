import koaRouter = require('koa-router')
import * as config from '../../../../config';
import { GetAppStoreInfo, GetPlayStoreInfo } from '../../../../lib/clawer';
import { sendMessage, versionProducerClient } from '../../../../lib/kafka';
import { IAppInfo } from '../../../../model/AppInfo';
import { appInfoStore } from '../../../../store';

export const router = new koaRouter();

router.get('/', async(_: koaRouter.IRouterContext) => {
  console.log(`Update routine triggered at ${new Date().toISOString()}`);
  const allApps = await appInfoStore.getAllApps();

  allApps.forEach(async (app: IAppInfo) => {

    try{
      let storeAppInfo: IAppInfo;
      if(['ios'].includes(app.platform)) storeAppInfo = await GetAppStoreInfo(app.id);
      if(['android'].includes(app.platform)) storeAppInfo = await GetPlayStoreInfo(app.id);

      if(app.version != storeAppInfo.version){
        //New version! Do required stuff
        app.version = storeAppInfo.version;
        app.updateDate = storeAppInfo.updateDate;
        await appInfoStore.add(app);
        await sendMessage(
          versionProducerClient,
          `${config.kafkaTopic.prefix}.${config.kafkaTopic.appversion}`,
          app.id,
          JSON.stringify(app)
        );
      }
    }catch(err){
      console.log("Can't get information from playstore");
    }
  });


  return {
    status: 'starting'
  }
});
