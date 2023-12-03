import { Controller, Get, Param } from '@nestjs/common';
import { FanNoteService } from './fan-note/fan-note.service';

//要ガードの設定
@Controller('configuration')
export class ConfigurationController {
  constructor (
    private fanNote: FanNoteService, 
  ) { }

  /** 
   * ファン手帳読み取り処理
   * configuration/read-fan-note/<ファイル名>で読み取り処理を実行する。
   * shit-jis形式のファイルをUTF-8に変換して読み取る。
   * ConfigurationController#readFanNoteメソッドも合わせて見ること。
  */
  @Get('read-fan-note/:fileName')
  async readFanNote(@Param('fileName') fileName: string) {
    return this.fanNote.readFile(fileName);
  }

  /**
   * 誤って作成されたデータの調整(削除)用
   * 不要になれば削除する。
   * @returns 
   */
  @Get('adjust') 
  async adjust() {
    await this.fanNote.adjust();

    return true;
  }
}
