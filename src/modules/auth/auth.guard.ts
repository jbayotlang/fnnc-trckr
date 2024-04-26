import { Injectable, ExecutionContext, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { LoginDTO } from '@modules/auth/auth.dto';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}


@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const body = plainToInstance(LoginDTO, request.body);
    const errors = await validate(body);

    if (errors.length) {
      const errorMessages = {};
      errors.forEach((error) => {
        errorMessages[error.property] = Object.values(error.constraints);
      });

      response.status(HttpStatus.BAD_REQUEST).send({
        errors: errorMessages,
        error: 'Bad Request',
        statusCode: 400,
      })
    }
    return super.canActivate(context) as boolean
  }
}