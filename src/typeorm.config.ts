import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as path from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService as EnvConfigService } from '@modules/config/config.service';

export const typeormConfig = (
  configService: EnvConfigService,
): TypeOrmModuleOptions => {
  const entitiesDir = path.resolve(__dirname, 'modules', '**', '**.entity.{ts,js}')
  const migrationsDir = path.resolve(__dirname, 'migrations', '*.{ts,js}')

  const config = {
    type: 'postgres',
    database: configService.typeormConfig.name,
    host: configService.typeormConfig.host,
    port: configService.typeormConfig.port,
    username: configService.typeormConfig.user,
    password: configService.typeormConfig.password,
    synchronize: false,
    entities: [entitiesDir],
    migrations: [migrationsDir],
  }

  return config as TypeOrmModuleOptions;
}


export const datasourceConfig = (
  configService: EnvConfigService,
): DataSource => new DataSource(typeormConfig(configService) as DataSourceOptions);