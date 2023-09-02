import { Test } from '@nestjs/testing'
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto } from '../src/auth/dto';
import * as pactum from 'pactum';
import { ParentDto } from '../src/parent/dto';
import { StudentDto } from '../src/student/dto';
import { SubjectDto } from 'src/subject/dto';

describe('# App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let parentId: any;
  let studentRefCode: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true
    }));

    prisma = app.get(PrismaService);
    await prisma.cleanDatabase();

    pactum.request.setBaseUrl('http://localhost:3333');

    await app.init();
    await app.listen(3333);
  });

  afterAll(() => {
    app.close();
  });

  describe('## AUTH', () => {
    const dto: AuthDto = {
      firstName: "test",
      lastName: "user",
      email: "teste@teste.com",
      password: "123"
    }

    it('### POST [/auth/signup] - Should create a new User!', () => {
      const postReq = pactum
        .spec()
        .post('/auth/signup')
        .withBody(dto)
        .expectStatus(201)

      return postReq;
    });

    it('### POST [/auth/signin] - Should login!', () => {
      const postReq = pactum
        .spec()
        .post('/auth/signin')
        .withBody({
          email: dto.email,
          password: dto.password
        })
        .expectStatus(200)
        .stores('userToken', 'data.access_token')

      return postReq;
    });
  });

  describe('## PARENT', () => {
    const dto: ParentDto = {
      firstName: "Parent",
      lastName: "test",
      email: "parent@test.com",
      phone: "91128014",
      student: []
    }

    it('### POST [/parent/store] - Should create a new parent', () => {
      const postReq = pactum
        .spec()
        .post('/parent/store')
        .withHeaders({
          Authorization: 'Bearer $S{userToken}'
        })
        .withBody(dto)
        .expectStatus(201)
        .stores('parentId', 'data.id');

      parentId = '$S{parentId}';

      return postReq;
    });

    it('### GET [/parent/all] - Should get all parents.', () => {
      const postReq = pactum
        .spec()
        .get('/parent/all')
        .withHeaders({
          Authorization: 'Bearer $S{userToken}'
        })
        .expectStatus(200)

      return postReq;
    })
  });

  describe('## STUDENT', () => {
    it('### POST [/student/store] - Should create a new student', () => {

      const dto: StudentDto = {
        firstName: "Student",
        lastName: "test",
        email: "student@teste.com",
        phone: "1235648485",
        parent_id: parentId
      }

      const postReq = pactum
        .spec()
        .post('/student/store')
        .withHeaders({
          Authorization: 'Bearer $S{userToken}'
        })
        .withBody(dto)
        .stores("studentRefCode", "data.studentRefCode")
        .expectStatus(201)

      studentRefCode = "$S{studentRefCode}";

      return postReq;

    });
  })

  describe('## SUBJECT', () => {
    it("POST [/subject/store] - Should create a new subject", () => {
        const dto: SubjectDto = {
          name: "Matematica"
        }

        const postReq = pactum
          .spec()
          .post('/subject/store')
          .withHeaders({
            Authorization: 'Bearer $S{userToken}'
          })
          .withBody(dto)
          .stores("subjectId", "data.id")
          .expectStatus(201)

        return postReq;
    });

    it("POST [/subject/all] - Should get all subjects", () => {
      const getReq = pactum
        .spec()
        .get('/subject/all')
        .withHeaders({
          Authorization: 'Bearer $S{userToken}'
        })
        .expectStatus(200)

      return getReq;
    });
  });

  describe('## GRADEBOOK', () => {

    it("POST [/gradebook/store/studentRefCode] - Should create a new grade", () => {
      let url = "/gradebook/store/" + studentRefCode;
      
      const postGrade = pactum
      .spec()
      .post(url)
      .withHeaders({
        Authorization: 'Bearer $S{userToken}'
      })
      .withBody({
        subject_id: '$S{subjectId}',
        grade: 9.5
      })
      .expectStatus(201)

      return postGrade;
    });

    it("GET [/gradebook/all] - Should return all grades", () => {
      const getGrades = pactum
        .spec()
        .get('/gradebook/all')
        .withHeaders({
          Authorization: 'Bearer $S{userToken}'
        })
        .expectStatus(200)

        return getGrades;
    });
  });
})