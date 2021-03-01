import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {

  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: `Add one user instance and after it was created (added to the DB) 
    returns void`
  })
  @ApiResponse({
    status: 400,
    description: `If the request body does not match CreateUserDto 
    then the API will return 400 bad request`
  })
  create(@Body() createUserDto: CreateUserDto): Promise<void> {
    return this.usersService.create(createUserDto);
  }
}
