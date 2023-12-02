import { gql } from 'apollo-angular';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any; }
};

export type CourseData = {
  __typename?: 'CourseData';
  approch_count: Scalars['Int']['output'];
  place1_count: Scalars['Int']['output'];
  place2_count: Scalars['Int']['output'];
  place3_count: Scalars['Int']['output'];
  place4_count: Scalars['Int']['output'];
  place5_count: Scalars['Int']['output'];
  place6_count: Scalars['Int']['output'];
  st: Scalars['Float']['output'];
  st_rank: Scalars['Float']['output'];
  win_rate2: Scalars['Float']['output'];
};

export type ExhibitionTimes = {
  __typename?: 'ExhibitionTimes';
  boat1?: Maybe<Scalars['Float']['output']>;
  boat2?: Maybe<Scalars['Float']['output']>;
  boat3?: Maybe<Scalars['Float']['output']>;
  boat4?: Maybe<Scalars['Float']['output']>;
  boat5?: Maybe<Scalars['Float']['output']>;
  boat6?: Maybe<Scalars['Float']['output']>;
};

export type Query = {
  __typename?: 'Query';
  racePrediction: RacePredictionModel;
  racer: RacersModel;
  user: UsersModel;
};


export type QueryRacePredictionArgs = {
  key: Scalars['String']['input'];
};


export type QueryRacerArgs = {
  key: Scalars['String']['input'];
};


export type QueryUserArgs = {
  username: Scalars['String']['input'];
};

export type RacePredictionModel = {
  __typename?: 'RacePredictionModel';
  approach_predictions?: Maybe<Array<StartingFormation>>;
  deproyment_predictions?: Maybe<Array<Scalars['String']['output']>>;
  exhibition_times: ExhibitionTimes;
  is_won?: Maybe<Scalars['Boolean']['output']>;
  key?: Maybe<Scalars['ID']['output']>;
  race_date: Scalars['String']['output'];
  race_grade_cd: Scalars['Int']['output'];
  race_place_cd: Scalars['Int']['output'];
  race_result?: Maybe<RaceResult>;
  racers: Racers;
  start_exhibition?: Maybe<StartingFormation>;
  user_key: Scalars['String']['output'];
};

export type RaceResult = {
  __typename?: 'RaceResult';
  first_place?: Maybe<Scalars['Int']['output']>;
  second_place?: Maybe<Scalars['Int']['output']>;
  third_place?: Maybe<Scalars['Int']['output']>;
};

export type Racers = {
  __typename?: 'Racers';
  racer1: Scalars['Int']['output'];
  racer2: Scalars['Int']['output'];
  racer3: Scalars['Int']['output'];
  racer4: Scalars['Int']['output'];
  racer5: Scalars['Int']['output'];
  racer6: Scalars['Int']['output'];
};

export type RacersModel = {
  __typename?: 'RacersModel';
  age: Scalars['Int']['output'];
  birth_place: Scalars['String']['output'];
  branch: Scalars['String']['output'];
  class: Scalars['String']['output'];
  course_datas: Array<CourseData>;
  gender: Scalars['Int']['output'];
  key: Scalars['ID']['output'];
  name_kana: Scalars['String']['output'];
  name_kanji: Scalars['String']['output'];
  training_term: Scalars['Int']['output'];
  weight: Scalars['Int']['output'];
  win_rate: Scalars['Float']['output'];
  win_rate2: Scalars['Float']['output'];
};

export type StartingBoat = {
  __typename?: 'StartingBoat';
  boat_no: Scalars['Int']['output'];
  st: Scalars['Float']['output'];
};

export type StartingFormation = {
  __typename?: 'StartingFormation';
  course1: StartingBoat;
  course2: StartingBoat;
  course3: StartingBoat;
  course4: StartingBoat;
  course5: StartingBoat;
  course6: StartingBoat;
};

export type UsersModel = {
  __typename?: 'UsersModel';
  key: Scalars['ID']['output'];
  last_login_at: Scalars['DateTime']['output'];
  registered_at: Scalars['DateTime']['output'];
  username: Scalars['String']['output'];
};
