import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@/infra/app.module';
import { makeUser, UserFactory } from 'test/factories/make-user';
import { hash } from 'bcryptjs';
import { DatabaseModule } from '@/infra/database/database.module';

describe('Authenticate User - E2E', () => {
  let app: INestApplication;
  let userFactory : UserFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports : [AppModule,DatabaseModule],
      providers : [UserFactory]
    }).compile()
    app = moduleRef.createNestApplication();
    userFactory = moduleRef.get(UserFactory)
    await app.init();
  });

  test(`[POST] /session/authenticate`, async () => {
    const data = makeUser({
      email : 'johndoe@email.com',
      password : await hash('password',8)
    })

    await userFactory.execute(data)
    const response = await request(app.getHttpServer()).post('/session/authenticate').send({
      email : 'johndoe@email.com',
      password : 'password'
    })

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      access_token : expect.any(String)
    })
  })
})