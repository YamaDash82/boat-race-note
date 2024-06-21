import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigurationModule } from './configuration/configuration.module';
import { DetaModule } from './deta/deta.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { RacersModule } from './racers/racers.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { RacePredictionsModule } from './race-predictions/race-predictions.module';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver, 
      //autoSchemaFile: join(process.cwd(), 'src/schema.gql'), //detaにデプロイする場合、デプロイ先でファイル出力できない？下の記述を用いる。インメモリにGraphQLスキーマを持つ。
      autoSchemaFile: (() => {
        //開発環境時、schema.gqlを出力するように、実行環境時、スキーマをメモリに持つように(autoSchemaFileにtrueを格納するように)する。
        const devMode = (process.env.DEV_MODE || "") === "1";
        return devMode ? join(process.cwd(), 'src/schema.gql') : true;
      })()
    }), 
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../app'),
    }),
    ConfigModule.forRoot(), 
    ConfigurationModule, 
    DetaModule, 
    RacersModule, 
    AuthModule, 
    UsersModule, 
    RacePredictionsModule, 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
