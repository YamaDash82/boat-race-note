import { TestBed } from '@angular/core/testing';
import { GraphQLModule } from '../graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { PredictionFormService } from './prediction-form.service';
import { mockRacers } from './mocks/mock-datas';
import { RacersModel } from '../../generated/graphql';
import { ExDate } from '@yamadash82/yamadash-ex-primitive';

describe('PredictionFormService', () => {
  let fg: PredictionFormService;
  const racerInfos: RacersModel[] = [];

  beforeAll(() => {
    TestBed.configureTestingModule({
      imports: [
        GraphQLModule, 
        HttpClientModule, 
      ]
    });
    jasmine.DEFAULT_TIMEOUT_INTERVAL=100000;
    fg = TestBed.inject(PredictionFormService);

    const parsedInfos = (JSON.parse(mockRacers)).data;
    racerInfos.push(parsedInfos.racer1);
    racerInfos.push(parsedInfos.racer2);
    racerInfos.push(parsedInfos.racer3);
    racerInfos.push(parsedInfos.racer4);
    racerInfos.push(parsedInfos.racer5);
    racerInfos.push(parsedInfos.racer6);

    console.log(`beforeAll実行`);
  });

  it('should be created', () => {
    expect(fg).toBeTruthy();
  });

  /* WEBAPIを伴うテストはイレギュラーにエラーが発生するのでコメントアウト。
  it('出走レーサーの指定 1号艇', async () => {
    const raceDate = new ExDate(2023, 11, 1);
    fg.raceDate.setValue(raceDate);

    await fg.setRacer(1, 4150);

    expect(fg.racers.racer1.value).toEqual(4150);
  });
  */

  it('出走レーサーのセット', () => {
    fg.racers.racer1.setRacerInfo(racerInfos[0]);
    fg.racers.racer2.setRacerInfo(racerInfos[1]);
    fg.racers.racer3.setRacerInfo(racerInfos[2]);
    fg.racers.racer4.setRacerInfo(racerInfos[3]);
    fg.racers.racer5.setRacerInfo(racerInfos[4]);
    fg.racers.racer6.setRacerInfo(racerInfos[5]);
  
    expect(fg.racers.racer1.value).toEqual(4550);
    expect(fg.racers.racer2.value).toEqual(3643);
    expect(fg.racers.racer3.value).toEqual(4150);
    expect(fg.racers.racer4.value).toEqual(3946);
    expect(fg.racers.racer5.value).toEqual(4376);
    expect(fg.racers.racer6.value).toEqual(3885);
  });

  it('スタート展示のデータをセット', () => {
    fg.startExhibition.setSt(1, 1, 0.03);
    //4号艇前付
    fg.startExhibition.setSt(2, 4, 0.02);
    fg.startExhibition.setSt(3, 2, 0.11);
    fg.startExhibition.setSt(4, 3, 0.03);
    fg.startExhibition.setSt(5, 5, 0.06);
    fg.startExhibition.setSt(6, 6, -0.02);

    const dto = fg.startExhibition.toDto();

    expect(dto.course2.boat_no).toEqual(4);
    expect(dto.course2.st).toEqual(0.02);
  });

  it('展示タイム設定のテスト', () => {
    fg.setExhibitionTime(1, 6.59);
    fg.setExhibitionTime(2, 6.63);
    fg.setExhibitionTime(3, 6.63);
    fg.setExhibitionTime(4, 6.67);
    fg.setExhibitionTime(5, 6.73);
    fg.setExhibitionTime(6, 6.67);

    const dto = fg.exhibitionTimes.toDto();

    expect(dto.boat1).toEqual(6.59);
  });

  it('進入予想のテスト', () => {
    //appendApproachPredictoin設定前のためエラーが発生することを確認する。
    expect(() => {
      console.log(`カウント:${fg.approachPredictions.length}`)
      fg.setApproach(1, 1, 0.02);
    }).toThrow();
    
    //進入予想FormGroupを追加する。
    fg.appendApproachPrediction();
    fg.setApproach(1, 1, racerInfos[0].course_datas[0].st);
    fg.setApproach(2, 2, racerInfos[0].course_datas[1].st);
    fg.setApproach(3, 3, racerInfos[0].course_datas[2].st);
    fg.setApproach(4, 4, racerInfos[0].course_datas[3].st);
    fg.setApproach(5, 5, racerInfos[0].course_datas[4].st);
    fg.setApproach(6, 6, racerInfos[0].course_datas[5].st);
    
    const dto = fg.approachPredictions.controls[0].toDto();

    expect(dto.course1.st).toEqual(racerInfos[0].course_datas[0].st);

    console.log(`現時点のdto:${JSON.stringify(fg.toDto(''), null, 2)}`);
  });

});
