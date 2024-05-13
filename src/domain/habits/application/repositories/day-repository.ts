import { Injectable } from "@nestjs/common";
import { Day } from "../../enterprise/entities/day";

@Injectable()
export abstract class DayRepository {
  abstract create(day: Day): Promise<void>
  abstract getByDate(date: Date): Promise<Day>
  abstract getByHabitAlreadyDone({ date , habitId} : { habitId: string, date : Date}): Promise<Boolean>
  abstract getByGoalAlreadyDone({ date , goalId} : { goalId: string, date : Date}): Promise<Boolean>
  abstract getById(id: string): Promise<Day>
  abstract update(day: Day): Promise<void>
}