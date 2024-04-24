export const getBoatColorClass = (boatNo: number): any => {
  return {
    "boat-color1": boatNo === 1,
    "boat-color2": boatNo === 2, 
    "boat-color3": boatNo === 3,
    "boat-color4": boatNo === 4,
    "boat-color5": boatNo === 5,
    "boat-color6": boatNo === 6
  }
}

export interface BoatColor {
  boatNo: number;
  backgroundColor: string;
  fontColor: string;
}

export const BoatColors = Object.freeze([
  //1号艇
  {
    boatNo: 1,
    backgroundColor: '#eeeeee',
    fontColor: '#111111'
  },
  //2号艇
  {
    boatNo: 2,
    backgroundColor: '#111111',
    fontColor: '#ffffff'
  },
  //3号艇
  {
    boatNo: 3,
    backgroundColor: '#d90000',
    fontColor: '#ffffff'
  },
  //4号艇
  {
    boatNo: 4,
    backgroundColor: '#2d5cff',
    fontColor: '#ffffff'
  },
  //5号艇
  {
    boatNo: 5,
    backgroundColor: '#ffdc00',
    fontColor: '#111111'
  },
  //6号艇
  {
    boatNo: 6,
    backgroundColor: '#2db200',
    fontColor: '#ffffff'
  }
]) as BoatColor[];

export class StartTiming {
  //フライング時、負の値を設定する。例)スタートタイミングがF.02の時、-0.02がセットされる。
  private _st: number | null = null;
  //フライングフラグ。フライング時trueをセットする。
  private _isFlying: boolean = false;

  /**
   * スタートタイミング
   */
  constructor();
  /**
   * スタートタイミング
   * @param stNumber 小数点以下2桁の数値を指定する。
   */
  constructor(stNumber: number);
  constructor(stNumber?: number) { 
    if (typeof stNumber === "number") {
      //桁数チェック
      if (Math.floor(Math.abs(stNumber * 100)).toString().length > 2) throw new Error(`stNumberには小数点以下2桁の数値で入力してください。`);
      
      //負の値の時フライングフラグをtrueにする。
      this._isFlying = stNumber < 0;

      this._st = stNumber;
    }
  }

  /**
   * スタートタイミング設定処理
   * @param st ※フライングは負の値でセットする。小数点以下2桁の値でセットする。 F.02のとき-0.02をセットする。
   */
  setSt(st: number): void;
  /**
   * スタートタイミング設定処理
   * @param st スタートタイミングの絶対値をセットする。 必ず2桁の数値である。
   * @param isFlying フライング時trueをセットする。
   */
  setSt(st: number, isFlying: boolean): void;
  setSt(st: number, isFlying?: boolean) {
    if (typeof isFlying === "boolean") {
      //第二引数が指定されたときの処理を行う。
      //エラーチェック isFlyingが指定されているとき、stの値は必ず姓の値である。負の値が渡されたとき例外をスローする。
      if (st < 0) throw new Error(`引数isFlyingを指定する場合、引数stに負の値は指定できません。`);

      //桁数チェック isFlyingが指定されている場合、stは小数点を含まない2桁の整数である。
      if (Math.floor(Math.abs(st * 100)).toString().length > 2) throw new Error(`桁数を超過しています。2桁までの整数をセットしてください。`);

      this._isFlying = isFlying;

      //フライング時負の値がセットされるようにする。
      this._st = st * (this._isFlying ? -1 : 1) / 100;
    } else {
      //第二引数が指定されなかったときの処理を行う。
      //引数で指定された値をそのままセットする。
      this._st = st;
    }
  }

  /**
   * スタートタイミングクリア処理
   */
  clearSt():void {
    this._st = null;
    this._isFlying = false;
  }

  /**
   * スタートタイミング表示値
   * ".15"、"F.02"等の値を返す。
   */
  get displayValue(): string {
    //stが未入力の場合空文字を返す。
    if (this._st === null) return '';

    //表示値を整えていく。
    let stDispValue = '';
    //フライング時、接頭にFを表記する。
    if (this._isFlying) stDispValue += "F";
    //スタートタイミングの絶対値を末尾に追加する。
    const strSt = `00${Math.floor(Math.abs(this._st * 100))}`.slice(-2);
    stDispValue += `.${strSt}`;

    return stDispValue;
  }

  get stNumber(): number | null {
    return this._st;
  }
}