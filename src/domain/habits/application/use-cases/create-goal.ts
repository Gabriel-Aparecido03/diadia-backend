import { UniqueEntityID } from "@/domain/core/unique-entity-id";
import { Day } from "../../enterprise/entities/day";
import { Goal } from "../../enterprise/entities/goal";
import { DayRepository } from "../repositories/day-repository";
import { GoalRepository } from "../repositories/goal-repository";
import { UserRepository } from "../repositories/user-repository";
import { InvalidCredentials } from "./errors/invalid-credentials";
import { Injectable } from "@nestjs/common";

export interface CreateGoalUseCasePropsType {
  userId: string
  name: string
  description: string
  day: Date
}

@Injectable()
export class CreateGoalUseCase {

  constructor(
    private goalRepository: GoalRepository,
    private userRepository: UserRepository,
    private dayRepository: DayRepository
  ) { }

  async execute({ day, description, name, userId }: CreateGoalUseCasePropsType) {

    const userExists = await this.userRepository.getById(userId) 
    if (!userExists) throw new InvalidCredentials()

    let dayAtDatabase = await this.dayRepository.getByDate(day)

    if (!dayAtDatabase) {
      const auxDay = Day.create({ date : day, goals: [] })
      await this.dayRepository.create(auxDay)
      dayAtDatabase = auxDay
    }

    const goal = Goal.create({ description, name, userId: new UniqueEntityID(userId), deadline: dayAtDatabase , createdAt : day })
    await this.goalRepository.create(goal)
  }
}