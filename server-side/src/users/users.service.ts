import { Injectable, ForbiddenException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UsersModel, UserPayload } from 'declarations/models/users.model';
import { DetaBaseService } from 'src/deta/deta-base.service';
import { passwordConfig } from 'shared_modules/utilities/password';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  //ユーザー情報コレクション
  private usersBase = this.detaBaseSvc.getBase("m_users");

  //暗号化強度
  private saltRounds = process.env.SALT_ROUNDS ? parseInt(process.env.SALT_ROUNDS) : 10;
  
  constructor (
    private detaBaseSvc: DetaBaseService, 
  ) { }

  /**
   * ユーザー情報検索処理
   * @param key 検索するユーザーキー
   * @returns ユーザー情報
   */
  async findOne(key: string): Promise<UsersModel | undefined> {
    const res = await this.usersBase.fetch({ key });
    
    return res.items[0] as any;
  }

  /**
   * 新規ユーザー登録処理
   * @param key ユーザーキー
   * @param pass パスワード
   * 新規ユーザー登録処理。
   * すでに存在するユーザー名でリクエストがあった時、ForbiddenExceptionをスローする。
   * いずれ文字数何文字以上、半角英数字のみ等の制約を設ける。
   */
  async appendNewUser(key: string, pass: string): Promise<UserPayload> { 
    //ユーザー名の重複チェックを行う。
    if (await this.findOne(key)) throw new ForbiddenException('指定されたユーザー名はすでに使用されています。');

    //パスワードの制約チェックを行う。 
    if (!passwordConfig.pattern.test(pass)) throw new ForbiddenException(passwordConfig.errorMessage);
    
    const createdAt = new Date();

    //パスワードをハッシュ化する。
    const hashedPass = await bcrypt.hash(pass, this.saltRounds);

    const newUser: UsersModel = {
      key, 
      //パスワードはハッシュ化して保存する。
      password: hashedPass, 
      registered_at: createdAt, 
      last_login_at: createdAt, 
    };

    const result = await this.usersBase.put(newUser as any) as any as UsersModel;

    const { password, ...userInfo } = result;

    return userInfo;
  }

  /**
   * 最終更新日時更新処理
   * @param userKey 更新対象ユーザー
   * @returns Promise<Date>
   */
  async updateLastLoginAt(userKey: string): Promise<Date> {
    //最終ログイン日時
    const lastLoginAt = new Date();
    
    await this.usersBase.update({ last_login_at: lastLoginAt } as any, userKey);

    return lastLoginAt;
  }
}
