import { UniqueEntityID } from "@/domain/core/unique-entity-id";
import { Weekday } from "@/domain/habits/enterprise/entities/weekday";
import { HabitWeekDays as PrismaWeekday } from "@prisma/client";


export class PrismaWeekdayMapper {
  toDomain({ habit_id, id, week_day, timeInSeconds, createdAt }: PrismaWeekday): Weekday {
    return Weekday.create({
      timeInSeconds: Number(timeInSeconds),
      habitId: new UniqueEntityID(habit_id),
      weekday: week_day,
      createdAt
    }, new UniqueEntityID(id))
  }

  toPrisma(raw: Weekday): PrismaWeekday {
    return {
      habit_id: raw.habitId.toString(),
      id: raw.id.toString(),
      week_day: raw.weekday,
      timeInSeconds: BigInt(String(raw.timeInSeconds)),
      createdAt: raw.createdAt
    }
  }
}