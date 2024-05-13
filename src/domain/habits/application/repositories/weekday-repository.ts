import { Weekday } from "../../enterprise/entities/weekday";

export abstract class WeekdayRepository {
  abstract create(weekday: Weekday): Promise<void>
  abstract update(weekday: Weekday): Promise<void>
  abstract delete(id: string): Promise<void>
  abstract getById(id: string): Promise<Weekday>
}