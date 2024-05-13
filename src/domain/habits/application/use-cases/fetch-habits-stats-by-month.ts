import { Injectable } from "@nestjs/common";
import { HabitRepository } from "../repositories/habit-repository";
import { UserRepository } from "../repositories/user-repository";
import { InvalidCredentials } from "./errors/invalid-credentials";

interface FetchStatsByMonthHabitsUseCasePropsType {
  userId: string
  date: Date
}

@Injectable()
export class FetchStatsByMonthHabitsUseCase {

  constructor(
    private habitRepository: HabitRepository,
    private userRepository: UserRepository
  ) { }

  async execute({ userId, date }: FetchStatsByMonthHabitsUseCasePropsType) {

    var start = new Date(date.getFullYear(), date.getMonth(), 0);
    var end = new Date(date.getFullYear(), date.getMonth() + 1, 0);

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