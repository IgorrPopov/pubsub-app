import { PubSub } from '@google-cloud/pubsub';
import { Injectable } from '@nestjs/common';
import { topicName, subscriptionName } from './config/pubsub.config';

@Injectable()
export class PubsubService {

  private readonly pubsub: PubSub;

  constructor() {
    this.pubsub = new PubSub();
  }

  public async publishMessage(data: string): Promise<any> {
    const dataBuffer = Buffer.from(data);

    try {
      const messageId = await this.pubsub.topic(topicName).publish(dataBuffer);
      console.log(`Message ${messageId} published.`);
      return await this.receivePubSubResponse();
    } catch (error) {
      console.log(`En error occured: ${error.message}`);
    }


  }

  private async receivePubSubResponse() {
    const subscription = this.pubsub.subscription(subscriptionName);

    let pubsubRespnonse: any = false;

    const messageHandler = message => {
      console.log({ message });
      
      pubsubRespnonse = message;
      message.ack();
    };

    subscription.on('message', messageHandler);

    while (!pubsubRespnonse) {}

    return pubsubRespnonse;
    // setTimeout(() => {
    //   subscription.removeListener('message', messageHandler);
    // }, 60 * 1000);
  }
}
