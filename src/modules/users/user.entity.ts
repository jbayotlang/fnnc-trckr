import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Unique, OneToOne } from "typeorm";

import { UserAuthMethod } from './user.enums';
import { Profile } from './user_profile.entity';
import { Config } from './user_config.entity';


@Entity()
@Unique(['emailAddress', 'username'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  username: string;

  @Column({ nullable: true })
  emailAddress: string;

  @Column({ nullable: true })
  password: string;

  @Column({
    type: 'enum',
    enum: UserAuthMethod,
    default: UserAuthMethod.LOCAL,
  })
  authMethod: UserAuthMethod;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToOne((_type) => Profile, (profile) => profile.user, {
    nullable: false,
    cascade: true,
  })
  public profile: Profile;

  @OneToOne((_type) => Config, (config) => config.user, {
    nullable: false,
    cascade: true,
  })
  public config: Config;
}
