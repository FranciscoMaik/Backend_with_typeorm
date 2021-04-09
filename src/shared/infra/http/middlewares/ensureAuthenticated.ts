import { id } from 'date-fns/esm/locale';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import AppError from '../../errors/AppError';
import authConfig from '../../../config/auth';

interface Tokenpayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  // validação do token
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('JWT token is missing', 401);
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = verify(token, authConfig.jwt.secret);

    const { sub } = decoded as Tokenpayload;

    request.user = {
      id: sub,
    };

    console.log(decoded);

    return next();
  } catch (error) {
    throw new AppError('Invalid JWT token', 401);
  }
}
