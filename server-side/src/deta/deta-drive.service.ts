import { Injectable } from '@nestjs/common';
import { Deta } from 'deta';
import Drive from 'deta/dist/types/deta';

@Injectable()
export class DetaDriveService {
  private deta = Deta();
  private fanNoteDrive = this.deta.Drive('fan_notes');

  /**
   * ファイル取得処理
   * @param fileName 
   * @returns 
   */
  async findFile(fileName: string): Promise<Blob> {
    return this.fanNoteDrive.get(fileName);
  }
}
