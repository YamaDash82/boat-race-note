import { TestBed } from '@angular/core/testing';
import { PredictionViewModelService } from './prediction-view-model.service';
import { RacePredictionModel } from '../../generated/graphql';
import { GraphQLModule } from '../graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { ExDate } from '@yamadash82/yamadash-ex-primitive';

const testData: RacePredictionModel = {
  "key": null,
  "user_key": "",
  "race_date": '2023/12/03',
  "race_place_cd": 1,
  "race_grade_cd": 1,
  "racers": {
    "racer1": 4550,
    "racer2": 3643,
    "racer3": 4150,
    "racer4": 3946,
    "racer5": 4376,
    "racer6": 3885
  },
  "start_exhibition": {
    "course1": {
      "boat_no": 1,
      "st": 0.03
    },
    "course2": {
      "boat_no": 4,
      "st": 0.02
    },
    "course3": {
      "boat_no": 2,
      "st": 0.11
    },
    "course4": {
      "boat_no": 3,
      "st": 0.03
    },
    "course5": {
      "boat_no": 5,
      "st": 0.06
    },
    "course6": {
      "boat_no": 6,
      "st": -0.02
    }
  },
  "exhibition_times": {
    "boat1": 6.59,
    "boat2": 6.63,
    "boat3": 6.63,
    "boat4": 6.67,
    "boat5": 6.73,
    "boat6": 6.67
  },
  "approach_predictions": [
    {
      "course1": {
        "boat_no": 1,
        "st": 0.13
      },
      "course2": {
        "boat_no": 2,
        "st": 0.15
      },
      "course3": {
        "boat_no": 3,
        "st": 0.15
      },
      "course4": {
        "boat_no": 4,
        "st": 0.15
      },
      "course5": {
        "boat_no": 5,
        "st": 0.18
      },
      "course6": {
        "boat_no": 6,
        "st": 0.15
      }
    }
  ],
  "deproyment_predictions": [],
  "race_result": {
    "first_place": null,
    "second_place": null,
    "third_place": null
  },
  "is_won": null
};

describe('PredictionViewModelService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        GraphQLModule, 
        HttpClientModule, 
      ]
    });

    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
  });

  it('レーサー情報の取得', async () => {
    const service = TestBed.inject(PredictionViewModelService);
    const raceDate = new ExDate(2023, 11, 2);

    const racer = await service.fetchRacer(raceDate, 4150);

    expect(racer?.racer_no).toEqual(4150);
  });

  it('レース予想情報登録APIのテスト', async () => {
    const service = TestBed.inject(PredictionViewModelService);
    const apiResult = await service.saveRacePrediction(testData);

    expect(apiResult).toBeTruthy();
  });
});
