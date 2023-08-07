import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigurationModule } from './configuration/configuration.module';
import { DetaModule } from './deta/deta.module';

@Module({
  imports: [
    ConfigurationModule, 
    DetaModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
