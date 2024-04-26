import { Controller, Post, Body, HttpCode, Get, UseGuards, Request } from '@nestjs/common';

import { JwtAuthGuard } from '@modules/auth/auth.guard';
import { UserService } from './user.service';
import { RegisterUserDTO } from './user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @HttpCode(204)
  async register(@Body() registerUserDto: RegisterUserDTO) {
    await this.userService.register(registerUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async profile(@Request() req) {
    return req.user
  }
}