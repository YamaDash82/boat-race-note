import { ID, ObjectType, Field, GraphQLISODateTime } from '@nestjs/graphql';

@ObjectType()
export class UsersModel {
  @Field(() => ID)
  key?: string;

  @Field()
  username: string;

  //パスワードはGraphQLの操作では公開しない。
  password: string;

  @Field(() => GraphQLISODateTime)
  registered_at: Date;

  @Field(() => GraphQLISODateTime)
  last_login_at: Date;
}