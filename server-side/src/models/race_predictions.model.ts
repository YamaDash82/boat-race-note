import { Field, Int, Float, ID, ObjectType, GraphQLISODateTime } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-type-json';

@ObjectType()
export class RacePredictionmModel {
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
  @Field(() => GraphQLJSON)
  racers: {
    racer1: number;
    racer2: number;
    racer3: number;
    racer4: number;
    racer5: number;
    racer6: number;
  }

  //スタート展示
  @Field(() => GraphQLJSON, { nullable: true })
  start_exhibition: StartingFormation

  //展示タイム
  @Field(() => GraphQLJSON)
  exhibition_times: {
    boat1: number;
    boat2: number;
    boat3: number;
    boat4: number;
    boat5: number;
    boat6: number;
  }

  //進入予想
  @Field(()=> GraphQLJSON, { nullable: true })
  approach_predictions: StartingFormation[];

  //展開予想
  @Field(() => [String], { nullable: true })
  deproyment_predictions: string[];

  //着順
  //※不成立について後で考慮する必要あり。
  @Field(() => GraphQLJSON, { nullable: true })
  race_result: {
    first_place: any;
    second_place: any;
    third_place: any;
  };

  //的中フラグ
  @Field(() => Boolean, { nullable: true })
  is_won: boolean;
}

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