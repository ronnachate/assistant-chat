import { Module } from '@nestjs/common';
import {ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeqLoggerModule } from '@jasonsoft/nestjs-seq';

import { configModuleOptions } from '../config/module.config';
import { SERVICE_NAME } from '../constant/generic';
import { AssistantModule } from '../assistant/assistant.module';

console.log(__dirname + './../../migrations/');

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
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        database: configService.get<string>('database.database'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        autoLoadEntities: true,
        migrationsRun: true,
        synchronize: false,
      }),
    }),
    AssistantModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}


