import { Controller, Post, UseGuards, Request, Get, Body, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Request as ExpressRequest } from 'express';
import { UsersService } from 'src/users/users.service';
import { AppendNewUserPipe } from './append-new-user.pipe';
import { UserDto } from 'shared_modules/data-transfer/user';
import { UserPayload } from 'declarations/models/users.model';

@Controller('auth')
export class AuthController {
  constructor(
    private authSvc: AuthService, 
    private usersSvc: UsersService, 
  ) { }

  @Post('append-user')
  @UsePipes(AppendNewUserPipe)
  async appendUser(@Body() body: UserDto.Request.AppendUser) {
    return this.usersSvc.appendNewUser(body.key, body.password);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: ExpressRequest) {
    console.log(`reqUser:${JSON.stringify(req.user, null, 2)}`);
    return this.authSvc.login(req.user as UserPayload);
  }

  //テスト用 後に削除する。
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: ExpressRequest) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('check-login')
  async checkLogin(@Request() req: ExpressRequest) {
    console.log(`ログインチェック:${JSON.stringify(req.user, null, 2)}`);
    return this.authSvc.login(req.user as UserPayload);
  }
}
