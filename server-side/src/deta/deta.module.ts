import { Module } from '@nestjs/common';
import { DetaBaseService } from './deta-base.service';
import { DetaDriveService } from './deta-drive.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(), 
  ], 
  providers: [
    DetaBaseService, 
    DetaDriveService, 
  ],
  exports: [
    DetaBaseService, 
    DetaDriveService, 
  ]
})
export class DetaModule {}
