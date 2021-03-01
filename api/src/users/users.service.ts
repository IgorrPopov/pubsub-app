import { Injectable } from '@nestjs/common';
import { PubsubService } from 'src/pubsub/pubsub.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly pubsubService: PubsubService) {}

  create(createUserDto: CreateUserDto): Promise<void> {
    return this.pubsubService.publishMessage(JSON.stringify(createUserDto));
  }
}
