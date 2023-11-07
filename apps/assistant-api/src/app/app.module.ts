import { Module } from '@nestjs/common';
import {ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SeqLoggerModule } from '@jasonsoft/nestjs-seq';

import { configModuleOptions } from '../config/module.config';
import { SERVICE_NAME } from '../constant/generic';

@Module({
  imports: [
    ConfigModule.forRoot(configModuleOptions),
    SeqLoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        serviceName: SERVICE_NAME,
        serverUrl: configService.get<string>('seq.serverUrl'),
        apiKey: configService.get<string>('seq.apiKey'),
      }),
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
