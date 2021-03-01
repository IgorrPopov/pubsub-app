import { Module } from '@nestjs/common';
import { PubsubModule } from './pubsub/pubsub.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [PubsubModule, UsersModule],
})
export class AppModule {}
