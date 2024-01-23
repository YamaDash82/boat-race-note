import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { JwtModule } from '@auth0/angular-jwt';

describe('AuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ 
        HttpClientModule,
        JwtModule.forRoot({
          config: {
            tokenGetter: () => localStorage.getItem('auth_tkn'),
            allowedDomains: [ 'localhost:3000' ],
          }
        }),
      ], 
    });
  });

  it('ログイン(成功)', async () => {
    const service = TestBed.inject(AuthService);

    let succeed = false;
    try {
      await service.login('hogehoge', 'abc123');

      succeed = true;
    } catch(err) {
      //なにもしない。
      fail('失敗');
    }

    expect(succeed).toBeTrue();
  });

  it('ログイン(失敗)', async () => {
    const service = TestBed.inject(AuthService);

    await expectAsync(service.login('hogehoge', 'fugafuga')).toBeRejected();
  });
  
  it('ログイン成功後、ログインチェック', async() => {
    const service = TestBed.inject(AuthService);

    //このログインは成功する。
    await service.login('hogehoge', 'abc123');

    expect(await service.checkAuthenticated()).toBeTrue();
  });

  it ('ログインチェック(失敗)', async () => {
    const service = TestBed.inject(AuthService);
    service.logout();

    expect(await service.checkAuthenticated()).toBeFalse();
  });
});
