import { Injectable } from '@nestjs/common';
import { BaseNames } from 'shared_modules/constans/base-names';
import { DetaBaseService } from 'src/deta/deta-base.service';
import { join } from 'path';
import * as iconv from 'iconv-lite';
import * as fs from 'fs';
import { Racer } from 'shared_modules/schema/racer';
import { DetaDriveService } from 'src/deta/deta-drive.service';

//ファン手帳情報を読み込む処理。
//とりあえず、開発環境からクラウド上のデータに追加する想定。
//完全なクラウド環境では実行しない。
//プロジェクトルートのfan-noteディレクトリにボートレース公式からダウンロードしたファン手帳データを配置し、実行する。
@Injectable()
export class FanNoteService {
  private racersBase = this.detaBase.getBase("m_racers");
  constructor(
    private detaBase: DetaBaseService, 
    private detaDrive: DetaDriveService, 
  ) { }

  /** 
   * ファン手帳読み取り処理
   * configuration/read-fan-note/<ファイル名>で読み取り処理を実行する。
   * shit-jis形式のファイルをUTF-8に変換して読み取る。
   * ConfigurationController#readFanNoteメソッドも合わせて見ること。
  */
  async readFile(fileName: string): Promise<boolean> {
    const readData = await new Promise<string[]>((resolve, reject) => {
      fs.readFile(join(process.cwd(), 'fan-notes', fileName), (err, data) => {
        if (err) return reject(err);

        const decoded = iconv.decode(data, 'Shift-JIS');

        const racers = decoded.toString().split('\n');

        return resolve(racers);
      });
    });
    let tryCount = 0;
    let cacheCurrent = Date.now();
  
    readData.forEach(async (rData, index) => {
      const parsedData = convToRacerSchema(rData);

      let putSucceed = false;
      
      do {
        putSucceed = await this.putRacerData(parsedData, tryCount, 100);

        if (!putSucceed) {
          tryCount++;
        }
      } while(!putSucceed)
    });
    
    return true;
  }

  async putRacerData(racerData: Racer, trialCount: number, maxTrialCount: number = 10): Promise<boolean> {
    try {
      const { key, ...detail } = racerData;

      await this.racersBase.put(detail as any, key);

      console.log(`登録完了:${key}, レーサー名:${detail.name_kanji}`);
    } catch (err) {
      if (err instanceof Error && err.message === "Something went wrong") {
        console.log(`失敗 リトライ数:${trialCount}, メッセージ:${err.message}`);
        return false;
      } else {
        throw err;
      }
    }
    return true;
  }
  
  /**
   * 誤って作成されたデータの調整(削除)用
   * 不要になれば削除する。
  */
  async adjust() {
    const base = this.detaBase.getBase('m_racers');
    const result = await base.fetch({ age: null, gender: null});
    console.log(`取得件数:${result.count}`);

    let tryCount = 0;

    for (const item of result.items) {
      const key = (item as any).key;
      console.log(`削除キー:${key}`);
      
      let delSucceed = false;
      do {
        try {
          await base.delete(key);
          delSucceed = true;
        } catch(err) {
          console.log(`リトライ:${++tryCount}`);
        }
      } while(!delSucceed)
    }
  }
}

