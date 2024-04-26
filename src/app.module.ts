import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigService } from '@modules/config/config.service';

// Modules
import { ConfigModule } from '@modules/config/config.module';
import { UserModule } from '@modules/users/user.module';
import { AuthModule } from '@modules/auth/auth.module';

import { typeormConfig } from './typeorm.config'

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: typeormConfig,
      imports: [],
    }),
    AuthModule,
    UserModule,
  ]
})
export class AppModule {}