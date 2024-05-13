import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@/infra/app.module';
import { makeUser, UserFactory } from 'test/factories/make-user';
import { hash } from 'bcryptjs';
import { DatabaseModule } from '@/infra/database/database.module';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { GoalFactory, makeGoal } from 'test/factories/make-goal';

describe('Fetch stats by month goal - E2E', () => {
  let app: INestApplication;
  let userFactory: UserFactory
  let goalFactory: GoalFactory
  let jwt: JwtService
  let prisma: PrismaService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, GoalFactory]
    }).compile()
    app = moduleRef.createNestApplication();
    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)
    goalFactory = moduleRef.get(GoalFactory)
    await app.init();
  });

  test(`[GET] /goal/:goalId`, async () => {
    const user = makeUser({
      email: 'johndoe@email.com',
      password: await hash('password', 8)
    })
    await userFactory.execute(user)

    const goal1 = makeGoal({
      userId: user.id,
      createdAt: new Date(new Date().toISOString()),
    })

    const goal2 = makeGoal({
      userId: user.id,
      createdAt: new Date(new Date().toISOString()),
    })

    await goalFactory.execute(goal1)
    await goalFactory.execute(goal2)
    const accessToken = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .get(`/goal/${goal1.id.toString()}`)
      .send({
        date: new Date()
      })
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.status).toEqual(200)
  })
})