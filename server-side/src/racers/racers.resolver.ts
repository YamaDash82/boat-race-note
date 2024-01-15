import { Query, Args, Resolver } from '@nestjs/graphql';
import { RacersModel } from 'declarations/models/racers.model';
import { RacersService } from './racers.service';

@Resolver(of => RacersModel)
export class RacersResolver {
  constructor (
    private racersSvc: RacersService, 
  ) { }

  @Query(() => RacersModel, { nullable: true })
  async racer(@Args('key') key: string) {
    return this.racersSvc.findOne(key);
  }
}