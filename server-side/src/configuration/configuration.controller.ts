import { Controller, Get, Param } from '@nestjs/common';
import { FanNoteService } from './fan-note/fan-note.service';

//要ガードの設定
@Controller('configuration')
export class ConfigurationController {
  constructor (
    private fanNote: FanNoteService, 
  ) { }

  @Get('read-fan-note/:fileName')
  async readFanNote(@Param('fileName') fileName: string) {
    return this.fanNote.readFile();
  }
}
