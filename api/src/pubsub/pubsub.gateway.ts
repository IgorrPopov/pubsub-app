import { 
  OnGatewayInit, 
  WebSocketGateway, 
  WebSocketServer
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { PubsubService } from './pubsub.service';
import { subscriptionName } from './config/pubsub.config';
import { Message } from '@google-cloud/pubsub';
import { IDataObject } from './interfaces/data-object.intercace';

@WebSocketGateway()
export class PubsubGateway implements OnGatewayInit {
  @WebSocketServer()
  private readonly server: Server;

  constructor(private readonly pubsubService: PubsubService) {}
  
  afterInit(server: Server): void {  
    const subscription = this.pubsubService.pubsub.subscription(subscriptionName);
    subscription.on('message', this.messageHandler);
  }


  messageHandler(message: Message): void {
    message.ack();

    console.log(`Message ${message.id} received.`);
    
    const dataBuffer: Buffer | boolean = message && message?.data;

    if (!dataBuffer) { 
      return console.log(`Message ${message.id} is empty`);
    }

    let dataObj: IDataObject;
    
    try {
      dataObj = JSON.parse(dataBuffer.toString());
    } catch (error) {
      return console.log(`Message is not valid JSON (${error.message})`);
    }

    const { data: { message: user } } = dataObj;

    console.log('User added to the database');
    console.log({ user });

    // do the logic in order to send the user
    // data received from database via Pub/Sub
  };
}