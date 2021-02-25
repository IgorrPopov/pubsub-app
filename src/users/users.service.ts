import { Injectable } from '@nestjs/common';
import { PubsubService } from 'src/pubsub/pubsub.service';

@Injectable()
export class UsersService {

  constructor(private readonly pubsubService: PubsubService) {}


  create(body: any) {
    return this.pubsubService.publishMessage(body.message);
  }
}
