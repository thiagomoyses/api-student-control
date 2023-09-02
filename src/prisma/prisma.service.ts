import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
    constructor(config: ConfigService) {
        super({
            datasources: {
                db: {
                    url: config.get('DATABASE_URL')
                }
            }
        });
    }

    cleanDatabase() {
        return this.$transaction([
            this.gradeBook.deleteMany(),
            this.student.deleteMany(),
            this.subject.deleteMany(),
            this.parent.deleteMany(),
            this.user.deleteMany()
        ]);
    }
}