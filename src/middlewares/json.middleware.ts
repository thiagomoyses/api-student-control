import { Injectable, NestMiddleware, HttpStatus, BadRequestException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class JsonMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {

    if (req.method !== 'GET') {
      const contentType = req.get('Content-Type');
      if (contentType !== 'application/json') {
        return this.sendErrorResponse(res, HttpStatus.BAD_REQUEST, 'Invalid Content-Type. Only application/json is allowed.');
      }
    }

    next();
  }

  private sendErrorResponse(res: Response, statusCode: HttpStatus, message: string) {
    res.status(statusCode).json({
      message: message,
      statusCode: statusCode,
    });
  }
}