//ファン手帳読み込みに使用するヘルパーメソッド。
const convToRacerSchema = (plainData: string): Racer => {
  const year = parseInt(plainData.substring(164, 168));
  const yearPeriod = parseInt(plainData.substring(168, 169));
  const racer_no = parseInt(plainData.substring(0, 4));
  const key = `${year}-${yearPeriod}-${racer_no}`;
  const name_kanji = plainData.substring(4, 12);
  const name_kana = plainData.substring(12, 27);
  const branch = plainData.substring(27, 29);
  const rank = plainData.substring(29, 31);
  const gender = parseInt(plainData.substring(38, 39));
  const age = parseInt(plainData.substring(39, 41));
  const weight = parseInt(plainData.substring(44,46));
  //勝率
  const win_rate = convToRate(plainData.substring(48, 52), 4, 2);
  //複勝率
  const win_rate2 = convToRate(plainData.substring(52, 56), 4, 1);
  //平均スタートタイミング
  const st = convToRate(plainData.substring(69, 72), 3, 2);
  const training_term = parseInt(plainData.substring(185, 188));
  const birth_place = plainData.substring(400, 403);

  //進入回数読み取り位置
  const approchCountRps: { from: number, to: number }[] = [
    { from: 72, to: 75 }, 
    { from: 85, to: 88 }, 
    { from: 98, to: 101 }, 
    { from: 111, to: 114 }, 
    { from: 124, to: 127 }, 
    { from: 137, to: 140 }, 
  ];
  //2連対率読み取り位置
  const winRate2Rps: { from: number, to: number }[] = [
    { from: 75, to: 79 }, 
    { from: 88, to: 92 }, 
    { from: 101, to: 105 }, 
    { from: 114, to: 118 }, 
    { from: 127, to: 131 }, 
    { from: 140, to: 144 }, 
  ];
  //スタートタイミング読み取り位置
  const stRps: { from: number, to: number }[] = [
    { from: 79, to: 82 }, 
    { from: 92, to: 95 }, 
    { from: 105, to: 108 }, 
    { from: 118, to: 121 }, 
    { from: 131, to: 134 }, 
    { from: 144, to: 147 }, 
  ];
  //スタート順位読み取り位置
  const stRankRps: { from: number, to: number }[] = [
    { from: 82, to: 85 }, 
    { from: 95, to: 98 }, 
    { from: 108, to: 111 }, 
    { from: 121, to: 124 }, 
    { from: 134, to: 137 }, 
    { from: 147, to: 150 }, 
  ];
  //1着回数読み取り位置
  const place1Rps: { from: number, to: number }[] = [
    { from: 188, to: 191 }, 
    { from: 222, to: 225 }, 
    { from: 256, to: 259 }, 
    { from: 290, to: 293 }, 
    { from: 324, to: 327 }, 
    { from: 358, to: 361 }, 
  ];
  //2着回数読み取り位置
  const place2Rps: { from: number, to: number }[] = [
    { from: 191, to: 194 }, 
    { from: 225, to: 228 }, 
    { from: 259, to: 262 }, 
    { from: 293, to: 296 }, 
    { from: 327, to: 330 }, 
    { from: 361, to: 364 }, 
  ];
  //3着回数読み取り位置
  const place3Rps: { from: number, to: number }[] = [
    { from: 194, to: 197 }, 
    { from: 228, to: 231 }, 
    { from: 262, to: 265 }, 
    { from: 296, to: 299 }, 
    { from: 330, to: 333 }, 
    { from: 364, to: 367 }, 
  ];
  //4着回数読み取り位置
  const place4Rps: { from: number, to: number }[] = [
    { from: 197, to: 200 }, 
    { from: 231, to: 234 }, 
    { from: 265, to: 268 }, 
    { from: 299, to: 302 }, 
    { from: 333, to: 336 }, 
    { from: 367, to: 370 }, 
  ];
  //5着回数読み取り位置
  const place5Rps: { from: number, to: number }[] = [
    { from: 200, to: 203 }, 
    { from: 234, to: 237 }, 
    { from: 268, to: 271 }, 
    { from: 302, to: 305 }, 
    { from: 336, to: 339 }, 
    { from: 370, to: 373 }, 
  
  ];
  //6着回数読み取り位置
  const place6Rps: { from: number, to: number }[] = [
    { from: 203, to: 206 }, 
    { from: 237, to: 240 }, 
    { from: 271, to: 274 }, 
    { from: 305, to: 308 }, 
    { from: 339, to: 342 }, 
    { from: 373, to: 376 }, 
   ];

  const courseNos = [1, 2, 3, 4, 5, 6];

  return {
    key, 
    racer_no, 
    name_kanji, 
    name_kana, 
    branch, 
    rank,
    gender, 
    age, 
    weight, 
    win_rate, 
    win_rate2,
    st,
    training_term,
    birth_place, 
    course_datas: courseNos.map((course, index) => {
      return {
        approch_count: parseInt(plainData.substring(approchCountRps[index].from, approchCountRps[index].to)), 
        win_rate2: convToRate(plainData.substring(winRate2Rps[index].from, winRate2Rps[index].to), 4, 1), 
        st: convToRate(plainData.substring(stRps[index].from, stRps[index].to), 3, 2), 
        st_rank: convToRate(plainData.substring(stRankRps[index].from, stRankRps[index].to), 3, 2), 
        place1_count: parseInt(plainData.substring(place1Rps[index].from, place1Rps[index].to)), 
        place2_count: parseInt(plainData.substring(place2Rps[index].from, place2Rps[index].to)), 
        place3_count: parseInt(plainData.substring(place3Rps[index].from, place3Rps[index].to)), 
        place4_count: parseInt(plainData.substring(place4Rps[index].from, place4Rps[index].to)), 
        place5_count: parseInt(plainData.substring(place5Rps[index].from, place5Rps[index].to)), 
        place6_count: parseInt(plainData.substring(place6Rps[index].from, place6Rps[index].to)), 
      }
    }), 
  };
}

const convToRate = (str: string, length: number, decimalPlaces: number): number => {
  const intPlaces = length - decimalPlaces;
  const intPart = str.substring(0, intPlaces);
  const decimalPart = str.substring(intPlaces, intPlaces + decimalPlaces);

  return parseFloat(`${intPart}.${decimalPart}`);  
}