import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authSvc: AuthService, 
  ) { 
    super();
  }

  /**
   * 認証処理
   * @param username ユーザー名
   * @param password パスわーぢ
   * @returns 認証外成功した場合ユーザー情報を返す。
   * 存在しないユーザー名、パスワードが不一致の時、UnauthorizedExcpetionをスローする。
   */
  async validate(username: string, password: string): Promise<any> {
    try {
      //validateUserメソッドで、認証が通らなかった場合、UnauthorizedExceptionがスローされる。
      const user = await this.authSvc.validateUser(username, password);

      return user;
    } catch(err) {
      throw err;
    }
  }
}