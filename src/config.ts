import * as dotenv from 'dotenv';

dotenv.config();

export const server = {
  port: +process.env['server.port'] || 8080,
};

export const app = {

};

export const sqlite = {
  dbPath: process.env['sqlite.database.path'] || '/data/settings.db',
}

export const kafkfaConfig = {
  bootstrap: process.env['kafka.config.bootstrap'] || 'localhost:9092',
  consumerGroupId: process.env['kafka.consumer.group'] || 'default'
};

export const kafkaTopic = {
  prefix: process.env['kafka.topic.prefix'] || 'starlight',
  appversion: process.env['kafka.topic.appversion'] || 'app.version'
};



