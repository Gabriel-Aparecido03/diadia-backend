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

describe('Toggle Goal - E2E', () => {
  let app: INestApplication;
  let userFactory: UserFactory
  let jwt: JwtService
  let prisma: PrismaService
  let goalFactory: GoalFactory
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

  test(`[PUT] /goal/:goalId/toogle`, async () => {
    const user = makeUser({
      email: 'johndoe@email.com',
      password: await hash('password', 8)
    })

    const goal = makeGoal({
      userId: user.id,
      createdAt: new Date(),
    })

    await userFactory.execute(user)
    await goalFactory.execute(goal)

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .put(`/goal/${goal.id}/toggle`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toEqual(204)
    const goalsOnDatabse = await prisma.goalDay.findMany({
      where: {
        goal_id: goal.id.toString()
      }
    })
    expect(goalsOnDatabse).toHaveLength(1)

    const responseToggle = await request(app.getHttpServer())
      .put(`/goal/${goal.id}/toggle`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(responseToggle.statusCode).toEqual(204)
    const goalsDeleteOnDatabse = await prisma.goalDay.findMany({
      where: {
        goal_id: goal.id.toString()
      }
    })
    expect(goalsDeleteOnDatabse).toHaveLength(0)
  })
})