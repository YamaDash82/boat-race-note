import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { PredictionFormService } from '../prediction-form.service';
import { PredictionViewModelService } from '../prediction-view-model.service';
import { RacePlaces, RacePlace } from '@common_modules/constans/race-places';
import { getBoatColorClass } from '../../common/utilities';
import { DeploymentPredictionComponent } from '../deployment-prediction/deployment-prediction.component';
import { ExDate } from '@yamadash82/yamadash-ex-primitive';
import { UsersModel } from 'projects/main/src/generated/graphql';

@Component({
  selector: 'app-contents',
  template: `
    <div class="h-full w-full">
      <div class="h-[5vh] bg-red-400 flex items-center">
        <!--戻るボタン-->
        <a href="#"
          *ngIf="loginUser"
          mat-icon-button
          routerLink="/prediction"
        ><mat-icon>arrow_back</mat-icon></a>
        <!--レース情報編集ボタン-->
        <a
          type="button"
          mat-icon-button
          [routerLink]="['..', 'race-index']"
        ><mat-icon>edit</mat-icon></a>
        <!--開催日-->
        <div class="flex flex-col mr-4 w-48">
          <div>開催日</div>
          <div>{{fg.raceDate.dateStrValue}}</div>
        </div>
        <!--レース場-->
        <div class="flex flex-col mr-4 w-36">
          <div>開催場</div>
          <div>{{findRacePlace(fg.racePlaceCd.value)?.name}}</div>
        </div>
        <!--レース番号-->
        <div class="mr-8 w-16">{{fg.raceNo.value}}<span *ngIf="fg.raceNo">R</span></div>
        <!--出走レーサー-->
        <div 
          *ngFor="let racer of fg.racers.items; index as boatIndex;" 
          class="grow flex flex-col px-2"
          [ngClass]="getBoatColorClass(boatIndex + 1)"
        >
          <div>{{boatIndex + 1}}号艇</div>
          <div>{{racer?.racerInfo?.name_kanji}}</div>
        </div>
      </div>
      <!--サブヘッダー-->
      <div class="h-[5vh] bg-red-300 flex items-center align-middle pl-64">
        <!--遷移ボタン-->
        <div *ngFor="let linkButton of linkButtons" class="flex h-full justify-center items-center bg-red-500 mr-1 rounded-t-lg">
          <a 
            class="block text-2xl w-32 text-center"
            routerLinkActive="text-white"
            [routerLink]="linkButton.endPoint"
          >{{linkButton.caption}}</a>
        </div>
        
        <div 
          *ngIf="loginUser"
          class="ml-auto flex h-full items-center"
        >
          <div 
            *ngIf="errorMessage"
            class="text-xl text-red-800"
            >
            {{errorMessage}}
          </div>
          <!--最終更新日時表示-->
          <div 
            class="text-xl"
            *ngIf="fg.lastModifiedAt.value"
          >
            <span 
              class="text-blue-800"
              *ngIf="saveSucceedNotice"
            >登録完了</span>
            更新日時:{{fg.lastModifiedAt.value.getYYYYMMDD_HHMMSS()}}
          </div>
          <!--登録ボタン-->
          <button type="button" 
            class="mx-2 text-2xl w-24 h-[95%] bg-blue-700 text-white rounded-lg shadow-2xl" 
            (click)="saveRacePrediction()"
          >保存</button>
        </div>
      </div>
      <router-outlet (activate)="onActive($event)"></router-outlet>
    </div>
  `,
  styles: [
  ]
})
export class ContentsComponent implements OnInit {
  //ログインユーザー  
  loginUser: UsersModel | null = null;

  racePlaces = RacePlaces;
  //登録処理完了後、一定の時間trueになる。
  //登録完了通知用に使用する。  
  saveSucceedNotice = false;
  //アクティブなコンポーネントへの参照
  private activeComponent!: Component;
  //エラーメッセージ
  errorMessage = "";

  //艇番表示色取得クラス
  getBoatColorClass = getBoatColorClass;

  linkButtons: { caption: string, endPoint: string }[] = [
    { caption: "展示", endPoint: "exhibition" }, 
    { caption: "進入予想", endPoint: "approach-prediction" }, 
    { caption: "展開予想", endPoint: "deployment-prediction" }, 
    //{ caption: "結果", endPoint: "race-result" }, 
  ];

  constructor(
    public fg: PredictionFormService, 
    private viewModel: PredictionViewModelService, 
    private auth: AuthService, 
  ) { }

  async ngOnInit(): Promise<void> {
    //ログインユーザーを取得する。未ログイン時、nullが格納される。  
    this.loginUser = this.auth.loginUser;
  }

  /**
   * レース場検索
   * @param racePlaceCd 
   * @returns 
   */
  findRacePlace(racePlaceCd: number | null): RacePlace | null {
    if (!racePlaceCd) return null;

    return this.racePlaces.find(rp => rp.code === racePlaceCd) as RacePlace;
  }

  /**
   * 予想情報登録処理
   */
  async saveRacePrediction() {
    if (this.auth.loginUser?.key) {
      //現在アクティブなコンポーネントが展開予想コンポーネントのとき、入力中の展開予想を保存(FormControlに格納)する。
      if (this.activeComponent instanceof DeploymentPredictionComponent) {
        (this.activeComponent as DeploymentPredictionComponent).saveCurrentPrediction();
      }

      try {
        const result  = await this.viewModel.saveRacePrediction(this.fg.toDto(this.auth.loginUser.key));
        this.fg.lastModifiedAt.setValue(new ExDate(result.lastModifiedAt));
        //登録完了後、一定時間、登録完了メッセージを表示する。
        this.saveSucceedNotice = true;
        setTimeout(() => {
          this.saveSucceedNotice = false;
        }, 2000)
      } catch(err) {
        console.log(`エラー:${err}`);
        this.errorMessage = `登録処理中にエラー発生が発生しました。${err}`
      }
    }
  }

  /**
   * ページ遷移時処理
   * アクティブなコンポーネントをメンバにセットする。
   * @param component 
   */
  onActive(component: Component) {
    //アクティブなコンポーネントへの参照を取得する。
    this.activeComponent = component;
  }
}
