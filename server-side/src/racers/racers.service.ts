import { Injectable } from '@nestjs/common';
import { DetaBaseService } from 'src/deta/deta-base.service';
import Base from 'deta/dist/types/base';
import { RacersModel } from 'declarations/models/racers.model';

@Injectable()
export class RacersService {
  private racersBase: Base = this.detaBase.getBase("m_racers");

  constructor(
    private detaBase: DetaBaseService, 
  ) { }

  async findOne(key: string): Promise<RacersModel> {
    return await this.racersBase.get(key) as any;
  }
}
