import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';

@Module({
  imports: [ 
    UsersModule, 
    PassportModule, 
    ConfigModule.forRoot(), 
    JwtModule.register({
      secret: (() => {
        const secret = process.env.JWT_SECRET;
        return secret;
      })(),  
      signOptions: { expiresIn: '14d' }, 
    })
  ], 
  providers: [
    AuthService, 
    LocalStrategy, 
    JwtStrategy, 
  ], 
  exports: [
    AuthService, 
  ], controllers: [AuthController]
})
export class AuthModule {}
