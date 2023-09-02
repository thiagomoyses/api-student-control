import { Module } from '@nestjs/common';
import { GradebookController } from './gradebook.controller';
import { GradebookService } from './gradebook.service';
import { ResponseService } from '../response/response.service';

@Module({
  imports: [ResponseService],
  controllers: [GradebookController],
  providers: [GradebookService]
})
export class GradebookModule {}
