import * as dotenv from 'dotenv';
import { ApiServer } from './api-server';
import * as config from './config';
import { versionProducerClient } from './lib/kafka';
import { appInfoStore } from './store';
import { AppInfoSqliteStore } from './store/sqlite/appInfoSqliteStore';

dotenv.config();

appInfoStore.setClient(new AppInfoSqliteStore(config.sqlite.dbPath));

const start = async () => {
  await versionProducerClient.connect();
  console.log("Starting up api server....");
  new ApiServer(config.server.port);
};


start();