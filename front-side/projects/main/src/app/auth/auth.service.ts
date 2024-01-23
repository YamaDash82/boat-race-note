import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError, map, catchError } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UsersModel } from '../../generated/graphql';
import { environment } from '../../environments/environment';
import { UserDto } from '@common_modules/data-transfer/user';
import { Subject } from 'rxjs';

const jwt = new JwtHelperService();

class DecodedToken {
  user!: UsersModel;
  iat!: number;
  exp!: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private decodedToken: DecodedToken | null = null;
  private _loginUser: UsersModel | null = null;

  constructor(
    private http: HttpClient, 
  ) { 
    this.decodedToken = localStorage.getItem('auth_meta') ?
      JSON.parse(localStorage.getItem('auth_meta') as string)
      :
      new DecodedToken();
  }

  /**
   * ログイン認証処理
   * @param key 
   * @param password 
   */
  async login(key: string, password: string): Promise<void> {
    const token = await new Promise<string>((resolve, reject) => {
      this.http.post<{ access_token: string }>(`${environment.rootUrl}/auth/login`, { key, password }).pipe(
        catchError((err: HttpErrorResponse) => {
          return throwError(() => new Error(err.error.message));
        }), 
        map(token => token.access_token), 
      ).subscribe({
        next: token => resolve(token), 
        error: err => reject(err)
      });
    });

    this.saveToken(token);
  }

  /**
   * トークン保存処理
   * @param token 
   */
  private saveToken(token: string) {
    this.decodedToken =jwt.decodeToken(token);

    localStorage.setItem('auth_tkn', token);
    localStorage.setItem('auth_meta', JSON.stringify(this.decodedToken));

    const { iat, exp, ...userProp } = this.decodedToken as DecodedToken;
    const { user } = userProp;

    this._loginUser = user;

    //ログイン状態の変更をストリームに流す。
    this.loginStateChange.next(this._loginUser);
  }

  /**
   * 認証チェック処理
   * 認証済の場合、有効期限を延長した新しいトークンを取得する。
   * @returns 
   */
  async checkAuthenticated(): Promise<boolean> {
    //ログイン情報を保持していれば認証済である。
    if (this.loginUser) return true;

    //トークンが保持されていなければ未認証状態である。
    if (!this.decodedToken) return false;

    //トークンが有効期限切れであれば未認証状態である。
    if (this.decodedToken.exp < (Date.now() / 1000)) {
      this.logout();

      return false;
    }
    
    try {
      const token = await new Promise<string>((resolve, reject) => {
        this.http.get<{ access_token: string }>(`${environment.rootUrl}/auth/check-login`).pipe(
          catchError((err) => {
            const errorMessage = err.message ?? err.error.message;

            return throwError(() => new Error(errorMessage))
          }), 
          map(token => token.access_token)
        ).subscribe({
          next: token => resolve(token),
          error: err => reject(err)
        });
      });
      //有効期限を延長した新しいトークンを保存し、trueを返す。
      this.saveToken(token);
    
      return true;
    } catch(err) {
      //未認証状態なのでfalseを返す。
      return false;
    }
  }
  
  /**
   * 新規ユーザー登録処理
   * 登録成功時、JWTを取得し保存する。
   * @param dto 
   * @returns
   */
  async registerNewUser(dto: UserDto.Request.AppendUser): Promise<boolean> {
    try {
      const token = await new Promise<string>((resolve, reject) => {
        this.http.post<{ access_token: string }>(
          `${environment.rootUrl}/auth/append-user`, 
          dto, 
          {
            responseType: 'json',
          }, 
        ).pipe(
          catchError((err) => throwError(() => new Error(err.error.message))), 
          map(token => token.access_token),
        ).subscribe({
          next: data => resolve(data),
          error: err => reject(err),
        })
      });

      this.saveToken(token);
      
      return true;
    } catch(err) {
      throw err;
    }
  }

  /**
   * ログインユーザー
   * プロパティ
   */
  get loginUser(): UsersModel | null {
    return this._loginUser;
  }

  /**
   * ログアウト処理
   * 保持しているトークン、ログインユーザー情報を破棄する。
   */
  logout() {
    this.decodedToken = null;
    this._loginUser = null;

    localStorage.removeItem('auth_tkn');
    localStorage.removeItem('auth_meta');

    //ログイン状態の変更をストリームに流す。
    this.loginStateChange.next(this._loginUser);
  }

  //ログイン状態変更検知
  private loginStateChange = new Subject<UsersModel | null>();
  loginStateChange$ = this.loginStateChange.asObservable();
}
