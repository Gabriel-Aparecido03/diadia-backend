import { Weekday } from "@/domain/habits/enterprise/entities/weekday";
import { PrismaService } from "../prisma.service";
import { Injectable } from "@nestjs/common";
import { WeekdayRepository } from "@/domain/habits/application/repositories/weekday-repository";
import { PrismaWeekdayMapper } from "../mapper/prisma-weekday-mapper";

@Injectable()
export class PrismaWeekdayRepository implements WeekdayRepository {

  constructor(private prismaService: PrismaService) { }

  async create(weekday: Weekday): Promise<void> {
    const data = new PrismaWeekdayMapper().toPrisma(weekday)
    await this.prismaService.habitWeekDays.create({ data })
  }

  async update(weekday: Weekday): Promise<void> {
    const data = new PrismaWeekdayMapper().toPrisma(weekday)
    await this.prismaService.habitWeekDays.update({ data, where: { id: data.id } })
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.habitWeekDays.delete({ where: { id } })
  }

  async getById(id: string): Promise<Weekday> {
    const res = await this.prismaService.habitWeekDays.findUnique({ where: { id } })
    return new PrismaWeekdayMapper().toDomain(res)
  }

}