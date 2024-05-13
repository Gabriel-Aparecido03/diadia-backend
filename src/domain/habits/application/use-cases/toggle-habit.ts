import { Injectable } from "@nestjs/common";
import { Day } from "../../enterprise/entities/day";
import { DayRepository } from "../repositories/day-repository";
import { HabitRepository } from "../repositories/habit-repository";
import { UserRepository } from "../repositories/user-repository";
import { InvalidCredentials } from "./errors/invalid-credentials";
import { NotAllowed } from "./errors/not-allowed";
import { ResourceNotFound } from "./errors/resource-not-found";
import { startOfTheDay } from "./utils/start-of-the-day";

interface ToogleHabitUseCasePropsType {
  userId: string
  habitId: string
}

@Injectable()
export class ToogleHabitUseCase {

  constructor(
    private habitRepository: HabitRepository,
    private userRepository: UserRepository,
    private dayRepository: DayRepository
  ) { }

  async execute({ userId, habitId }: ToogleHabitUseCasePropsType) {

    const date = startOfTheDay(new Date())

    const user = await this.userRepository.getById(userId)
    if (!user) throw new InvalidCredentials()

    const habit = await this.habitRepository.getById(habitId)
    if (!habit) throw new ResourceNotFound()

    if (!user.id.equals(habit.userId)) throw new NotAllowed()

    let day = await this.dayRepository.getByDate(new Date(date.toDateString()))
    if (!day) {
      day = Day.create({ date: new Date(date.toDateString()) })
      await this.dayRepository.create(day)
    }

    const habitIsAlreadyDone = await this.dayRepository.getByHabitAlreadyDone({ date, habitId })
    if (!habitIsAlreadyDone) {
      await this.habitRepository.makeHabitDone({ dayId : day.id.toString() , habitId})
    }

    else {
      await this.habitRepository.makeHabitNotDone({ dayId : day.id.toString() , habitId})
    }
  }
}