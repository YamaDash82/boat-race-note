import { Injectable } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { 
  StartingBoat, 
  StartingFormation, 
  RacersModel, 
  RacePredictionModel, 
  Racers, 
  ExhibitionTimes, 
  RaceResult, 
} from '../../generated/graphql';
import { ExDateFormControl } from '../common/ex-date-form-control';
import { ToDto } from '../common/to-dto';
import { PredictionViewModelService } from './prediction-view-model.service';
import { ExDate } from '@yamadash82/yamadash-ex-primitive';

@Injectable({
  providedIn: 'root'
})
export class PredictionFormService extends FormGroup implements ToDto<RacePredictionModel> {
  private currentApproachPredictionIndex: number | null = null;

  constructor(
    private viewModel: PredictionViewModelService, 
  ) { 
    super({
      key: new FormControl<string | null>(null), 
      raceDate: new ExDateFormControl(null, Validators.required), 
      racePlaceCd: new FormControl<number | null>(null, Validators.required), 
      raceNo: new FormControl<number | null>(null, Validators.required), 
      raceGradeCd: new FormControl<number | null>(null, Validators.required), 
      racers: new RacersFormGroup(), 
      startExhibition: new StartingFormationFormGroup(), 
      exhibitionTimes: new ExhibitionTimesFormGroup(), 
      approachPredictions: new FormArray<StartingFormationFormGroup>([]), 
      deploymentPredictions: new FormArray<FormControl<string | null>>([]),
      raceResult: new RaceResultFormGroup(),
      isWon: new FormControl<null | boolean>(null)
    });
  }

  get key(): FormControl<string | null> { return this.controls['key'] as FormControl<string | null>; }
  get raceDate(): ExDateFormControl { return this.controls['raceDate'] as ExDateFormControl; }
  get racePlaceCd(): FormControl<number | null> { return this.controls['racePlaceCd'] as FormControl<number | null>; }
  get raceNo(): FormControl<number | null> { return this.controls['raceNo'] as FormControl<number | null>; }
  get raceGradeCd(): FormControl<number | null> { return this.controls['raceGradeCd'] as FormControl<number | null>; }
  get racers(): RacersFormGroup { return this.controls['racers'] as RacersFormGroup; }
  get startExhibition(): StartingFormationFormGroup { return this.controls['startExhibition'] as StartingFormationFormGroup; }
  get exhibitionTimes(): ExhibitionTimesFormGroup { return this.controls['exhibitionTimes'] as ExhibitionTimesFormGroup; }
  get approachPredictions(): FormArray<StartingFormationFormGroup> { return this.controls['approachPredictions'] as FormArray<StartingFormationFormGroup>; }
  get deploymentPredictoins(): FormArray<FormControl<string | null>> { return this.controls['deploymentPredictions'] as FormArray<FormControl<string | null>>; }
  get raceResult(): RaceResultFormGroup { return this.controls['raceResult'] as RaceResultFormGroup; }
  get isWon(): FormControl<null | boolean> { return this.controls['isWon'] as FormControl<boolean | null>; }

  /**
   * レーサー情報設定処理
   * @param boatNo 
   * @param racerNo 
   */
  async setRacer(boatNo: number, racerNo: number) {
    //開催日が未入力の場合、例外をスローする。  
    if (!this.raceDate.value) throw new Error(`開催日が未設定です。`);

    /*
    //開催日、登録番号より参照するキーを生成する。
    //キーの形式 YYYY-[1|2]-登録番号
    //例)
    //開催日が2023/01/01～2023/06/30の場合参照するキー 2023-1-登録番号
    //開催日が2023/07/01～2023/12/31の場合参照するキー 2023-2-登録番号
    const raceYear = this.raceDate.date?.getFullYear();
    const term = (this.raceDate.date?.getMonth() as number) <= 6 ? 1 : 2;
    const racerKey = `${raceYear}-${term}-${racerNo}`;

    //GraphQLサーバーに接続してデータを取得する。
    const racerInfo = await new Promise<RacersModel>((resolve, reject) => {
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
    */
    //レーサー情報を取得する。
    const raceDate = new ExDate(this.raceDate.dateStrValue as string);
    const racerInfo = await this.viewModel.fetchRacer(raceDate, racerNo);

    //コントロールにレーサー情報をセットする。
    this.racers.setRacerInfo(boatNo, racerInfo);
  }

  /**
   * 展示タイム設定処理
   * @param boatNo 
   * @param exhibitionTime 
   */
  setExhibitionTime(boatNo: number, exhibitionTime: number) {
    this.exhibitionTimes.setExhibitionTime(boatNo, exhibitionTime);
  }

  /**
   * 進入予想追加処理
   */
  appendApproachPrediction() {
    this.approachPredictions.push(new StartingFormationFormGroup());
    this.currentApproachPredictionIndex = this.addAsyncValidators.length - 1;
  }

