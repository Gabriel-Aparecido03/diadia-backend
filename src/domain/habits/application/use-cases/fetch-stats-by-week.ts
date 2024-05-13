import { Injectable } from "@nestjs/common";
import { HabitRepository } from "../repositories/habit-repository";
import { UserRepository } from "../repositories/user-repository";
import { InvalidCredentials } from "./errors/invalid-credentials";

interface FetchStatsByWeekHabitsUseCasePropsType {
  userId: string
  date: Date
}

@Injectable()
export class FetchStatsByWeekhHabitsUseCase {

  constructor(
    private habitRepository: HabitRepository,
    private userRepository: UserRepository
  ) { }

  async execute({ userId, date }: FetchStatsByWeekHabitsUseCasePropsType) {

    var curr = new Date(date);
    curr.setHours(0)
    curr.setMinutes(0)
    curr.setSeconds(0)
    var start = new Date(curr.setDate(curr.getDate() - curr.getDay()));
    var end = new Date(curr.setDate(curr.getDate() - curr.getDay() + 6));

    const userExists = await this.userRepository.getById(userId)
    if (!userExists) throw new InvalidCredentials()

    let currentDay = start
    let allDates = []

    while (currentDay.getDate() !== end.getDate()) {
      currentDay.setDate(currentDay.getDate() + 1)

      const date = new Date(currentDay)

      const habit = await this.habitRepository.fetchByDate({ date, userId })
      const habitsCompleted = await this.habitRepository.fetchByDateCompleted({ date, userId })

      const object = {
        possibleHabits: habit,
        completedHabits: habitsCompleted,
        date
      }

      allDates.push(object)
    }

    return allDates
  }
}