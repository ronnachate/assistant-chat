import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SeqLoggerModule } from '@jasonsoft/nestjs-seq';

import { configModuleOptions } from '../config/module.config';
import { SERVICE_NAME } from '../constant/generic';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageModule } from '../message/message.module';

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
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('mongo.uri'),
      }),
    }),
    MessageModule,

  ],
  exports: [SeqLoggerModule, ConfigModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
