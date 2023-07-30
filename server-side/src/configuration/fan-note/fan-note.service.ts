import { Injectable } from '@nestjs/common';

@Injectable()
export class FanNoteService {
  readFile(): string {
    return '読み込んだ!!';
  }
}
