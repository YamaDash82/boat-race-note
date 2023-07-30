import { Module } from '@nestjs/common';
import { FanNoteService } from './fan-note/fan-note.service';
import { ConfigurationController } from './configuration.controller';

@Module({
  providers: [FanNoteService],
  controllers: [ConfigurationController]
})
export class ConfigurationModule {}
