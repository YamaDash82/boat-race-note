import { Query, Args, Resolver } from '@nestjs/graphql';
import { RacersModel } from 'src/models/racers.model';
import { RacersService } from './racers.service';

@Resolver(of => RacersModel)
export class RacersResolver {
  constructor (
    private racersSvc: RacersService, 
  ) { }

  @Query(() => RacersModel)
  async racer(@Args('key') key: string) {
    return this.racersSvc.findOne(key);
  }
}