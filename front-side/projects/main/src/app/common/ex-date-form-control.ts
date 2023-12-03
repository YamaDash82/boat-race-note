import { FormControl } from '@angular/forms'
import { ExDate } from '@yamadash82/yamadash-ex-primitive';

/**
 * 日付FormControl
 */
export class ExDateFormControl extends FormControl<string | ExDate | null> {
  private _date: ExDate | null = null;

  /**
   * 日付文字列取得処理
   */
  get dateStrValue(): string | null {
    if (!this._date) return null;

    return this._date.getYYYYMMDD();
  }

  /**
   * ExDateオブジェクト
   */
  get date(): ExDate | null {
    return this._date;
  }
  
  override setValue(value: any, option?: object) {
    //dateプロパティへの代入処理
    if (value) {
      if (value instanceof ExDate) {
        this._date = value;
      } else {
        const settingDate = new ExDate(value);

        if (Number.isNaN(settingDate.getTime())) throw new Error(`代入値:${value}は日付として認識できません。`);

        this._date = settingDate;
      }
    } else {
      this._date = null;
    }

    super.setValue(value, option);
  }
}