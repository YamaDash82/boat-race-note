import { ID, ObjectType, Field, GraphQLISODateTime } from '@nestjs/graphql';

@ObjectType()
export class UserPayload {
  @Field(() => ID)
  key: string;

  @Field(() => GraphQLISODateTime)
  registered_at: Date;

  @Field(() => GraphQLISODateTime)
  last_login_at: Date;
}

@ObjectType()
export class UsersModel extends UserPayload {
  //パスワードはGraphQLの操作では公開しない。
  password: string;
}