import { INestApplication, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as request from 'supertest';

import { User } from '@modules/users/user.entity';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { LocalStrategy } from '@modules/auth/local.strategy';
import { JwtStrategy } from '@modules/auth/jwt.strategy';
import { ConfigService } from '@modules/config/config.service';
import { AuthModule } from '@modules/auth/auth.module';



describe('UserController (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;
  let userRepo: Repository<User>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'test'
        }),
      ],
      controllers: [AuthController],
      providers: [
        AuthService,
        ConfigService,
        JwtService,
        LocalStrategy,
        JwtStrategy,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },

      ],
    })
      .overrideProvider(ConfigService)
      .useValue({
        jwtConfig: {
          secret: 'test',
        }
      })
      .compile();

    app = moduleFixture.createNestApplication();
    authService = moduleFixture.get(AuthService)
    userRepo = moduleFixture.get(getRepositoryToken(User))
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /auth', () => {
    it.skip('should return an access token for a successful login', async () => {
      // Move to factories
      const newUserDto = {
        identifier: 'test.auth',
        password: 'password',
      };

      jest.spyOn(authService, 'validateUser')
        .mockReturnValue(new Promise((resolve) => resolve(new User())))
      await request(app.getHttpServer())
        .post('/auth')
        .send(newUserDto)
        .expect(HttpStatus.NO_CONTENT);
    });

    it('should throw BadRequestException if data is invalid', async () => {
      const loginDto = {
        identifier: '', // Invalid username
        password: '', // Invalid email
      };

      await request(app.getHttpServer())
        .post('/auth')
        .send(loginDto)
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: HttpStatus.BAD_REQUEST,
          error: 'Bad Request',
          errors: {
            identifier: [ 'identifier should not be empty' ],
            password: [ 'password should not be empty' ]
          }
        });
    });
  });
});
