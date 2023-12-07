/**
 * レース予想情報データ転送関連の名前空間
 */
export namespace RacePredictionDto {
  /**
   * 応答
   */
  export namespace Response {
    /**
     * 登録APIのレスポンスの型
     */
    export interface Save {
      /**
       * キー
       */
      key: string;

      /**
       * 最終更新日時
       */
      lastModifiedAt: number;
    }
  }
}