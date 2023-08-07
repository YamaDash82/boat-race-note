import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigurationModule } from './configuration/configuration.module';
import { DetaModule } from './deta/deta.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { RacersModule } from './racers/racers.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver, 
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'), 
    }), 
    ConfigurationModule, 
    DetaModule, RacersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
