import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersSvc: UsersService, 
    private jwtSvc: JwtService, 
  ) { }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersSvc.findOne(username);

    if (!user) {
      throw new UnauthorizedException('該当するユーザー名は登録されていません。');
    }

    //パスワードを検証する。
    if (user && user.password === password) {
      const { password, ...userInfo } = user;

      return userInfo;
    } else {
      throw new UnauthorizedException('パスワードが一致しません。');
    }
  }

  async login(user: any) {
    console.log(`ログインユーザー:${JSON.stringify(user)}`);
    const payload = { username: user.username, userKey: user.key };

    return {
      access_token: this.jwtSvc.sign(payload)
    };
  }
}
