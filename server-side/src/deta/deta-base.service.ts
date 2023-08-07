import { Injectable } from '@nestjs/common';
import { Deta } from 'deta';
import  Base  from 'deta/dist/types/base';
import { BaseNames } from 'shared_modules/constans/base-names';

@Injectable()
export class DetaBaseService {
  private deta = Deta();
  private bases = {
    m_racers: this.deta.Base("m_racers"), 
  }

  getBase(baseName: BaseNames): Base {
    return this.bases[baseName];
  }
}
