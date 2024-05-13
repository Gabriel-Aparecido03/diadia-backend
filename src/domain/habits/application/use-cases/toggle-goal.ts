import { Injectable } from "@nestjs/common";
import { Day } from "../../enterprise/entities/day";
import { DayRepository } from "../repositories/day-repository";
import { GoalRepository } from "../repositories/goal-repository";
import { UserRepository } from "../repositories/user-repository";
import { InvalidCredentials } from "./errors/invalid-credentials";
import { NotAllowed } from "./errors/not-allowed";
import { ResourceNotFound } from "./errors/resource-not-found";
import { startOfTheDay } from "./utils/start-of-the-day";

interface ToogleGoalUseCasePropsType {
  userId: string
  goalId: string
}

@Injectable()
export class ToogleGoalUseCase {

  constructor(
    private goalRepository: GoalRepository,
    private userRepository: UserRepository,
    private dayRepository: DayRepository
  ) { }

  async execute({ userId, goalId }: ToogleGoalUseCasePropsType) {

    const date = startOfTheDay(new Date())

    const user = await this.userRepository.getById(userId)
    if (!user) throw new InvalidCredentials()

    const goal = await this.goalRepository.getById(goalId)
    if (!goal) throw new ResourceNotFound()

    if (!user.id.equals(goal.userId)) throw new NotAllowed()

    let day = await this.dayRepository.getByDate(new Date(date.toDateString()))
    if (!day) {
      day = Day.create({ date: new Date(date.toDateString()) })
      await this.dayRepository.create(day)
    }

    const goalIsAlreadyDone = await this.dayRepository.getByGoalAlreadyDone({ date, goalId })
    if (!goalIsAlreadyDone) {
      await this.goalRepository.makeGoalDone({ dayId : day.id.toString() , goalId})
    }

    else {
      await this.goalRepository.makeGoalNotDone({ dayId : day.id.toString() , goalId})
    }
  }
}