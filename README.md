# BoatRacePredictionプロジェクト  

## 開発環境構築メモ  
### 前提条件  
- Dockerがインストール済である  
- Detaのアカウントを取得済の状態である  
### 手順  
- 当リポジトリよりクローン  
- Dockerイメージを作成   
    カレントディレクトリがクローンしたディレクトリの状態であるとする。
    当例では`deta:node20.12.1`というタグ名でDockerイメージを作成している。  
    ```bash
    docker build -t deta:node20.12.1 .
    ```
- Detaにログイン  
    ```bash
    # detaと連結するのはserver-sideディレクトリであるためディレクトリを移動する。  
    cd server-side

    # Detaにログインする。トークンを聞かれるので入力する。  
    space login
    ```
- 環境変数ファイル`.env`を設定する   
    server-sideディレクトリに`.env`というファイルを作成し、環境変数を設定する。  
    `server-side/.env`の内容は以下  
    ```:.env
    JWT_SECRET=<認証時の暗号化キー>            # 例 abc123
    DETA_PROJECT_KEY=<Detaのプロジェクトキー>  
    DEV_MODE=1                              # 開発モードであることを指定
    ```
