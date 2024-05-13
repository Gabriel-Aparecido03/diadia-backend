import { Injectable } from "@nestjs/common";
import { GoalRepository } from "../repositories/goal-repository";
import { UserRepository } from "../repositories/user-repository";
import { InvalidCredentials } from "./errors/invalid-credentials";
import { NotAllowed } from "./errors/not-allowed";
import { ResourceNotFound } from "./errors/resource-not-found";

interface UpdateGoalUseCasePropsType {
  userId: string
  goalId: string
  name: string
  description: string
}

@Injectable()
export class UpdateGoalUseCase {

  constructor(
    private goalRepository: GoalRepository,
    private userRepository: UserRepository
  ) { }

  async execute({ userId, goalId, description, name }: UpdateGoalUseCasePropsType) {

    const user = await this.userRepository.getById(userId)
    if (!user) throw new InvalidCredentials()

    const goal = await this.goalRepository.getById(goalId)
    if (!goal) throw new ResourceNotFound()

    if (!user.id.equals(goal.userId)) throw new NotAllowed()

    goal.description = description
    goal.name = name

    await this.goalRepository.update(goal)
  }
}