import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@/infra/app.module';
import { makeUser, UserFactory } from 'test/factories/make-user';
import { hash } from 'bcryptjs';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

describe('Register User - E2E', () => {
  let app: INestApplication;
  let userFactory: UserFactory
  let prisma: PrismaService
  let jwt: JwtService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, PrismaService]
    }).compile()
    app = moduleRef.createNestApplication();
    userFactory = moduleRef.get(UserFactory)
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    await app.init();
  });

  test(`[PUT] /session/register`, async () => {

    const user = makeUser({
      email: 'johndoe@email.com',
      password: await hash('password', 8)
    })

    await userFactory.execute(user)
    const accessToken = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .put('/user')
      .send({
        email: 'johndoenew@email.com',
        password: 'password',
        name: 'johndoe-new'
      })
      .set('Authorization', `Bearer ${accessToken}`)

    const res = await prisma.user.findUnique({ where: { id: user.id.toString() } })
    expect(response.statusCode).toEqual(204)
    expect(res.name).toEqual('johndoe-new')
  })
})