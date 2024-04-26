import { Module } from '@nestjs/common';
import { TypeOrmModule} from '@nestjs/typeorm';

import { User } from './user.entity';
import { UserService } from './user.service';
import { Profile } from './user_profile.entity';
import { Config } from './user_config.entity';
import { UserController } from './user.controller';


@Module({
  imports: [TypeOrmModule.forFeature([User, Profile, Config])],
  providers: [UserService],
  controllers: [UserController]
})
export class UserModule {}
