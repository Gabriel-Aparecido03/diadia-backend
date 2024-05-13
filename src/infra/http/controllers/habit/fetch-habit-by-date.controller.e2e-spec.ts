import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@/infra/app.module';
import { makeUser, UserFactory } from 'test/factories/make-user';
import { hash } from 'bcryptjs';
import { DatabaseModule } from '@/infra/database/database.module';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { HabitFactory, makeHabit } from 'test/factories/make-habit';
import { Weekday } from '@/domain/habits/enterprise/entities/weekday';
import { WeekdayList } from '@/domain/habits/enterprise/entities/weekday-list';

describe('Fetch stats by month habit - E2E', () => {
  let app: INestApplication;
  let userFactory: UserFactory
  let habitFactory: HabitFactory
  let jwt: JwtService
  let prisma: PrismaService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, HabitFactory]
    }).compile()
    app = moduleRef.createNestApplication();
    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)
    habitFactory = moduleRef.get(HabitFactory)
    await app.init();
  });

  test(`[GET] /habits/stats-by-month`, async () => {
    const date = new Date()
    const user = makeUser({
      email: 'johndoe@email.com',
      password: await hash('password', 8)
    })
    await userFactory.execute(user)

    const habit1 = makeHabit({
      userId: user.id,
      createdAt: date,
    })

    const weekday1 = Weekday.create({ datetime: date, habitId: habit1.id, weekday: 0 })

    const weekdayList1 = new WeekdayList([weekday1])
    habit1.weekdays = weekdayList1

    await habitFactory.execute(habit1)
    const accessToken = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .get(`/habits/by-date?date=${date}`)
      .send({
        date
      })
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.status).toEqual(200)
  })
})