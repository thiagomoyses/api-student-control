import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { StudentModule } from './student/student.module';
import { JsonMiddleware } from './middlewares';
import { ParentModule } from './parent/parent.module';
import { SubjectModule } from './subject/subject.module';
import { ResponseModule } from './response/response.module';
import { GradebookModule } from './gradebook/gradebook.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    StudentModule,
    ParentModule,
    SubjectModule,
    ResponseModule.forRoot(),
    GradebookModule
  ],
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