import { Injectable } from "@nestjs/common";
import { Habit } from "../../enterprise/entities/habit";

@Injectable()
export abstract class HabitRepository {
  abstract create(habit: Habit): Promise<void>
  abstract update(habit: Habit): Promise<void>
  abstract delete(id: string): Promise<void>
  abstract getById(id: string): Promise<Habit>
  abstract fetchByDate({ date, userId }: { date: Date, userId: string }): Promise<Habit[]>
  abstract fetchByDateCompleted({ date, userId }: { date: Date, userId: string }): Promise<Habit[]>
  abstract fetchStatsByMonth({ start, end, userId }: { start: Date, end: Date, userId: string }): Promise<Habit[]>
  abstract makeHabitDone({ dayId, habitId }: { dayId: string, habitId: string }) : Promise<void>
  abstract makeHabitNotDone({ dayId, habitId }: { dayId: string, habitId: string }) : Promise<void>
}