import { DayRepository } from "@/domain/habits/application/repositories/day-repository";
import { Day } from "@/domain/habits/enterprise/entities/day";
import { PrismaService } from "../prisma.service";
import { Injectable } from "@nestjs/common";
import { PrismaDayMapper } from "../mapper/prisma-day-mapper";

@Injectable()
export class PrismaDayRepository implements DayRepository {

  constructor(private prismaService: PrismaService) { }


  async create(day: Day): Promise<void> {
    const data = new PrismaDayMapper().toPrisma(day)
    await this.prismaService.day.create({ data })
  }

  async getByDate(date: Date): Promise<Day> {
    const formattedDate = new Date(date)
    const res = await this.prismaService.day.findUnique({ where: { date: formattedDate } })
    if (!res) return null
    return new PrismaDayMapper().toDomain(res)
  }

  async getById(id: string): Promise<Day> {
    const res = await this.prismaService.day.findUnique({ where: { id } })
    if (!res) return null
    return new PrismaDayMapper().toDomain(res)
  }

  async update(day: Day): Promise<void> {
    const data = new PrismaDayMapper().toPrisma(day)
    await this.prismaService.day.update({ data: data, where: { id: data.id } })
  }

  async getByHabitAlreadyDone({ date, habitId }: { habitId: string; date: Date; }): Promise<Boolean> {

    const day = await this.prismaService.day.findUnique({ where: { date } })
    if (!day) return false

    const res = await this.prismaService.habitDay.findFirst({
      where: {
        habit_id: habitId,
        day_id: day.id
      }
    })

    if (!res) return false
    return true
  }

  async getByGoalAlreadyDone({ date, goalId }: { goalId: string; date: Date; }): Promise<Boolean> {
    const day = await this.prismaService.day.findUnique({ where: { date } })
    if (!day) return false

    const res = await this.prismaService.goalDay.findFirst({
      where: {
        goal_id: goalId,
        day_id: day.id
      }
    })

    if (!res) return false
    return true
  }

}