import { Injectable, ForbiddenException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UsersModel } from 'declarations/models/users.model';
import { DetaBaseService } from 'src/deta/deta-base.service';

@Injectable()
export class UsersService {
  private readonly users: UsersModel[] = [
    { key: 'hoge01', username: 'hoge', password: 'hogehoge', registered_at: new Date(2023, 0, 15, 9, 15), last_login_at: new Date() }, 
    { key: 'bar02', username: 'bar', password: 'barbar', registered_at: new Date(2023, 4, 6, 18, 30), last_login_at: new Date() }, 
  ];

  //ユーザー情報コレクション
  private usersBase = this.detaBaseSvc.getBase("m_users");

  constructor (
    private detaBaseSvc: DetaBaseService, 
  ) { }
  /**
   * ユーザー情報検索処理
   * @param username 検索するユーザー名
   * @returns ユーザー情報
   */
  async findOne(username: string): Promise<UsersModel | undefined> {
    const res = await this.usersBase.fetch({username: username});
    console.log(`findOne:${JSON.stringify(res.items[0])}`);
    return res.items[0] as any;
  }

  /**
   * 新規ユーザー登録処理
   * @param username ユーザー名
   * @param pass パスワード
   * 新規ユーザー登録処理。
   * すでに存在するユーザー名でリクエストがあった時、ForbiddenExceptionをスローする。
   * いずれ文字数何文字以上、半角英数字のみ等の制約を設ける。
   */
  async appendNewUser(username: string, pass: string) {
    //ユーザー名の重複チェックを行う。
    if (await this.findOne(username)) throw new ForbiddenException('指定されたユーザー名はすでに使用されています。');

    //パスワードの制約チェックを行う。※現在未実装。  

    const createdAt = new Date();

    const newUser: UsersModel = {
      username: username, 
      password: pass, 
      registered_at: createdAt, 
      last_login_at: createdAt, 
    };

    const result = await this.usersBase.put(newUser as any);

    const { password, ...userInfo } = result;

    return userInfo;
  }
}
