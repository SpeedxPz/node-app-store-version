import koaRouter = require('koa-router')
import * as config from '../../../../config';
import { GetAppStoreInfo, GetPlayStoreInfo } from '../../../../lib/clawer';
import { sendMessage, versionProducerClient } from '../../../../lib/kafka';
import { IAppDefinition } from '../../../../model/AppDefinition';
import { IAppInfo } from '../../../../model/AppInfo';
import { appInfoStore } from '../../../../store';

export const router = new koaRouter();

router.get('/', async(_: koaRouter.IRouterContext) => {

  const apps: IAppInfo[] = await appInfoStore.getAllApps();

  return {
    status: 'ok',
    count: apps.length,
    apps: apps,
  }
});


router.get('/id/:appId', async(ctx: koaRouter.IRouterContext) => {
  const { appId } = ctx.params;

  const result: IAppInfo = await appInfoStore.getAppById(appId);
  if(!result) throw new Error("This application not registered.");

  return {
      status: 'ok',
      app: result,
    }
});


router.put('/', async(ctx: koaRouter.IRouterContext) => {

  const appDefinitions: IAppDefinition = ctx.request.body;
  if(!appDefinitions.id || !appDefinitions.type) throw new Error("Missing required properties");
  if(!['appstore','playstore'].includes(appDefinitions.type)) throw new Error("Invalid store type (Supported storetype is 'playstore' and 'appstore')");

  const result: IAppInfo = await appInfoStore.getAppById(appDefinitions.id);
  if(result) throw new Error("This app already exists");

  try{

    let appResult;

    if('appstore'.includes(appDefinitions.type)){
      appResult = await GetAppStoreInfo(appDefinitions.id);
    }

    if('playstore'.includes(appDefinitions.type)){
      appResult = await GetPlayStoreInfo(appDefinitions.id);
    }

    if(!appResult) throw new Error(`Unknow error occured!`);

    await appInfoStore.add(appResult);
    await sendMessage(
      versionProducerClient,
      `${config.kafkaTopic.prefix}.${config.kafkaTopic.appversion}`,
      appResult.id,
      JSON.stringify(appResult)
    );

    console.log(`Added new app '${appDefinitions.id}' at '${new Date().toISOString()}'`);

    return {
      status: 'created',
      app: appResult,
    }
  } catch(err) {
    throw new Error(`Error occured while getting data from store\n${err}`);
  }
});


router.delete('/id/:appId', async(ctx: koaRouter.IRouterContext) => {
  const { appId } = ctx.params;
  try{
    const result: IAppInfo = await appInfoStore.getAppById(appId);
    if(!result) throw new Error("This application not registered.");
    await appInfoStore.deleteById(appId);
    console.log(`Deleted app '${appId}' at '${new Date().toISOString()}'`);
    return {
      status: 'deleted',
      app: null,
    };
  } catch(err){
    throw new Error("Error occured while deleting application.");
  }
});

