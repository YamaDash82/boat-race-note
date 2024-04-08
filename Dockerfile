FROM node:20.12.1

ENV LANG=C.UTF-8
ENV LANGUAGE=en_US:

RUN apt-get update && apt-get install nano && apt-get install git

# Space CLIのインストールと環境変数の設定
RUN curl -fsSL https://deta.space/assets/space-cli.sh | sh
ENV PATH $PATH:/root/.detaspace/bin
RUN echo $PATH

RUN mkdir /app
WORKDIR /app
