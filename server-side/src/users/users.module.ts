import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { DetaModule } from 'src/deta/deta.module';

@Module({
  imports: [
    DetaModule, 
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
