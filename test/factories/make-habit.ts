import { UniqueEntityID } from "@/domain/core/unique-entity-id"
import { HabitProps, Habit } from "@/domain/habits/enterprise/entities/habit"
import { PrismaService } from "@/infra/database/prisma/prisma.service"
import { faker } from "@faker-js/faker"
import { Injectable } from "@nestjs/common"

export function makeHabit(
  override: Partial<HabitProps> = {},
  id?: UniqueEntityID,
) {
  const habit = Habit.create(
    {
      name: faker.lorem.text(),
      description: faker.lorem.text(),
      userId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return habit
}

@Injectable()
export class HabitFactory {
  constructor(private prismaService: PrismaService) { }

  async execute({ createdAt, description, id, name, updatedAt, userId, weekdays }: Habit) {
    const date = new Date(new Date().setUTCHours(0, 0, 0, 0))
    const hasDay = await this.prismaService.day.findUnique({ where: { date } })
    if (!hasDay) await this.prismaService.day.create({ data: { date } })
    await this.prismaService.habit.create({
      data: {
        description,
        name,
        createdAt,
        updatedAt,
        user_id: userId.toString(),
        id: id.toString()
      }
    })

    weekdays.getItems().map(async (i) => {
      await this.prismaService.habitWeekDays.create({
        data: {
          timeInSeconds: BigInt(Number(i.timeInSeconds)),
          week_day: i.weekday,
          createdAt: i.createdAt,
          habit_id: i.habitId.toString(),
          id: i.id.toString()
        }
      })
    })

  }
}