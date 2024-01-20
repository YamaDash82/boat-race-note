import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError, map, catchError } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UsersModel } from '../../generated/graphql';

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

  async login(key: string, password: string): Promise<void> {
    const token = await new Promise<string>((resolve, reject) => {
      this.http.post<{ access_token: string }>('http://localhost:3000/auth/login', { key, password }).pipe(
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

  private saveToken(token: string) {
    this.decodedToken =jwt.decodeToken(token);

    localStorage.setItem('auth_tkn', token);
    localStorage.setItem('auth_meta', JSON.stringify(this.decodedToken));

    const { iat, exp, ...userProp } = this.decodedToken as DecodedToken;
    const { user } = userProp;

    this._loginUser = user;
  }

  async checkAuthenticated(): Promise<boolean> {
    //トークンが保持されていなければ未認証状態である。
    if (!this.decodedToken) return false;

    //トークンが有効期限切れであれば未認証状態である。
    if (this.decodedToken.exp < (Date.now() / 1000)) {
      this.logout();

      return false;
    }
    
    try {
      const token = await new Promise<string>((resolve, reject) => {
        this.http.get<{ access_token: string }>('http://localhost:3000/auth/check-login').pipe(
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
  
  get loginUser(): UsersModel | null {
    return this._loginUser;
  }

  logout() {
    this.decodedToken = null;
    this._loginUser = null;
  }
}
