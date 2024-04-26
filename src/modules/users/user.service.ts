import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { RegisterUserDTO } from './user.dto';
import { User } from './user.entity';
import { Profile } from './user_profile.entity';

@Injectable()
export class UserService {
  public constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
  ) {}

  async register(createUserDto: RegisterUserDTO): Promise<void> {
    const { firstName, lastName, ...user } = createUserDto;

    const existingUser = await this.userRepository.findOne({
      where: { username: user.username }
    });
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    user.password = await bcrypt.hash(user.password, 10);
    const newUser = this.userRepository.create(user);

    const savedUser = await this.userRepository.save(newUser);
    const profile = await this.profileRepository.create({ firstName, lastName, user: savedUser });
    await this.profileRepository.save(profile);
  }

  async getProfile(userId: string): Promise<User> {
    return this.userRepository.findOne({
      where: { id: userId },
      relations: ["profile"],
    });
  }
}