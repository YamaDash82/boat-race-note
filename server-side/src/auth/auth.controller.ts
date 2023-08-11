import { Controller, Post, UseGuards, Request, Get, Body, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Request as ExpressRequest } from 'express';
import { UsersService } from 'src/users/users.service';
import { AppendNewUserPipe } from './append-new-user.pipe';

@Controller('auth')
export class AuthController {
  constructor(
    private authSvc: AuthService, 
    private usersSvc: UsersService, 
  ) { }

  @Post('append-user')
  @UsePipes(AppendNewUserPipe)
  async appendUser(@Body() body: { username: string, password: string }) {
    return this.usersSvc.appendNewUser(body.username, body.password);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: ExpressRequest) {
    return this.authSvc.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: ExpressRequest) {
    return req.user;
  }
}
