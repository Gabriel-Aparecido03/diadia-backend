import { UniqueEntityID } from "@/domain/core/unique-entity-id";
import { Habit } from "@/domain/habits/enterprise/entities/habit";
import { Weekday } from "@/domain/habits/enterprise/entities/weekday";
import { WeekdayList } from "@/domain/habits/enterprise/entities/weekday-list";
import { Habit as PrismaHabit, HabitWeekDays as PrismaWeekdays , HabitDay as PrismaHabitDay } from "@prisma/client";


export interface RawWithDetailsInterface extends PrismaHabit {
  HabitWeekDays : PrismaWeekdays[],
  HabitDay ?: PrismaHabitDay[]
}



export class PrismaHabitMapper {
  toDomain({createdAt,description ,id ,name ,updatedAt ,user_id} : PrismaHabit) : Habit {
    return Habit.create({
      description,
      name ,
      userId: new UniqueEntityID(user_id),
      createdAt,
      updatedAt,
    },new UniqueEntityID(id))
  }

  toPrisma(raw : Habit) : PrismaHabit {
    return {
      createdAt : raw.createdAt,
      description : raw.description,
      id : raw.id.toString(),
      name : raw.name,
      updatedAt : raw.updatedAt,
      user_id : raw.userId.toString()
    }
  }

  toDomainWithWeekdaysAtHabitDay(raw : RawWithDetailsInterface) : Habit {

    const weekdays : Weekday[] = raw.HabitWeekDays.map(i => Weekday.create({
      timeInSeconds : Number(i.timeInSeconds),
      habitId : new UniqueEntityID(raw.id),
      weekday : i.week_day,
      createdAt : i.createdAt
    }))

    return Habit.create({
      description: raw.description,
      name : raw.name ,
      userId: new UniqueEntityID(raw.user_id),
      createdAt : raw.createdAt,
      updatedAt : raw.updatedAt,
      weekdays : new WeekdayList(weekdays)
    },new UniqueEntityID(raw.id))
  }
}