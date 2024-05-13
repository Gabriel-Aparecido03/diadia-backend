import { Injectable } from "@nestjs/common";
import { GoalRepository } from "../repositories/goal-repository";
import { UserRepository } from "../repositories/user-repository";
import { InvalidCredentials } from "./errors/invalid-credentials";
import { NotAllowed } from "./errors/not-allowed";
import { ResourceNotFound } from "./errors/resource-not-found";

interface GetByIdGoalUseCasePropsType {
  userId: string
  goalId: string
}

@Injectable()
export class GetByIdGoalUseCase {

  constructor(
    private goalRepository: GoalRepository,
    private userRepository: UserRepository
  ) { }

  async execute({ userId, goalId }: GetByIdGoalUseCasePropsType) {

    const userExists = await this.userRepository.getById(userId)
    if (!userExists) throw new InvalidCredentials()

    const goal = await this.goalRepository.getById(goalId)
    if (!goal) throw new ResourceNotFound()

    if(!goal.userId.equals(userExists.id))throw new NotAllowed()

    return goal
  }
}