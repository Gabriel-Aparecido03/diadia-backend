import { Injectable } from "@nestjs/common";
import { GoalRepository } from "../repositories/goal-repository";
import { UserRepository } from "../repositories/user-repository";
import { InvalidCredentials } from "./errors/invalid-credentials";
import { NotAllowed } from "./errors/not-allowed";
import { ResourceNotFound } from "./errors/resource-not-found";

interface DeleteGoalUseCasePropsType {
  userId: string
  goalId: string
}

@Injectable()
export class DeleteGoalUseCase {

  constructor(
    private goalRepository: GoalRepository,
    private userRepository: UserRepository
  ) { }

  async execute({ userId, goalId }: DeleteGoalUseCasePropsType) {

    const userExists = await this.userRepository.getById(userId)
    if (!userExists) throw new InvalidCredentials()

    const goalExits = await this.goalRepository.getById(goalId)
    if (!goalExits) throw new ResourceNotFound()

    if(!userExists.id.equals(goalExits.userId)) throw new NotAllowed()

    await this.goalRepository.delete(goalId)
  }
}