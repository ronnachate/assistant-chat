import * as dotenv from 'dotenv';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') })

const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  entities: [__dirname + './../**/entities/*.entity{.ts,.js}'],
  migrations: [__dirname + './../../migrations/*{.ts,.js}'],
  migrationsRun: true,
  synchronize: false,
};

export default typeOrmConfig;
