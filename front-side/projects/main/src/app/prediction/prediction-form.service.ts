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

import { ToDto } from '../common/to-dto';

@Injectable({
  providedIn: 'root'
})
export class PredictionFormService extends FormGroup implements ToDto<RacePredictionModel> {

  constructor() { 
    super({
      raceDate: new FormControl<string | null>(null, Validators.required), 
      racePlaceCd: new FormControl<number | null>(null, Validators.required), 
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

  get raceDate(): FormControl<string | null> { return this.controls['raceDate'] as FormControl<string | null>; }
  get racePlaceCd(): FormControl<number | null> { return this.controls['racePlaceCd'] as FormControl<number | null>; }
  get raceGradeCd(): FormControl<number | null> { return this.controls['raceGradeCd'] as FormControl<number | null>; }
  get racers(): RacersFormGroup { return this.controls['racers'] as RacersFormGroup; }
  get startExhibition(): StartingFormationFormGroup { return this.controls['startExhibition'] as StartingFormationFormGroup; }
  get exhibitionTimes(): ExhibitionTimesFormGroup { return this.controls['exhibitionTimes'] as ExhibitionTimesFormGroup; }
  get approachPredictions(): FormArray<StartingFormationFormGroup> { return this.controls['approachPredictions'] as FormArray<StartingFormationFormGroup>; }
  get deploymentPredictoins(): FormArray<FormControl<string | null>> { return this.controls['deploymentPredictions'] as FormArray<FormControl<string | null>>; }
  get raceResult(): RaceResultFormGroup { return this.controls['raceResult'] as RaceResultFormGroup; }
  get isWon(): FormControl<null | boolean> { return this.controls['isWon'] as FormControl<boolean | null>; }

  toDto(userKey: string): RacePredictionModel {
    return {
      key: '', 
      user_key: userKey, 
      race_date: this.raceDate.value as string, 
      race_place_cd: this.racePlaceCd.value as number, 
      race_grade_cd: this.raceGradeCd.value as number, 
      racers: this.racers.toDto(), 
      start_exhibition: this.startExhibition.toDto(), 
      exhibition_times: this.exhibitionTimes.toDto(), 
      approach_predictions: this.approachPredictions.controls.map(ctr => ctr.toDto()), 
      deproyment_predictions: this.deploymentPredictoins.controls.map(ctr => ctr.value as string), 
      race_result: this.raceResult.toDto(), 
      is_won: this.isWon.value, 
    }
    
  }
}

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

export class RacerFormControl extends FormControl<number | null> {
  private _racerInfo: RacersModel | null = null;

  constructor() {
    super(null);
  }

  setRacerInfo(value: RacersModel | null) {
    this._racerInfo = value;
  }

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