  /**
   * 進入予想設定処理
   * コース、艇番、スタートタイミングを入力する。
   * @param courseNo 
   * @param boatNo 
   * @param st 
   */
  setApproach(courseNo: number, boatNo: number, st: number) {
    if (this.currentApproachPredictionIndex===null) throw new Error('設定対象の進入予想フォームグループが選択されていません。');

    const targetFg = this.approachPredictions.controls[this.currentApproachPredictionIndex];

    targetFg.setSt(courseNo, boatNo, st);
  }

  /**
   * 進入予想削除処理
   * @param index 
   */
  deleteApproachPrediction(index: number) {
    this.approachPredictions.removeAt(index);
  }

  /**
   * 登録用転送データ取得処理
   * @param key 
   * @param userKey 
   * @returns 
   */
  toDto(userKey: string): RacePredictionModel {
    return {
      key: this.key.value, 
      user_key: userKey, 
      race_date: this.raceDate.dateStrValue as string, 
      race_place_cd: this.racePlaceCd.value as number, 
      race_grade_cd: this.raceGradeCd.value as number, 
      racers: this.racers.toDto(), 
      start_exhibition: this.startExhibition.toDto(), 
      exhibition_times: this.exhibitionTimes.toDto(), 
      approach_predictions: this.approachPredictions.controls.map(ctr => ctr.toDto()), 
      deproyment_predictions: this.deploymentPredictoins.controls.map(ctr => ctr.value as string), 
      race_result: this.raceResult.toDto(), 
      is_won: this.isWon.value, 
    };
  }
}

/**
 * 出走レーサーフォームグループ
 */
export class RacersFormGroup extends FormGroup implements ToDto<Racers> {
  constructor() {
    super({
      racer1: new RacerFormControl(), 
      racer2: new RacerFormControl(), 
      racer3: new RacerFormControl(), 
      racer4: new RacerFormControl(), 
      racer5: new RacerFormControl(), 
      racer6: new RacerFormControl(),
    });
  }

  get racer1(): RacerFormControl { return this.controls['racer1'] as RacerFormControl; }
  get racer2(): RacerFormControl { return this.controls['racer2'] as RacerFormControl; }
  get racer3(): RacerFormControl { return this.controls['racer3'] as RacerFormControl; }
  get racer4(): RacerFormControl { return this.controls['racer4'] as RacerFormControl; }
  get racer5(): RacerFormControl { return this.controls['racer5'] as RacerFormControl; }
  get racer6(): RacerFormControl { return this.controls['racer6'] as RacerFormControl; }
  
  /**
   * RacerFormControl群取得処理
   * RacerFormControlを配列で取得する。
   */
  get items(): RacerFormControl[] {
    return [
      this.racer1, this.racer2, this.racer3, this.racer4, this.racer5, this.racer6
    ];
  }

  /**
   * レーサー情報設定処理
   * @param boatNo 艇番
   * @param racerInfo レーサー情報
   */
  setRacerInfo(boatNo: number, racerInfo: RacersModel | null) {
    if (boatNo < 1 || 6 < boatNo) throw new Error(`引数boatNoには1～6までの値を指定してください。${boatNo}は不正な値です。`);
    
    (this.controls[`racer${boatNo}`] as RacerFormControl).setRacerInfo(racerInfo);
  }

  toDto() {
    return {
      racer1: this.racer1.value as number, 
      racer2: this.racer2.value as number, 
      racer3: this.racer3.value as number, 
      racer4: this.racer4.value as number, 
      racer5: this.racer5.value as number, 
      racer6: this.racer6.value as number, 
    }
  }
}

/**
 * 出走レーサーフォームグループ
 * レーサー登録番号を値として保持し、付随してレーサー情報を保持する。
 */
export class RacerFormControl extends FormControl<number | null> {
  private _racerInfo: RacersModel | null = null;

  constructor() {
    super(null);
  }

  /**
   * レーサー情報設定処理
   * レーサー情報設定時、当フォームコントロールが保持する値、レーサー登録番号を設定する。
   * @param value 
   */
  setRacerInfo(value: RacersModel | null) {
    if (value) {
      this.setValue(value.racer_no);
    } else {
      this.reset();
    }
    this._racerInfo = value;
  }

  /**
   * レーサー情報
   */
  get racerInfo(): RacersModel | null {
    return this._racerInfo;
  }
}

/**
 * スターティングボートフォームコントロール
 * スタートタイミングを扱うフォームコントロール。付随して艇番を保持する。
 */
export class StartingBoatFormControl extends FormControl<number | null> implements ToDto<StartingBoat> {
  private _boatNo: number = 0;

  constructor() {
    super(null);
  }

