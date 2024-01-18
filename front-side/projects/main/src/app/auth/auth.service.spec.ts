import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './auth.service';
import { AppModule } from '../app.module';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ 
        HttpClientModule,
        AppModule,
      ], 
    });
    service = TestBed.inject(AuthService);
  });

  it('ログイン(成功)', async () => {
    let succeed = false;
    try {
      await service.login('hogehoge', 'abc123');

      succeed = true;
    } catch(err) {
      //なにもしない。
    }

    expect(succeed).toBeTrue()
  });
 
  it('ログイン(失敗)', async () => {
    await expectAsync(service.login('hogehoge', 'fugafuga')).toBeRejected();;
  });
  
  it('ログイン成功後、ログインチェック', async() => {
    //このログインは成功する。
    await service.login('hogehoge', 'abc123');

    expect(await service.checkAuthenticated()).toBeTrue;
  });
});
