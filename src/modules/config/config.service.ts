import { Injectable } from '@nestjs/common';
import { ConfigSchema, ConfigSchemaType } from './config.schema'

@Injectable()
export class ConfigService {
  private config: ConfigSchemaType;

  public constructor() {
    if (!ConfigSchema.validateSync(process.env)) {
      throw new Error('ConfigService is invalid');
    }

    this.config = ConfigSchema.cast(process.env)
  }

  public get appConfig() {
    return {
      port: this.config.APP_PORT,
      hostname: this.config.APP_HOSTNAME || null,
    }
  }

  public get jwtConfig() {
    return {
      secret: this.config.JWT_SECRET,
    }
  }
  public get typeormConfig() {
    return {
      name: this.config.DB_NAME,
      host: this.config.DB_HOST,
      port: this.config.DB_PORT,
      user: this.config.DB_USER,
      password: this.config.DB_PASSWORD,
    }
  }
}