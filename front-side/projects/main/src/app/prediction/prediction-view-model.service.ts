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
import { environment } from '../../environments/environment.development';
import { catchError, throwError } from 'rxjs';

const GET_RACER = gql`
  query GetRacer($key: String!) {
    racer(key: $key) {
      racer_no
      name_kanji
      name_kana
      branch
      rank
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

  /**
   * レース予想情報登録処理
   * 処理成功時サーバーサイドから、レース予想情報のキーと、最終更新日時(Date.prototype.getTime()から取得される値の文字列)が返される。
   * @param racePredicion 
   */
  async saveRacePrediction(racePredicion: RacePredictionModel): Promise<RacePredictionDto.Response.Save> {
    return new Promise<RacePredictionDto.Response.Save>((resolve, reject) => {
      const url = `${environment.rootUrl}/race-predictions/save`
      console.log(`URL確認:${url}`);
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
        error: err => resolve(err),
      });
    });
  }
}