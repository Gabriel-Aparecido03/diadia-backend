import { HabitRepository } from "@/domain/habits/application/repositories/habit-repository";
import { Habit } from "@/domain/habits/enterprise/entities/habit";
import { PrismaService } from "../prisma.service";
import { Injectable } from "@nestjs/common";
import { PrismaHabitMapper } from "../mapper/prisma-habit-mapper";

@Injectable()
export class PrismaHabitRepository implements HabitRepository {

  constructor(private prismaService: PrismaService) { }

  async create(habit: Habit): Promise<void> {
    const data = new PrismaHabitMapper().toPrisma(habit)
    await this.prismaService.habit.create({ data })

    habit.weekdays.getItems().map(async (i) => {
      await this.prismaService.habitWeekDays.create({
        data: {
          timeInSeconds: BigInt(String(i.timeInSeconds)),
          week_day: i.weekday,
          createdAt: i.createdAt,
          habit_id: habit.id.toString(),
          id: i.id.toString()
        }
      })
    })
  }

  async update(habit: Habit): Promise<void> {
    const data = new PrismaHabitMapper().toPrisma(habit)
    if (habit.weekdays.getNewItems().length > 0) {
      habit.weekdays.getNewItems().map(async (i) => {
        await this.prismaService.habitWeekDays.create({
          data: {
            timeInSeconds: BigInt(String(i.timeInSeconds)),
            week_day: i.weekday,
            createdAt: i.createdAt,
            habit_id: habit.id.toString(),
            id: i.id.toString()
          }
        })
      })
    }

    if (habit.weekdays.getRemovedItems().length > 0) {
      habit.weekdays.getRemovedItems().map(async (i) => {
        await this.prismaService.habitWeekDays.deleteMany({
          where: {
            habit_id: i.habitId.toString(),
            week_day: i.weekday
          }
        })
      })
    }

    await this.prismaService.habit.update({ data, where: { id: data.id } })
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.habit.delete({ where: { id } })
  }

  async getById(id: string): Promise<Habit> {

    const habit = await this.prismaService.habit.findUnique({
      where: {
        id
      },
      include: {
        HabitDay: true,
        HabitWeekDays: true
      }
    })

    if (!habit) return null
    return new PrismaHabitMapper().toDomainWithWeekdaysAtHabitDay(habit)
  }

  async fetchByDate({ date, userId }: { date: Date, userId: string }): Promise<Habit[]> {
    const dateFormat = new Date(date)
    const habits = await this.prismaService.habit.findMany({
      where: {
        createdAt: {
          lte: dateFormat,
        },
        user_id: userId,
        HabitWeekDays : {
          some : {
            week_day : dateFormat.getDay()
          }
        }
      },
      include: {
        HabitWeekDays: true
      },
    })
    return habits.map(i => new PrismaHabitMapper().toDomainWithWeekdaysAtHabitDay(i))
  }

  async fetchByDateCompleted({ date, userId }: { date: Date; userId: string; }): Promise<Habit[]> {
    const habits = await this.prismaService.habitDay.findMany({
      select: {
        habit: true
      },
      where: {
        habit: {
          user_id: userId,
        },
        day: { 
          date
        }
      }
    })
    return habits.map(i => new PrismaHabitMapper().toDomain(i.habit))
  }

  async fetchStatsByMonth({ start, end, userId }: { start: Date; end: Date; userId: string; }): Promise<Habit[]> {
    /* const habits = await this.prismaService.day.findMany({
      where: {
        date: {
          lte: end.toISOString(),
          gte: start.toISOString()
        },
        
      },
      include: {
        HabitDay: {
          include: { habit: true }
        },
      }
    })

    return res.map(i => new PrismaHabitMapper().toDomainWithWeekdaysAtHabitDay(i)) */

    /* const dates = await this.prismaService.habitDay.findMany({
      where: {
        day: {
          date: {
            lte: end.toISOString(),
            gte: start.toISOString()
          },
        }
      },
      include: {
        habit: true
      }
    })

    const habits = await this.prismaService.habit.findMany({
      where: {
        createdAt: {
          lte: end.toISOString(),
          gte: start.toISOString()
        }
      }
    })
*/

    return null
  }

  async makeHabitDone({ dayId, habitId }: { dayId: string; habitId: string; }): Promise<void> {
    await this.prismaService.habitDay.create({
      data: {
        day_id: dayId,
        habit_id: habitId
      }
    })
  }

  async makeHabitNotDone({ dayId, habitId }: { dayId: string; habitId: string; }): Promise<void> {
    await this.prismaService.habitDay.deleteMany({
      where: {
        day_id: dayId,
        habit_id: habitId
      }
    })
  }

}