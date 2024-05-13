import { Inject, Injectable } from "@nestjs/common";
import { Day } from "../../enterprise/entities/day";
import { Habit } from "../../enterprise/entities/habit";
import { Weekday } from "../../enterprise/entities/weekday";
import { WeekdayList } from "../../enterprise/entities/weekday-list";
import { DayRepository } from "../repositories/day-repository";
import { HabitRepository } from "../repositories/habit-repository";
import { UserRepository } from "../repositories/user-repository";
import { WeekdayParamType } from "../types/weekday-param";
import { InvalidCredentials } from "./errors/invalid-credentials";
import { NotAllowed } from "./errors/not-allowed";
import { ResourceNotFound } from "./errors/resource-not-found";

interface DeleteHabitUseCasePropsType {
  userId: string
  habitId: string
}

@Injectable()
export class DeleteHabitUseCase {

  constructor(
    private habitRepository: HabitRepository,
    private userRepository: UserRepository
  ) { }

  async execute({ userId, habitId }: DeleteHabitUseCasePropsType) {

    const userExists = await this.userRepository.getById(userId)
    if (!userExists) throw new InvalidCredentials()

    const habitExits = await this.habitRepository.getById(habitId)
    if (!habitExits) throw new ResourceNotFound()

    if(!userExists.id.equals(habitExits.userId)) throw new NotAllowed()

    await this.habitRepository.delete(habitId)
  }
}