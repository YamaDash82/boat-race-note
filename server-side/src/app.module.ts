import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
//import { ConfigurationModule } from './configuration/configuration.module';
import { DetaModule } from './deta/deta.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { RacersModule } from './racers/racers.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { RacePredictionsModule } from './race-predictions/race-predictions.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver, 
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'), 
    }), 
    ConfigModule.forRoot(), 
    DetaModule, 
    RacersModule, 
    AuthModule, 
    UsersModule, RacePredictionsModule, 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
