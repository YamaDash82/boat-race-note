/**
 * ユーザー情報関連DTOの名前空間
 */
export namespace UserDto {
  /**
   * リクエスト
   */
  export namespace Request {
    /**
     * ユーザー情報登録DTO
     */
    export class AppendUser {
      key: string;
      password: string;
    }
  }
}