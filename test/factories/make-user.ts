import { UniqueEntityID } from "@/domain/core/unique-entity-id"
import { UserProps, User } from "@/domain/habits/enterprise/entities/user"
import { PrismaUserMapper } from "@/infra/database/prisma/mapper/prisma-user-mapper"
import { PrismaService } from "@/infra/database/prisma/prisma.service"
import { faker } from "@faker-js/faker"
import { Injectable } from "@nestjs/common"

export function makeUser(
  override: Partial<UserProps> = {},
  id?: UniqueEntityID,
) {
  const user = User.create(
    {
      email: faker.internet.email(),
      name: faker.lorem.text(),
      password: faker.internet.password(),
      ...override,
    },
    id,
  )

  return user
}

@Injectable()
export class UserFactory{
  constructor(private prismaService : PrismaService) {}

  async execute(data : User) {
    await this.prismaService.user.create({
      data : new PrismaUserMapper().toPrisma(data)
    })
  }
}