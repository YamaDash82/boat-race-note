import { UsersModel } from "declarations/models/users.model";
import { Resolver, Query, Args } from "@nestjs/graphql";
import { UsersService } from "./users.service";

@Resolver(of => UsersModel)
export class UsersResolver {
  constructor(
    private usersSvc: UsersService, 
  ) { }

  @Query(() => UsersModel)
  async user(@Args('username') username: string) {
    return this.usersSvc.findOne(username);
  }
}