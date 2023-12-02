import { Field, Int, Float, ID, ObjectType, GraphQLISODateTime } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-type-json';

/**
 * スターティングボート
 */
@ObjectType()
export class StartingBoat {
  @Field(() => Int)
  boat_no: number;

  @Field(() => Float)
  st: number;
}

/**
 * 進入体系
 */
@ObjectType()
export class StartingFormation {
  @Field(() => StartingBoat)
  course1: StartingBoat

  @Field(() => StartingBoat)
  course2: StartingBoat

  @Field(() => StartingBoat)
  course3: StartingBoat

  @Field(() => StartingBoat)
  course4: StartingBoat

  @Field(() => StartingBoat)
  course5: StartingBoat

  @Field(() => StartingBoat)
  course6: StartingBoat
}

/**
 * 出場レーサー
 */
@ObjectType() 
export class Racers {
  @Field(() => Int)
  racer1: number;

  @Field(() => Int)
  racer2: number;

  @Field(() => Int)
  racer3: number;
 
  @Field(() => Int)
  racer4: number;

  @Field(() => Int)
  racer5: number;

  @Field(() => Int)
  racer6: number;
}

/**
 * 展示タイム
 */
@ObjectType()
export class ExhibitionTimes {
  @Field(() => Float, { nullable: true })
  boat1: number;

  @Field(() => Float, { nullable: true })
  boat2: number;

  @Field(() => Float, { nullable: true })
  boat3: number;

  @Field(() => Float, { nullable: true })
  boat4: number;

  @Field(() => Float, { nullable: true })
  boat5: number;

  @Field(() => Float, { nullable: true })
  boat6: number;
}

/**
 * レース結果
 */
@ObjectType()
export class RaceResult {
  /**
   * 1着
   */
  @Field(() => Int, { nullable: true })
  first_place: number | null;

  /**
   * 2着
   */
  @Field(() => Int, { nullable: true })
  second_place: number | null;

  /**
   * 3着
   */
  @Field(() => Int, { nullable: true })
  third_place: number | null;
}

/**
 * レース予想
 */
@ObjectType()
export class RacePredictionModel {
  //識別子
  @Field(() => ID, { nullable: true })
  key?: string;

  //ユーザーキー
  @Field()
  user_key: string;

  //開催日
  @Field()
  race_date: string;

  //開催場
  @Field(() => Int)
  race_place_cd: number;

  //グレード
  @Field(() => Int)
  race_grade_cd: number;
  
  //出場レーサー
  @Field(() => Racers)
  racers: Racers;

  //スタート展示
  @Field(() => StartingFormation, { nullable: true })
  start_exhibition: StartingFormation;

  //展示タイム
  @Field(() => ExhibitionTimes)
  exhibition_times: ExhibitionTimes;

  //進入予想
  @Field(()=> [StartingFormation], { nullable: true })
  approach_predictions: StartingFormation[];

  //展開予想
  @Field(() => [String], { nullable: true })
  deproyment_predictions: string[];

  //着順
  //※不成立について後で考慮する必要あり。
  @Field(() => RaceResult, { nullable: true })
  race_result: RaceResult;
  
  //的中フラグ
  @Field(() => Boolean, { nullable: true })
  is_won: boolean;
}

/*
//スターティングボート
export interface StartingBoat {
  boat_no: number;
  st: number;
}

//進入体系
export interface StartingFormation {
  course1: StartingBoat;
  course2: StartingBoat;
  course3: StartingBoat;
  course4: StartingBoat;
  course5: StartingBoat;
  course6: StartingBoat;
}
*/

