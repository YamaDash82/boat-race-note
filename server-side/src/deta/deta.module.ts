import { Module } from '@nestjs/common';
import { DetaBaseService } from './deta-base.service';
import { DetaDriveService } from './deta-drive.service';

@Module({
  providers: [DetaBaseService, DetaDriveService],
  exports: [
    DetaBaseService, 
    DetaDriveService, 
  ]
})
export class DetaModule {}
