export interface CourseData {
  approch_count: number; //進入回数
  win_rate2: number;     //2連対率
  st: number;            //スタートタイミング
  st_rank: number;       //スタート順位
  place1_count: number;  //1着回数
  place2_count: number;  //2着回数
  place3_count: number;  //3着回数
  place4_count: number;  //4着回数
  place5_count: number;  //5着回数
  place6_count: number;  //6着回数
}

export interface Racer {
  key: string;                //キー 年+前期/後期+登番 例)2023-2-4444 2023年後期の登番4444
  racer_no: number;           //登番
  name_kanji: string;         //名前漢字
  name_kana: string;          //名前カナ
  branch: string;             //支部
  rank: string;               //級別
  gender: number;             //性別 1:男性,2:女性
  age: number;                //年齢
  weight: number;             //体重
  win_rate: number;           //勝率
  win_rate2: number;          //2連対率
  training_term: number;      //養成期
  birth_place: string;        //出身地
  course_datas: CourseData[]; //コース別データ
}