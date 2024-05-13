import { Habit } from "../../../domain/habits/enterprise/entities/habit";

export class HabitPresenter {
  toHttp({ createdAt, description, id, name, updatedAt, userId, weekdays }: Habit) {
    return {
      id : id.toString(),
      name,
      description,
      createdAt,
      updatedAt,
      userId : userId.toString(),
      weekdays : weekdays.getItems().map( i => {
        return {
          weekday : i.weekday,
          timeInSeconds : i.timeInSeconds,
        }
      })
    }
  }
}