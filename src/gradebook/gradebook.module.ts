import { Module } from '@nestjs/common';
import { GradebookController } from './gradebook.controller';
import { GradebookService } from './gradebook.service';
import { ResponseModule } from '../response/response.module';

@Module({
  imports: [ResponseModule],
  controllers: [GradebookController],
  providers: [GradebookService]
})
export class GradebookModule {}
