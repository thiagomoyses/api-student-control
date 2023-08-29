import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { StudentModule } from './student/student.module';
import { JsonMiddleware } from './middlewares';

@Module({
  imports: [AuthModule, UserModule, PrismaModule, ConfigModule.forRoot({ isGlobal: true }), StudentModule],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JsonMiddleware)
      .forRoutes('*')
  }
}