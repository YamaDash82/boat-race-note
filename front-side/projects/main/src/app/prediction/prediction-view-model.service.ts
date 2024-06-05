import { Injectable } from '@angular/core';
import { gql } from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { 
  RacersModel, 
  RacePredictionModel, 
} from '../../generated/graphql';
import { ExDate } from '@yamadash82/yamadash-ex-primitive';
import { RacePredictionDto } from '@common_modules/data-transfer/race-prediction';
import { environment } from 'projects/main/src/environments/environment';
import { catchError, throwError } from 'rxjs';
import { RacePlaces } from '@common_modules/constans/race-places';

const RACER_FIELDS = `
      racer_no
      name_kanji
      name_kana
      age
      branch
      rank
      st
      win_rate
      win_rate2
      training_term
      birth_place
      course_datas {
        approch_count
        win_rate2 
        st
        st_rank
        place1_count
        place2_count
        place3_count
        place4_count
        place5_count
        place6_count
      }
`; 

const GET_RACER = gql`
  query GetRacer($key: String!) {
    racer(key: $key) {
      ${RACER_FIELDS}
    }
  }
`;

const GET_PARTICIPATING_RACERS = gql`
  query GetParticipatingRacers(
    $key1: String!
    $key2: String! 
    $key3: String! 
    $key4: String! 
    $key5: String! 
    $key6: String!
  ) {
    racer1: racer (key: $key1) {
      ${RACER_FIELDS}
    }
    racer2: racer (key: $key2) {
      ${RACER_FIELDS}
    }
    racer3: racer (key: $key3) {
      ${RACER_FIELDS}
    }
    racer4: racer (key: $key4) {
      ${RACER_FIELDS}
    }
    racer5: racer (key: $key5) {
      ${RACER_FIELDS}
    }
    racer6: racer (key: $key6) {
      ${RACER_FIELDS}
    }
  }
`;

const GET_RACE_PREDICTION = gql`
  query GetRacePrediction($key: String!) {
    racePrediction(key: $key) {
      key
      race_date
      race_place_cd
      race_no
      racers {
        racer1
        racer2
        racer3
        racer4
        racer5
        racer6
      }
      start_exhibition {
        course1 {
          boat_no
        	st
        }
        course2 {
          boat_no
        	st
        }
        course3 {
          boat_no
        	st
        }
        course4 {
          boat_no
        	st
        }
        course5 {
          boat_no
        	st
        }
        course6 {
          boat_no
        	st
        }
      }
      exhibition_times {
        boat1
        boat2
        boat3
        boat4
        boat5
        boat6
      }
      approach_predictions { 
        st_type
      	course1 {
          boat_no
        	st
        }
        course2 {
          boat_no
        	st
        }
        course3 {
          boat_no
        	st
        }
        course4 {
          boat_no
        	st
        }
        course5 {
          boat_no
        	st
        }
        course6 {
          boat_no
        	st
        }
      }
      deproyment_predictions
      last_modified_at    
    }
  }
`;

//レース一覧取得
export const GET_RACE_PREDICTIONS = gql`
  query GetRacePredictions(
    $user_key: String!,
    $date_from: String,
    $date_to: String,
    $race_place_cd: Int
  ) {
    racePredictions(
      user_key: $user_key, 
      date_from: $date_from, 
      date_to: $date_to, 
      race_place_cd: $race_place_cd
    ) {
      key
      user_key
      race_date
      race_no
      race_place_cd
      is_won
    }
  }
`;

@Injectable({
  providedIn: 'root'
})
export class PredictionViewModelService {

  constructor(
    private apollo: Apollo, 
    private http: HttpClient,
  ) { }

  /**
   * レーサー情報取得処理
   * @param raceDate 
   * @param racerNo 
   * @returns 
   */
  async fetchRacer(raceDate: ExDate, racerNo: number): Promise<RacersModel | null> {
    const racerInfo = await new Promise<RacersModel | null>((resolve, reject) => {
      const raceYear = raceDate.getFullYear();
      //前期後期 1月から6月は前期で1、7月から12月は後期で2をセットする。
      const term = raceDate.getMonth() <= 6 ? 1 : 2;
      const racerKey = `${raceYear}-${term}-${racerNo}`;

      this.apollo.watchQuery<{
        racer: RacersModel
      }>({
        query: GET_RACER, 
        variables: { key: racerKey }
      }).valueChanges.subscribe(res => {
        if (res.errors) return reject(res.errors[0]);

        return resolve(res.data.racer);
      });
    });
    
    return racerInfo;
  }

