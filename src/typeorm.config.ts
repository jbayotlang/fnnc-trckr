import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService as EnvConfigService } from '@modules/config/config.service';


export const typeormConfig = (
  configService: EnvConfigService,
): TypeOrmModuleOptions => {
  const config = {
    type: 'postgres',
    database: configService.typeormConfig.name,
    host: configService.typeormConfig.host,
    port: configService.typeormConfig.port,
    username: configService.typeormConfig.user,
    password: configService.typeormConfig.password,
    synchronize: false,
    entities: [
      "src/modules/**/*.entity.{ts}"
    ],
    migrations: [
      "src/migrations/*.{ts}"
    ],
    cli: {
      "entitiesDir": "src/modules",
      "migrationsDir": "src/migrations"
    },
    autoLoadEntities: true,

  }

  return config as TypeOrmModuleOptions;
}


export const datasourceConfig = (
  configService: EnvConfigService,
): DataSource => new DataSource(typeormConfig(configService) as DataSourceOptions);