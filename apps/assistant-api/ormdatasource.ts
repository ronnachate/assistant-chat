import { DataSource, DataSourceOptions } from 'typeorm';
import typeOrmConfig from './src/config/ormconfig';

const datasource = new DataSource(typeOrmConfig as DataSourceOptions);

export default datasource;
