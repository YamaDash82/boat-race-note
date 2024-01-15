import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { DetaModule } from 'src/deta/deta.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    DetaModule, 
    ConfigModule.forRoot(), 
  ], 
  providers: [
    UsersService, 
    UsersResolver, 
  ],
  exports: [
    UsersService, 
  ]
})
export class UsersModule {}
