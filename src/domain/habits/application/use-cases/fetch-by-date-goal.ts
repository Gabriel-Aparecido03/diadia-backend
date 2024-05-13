import { Injectable } from "@nestjs/common";
import { GoalRepository } from "../repositories/goal-repository";
import { UserRepository } from "../repositories/user-repository";
import { InvalidCredentials } from "./errors/invalid-credentials";
import { ResourceNotFound } from "./errors/resource-not-found";
import { DayRepository } from "../repositories/day-repository";

interface FetchByDateGoalUseCasePropsType {
  userId: string
  date: Date
}

@Injectable()
export class FetchByDateGoalUseCase {

  constructor(
    private goalRepository: GoalRepository,
    private userRepository: UserRepository
  ) { }

  async execute({ userId, date }: FetchByDateGoalUseCasePropsType) {
    const userExists = await this.userRepository.getById(userId)
    if (!userExists) throw new InvalidCredentials()
    const goal = await this.goalRepository.fetchByDate({ date , userId })
    const goalsCompleted = await this.goalRepository.fetchByDateCompleted({ date , userId })
    return {
      possibleGoals : goal,
      completedGoals : goalsCompleted
    }
  }
}