  /**
   * スタートタイミング設定処理
   * @param boatNo 
   * @param st 
   */
  setSt(boatNo: number, st: number | null) {
    this._boatNo = boatNo;
    this.setValue(st);
  }

  get boatNo(): number { return this._boatNo; }
  set boatNo(value: number) {
    this._boatNo = value;
  }

  toDto() {
    return {
      boat_no: this._boatNo, 
      st: this.value as number, 
    }
  }
}

/**
 * 進入予想フォームグループ
 */
export class StartingFormationFormGroup extends FormGroup implements ToDto<StartingFormation> {
  constructor() {
    super({
      course1: new StartingBoatFormControl(), 
      course2: new StartingBoatFormControl(), 
      course3: new StartingBoatFormControl(), 
      course4: new StartingBoatFormControl(), 
      course5: new StartingBoatFormControl(), 
      course6: new StartingBoatFormControl(), 
    });
  }

  get course1(): StartingBoatFormControl { return this.controls['course1'] as StartingBoatFormControl; }
  get course2(): StartingBoatFormControl { return this.controls['course2'] as StartingBoatFormControl; }
  get course3(): StartingBoatFormControl { return this.controls['course3'] as StartingBoatFormControl; }
  get course4(): StartingBoatFormControl { return this.controls['course4'] as StartingBoatFormControl; }
  get course5(): StartingBoatFormControl { return this.controls['course5'] as StartingBoatFormControl; }
  get course6(): StartingBoatFormControl { return this.controls['course6'] as StartingBoatFormControl; }

  /**
   * スタートタイミング設定処理
   * @param courseNo 
   * @param boatNo 
   * @param st 
   */
  setSt(courseNo: number, boatNo: number, st: number | null) {
    //1～6以外の値がcourseNoに指定されたとき例外をスローする。
    
    (this.controls[`course${courseNo}`] as StartingBoatFormControl).setSt(boatNo, st);
  }

  toDto() {
    return {
      course1: this.course1.toDto(), 
      course2: this.course2.toDto(), 
      course3: this.course3.toDto(), 
      course4: this.course4.toDto(), 
      course5: this.course5.toDto(), 
      course6: this.course6.toDto()
    }    
  }
}

/**
 * 展示航走フォームグループ
 */
export class ExhibitionTimesFormGroup extends FormGroup implements ToDto<ExhibitionTimes> {
  constructor() {
    super({
      boat1: new FormControl<number | null>(null), 
      boat2: new FormControl<number | null>(null), 
      boat3: new FormControl<number | null>(null), 
      boat4: new FormControl<number | null>(null), 
      boat5: new FormControl<number | null>(null), 
      boat6: new FormControl<number | null>(null), 
    })
  }

  get boat1(): FormControl<number | null> { return this.controls['boat1'] as FormControl<number | null>; }
  get boat2(): FormControl<number | null> { return this.controls['boat2'] as FormControl<number | null>; }
  get boat3(): FormControl<number | null> { return this.controls['boat3'] as FormControl<number | null>; }
  get boat4(): FormControl<number | null> { return this.controls['boat4'] as FormControl<number | null>; }
  get boat5(): FormControl<number | null> { return this.controls['boat5'] as FormControl<number | null>; }
  get boat6(): FormControl<number | null> { return this.controls['boat6'] as FormControl<number | null>; }
 
  /**
   * 展示タイム設定処理
   * @param boatNo 
   * @param time 
   */
  setExhibitionTime(boatNo: number, time: number | null) {
    (this.controls[`boat${boatNo}`] as FormControl<number | null>).setValue(time);
  }

  toDto(): ExhibitionTimes {
    return {
      boat1: this.boat1.value,
      boat2: this.boat2.value, 
      boat3: this.boat3.value, 
      boat4: this.boat4.value, 
      boat5: this.boat5.value, 
      boat6: this.boat6.value, 
    }
  }  
}

/**
 * レース結果フォームグループ
 */
export class RaceResultFormGroup extends FormGroup implements ToDto<RaceResult> {
  constructor() {
    super({
      firstPlace: new FormControl<number | null>(null), 
      secondPlace: new FormControl<number | null>(null), 
      thirdPlace: new FormControl<number | null>(null), 
    });
  }

  get firstPlace(): FormControl<number | null> { return this.controls['firstPlace'] as FormControl<number | null>; }
  get secondPlace(): FormControl<number | null> { return this.controls['secondPlace'] as FormControl<number | null>; }
  get thirdPlace(): FormControl<number | null> { return this.controls['thirdPlace'] as FormControl<number | null>; }

  toDto(): RaceResult {
    return {
      first_place: this.firstPlace.value, 
      second_place: this.secondPlace.value, 
      third_place: this.thirdPlace.value,
    }
  }
}