  async fetchParticipatingRacers(
    raceDate: ExDate, 
    racerNo1: number, 
    racerNo2: number,
    racerNo3: number,
    racerNo4: number,
    racerNo5: number,
    racerNo6: number,
  ): Promise<{
      racer1: RacersModel, 
      racer2: RacersModel, 
      racer3: RacersModel, 
      racer4: RacersModel, 
      racer5: RacersModel, 
      racer6: RacersModel, 
    } | null> {
    const racerKeys = [racerNo1, racerNo2, racerNo3, racerNo4, racerNo5, racerNo6].map(racerNo => {
      const raceYear = raceDate.getFullYear();
      //前期後期 1月から6月は前期で1、7月から12月は後期で2をセットする。
      const term = raceDate.getMonth() <= 6 ? 1 : 2;
      return `${raceYear}-${term}-${racerNo}`;
    });

    return new Promise<{
      racer1: RacersModel, 
      racer2: RacersModel, 
      racer3: RacersModel, 
      racer4: RacersModel, 
      racer5: RacersModel, 
      racer6: RacersModel, 
    } | null>((resolve, reject) => {
      this.apollo.watchQuery<{
        racer1: RacersModel, 
        racer2: RacersModel, 
        racer3: RacersModel, 
        racer4: RacersModel, 
        racer5: RacersModel, 
        racer6: RacersModel, 
      }>({
        query: GET_PARTICIPATING_RACERS, 
        variables: {
          key1: racerKeys[0], 
          key2: racerKeys[1], 
          key3: racerKeys[2], 
          key4: racerKeys[3], 
          key5: racerKeys[4], 
          key6: racerKeys[5], 
        }
      }).valueChanges.subscribe(res => {
        if (res.errors) return reject(res.errors[0]);

        return resolve(res.data);
      })
    });
  }

  /**
   * 単一レース予想記録情報取得処理
   * @param racePredictionKey 
   * @returns 
   */
  async fetchRacePrediction(racePredictionKey: string): Promise<RacePredictionModel | null> {
    console.log(`key:${racePredictionKey}`);
    const racePrediction = await new Promise<RacePredictionModel | null>((resolve, reject) => {
      this.apollo.watchQuery<{
        racePrediction: RacePredictionModel
      }>({
        query: GET_RACE_PREDICTION, 
        variables: { key: racePredictionKey }
      }).valueChanges.subscribe(res => {
        if (res.errors) return reject(res.errors[0]);

        return resolve(res.data.racePrediction);
      });
    });
    
    return racePrediction;
  }

  /**
   * レース予想一覧取得処理
   * @param params 
   * @returns 
   */
  async fetchRacePredictions(
    params: {
      user_key: string,
      date_from?: ExDate, 
      date_to?: ExDate, 
      race_place_cd?: number,
    }
  ): Promise<(RacePredictionModel & { race_place_name: string })[] | null> { 
    const variables_ = {
          user_key: params.user_key, 
          date_from: params.date_from || null, 
          date_to: params.date_to || null,
          race_place_cd: params.race_place_cd || null, 
        };

    const racePredictions = await new Promise<RacePredictionModel[] | null>((resolve, reject) => {
      this.apollo.watchQuery<{
        racePredictions: RacePredictionModel[]
      }>({
        query: GET_RACE_PREDICTIONS, 
        variables: {
          user_key: params.user_key, 
          date_from: params.date_from?.getYYYYMMDD() || null, 
          date_to: params.date_to?.getYYYYMMDD() || null,
          race_place_cd: params.race_place_cd || null, 
        }
      }).valueChanges.subscribe(res => {
        if (res.errors) {
          return reject(res.errors[0]);
        }

        return resolve(res.data.racePredictions);
      })
    });

    if (racePredictions) {
      //データが取得できた場合、開催場名を付与する。
      return racePredictions?.map(racePrediction => {
        const racePlaceName = { race_place_name: RacePlaces.find(racePlace => racePlace.code === racePrediction.race_place_cd)?.name || "" };

        return { ...racePrediction, ...racePlaceName };
      });
    } else {
      return null;
    }
  }

  /**
   * レース予想情報登録処理
   * 処理成功時サーバーサイドから、レース予想情報のキーと、最終更新日時(Date.prototype.getTime()から取得される値の文字列)が返される。
   * @param racePredicion 
   */
  async saveRacePrediction(racePredicion: RacePredictionModel): Promise<RacePredictionDto.Response.Save> {
    return new Promise<RacePredictionDto.Response.Save>((resolve, reject) => {
      const url = `${environment.rootUrl}/race-predictions/save`

      this.http.post<RacePredictionDto.Response.Save>(
        url, 
        racePredicion, 
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json'
          })
        }
      ).pipe(
        catchError((err: HttpErrorResponse) => {
          return throwError(() => new Error(err.message));
        })
      ).subscribe({
        next: data => resolve(data), 
        error: err => reject(err),
      });
    });
  }
}