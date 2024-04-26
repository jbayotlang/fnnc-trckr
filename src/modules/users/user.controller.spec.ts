import { INestApplication, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as request from 'supertest';

import { CustomValidationPipe } from '@lib/validation.pipe';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './user.entity';
import { Profile } from './user_profile.entity';


describe('UserController (e2e)', () => {
  let app: INestApplication;
  let userService: UserService;
  let userRepo: Repository<User>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Profile),
          useClass: Repository,
        }
      ],
    })
      .overridePipe(CustomValidationPipe)
      .useValue(new CustomValidationPipe())
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new CustomValidationPipe());
    userService = moduleFixture.get(UserService)
    userRepo = moduleFixture.get(getRepositoryToken(User))
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /users/register', () => {
    it('should return 204 when registration is successful', async () => {
      // Move to factories
      const newUserDto = {
        username: 'test.user',
        emailAddress: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User'
      };

      jest.spyOn(userService, 'register')
        .mockImplementation(async () => Promise.resolve())
      await request(app.getHttpServer())
        .post('/users/register')
        .send(newUserDto)
        .expect(HttpStatus.NO_CONTENT);
    });

    it ('should throw an exception if username already exists', async () => {
      const newUserDto = {
        username: 'test.user',
        emailAddress: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User'
      };

      jest.spyOn(userRepo, 'findOne').mockReturnValue(new Promise((resolve) => resolve(new User())))
      await request(app.getHttpServer())
        .post('/users/register')
        .send(newUserDto)
        .expect(HttpStatus.CONFLICT);
    });

    it('should throw BadRequestException if data is invalid', async () => {
      const newUserDto = {
        username: '', // Invalid username
        emailAddress: 'not-an-email', // Invalid email
        password: '123', // Weak password
        firstName: '', // Missing first name
        lastName: '' // Missing last name
      };

      // await request(app.getHttpServer())
      await request(app.getHttpServer())
        .post('/users/register')
        .send(newUserDto)
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: HttpStatus.BAD_REQUEST,
          error: 'Bad Request',
          errors: {
            username: ['username should not be empty'],
            emailAddress: ['emailAddress must be an email'],
            firstName: ['firstName should not be empty'],
            lastName: ['lastName should not be empty'],
          }
        });
    });
  });
});
