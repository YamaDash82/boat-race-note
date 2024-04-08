import { Field, ID, Int, Float, ObjectType, ResolveField, Parent } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-type-json';

@ObjectType()
export class RacersModel {
  @Field(() => ID)
  key: string;
  
  @Field(() => Int)
  racer_no: number;

  @Field()
  name_kanji: string;

  @Field()
  name_kana: string;

  //支部
  @Field()
  branch: string;

  //級別
  @Field()
  rank: string;

  @Field(() => Int)
  gender: number;

  @Field(() => Int)
  age: number;

  @Field(() => Int)
  weight: number;

  @Field(() => Float)
  win_rate: number;

  @Field(() => Float)
  win_rate2: number;

  @Field(() => Float)
  st: number;

  @Field(() => Int)
  training_term: number;

  @Field()
  birth_place: string;

  @Field(() => [CourseData])
  course_datas: CourseData[]
}

@ObjectType()
export class CourseData {
  @Field(() => Int)
  approch_count: number;

  @Field(() => Float)
  win_rate2: number;

  @Field(() => Float)
  st: number;

  @Field(() => Float)
  st_rank: number;

  @Field(() => Int)
  place1_count: number;

  @Field(() => Int)
  place2_count: number;

  @Field(() => Int)
  place3_count: number;

  @Field(() => Int)
  place4_count: number;
  
  @Field(() => Int)
  place5_count: number;
  
  @Field(() => Int)
  place6_count: number;
}
