import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@/infra/app.module';
import { makeUser, UserFactory } from 'test/factories/make-user';
import { hash } from 'bcryptjs';
import { DatabaseModule } from '@/infra/database/database.module';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

describe('Create Habit - E2E', () => {
  let app: INestApplication;
  let userFactory: UserFactory
  let jwt: JwtService
  let prisma: PrismaService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory]
    }).compile()
    app = moduleRef.createNestApplication();
    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)
    await app.init();
  });

  test(`[POST] /habit`, async () => {
    const user = makeUser({
      email: 'johndoe@email.com',
      password: await hash('password', 8)
    })

    await userFactory.execute(user)
    const accessToken = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .post('/habit')
      .send({
        day: new Date(),
        description: 'new-description',
        name: 'new-name',
        weekday: [{
          datetime : new Date(),
          weekday : 0
        }]
      })
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toEqual(201)
    const habitsOnDatabse = await prisma.habit.findMany({
      where : {
        user_id : user.id.toString()
      }
    })

    expect(habitsOnDatabse).toHaveLength(1)
  })
})