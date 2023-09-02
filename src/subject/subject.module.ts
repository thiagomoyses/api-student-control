import { Module } from '@nestjs/common';
import { SubjectController } from './subject.controller';
import { SubjectService } from './subject.service';
import { ResponseModule } from '../response/response.module';

@Module({
  imports: [ResponseModule],
  controllers: [SubjectController],
  providers: [SubjectService]
})
export class SubjectModule {}
