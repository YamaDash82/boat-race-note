# 開発作業記録  

## 残作業メモ  
- [x] 進入予想ダイアログ、スタート展示\/平均ST\/コース別平均STの別、mat-buttonの使用をやめる。
- [ ] スタートタイミング入力ダイアログ、入力値の表示が小さい。
- [ ] 展示タイム入力ダイアログ、入力値の表示が小さい。  
- [ ] 出走レーサー入力ダイアログ、画面サイズ要調整   
- [x] ~~ひょっとしたら機器ごとにデフォルトのcssを持っているのかな~~
- [x] レースインデックスについて  
    - [x] 日付入力。mat-form-fieldの使用をやめよう。datepickerは使用する。  
    - [x] レース場について、mat-buttonの使用をやめよう。
    - [x] レース番号について、mat-buttonの使用をやめよう。  
- [x] 登録時のエラー対応  
- [x] 進入予想で、クリア時の不具合 艇番もろともクリアされてしまう。  
- [x] 展開予想登録後、ロードするとキャッシュからロードされている!?いやそんなことはないと思う。しかし、リロードしないと変更登録した分が反映しない。
    【原因】
    apollo-angularのキャッシュ機能が原因だった。  
    [ApolloAngular公式](https://the-guild.dev/graphql/apollo-angular/docs/data/queries)  
    コード修正例
    修正前
    ```typescript
    this.apollo.watchQuery<{
      racePrediction: RacePredictionModel
    }>({
      query: GET_RACE_PREDICTION, 
      variables: { key: racePredictionKey }, 
    }).valueChanges.subscribe(res => {
      if (res.errors) return reject(res.errors[0]);

      return resolve(res.data.racePrediction);
    });
    ```
    修正後  
    ```typescript
    this.apollo.query<{
      racePrediction: RacePredictionModel
    }>({
      query: GET_RACE_PREDICTION, 
      variables: { key: racePredictionKey }, 
      fetchPolicy: 'no-cache'
    }).subscribe(res => {
      if (res.errors) return reject(res.errors[0]);

      return resolve(res.data.racePrediction);
    });
    ```
    ポイント  
    `fetchPolicy: 'no-cache'`の設定を追加。  
    直接は関係ないが、watchQueryメソッドから、queryメソッドの使用に変更。  
- [x] サインアップ画面への遷移  
- [x] 右上にアカウントボタンの表示  
- [x] スマホ、タブレットで動作時、ズームの禁止  
- [ ] 展開予想の保存時、ボートの画像のパスにドメインが含まれている？  
- [x] 未ログインでも、保存以外の操作ができるようにする。
- [x] レスポンシブデザイン対応  
    [参考記事](https://qiita.com/motokazu/items/295ce7310d56cd15e1b7)  
    ```css
    /* レスポンシブデザイン対応 */
    @media screen and (hover: hover){
      body {
        font-size: 16px;
      }
    }
    ```
### 展開予想  
- [x] 画面サイズ変更検知時、画面再変更が停止してから一定時間後にイベントを発火させる。  
- [x] 画面サイズ変更後、展開予想図が入力されていれば、再描画する。  
- [ ] 画面サイズ変更後の展開予想図の再描画処理について、画面サイズ変更後の位置で再描画する。
- [x] ボート配置メニュー 追加ボート選択後、キャンバスにボートを配置したら、追加ボートのハイライトをクリアする。  
- [x] 配置待ちボート選択ボタン 画像ボタンにできるか要調査。
- [x] 競争水面に配置するボート、三角形を配置しているが、画像にできるか要調査。
- [ ] 展開予想図を入力し、ほかのコンポーネントに移動。展開予想図に戻ってきたときのロード処理が2回行われる(キャンバスのサイズ変更検知時とページネーターの移動時イベント)。1回で済むようにしたい。2024/04/03
- [x] 展開予想の削除
- [x] スタートラインの描画位置 もう少し左に寄せる。
- [ ] スリットに描画したボートは選択、編集不可にする。
- [x] MatButton タブレットで描画するとサイズが大きい。サイズを指定するか、MatButtonの使用をやめるか。
- [x] フロントサイド更新があった場合自動更新するように
### 進入予想  
- [x] 進入予想の削除  
- [x] 進入するボートの画像を作成する。

### ダイアログ  
- [x] ダイアログの使用方法再確認