import { Injectable } from "@nestjs/common";
import { HabitRepository } from "../repositories/habit-repository";
import { UserRepository } from "../repositories/user-repository";
import { InvalidCredentials } from "./errors/invalid-credentials";
import { ResourceNotFound } from "./errors/resource-not-found";
import { DayRepository } from "../repositories/day-repository";

interface FetchByDateHabitUseCasePropsType {
  userId: string
  date: Date
}

@Injectable()
export class FetchByDateHabitUseCase {

  constructor(
    private habitRepository: HabitRepository,
    private userRepository: UserRepository
  ) { }

  async execute({ userId, date }: FetchByDateHabitUseCasePropsType) {
    const userExists = await this.userRepository.getById(userId)
    if (!userExists) throw new InvalidCredentials()
    const habit = await this.habitRepository.fetchByDate({ date , userId })
    const habitsCompleted = await this.habitRepository.fetchByDateCompleted({ date , userId })
    return {
      possibleHabits : habit,
      completedHabits : habitsCompleted
    }
  }
}