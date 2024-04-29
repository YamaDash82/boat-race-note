/**
 * ダイアログ押下ボタン
 */
export const DIALOG_ACTION = {
  Decision: 1, //決定
  Clear: 2,    //クリア
  Cancel: 3    //キャンセル
} as const;
export type DialogAction = typeof DIALOG_ACTION[keyof typeof DIALOG_ACTION];

/**
 * ダイアログ結果
 */
export interface DialogResult<T> {
  dialogAction: DialogAction;
  value?: T;
}