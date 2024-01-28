import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './auth.service';
import { AppModule } from '../app.module';

describe('AuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ 
        HttpClientModule,
        AppModule,
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
      fail('失敗');
    }

    expect(succeed).toBeTrue()
  });
 
  it('ログイン(失敗)', async () => {
    const service = TestBed.inject(AuthService);

    await expectAsync(service.login('hogehoge', 'fugafuga')).toBeRejected();;
  });
  
  it('ログイン成功後、ログインチェック', async() => {
    const service = TestBed.inject(AuthService);

    //このログインは成功する。
    await service.login('hogehoge', 'abc123');

    expect(await service.checkAuthenticated()).toBeTrue;
  });

  it ('ログインチェック(失敗)', async () => {
    const service = TestBed.inject(AuthService);

    service.logout();

    let succeed = false;

    try {
      succeed = await service.checkAuthenticated();
    } catch(err) {
      succeed = false;
    }

    expect(succeed).toBeFalse();
  });
});
