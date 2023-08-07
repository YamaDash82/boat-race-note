import { Module } from '@nestjs/common';
import { FanNoteService } from './fan-note/fan-note.service';
import { ConfigurationController } from './configuration.controller';
import { DetaModule } from 'src/deta/deta.module';

@Module({
  imports: [
    DetaModule,
  ], 
  providers: [FanNoteService],
  controllers: [ConfigurationController]
})
export class ConfigurationModule {}
