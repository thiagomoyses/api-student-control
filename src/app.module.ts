import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { StudentsModule } from './students/students.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [AuthModule, UserModule, StudentsModule, PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}