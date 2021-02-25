import { PubSub } from '@google-cloud/pubsub';
import { Injectable } from '@nestjs/common';
import { topicName } from './config/pubsub.config';

@Injectable()
export class PubsubService {

  private readonly pubsub: PubSub;

  constructor() {
    this.pubsub = new PubSub();
  }

  async publishMessage(data: string): Promise<void> {
    const dataBuffer = Buffer.from(data);

    try {
      const messageId = await this.pubsub.topic(topicName).publish(dataBuffer);
      console.log(`Message ${messageId} published.`);
    } catch (error) {
      console.log(`En error occured: ${error.message}`);
    }
  }
}
