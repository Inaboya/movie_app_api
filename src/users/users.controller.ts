import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.service';
import { CustomRequest } from 'src/utils';
import { UserDTO, CreateUserDTO } from './dto';
import { LoginUserDTO } from './dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Load user' })
  @ApiOkResponse({
    status: 200,
    description: 'load user by token',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @UseGuards(AuthGuard)
  @Get('load-user')
  async loadUser(@Req() req: CustomRequest) {
    return await this.userService.getUser(req.user.id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create user' })
  @ApiCreatedResponse({
    status: 201,
    description: 'The user has been successfully created.',
    type: UserDTO,
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request',
  })
  @Post()
  async registerUser(@Body() payload: CreateUserDTO) {
    // console.log(payload, 'payload');
    return await this.userService.registerUser(payload);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Login user' })
  @ApiOkResponse({
    status: 200,
    description: 'The user has been successfully logged in.',
    type: UserDTO,
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request',
  })
  @Post('login')
  async loginUser(@Body() payload: LoginUserDTO) {
    return await this.userService.loginUser(payload);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user' })
  @ApiOkResponse({
    status: 200,
    description: 'fetch user by id',
    type: UserDTO,
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Must be a valid mongodb id',
  })
  @Get(':id')
  async getUser(@Param('id') id: string) {
    return await this.userService.getUser(id);
  }
}
