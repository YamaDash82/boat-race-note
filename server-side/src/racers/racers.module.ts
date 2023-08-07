import { Module } from '@nestjs/common';
import { RacersService } from './racers.service';
import { DetaModule } from 'src/deta/deta.module';
import { RacersResolver } from './racers.resolver';

@Module({
  imports: [
    DetaModule, 
  ], 
  providers: [
    RacersService,
    RacersResolver, 
  ], 
  exports: [
    RacersService, 
  ]
})
export class RacersModule {}
