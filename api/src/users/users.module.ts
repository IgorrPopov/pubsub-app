import { Module } from '@nestjs/common';
import { PubsubModule } from 'src/pubsub/pubsub.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [PubsubModule]
})
export class UsersModule {}
