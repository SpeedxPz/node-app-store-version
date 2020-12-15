import { AdminClient, KafkaConsumer, LibrdKafkaError, Message, Producer } from 'node-rdkafka';
import * as config from '../../config';


export const kafkaAdmin = AdminClient.create({
  'bootstrap.servers': config.kafkfaConfig.bootstrap
});


export const versionConsumerClient = new KafkaConsumer(
  {
    'enable.auto.commit': true,
    'group.id': `${config.kafkaTopic.prefix}.${config.kafkfaConfig.consumerGroupId}`,
    'bootstrap.servers': config.kafkfaConfig.bootstrap,
  },
  {
    'enable.auto.commit': true,
  }
);


export const versionProducerClient = new Producer(
  {
    'compression.type': 'gzip',
    'enable.idempotence': true,
    'retries': 10000000,
    'socket.keepalive.enable': true,
    'bootstrap.servers': config.kafkfaConfig.bootstrap,
  },
  {

  }
)


export const createTopic = (
  name: string,
  config?: any,
) : Promise<any> => new Promise( (resolve: Function, reject: Function) => {

  kafkaAdmin.createTopic(
    {
      'topic': name,
      'num_partitions': 1,
      'replication_factor': 1,
      'config': {
        'compression.type': 'gzip',
        'retention.ms': '604800000',
        ...config,
      }
    },
    (error: LibrdKafkaError) => {
      if(error) return reject(error);
      else resolve();
    }
  );
});


versionConsumerClient.setDefaultConsumeTimeout(5);
versionConsumerClient.on('ready', async () => {
  console.log(`App Version Consumer kafka is ready`);
  try{
    await createTopic(
      `${config.kafkaTopic.prefix}.${config.kafkaTopic.appversion}`,
      {
        'cleanup.policy': 'compact'
      }
    );
  } catch (error) {
    console.warn(
      `Create topic "${
        `${config.kafkaTopic.prefix}-${config.kafkaTopic.appversion}`
      }" error: ${error.toString()}`,
    );
  } finally {
    versionConsumerClient.subscribe([`${config.kafkaTopic.prefix}.${config.kafkaTopic.appversion}`])
  }
});


versionProducerClient.setPollInterval(100);
versionProducerClient.on('ready', async () => {
  console.log(`App Version Producer kafka is ready`);
  try{
    await createTopic(
      `${config.kafkaTopic.prefix}.${config.kafkaTopic.appversion}`,
      {
        'cleanup.policy': 'compact'
      }
    );
  } catch (error) {
    console.warn(
      `Create topic "${
        `${config.kafkaTopic.prefix}-${config.kafkaTopic.appversion}`
      }" error: ${error.toString()}`,
    );
  }
});


versionProducerClient.on('event.error', (error: any) => {
  console.log(error);
});



export const pollMessage = (
  consumer: KafkaConsumer,
  messageNumber: number = 100000,
): Promise<Message[]> =>
  new Promise((resolve: Function, reject: Function) => {
    consumer.consume(
      messageNumber,
      (error: LibrdKafkaError, messages: Message[]) => {
        if (error) return reject(error);
        resolve(messages);
      },
    );
  });

export const sendMessage = (
  producer: Producer,
  topic: string,
  key: string,
  value: string
) =>
  producer.produce(
    topic,
    null,
    Buffer.from(value),
    key,
    Date.now(),
  )