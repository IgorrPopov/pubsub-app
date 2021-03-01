import { Module } from '@nestjs/common';
import { PubsubGateway } from './pubsub.gateway';
import { PubsubService } from './pubsub.service';

@Module({
  providers: [PubsubService, PubsubGateway],
  exports: [PubsubService]
})
export class PubsubModule {}
