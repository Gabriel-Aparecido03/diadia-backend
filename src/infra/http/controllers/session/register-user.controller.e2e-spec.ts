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
  let userFactory : UserFactory
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports : [AppModule,DatabaseModule],
      providers : [UserFactory,PrismaService]
    }).compile()
    app = moduleRef.createNestApplication();
    userFactory = moduleRef.get(UserFactory)
    prisma = moduleRef.get(PrismaService)
    await app.init();
  });

  test(`[POST] /session/register`, async () => {
    const response = await request(app.getHttpServer()).post('/user').send({
      email : 'johndoe@email.com',
      password : 'password',
      name : 'johndoe'
    })
    const res = await prisma.user.findMany({})
    expect(response.statusCode).toEqual(200)
    expect(res).toHaveLength(1)
    expect(res[0]).toEqual(expect.objectContaining({
      email : 'johndoe@email.com',
      name : 'johndoe'
    }))
  })
})