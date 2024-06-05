import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt-ts';
import { UserPayload } from 'declarations/models/users.model';

@Injectable()
export class AuthService {
  constructor(
    private usersSvc: UsersService, 
    private jwtSvc: JwtService, 
  ) { }

  /**
   * ユーザー認証処理
   * @param key ユーザーキー
   * @param inputedPass 入力パスワード
   * @returns 
   */
  async validateUser(key: string, inputedPass: string): Promise<UserPayload> {
    const user = await this.usersSvc.findOne(key);
   
    if (!user) {
      throw new UnauthorizedException('該当するユーザー名は登録されていません。');
    }

    //パスワードを検証する。
    if (!await bcrypt.compare(inputedPass, user.password)) {
      throw new UnauthorizedException('パスワードが一致しません。');
    }
    
    //ユーザー情報からパスワードを除外して返す。
    const { password, ...userInfo } = user;

    //最終更新日時を更新する。
    const lastLoginAt = await this.usersSvc.updateLastLoginAt(key);
    
    //フロントに返す情報の最終ログイン日時を更新する。
    userInfo.last_login_at = lastLoginAt;

    return userInfo;
  }

  /**
   * ログイン処理
   * このメソッドの戻り値がJWTとしてフロントサイドに渡される。
   * @param user 
   * @returns 
   */
  async login(user: UserPayload) {
    return {
      access_token: this.jwtSvc.sign({user})
    };
  }
}
