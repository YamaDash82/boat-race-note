# Memo  

## GitHubPackages使用方法  
`front-side/projects/main/.npmrc`ファイルを作成。
以下の内容を記述する。
```:.npmrc
//npm.pkg.github.com/:_authToken=<トークン>
@yamadash82:registry=https://npm.pkg.github.com/
```
## テスト実行方法  
`package.json`に`test`コマンドを定義してある。  
引数でテストするファイルを指定する場合、以下のように実行する。  
```bash
npm run test -- --include projects/main/src/app/auht/auth.service.spec.ts
```
