# Memo  

## テスト実行方法  
`package.json`に`test`コマンドを定義してある。  
引数でテストするファイルを指定する場合、以下のように実行する。  
```bash
npm run test -- --include projects/main/src/app/auht/auth.service.spec.ts
```
