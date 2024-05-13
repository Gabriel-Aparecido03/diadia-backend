import { UserRepository } from "@/domain/habits/application/repositories/user-repository";
import { User } from "@/domain/habits/enterprise/entities/user";
import { PrismaService } from "../prisma.service";
import { Injectable } from "@nestjs/common";
import { PrismaUserMapper } from "../mapper/prisma-user-mapper";

@Injectable()
export class PrismaUserRepository implements UserRepository {

  constructor(private prismaService: PrismaService) { }

  async create(user: User): Promise<void> {
    const data = new PrismaUserMapper().toPrisma(user)
    await this.prismaService.user.create({ data })
  }

  async update(user: User): Promise<void> {
    const data = new PrismaUserMapper().toPrisma(user)
    await this.prismaService.user.update({ data, where: { id: data.id } })
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.user.delete({ where: { id } })
  }

  async getEmail(email: string): Promise<User> {
    const res = await this.prismaService.user.findFirst({ where : { email }})
    if(!res) return null
    return new PrismaUserMapper().toDomain(res)
  }

  async getById(id: string): Promise<User> {
    const res = await this.prismaService.user.findFirst({ where : { id }})
    if(!res) return null
    return new PrismaUserMapper().toDomain(res)
  }


}