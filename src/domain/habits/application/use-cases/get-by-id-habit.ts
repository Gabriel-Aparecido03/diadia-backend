import { Injectable } from "@nestjs/common";
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

interface GetByIdHabitUseCasePropsType {
  userId: string
  habitId: string
}

@Injectable()
export class GetByIdHabitUseCase {

  constructor(
    private habitRepository: HabitRepository,
    private userRepository: UserRepository
  ) { }

  async execute({ userId, habitId }: GetByIdHabitUseCasePropsType) {

    const userExists = await this.userRepository.getById(userId)
    if (!userExists) throw new InvalidCredentials()

    const habit = await this.habitRepository.getById(habitId)
    if (!habit) throw new ResourceNotFound()

    if(!habit.userId.equals(userExists.id))throw new NotAllowed()

    return habit
  }
}